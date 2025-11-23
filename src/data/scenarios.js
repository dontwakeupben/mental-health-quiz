const API_KEY = ""; // NOTE: In a real app, this goes in a .env file (import.meta.env.VITE_API_KEY)


export const INITIAL_SCENARIOS = [
  {
    id: 1,
    category: "Academic Pressure & Burnout",
    context: "A 16-year-old honors student has stopped handing in homework and looks exhausted.",
    dialogue: "I can't do it anymore. If I don't get an A on this final, my parents will be crushed, and I won't get into a good college. My life will be over before it starts.",
    idealResponse: "Validate the immense pressure they feel. De-escalate the catastrophic thinking ('life is over') without being dismissive. Encourage a break."
  },
  {
    id: 2,
    category: "Social Media & Cyberbullying",
    context: "A 14-year-old student is hiding in the bathroom during lunch, refusing to come out.",
    dialogue: "You didn't see the group chat. Everyone is laughing at me. They posted that photo and now literally everyone in school knows. I can never show my face again.",
    idealResponse: "Acknowledge the pain of public humiliation. Reassure them they are safe with you now. Do not minimize the online event ('it's just the internet')."
  },
  {
    id: 3,
    category: "Self-Harm & Isolation",
    context: "You notice fresh scratches on a student's arm, which they quickly pull their sleeve over.",
    dialogue: "It's nothing, okay? Just leave me alone. It helps me focus when things get too loud in my head. Please don't tell my mom, she'll freak out.",
    idealResponse: "Express concern for their safety gently. Do not promise secrecy (due to safety risks) but explain you want to support them in finding safer coping mechanisms."
  },
  {
    id: 4,
    category: "Risky Behavior",
    context: "A 17-year-old peer is acting erratic at a weekend gathering.",
    dialogue: "I feel infinite right now! I'm gonna take my brother's car and drive to the coast. Who cares if I don't have a license? You're being such a buzzkill!",
    idealResponse: "Remain calm but firm on safety. Do not argue logically with the 'high' but try to delay the action or distract them. Ensure keys are not accessible."
  },
  {
    id: 5,
    category: "Distrust of Adults",
    context: "A student is sent to you because they were sleeping in class, but they are defensive.",
    dialogue: "I'm not talking to you. You're just like the rest of the teachers—you just want to get me in trouble or fix me. I don't need 'help'.",
    idealResponse: "Build rapport first. Validate their frustration with the system. Clarify your role is to listen, not punish. Give them control over the conversation."
  }
];

export const SYSTEM_PROMPT = `
You are a Youth Mental Health First Aid Certification Evaluator. 
Your role is to score a user's textual response to a scenario involving an adolescent (12-18 years old) out of 20 points.

Criteria for scoring:
1. Age-Appropriateness (0-8 points): Does the user speak on the youth's level without being condescending or using overly clinical jargon? Do they build trust?
2. Safety & Reporting (0-6 points): Does the user identify risks (self-harm, reckless behavior) and handle the "secret-keeping" dynamic correctly (i.e., not promising total secrecy if safety is at risk)?
3. Empathy & Validation (0-6 points): Does the user validate the teen's specific struggles (school, social media, parents) seriously?

Return strictly valid JSON with this structure:
{
  "score": number, // integer 0-20
  "feedback": string, // 1-2 sentences explaining the score, specifically referencing youth communication techniques.
  "pass": boolean // true if score >= 15
}
Do not include markdown formatting like \`\`\`json. Just the raw JSON object.
`;