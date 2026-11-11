import React from 'react';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
    themeColor: '#4F46E5',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: 'ScheduleHelper | 이번 주 일과 및 할 일 플래너 앱',
    description:
        '화·목·토 아침 6시 수영 루틴, 지메일 과외/미팅 알림, 카톡·위챗·와츠앱 대화를 한눈에 관리하는 주간 스케줄러 앱',
    manifest: '/manifest-schedulehelper.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'ScheduleHelper',
    },
    icons: {
        icon: '/schedulehelper-192.png',
        apple: '/schedulehelper-192.png',
    },
};

export default function ScheduleHelperLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FAFBFD] text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
            {children}
        </div>
    );
}
