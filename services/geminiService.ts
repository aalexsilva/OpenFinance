import { GoogleGenAI } from "@google/genai";
import { Sale, Expense, InventoryItem } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateFinancialInsights = async (
  sales: Sale[],
  expenses: Expense[],
  inventory: InventoryItem[]
): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "API Key não encontrada. Configure process.env.API_KEY para usar a IA.";
  }

  // Prepare a summarized data string to avoid token limits on large datasets
  const totalSales = sales.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0);
  const profit = totalSales - totalExpenses;
  
  // Group sales by category for context
  const salesByCategory = sales.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.value;
    return acc;
  }, {});

  const prompt = `
    Atue como um consultor financeiro sênior para uma empresa de alimentação.
    Analise os seguintes dados resumidos:
    
    - Vendas Totais: R$ ${totalSales.toFixed(2)}
    - Gastos Totais: R$ ${totalExpenses.toFixed(2)}
    - Lucro Líquido: R$ ${profit.toFixed(2)}
    - Vendas por Categoria: ${JSON.stringify(salesByCategory)}
    - Total de Itens em Estoque: ${inventory.length}
    
    Forneça um resumo executivo curto (máximo 3 parágrafos) com:
    1. Diagnóstico da saúde financeira atual.
    2. Uma sugestão prática para aumentar o lucro.
    3. Um alerta sobre gastos ou estoque se necessário.
    
    Use formatação Markdown. Seja direto e profissional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini API:", error);
    return "Erro ao comunicar com o serviço de inteligência artificial.";
  }
};
