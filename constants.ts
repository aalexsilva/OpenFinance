export const COLORS = {
    background: '#1E1E1E',
    card: '#2C2C2C',
    text: '#FFFFFF',
    success: '#00C853',
    danger: '#D50000',
    primary: '#2962FF',
    gridLines: '#444444'
};

export const SALES_CATEGORIES = [
    'Lanche', 'Bebida', 'Combo', 'Sobremesa', 'Delivery'
];

export const PAYMENT_METHODS = [
    'Pix', 'Dinheiro', 'Cartão Débito', 'Cartão Crédito'
];

export const EXPENSE_CATEGORIES = [
    'Mercadoria', 'Funcionários', 'Aluguel', 'Água/Luz/Gás', 'Marketing', 'Apps Delivery', 'Impostos'
];

export const EXPENSE_TYPES = [
    'Fixo', 'Variável'
];

// Pre-populated data for demonstration
export const MOCK_SALES = [
    { id: '1', date: '2023-10-25', product: 'X-Bacon', category: 'Lanche', paymentMethod: 'Pix', value: 35.00, attendant: 'Carlos' },
    { id: '2', date: '2023-10-25', product: 'Coca-Cola 2L', category: 'Bebida', paymentMethod: 'Dinheiro', value: 12.00, attendant: 'Carlos' },
    { id: '3', date: '2023-10-25', product: 'Combo Família', category: 'Combo', paymentMethod: 'Cartão Crédito', value: 89.90, attendant: 'Ana' },
    { id: '4', date: '2023-10-26', product: 'Pizza Calabresa', category: 'Delivery', paymentMethod: 'Pix', value: 55.00, attendant: 'Ana' },
    { id: '5', date: '2023-10-26', product: 'Petit Gateau', category: 'Sobremesa', paymentMethod: 'Cartão Débito', value: 22.00, attendant: 'Carlos' },
    { id: '6', date: '2023-10-27', product: 'X-Salada', category: 'Lanche', paymentMethod: 'Dinheiro', value: 25.00, attendant: 'Ana' },
];

export const MOCK_EXPENSES = [
    { id: '1', date: '2023-10-01', description: 'Aluguel Ponto', category: 'Aluguel', value: 2500.00, type: 'Fixo' },
    { id: '2', date: '2023-10-05', description: 'Fornecedor Carnes', category: 'Mercadoria', value: 1200.00, type: 'Variável' },
    { id: '3', date: '2023-10-10', description: 'Conta de Luz', category: 'Água/Luz/Gás', value: 450.00, type: 'Variável' },
    { id: '4', date: '2023-10-15', description: 'Impulsionamento Insta', category: 'Marketing', value: 300.00, type: 'Variável' },
];

export const MOCK_INVENTORY = [
    { id: '1', product: 'Pão de Hambúrguer', quantity: 100, unitCost: 1.50, supplier: 'Padaria Central' },
    { id: '2', product: 'Carne Moída (kg)', quantity: 50, unitCost: 28.90, supplier: 'Frigorífico Boi Bravo' },
    { id: '3', product: 'Refrigerante Lata', quantity: 200, unitCost: 2.50, supplier: 'Distribuidora Bebidas' },
];
