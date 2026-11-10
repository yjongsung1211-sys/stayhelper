import React from 'react';

export default function NoteHelperPrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#111827] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-8 space-y-6 shadow-xs">
        <div className="border-b border-[#E2E8F0] pb-4">
          <h1 className="text-2xl font-extrabold text-[#111827]">
            NoteHelper (노트헬퍼) 개인정보처리방침 (Privacy Policy)
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            시행일: 2026년 11월 10일 | 패키지 ID: com.yoonjongsung.notehelper
          </p>
        </div>

        <section className="space-y-2 text-sm leading-relaxed text-[#334155]">
          <h2 className="text-base font-bold text-[#111827]">1. 수집하는 권한 및 데이터</h2>
          <p>
            <strong>NoteHelper (노트헬퍼)</strong> 앱은 사용자의 회의록 자동 정리 및 외국어 회화 학습 코칭 기능을 제공하기 위해 다음 권한만을 최소한으로 사용합니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>마이크 녹음 권한 (android.permission.RECORD_AUDIO)</strong>: 사용자가 직접 [녹음 시작] 버튼을 눌렀을 때만 음성을 녹음하여 텍스트 전사(STT) 및 AI 요약·외국어 문법 교정을 생성하는 용도로 사용됩니다. 백그라운드에서 임의로 녹음하지 않습니다.
            </li>
            <li>
              <strong>오디오 파일 읽기 권한 (READ_MEDIA_AUDIO)</strong>: 사용자가 본인의 스마트폰에 저장된 통화 녹음 또는 음성 녹음 파일(.m4a, .mp3, .wav 등)을 직접 선택하여 업로드할 때만 사용됩니다.
            </li>
          </ul>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-[#334155]">
          <h2 className="text-base font-bold text-[#111827]">2. 데이터의 처리 및 보관, 삭제</h2>
          <p>
            녹음된 음성 및 전사된 노트 데이터는 AI 요약 및 다국어 코칭 결과 생성을 위해서만 처리되며, 제3자 광고 목적으로 판매하거나 공유하지 않습니다. 사용자는 앱 내 각 노트의 <strong>[삭제(휴지통)]</strong> 버튼을 통해 언제든지 본인의 녹음 및 노트 데이터를 즉시 영구 삭제할 수 있습니다.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-[#334155]">
          <h2 className="text-base font-bold text-[#111827]">3. 문의처 (Contact)</h2>
          <p>
            본 개인정보처리방침 및 앱 이용 관련 문의 사항은 서비스 운영팀(NoteHelper Support)으로 연락해 주시기 바랍니다.
          </p>
        </section>
      </div>
    </main>
  );
}
