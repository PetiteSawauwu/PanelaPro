export type ModuleType = 
  | 'dashboard'
  | 'production'
  | 'inventory'
  | 'clients'
  | 'sales'
  | 'reports'
  | 'settings'
  | 'code_export';

export interface User {
  id: string;
  username: string;
  fullName: string;
  trapicheName: string;
  email: string;
  role: string;
  phone: string;
  rememberSession?: boolean;
}

export type BatchStatus = 'Molienda' | 'Clarificación' | 'Punteo' | 'Moldeo' | 'Empacado' | 'Finalizado';

export interface ProductionBatch {
  id: string;
  code: string; // e.g. "LOT-2026-001"
  date: string; // YYYY-MM-DD
  caneAmountKg: number; // Cantidad de caña en kg
  panelaProducedKg: number; // Cantidad producida en kg
  panelaType: string; // e.g. "Bloque 500g", "Bloque 1kg", "Granulada", "Miel"
  status: BatchStatus;
  observations: string;
  operatorName: string;
  rendimientoPercentage: number; // (panelaProducedKg / caneAmountKg) * 100
  createdAt: string;
}

export type InventoryCategory = 'MateriaPrima' | 'ProductoTerminado';

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: 'kg' | 'ton' | 'unidades' | 'cajas' | 'litros' | 'bultos';
  minStock: number;
  costPerUnit: number;
  sellPricePerUnit: number;
  location: string;
  lastUpdated: string;
}

export type TransactionType = 'Entrada' | 'Salida';

export interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: TransactionType;
  quantity: number;
  reason: 'Producción' | 'Venta' | 'Compra Materia Prima' | 'Ajuste Stock' | 'Merma';
  date: string;
  referenceCode?: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  documentType: 'NIT' | 'CC';
  documentNumber: string;
  phone: string;
  email: string;
  address: string;
  municipality: string;
  notes?: string;
  createdAt: string;
}

export interface SaleDetail {
  id: string;
  inventoryItemId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoiceCode: string; // e.g. "VEN-1001"
  clientId: string;
  clientName: string;
  clientDocument: string;
  date: string;
  details: SaleDetail[];
  total: number;
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Crédito 30 días';
  status: 'Completada' | 'Pendiente' | 'Anulada';
  notes?: string;
}

export interface TrapicheConfig {
  trapicheName: string;
  nit: string;
  ownerName: string;
  phone: string;
  email: string;
  department: string;
  municipality: string;
  address: string;
  currencySymbol: string;
  lowStockAlerts: boolean;
}
