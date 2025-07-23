import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (data, columns, title) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Create table
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.key] || '')),
    startY: 35,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportToExcel = (data, columns, title) => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Prepare data for Excel
  const excelData = data.map(row => {
    const excelRow = {};
    columns.forEach(col => {
      excelRow[col.header] = row[col.key] || '';
    });
    return excelRow;
  });
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, title);
  
  // Save file
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
};

export const exportMatrixToPDF = (matrixData, dates, title) => {
  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Prepare headers
  const headers = ['Employee', ...dates.map(d => d.toString())];
  
  // Prepare body data
  const bodyData = matrixData.map(employee => [
    employee.employee_name,
    ...dates.map(date => employee[date.toString()] || '-')
  ]);
  
  // Create table
  doc.autoTable({
    head: [headers],
    body: bodyData,
    startY: 35,
    styles: {
      fontSize: 6,
      cellPadding: 1,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
    },
    columnStyles: {
      0: { cellWidth: 40 }, // Employee name column wider
    },
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportMatrixToExcel = (matrixData, dates, title) => {
  const wb = XLSX.utils.book_new();
  
  // Prepare data
  const excelData = matrixData.map(employee => {
    const row = { 'Employee Name': employee.employee_name };
    dates.forEach(date => {
      row[date.toString()] = employee[date.toString()] || '-';
    });
    return row;
  });
  
  const ws = XLSX.utils.json_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, title);
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
};