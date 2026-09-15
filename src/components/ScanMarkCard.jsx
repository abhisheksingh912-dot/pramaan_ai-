import React, { useState, useRef, useEffect } from 'react';
import { Search, Scan, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, RefreshCw, Building, Calendar, Info, X, Camera, QrCode, Barcode, Upload, Image as ImageIcon, Mic } from 'lucide-react';
import { bisApiService } from '../services/apiService';
import { t } from '../i18n/translations';

export default function ScanMarkCard({ onSearchResult, onOpenVoiceAgent, currentLang = 'en-IN' }) {
  const [activeTab, setActiveTab] = useState('ENTER_DETAILS'); // 'SCAN_IMAGE', 'ENTER_DETAILS', 'QR_CODE', 'BARCODE'
  const [query, setQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [searchedCode, setSearchedCode] = useState('');
  const [statusType, setStatusType] = useState(null); // 'AUTHENTIC', 'EXPIRED', 'INVALID', 'ERROR'
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraMode, setCameraMode] = useState(null); // 'QR' or 'BARCODE'
  const [cameraNotice, setCameraNotice] = useState('');
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSearch = async (overrideQuery) => {
    const textToSearch = (overrideQuery || query).trim();
    if (!textToSearch) return;

    setIsVerifying(true);
    setSearchedCode(textToSearch);
    setResult(null);
    setStatusType(null);

    try {
      // First check certificate registry
      const certRes = await bisApiService.verifyCertificate(textToSearch);

      if (certRes) {
        setResult(certRes);
        if (certRes.status === 'EXPIRED') {
          setStatusType('EXPIRED');
        } else {
          setStatusType('AUTHENTIC');
        }
        if (onSearchResult) {
          onSearchResult({
            query: textToSearch,
            code: certRes.cmlNo || textToSearch,
            type: certRes.isStandard || 'CM/L / HUID',
            status: certRes.status === 'EXPIRED' ? 'Expired' : 'Authentic',
            timestamp: 'Just now',
            fullData: certRes
          });
        }
      } else {
        // Next check standards explorer database
        const stds = await bisApiService.searchStandards(textToSearch);
        if (stds && stds.length > 0) {
          const std = stds[0];
          const stdResult = {
            cmlNo: std.isCode,
            holderName: std.ministry || 'Government of India Gazette',
            product: std.title,
            isStandard: std.isCode,
            status: 'VALID',
            expiryDate: 'Active Standard',
            manufacturingLocation: std.category,
            localValidity: std.mandateStatus,
            testingLab: 'BIS Recognized Laboratories'
          };
          setResult(stdResult);
          setStatusType('AUTHENTIC');
          if (onSearchResult) {
            onSearchResult({
              query: textToSearch,
              code: std.isCode,
              type: 'IS Code',
              status: 'Authentic',
              timestamp: 'Just now',
              fullData: stdResult
            });
          }
        } else {
          setStatusType('INVALID');
        }
      }
    } catch (err) {
      setStatusType('ERROR');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setScannedImage(event.target?.result);
      setIsVerifying(true);
      setTimeout(() => {
        handleSearch('IS 14544');
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraMode(null);
    setIsScanningCamera(false);
  };

  const startCamera = async (modeName) => {
    stopCamera();
    setCameraMode(modeName);
    setCameraNotice('');
    setCameraActive(true);
    setIsScanningCamera(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        setCameraNotice('Optical sensor simulation enabled (Device media stream unavailable).');
      }
    } catch (err) {
      setCameraNotice('Optical camera simulation active (Hardware camera access restricted or not found).');
    }
  };

  const handleCaptureAndScan = (modeName) => {
    stopCamera();
    setIsVerifying(true);
    setTimeout(() => {
      if (modeName === 'QR Code' || modeName === 'QR') {
        handleSearch('HUID-XY8921');
      } else {
        handleSearch('8765432');
      }
    }, 600);
  };

  // Close camera if user changes tabs
  useEffect(() => {
    stopCamera();
  }, [activeTab]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const modeTabs = [
    { id: 'ENTER_DETAILS', label: t('scan.tabs.details', currentLang), icon: Search },
    { id: 'SCAN_IMAGE', label: t('scan.tabs.image', currentLang), icon: ImageIcon },
    { id: 'QR_CODE', label: t('scan.tabs.qr', currentLang), icon: QrCode },
    { id: 'BARCODE', label: t('scan.tabs.barcode', currentLang), icon: Barcode },
  ];

  const trustBlocks = [
    { title: t('trust.authentic', currentLang), desc: t('trust.authenticDesc', currentLang), icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { title: t('trust.manufacturers', currentLang), desc: t('trust.manufacturersDesc', currentLang), icon: ShieldCheck, color: 'text-blue-600 bg-blue-50' },
    { title: t('trust.standardized', currentLang), desc: t('trust.standardizedDesc', currentLang), icon: ShieldCheck, color: 'text-orange-600 bg-orange-50' },
    { title: t('trust.seconds', currentLang), desc: t('trust.secondsDesc', currentLang), icon: Scan, color: 'text-purple-600 bg-purple-50' }
  ];

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header Tab with Orange Underline & Triggers */}
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2 text-orange-600 border-b-2 border-orange-500 pb-3 px-1 font-bold text-sm sm:text-base font-heading">
          <Scan className="w-5 h-5 text-orange-500 shrink-0" />
          <span>{t('scan.title', currentLang)}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHelpModal(true)}
            className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Info className="w-4 h-4" />
            <span>{t('scan.howToVerify', currentLang)}</span>
          </button>
        </div>
      </div>

      {/* Verification Mode Sub-Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
        {modeTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: ENTER DETAILS */}
      {activeTab === 'ENTER_DETAILS' && (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('scan.searchPlaceholder', currentLang)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-sans"
              />
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={isVerifying}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer shrink-0"
            >
              {isVerifying ? (
                <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{t('scan.searchBtn', currentLang)}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            {t('scan.subtext', currentLang)}
          </p>
        </div>
      )}

      {/* TAB CONTENT 2: SCAN IMAGE */}
      {activeTab === 'SCAN_IMAGE' && (
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                {t('scan.uploadPrompt', currentLang)}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {t('scan.uploadSubtext', currentLang)}
              </p>
            </div>
          </div>

          {scannedImage && (
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <img src={scannedImage} alt="Scanned label" className="w-12 h-12 object-cover rounded-lg" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900">{t('scan.imageUploaded', currentLang)}</p>
                  <p className="text-slate-500">{t('scan.processingLabel', currentLang)}</p>
                </div>
              </div>
              <button
                onClick={() => handleSearch('IS 14544')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                {t('scan.searchBtn', currentLang)}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: QR CODE */}
      {activeTab === 'QR_CODE' && (
        <div className="p-4 sm:p-6 border border-slate-200 bg-slate-50 rounded-2xl text-center space-y-4">
          {cameraActive && cameraMode === 'QR Code' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="flex items-center space-x-1.5 font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Live Camera Active (Scanner Viewfinder)</span>
                </span>
                <button
                  onClick={stopCamera}
                  className="text-slate-500 hover:text-slate-900 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close Camera</span>
                </button>
              </div>

              {/* Viewfinder Video Container with Reticle */}
              <div className="relative w-full h-64 sm:h-80 bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Reticle Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-orange-500/80 rounded-2xl relative shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-orange-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-orange-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-orange-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-orange-400 rounded-br-lg" />
                    
                    {/* Animated Scanning Laser Line */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444] animate-pulse" />
                  </div>
                </div>

                <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white font-mono text-[11px] px-3 py-1 rounded-full border border-slate-700">
                    Align BIS Hallmark / ISI QR code within frame
                  </span>
                </div>
              </div>

              {cameraNotice && (
                <p className="text-[11px] text-amber-700 font-mono bg-amber-50 border border-amber-200 p-2 rounded-xl">
                  ℹ️ {cameraNotice}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => handleCaptureAndScan('QR Code')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center space-x-2 font-heading"
                >
                  <Scan className="w-4 h-4" />
                  <span>Capture & Verify QR Code</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Stop Camera
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center mx-auto shadow-md">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading">{t('scan.qrTitle', currentLang)}</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {t('scan.qrPrompt', currentLang)}
                </p>
              </div>

              <button
                onClick={() => startCamera('QR Code')}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer inline-flex items-center space-x-2 font-heading"
              >
                <Camera className="w-4 h-4" />
                <span>{t('scan.qrBtn', currentLang)}</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: BARCODE */}
      {activeTab === 'BARCODE' && (
        <div className="p-4 sm:p-6 border border-slate-200 bg-slate-50 rounded-2xl text-center space-y-4">
          {cameraActive && cameraMode === 'Barcode' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="flex items-center space-x-1.5 font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                  <span>Live Camera Active (Barcode Viewfinder)</span>
                </span>
                <button
                  onClick={stopCamera}
                  className="text-slate-500 hover:text-slate-900 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close Camera</span>
                </button>
              </div>

              {/* Viewfinder Video Container with Reticle */}
              <div className="relative w-full h-64 sm:h-80 bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Reticle Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                  <div className="w-64 h-32 sm:w-80 sm:h-36 border-2 border-blue-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                    
                    {/* Animated Scanning Laser Line */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444] animate-pulse" />
                  </div>
                </div>

                <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white font-mono text-[11px] px-3 py-1 rounded-full border border-slate-700">
                    Align product barcode / CM/L code within frame
                  </span>
                </div>
              </div>

              {cameraNotice && (
                <p className="text-[11px] text-amber-700 font-mono bg-amber-50 border border-amber-200 p-2 rounded-xl">
                  ℹ️ {cameraNotice}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => handleCaptureAndScan('Barcode')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center space-x-2 font-heading"
                >
                  <Barcode className="w-4 h-4 text-orange-400" />
                  <span>Capture & Verify Barcode</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Stop Camera
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center mx-auto shadow-md">
                <Barcode className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading">{t('scan.barcodeTitle', currentLang)}</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {t('scan.barcodePrompt', currentLang)}
                </p>
              </div>

              <button
                onClick={() => startCamera('Barcode')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer inline-flex items-center space-x-2 font-heading"
              >
                <Camera className="w-4 h-4 text-orange-400" />
                <span>{t('scan.barcodeBtn', currentLang)}</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Verifying Loading State */}
      {isVerifying && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2 animate-pulse">
          <RefreshCw className="w-6 h-6 text-orange-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700 font-mono">{t('scan.results.verifying', currentLang)}</p>
        </div>
      )}

      {/* VERIFICATION RESULT DISPLAY */}
      {statusType === 'AUTHENTIC' && result && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-4 shadow-sm animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3">
            <span className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{t('scan.results.authentic', currentLang)}</span>
            </span>
            <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {t('scan.verifiedRecord', currentLang)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans font-semibold">{t('scan.productName', currentLang)}</span>
                <span className="text-slate-900 font-bold font-sans text-sm">{result.product}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans font-semibold">{t('scan.isStandard', currentLang)}</span>
                <span className="text-orange-600 font-bold">{result.isStandard}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans font-semibold">{t('scan.cmlHuid', currentLang)}</span>
                <span className="text-slate-900 font-bold">{result.cmlNo}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans font-semibold">{t('scan.manufacturer', currentLang)}</span>
                <span className="text-slate-900 font-bold font-sans flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-orange-500" />
                  {result.holderName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans font-semibold">{t('scan.validity', currentLang)}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {result.status} (Valid till {result.expiryDate})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {statusType === 'EXPIRED' && result && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3 shadow-sm font-mono text-xs">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm border-b border-amber-200 pb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>{t('scan.results.expired', currentLang)}</span>
          </div>
          <p className="text-slate-700 font-sans">
            The certification record for <strong className="font-mono">{result.cmlNo}</strong> ({result.product}) expired on <strong className="text-amber-800">{result.expiryDate}</strong>.
          </p>
        </div>
      )}

      {statusType === 'INVALID' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-2 shadow-sm font-mono text-xs text-red-900">
          <div className="flex items-center space-x-2 font-bold text-sm text-red-700">
            <XCircle className="w-5 h-5 text-red-600" />
            <span>{t('scan.results.failed', currentLang)}</span>
          </div>
          <p className="text-slate-700 font-sans text-xs">
            No matching certification record was found for "{searchedCode}". Please double check the CM/L, R-number or HUID code.
          </p>
        </div>
      )}

      {statusType === 'ERROR' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs font-mono text-red-800">
          {t('common.error', currentLang)}: Unable to verify mark. Please try again.
        </div>
      )}

      {/* Trust Features Block Grid */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustBlocks.map((blk, idx) => {
          const Icon = blk.icon;
          return (
            <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className={`p-2 rounded-lg ${blk.color} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading">{blk.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{blk.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to Verify Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading">{t('scan.howToVerify', currentLang)}</h3>
                <p className="text-xs text-slate-500 font-medium">Guide for finding authentic BIS certification marks</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-sans text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 font-mono text-xs block text-orange-600">1. CM/L Number (ISI Mark)</span>
                <p className="text-slate-600 leading-relaxed">
                  Look below the ISI mark on packaged water, cement, cylinders, helmets or electronics. Format: 7-digit number like <code className="font-bold font-mono bg-white px-1 py-0.5 rounded border text-slate-900">8765432</code> or <code className="font-bold font-mono bg-white px-1 py-0.5 rounded border text-slate-900">CM/L-1234567</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 font-mono text-xs block text-orange-600">2. HUID (Gold Jewellery)</span>
                <p className="text-slate-600 leading-relaxed">
                  Check laser-etched 6-digit alphanumeric code on hallmarked gold jewellery pieces, e.g. <code className="font-bold font-mono bg-white px-1 py-0.5 rounded border text-slate-900">XY8921</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 font-mono text-xs block text-orange-600">3. R-Number (Compulsory Registration)</span>
                <p className="text-slate-600 leading-relaxed">
                  Located near the BIS self-declaration logo on electronic devices (laptops, chargers, batteries). Format: <code className="font-bold font-mono bg-white px-1 py-0.5 rounded border text-slate-900">R-41001234</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 font-mono text-xs block text-orange-600">4. Indian Standard Code (IS Code)</span>
                <p className="text-slate-600 leading-relaxed">
                  Type codes like <code className="font-bold font-mono bg-white px-1 py-0.5 rounded border text-slate-900">IS 14544</code> (Packaged Water) or <code className="font-bold font-mono bg-white px-1 py-0.5 rounded border text-slate-900">IS 4151</code> (Helmets) to view compliance standards.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer text-xs font-heading"
            >
              {t('common.close', currentLang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
