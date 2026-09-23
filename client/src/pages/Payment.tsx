import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CreditCard, 
  Copy, 
  Check, 
  UploadCloud, 
  AlertCircle, 
  Lock,
  ArrowRight,
  FileImage,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth, generateShuffledUID } from '../context/AuthContext';
import { useRegistration } from '../context/RegistrationContext';
import { apiClient } from '../services/api';
import { Badge } from '../components/common/Badge';
import { PaymentReceipt } from '../types';

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    selectedTechnicalEvent, 
    selectedNonTechnicalEvent, 
    cartTotal, 
    roleType,
    teamCode 
  } = useRegistration();

  const collegeVpa = 'esecfest2026@okaxis';
  const payeeName = 'ESEC College Fest 2026';
  const totalAmount = cartTotal > 0 ? cartTotal : 250;

  // State
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [upiRefId, setUpiRefId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState<string>('');

  const upiIntentUrl = `upi://pay?pa=${collegeVpa}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(`Reg_${profile?.participantId || 'EVT'}`)}`;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(collegeVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setErrorMessage('Invalid file type: Please upload a PNG, JPEG, or WebP screenshot.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File too large: Maximum upload size is 10 MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setErrorMessage('Invalid file type: Please upload a PNG, JPEG, or WebP image.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const utrRegex = /^[0-9]{12}$/;
    if (!utrRegex.test(upiRefId.trim())) {
      setErrorMessage('Validation Error: UPI Reference ID (UTR) must be an exact 12-digit numeric number.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Missing Screenshot: Please upload a proof of payment screenshot.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = profile?.id || 'demo_user_1';

      // Step A: Request Google Cloud Storage signed upload URL from Express backend
      setUploadStatusText('Requesting Google Cloud Storage Signed URL...');
      const { uploadUrl, publicUrl } = await apiClient.getUploadUrl(selectedFile, userId);

      // Step B: Upload file directly to Google Cloud Storage
      setUploadStatusText('Uploading screenshot to Google Cloud Storage...');
      await apiClient.uploadFileToSignedUrl(uploadUrl, selectedFile);

      // Step C: Verify 12-digit UTR and complete payment
      setUploadStatusText('Verifying 12-digit UTR against database registry...');
      const registrationId = `reg_${Date.now()}`;
      const verifyRes = await apiClient.verifyPayment({
        registrationId,
        userId,
        upiRefId: upiRefId.trim(),
        screenshotUrl: publicUrl,
        amount: totalAmount
      });

      const paymentId = verifyRes.payment?.id || `PAY-${Date.now()}`;

      // Assemble official receipt
      const receipt: PaymentReceipt = {
        paymentId,
        registrationId,
        participantId: profile?.participantId || generateShuffledUID(),
        participantName: profile?.fullName || 'Participant',
        participantEmail: profile?.email || 'participant@esec.ac.in',
        participantPhone: profile?.phone || '',
        collegeName: profile?.college || 'Erode Sengunthar Engineering College',
        upiRefId: upiRefId.trim(),
        amount: totalAmount,
        vpa: collegeVpa,
        screenshotUrl: publicUrl,
        timestamp: new Date().toISOString(),
        status: 'verified',
        technicalEventTitle: selectedTechnicalEvent?.title,
        nonTechnicalEventTitle: selectedNonTechnicalEvent?.title,
        roleType: roleType || 'Solo',
        teamCode: teamCode || undefined
      };

      apiClient.saveReceiptLocal(receipt);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setUploadStatusText('Success! Routing to Official Receipt...');
      setTimeout(() => {
        navigate(`/invoice/${paymentId}`);
      }, 1000);

    } catch (err: any) {
      console.error('Payment verification failed:', err);
      setErrorMessage(err.message || 'Payment processing failed. Please check your transaction ID.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-8 sm:py-14 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto space-y-8 flex-1 flex flex-col justify-center animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="cyan" size="sm" className="mb-2">PAYMENT GATEWAY</Badge>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white">UPI Settlement & Verification</h1>
        <p className="text-xs sm:text-base text-brand-muted mt-1.5 px-2">
          Scan the college dynamic UPI QR code, submit your 12-digit UTR, and upload the proof screenshot for instant automated clearance.
        </p>
      </div>

      {/* Main Grid: Screen-adaptive flex/grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
        
        {/* Left Column: QR Code & VPA Box */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-6 border border-brand-border/80 flex flex-col items-center text-center justify-between space-y-5 sm:space-y-6">
          
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-brand-muted font-semibold">Official College UPI</span>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Live Dynamic VPA
              </span>
            </div>

            {/* Dynamic QR Code Card */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white flex flex-col items-center justify-center shadow-xl mx-auto max-w-[210px] sm:max-w-[240px]">
              <QRCodeSVG
                value={upiIntentUrl}
                size={180}
                level="H"
                includeMargin={false}
              />
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-mono mt-2 font-bold tracking-wider">
                SCAN WITH GPAY / PHONEPE / PAYTM
              </span>
            </div>

            {/* Total Fee Callout */}
            <div className="mt-4 p-3 rounded-xl bg-brand-surface border border-brand-border">
              <p className="text-[11px] text-brand-muted">Exact Settlement Amount:</p>
              <p className="text-xl sm:text-2xl font-mono font-extrabold text-brand-cyan">
                ₹{totalAmount}.00
              </p>
              <p className="text-[10px] text-brand-muted mt-0.5">Zero Convenience Fees</p>
            </div>
          </div>

          {/* VPA Copy Box */}
          <div className="w-full space-y-1.5">
            <p className="text-[11px] text-brand-muted font-semibold text-left">Or Pay Direct to UPI ID:</p>
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-black/50 border border-brand-border/80 text-xs">
              <span className="font-mono text-white select-all font-medium truncate text-xs sm:text-sm">
                {collegeVpa}
              </span>
              <button
                type="button"
                onClick={handleCopyVpa}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-indigo/20 hover:bg-brand-indigo/40 text-brand-cyan transition-colors shrink-0 ml-2"
              >
                {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px] sm:text-[11px] font-bold">{copiedVpa ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-brand-muted font-mono">
            <Lock className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Encrypted NPCI UPI Standard</span>
          </div>

        </div>

        {/* Right Column: 12-Digit UTR Input & GCS Screenshot Upload */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-8 border border-brand-border/80">
          
          <form onSubmit={handleSubmitPayment} className="space-y-5 sm:space-y-6">
            
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-brand-indigoLight" />
                <span>Verification Details</span>
              </h3>
              <p className="text-xs text-brand-muted mt-1">
                Once paid, enter your bank's 12-digit UTR / Transaction ID and attach the payment receipt screenshot.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 12-Digit UTR Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] sm:text-xs font-bold text-white font-mono uppercase tracking-wide">
                  12-Digit UPI Transaction ID (UTR) *
                </label>
                <span className="text-[10px] sm:text-[11px] font-mono text-brand-muted">
                  {upiRefId.length}/12 Digits
                </span>
              </div>
              <input
                type="text"
                value={upiRefId}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                  setUpiRefId(val);
                }}
                placeholder="e.g. 426819203814"
                maxLength={12}
                className="w-full px-4 py-3 bg-brand-surface rounded-xl border border-brand-border focus:border-brand-indigo focus:outline-none font-mono text-xs sm:text-sm tracking-widest text-white placeholder-brand-muted"
                required
              />
              <p className="text-[10px] text-brand-muted mt-1.5">
                Find this 12-digit numeric reference in your UPI app receipt (labeled UTR / UPI Ref No.).
              </p>
            </div>

            {/* GCS Screenshot Uploader */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-white font-mono uppercase tracking-wide mb-1.5">
                Upload Payment Proof Screenshot (GCS) *
              </label>

              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className="relative border-2 border-dashed border-brand-border/80 hover:border-brand-indigo/60 rounded-2xl p-4 sm:p-6 text-center transition-all bg-black/20 cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {previewUrl ? (
                  <div className="space-y-2.5">
                    <img 
                      src={previewUrl} 
                      alt="Screenshot Preview" 
                      className="max-h-32 sm:max-h-40 mx-auto rounded-lg object-contain border border-brand-border shadow-md" 
                    />
                    <div className="flex items-center justify-center gap-2 text-xs text-brand-cyan">
                      <FileImage className="w-4 h-4 shrink-0" />
                      <span className="font-mono truncate max-w-[180px]">{selectedFile?.name}</span>
                      <span className="text-brand-muted font-mono shrink-0">({Math.round((selectedFile?.size || 0) / 1024)} KB)</span>
                    </div>
                    <span className="text-[10px] text-brand-muted underline">Click or drag to replace screenshot</span>
                  </div>
                ) : (
                  <div className="space-y-2 py-1 sm:py-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center mx-auto text-brand-cyan">
                      <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <p className="text-xs font-semibold text-white">
                      Drag & Drop payment screenshot, or <span className="text-brand-cyan underline">browse</span>
                    </p>
                    <p className="text-[10px] text-brand-muted">
                      Supports PNG, JPEG, WebP up to 10 MB (Direct GCS Signed Upload)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload progress status text */}
            {isSubmitting && (
              <div className="p-3 rounded-xl bg-brand-indigo/15 border border-brand-indigo/30 flex items-center gap-3 text-xs text-brand-cyan">
                <Loader2 className="w-4 h-4 animate-spin text-brand-cyan shrink-0" />
                <span className="truncate">{uploadStatusText || 'Communicating with backend...'}</span>
              </div>
            )}

            {/* Submit Verification Button */}
            <button
              type="submit"
              disabled={isSubmitting || upiRefId.length !== 12 || !selectedFile}
              className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting & Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Payment & Generate Receipt (₹{totalAmount})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-brand-muted text-center pt-1">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Direct GCS Upload • Unique 12-Digit Duplicate Verification</span>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};
