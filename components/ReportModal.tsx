'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Send, Mail, Loader2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductTitle?: string;
  defaultProductUrl?: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  defaultProductTitle = '',
  defaultProductUrl = '',
}: ReportModalProps) {
  const [reportType, setReportType] = useState<string>('Sold Out / Out of Stock');
  const [productTitle, setProductTitle] = useState(defaultProductTitle);
  const [productUrl, setProductUrl] = useState(defaultProductUrl);
  const [userEmail, setUserEmail] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          productTitle,
          productUrl,
          userEmail,
          description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (data.mailtoUrl) setMailtoUrl(data.mailtoUrl);
      } else {
        alert(data.error || 'Failed to submit report.');
      }
    } catch (err) {
      console.error('Report submission failed:', err);
      alert('Network error. Please try again or email yjongsung1211@gmail.com directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/[0.08] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-[#121316] mb-2">
              Report Successfully Sent!
            </h3>
            <p className="text-xs text-zinc-600 mb-6 max-w-sm mx-auto leading-relaxed">
              Your report has been logged and forwarded directly to operations at <strong>yjongsung1211@gmail.com</strong>. We will review and update the inventory promptly.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              {mailtoUrl && (
                <a
                  href={mailtoUrl}
                  className="px-5 py-2.5 rounded-xl bg-black/[0.05] hover:bg-black/[0.08] text-xs font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Mail className="w-4 h-4 text-[#B57C1E]" />
                  <span>Open in Mail App</span>
                </a>
              )}
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-[#121316] hover:bg-black text-white text-xs font-bold transition-all shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#121316]">
                  Report an Issue or Sold Out Item
                </h3>
                <p className="text-[11px] text-zinc-500 font-medium">
                  Direct to operations: <span className="font-bold text-zinc-700">yjongsung1211@gmail.com</span>
                </p>
              </div>
            </div>

            {/* Issue Type Selector */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Issue Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'Sold Out / Out of Stock', label: '🛒 Sold Out / Out of Stock' },
                  { id: 'Broken / Wrong Link', label: '🔗 Broken or Wrong Link' },
                  { id: 'Styling / Image Glitch', label: '🎨 Virtual Try-On / Image Glitch' },
                  { id: 'General Feedback', label: '💬 General Feedback / Suggestion' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setReportType(t.id)}
                    className={`p-2.5 rounded-xl font-bold border text-left transition-all ${
                      reportType === t.id
                        ? 'bg-[#121316] text-white border-[#121316] shadow-sm'
                        : 'bg-zinc-50 text-zinc-700 border-black/[0.08] hover:bg-zinc-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Title / Page */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Product Name or Page
              </label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. Good American Blazer, Look 01, Virtual Try-on result"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-black/[0.08] text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#121316] transition-all"
              />
            </div>

            {/* Product URL */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Item or Page URL (Optional)
              </label>
              <input
                type="text"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://www.shopbop.com/... or page URL"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-black/[0.08] text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#121316] transition-all"
              />
            </div>

            {/* User Email */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Your Email (For follow-up)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-black/[0.08] text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#121316] transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Details & Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the sold-out size/color or the issue you encountered."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-black/[0.08] text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#121316] transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={`mailto:yjongsung1211@gmail.com?subject=[StylingHelper%20Direct%20Report]&body=Issue:%20${encodeURIComponent(
                  reportType
                )}`}
                className="text-[11px] text-zinc-500 hover:text-zinc-800 underline flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5 text-[#B57C1E]" />
                <span>Send Direct Email</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl hover:bg-zinc-100 text-zinc-600 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#121316] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Submit Report</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
