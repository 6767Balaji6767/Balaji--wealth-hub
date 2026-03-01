import { CategoryType } from "../constants";

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;
const hasApiKey = API_KEY && API_KEY !== 'PLACEHOLDER_API_KEY';

export const getFinancialAdvice = async (state) => {
  if (!hasApiKey) {
    return {
      score: 75,
      summary: "AI features require a Gemini API key. Add GEMINI_API_KEY to your .env.local file to enable real insights.",
      recommendations: [
        "Track your daily expenses consistently to understand your spending patterns.",
        "Aim to save at least 20% of your monthly income each month.",
        "Review your EMI and loan payments regularly to reduce unnecessary debt."
      ]
    };
  }

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = state.salary - totalExpenses;

  const categoriesMap = new Map();
  state.expenses.forEach(e => {
    const key = e.category === CategoryType.OTHER && e.customCategory ? e.customCategory : e.category;
    categoriesMap.set(key, (categoriesMap.get(key) || 0) + e.amount);
  });

  const categoryBreakdown = Array.from(categoriesMap.entries()).map(([name, total]) => ({
    category: name,
    total: total
  }));

  const goalsSummary = state.goals.map(g => `${g.name}: ₹${g.current.toLocaleString()}/₹${g.target.toLocaleString()}`).join(', ');

  const prompt = `
    Analyze this monthly financial snapshot:
    Monthly Salary/Inflow: ₹${state.salary}
    Total Outflow: ₹${totalExpenses}
    Available Cash: ₹${remaining}
    Detailed Breakdown: ${JSON.stringify(categoryBreakdown)}
    Saving Targets: ${goalsSummary}
    Respond only in JSON with: score (0-100), summary (2 sentences), recommendations (array of 3 strings).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};

export const chatWithBot = async (message, state, history) => {
  if (!hasApiKey) {
    return "AI chat requires a Gemini API key. Please add GEMINI_API_KEY to your .env.local file to enable WealthBot. 🤖";
  }

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = state.salary - totalExpenses;

  const systemInstruction = `
    You are "WealthBot", the interactive AI financial assistant for Balaji Pro.
    Salary: ₹${state.salary}, Expenses: ₹${totalExpenses}, Remaining: ₹${remaining}
    Goals: ${state.goals.map(g => g.name + " (" + g.current + "/" + g.target + ")").join(", ")}
    Transactions: ${state.expenses.length} recorded. Be brief (max 3 sentences).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: message }] }
      ]
    });
    return response.text;
  } catch (error) {
    console.error("WealthBot Error:", error);
    return "I'm having trouble connecting. Please try again.";
  }
};
