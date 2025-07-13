export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CASHIER';
  createdAt: Date;
}

export interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: { menus: number }
}

export interface Menu {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  category: Category;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: number;
  userId: string;
  user: User;
  transactionDate: Date;
  totalAmount: number;
  paymentMethod: 'cash' | 'qris';
  status: 'pending' | 'completed' | 'failed';
  paymentToken?: string;
  paymentUrl?: string;
  items: TransactionItem[];
}

export interface TransactionItem {
  id: number;
  transactionId: number;
  menuId: number;
  menu: Menu;
  quantity: number;
  priceAtSale: number;
  itemTotal: number;
}

export interface CartItem {
  menu: Menu;
  quantity: number;
}

export interface CreateTransactionRequest {
  items: Array<{
    menuId: number;
    quantity: number;
    priceAtSale: number;
  }>;
  totalAmount: number;
  paymentMethod: 'cash' | 'qris';
  userId: string;
}

export interface CreateTransactionResponse {
  transaction: Transaction;
  success: boolean;
  message: string;
}