import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Mail, Award, Search, Filter, ShieldCheck, ExternalLink } from 'lucide-react';
import { bisApiService } from '../../services/apiService';
import { t } from '../../i18n/translations';

export default function BisLabFinder({ currentLang = 'en-IN' }) {
  const [labs, setLabs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lng: 77.209, city: 'Delhi NCR (Default Hub)' });
  const [isLocating, setIsLocating] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  const categories = ['ALL', 'Food & Beverages', 'Electronics', 'Electrical', 'Chemical', 'Textile', 'Mechanical', 'Automotive'];

  const fetchLabs = async (lat, lng, cat) => {
    const data = await bisApiService.findNearbyLabs(lat, lng, cat);
    setLabs(data);
    if (data.length > 0 && !selectedLab) {
      setSelectedLab(data[0]);
    }
  };

  useEffect(() => {
    fetchLabs(userLocation.lat, userLocation.lng, selectedCategory);
  }, [userLocation, selectedCategory]);

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            city: 'Your Current GPS Location'
          };
          setUserLocation(newLoc);
          setIsLocating(false);
        },
        (err) => {
          alert('GPS permission denied or unavailable. Using default regional hub (Delhi NCR).');
          setIsLocating(false);
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#D4DEE9] shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D4DEE9]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <MapPin className="w-5 h-5 text-[#138808]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B2345] flex items-center gap-2">
              {t('labs.title', currentLang)}
              <span className="text-[10px] font-mono bg-[#E8F5E9] text-[#138808] px-2 py-0.5 rounded border border-[#A5D6A7] font-bold">
                {t('labs.nablAccredited', currentLang)}
              </span>
            </h2>
            <p className="text-xs text-[#607087]">
              {t('labs.subtitle', currentLang)}
            </p>
          </div>
        </div>

        <button
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="bg-[#138808] hover:bg-[#0f6b06] text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center space-x-2 text-xs cursor-pointer"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? t('labs.locating', currentLang) : t('labs.useGps', currentLang)}</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-[#607087] shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0B2345] text-white border-[#0B2345] font-bold'
                : 'bg-[#F7FAFD] text-[#607087] border-[#D4DEE9] hover:bg-slate-100 hover:text-[#0B2345]'
            }`}
          >
            {cat === 'ALL' ? t('common.all', currentLang) : cat}
          </button>
        ))}
      </div>

      {/* List + Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {labs.map((lab) => {
            const isSelected = selectedLab?.id === lab.id;
            return (
              <div
                key={lab.id}
                onClick={() => setSelectedLab(lab)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-[#1565C0] ring-1 ring-[#1565C0]/40 text-[#0B2345]'
                    : 'bg-white border-[#D4DEE9] text-[#607087] hover:bg-slate-50 hover:text-[#0B2345]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0B2345]">{lab.name}</span>
                  <span className="text-[10px] font-mono text-[#1565C0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                    {lab.distanceKm} {t('common.km', currentLang)}
                  </span>
                </div>
                <div className="text-[11px] text-[#607087]">{lab.type} • {lab.city}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {lab.categories.map((c) => (
                    <span key={c} className="text-[9px] bg-slate-100 text-[#0B2345] px-1.5 py-0.5 rounded border border-[#D4DEE9] font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Map/Detail Pane */}
        {selectedLab && (
          <div className="lg:col-span-7 bg-[#F7FAFD] border border-[#D4DEE9] rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4DEE9]">
                <div>
                  <span className="text-[10px] text-[#607087] font-mono uppercase">{selectedLab.type}</span>
                  <h3 className="text-sm font-bold text-[#0B2345]">{selectedLab.name}</h3>
                </div>
                <span className="text-xs font-mono text-[#138808] bg-[#E8F5E9] px-2.5 py-1 rounded border border-[#A5D6A7] font-bold">
                  {selectedLab.accreditation}
                </span>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <span className="text-[10px] text-[#607087] uppercase font-mono block">{t('common.address', currentLang)}</span>
                  <span className="text-[#0B2345] font-medium">{selectedLab.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                  <div>
                    <span className="text-[10px] text-[#607087] uppercase block">{t('common.phone', currentLang)}</span>
                    <span className="text-[#0B2345] font-bold">{selectedLab.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#607087] uppercase block">{t('common.email', currentLang)}</span>
                    <span className="text-[#0B2345] font-bold">{selectedLab.email}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#607087] uppercase font-mono block mb-1">{t('labs.testingCapabilities', currentLang)}</span>
                  <ul className="space-y-1">
                    {selectedLab.testingCapabilities.map((cap, idx) => (
                      <li key={idx} className="text-[11px] text-[#0B2345] flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#138808] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D4DEE9] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#607087]">
                {t('common.distance', currentLang)} <strong className="text-[#1565C0]">{selectedLab.distanceKm} {t('common.km', currentLang)}</strong> {t('common.from', currentLang)} {userLocation.city}
              </span>
              <button
                onClick={() => alert(`Opening maps navigation for ${selectedLab.name}...`)}
                className="text-xs bg-[#0B2345] hover:bg-[#1565C0] text-white px-3.5 py-1.5 rounded-lg border border-[#0B2345] transition-all flex items-center gap-1 font-mono cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> {t('common.navigateOnMaps', currentLang)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
