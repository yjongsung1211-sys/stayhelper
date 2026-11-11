import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ScheduleHelper (스케줄헬퍼) | 카카오톡·지메일·메신저 대화 1초 자동 일정 파싱 & 스마트 캘린더',
    description:
        '카카오톡, 지메일, 위챗, 와츠앱 메신저 대화를 복사해 넣으면 시간·장소·할 일을 1초 만에 자동 추출하여 캘린더에 꽂아주는 올인원 스마트 플래너 (100% 프라이빗 로컬 스토리지 보장)',
    manifest: '/manifest-schedulehelper.json',
    openGraph: {
        title: 'ScheduleHelper (스케줄헬퍼) · 1초 메신저 대화 일정 파싱 스마트 플래너',
        description:
            '복잡한 약속 대화를 1초 만에 스마트 캘린더와 할 일 목록으로 자동 변환해 주는 AI 스케줄러',
        type: 'website',
    },
};

export default function ScheduleHelperLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FAFBFD] text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
            {children}
        </div>
    );
}
