"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Palette,
  Shirt,
  Building2,
  Compass,
  ArrowRight,
  Bell,
  RefreshCw,
  Crown,
  Layers,
} from "lucide-react";

export interface ServiceComingSoonProps {
  serviceId: "personalcolor" | "wedding" | "styling" | "stay";
  brandNameKo: string;
  brandNameEn: string;
  categoryBadge: string;
  tagline: string;
  description: string;
  accentColor: "gold" | "rose" | "emerald" | "amber";
  completionTasks: string[];
}

export default function ServiceComingSoon({
  serviceId,
  brandNameKo,
  brandNameEn,
  categoryBadge,
  tagline,
  description,
  accentColor = "gold",
  completionTasks,
}: ServiceComingSoonProps) {
  const [mounted, setMounted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput("");
    }, 2000);
  };

  // Color schemes
  const colorThemes = {
    gold: {
      gradientBg: "from-amber-500/10 via-amber-400/5 to-transparent",
      glow: "bg-amber-400/15",
      border: "border-amber-400/30",
      accentText: "text-amber-300",
      badgeBg: "bg-amber-500/10 text-amber-300 border-amber-400/30",
      iconBg: "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950",
      progressBar: "from-amber-400 to-yellow-300",
      btn: "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-amber-500/20",
    },
    rose: {
      gradientBg: "from-rose-500/10 via-pink-400/5 to-transparent",
      glow: "bg-rose-400/15",
      border: "border-rose-400/30",
      accentText: "text-rose-300",
      badgeBg: "bg-rose-500/10 text-rose-300 border-rose-400/30",
      iconBg: "bg-gradient-to-br from-rose-400 to-pink-600 text-white",
      progressBar: "from-rose-400 to-pink-300",
      btn: "bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-300 hover:to-pink-400 shadow-rose-500/20",
    },
    emerald: {
      gradientBg: "from-emerald-500/10 via-teal-400/5 to-transparent",
      glow: "bg-emerald-400/15",
      border: "border-emerald-400/30",
      accentText: "text-emerald-300",
      badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
      iconBg: "bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950",
      progressBar: "from-emerald-400 to-teal-300",
      btn: "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 hover:from-emerald-300 hover:to-teal-400 shadow-emerald-500/20",
    },
    amber: {
      gradientBg: "from-amber-600/10 via-orange-400/5 to-transparent",
      glow: "bg-amber-500/15",
      border: "border-amber-500/30",
      accentText: "text-amber-400",
      badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950",
      progressBar: "from-amber-500 to-orange-400",
      btn: "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/20",
    },
  };

  const theme = colorThemes[accentColor] || colorThemes.gold;

  const renderIcon = () => {
    switch (serviceId) {
      case "personalcolor":
        return <Palette className="w-8 h-8" />;
      case "wedding":
        return <Heart className="w-8 h-8" />;
      case "styling":
        return <Shirt className="w-8 h-8" />;
      case "stay":
        return <Building2 className="w-8 h-8" />;
      default:
        return <Crown className="w-8 h-8" />;
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-amber-400 selection:text-slate-950">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-70 ${theme.glow}`}
        />
        <div className="absolute -bottom-20 right-10 w-[500px] h-[400px] rounded-full blur-[160px] opacity-40 bg-indigo-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl shadow-lg ${theme.iconBg}`}>
            {renderIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                {brandNameEn}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                {brandNameKo}
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-wider">
              OFFICIAL SYSTEM NOTICE
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-300 border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            마무리 작업 진행 중
          </span>
        </div>
      </header>

      {/* Main Notice Hero */}
      <section className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wider uppercase font-semibold border mb-8 bg-white/5 border-white/10 text-slate-300 shadow-xl backdrop-blur-md">
            <Wrench className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>FINAL POLISH &amp; SYSTEM REVISION</span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <span className={theme.accentText}>{categoryBadge}</span>
          </div>

          {/* Main Headings */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.2] font-serif">
            더욱 완성도 높은 모습으로<br />
            <span className={`bg-gradient-to-r ${theme.progressBar} bg-clip-text text-transparent`}>
              곧 돌아오겠습니다
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-light text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            {tagline}
          </p>

          <p className="text-sm sm:text-base text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Progress Card */}
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-left mb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  마무리 점검 현황 (Work in Progress)
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
                96% 완료
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-6">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${theme.progressBar} transition-all duration-1000`}
                style={{ width: "96%" }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {completionTasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{task}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-sm text-amber-300 font-medium">
                <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex-shrink-0" />
                <span>최종 퀄리티 전수 검수 및 안정화 완료 후 정식 재공개 예정</span>
              </div>
            </div>
          </div>

          {/* Email Notification or Back Info */}
          <div className="max-w-md mx-auto">
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>알림 신청이 완료되었습니다. 재오픈 즉시 소식을 전해드리겠습니다.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="재공개 알림을 받으실 이메일 주소"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition"
                  required
                />
                <button
                  type="submit"
                  className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg ${theme.btn}`}
                >
                  <Bell className="w-4 h-4" />
                  <span>오픈 알림받기</span>
                </button>
              </form>
            )}
            <p className="text-xs text-slate-500 mt-3">
              스팸 없이 사이트 재공개 시점에 1회 안내 메일만 발송됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>© 2026 {brandNameEn}. All rights reserved. 마무리 작업 후 즉시 재개됩니다.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Security Guaranteed</span>
          <span>•</span>
          <span>Zero-Data Loss</span>
          <span>•</span>
          <span className="text-amber-400/80">Coming Back Soon</span>
        </div>
      </footer>
    </main>
  );
}
