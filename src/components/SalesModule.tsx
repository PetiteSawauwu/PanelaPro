import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Eye, 
  X, 
  AlertCircle,
  Printer
} from 'lucide-react';
import { Sale, Client, InventoryItem, SaleDetail } from '../types';
import { storageService } from '../services/storage';

interface SalesModuleProps {
  sales: Sale[];
  clients: Client[];
  inventory: InventoryItem[];
  onRegisterSale: (sale: Sale, updatedInventory: InventoryItem[]) => void;
}

export const SalesModule: React.FC<SalesModuleProps> = ({
  sales,
  clients,
  inventory,
  onRegisterSale
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);

  // Sale Registration Form State
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia' | 'Crédito 30 días'>('Efectivo');
  const [saleNotes, setSaleNotes] = useState('');

  // Cart / Items to sell
  const [cartItems, setCartItems] = useState<Array<{
    inventoryItemId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    availableStock: number;
    unit: string;
  }>>([]);

  // Selected item inputs
  const availableFinishedProducts = inventory.filter(i => i.category === 'ProductoTerminado' && i.quantity > 0);
  const [selectedProductId, setSelectedProductId] = useState<string>(availableFinishedProducts[0]?.id || '');
  const [itemQuantity, setItemQuantity] = useState<number>(100);
  const [itemPrice, setItemPrice] = useState<number>(availableFinishedProducts[0]?.sellPricePerUnit || 3600);

  const [formError, setFormError] = useState<string | null>(null);

  const handleProductSelectionChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = inventory.find(i => i.id === prodId);
    if (prod) {
      setItemPrice(prod.sellPricePerUnit || 3500);
    }
  };

  const handleAddToCart = () => {
    setFormError(null);
    const product = inventory.find(i => i.id === selectedProductId);
    if (!product) {
      setFormError('Seleccione un producto terminado válido.');
      return;
    }

    if (itemQuantity <= 0) {
      setFormError('La cantidad debe ser mayor a 0.');
      return;
    }

    if (itemQuantity > product.quantity) {
      setFormError(`Stock insuficiente en bodega. Solo hay ${product.quantity} ${product.unit} de ${product.name}.`);
      return;
    }

    // Check if item already in cart
    const existingIndex = cartItems.findIndex(ci => ci.inventoryItemId === product.id);
    if (existingIndex >= 0) {
      const updatedCart = [...cartItems];
      const newQty = updatedCart[existingIndex].quantity + itemQuantity;
      if (newQty > product.quantity) {
        setFormError(`Stock insuficiente para agregar esa cantidad adicional.`);
        return;
      }
      updatedCart[existingIndex].quantity = newQty;
      setCartItems(updatedCart);
    } else {
      setCartItems([
        ...cartItems,
        {
          inventoryItemId: product.id,
          productName: product.name,
          quantity: itemQuantity,
          unitPrice: itemPrice,
          availableStock: product.quantity,
          unit: product.unit
        }
      ]);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const handleOpenRegisterModal = () => {
    setSelectedClientId(clients[0]?.id || '');
    setSaleDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('Efectivo');
    setSaleNotes('');
    setCartItems([]);
    setFormError(null);
    setIsRegisterModalOpen(true);
  };

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedClientId) {
      setFormError('Por favor seleccione un cliente.');
      return;
    }

    if (cartItems.length === 0) {
      setFormError('Agregue al menos un producto a la factura de venta.');
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    if (!client) {
      setFormError('Cliente no encontrado.');
      return;
    }

    const nextInvoiceCode = `VEN-${String(sales.length + 1001)}`;
    const totalAmount = calculateCartTotal();

    const saleDetails: SaleDetail[] = cartItems.map((ci, idx) => ({
      id: `sd-${Date.now()}-${idx}`,
      inventoryItemId: ci.inventoryItemId,
      productName: ci.productName,
      quantity: ci.quantity,
      unit: ci.unit,
      unitPrice: ci.unitPrice,
      subtotal: ci.quantity * ci.unitPrice
    }));

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      invoiceCode: nextInvoiceCode,
      clientId: client.id,
      clientName: client.name,
      clientDocument: client.documentNumber,
      date: saleDate,
      details: saleDetails,
      total: totalAmount,
      paymentMethod,
      status: 'Completada',
      notes: saleNotes
    };

    // Calculate Updated Inventory Stock
    const updatedInventoryList = inventory.map(item => {
      const soldInCart = cartItems.find(ci => ci.inventoryItemId === item.id);
      if (soldInCart) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity - soldInCart.quantity),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });

    onRegisterSale(newSale, updatedInventoryList);
    setIsRegisterModalOpen(false);
  };

  const filteredSales = sales.filter(s =>
    s.invoiceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-white p-2 sm:p-4">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#8893C2]" />
            <span>Módulo de Ventas & Facturación</span>
          </h2>
          <p className="text-xs text-black/70 mt-1 font-medium">
            Registro de facturas comerciales con actualización y descuento automático del inventario.
          </p>
        </div>

        <button
          onClick={handleOpenRegisterModal}
          className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] transition shadow-md flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-white">Registrar Nueva Venta</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/40">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar factura por código (VEN-1001), cliente o medio de pago..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#A7B0D6]/40 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2] transition shadow-xs"
        />
      </div>

      {/* Sales List Table */}
      <div className="bg-white rounded-[24px] border border-[#A7B0D6]/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#A7B0D6]/15 border-b border-[#A7B0D6]/30 text-black font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">N° Factura</th>
                <th className="px-4 py-3.5">Cliente</th>
                <th className="px-4 py-3.5">Fecha</th>
                <th className="px-4 py-3.5 text-center">Productos</th>
                <th className="px-4 py-3.5">Medio de Pago</th>
                <th className="px-4 py-3.5 text-right">Total Factura</th>
                <th className="px-4 py-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A7B0D6]/30 font-medium text-black">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-black/60">
                    No hay ventas registradas.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#A7B0D6]/10 transition">
                    
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-black bg-[#A7B0D6]/20 px-2.5 py-1 rounded-[30px] border border-[#A7B0D6]/40 text-[11px]">
                        {sale.invoiceCode}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-bold text-black">{sale.clientName}</p>
                      <p className="text-[10px] text-black/60 font-mono">Doc: {sale.clientDocument}</p>
                    </td>

                    <td className="px-4 py-3.5 text-black/70">
                      {sale.date}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="bg-[#A7B0D6]/30 px-3 py-1 rounded-[30px] text-[11px] font-bold text-black">
                        {sale.details?.length || 0} ítems
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="bg-[#8893C2] text-white px-3 py-1 rounded-[30px] text-[10px] font-bold">
                        {sale.paymentMethod}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-black text-sm text-black">
                      {storageService.formatCurrency(sale.total)}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedInvoice(sale)}
                        className="px-3 py-1.5 bg-[#8893C2] text-white hover:bg-[#7782B1] font-bold rounded-[30px] text-[10px] inline-flex items-center space-x-1 transition shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                        <span className="text-white">Ver Factura</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER SALE MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-2xl w-full overflow-hidden shadow-2xl border border-[#A7B0D6]/40 my-6">
            
            <div className="bg-[#8893C2] p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="text-white">Registrar Nueva Venta Comercial</span>
              </h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-[30px]">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmitSale} className="p-6 space-y-4 bg-white">
              
              {formError && (
                <div className="p-3.5 bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold rounded-[20px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#FF0000] shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Client & Date & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Cliente *</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                    required
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.documentNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Fecha de Venta *</label>
                  <input
                    type="date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Método de Pago</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-bold text-black focus:ring-2 focus:ring-[#8893C2]"
                  >
                    <option value="Efectivo">Efectivo de Contado</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                    <option value="Crédito 30 días">Crédito a 30 días</option>
                  </select>
                </div>
              </div>

              {/* Add Product Selector Box */}
              <div className="p-4 bg-[#A7B0D6]/15 rounded-[24px] border border-[#A7B0D6]/30 space-y-3">
                <p className="text-xs font-extrabold text-black flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#8893C2]" />
                  Agregar Productos Terminados a la Factura
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-black mb-1">Producto Terminado</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => handleProductSelectionChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-semibold text-black"
                    >
                      {availableFinishedProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock: {p.quantity} {p.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-black mb-1">Cantidad</label>
                    <input
                      type="number"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Number(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-black mb-1">Precio U. (COP)</label>
                    <input
                      type="number"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-[#A7B0D6]/50 rounded-[20px] text-xs font-mono font-bold text-black"
                    />
                  </div>
                </div>

                <div className="text-right pt-1">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="px-5 py-2 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] shadow-sm transition"
                  >
                    <span className="text-white">+ Agregar al Carrito</span>
                  </button>
                </div>
              </div>

              {/* Cart Items Table */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Detalle de Factura ({cartItems.length} productos)</label>
                <div className="bg-white rounded-[20px] border border-[#A7B0D6]/40 overflow-hidden max-h-48 overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <p className="text-xs text-black/60 p-4 text-center font-medium">No hay productos agregados a la factura.</p>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#A7B0D6]/20 text-black font-bold">
                        <tr>
                          <th className="p-2.5">Producto</th>
                          <th className="p-2.5 text-center">Cant.</th>
                          <th className="p-2.5 text-right">Precio U.</th>
                          <th className="p-2.5 text-right">Subtotal</th>
                          <th className="p-2.5 text-center">Quitar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#A7B0D6]/30">
                        {cartItems.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-bold text-black">{item.productName}</td>
                            <td className="p-2.5 text-center font-mono text-black">{item.quantity} {item.unit}</td>
                            <td className="p-2.5 text-right font-mono text-black">{storageService.formatCurrency(item.unitPrice)}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-black">
                              {storageService.formatCurrency(item.quantity * item.unitPrice)}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(idx)}
                                className="text-[#FF0000] hover:bg-[#FF0000]/10 p-1 rounded-[30px]"
                              >
                                <X className="w-4 h-4 text-[#FF0000]" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-3.5 bg-[#A7B0D6]/20 rounded-[20px] border border-[#A7B0D6]/40 flex items-center justify-between">
                <span className="font-extrabold text-sm text-black">Total Facturado (COP):</span>
                <span className="font-mono font-black text-xl text-black">
                  {storageService.formatCurrency(calculateCartTotal())}
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-[#A7B0D6] text-black text-xs font-bold rounded-[30px] hover:bg-[#A7B0D6]/20 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cartItems.length === 0}
                  className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white text-xs font-bold rounded-[30px] shadow-md transition disabled:opacity-50"
                >
                  <span className="text-white">Confirmar Venta & Descontar Stock</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE DETAIL MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-[#A7B0D6]/40 p-6 space-y-4">
            
            {/* Invoice Header */}
            <div className="border-b border-[#A7B0D6]/30 pb-4 flex justify-between items-start">
              <div>
                <span className="text-xs bg-[#8893C2] text-white font-mono font-extrabold px-3 py-1 rounded-[30px]">
                  {selectedInvoice.invoiceCode}
                </span>
                <h3 className="text-base font-bold text-black mt-2">Factura de Venta PanelaPró</h3>
                <p className="text-xs text-black/60 font-medium">Fecha: {selectedInvoice.date}</p>
              </div>

              <button onClick={() => setSelectedInvoice(null)} className="text-black/60 hover:text-black p-1 rounded-[30px]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info */}
            <div className="p-3.5 bg-[#A7B0D6]/15 rounded-[20px] text-xs text-black space-y-1 border border-[#A7B0D6]/30 font-medium">
              <p><strong>Cliente:</strong> {selectedInvoice.clientName}</p>
              <p><strong>Documento / NIT:</strong> {selectedInvoice.clientDocument}</p>
              <p><strong>Medio de Pago:</strong> {selectedInvoice.paymentMethod}</p>
            </div>

            {/* Items */}
            <div className="border border-[#A7B0D6]/30 rounded-[20px] overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#A7B0D6]/20 font-bold text-black">
                  <tr>
                    <th className="p-2.5">Producto</th>
                    <th className="p-2.5 text-center">Cant.</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A7B0D6]/30">
                  {selectedInvoice.details?.map((d, i) => (
                    <tr key={i}>
                      <td className="p-2.5 font-bold text-black">{d.productName}</td>
                      <td className="p-2.5 text-center font-mono text-black">{d.quantity} {d.unit}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-black">{storageService.formatCurrency(d.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-sm font-extrabold text-black pt-2 border-t border-[#A7B0D6]/30">
              <span>Total a Pagar:</span>
              <span className="text-lg font-mono font-black text-black">{storageService.formatCurrency(selectedInvoice.total)}</span>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-[#A7B0D6] text-black text-xs font-bold rounded-[30px] flex items-center space-x-1.5 hover:bg-[#A7B0D6]/20 transition"
              >
                <Printer className="w-4 h-4 text-[#8893C2]" />
                <span>Imprimir Factura</span>
              </button>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 bg-[#8893C2] hover:bg-[#7782B1] text-white text-xs font-bold rounded-[30px] shadow-sm transition"
              >
                <span className="text-white">Cerrar</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
