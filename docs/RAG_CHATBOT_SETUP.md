# RAG Knowledge Base Chatbot Setup Guide

This guide explains how to set up and configure the RAG (Retrieval-Augmented Generation) chatbot for Youth Mental Health First Aid knowledge assistance.

## Overview

The RAG chatbot provides instant answers to user questions about:
- Youth Mental Health First Aid (MHFA) procedures
- ALGEE action plan framework
- Crisis intervention protocols
- Mental health information for youth
- Communication techniques
- Platform usage help

## Architecture

```
User Question → Frontend → Vercel Proxy → n8n Webhook → AI Agent
                                                   ↓
                                           Vector Store (In-Memory)
                                                   ↓
                                           Google Gemini Embeddings
                                                   ↓
                                           Google Gemini Chat → Response
```

## Components

### 1. n8n Workflow (`n8n-workflows/rag-chatbot-workflow.json`)

**Nodes:**
- **Webhook Trigger**: Receives POST requests at `/webhook/rag-chat`
- **Parse Input**: Extracts message and session ID from request
- **AI Agent**: Routes queries and manages conversation flow
- **Google Gemini Chat**: Generates responses using Gemini 2.0 Flash
- **Vector Store Tool**: Retrieves relevant documents
- **Simple Vector Store**: In-memory storage for knowledge base
- **Google Gemini Embeddings**: Creates embeddings for document retrieval
- **Conversation Memory**: Maintains chat history per session
- **Respond to Webhook**: Returns JSON response to frontend

### 2. Frontend Component (`src/components/FloatingChatbot.jsx`)

**Features:**
- Floating button in bottom-right corner
- Collapsible chat window
- Message history with user/bot distinction
- Suggested questions for quick start
- Loading indicators
- Clear chat functionality
- Unread message badges
- Keyboard shortcuts (Enter to send)

### 3. Vercel Proxy (`api/rag-chat-proxy.js`)

- Handles CORS for frontend requests
- Forwards requests to n8n webhook
- Error handling and logging

## Setup Instructions

### Step 1: Import n8n Workflow

1. Open your n8n instance (https://n8n-production-a007.up.railway.app)
2. Go to **Workflows** → **Import from File**
3. Select `n8n-workflows/rag-chatbot-workflow.json`
4. The workflow will be imported with all nodes pre-configured

### Step 2: Configure Credentials

You need to set up **Google Gemini API** credentials:

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. In n8n, go to **Settings** → **Credentials**
3. Click **Add Credential**
4. Select **Google Gemini API**
5. Enter your API key and save
6. Update the credential ID in the workflow nodes:
   - Open the "Google Gemini Chat" node
   - Select your credential from the dropdown
   - Repeat for "Google Gemini Embeddings" node

### Step 3: Configure Knowledge Base

The workflow includes a built-in knowledge base with documents about:
- ALGEE action plan
- Crisis intervention protocols
- Common mental health concerns
- Communication techniques
- Platform usage help
- Certification requirements

**To customize the knowledge base:**

1. In the n8n workflow, find the workflow JSON data section
2. Locate the `knowledgeBaseDocuments` array
3. Edit existing documents or add new ones:

```json
{
  "content": "Your document content here...",
  "metadata": {
    "source": "Document Title",
    "category": "category_name",
    "priority": "high|medium|low"
  }
}
```

### Step 4: Populate the Vector Store

**Important**: The Simple Vector Store is in-memory and resets when n8n restarts.

To populate it:

1. Add a **Manual Trigger** node to your workflow
2. Connect it to a **Code** node that processes your documents:

```javascript
// Code node to populate vector store
const documents = [
  // Your documents here
];

return documents.map(doc => ({
  json: {
    pageContent: doc.content,
    metadata: doc.metadata
  }
}));
```

3. Connect the Code node to a **Simple Vector Store** node in "Insert" mode
4. Run the workflow once to populate the store
5. Remove or disable the manual trigger path for production

### Step 5: Save and Activate

1. Save the workflow
2. Click **Activate** to enable the webhook
3. Copy the webhook URL (should be `.../webhook/rag-chat`)

### Step 6: Update Vercel Proxy (if URL changed)

If your n8n instance URL is different, update `api/rag-chat-proxy.js`:

```javascript
const n8nRagUrl = "YOUR_N8N_WEBHOOK_URL";
```

### Step 7: Deploy

1. Push changes to your repository
2. Vercel will automatically deploy
3. The chatbot will be available on all app screens

## Usage

### For Users

1. Click the **"MHFA Help"** button in the bottom-right corner
2. Type your question or click a suggested question
3. Receive instant answers from the knowledge base
4. Continue the conversation for follow-up questions

### For Developers

**API Endpoint:**
```
POST /webhook/rag-chat
Content-Type: application/json

{
  "sessionId": "unique-session-id",
  "message": "What is the ALGEE framework?",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "reply": "ALGEE is the five-step action plan for Mental Health First Aid...",
  "sources": ["ALGEE Action Plan"],
  "timestamp": "2024-01-01T00:00:01Z"
}
```

## Customization

### Changing the System Prompt

Edit the **MHFA Knowledge Agent** node's system message:

```
You are a knowledgeable Youth MHFA assistant...
[Customize personality and guidelines]
```

### Adding More Documents

1. Edit the `knowledgeBaseDocuments` in the workflow JSON
2. Re-populate the vector store
3. Test with relevant queries

### Styling the Chatbot

Edit `src/components/FloatingChatbot.jsx`:
- Colors: Update Tailwind classes (e.g., `bg-indigo-600`)
- Size: Modify width/height classes
- Icons: Replace Lucide icons

### Upgrading to Persistent Storage

To use Pinecone instead of Simple Vector Store:

1. Create a Pinecone account and index
2. Replace "Simple Vector Store" with "Pinecone Vector Store"
3. Configure your Pinecone credentials
4. Re-populate the knowledge base

## Troubleshooting

### Chatbot shows "Unable to connect"

1. Check n8n workflow is activated
2. Verify webhook URL in `api/rag-chat-proxy.js`
3. Check Vercel logs for errors
4. Test webhook directly with curl:

```bash
curl -X POST https://your-n8n-instance/webhook/rag-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"123"}'
```

### Responses are not relevant

1. Check knowledge base documents are populated
2. Verify embeddings are working (check n8n execution logs)
3. Adjust the similarity threshold in the Vector Store node
4. Add more specific documents

### Slow responses

1. Consider upgrading to Gemini 2.0 Flash (already configured)
2. Reduce knowledge base document size
3. Use Pinecone for faster retrieval
4. Enable response caching if appropriate

### Vector store resets

This is expected with Simple Vector Store. Solutions:
- Schedule regular re-population
- Upgrade to Pinecone
- Use a database-backed vector store

## Security Considerations

- **API Keys**: Keep Google Gemini API key secure in n8n credentials
- **Rate Limiting**: Consider adding rate limiting to prevent abuse
- **Content Filtering**: Review knowledge base for sensitive content
- **Privacy**: Don't log personally identifiable information

## Maintenance

**Regular Tasks:**
- Review conversation logs for unanswered questions
- Update knowledge base with new information
- Monitor API usage and costs
- Test periodically after n8n updates

**Updating Knowledge Base:**
1. Deactivate workflow
2. Update documents in workflow
3. Clear and re-populate vector store
4. Reactivate workflow
5. Test thoroughly

## Support

For issues with:
- **n8n workflow**: Check n8n community forums
- **Frontend component**: Check React/Tailwind documentation
- **RAG concepts**: Review LangChain documentation

## Resources

- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [n8n Documentation](https://docs.n8n.io/)
- [LangChain RAG Guide](https://js.langchain.com/docs/use_cases/question_answering/)
- [Youth MHFA Official Site](https://www.mentalhealthfirstaid.org/)
