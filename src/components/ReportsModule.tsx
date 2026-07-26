import React, { useState } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  Factory, 
  Package, 
  ShoppingCart
} from 'lucide-react';
import { ProductionBatch, InventoryItem, Sale, Client, TrapicheConfig } from '../types';
import { storageService } from '../services/storage';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface ReportsModuleProps {
  batches: ProductionBatch[];
  inventory: InventoryItem[];
  sales: Sale[];
  clients: Client[];
  config: TrapicheConfig;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  batches,
  inventory,
  sales,
  clients,
  config
}) => {
  const [isExporting, setIsExporting] = useState(false);

  // Stats Calculations
  const totalPanelaKg = batches.reduce((acc, b) => acc + b.panelaProducedKg, 0);
  const totalCaneKg = batches.reduce((acc, b) => acc + b.caneAmountKg, 0);
  const avgYield = batches.length > 0 ? (totalPanelaKg / totalCaneKg * 100).toFixed(1) : '11.2';

  const totalInventoryValue = inventory.reduce((acc, i) => acc + (i.quantity * i.costPerUnit), 0);
  const totalSalesCOP = sales.reduce((acc, s) => acc + s.total, 0);

  // PDF Export Handler
  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const currentDate = new Date().toLocaleDateString('es-CO');

        // Header
        doc.setFillColor(136, 147, 194); // #8893C2
        doc.rect(0, 0, 210, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(`PANELAPRÓ - REPORTES INTEGRALES`, 14, 18);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${config.trapicheName} | NIT: ${config.nit}`, 14, 25);
        doc.text(`Fecha: ${currentDate}`, 150, 25);

        // Section 1: Executive Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('1. RESUMEN EJECUTIVO DE GESTIÓN', 14, 42);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Total Panela Producida: ${totalPanelaKg.toLocaleString()} kg`, 18, 50);
        doc.text(`• Rendimiento Promedio %: ${avgYield}%`, 18, 57);
        doc.text(`• Total Ventas Facturadas: $${totalSalesCOP.toLocaleString('es-CO')}`, 18, 64);
        doc.text(`• Valor Comercial en Inventario: $${totalInventoryValue.toLocaleString('es-CO')}`, 18, 71);
        doc.text(`• Total Clientes Registrados: ${clients.length}`, 18, 78);

        // Section 2: Production Batches
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('2. DETALLE DE LOTES DE PRODUCCIÓN', 14, 92);

        let yPos = 100;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Código | Fecha | Caña (kg) | Panela (kg) | Rend. % | Estado', 14, yPos);
        doc.line(14, yPos + 2, 195, yPos + 2);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        batches.forEach((b) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${b.code} | ${b.date} | ${b.caneAmountKg}kg | ${b.panelaProducedKg}kg | ${b.rendimientoPercentage}% | ${b.status}`, 14, yPos);
          yPos += 6;
        });

        // Section 3: Sales
        yPos += 10;
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('3. DETALLE DE VENTAS', 14, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Factura | Cliente | Fecha | Pago | Total (COP)', 14, yPos);
        doc.line(14, yPos + 2, 195, yPos + 2);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        sales.forEach((s) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${s.invoiceCode} | ${s.clientName.substring(0, 22)} | ${s.date} | ${s.paymentMethod} | $${s.total.toLocaleString('es-CO')}`, 14, yPos);
          yPos += 6;
        });

        doc.save(`PanelaPro_Reporte_${config.trapicheName.replace(/\s+/g, '_')}.pdf`);
      } catch (err) {
        console.error('Error generating PDF:', err);
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  // Excel Export Handler
  const handleExportExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const wb = XLSX.utils.book_new();

        // Worksheet 1: Producción
        const productionData = batches.map(b => ({
          'Código Lote': b.code,
          'Fecha': b.date,
          'Caña Molida (kg)': b.caneAmountKg,
          'Panela Producida (kg)': b.panelaProducedKg,
          'Tipo Panela': b.panelaType,
          'Rendimiento (%)': b.rendimientoPercentage,
          'Estado': b.status,
          'Maestro Paila': b.operatorName,
          'Observaciones': b.observations
        }));
        const wsProduction = XLSX.utils.json_to_sheet(productionData);
        XLSX.utils.book_append_sheet(wb, wsProduction, 'Producción');

        // Worksheet 2: Inventario
        const inventoryData = inventory.map(i => ({
          'Código': i.code,
          'Nombre Ítem': i.name,
          'Categoría': i.category,
          'Cantidad Actual': i.quantity,
          'Unidad': i.unit,
          'Stock Mínimo': i.minStock,
          'Costo Unitario (COP)': i.costPerUnit,
          'Precio Venta (COP)': i.sellPricePerUnit,
          'Ubicación': i.location
        }));
        const wsInventory = XLSX.utils.json_to_sheet(inventoryData);
        XLSX.utils.book_append_sheet(wb, wsInventory, 'Inventario');

        // Worksheet 3: Ventas
        const salesData = sales.map(s => ({
          'N° Factura': s.invoiceCode,
          'Cliente': s.clientName,
          'Documento': s.clientDocument,
          'Fecha': s.date,
          'Medio de Pago': s.paymentMethod,
          'Total Facturado (COP)': s.total
        }));
        const wsSales = XLSX.utils.json_to_sheet(salesData);
        XLSX.utils.book_append_sheet(wb, wsSales, 'Ventas');

        XLSX.writeFile(wb, `PanelaPro_Datos_${config.trapicheName.replace(/\s+/g, '_')}.xlsx`);
      } catch (err) {
        console.error('Error generating Excel:', err);
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 bg-white p-2 sm:p-4">
      
      {/* Header Bar with Export Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#8893C2]" />
            <span>Módulo de Reportes & Analítica</span>
          </h2>
          <p className="text-xs text-black/70 mt-1 font-medium">
            Informes consolidados de rendimiento de molienda, rotación de inventario y balance de ventas.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-5 py-2.5 bg-[#FF0000] hover:bg-[#DD0000] text-white font-bold text-xs rounded-[30px] transition shadow-md flex items-center space-x-1.5 disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-white" />
            <span className="text-white">Exportar PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="px-5 py-2.5 bg-[#8893C2] hover:bg-[#7782B1] text-white font-bold text-xs rounded-[30px] transition shadow-md flex items-center space-x-1.5 disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span className="text-white">Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Production Stats Card */}
        <div className="bg-white p-6 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-[30px] bg-[#8893C2] text-white">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-bold text-black bg-[#A7B0D6]/30 px-3 py-1 rounded-[30px]">
              Rendimiento: {avgYield}%
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-black">Producción Consolidada</h3>
            <p className="text-2xl font-black text-black font-mono mt-1">
              {totalPanelaKg.toLocaleString()} <span className="text-xs text-black/60 font-normal">kg panela</span>
            </p>
            <p className="text-xs text-black/70 mt-1 font-medium">
              Caña total procesada: <strong className="text-black">{totalCaneKg.toLocaleString()} kg</strong>
            </p>
          </div>
        </div>

        {/* Inventory Stats Card */}
        <div className="bg-white p-6 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-[30px] bg-[#A7B0D6] text-white">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-bold text-black bg-[#A7B0D6]/30 px-3 py-1 rounded-[30px]">
              {inventory.length} Ítems
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-black">Valorización de Stock</h3>
            <p className="text-2xl font-black text-black font-mono mt-1">
              {storageService.formatCurrency(totalInventoryValue)}
            </p>
            <p className="text-xs text-black/70 mt-1 font-medium">
              Basado en costo unitario de materia prima y producto terminado.
            </p>
          </div>
        </div>

        {/* Sales Stats Card */}
        <div className="bg-white p-6 rounded-[24px] border border-[#A7B0D6]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-[30px] bg-[#8893C2] text-white">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-bold text-black bg-[#A7B0D6]/30 px-3 py-1 rounded-[30px]">
              {sales.length} Facturas
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-black">Facturación Comercial Total</h3>
            <p className="text-2xl font-black text-black font-mono mt-1">
              {storageService.formatCurrency(totalSalesCOP)}
            </p>
            <p className="text-xs text-black/70 mt-1 font-medium">
              Ingresos brutos acumulados en el período.
            </p>
          </div>
        </div>

      </div>

      {/* Production Performance Table Report */}
      <div className="bg-white rounded-[24px] border border-[#A7B0D6]/40 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-black flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#8893C2]" />
          <span>Informe de Rendimiento por Lote</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#A7B0D6]/15 border-b border-[#A7B0D6]/30 text-black font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Código</th>
                <th className="p-3.5">Fecha</th>
                <th className="p-3.5 text-right">Caña Entrada (kg)</th>
                <th className="p-3.5 text-right">Panela Salida (kg)</th>
                <th className="p-3.5 text-center">Rendimiento %</th>
                <th className="p-3.5">Tipo Presentación</th>
                <th className="p-3.5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A7B0D6]/30 font-medium text-black">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-[#A7B0D6]/10 transition">
                  <td className="p-3.5 font-mono font-bold text-black">{b.code}</td>
                  <td className="p-3.5 text-black/70">{b.date}</td>
                  <td className="p-3.5 text-right font-mono">{b.caneAmountKg.toLocaleString()}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-black">{b.panelaProducedKg.toLocaleString()}</td>
                  <td className="p-3.5 text-center font-mono font-black text-black">{b.rendimientoPercentage}%</td>
                  <td className="p-3.5 text-black/80">{b.panelaType}</td>
                  <td className="p-3.5">
                    <span className="px-3 py-1 rounded-[30px] text-[10px] font-bold bg-[#8893C2] text-white">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
