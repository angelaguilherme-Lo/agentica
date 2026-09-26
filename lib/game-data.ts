export type FamilyId =
  | "intelligence"
  | "knowledge"
  | "memory"
  | "tools"
  | "agency"
  | "collaboration"
  | "safety"
  | "evaluation";

export type ElementCard = {
  id: string;
  symbol: string;
  name: string;
  family: FamilyId;
  number: number;
  short: string;
  power: string;
  risk: string;
  quote: string;
};

export type Mission = {
  id: string;
  title: string;
  kicker: string;
  brief: string;
  objective: string;
  scenario: string;
  mustHave: string[];
  helpful: string[];
  breakCard: {
    title: string;
    description: string;
    causedBy: string[];
  };
};

export const FAMILY_META: Record<FamilyId, { label: string; tag: string; description: string }> = {
  intelligence: { label: "Intelligence", tag: "THINK", description: "Reason, plan and reflect." },
  knowledge: { label: "Knowledge", tag: "KNOW", description: "Ground decisions in external information." },
  memory: { label: "Memory", tag: "REMEMBER", description: "Carry useful context across steps and sessions." },
  tools: { label: "Tools", tag: "ACT", description: "Reach software, services and the outside world." },
  agency: { label: "Agency", tag: "PURSUE", description: "Turn goals into repeated decisions and actions." },
  collaboration: { label: "Collaboration", tag: "TEAM", description: "Coordinate specialists, supervisors and handoffs." },
  safety: { label: "Safety", tag: "PROTECT", description: "Limit damage, permissions and risky actions." },
  evaluation: { label: "Evaluation", tag: "VERIFY", description: "Measure quality, trace behavior and catch failure." },
};

export const ELEMENTS: ElementCard[] = [
  { id: "llm", symbol: "Lm", name: "Language Model", family: "intelligence", number: 1, short: "Generates and interprets language.", power: "Turns context into useful reasoning and responses.", risk: "Can sound certain while being wrong.", quote: "I have a theory. Several, actually." },
  { id: "reasoning", symbol: "Rs", name: "Reasoning", family: "intelligence", number: 2, short: "Works through complex decisions.", power: "Improves multi-step analysis and choice-making.", risk: "Longer reasoning can still start from bad assumptions.", quote: "Give me the messy part." },
  { id: "planning", symbol: "Pl", name: "Planning", family: "intelligence", number: 3, short: "Breaks goals into ordered steps.", power: "Creates an executable route from intent to outcome.", risk: "Plans can become brittle when the world changes.", quote: "Nobody moves until I draw the map." },
  { id: "reflection", symbol: "Rf", name: "Reflection", family: "intelligence", number: 4, short: "Reviews its own output or behavior.", power: "Finds mistakes before the next step.", risk: "Can waste time if reflection loops never stop.", quote: "Hold it. Something smells algorithmic." },

  { id: "rag", symbol: "Rg", name: "RAG", family: "knowledge", number: 5, short: "Retrieves evidence before generation.", power: "Grounds answers in selected external sources.", risk: "Poor retrieval produces confidently grounded nonsense.", quote: "I brought receipts." },
  { id: "embeddings", symbol: "Em", name: "Embeddings", family: "knowledge", number: 6, short: "Represents meaning as vectors.", power: "Enables semantic search and similarity matching.", risk: "Similarity is not the same as truth or relevance.", quote: "These two ideas know each other." },
  { id: "search", symbol: "Sr", name: "Search", family: "knowledge", number: 7, short: "Finds current or indexed information.", power: "Extends the agent beyond static model knowledge.", risk: "Sources can be stale, weak or manipulated.", quote: "I know a shortcut to the evidence." },
  { id: "vector-db", symbol: "Vd", name: "Vector DB", family: "knowledge", number: 8, short: "Stores and retrieves vectorized knowledge.", power: "Makes large knowledge collections searchable by meaning.", risk: "Bad chunking and metadata quietly ruin retrieval.", quote: "Everything is filed. Mostly." },

  { id: "short-memory", symbol: "Sm", name: "Short Memory", family: "memory", number: 9, short: "Keeps recent working context.", power: "Maintains continuity across nearby actions.", risk: "Important context can fall out of the window.", quote: "I remember the last five minutes. Luxury." },
  { id: "long-memory", symbol: "Lm+", name: "Long Memory", family: "memory", number: 10, short: "Stores durable facts and preferences.", power: "Personalizes future work and avoids repetition.", risk: "Can retain data that should not be retained.", quote: "We've definitely met before." },
  { id: "context", symbol: "Cx", name: "Context", family: "memory", number: 11, short: "Supplies the information relevant right now.", power: "Frames the model's immediate decision space.", risk: "Too much context can bury the signal.", quote: "Before you answer, read the room." },
  { id: "episodic", symbol: "Ep", name: "Episodic Memory", family: "memory", number: 12, short: "Remembers past events and outcomes.", power: "Lets an agent learn from what happened previously.", risk: "Past experience may not fit the new situation.", quote: "Last time we tried that, the server cried." },

  { id: "api", symbol: "Ap", name: "API", family: "tools", number: 13, short: "Connects the agent to software services.", power: "Lets agents read data and trigger real actions.", risk: "A powerful API can become a powerful mistake.", quote: "I know somebody." },
  { id: "functions", symbol: "Fn", name: "Function Calling", family: "tools", number: 14, short: "Chooses structured functions with arguments.", power: "Makes model-to-tool actions more reliable.", risk: "Wrong arguments still produce wrong actions.", quote: "Just tell me the function and nobody gets hurt." },
  { id: "mcp", symbol: "Mc", name: "MCP", family: "tools", number: 15, short: "Standardizes access to tools and context.", power: "Makes tool and resource integrations easier to compose.", risk: "Connected does not mean authorized.", quote: "One protocol. Many doors." },
  { id: "browser", symbol: "Bw", name: "Browser", family: "tools", number: 16, short: "Navigates web interfaces and pages.", power: "Lets an agent gather or act through websites.", risk: "Web content may contain hostile instructions.", quote: "Open tabs are a lifestyle." },

  { id: "goal", symbol: "Gl", name: "Goal", family: "agency", number: 17, short: "Defines the outcome the agent pursues.", power: "Creates direction for planning and action.", risk: "A vague goal creates creative chaos.", quote: "Point me somewhere useful." },
  { id: "action", symbol: "Ac", name: "Action", family: "agency", number: 18, short: "Changes something outside the model.", power: "Converts reasoning into real-world progress.", risk: "Actions can be irreversible.", quote: "Enough thinking. Move." },
  { id: "loop", symbol: "Lp", name: "Agent Loop", family: "agency", number: 19, short: "Observe, decide, act and repeat.", power: "Allows adaptive multi-step work.", risk: "Without limits, loops can burn time and money.", quote: "Again. But smarter this time." },
  { id: "autonomy", symbol: "Au", name: "Autonomy", family: "agency", number: 20, short: "Acts without asking at every step.", power: "Reduces human coordination overhead.", risk: "More autonomy multiplies the cost of mistakes.", quote: "You sure you want me unsupervised?" },

  { id: "multi-agent", symbol: "Ma", name: "Multi-Agent", family: "collaboration", number: 21, short: "Uses several agents with distinct roles.", power: "Divides complex work among specialists.", risk: "Coordination can cost more than the work itself.", quote: "I brought a team. And a meeting." },
  { id: "supervisor", symbol: "Sv", name: "Supervisor", family: "collaboration", number: 22, short: "Routes and reviews work across agents.", power: "Adds orchestration and centralized control.", risk: "A bad supervisor scales bad decisions.", quote: "Who's holding the clipboard? Me." },
  { id: "delegation", symbol: "Dg", name: "Delegation", family: "collaboration", number: 23, short: "Assigns tasks to the right specialist.", power: "Improves focus and parallel work.", risk: "Poor routing loses context and accountability.", quote: "Not my department. Good news: I know whose." },
  { id: "handoff", symbol: "Ho", name: "Handoff", family: "collaboration", number: 24, short: "Transfers a task and its context.", power: "Supports seamless role changes between agents or humans.", risk: "Missing context makes every handoff a fresh mystery.", quote: "Your problem now — with documentation." },

  { id: "guardrails", symbol: "Gr", name: "Guardrails", family: "safety", number: 25, short: "Constrains unsafe or unwanted behavior.", power: "Blocks known classes of harmful behavior.", risk: "Rules that are too rigid can block legitimate work.", quote: "Absolutely not." },
  { id: "permissions", symbol: "Pm", name: "Permissions", family: "safety", number: 26, short: "Limits what data and actions an agent can access.", power: "Reduces blast radius through least privilege.", risk: "Over-broad access quietly creates major risk.", quote: "Show me your badge." },
  { id: "hitl", symbol: "Hi", name: "Human in the Loop", family: "safety", number: 27, short: "Requires human review at important moments.", power: "Adds judgment before high-impact actions.", risk: "Too many approvals destroy the value of automation.", quote: "Maybe a human should look at this one." },
  { id: "sandbox", symbol: "Sb", name: "Sandbox", family: "safety", number: 28, short: "Runs risky actions in an isolated environment.", power: "Lets agents experiment without touching production.", risk: "A sandbox is only useful if isolation is real.", quote: "Break whatever you like. In here." },

  { id: "testing", symbol: "Ts", name: "Testing", family: "evaluation", number: 29, short: "Checks expected behavior across scenarios.", power: "Finds predictable failures before release.", risk: "Tests only catch what you thought to test.", quote: "Prove it." },
  { id: "tracing", symbol: "Tr", name: "Tracing", family: "evaluation", number: 30, short: "Records decisions, calls and transitions.", power: "Makes agent behavior inspectable and debuggable.", risk: "Tracing can expose sensitive data if mishandled.", quote: "I saw everything." },
  { id: "monitoring", symbol: "Mn", name: "Monitoring", family: "evaluation", number: 31, short: "Watches live performance and failures.", power: "Detects drift, cost spikes and broken tools.", risk: "Metrics without response plans become decoration.", quote: "The dashboard is blinking for a reason." },
  { id: "validation", symbol: "Vl", name: "Validation", family: "evaluation", number: 32, short: "Checks outputs or actions against rules and evidence.", power: "Prevents malformed or unsupported results from moving forward.", risk: "Weak validators can rubber-stamp bad output.", quote: "Not so fast. Show your work." },
];

export const MISSIONS: Mission[] = [
  {
    id: "refund",
    title: "The Refund Showdown",
    kicker: "MISSION 01",
    brief: "A customer received the wrong product and wants a refund now.",
    objective: "Build an agent that investigates the order and prepares a safe refund path.",
    scenario: "The agent can inspect order data and initiate a refund, but financial actions should not happen on vibes alone.",
    mustHave: ["llm", "goal", "api", "permissions", "validation", "hitl"],
    helpful: ["planning", "context", "tracing"],
    breakCard: { title: "THE €3,800 OOPS", description: "Your agent tries to refund an expensive order before confirming authority and evidence.", causedBy: ["permissions", "validation", "hitl"] },
  },
  {
    id: "research",
    title: "The Citation Caper",
    kicker: "MISSION 02",
    brief: "A strategy team needs a sourced competitor brief before tomorrow morning.",
    objective: "Build an agent that researches, synthesizes and keeps claims grounded.",
    scenario: "Fresh information matters. Unsupported claims lose points even if they sound impressive.",
    mustHave: ["llm", "search", "rag", "validation", "goal"],
    helpful: ["planning", "reflection", "tracing"],
    breakCard: { title: "CONFIDENTLY INCORRECT", description: "The report invents a product launch that never happened.", causedBy: ["rag", "validation", "search"] },
  },
  {
    id: "travel",
    title: "The Itinerary Stampede",
    kicker: "MISSION 03",
    brief: "Plan a multi-city work trip while respecting preferences, timing and budget.",
    objective: "Build a travel agent that remembers constraints and adapts when plans change.",
    scenario: "A useful assistant needs memory and live information, but should not book expensive options without control.",
    mustHave: ["goal", "planning", "search", "short-memory", "permissions", "hitl"],
    helpful: ["long-memory", "api", "validation"],
    breakCard: { title: "FIRST CLASS, LAST BUDGET", description: "The agent optimizes comfort and quietly destroys the travel budget.", causedBy: ["goal", "permissions", "hitl"] },
  },
  {
    id: "code",
    title: "The Production Panic",
    kicker: "MISSION 04",
    brief: "A code agent must diagnose a bug, propose a patch and prove it works.",
    objective: "Build an agent that can act on code without turning production into a science experiment.",
    scenario: "Tool use matters, but isolation, tests and traceability matter more when code can change systems.",
    mustHave: ["reasoning", "planning", "functions", "sandbox", "testing", "validation"],
    helpful: ["reflection", "tracing", "hitl"],
    breakCard: { title: "WORKS ON MY AGENT", description: "The patch passes a happy-path check and breaks authentication elsewhere.", causedBy: ["sandbox", "testing", "validation"] },
  },
  {
    id: "sales",
    title: "The CRM Stampede",
    kicker: "MISSION 05",
    brief: "Research prospects, draft outreach and update CRM records without spamming anyone.",
    objective: "Create an agentic sales workflow with deliberate human control over outbound messages.",
    scenario: "Automation is useful until it sends 400 oddly personal messages before breakfast.",
    mustHave: ["search", "api", "planning", "permissions", "hitl", "tracing"],
    helpful: ["long-memory", "validation", "goal"],
    breakCard: { title: "THE 400-EMAIL SUNRISE", description: "The outreach agent sends every draft instead of preparing them for review.", causedBy: ["permissions", "hitl", "tracing"] },
  },
  {
    id: "support",
    title: "The Support Saloon",
    kicker: "MISSION 06",
    brief: "Handle routine support tickets and escalate the unusual ones gracefully.",
    objective: "Design an agent that resolves simple cases and hands off edge cases with context intact.",
    scenario: "Good automation knows when to stop being the hero.",
    mustHave: ["llm", "rag", "handoff", "context", "validation", "goal"],
    helpful: ["supervisor", "short-memory", "tracing"],
    breakCard: { title: "NO CONTEXT, NEW PROBLEM", description: "A human receives the escalation but none of the investigation that came before it.", causedBy: ["handoff", "context", "tracing"] },
  },
  {
    id: "procurement",
    title: "The Supplier Heist",
    kicker: "MISSION 07",
    brief: "Compare suppliers, flag risks and prepare a purchasing recommendation.",
    objective: "Build an agent that researches in parallel but keeps final recommendations verifiable.",
    scenario: "Multiple specialists can help, provided somebody coordinates their evidence and decisions.",
    mustHave: ["multi-agent", "supervisor", "search", "rag", "validation", "goal"],
    helpful: ["delegation", "tracing", "planning"],
    breakCard: { title: "SIX AGENTS, NINE ANSWERS", description: "Specialists contradict one another and no component owns the final synthesis.", causedBy: ["supervisor", "delegation", "validation"] },
  },
  {
    id: "ops",
    title: "The Infinite Loop",
    kicker: "MISSION 08",
    brief: "Create an operations agent that investigates incidents and retries safe actions.",
    objective: "Build adaptive autonomy without runaway loops or invisible cost spikes.",
    scenario: "An agent loop should know what success, failure and stopping look like.",
    mustHave: ["loop", "goal", "monitoring", "tracing", "permissions", "validation"],
    helpful: ["reflection", "planning", "hitl"],
    breakCard: { title: "RETRY UNTIL BANKRUPTCY", description: "The agent repeats a failing API call indefinitely and racks up cost.", causedBy: ["monitoring", "goal", "validation"] },
  },
];
