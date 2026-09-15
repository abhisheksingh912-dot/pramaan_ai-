import React from 'react';
import HeroSection from './HeroSection';
import ConsumerIndustryCards from './ConsumerIndustryCards';
import LatestUpdatesCard from './LatestUpdatesCard';
import PopularCategoriesCard from './PopularCategoriesCard';
import QuickActionsCard from './QuickActionsCard';

export default function HomePage({ currentLang, onNavigate, onSelectRole, userProfile }) {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* 1. HERO SECTION & LIVE STATISTICS */}
      <HeroSection currentLang={currentLang} onNavigate={onNavigate} />

      {/* 2. FOR CONSUMERS & FOR INDUSTRY GATEWAY CARDS */}
      <ConsumerIndustryCards
        currentLang={currentLang}
        onNavigate={onNavigate}
        onSelectRole={onSelectRole}
        userProfile={userProfile}
      />

      {/* 3. QUICK ACTIONS & LATEST UPDATES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <QuickActionsCard onNavigate={onNavigate} currentLang={currentLang} />
        </div>
        <div className="lg:col-span-8">
          <LatestUpdatesCard onNavigate={onNavigate} currentLang={currentLang} />
        </div>
      </div>

      {/* 4. POPULAR CATEGORIES PREVIEW */}
      <PopularCategoriesCard
        currentLang={currentLang}
        onNavigate={onNavigate}
        onSelectCategory={(catName) => {
          onNavigate('/standards');
        }}
      />
    </div>
  );
}
