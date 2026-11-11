import React, { useState } from 'react';
import { Course, SiteSettings } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  X,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';

interface PaymentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  settings?: SiteSettings | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  course,
  isOpen,
  onClose,
  onPaymentSuccess,
  settings,
}) => {
  const { currentUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Card'>('Bank Transfer');
  const [providerReference, setProviderReference] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<any | null>(null);

  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!isOpen || !course) return null;

  const basePrice = course.discountedPrice && course.discountedPrice > 0 ? course.discountedPrice : course.price;
  const finalAmount = Math.max(0, basePrice - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    setCouponSuccess(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, originalAmount: basePrice }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountAmount(data.discount);
        setCouponSuccess(`Coupon applied! You saved PKR ${data.discount.toLocaleString()}`);
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon');
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    if (!currentUser) return;
    if (!providerReference.trim()) {
      setPaymentError('Please enter your transaction ID or sender account number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          courseId: course.id,
          originalPrice: course.price,
          discount: (course.price - basePrice) + discountAmount,
          finalAmount,
          paymentMethod,
          providerReference: providerReference.trim(),
          proofNotes: proofNotes.trim(),
        }),
      });

      if (res.ok) {
        const paymentRecord = await res.json();
        setSubmittedStatus(paymentRecord);
      } else {
        const err = await res.json();
        setPaymentError('Payment submission error: ' + (err.error || 'Please try again'));
      }
    } catch (err) {
      console.error(err);
      setPaymentError('Network error submitting payment proof. Please check your connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0b152d] border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Secure Course Checkout (PKR)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedStatus ? (
          /* Confirmation Screen after submitting */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Payment Verification Under Review
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-amber-300 font-bold">{currentUser?.fullName}</span>. Your fee submission for <span className="text-white font-semibold">{course.title}</span> has been logged under Transaction ID:
              </p>
              <div className="inline-block px-3 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-amber-400">
                {submittedStatus.transactionId}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-left text-xs text-slate-400 space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span>Course:</span>
                <span className="text-white font-medium">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold font-mono">PKR {submittedStatus.finalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="text-slate-200">{submittedStatus.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-amber-400 font-bold uppercase tracking-wider">{submittedStatus.paymentStatus}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              The Super Admin / Finance team will verify the bank/wallet reference. Your course access will unlock automatically in your student dashboard upon approval.
            </p>

            <button
              onClick={() => {
                onPaymentSuccess();
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30"
            >
              Go to My Student Dashboard
            </button>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handleSubmitPayment} className="p-6 space-y-6">
            {paymentError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}
            {/* Course Summary Card */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Enrolling in Course
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                  {course.title}
                </h4>
                <span className="text-[11px] text-slate-400">
                  {course.duration} • Lifetime Access
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block line-through">
                  PKR {course.price.toLocaleString()}
                </span>
                <span className="text-lg font-black text-amber-400 font-['Space_Grotesk']">
                  PKR {finalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Institute Promo / Coupon Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOMEZATECH or ZOHAIBFUTURE"
                  className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/30 transition-all"
                >
                  Apply
                </button>
              </div>
              {couponSuccess && (
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                Select Payment Channel:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Bank Transfer')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'Bank Transfer'
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-400 mb-1" />
                  <div className="text-xs">Bank Transfer</div>
                  <div className="text-[10px] text-slate-400">Meezan IBAN</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('EasyPaisa')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'EasyPaisa'
                      ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400 mb-1" />
                  <div className="text-xs">EasyPaisa</div>
                  <div className="text-[10px] text-slate-400">Mobile Account</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'JazzCash'
                      ? 'bg-rose-600/20 border-rose-500 text-white font-bold shadow-md shadow-rose-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-rose-400 mb-1" />
                  <div className="text-xs">JazzCash</div>
                  <div className="text-[10px] text-slate-400">Mobile Account</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'Card'
                      ? 'bg-amber-600/20 border-amber-500 text-white font-bold shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-400 mb-1" />
                  <div className="text-xs">Debit Card</div>
                  <div className="text-[10px] text-slate-400">Direct Online</div>
                </button>
              </div>
            </div>

            {/* Payment Details Instruction Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-400/20 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Official Account Information:
              </span>

              {paymentMethod === 'Bank Transfer' && (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Bank Name:</span>
                    <span className="font-semibold text-white">Meezan Bank Ltd.</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Account Title:</span>
                    <span className="font-semibold text-white">{settings?.bank_title || 'ZA Global Tech Institute'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">IBAN / Account:</span>
                    <div className="flex items-center gap-1.5 font-mono text-amber-300 font-bold">
                      <span>{settings?.bank_account || 'PK98 MEZN 0001 2345 6789 0101'}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(settings?.bank_account || 'PK98 MEZN 0001 2345 6789 0101', 'bank')}
                        className="p-1 hover:text-white"
                        title="Copy IBAN"
                      >
                        {copiedField === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'EasyPaisa' && (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">EasyPaisa Account:</span>
                    <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold">
                      <span>{settings?.easypaisa_account || '0300-1234567'}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(settings?.easypaisa_account || '0300-1234567', 'ep')}
                        className="p-1 hover:text-white"
                      >
                        {copiedField === 'ep' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Account Title:</span>
                    <span className="font-semibold text-white">Zohaib Ali (ZA Global Tech)</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'JazzCash' && (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">JazzCash Account:</span>
                    <div className="flex items-center gap-1.5 font-mono text-rose-400 font-bold">
                      <span>{settings?.jazzcash_account || '0300-1234567'}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(settings?.jazzcash_account || '0300-1234567', 'jc')}
                        className="p-1 hover:text-white"
                      >
                        {copiedField === 'jc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Account Title:</span>
                    <span className="font-semibold text-white">Zohaib Ali (ZA Global Tech)</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <p className="text-xs text-slate-300">
                  Please proceed with bank transfer or mobile wallet, or submit your card authorization reference code below.
                </p>
              )}
            </div>

            {/* Input fields for Reference and Notes */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Transaction ID / Sender Phone / Reference Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={providerReference}
                  onChange={(e) => setProviderReference(e.target.value)}
                  placeholder="e.g. TRX99823471 or 0300-XXXXXXX"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Optional Notes / Bank Name / Date
                </label>
                <input
                  type="text"
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="e.g. Paid via Meezan app at 4:30 PM"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block uppercase">Payable Total</span>
                <span className="text-xl font-black text-amber-400 font-['Space_Grotesk']">
                  PKR {finalAmount.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Verifying...' : 'Submit Payment for Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
