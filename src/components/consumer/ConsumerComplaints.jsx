import React, { useState } from 'react';
import { AlertOctagon, Send, FileText, CheckCircle2, Clock, ShieldAlert, Sparkles, RefreshCw, Package, Building2, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { bisApiService } from '../../services/apiService';
import { t } from '../../i18n/translations';

export default function ConsumerComplaints({ currentLang }) {
  const [formData, setFormData] = useState({
    product: '',
    brand: '',
    location: '',
    licenseNo: '',
    description: '',
    isFakeMark: true
  });
  const [ticket, setTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.product.trim() || !formData.description.trim()) {
      setValidationError('Please complete all required fields (*).');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await bisApiService.submitComplaint(formData);
      setTicket(result);
    } catch (err) {
      setValidationError('Unable to record complaint at the moment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header Bar with BIS Identity & Tricolor Accent */}
      <div className="border-b border-slate-100 pb-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* BIS Identity Left */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950 p-0.5 border border-slate-800 shadow-md shrink-0 overflow-hidden">
              <img
                src="/pramaan-logo.jpg"
                onError={(e) => { e.currentTarget.src = '/pramaan-ai-logo.jpg'; }}
                alt="Pramaan AI Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="text-[10px] font-bold text-orange-600 font-mono">
                {t('header.hindiTitle', currentLang)}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading leading-tight">
                {t('header.engTitle', currentLang)}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                {t('header.subtitle', currentLang)}
              </p>
            </div>
          </div>

          {/* Title & Badge Right */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-2xs">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>BIS Enforcement Nodal</span>
            </span>
          </div>

        </div>

        {/* Title & Subtitle */}
        <div className="pt-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Consumer Grievance & Counterfeit Reporting Assistant
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
            Report fake ISI marks, uncertified products, or expired licenses directly to BIS enforcement officers.
          </p>
        </div>

        {/* Tricolor Line */}
        <div className="w-32 h-1 tricolor-accent rounded-full"></div>
      </div>

      {/* Main Form + Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FORM (7 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
              {validationError}
            </div>
          )}

          {/* Row 1: Product Category & Brand Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 font-heading block">
                Product Category / Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="e.g. Packaged Water, Helmet, Toy..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 font-heading block">
                Brand Name / Manufacturer
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Super Aqua, Safe Helmet..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 2: CM/L License No. & Purchase Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 font-heading block">
                CM/L License No. or HUID (if printed)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.licenseNo}
                  onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                  placeholder="e.g. CM/L-8765432 or HUID code..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 font-heading block">
                Purchase Location / Retailer Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Wholesale Market, New Delhi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Complaint Description with Character Counter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 font-heading block">
                Complaint Description / Violation Details <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {formData.description.length} / 500 characters
              </span>
            </div>
            <div className="relative">
              <textarea
                required
                maxLength={500}
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the quality issue, fake ISI logo, missing license number, or safety hazard..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Primary Action Button: Saffron Gradient */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-orange-500/20 cursor-pointer flex items-center justify-center space-x-2 font-heading tracking-wide uppercase"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI Analyzing & Routing Complaint...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>✈ File Grievance Complaint with BIS AI</span>
              </>
            )}
          </button>
        </form>

        {/* RIGHT COLUMN: DARK NAVY STATUS PANEL (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[420px] relative overflow-hidden space-y-6">
          
          {/* Top Status Header */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>Real-Time Ticket Status Tracker</span>
              </h4>
              <span className="flex items-center space-x-1.5 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>LIVE</span>
              </span>
            </div>

            {ticket ? (
              /* Ticket Created Display */
              <div className="space-y-4 animate-in fade-in">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">TICKET ID:</span>
                    <span className="text-orange-400 font-bold text-sm">{ticket.ticketId}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">AI Priority Tag:</span>
                    <span className="text-red-400 font-bold bg-red-950 px-2 py-0.5 rounded border border-red-800">
                      {ticket.priority || 'HIGH PRIORITY'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assigned Nodal Cell:</span>
                    <span className="text-slate-200 font-bold">{ticket.assignedOfficer || 'BIS Enforcement Cell'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Est Resolution:</span>
                    <span className="text-emerald-400 font-bold">{ticket.estimatedResolution || '48 Hours'}</span>
                  </div>
                </div>

                {/* Live Step Progression */}
                <div className="space-y-2.5 text-xs font-mono pt-1">
                  <div className="flex items-center space-x-2.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>✓ Complaint securely submitted</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>✓ AI analyzed & assigned priority</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-orange-400 animate-pulse">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>✓ Complaint routed to BIS Enforcement Cell</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-slate-500">
                    <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-bold">4</span>
                    <span>✓ Real-time status tracking</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Initial Guidance Display */
              <div className="space-y-4">
                <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                  Fill the form on the left to submit a consumer complaint. AI will auto-assign priority and route it to the BIS Enforcement Cell.
                </p>

                {/* 4-Step Default Flow */}
                <div className="space-y-3 text-xs font-mono pt-2">
                  <div className="flex items-center space-x-2.5 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>✓ Complaint securely submitted</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>✓ AI analyzes and assigns priority</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>✓ Complaint routed to BIS Enforcement Cell</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>✓ Real-time status tracking</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Notice */}
          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 font-mono relative z-10">
            Complaints are governed under Section 29 of BIS Act, 2016.
          </div>
        </div>

      </div>

    </div>
  );
}
