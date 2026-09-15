import React, { useState } from 'react';
import { Building2, Calculator, CheckCircle2, MapPin, ArrowRight, FileText, Landmark, ShieldAlert, Award } from 'lucide-react';
import { t } from '../i18n/translations';

export default function IndustryLicensingWizard({ currentLang }) {
  const [step, setStep] = useState(1);
  const [productSector, setProductSector] = useState('Electronics & IT Equipment');
  const [turnover, setTurnover] = useState('msme');

  const steps = [
    { num: 1, title: 'Sector & Product Selection' },
    { num: 2, title: 'Testing & Factory Readiness' },
    { num: 3, title: 'Fee & Royalty Estimator' },
    { num: 4, title: 'Submit Application (Manakonline)' }
  ];

  const calculateFees = () => {
    let baseAppFee = 1000;
    let inspectionFee = 7000;
    let markingFee = turnover === 'msme' ? 12000 : 25000;
    return {
      applicationFee: `₹${baseAppFee.toLocaleString('en-IN')}`,
      inspectionFee: `₹${inspectionFee.toLocaleString('en-IN')}`,
      markingFee: `₹${markingFee.toLocaleString('en-IN')}`,
      total: `₹${(baseAppFee + inspectionFee + markingFee).toLocaleString('en-IN')}`
    };
  };

  const fees = calculateFees();

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-[#1565C0] shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0B2345] font-heading leading-tight">
              Industry & MSME BIS Licensing & STI Navigator
            </h2>
            <p className="text-xs text-[#5B6B82] font-medium leading-none mt-1">
              Step-by-step Manakonline licensing wizard, Schema of Testing & Inspection (STI) guide
            </p>
          </div>
        </div>

        {/* MSME Subsidy Badge */}
        <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
          Simplified MSME Subsidies Enabled (20% Off)
        </span>
      </div>

      {/* Progress Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {steps.map((s) => {
          const isActive = step === s.num;
          return (
            <div
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#0B2345] text-white border-b-4 border-orange-500 shadow-md'
                  : 'bg-[#E9EEF5] border-slate-200 text-[#607087] hover:bg-slate-200/80'
              }`}
            >
              <span className={`text-[10px] font-mono block ${isActive ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
                Step 0{s.num}
              </span>
              <span className={`text-xs font-bold truncate block ${isActive ? 'text-white' : 'text-[#607087]'}`}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Content Body Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0B2345] font-heading">
                Select Product Category & Business Classification
              </h3>
              <p className="text-xs text-[#5B6B82] font-medium mt-0.5">
                Choose your manufacturing domain to determine mandatory IS certification requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                'Electronics & IT Equipment',
                'Food & Packaged Water',
                'Chemicals & Cement',
                'Toys & Consumer Goods',
                'Automotive Components',
                'Electrical Appliances'
              ].map((sec) => {
                const isSelected = productSector === sec;
                return (
                  <button
                    key={sec}
                    onClick={() => setProductSector(sec)}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer font-heading ${
                      isSelected
                        ? 'bg-blue-50/80 border-2 border-[#1565C0] text-[#0B2345] font-extrabold shadow-xs'
                        : 'bg-[#F5F8FC] border-[#C8D3E0] text-slate-700 hover:border-slate-400 hover:bg-white font-semibold'
                    }`}
                  >
                    {sec}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-[#0B2345] block mb-2 font-heading">
                Business Scale (Udyam MSME Registration status):
              </label>
              <div className="flex flex-col sm:flex-row gap-4 text-xs">
                <label className="flex items-center space-x-2.5 text-slate-800 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="turnover"
                    value="msme"
                    checked={turnover === 'msme'}
                    onChange={() => setTurnover('msme')}
                    className="accent-[#1565C0] w-4 h-4"
                  />
                  <span>Micro / Small Enterprise (Concession Rate Enabled)</span>
                </label>
                <label className="flex items-center space-x-2.5 text-slate-800 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="turnover"
                    value="large"
                    checked={turnover === 'large'}
                    onChange={() => setTurnover('large')}
                    className="accent-[#1565C0] w-4 h-4"
                  />
                  <span>Medium / Large Scale Industry</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0B2345] font-heading">
                Factory Readiness & Schema of Testing & Inspection (STI)
              </h3>
              <p className="text-xs text-[#5B6B82] font-medium mt-0.5">
                BIS requires in-house lab testing equipment and quality control personnel on premise.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-[#F5F8FC] rounded-xl border border-[#C8D3E0] flex items-start space-x-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B2345] font-heading block">Quality Manager Qualification</span>
                  <p className="text-slate-600 text-xs mt-0.5">Must appoint dedicated QC Chemist / Engineer with degree in relevant discipline.</p>
                </div>
              </div>

              <div className="p-4 bg-[#F5F8FC] rounded-xl border border-[#C8D3E0] flex items-start space-x-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B2345] font-heading block">In-House Testing Equipment</span>
                  <p className="text-slate-600 text-xs mt-0.5">Calibrated gauges, compression test rigs, microbiological incubators as per STI document.</p>
                </div>
              </div>

              <div className="p-4 bg-[#F5F8FC] rounded-xl border border-[#C8D3E0] flex items-start space-x-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B2345] font-heading block">Recognized Third-Party Lab Sample Clearance</span>
                  <p className="text-slate-600 text-xs mt-0.5">Initial factory sample testing must pass at NABL-accredited BIS laboratory.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0B2345] font-heading">
                Estimated BIS License Fee Calculator
              </h3>
              <p className="text-xs text-[#5B6B82] font-medium mt-0.5">
                Estimated breakdown of government application, inspection, and minimum marking fees.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-[#F5F8FC] p-4 rounded-xl border border-[#C8D3E0]">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Application Fee</span>
                <span className="text-[#0B2345] font-extrabold text-sm">{fees.applicationFee}</span>
              </div>
              <div className="bg-[#F5F8FC] p-4 rounded-xl border border-[#C8D3E0]">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Factory Inspection Fee</span>
                <span className="text-[#0B2345] font-extrabold text-sm">{fees.inspectionFee}</span>
              </div>
              <div className="bg-[#F5F8FC] p-4 rounded-xl border border-[#C8D3E0]">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Min Marking Fee</span>
                <span className="text-orange-600 font-extrabold text-sm">{fees.markingFee}</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <span className="text-[10px] text-[#1565C0] uppercase block font-bold">Est Total Initial Fee</span>
                <span className="text-[#1565C0] font-extrabold text-base">{fees.total}</span>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center py-6">
            <Award className="w-14 h-14 text-[#1565C0] mx-auto" />
            <h3 className="text-base sm:text-lg font-extrabold text-[#0B2345] font-heading">
              Ready to Submit Application via Manakonline Portal
            </h3>
            <p className="text-xs text-[#5B6B82] max-w-md mx-auto leading-relaxed">
              Your preliminary document checklist and STI readiness score is 100%. Click below to launch official BIS Manakonline portal with auto-filled form details.
            </p>
            <button
              onClick={() => alert('Redirecting to BIS Manakonline Portal (https://www.manakonline.in)...')}
              className="bg-[#0B2345] hover:bg-[#1565C0] text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all text-xs sm:text-sm cursor-pointer"
            >
              Launch Manakonline Application
            </button>
          </div>
        )}

        {/* Footer Navigation Controls */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="text-xs font-bold text-[#5B6B82] hover:text-[#0B2345] disabled:opacity-40 transition-colors cursor-pointer"
          >
            ← Previous Step
          </button>

          <button
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={step === 4}
            className="bg-[#0B2345] hover:bg-[#1565C0] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
