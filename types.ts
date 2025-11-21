
export enum SalesCategory {
    LANCHE = 'Lanche',
    BEBIDA = 'Bebida',
    COMBO = 'Combo',
    SOBREMESA = 'Sobremesa',
    DELIVERY = 'Delivery'
}

export enum PaymentMethod {
    PIX = 'Pix',
    DINHEIRO = 'Dinheiro',
    CARTAO_DEBITO = 'Cartão Débito',
    CARTAO_CREDITO = 'Cartão Crédito'
}

export interface Sale {
    id: string;
    date: string;
    product: string;
    category: SalesCategory;
    paymentMethod: PaymentMethod;
    value: number;
    attendant: string;
}

export enum ExpenseCategory {
    MERCADORIA = 'Mercadoria',
    FUNCIONARIOS = 'Funcionários',
    ALUGUEL = 'Aluguel',
    UTILIDADES = 'Água/Luz/Gás',
    MARKETING = 'Marketing',
    APPS_DELIVERY = 'Apps Delivery',
    IMPOSTOS = 'Impostos'
}

export enum ExpenseType {
    FIXO = 'Fixo',
    VARIAVEL = 'Variável'
}

export interface Expense {
    id: string;
    date: string;
    description: string;
    category: ExpenseCategory;
    value: number;
    type: ExpenseType;
}

export interface InventoryItem {
    id: string;
    product: string;
    quantity: number;
    unitCost: number;
    supplier: string;
}

export interface CompanyProfile {
    id: string;
    name: string;
    email: string;
    password: string; // In a real app, never store raw passwords on frontend
    type: string; // e.g. Pizzaria, Lanchonete
    logoUrl?: string;
}

export type Tab = 'DASHBOARD' | 'SALES' | 'EXPENSES' | 'INVENTORY';
