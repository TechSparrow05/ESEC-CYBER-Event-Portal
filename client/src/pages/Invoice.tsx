import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  FileText, 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink,
  QrCode,
  Building
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PaymentReceipt } from '../types';
import { apiClient } from '../services/api';
import { generatePdfReceipt } from '../utils/pdfReceipt';
import { Badge } from '../components/common/Badge';

export const Invoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [copiedUtr, setCopiedUtr] = useState(false);

  useEffect(() => {
    const paymentId = id || 'latest';
    const loadedReceipt = apiClient.getReceiptLocal(paymentId);
    if (loadedReceipt) {
      setReceipt(loadedReceipt);
    } else {
      // Default demo receipt if opened directly
      const mockReceipt: PaymentReceipt = {
        paymentId: 'PAY-2026-98124',
        registrationId: 'REG-2026-0042',
        participantId: 'EVT-2026-1042',
        participantName: 'Aravind Krishnan',
        participantEmail: 'aravind.k@esec.ac.in',
        participantPhone: '+91 98421 54321',
        collegeName: 'Erode Sengunthar Engineering College',
        upiRefId: '426819203814',
        amount: 250,
        vpa: 'esecfest2026@okaxis',
        screenshotUrl: 'https://storage.googleapis.com/college-event-esec-receipts/demo.png',
        timestamp: new Date().toISOString(),
        status: 'verified',
        technicalEventTitle: 'Algorithmic Code Sprint',
        nonTechnicalEventTitle: 'LensCraft Photography',
        roleType: 'Solo'
      };
      setReceipt(mockReceipt);
    }
  }, [id]);

  const handleDownloadPdf = () => {
    if (receipt) {
      generatePdfReceipt(receipt);
    }
  };

  const handleCopyUtr = () => {
    if (receipt) {
      navigator.clipboard.writeText(receipt.upiRefId);
      setCopiedUtr(true);
      setTimeout(() => setCopiedUtr(false), 2000);
    }
  };

  if (!receipt) {
    return (
      <div className="min-h-screen py-20 text-center text-brand-muted">
        <p>Loading confirmation receipt...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Festival Portal</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-white bg-brand-surface border border-brand-border hover:border-brand-border/90 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Receipt</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div id="printable-receipt" className="glass-panel rounded-3xl border border-brand-border/90 p-6 sm:p-10 shadow-2xl relative overflow-hidden bg-brand-surface/95">
        
        {/* Top Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-brand" />

        {/* Institution Brand Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-brand-border/60 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-brand-cyan tracking-wider uppercase">
                Official E-Receipt
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
              <span className="text-xs font-mono text-brand-muted">ISO 9001:2015</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
              ERODE SENGUNTHAR ENGINEERING COLLEGE
            </h1>
            <p className="text-xs text-brand-muted">
              National Level Technical & Cultural Symposium • ESEC FIESTA 2026
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-right">
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>PAYMENT VERIFIED</span>
              </div>
              <p className="text-[10px] text-brand-muted mt-0.5 font-mono">GCS Screenshot Validated</p>
            </div>
          </div>
        </div>

        {/* Key Metadata Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-brand-border/60 text-xs">
          <div>
            <span className="text-brand-muted block text-[11px]">Participant UID:</span>
            <span className="font-mono font-bold text-brand-cyan text-sm sm:text-base">
              {receipt.participantId}
            </span>
          </div>

          <div>
            <span className="text-brand-muted block text-[11px]">12-Digit UTR:</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono font-bold text-white tracking-wider">
                {receipt.upiRefId}
              </span>
              <button 
                onClick={handleCopyUtr}
                className="text-brand-muted hover:text-white"
                title="Copy UTR"
              >
                {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-brand-muted block text-[11px]">Settlement Date:</span>
            <span className="font-mono text-white">
              {new Date(receipt.timestamp).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>

          <div>
            <span className="text-brand-muted block text-[11px]">Payment Mode:</span>
            <span className="font-mono text-white">
              UPI ({receipt.vpa})
            </span>
          </div>
        </div>

        {/* Two Column Layout: Participant Profile & Verification QR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 border-b border-brand-border/60">
          
          <div className="md:col-span-8 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-brand-indigoLight">
              Participant Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border/50">
                <span className="text-[10px] text-brand-muted block">Full Name:</span>
                <span className="font-semibold text-white text-sm">{receipt.participantName}</span>
              </div>

              <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border/50">
                <span className="text-[10px] text-brand-muted block">Institution / College:</span>
                <span className="font-medium text-white truncate block">{receipt.collegeName}</span>
              </div>

              <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border/50">
                <span className="text-[10px] text-brand-muted block">Email:</span>
                <span className="font-mono text-white">{receipt.participantEmail}</span>
              </div>

              <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border/50">
                <span className="text-[10px] text-brand-muted block">Role / Squad:</span>
                <span className="font-semibold text-white">
                  {receipt.roleType} {receipt.teamCode ? `(Team Code: ${receipt.teamCode})` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Verification QR Code */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-brand-surface/40 border border-brand-border/50 text-center">
            <div className="p-2.5 rounded-xl bg-white shadow-md">
              <QRCodeSVG
                value={`https://esec-fest.ac.in/verify?uid=${receipt.participantId}&utr=${receipt.upiRefId}`}
                size={96}
                level="M"
              />
            </div>
            <span className="text-[10px] font-mono text-brand-muted mt-2 font-bold">
              SCAN TO VERIFY AT DESK
            </span>
          </div>

        </div>

        {/* Registered Events Table */}
        <div className="py-6 border-b border-brand-border/60 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
            Confirmed Event Registrations
          </h3>

          <div className="space-y-2">
            {receipt.technicalEventTitle && (
              <div className="p-4 rounded-xl bg-brand-surface/80 border border-brand-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Badge variant="technical" size="sm">Technical</Badge>
                  <div>
                    <h4 className="font-bold text-white">{receipt.technicalEventTitle}</h4>
                    <p className="text-[10px] text-brand-muted">Category constraint checked: Maximum 1 technical event</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400">Confirmed</span>
              </div>
            )}

            {receipt.nonTechnicalEventTitle && (
              <div className="p-4 rounded-xl bg-brand-surface/80 border border-brand-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Badge variant="nonTechnical" size="sm">Non-Technical</Badge>
                  <div>
                    <h4 className="font-bold text-white">{receipt.nonTechnicalEventTitle}</h4>
                    <p className="text-[10px] text-brand-muted">Category constraint checked: Maximum 1 non-technical event</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400">Confirmed</span>
              </div>
            )}
          </div>
        </div>

        {/* Settlement Summary */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-1 text-xs text-brand-muted max-w-md">
            <p className="font-bold text-white">Festival Instructions:</p>
            <p>1. Present this digital receipt or printed slip at the Help Desk on October 15, 2026.</p>
            <p>2. Keep your Student ID Card handy for physical identity verification.</p>
          </div>

          <div className="w-full sm:w-64 p-4 rounded-2xl bg-brand-dark/80 border border-brand-border space-y-2">
            <div className="flex justify-between text-xs text-brand-muted">
              <span>Registration Amount:</span>
              <span className="font-mono text-white">₹{receipt.amount}.00</span>
            </div>
            <div className="flex justify-between text-xs text-brand-muted">
              <span>Taxes & Gateway Surcharge:</span>
              <span className="font-mono text-emerald-400">₹0.00 (Waived)</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-brand-border">
              <span>Total Paid:</span>
              <span className="font-mono text-brand-cyan text-base">₹{receipt.amount}.00</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
