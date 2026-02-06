# Knowledge Base Document Template

Use this template to create new documents for the RAG chatbot knowledge base.

## Document Structure

```json
{
  "content": "Your document content here...",
  "metadata": {
    "source": "Document Title",
    "category": "category_name",
    "priority": "high|medium|low",
    "tags": ["tag1", "tag2"]
  }
}
```

## Categories

- `core_framework` - ALGEE, core MHFA concepts
- `crisis_response` - Crisis intervention, emergency protocols
- `mental_health_info` - Information about conditions
- `communication` - Communication techniques, listening skills
- `certification` - Training, certification requirements
- `help` - Platform usage, app help
- `procedures` - Step-by-step procedures
- `resources` - External resources, hotlines

## Document Templates by Type

### 1. Procedure Document

```json
{
  "content": "[Procedure Name]\n\nPurpose:\nBrief description of when and why to use this procedure.\n\nPrerequisites:\n- Required training or knowledge\n- Tools or resources needed\n\nStep-by-Step Instructions:\n1. First step with clear action\n2. Second step with details\n3. Continue with numbered steps\n\nImportant Notes:\n- Critical warnings or considerations\n- Common mistakes to avoid\n\nWhen to Escalate:\n- Situations requiring professional help\n- Red flags to watch for\n\nFollow-Up:\n- Actions after procedure completion\n- Documentation requirements",
  "metadata": {
    "source": "Procedure: [Name]",
    "category": "procedures",
    "priority": "high"
  }
}
```

### 2. Informational Document

```json
{
  "content": "[Topic Name]\n\nOverview:\nBrief introduction to the topic.\n\nKey Points:\n- Important fact or concept\n- Another key point\n- Supporting information\n\nSigns and Symptoms (if applicable):\n- Observable indicator 1\n- Observable indicator 2\n\nBest Practices:\n- Recommended approach 1\n- Recommended approach 2\n\nRelated Topics:\n- Connection to other concepts\n- See also: related documents",
  "metadata": {
    "source": "[Topic Name]",
    "category": "mental_health_info",
    "priority": "medium"
  }
}
```

### 3. Crisis Protocol

```json
{
  "content": "[Crisis Type] Response Protocol\n\n⚠️ IMMEDIATE ACTIONS:\n1. Stay calm and present\n2. Ensure immediate safety\n3. Call emergency services if: [specific conditions]\n\nWarning Signs:\n- Critical indicator 1\n- Critical indicator 2\n- Critical indicator 3\n\nDO:\n- Action to take\n- Supportive statement to use\n- Resource to offer\n\nDON'T:\n- Action to avoid\n- Statement that could escalate\n- Approach that may harm\n\nEmergency Contacts:\n- Emergency Services: [Number]\n- Crisis Hotline: [Number]\n- [Other relevant contacts]\n\nAfter the Crisis:\n1. Document the incident\n2. Follow up within 24 hours\n3. Connect to ongoing support\n4. Debrief with supervisor",
  "metadata": {
    "source": "Crisis: [Type] Response",
    "category": "crisis_response",
    "priority": "critical"
  }
}
```

### 4. Communication Guide

```json
{
  "content": "Communicating About [Topic]\n\nWhy It Matters:\nBrief explanation of communication importance.\n\nOpening the Conversation:\n- Suggested opening statement 1\n- Suggested opening statement 2\n- Non-verbal approach tips\n\nActive Listening Techniques:\n- Technique 1: How to do it and why\n- Technique 2: How to do it and why\n\nHelpful Responses:\n✓ "Example of validating response"\n✓ "Example of empathetic response"\n✓ "Example of supportive question"\n\nResponses to Avoid:\n✗ "Example of minimizing statement"\n✗ "Example of judgmental statement"\n✗ "Example of dismissive response"\n\nCultural Considerations:\n- Awareness point 1\n- Awareness point 2\n\nPractice Scenario:\nSituation: [Brief scenario]\nYour Response: [Guided response framework]",
  "metadata": {
    "source": "Communication: [Topic]",
    "category": "communication",
    "priority": "high"
  }
}
```

### 5. FAQ Entry

```json
{
  "content": "Q: [Frequently asked question]?\n\nA: [Clear, concise answer]\n\nAdditional Context:\n[More detailed explanation if needed]\n\nRelated Questions:\n- Related FAQ 1\n- Related FAQ 2\n\nSee Also:\n- [Link to related document]",
  "metadata": {
    "source": "FAQ: [Topic]",
    "category": "help",
    "priority": "medium"
  }
}
```

## Sample Documents

### Sample: De-escalation Techniques

```json
{
  "content": "De-escalation Techniques for Youth in Distress\n\nPurpose:\nTo safely calm an agitated or distressed young person and prevent escalation to crisis.\n\nRecognizing Escalation Signs:\n- Raised voice or rapid speech\n- Clenched fists or tense posture\n- Pacing or restless movements\n- Verbal threats or profanity\n- Withdrawal or refusal to communicate\n\nDe-escalation Steps:\n\n1. CREATE SPACE\n   - Ensure safety of all present\n   - Reduce audience if possible\n   - Maintain exit access\n   - Keep appropriate distance\n\n2. STAY CALM\n   - Monitor your own breathing\n   - Keep voice low and steady\n   - Maintain open body language\n   - Avoid sudden movements\n\n3. VALIDATE FEELINGS\n   - "I can see you're really upset"\n   - "This situation is frustrating"\n   - "Your feelings are understandable"\n   - Avoid arguing or correcting\n\n4. LISTEN ACTIVELY\n   - Give full attention\n   - Don't interrupt\n   - Reflect back what you hear\n   - Ask clarifying questions\n\n5. OFFER CHOICES\n   - "Would you like to sit down or walk?"\n   - "Do you want to talk here or somewhere quieter?"\n   - "Would you like some water?"\n   - Choices restore sense of control\n\n6. SET BOUNDARIES\n   - Be clear about acceptable behavior\n   - "I'm here to help, but I need you to not shout"\n   - Follow through consistently\n   - Focus on behavior, not character\n\nPhrases That Help:\n- "I'm here to support you"\n- "Let's figure this out together"\n- "Take your time"\n- "What do you need right now?"\n- "You're safe here"\n\nPhrases to Avoid:\n- "Calm down" or "Relax"\n- "It's not that bad"\n- "You're overreacting"\n- "If you don't stop..."\n- "Why can't you just..."\n\nWhen De-escalation Isn't Working:\n- If safety is compromised, call for help\n- Involve supervisor or crisis team\n- Consider removing to safe space\n- Document incident thoroughly\n\nFollow-Up:\n- Check in after the person is calm\n- Discuss what helped/would help next time\n- Develop crisis plan together\n- Connect to ongoing support",
  "metadata": {
    "source": "De-escalation Techniques",
    "category": "procedures",
    "priority": "high"
  }
}
```

### Sample: Self-Care for First Aiders

```json
{
  "content": "Self-Care for Youth Mental Health First Aiders\n\nWhy Self-Care Matters:\nSupporting young people through mental health challenges can be emotionally demanding. Regular self-care prevents burnout and maintains your effectiveness as a first aider.\n\nSigns You Need Self-Care:\n- Feeling emotionally drained after conversations\n- Difficulty sleeping or concentrating\n- Increased irritability or anxiety\n- Avoiding interactions with youth\n- Physical symptoms (headaches, fatigue)\n- Cynicism about helping\n\nPhysical Self-Care:\n- Maintain regular sleep schedule\n- Exercise regularly\n- Eat nutritious meals\n- Take breaks during work\n- Get outdoors daily\n\nEmotional Self-Care:\n- Practice mindfulness or meditation\n- Journal about your experiences\n- Engage in enjoyable hobbies\n- Listen to music or create art\n- Allow yourself to feel emotions\n\nSocial Self-Care:\n- Connect with supportive colleagues\n- Spend time with friends and family\n- Join peer support groups\n- Seek supervision or consultation\n- Set boundaries with work\n\nProfessional Self-Care:\n- Attend regular supervision\n- Pursue ongoing training\n- Know your scope of practice\n- Refer when appropriate\n- Document challenging cases\n\nDebriefing After Difficult Interactions:\n1. Acknowledge the emotional impact\n2. Talk to a supervisor or peer\n3. Process what went well\n4. Identify learning points\n5. Let go of what you couldn't control\n\nSetting Boundaries:\n- Know your limits and honor them\n- Don't take work home emotionally\n- Maintain confidentiality appropriately\n- Say no when necessary\n- Protect personal time\n\nWhen to Seek Help:\nIf self-care isn't enough, consider:\n- Counseling or therapy\n- Employee assistance programs\n- Peer support networks\n- Reduced caseload temporarily\n- Additional training\n\nRemember:\nYou can't pour from an empty cup. Taking care of yourself enables you to better care for others.",
  "metadata": {
    "source": "Self-Care Guide",
    "category": "mental_health_info",
    "priority": "medium"
  }
}
```

## Adding Documents to the Knowledge Base

### Method 1: Direct Edit in n8n

1. Open the RAG chatbot workflow in n8n
2. Find the workflow data section
3. Add your JSON document to the `knowledgeBaseDocuments` array
4. Save and re-populate the vector store

### Method 2: Using a Separate Workflow

1. Create a new workflow with a Manual Trigger
2. Add your documents in a Set node
3. Connect to the Vector Store in Insert mode
4. Run once to add documents

### Method 3: Via API (Advanced)

```javascript
// Example: Adding document via n8n API
const response = await fetch('https://your-n8n-instance/webhook/add-kb-doc', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: "Your document content",
    metadata: { source: "Title", category: "procedures" }
  })
});
```

## Best Practices

1. **Keep documents focused** - One main topic per document
2. **Use clear headings** - Helps with retrieval accuracy
3. **Include keywords** - Think about how users will ask
4. **Maintain consistency** - Similar structure across documents
5. **Review regularly** - Update outdated information
6. **Test queries** - Verify documents are retrieved appropriately
7. **Tag properly** - Use consistent categories and priorities

## Testing New Documents

After adding documents:

1. Save and re-populate the vector store
2. Test with relevant queries:
   - Direct questions
   - Related questions
   - Edge cases
3. Check response quality
4. Adjust document content if needed
5. Monitor user queries for gaps
