import { 
  User, 
  ProductionBatch, 
  InventoryItem, 
  InventoryTransaction, 
  Client, 
  Sale, 
  TrapicheConfig 
} from '../types';

const STORAGE_KEYS = {
  USER: 'panelapro_user',
  REMEMBER: 'panelapro_remember',
  CONFIG: 'panelapro_config',
  BATCHES: 'panelapro_batches',
  INVENTORY: 'panelapro_inventory',
  TRANSACTIONS: 'panelapro_transactions',
  CLIENTS: 'panelapro_clients',
  SALES: 'panelapro_sales'
};

// Seed Data Initialization
const DEFAULT_CONFIG: TrapicheConfig = {
  trapicheName: 'Trapiche La Gran Colombia',
  nit: '900.852.140-5',
  ownerName: 'Ing. Ashley Castañeda Villamil',
  phone: '+57 312 456 7890',
  email: 'contacto@trapichelagrancolombia.com',
  department: 'Cundinamarca',
  municipality: 'Villeta',
  address: 'Vereda Payandé Km 4 - Vía Guaduas',
  currencySymbol: '$',
  lowStockAlerts: true
};

const DEFAULT_USER: User = {
  id: 'usr-1',
  username: 'admin',
  fullName: 'Ashley Castañeda Villamil',
  trapicheName: 'Trapiche La Gran Colombia',
  email: 'ashley.castaneda@panelapro.co',
  role: 'Administradora de Trapiche',
  phone: '+57 312 456 7890',
  rememberSession: true
};

const INITIAL_BATCHES: ProductionBatch[] = [
  {
    id: 'batch-1',
    code: 'LOT-2026-001',
    date: '2026-07-20',
    caneAmountKg: 5000,
    panelaProducedKg: 560,
    panelaType: 'Bloque 500g',
    status: 'Finalizado',
    observations: 'Molienda óptima, caña con buena brix (21° Brix). Excelente rendimiento y claridad.',
    operatorName: 'Don José Ramos',
    rendimientoPercentage: 11.2,
    createdAt: '2026-07-20T08:00:00Z'
  },
  {
    id: 'batch-2',
    code: 'LOT-2026-002',
    date: '2026-07-21',
    caneAmountKg: 6200,
    panelaProducedKg: 690,
    panelaType: 'Bloque 1kg',
    status: 'Empacado',
    observations: 'Se utilizó bagazo seco de primera calidad para calderas. Clarificación natural con balso.',
    operatorName: 'Hernando Silva',
    rendimientoPercentage: 11.13,
    createdAt: '2026-07-21T07:30:00Z'
  },
  {
    id: 'batch-3',
    code: 'LOT-2026-003',
    date: '2026-07-22',
    caneAmountKg: 4800,
    panelaProducedKg: 535,
    panelaType: 'Granulada Orgánica',
    status: 'Punteo',
    observations: 'En etapa de evaporación activa y punteo. Mantenimiento constante de temperatura en pailas.',
    operatorName: 'Don José Ramos',
    rendimientoPercentage: 11.15,
    createdAt: '2026-07-22T06:00:00Z'
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    code: 'MP-001',
    name: 'Caña de Azúcar Variedad CC 85-92',
    category: 'MateriaPrima',
    quantity: 2200, // Low stock intentionally to trigger alert!
    unit: 'kg',
    minStock: 3000,
    costPerUnit: 320,
    sellPricePerUnit: 0,
    location: 'Patio de Mapeo / Aprisco',
    lastUpdated: '2026-07-22'
  },
  {
    id: 'inv-2',
    code: 'MP-002',
    name: 'Bagazo Seco para Caldera',
    category: 'MateriaPrima',
    quantity: 1500,
    unit: 'kg',
    minStock: 600,
    costPerUnit: 150,
    sellPricePerUnit: 0,
    location: 'Depósito de Combustible',
    lastUpdated: '2026-07-21'
  },
  {
    id: 'inv-3',
    code: 'MP-003',
    name: 'Cal Agrícola (Clarificante)',
    category: 'MateriaPrima',
    quantity: 25, // Low stock alert!
    unit: 'kg',
    minStock: 50,
    costPerUnit: 1200,
    sellPricePerUnit: 0,
    location: 'Bodega de Insumos',
    lastUpdated: '2026-07-18'
  },
  {
    id: 'inv-4',
    code: 'MP-004',
    name: 'Cajas de Cartón Corrugado 20kg',
    category: 'MateriaPrima',
    quantity: 180,
    unit: 'unidades',
    minStock: 50,
    costPerUnit: 2500,
    sellPricePerUnit: 0,
    location: 'Bodega Empaques',
    lastUpdated: '2026-07-20'
  },
  {
    id: 'inv-5',
    code: 'PT-001',
    name: 'Panela en Bloque 500g Tradicional',
    category: 'ProductoTerminado',
    quantity: 1120,
    unit: 'unidades',
    minStock: 300,
    costPerUnit: 2100,
    sellPricePerUnit: 3600,
    location: 'Bodega Producto Terminado',
    lastUpdated: '2026-07-21'
  },
  {
    id: 'inv-6',
    code: 'PT-002',
    name: 'Panela Redonda 1kg Especial',
    category: 'ProductoTerminado',
    quantity: 690,
    unit: 'unidades',
    minStock: 200,
    costPerUnit: 4100,
    sellPricePerUnit: 6900,
    location: 'Bodega Producto Terminado',
    lastUpdated: '2026-07-21'
  },
  {
    id: 'inv-7',
    code: 'PT-003',
    name: 'Panela Granulada Orgánica 500g',
    category: 'ProductoTerminado',
    quantity: 340,
    unit: 'unidades',
    minStock: 150,
    costPerUnit: 3200,
    sellPricePerUnit: 5800,
    location: 'Bodega Producto Terminado',
    lastUpdated: '2026-07-22'
  },
  {
    id: 'inv-8',
    code: 'PT-004',
    name: 'Miel de Caña Pura (Garrafa 5 L)',
    category: 'ProductoTerminado',
    quantity: 12, // Low stock
    unit: 'unidades',
    minStock: 20,
    costPerUnit: 18000,
    sellPricePerUnit: 32000,
    location: 'Estantería B',
    lastUpdated: '2026-07-19'
  }
];

const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Distribuidora Panela de la Sabana S.A.S.',
    documentType: 'NIT',
    documentNumber: '900.482.119-1',
    phone: '+57 310 987 6543',
    email: 'compras@lasabana.com.co',
    address: 'Carrera 15 # 22-45',
    municipality: 'Villeta',
    notes: 'Cliente mayorista frecuente. Pago a 30 días.',
    createdAt: '2026-01-15'
  },
  {
    id: 'cli-2',
    name: 'Supermercados El Campestre',
    documentType: 'NIT',
    documentNumber: '890.312.441-2',
    phone: '+57 315 234 5678',
    email: 'gerencia@elcampestre.co',
    address: 'Calle 8 # 11-30',
    municipality: 'Moniquirá',
    notes: 'Pide panela en bloque 1kg y granulada en caja.',
    createdAt: '2026-02-01'
  },
  {
    id: 'cli-3',
    name: 'Exportadora de Productos Orgánicos BioAndes',
    documentType: 'NIT',
    documentNumber: '901.223.504-8',
    phone: '+57 300 456 7891',
    email: 'contacto@bioandesexport.com',
    address: 'Zona Franca Fontibón Lote 12',
    municipality: 'Bogotá D.C.',
    notes: 'Compra exclusiva de Panela Granulada Orgánica certificada.',
    createdAt: '2026-03-10'
  },
  {
    id: 'cli-4',
    name: 'Don Pedro Antonio Gómez',
    documentType: 'CC',
    documentNumber: '19.452.889',
    phone: '+57 320 888 1234',
    email: 'pedrogomez@gmail.com',
    address: 'Plaza de Mercado Local Puesto 4',
    municipality: 'Nocaima',
    notes: 'Comercio local al detal.',
    createdAt: '2026-04-20'
  }
];

const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    invoiceCode: 'VEN-1001',
    clientId: 'cli-1',
    clientName: 'Distribuidora Panela de la Sabana S.A.S.',
    clientDocument: '900.482.119-1',
    date: '2026-07-18',
    details: [
      {
        id: 'sd-1',
        inventoryItemId: 'inv-5',
        productName: 'Panela en Bloque 500g Tradicional',
        quantity: 500,
        unit: 'unidades',
        unitPrice: 3600,
        subtotal: 1800000
      },
      {
        id: 'sd-2',
        inventoryItemId: 'inv-6',
        productName: 'Panela Redonda 1kg Especial',
        quantity: 100,
        unit: 'unidades',
        unitPrice: 6900,
        subtotal: 690000
      }
    ],
    total: 2490000,
    paymentMethod: 'Transferencia',
    status: 'Completada',
    notes: 'Despachado en camión propio con guía de transporte.'
  },
  {
    id: 'sale-2',
    invoiceCode: 'VEN-1002',
    clientId: 'cli-2',
    clientName: 'Supermercados El Campestre',
    clientDocument: '890.312.441-2',
    date: '2026-07-20',
    details: [
      {
        id: 'sd-3',
        inventoryItemId: 'inv-7',
        productName: 'Panela Granulada Orgánica 500g',
        quantity: 150,
        unit: 'unidades',
        unitPrice: 5800,
        subtotal: 870000
      },
      {
        id: 'sd-4',
        inventoryItemId: 'inv-8',
        productName: 'Miel de Caña Pura (Garrafa 5 L)',
        quantity: 5,
        unit: 'unidades',
        unitPrice: 32000,
        subtotal: 160000
      }
    ],
    total: 1030000,
    paymentMethod: 'Efectivo',
    status: 'Completada',
    notes: 'Pago de contado al entregar en bodega.'
  }
];

export const storageService = {
  // Config
  getConfig(): TrapicheConfig {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!data) return DEFAULT_CONFIG;
    const parsed = JSON.parse(data);
    if (parsed.ownerName === 'Ing. Carlos Alberto Mendoza' || parsed.ownerName === 'Carlos Alberto Mendoza') {
      parsed.ownerName = 'Ing. Ashley Castañeda Villamil';
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(parsed));
    }
    return parsed;
  },
  saveConfig(config: TrapicheConfig): void {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },

  // Auth User
  getStoredUser(): User | null {
    const remember = localStorage.getItem(STORAGE_KEYS.REMEMBER);
    if (remember === 'false') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) return DEFAULT_USER;
    const parsed = JSON.parse(data);
    if (parsed.fullName === 'Carlos Alberto Mendoza') {
      parsed.fullName = 'Ashley Castañeda Villamil';
      parsed.email = 'ashley.castaneda@panelapro.co';
      parsed.role = 'Administradora de Trapiche';
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsed));
    }
    return parsed;
  },
  saveUser(user: User, remember: boolean): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.REMEMBER, remember ? 'true' : 'false');
  },
  clearUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.setItem(STORAGE_KEYS.REMEMBER, 'false');
  },

  // Batches (Producción)
  getBatches(): ProductionBatch[] {
    const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
      return INITIAL_BATCHES;
    }
    return JSON.parse(data);
  },
  saveBatches(batches: ProductionBatch[]): void {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  },

  // Inventory
  getInventory(): InventoryItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    return JSON.parse(data);
  },
  saveInventory(items: InventoryItem[]): void {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
  },

  // Clients
  getClients(): Client[] {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(data);
  },
  saveClients(clients: Client[]): void {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  // Sales
  getSales(): Sale[] {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
      return INITIAL_SALES;
    }
    return JSON.parse(data);
  },
  saveSales(sales: Sale[]): void {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  // Helper format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  }
};
