# Knowledge Base Documents

This directory contains source documents for the RAG chatbot.

## Where Documents Actually Live

**Important**: These files are for **organization/reference only**. The RAG chatbot uses an **in-memory Vector Store in n8n**, not files in this repo.

## How to Add Documents to the RAG Chatbot

### Option 1: Direct in n8n (Recommended)

1. Open n8n workflow: https://n8n-production-a007.up.railway.app
2. Find the **"Knowledge Base Documents"** node (or Code node with documents)
3. Edit the JSON array directly
4. Re-populate the Vector Store

### Option 2: Use This Directory + Import Script

1. Create/edit `.json` or `.md` files in this directory
2. Use a manual workflow in n8n to bulk import them
3. Or copy-paste content into the n8n document node

## Document Format

```json
{
  "content": "Your document text here...",
  "metadata": {
    "source": "Document Title",
    "category": "procedures|crisis_response|mental_health_info|communication|help",
    "priority": "critical|high|medium|low"
  }
}
```

## File Naming Convention

- `01-algee-framework.md` - Core framework docs
- `02-crisis-[type].md` - Crisis protocols
- `03-procedure-[name].md` - Step-by-step procedures
- `04-communication-[topic].md` - Communication guides
- `05-faq-[topic].md` - FAQ entries

## Categories

| Category | Description |
|----------|-------------|
| `core_framework` | ALGEE, MHFA principles |
| `crisis_response` | Emergency protocols |
| `mental_health_info` | Conditions, symptoms |
| `communication` | Listening techniques |
| `procedures` | Step-by-step guides |
| `help` | Platform usage |
| `resources` | Hotlines, contacts |

## Example Files

See `examples/` subdirectory for templates.
