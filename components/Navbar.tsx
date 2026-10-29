'use client';

import React, { useState, useEffect } from 'react';
import { LogoHF } from './LogoHF';
import { Menu, X } from 'lucide-react';
import { TabKey } from '@/types/navigation';

interface NavbarProps {
  activeTab: TabKey;
  onNavigate: (tab: TabKey) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: TabKey; name: string }[] = [
    { id: 'home', name: '홈' },
    { id: 'business', name: '사업 영역 & 솔루션' },
    { id: 'simulator', name: '진단 시뮬레이터' },
    { id: 'strengths', name: '핵심 경쟁력' },
    { id: 'roadmap', name: '사업 로드맵' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
          : 'bg-white/90 backdrop-blur-sm py-4 border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center group cursor-pointer text-left focus:outline-none"
            aria-label="화천퍼스트 홈으로 이동"
          >
            <LogoHF size={36} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1.5 sm:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 focus:outline-none"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 border-b border-slate-200 px-5 pt-3 pb-6 space-y-1.5 backdrop-blur-2xl shadow-xl animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left block px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
