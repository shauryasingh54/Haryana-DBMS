import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Executive One-Tap PDF Export Generator
 */
export function generateExecutivePDF(executiveData, deliverables, invoices) {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('HARYANA DBMS - EXECUTIVE FINANCIAL SUMMARY', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${dateStr} | Role: Executive Management`, 14, 28);
  doc.text(`System Status: Operational | Haryana Public Works & Inspection DBMS`, 14, 34);

  // Financial KPI Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Key Financial Summary (Real-Time Aggregated)', 14, 50);

  const summary = executiveData.summary || {};
  const kpiData = [
    ['Total Inspection Volume', `${summary.total_deliverables || 0} Reports Submitted`],
    ['Total Invoiced Amount', `INR ${(summary.total_invoiced_inr || 0).toLocaleString('en-IN')}`],
    ['Certified Balance (Ready for Billing)', `INR ${(summary.certified_balance_inr || 0).toLocaleString('en-IN')}`],
    ['Pending / Zero-Value Balance (QA Review)', `INR ${(summary.pending_zero_value_balance_inr || 0).toLocaleString('en-IN')}`],
    ['Grand Total Portfolio Value', `INR ${(summary.grand_total_portfolio_inr || 0).toLocaleString('en-IN')}`]
  ];

  doc.autoTable({
    startY: 55,
    head: [['Financial Metric', 'Aggregated Total']],
    body: kpiData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 4 }
  });

  // District Performance Breakdown
  const finalY1 = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. District Financial & Inspection Breakdown', 14, finalY1);

  const districtRows = (executiveData.districtBreakdown || []).map(d => [
    d.district,
    d.TotalReports,
    `INR ${(d.Invoiced * 100000).toLocaleString('en-IN')}`,
    `INR ${(d.Certified * 100000).toLocaleString('en-IN')}`,
    `INR ${(d.PendingZeroValue * 100000).toLocaleString('en-IN')}`
  ]);

  doc.autoTable({
    startY: finalY1 + 5,
    head: [['District Name', 'Total Reports', 'Invoiced (INR)', 'Certified (INR)', 'Pending / Zero-Value']],
    body: districtRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  // Deliverables Audit Trail
  const finalY2 = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Batched Inspection Deliverables & Mapping Audit', 14, finalY2);

  const deliverableRows = (deliverables || []).map(del => [
    del.id,
    del.title.length > 30 ? del.title.substring(0, 30) + '...' : del.title,
    del.district,
    del.status,
    `INR ${(del.certified_value || del.estimated_value).toLocaleString('en-IN')}`,
    del.invoice_id || 'NOT_MAPPED'
  ]);

  doc.autoTable({
    startY: finalY2 + 5,
    head: [['Report ID', 'Deliverable Title', 'District', 'Status', 'Valuation', 'Linked Invoice']],
    body: deliverableRows,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 2.5 }
  });

  // Footer Signature Line
  const finalY3 = doc.lastAutoTable.finalY + 20;
  if (finalY3 < 270) {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Certified by Executive Management — Haryana DBMS Modernization System', 14, finalY3);
    doc.text('Official System Stamp & Audit Trail Verification Complete', 14, finalY3 + 6);
  }

  doc.save(`Haryana_DBMS_Executive_Summary_${new Date().toISOString().substring(0, 10)}.pdf`);
}

/**
 * Executive One-Tap Excel Summary & Ledger Generator
 */
export function generateExecutiveExcel(executiveData, deliverables, invoices) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Financial Summary
  const summary = executiveData.summary || {};
  const summaryData = [
    { Metric: 'Report Title', Value: 'Haryana DBMS Modernization Executive Financial Ledger' },
    { Metric: 'Generated Date', Value: new Date().toLocaleString('en-IN') },
    { Metric: 'Total Inspection Deliverables', Value: summary.total_deliverables },
    { Metric: 'Total Certified Invoiced Value (INR)', Value: summary.total_invoiced_inr },
    { Metric: 'Certified Balance Ready for Invoice (INR)', Value: summary.certified_balance_inr },
    { Metric: 'Pending Zero-Value / QA Balance (INR)', Value: summary.pending_zero_value_balance_inr },
    { Metric: 'Grand Total Portfolio Value (INR)', Value: summary.grand_total_portfolio_inr }
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive KPI Summary');

  // Sheet 2: District Breakdown
  const districtRows = (executiveData.districtBreakdown || []).map(d => ({
    District: d.district,
    TotalReports: d.TotalReports,
    Invoiced_INR: d.Invoiced * 100000,
    Certified_INR: d.Certified * 100000,
    PendingZeroValue_INR: d.PendingZeroValue * 100000
  }));
  const wsDistrict = XLSX.utils.json_to_sheet(districtRows);
  XLSX.utils.book_append_sheet(wb, wsDistrict, 'District Financial Ledger');

  // Sheet 3: Full Inspection Deliverables Master Ledger
  const deliverablesRows = (deliverables || []).map(del => ({
    Report_ID: del.id,
    Title: del.title,
    District: del.district,
    Engineer: del.engineer_name,
    Submission_Date: del.submission_date,
    Status: del.status,
    Raw_File: del.raw_file_name,
    Estimated_Value_INR: del.estimated_value,
    Certified_Value_INR: del.certified_value,
    Invoice_ID: del.invoice_id || 'UNMAPPED',
    Notes: del.notes
  }));
  const wsDeliverables = XLSX.utils.json_to_sheet(deliverablesRows);
  XLSX.utils.book_append_sheet(wb, wsDeliverables, 'Inspection Deliverables');

  // Sheet 4: Invoices Mapping Master
  const invoiceRows = (invoices || []).map(inv => ({
    Invoice_ID: inv.id,
    Invoice_Number: inv.invoice_number,
    Billing_Date: inv.billing_date,
    District: inv.district,
    Total_Amount_INR: inv.total_amount,
    Status: inv.status,
    Mapped_Deliverable_Count: inv.deliverable_ids ? inv.deliverable_ids.length : 0,
    Mapped_Deliverables: inv.deliverable_ids ? inv.deliverable_ids.join(', ') : ''
  }));
  const wsInvoices = XLSX.utils.json_to_sheet(invoiceRows);
  XLSX.utils.book_append_sheet(wb, wsInvoices, 'Certified Invoices');

  XLSX.writeFile(wb, `Haryana_DBMS_Executive_Ledger_${new Date().toISOString().substring(0, 10)}.xlsx`);
}
