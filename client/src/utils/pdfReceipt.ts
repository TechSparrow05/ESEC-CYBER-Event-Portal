import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PaymentReceipt } from '../types';

export const generatePdfReceipt = (receipt: PaymentReceipt) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor: [number, number, number] = [10, 10, 10]; // #0A0A0A
  const accentIndigo: [number, number, number] = [79, 70, 229]; // #4F46E5
  const accentCyan: [number, number, number] = [6, 182, 212]; // #06B6D4

  // Top Accent Banner
  doc.setFillColor(...accentIndigo);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // College Branding Header
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ERODE SENGUNTHAR ENGINEERING COLLEGE', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  doc.text('Approved by AICTE, New Delhi & Affiliated to Anna University | Accredited by NAAC with "A" Grade', pageWidth / 2, 25, { align: 'center' });
  doc.text('Thudupathi, Perundurai, Erode - 638 057, Tamil Nadu, India', pageWidth / 2, 30, { align: 'center' });

  // Divider
  doc.setDrawColor(220, 220, 225);
  doc.setLineWidth(0.5);
  doc.line(14, 34, pageWidth - 14, 34);

  // Fest Title & Receipt Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...accentIndigo);
  doc.text('ESEC FIESTA 2026 - EVENT REGISTRATION CONFIRMATION', 14, 43);

  // Status Badge
  doc.setFillColor(16, 185, 129); // Emerald
  doc.roundedRect(pageWidth - 46, 38, 32, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFIED PAID', pageWidth - 30, 42.8, { align: 'center' });

  // Key Receipt Metadata in 2 Columns
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);

  const leftX = 14;
  const rightX = pageWidth / 2 + 10;
  let currentY = 53;

  doc.setFont('helvetica', 'bold');
  doc.text('Participant UID:', leftX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...accentIndigo);
  doc.text(receipt.participantId, leftX + 32, currentY);

  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Ref (UTR):', rightX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...primaryColor);
  doc.text(receipt.upiRefId, rightX + 35, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Date:', leftX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(receipt.timestamp).toLocaleString('en-IN'), leftX + 32, currentY);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Mode:', rightX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`UPI (${receipt.vpa})`, rightX + 35, currentY);

  // Participant Details Table
  currentY += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('Participant Profile', 14, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    head: [['Field', 'Details']],
    body: [
      ['Participant Full Name', receipt.participantName],
      ['Institution / College', receipt.collegeName],
      ['Email Address', receipt.participantEmail],
      ['Mobile Contact', receipt.participantPhone || 'N/A'],
      ['Participation Role', receipt.roleType + (receipt.teamCode ? ` (Team: ${receipt.teamCode})` : '')]
    ],
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    margin: { left: 14, right: 14 }
  });

  // Events Table
  const lastY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('Registered Events & Category Compliance', 14, lastY);

  const eventRows: any[] = [];
  if (receipt.technicalEventTitle) {
    eventRows.push(['1', receipt.technicalEventTitle, 'Technical (Max 1 Rule Compliant)', 'Confirmed']);
  }
  if (receipt.nonTechnicalEventTitle) {
    eventRows.push(['2', receipt.nonTechnicalEventTitle, 'Non-Technical (Max 1 Rule Compliant)', 'Confirmed']);
  }
  if (eventRows.length === 0) {
    eventRows.push(['1', 'Standard Festival Pass', 'Technical & Cultural Track', 'Confirmed']);
  }

  autoTable(doc, {
    startY: lastY + 3,
    head: [['#', 'Event Name', 'Category Constraint', 'Status']],
    body: eventRows,
    theme: 'grid',
    headStyles: {
      fillColor: accentIndigo,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    margin: { left: 14, right: 14 }
  });

  // Payment Breakdown
  const tableY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('Settlement Breakdown', 14, tableY);

  autoTable(doc, {
    startY: tableY + 3,
    body: [
      ['Event Registration Subtotal', `INR ${receipt.amount}.00`],
      ['Portal Processing & Gateway Surcharge', 'INR 0.00 (Waived)'],
      ['Grand Total Paid', `INR ${receipt.amount}.00`]
    ],
    theme: 'plain',
    styles: {
      fontSize: 9.5,
      cellPadding: 2.5
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: primaryColor },
      1: { halign: 'right', fontStyle: 'bold', textColor: accentIndigo }
    },
    margin: { left: 14, right: 14 }
  });

  // Footer Instructions & Verification QR Box
  const footerY = (doc as any).lastAutoTable.finalY + 12;

  // Box for instructions
  doc.setDrawColor(220, 220, 225);
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(14, footerY, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.text('Important Instructions for Event Day:', 18, footerY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('1. Please carry a digital or printed copy of this receipt along with your valid College Student ID card.', 18, footerY + 12);
  doc.text('2. Report to the Registration Desk (Dr. APJ Abdul Kalam Block) 30 minutes prior to event schedule.', 18, footerY + 17);
  doc.text('3. For disputes or queries, quote your 12-digit UTR and Participant UID: ' + receipt.participantId, 18, footerY + 22);

  // Digital Signature seal
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Authorized Computer Generated Document — No Physical Signature Required.', pageWidth / 2, 282, { align: 'center' });
  doc.text('ESEC Fest Convener Committee © 2026', pageWidth / 2, 287, { align: 'center' });

  // Save PDF
  doc.save(`ESEC-Receipt-${receipt.participantId}.pdf`);
};
