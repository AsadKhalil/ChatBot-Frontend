export const suggestionChat = [
  { id: 1, suggestion: "Do we have experience in HubSpot?" },
  {
    id: 2,
    suggestion:
      "Give a summarized overview of all the work we have done in the services sector. Return a single paragraph.",
  },
  { id: 3, suggestion: "Have we made CRMs for the Healthcare industry?" },
  {
    id: 4,
    suggestion:
      "What work have done in Fintech? Please mention the total count. Also list each project's name",
  },
  {
    id: 5,
    suggestion:
      "Do we have the expertise needed to integrate multi vendor payment solutions?",
  },
  { id: 6, suggestion: "Do we provide cloud data migration services?" },
];

export const historyData = [
  { id: 1, chat: "Tell me about projects that were not escalated" },
  { id: 2, chat: "Summery for our recent food & Beverage related projects" },
  { id: 3, chat: "List recent fintech related projects " },
];

export const llmOptions = [
  { value: "gpt-3.5-turbo-0125", label: "gpt-3.5-turbo" },
  { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  { value: "gpt-4o", label: "gpt-4o" },
  { value: "meta.llama3-1-405b-instruct-v1:0", label: "Llama-3.1-405b" },
  { value: "meta.llama3-1-70b-instruct-v1:0", label: "Llama-3.1-70b" },
];
export const ToneOptions = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "neutral", label: "Neutral" },
  { value: "friendly", label: "Friendly" },
  { value: "direct", label: "Direct" },
  { value: "informational", label: "Informational" },
  { value: "empathetic", label: "Empathetic" },
  { value: "sarcastic", label: "Sarcastic" },
  { value: "assertive", label: "Assertive" },
];
export const LengthOptions = [
  { value: "concise (1-2 lines)", label: "Concise (1 paragraph)" },
  { value: "normal (4-5 lines)", label: "Normal (2-3 paragraphs)" },
  { value: "detail (8-10 lines)", label: "Detail (upto 5 paragraphs)" },
];

export const routePermissions: { [key: string]: string[] } = {
  "/chat": ["Employee", "Admin"],
  "/shapeAgent": ["Admin"],
  "/analytics": ["Admin"],
  "/createkb": ["Admin"],
  "/data-management": ["Admin"],
  "/user-management": ["Admin"],
};
