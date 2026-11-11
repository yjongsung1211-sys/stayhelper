// StayHelper Multilingual i18n Dictionary
// Supports: English (en), Korean (ko), Japanese (ja), Chinese (zh)

export type Language = 'en' | 'ko' | 'ja' | 'zh';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'ko', 'ja', 'zh'];

export const LANGUAGE_LABELS: Record<Language, { label: string; flag: string; short: string }> = {
  en: { label: 'English', flag: '🇺🇸', short: 'EN' },
  ko: { label: '한국어', flag: '🇰🇷', short: 'KR' },
  ja: { label: '日本語', flag: '🇯🇵', short: 'JP' },
  zh: { label: '中文', flag: '🇨🇳', short: 'CN' },
};

export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  "en": {
    "brandTagline": "The Private Sanctuary Collection",
    "exploreCollection": "Explore All 50 Sanctuaries",
    "forbesFiveStar": "Forbes Travel Guide 5-Star",
    "vipPerksBtn": "VIP Perks ✨",
    "soundOn": "Sound On 🔊",
    "tapForSound": "Tap for Sound 🔊",
    "swipeCue": "Swipe up / down for next stay",
    "prev": "PREV",
    "next": "NEXT",
    "collectionNo": "COLLECTION №",
    "sanctuaryArchive": "THE SANCTUARY ARCHIVE",
    "curatedFeatures": "CURATED HIGHLIGHTS",
    "exclusivePrivileges": "EXCLUSIVE PRIVILEGES & INCLUSIONS",
    "activePromotion": "EXCLUSIVE PROMOTION",
    "reserveWithVip": "Reserve with VIP Privileges ↗",
    "directBooking": "Official Sanctuary Direct",
    "conciergeInquiry": "1:1 Private Concierge Inquiry",
    "instantConfirmation": "Instant Confirmation via Fora Travel VIP Partner",
    "forbesTierLabel": "FORBES TRAVEL GUIDE RECOGNITION",
    "seasonalRange": "SEASONAL RANGE",
    "rateIncludes": "RATE INCLUDES",
    "conciergeModalTitle": "Bespoke Concierge Request",
    "conciergeModalDesc": "Direct inquiry to our private luxury travel advisors for exclusive room upgrades, complimentary credits, and tailor-made itineraries.",
    "fullName": "Full Name",
    "emailAddress": "Email Address",
    "preferredDates": "Preferred Travel Dates",
    "guestCount": "Number of Guests",
    "specialRequests": "Special Requests or Preferences",
    "submitRequest": "Send Concierge Request",
    "requestSubmitted": "Request Received",
    "requestSubmittedDesc": "Our private luxury advisor will contact you within 4 hours with bespoke VIP privileges.",
    "allFilter": "All Sanctuaries",
    "architecturalFilter": "Architectural",
    "clifftopFilter": "Clifftop & Ocean",
    "desertFilter": "Desert & Canyon",
    "waterFilter": "Overwater Villas",
    "historicFilter": "Historic Palaces",
    "safariFilter": "Wilderness & Safari",
    "liveCinematicReel": "LIVE CINEMATIC REEL",
    "watchFullMotion": "Watch Full Motion Reel",
    "mute": "Mute",
    "unmute": "Unmute",
    "share": "Share",
    "linkCopied": "Link copied to clipboard!"
  },
  "ko": {
    "brandTagline": "글로벌 프라이빗 럭셔리 생추어리 컬렉션",
    "exploreCollection": "50대 프라이빗 생추어리 전체보기",
    "forbesFiveStar": "포브스 트래블 가이드 5성급",
    "vipPerksBtn": "VIP 특전 ✨",
    "soundOn": "사운드 켜기 🔊",
    "tapForSound": "화면을 터치하여 소리 듣기 🔊",
    "swipeCue": "위 / 아래로 스와이프하여 다음 호텔 감상",
    "prev": "이전",
    "next": "다음",
    "collectionNo": "컬렉션 №",
    "sanctuaryArchive": "생추어리 공식 아카이브",
    "curatedFeatures": "시그니처 하이라이트",
    "exclusivePrivileges": "독점 VIP 혜택 및 포함 내역",
    "activePromotion": "실시간 단독 프로모션",
    "reserveWithVip": "VIP 독점 특전으로 예약하기 ↗",
    "directBooking": "호텔 공식 웹사이트 바로가기",
    "conciergeInquiry": "1:1 프라이빗 컨시어지 문의",
    "instantConfirmation": "Fora Travel 공식 VIP 파트너 즉시 확정",
    "forbesTierLabel": "포브스 트래블 가이드 공식 등급",
    "seasonalRange": "시즌별 객실 요금 범위",
    "rateIncludes": "기본 요금 포함 내역",
    "conciergeModalTitle": "1:1 프라이빗 컨시어지 신청",
    "conciergeModalDesc": "객실 무료 업그레이드, $100 리조트 크레딧, 2인 조식 무료 등 StayHelper 단독 VIP 특전을 안내해 드립니다.",
    "fullName": "성함",
    "emailAddress": "이메일 주소",
    "preferredDates": "희망 투숙 일정",
    "guestCount": "투숙 인원수",
    "specialRequests": "추가 요청사항 및 선호 객실",
    "submitRequest": "VIP 컨시어지 문의 보내기",
    "requestSubmitted": "문의가 성공적으로 접수되었습니다",
    "requestSubmittedDesc": "전담 럭셔리 트래블 어드바이저가 4시간 이내에 맞춤형 VIP 혜택을 안내해 드립니다.",
    "allFilter": "전체 생추어리",
    "architecturalFilter": "건축 미학",
    "clifftopFilter": "절벽 & 오션뷰",
    "desertFilter": "사막 & 캐년",
    "waterFilter": "수상 빌라",
    "historicFilter": "역사적 궁전",
    "safariFilter": "야생 & 사파리",
    "liveCinematicReel": "실시간 시네마틱 릴스",
    "watchFullMotion": "풀 모션 릴스 감상",
    "mute": "음소거",
    "unmute": "소리 켜기",
    "share": "공유하기",
    "linkCopied": "링크가 클립보드에 복사되었습니다!"
  },
  "ja": {
    "brandTagline": "世界の至高なるプライベート・サンクチュアリ・コレクション",
    "exploreCollection": "世界50大サンクチュアリ一覧",
    "forbesFiveStar": "フォーブス・トラベルガイド 5つ星",
    "vipPerksBtn": "VIP特典 ✨",
    "soundOn": "音声オン 🔊",
    "tapForSound": "タップして音声を再生 🔊",
    "swipeCue": "上下にスワイプして次のステイを表示",
    "prev": "前へ",
    "next": "次へ",
    "collectionNo": "コレクション №",
    "sanctuaryArchive": "サンクチュアリ公式アーカイブ",
    "curatedFeatures": "厳選されたハイライト",
    "exclusivePrivileges": "限定VIP特典・含まれるサービス",
    "activePromotion": "期間限定プロモーション",
    "reserveWithVip": "VIP限定特典で予約する ↗",
    "directBooking": "ホテル公式サイトへ移動",
    "conciergeInquiry": "1対1 プライベート・コンシェルジュ相談",
    "instantConfirmation": "Fora Travel公式VIPパートナー即時確定",
    "forbesTierLabel": "フォーブス・トラベルガイド公式格付け",
    "seasonalRange": "シーズン別宿泊料金目安",
    "rateIncludes": "宿泊料金に含まれる特典",
    "conciergeModalTitle": "プライベート・コンシェルジュ予約相談",
    "conciergeModalDesc": "無料客室アップグレード、$100相当のクレジット、毎朝食無料などStayHelper限定のVIP特典をご案内いたします。",
    "fullName": "お名前",
    "emailAddress": "メールアドレス",
    "preferredDates": "ご宿泊希望日程",
    "guestCount": "ご宿泊人数",
    "specialRequests": "ご要望・特別なリクエスト",
    "submitRequest": "コンシェルジュに相談する",
    "requestSubmitted": "リクエストを承りました",
    "requestSubmittedDesc": "専任のラグジュアリー・アドバイザーが4時間以内に特別VIP特典をご案内いたします。",
    "allFilter": "すべてのホテル",
    "architecturalFilter": "名建築",
    "clifftopFilter": "断崖＆絶景オーシャン",
    "desertFilter": "砂漠＆キャニオン",
    "waterFilter": "水上ヴィラ",
    "historicFilter": "歴史的宮殿",
    "safariFilter": "大自然＆サファリ",
    "liveCinematicReel": "ライブ・シネマティックリール",
    "watchFullMotion": "フルモーション動画を見る",
    "mute": "消音",
    "unmute": "音声再生",
    "share": "共有",
    "linkCopied": "リンクをコピーしました！"
  },
  "zh": {
    "brandTagline": "全球顶奢隐世度假庄园甄选",
    "exploreCollection": "探索全球50大隐世奢华酒店",
    "forbesFiveStar": "福布斯旅游指南五星评级",
    "vipPerksBtn": "尊享礼遇 ✨",
    "soundOn": "开启声音 🔊",
    "tapForSound": "轻触屏幕播放原声 🔊",
    "swipeCue": "上下滑动切换下个度假胜地",
    "prev": "上一个",
    "next": "下一个",
    "collectionNo": "甄选系列 №",
    "sanctuaryArchive": "庄园独家档案",
    "curatedFeatures": "标志性特色体验",
    "exclusivePrivileges": "尊享VIP专属礼遇与权益",
    "activePromotion": "限时专属礼遇",
    "reserveWithVip": "尊享VIP专属礼遇预订 ↗",
    "directBooking": "前往酒店官方网站",
    "conciergeInquiry": "1对1 私人定制礼宾咨询",
    "instantConfirmation": "Fora Travel 官方VIP合作伙伴即时确认",
    "forbesTierLabel": "福布斯旅游指南官方星级",
    "seasonalRange": "当季参考房价",
    "rateIncludes": "房费包含专属礼遇",
    "conciergeModalTitle": "私人定制礼宾服务申请",
    "conciergeModalDesc": "为您定制独家房型免费升级、100美元消费金、双人免费早餐等StayHelper专享VIP贵宾权益。",
    "fullName": "贵宾姓名",
    "emailAddress": "电子邮箱",
    "preferredDates": "预计入住日期",
    "guestCount": "入住人数",
    "specialRequests": "特殊需求或房型偏好",
    "submitRequest": "提交礼宾咨询",
    "requestSubmitted": "咨询已成功提交",
    "requestSubmittedDesc": "专属高端旅行顾问将在4小时内与您联系，呈现独家贵宾礼遇方案。",
    "allFilter": "全部隐世胜地",
    "architecturalFilter": "建筑美学",
    "clifftopFilter": "悬崖与海景",
    "desertFilter": "沙漠与峡谷",
    "waterFilter": "水上别墅",
    "historicFilter": "历史传奇宫殿",
    "safariFilter": "荒野与野奢游猎",
    "liveCinematicReel": "实景电影级视频",
    "watchFullMotion": "观看完整实景视频",
    "mute": "静音",
    "unmute": "播放声音",
    "share": "分享",
    "linkCopied": "链接已复制至剪贴板！"
  }
};

export interface LocalizedStayMeta {
  name: string;
  subtitle: string;
  country: string;
  activeDealTag?: string | null;
  activeDealTitle?: string | null;
  activeDealDesc?: string | null;
}

export const HOTEL_TRANSLATIONS: Record<string, Record<Language, LocalizedStayMeta>> = {
  "stay-01": {
    "en": {
      "name": "Amangiri Canyon Pavilion",
      "subtitle": "A Monolithic Architectural Sanctuary Carved into 165-Million-Year Navajo Sandstone",
      "country": "Utah, United States",
      "activeDealTag": "FULL BOARD + AIRPORT VIP",
      "activeDealTitle": "Fora Reserve VIP Inclusions",
      "activeDealDesc": "Full-board dining for 2 + Page private airport transfer & $100 Navajo spa credit"
    },
    "ko": {
      "name": "아만기리 캐년 파빌리온",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Canyon Point, Southern Utah의 압도적 비경과 프라이빗 휴식",
      "country": "미국 유타주",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Fora Reserve VIP Inclusions",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "アマンギリ・キャニオン・パビリオン",
      "subtitle": "世界最高峰のサンクチュアリ · Canyon Point, Southern Utahの息をのむ絶景と至高のプライベート空間",
      "country": "アメリカ・ユタ州",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Fora Reserve VIP Inclusions",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "安缦吉瑞峡谷阁",
      "subtitle": "全球至臻隐世度假殿堂 · Canyon Point, Southern Utah无可比拟的壮丽私密秘境",
      "country": "美国犹他州",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Fora Reserve VIP Inclusions",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-02": {
    "en": {
      "name": "The Kayon Jungle Resort",
      "subtitle": "Three-Tiered Valley Infinity Pool Sanctuary Above the Sacred Ubud Rainforest",
      "country": "Bali, Indonesia",
      "activeDealTag": "SAVE 20% + AFTERNOON TEA",
      "activeDealTitle": "Valley Escape · 20% Early Bird",
      "activeDealDesc": "Complimentary daily high tea overlooking jungle valley + 20% advance booking discount"
    },
    "ko": {
      "name": "더 카욘 정글 리조트",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Bresela, Payangan, Ubud, Bali의 압도적 비경과 프라이빗 휴식",
      "country": "Bali, Indonesia",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Valley Escape · 20% Early Bird",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ザ・カヨン・ジャングル・リゾート",
      "subtitle": "世界最高峰のサンクチュアリ · Bresela, Payangan, Ubud, Baliの息をのむ絶景と至高のプライベート空間",
      "country": "Bali, Indonesia",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Valley Escape · 20% Early Bird",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "卡永丛林度假村",
      "subtitle": "全球至臻隐世度假殿堂 · Bresela, Payangan, Ubud, Bali无可比拟的壮丽私密秘境",
      "country": "Bali, Indonesia",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Valley Escape · 20% Early Bird",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-03": {
    "en": {
      "name": "Bulgari Resort & Mansions",
      "subtitle": "Mediterranean Maritime Opulence on a Private Seahorse-Shaped Island",
      "country": "Dubai, UAE",
      "activeDealTag": "$200 LUXURY CREDIT",
      "activeDealTitle": "Marina Penthouse Exclusive Credit",
      "activeDealDesc": "Double resort credit ($200 USD) toward Il Ristorante Niko Romito + daily ocean breakfast"
    },
    "ko": {
      "name": "불가리 리조트 & 맨션 두바이",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Jumeira Bay Island, Dubai의 압도적 비경과 프라이빗 휴식",
      "country": "Dubai, UAE",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Marina Penthouse Exclusive Credit",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ブルガリ リゾート＆マンションズ ドバイ",
      "subtitle": "世界最高峰のサンクチュアリ · Jumeira Bay Island, Dubaiの息をのむ絶景と至高のプライベート空間",
      "country": "Dubai, UAE",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Marina Penthouse Exclusive Credit",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "迪拜宝格丽度假村及豪邸",
      "subtitle": "全球至臻隐世度假殿堂 · Jumeira Bay Island, Dubai无可比拟的壮丽私密秘境",
      "country": "Dubai, UAE",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Marina Penthouse Exclusive Credit",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-04": {
    "en": {
      "name": "Four Seasons Resort Koh Samui",
      "subtitle": "Cliffside Bill Bensley Villas Overlooking the Azure Gulf of Thailand",
      "country": "Koh Samui, Thailand",
      "activeDealTag": "SAVE 20% (4+ NIGHTS)",
      "activeDealTitle": "Stay Longer · 20% Off",
      "activeDealDesc": "Stay 4 nights or more and enjoy 20% off room rates + $100 Resort Credit & Daily Breakfast"
    },
    "ko": {
      "name": "포시즌스 리조트 코사무이",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Laem Yai Bay, Koh Samui의 압도적 비경과 프라이빗 휴식",
      "country": "태국 코사무이",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Stay Longer · 20% Off",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "フォーシーズンズ リゾート コサムイ",
      "subtitle": "世界最高峰のサンクチュアリ · Laem Yai Bay, Koh Samuiの息をのむ絶景と至高のプライベート空間",
      "country": "タイ・コサムイ",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Stay Longer · 20% Off",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "苏梅岛四季度假酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Laem Yai Bay, Koh Samui无可比拟的壮丽私密秘境",
      "country": "泰国苏梅岛",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Stay Longer · 20% Off",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-05": {
    "en": {
      "name": "Soneva Jani Water Reserve",
      "subtitle": "Overwater Lagoon Villas with Spiral Water Slides & Retractable Starlight Pavilions",
      "country": "Maldives",
      "activeDealTag": "STAY 4, PAY 3 (1 NIGHT FREE)",
      "activeDealTitle": "The Great Escape · 4th Night Free",
      "activeDealDesc": "Book 3 consecutive nights and receive the 4th night complimentary + $100 Resort Credit"
    },
    "ko": {
      "name": "소네바 자니 워터 리저브",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Medhufaru Island, Noonu Atoll의 압도적 비경과 프라이빗 휴식",
      "country": "Maldives",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "ソネバジャニ ウォーターリザーブ",
      "subtitle": "世界最高峰のサンクチュアリ · Medhufaru Island, Noonu Atollの息をのむ絶景と至高のプライベート空間",
      "country": "Maldives",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "索尼娃贾尼水上静修所",
      "subtitle": "全球至臻隐世度假殿堂 · Medhufaru Island, Noonu Atoll无可比拟的壮丽私密秘境",
      "country": "Maldives",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-06": {
    "en": {
      "name": "The Chedi Andermatt",
      "subtitle": "Monumental Alpine Grandeur & Steaming Thermal Pools in the Heart of the Swiss Alps",
      "country": "Swiss Alps, Switzerland",
      "activeDealTag": "STAY 3, PAY 2 (1 NIGHT FREE)",
      "activeDealTitle": "Alpine Sanctuary · 3rd Night Complimentary",
      "activeDealDesc": "Book 2 nights and receive your 3rd night on us with daily breakfast buffet & $100 spa credit"
    },
    "ko": {
      "name": "더 체디 안데르마트",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Andermatt, Canton of Uri의 압도적 비경과 프라이빗 휴식",
      "country": "Swiss Alps, Switzerland",
      "activeDealTag": "3박 예약 시 1박 무료 (3 for 2)",
      "activeDealTitle": "시즌 한정 3박 결제 특전",
      "activeDealDesc": "3번째 투숙박 무료 제공 + 리조트 시그니처 웰컴 어메니티"
    },
    "ja": {
      "name": "ザ・チェディ・アンデルマット",
      "subtitle": "世界最高峰のサンクチュアリ · Andermatt, Canton of Uriの息をのむ絶景と至高のプライベート空間",
      "country": "Swiss Alps, Switzerland",
      "activeDealTag": "3泊目無料特典 (3 for 2)",
      "activeDealTitle": "シーズン限定 3泊目無料ステイ",
      "activeDealDesc": "3泊目のご宿泊無料 + リゾート特製ウェルカムギフト"
    },
    "zh": {
      "name": "安德马特澈笛度假酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Andermatt, Canton of Uri无可比拟的壮丽私密秘境",
      "country": "Swiss Alps, Switzerland",
      "activeDealTag": "住三付二 · 免费赠送第3晚",
      "activeDealTitle": "当季尊享第3晚免费礼遇",
      "activeDealDesc": "连续入住第3晚免费赠送 + 庄园尊荣迎宾礼遇"
    }
  },
  "stay-07": {
    "en": {
      "name": "Monastero Santa Rosa Hotel & Spa",
      "subtitle": "17th-Century Dominican Monastery & Cliff-Edge Infinity Sanctuary Over the Amalfi Gulf",
      "country": "Amalfi Coast, Italy",
      "activeDealTag": "STAY 4, PAY 3 (1 NIGHT FREE)",
      "activeDealTitle": "Cliffside Respite · 4th Night Free",
      "activeDealDesc": "Complimentary 4th night on cliffside suite bookings + €100 thermal baths spa credit"
    },
    "ko": {
      "name": "모나스테로 산타 로사 호텔 & 스파",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Conca dei Marini, Amalfi Coast의 압도적 비경과 프라이빗 휴식",
      "country": "이탈리아 아말피 코스트",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "モナステロ・サンタ・ローザ・ホテル＆スパ",
      "subtitle": "世界最高峰のサンクチュアリ · Conca dei Marini, Amalfi Coastの息をのむ絶景と至高のプライベート空間",
      "country": "イタリア・アマルフィ海岸",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "圣罗莎修道院水疗酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Conca dei Marini, Amalfi Coast无可比拟的壮丽私密秘境",
      "country": "意大利阿马尔菲海岸",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-08": {
    "en": {
      "name": "Aman Kyoto Secret Garden",
      "subtitle": "A Hidden Moss Garden & Mineral Onsen Sanctuary in Kyoto’s Ancient Cedar Forest",
      "country": "Kyoto, Japan",
      "activeDealTag": "COMPLIMENTARY TEA CEREMONY + $100",
      "activeDealTitle": "Discover Aman Kyoto · Cultural Inclusions",
      "activeDealDesc": "Private Zen rock garden matcha ceremony + $100 dining credit and daily Japanese breakfast"
    },
    "ko": {
      "name": "아만 교토 시크릿 가든",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Takagamine, Kita Ward, Kyoto의 압도적 비경과 프라이빗 휴식",
      "country": "일본 교토",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Discover Aman Kyoto · Cultural Inclusions",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "アマン京都 シークレットガーデン",
      "subtitle": "世界最高峰のサンクチュアリ · Takagamine, Kita Ward, Kyotoの息をのむ絶景と至高のプライベート空間",
      "country": "日本・京都",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Discover Aman Kyoto · Cultural Inclusions",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "京都安缦秘境之庭",
      "subtitle": "全球至臻隐世度假殿堂 · Takagamine, Kita Ward, Kyoto无可比拟的壮丽私密秘境",
      "country": "日本京都",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Discover Aman Kyoto · Cultural Inclusions",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-09": {
    "en": {
      "name": "Singita Sasakwa Lodge",
      "subtitle": "Majestic Edwardian Manor Perched Above the Boundless Plains of the Serengeti",
      "country": "Serengeti, Tanzania",
      "activeDealTag": "FREE PRIVATE GAME DRIVE",
      "activeDealTitle": "Serengeti Migration Special",
      "activeDealDesc": "Includes twice-daily private Land Cruiser safaris + full board and vintage cellar wines"
    },
    "ko": {
      "name": "싱기타 사사콰 로지",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Grumeti Reserves, Serengeti Ecosystem의 압도적 비경과 프라이빗 휴식",
      "country": "탄자니아 세렝게티",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Serengeti Migration Special",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "シンギタ・ササクワ・ロッジ",
      "subtitle": "世界最高峰のサンクチュアリ · Grumeti Reserves, Serengeti Ecosystemの息をのむ絶景と至高のプライベート空間",
      "country": "タンザニア・セレンゲティ",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Serengeti Migration Special",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "辛吉塔萨萨夸荒野营地",
      "subtitle": "全球至臻隐世度假殿堂 · Grumeti Reserves, Serengeti Ecosystem无可比拟的壮丽私密秘境",
      "country": "坦桑尼亚塞伦盖蒂",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Serengeti Migration Special",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-10": {
    "en": {
      "name": "Hôtel du Cap-Eden-Roc",
      "subtitle": "The Riviera’s Ultimate Legendary Palace with Basalt Cliff Seawater Pool",
      "country": "French Riviera, France",
      "activeDealTag": "PRIORITY UPGRADE AT BOOKING",
      "activeDealTitle": "Oetker Pearl Partner VIP Upgrade",
      "activeDealDesc": "Priority room upgrade at confirmation + €100 culinary credit at Eden-Roc Restaurant"
    },
    "ko": {
      "name": "오텔 뒤 캅 에덴 록",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Cap d'Antibes, Côte d'Azur의 압도적 비경과 프라이빗 휴식",
      "country": "프랑스 리비에라",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Oetker Pearl Partner VIP Upgrade",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "オテル・デュ・キャップ・エデン・ロック",
      "subtitle": "世界最高峰のサンクチュアリ · Cap d'Antibes, Côte d'Azurの息をのむ絶景と至高のプライベート空間",
      "country": "フランス・リビエラ",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Oetker Pearl Partner VIP Upgrade",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "伊甸豪海角酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Cap d'Antibes, Côte d'Azur无可比拟的壮丽私密秘境",
      "country": "法国蔚蓝海岸",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Oetker Pearl Partner VIP Upgrade",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-11": {
    "en": {
      "name": "Villa d'Este",
      "subtitle": "16th-Century Renaissance Royal Palace & Legendary Floating Pool on Lake Como",
      "country": "Lake Como, Italy",
      "activeDealTag": "STAY 4, PAY 3 (1 NIGHT FREE)",
      "activeDealTitle": "Lake Como Heritage · 4th Night Free",
      "activeDealDesc": "Enjoy a complimentary 4th night amidst Renaissance private gardens + daily lakefront breakfast"
    },
    "ko": {
      "name": "빌라 데스테 코모 호수",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Cernobbio, Lake Como의 압도적 비경과 프라이빗 휴식",
      "country": "이탈리아 코모 호수",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "ヴィラ・デステ コモ湖",
      "subtitle": "世界最高峰のサンクチュアリ · Cernobbio, Lake Comoの息をのむ絶景と至高のプライベート空間",
      "country": "イタリア・コモ湖",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "埃斯特别墅酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Cernobbio, Lake Como无可比拟的壮丽私密秘境",
      "country": "意大利科莫湖",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-12": {
    "en": {
      "name": "Post Ranch Inn",
      "subtitle": "Cliffside Architectural Masterpiece Perched 1,200 Feet Above the Boundless Pacific",
      "country": "California, United States",
      "activeDealTag": "$100 SPA & WINE CREDIT",
      "activeDealTitle": "Big Sur Coastal Escape · $100 Credit",
      "activeDealDesc": "Complimentary $100 cliffside spa credit + daily gourmet breakfast at Sierra Mar"
    },
    "ko": {
      "name": "포스트 랜치 인 빅서",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Big Sur, Highway 1, California의 압도적 비경과 프라이빗 휴식",
      "country": "California, United States",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Big Sur Coastal Escape · $100 Credit",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ポスト・ランチ・イン ビッグサー",
      "subtitle": "世界最高峰のサンクチュアリ · Big Sur, Highway 1, Californiaの息をのむ絶景と至高のプライベート空間",
      "country": "California, United States",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Big Sur Coastal Escape · $100 Credit",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "邮政牧场客栈",
      "subtitle": "全球至臻隐世度假殿堂 · Big Sur, Highway 1, California无可比拟的壮丽私密秘境",
      "country": "California, United States",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Big Sur Coastal Escape · $100 Credit",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-13": {
    "en": {
      "name": "Cheval Blanc Randheli",
      "subtitle": "LVMH’s Ultimate Haute Couture Island Maison with Private Marina and Infinity Sanctuaries",
      "country": "Maldives",
      "activeDealTag": "STAY 5, PAY 4 (1 NIGHT FREE)",
      "activeDealTitle": "Maison Maldivian Escape · 5th Night Free",
      "activeDealDesc": "Book 4 nights and enjoy your 5th night complimentary + Cheval Blanc welcome champagne"
    },
    "ko": {
      "name": "슈발 블랑 란델리 몰디브",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Noonu Atoll, Republic of Maldives의 압도적 비경과 프라이빗 휴식",
      "country": "Maldives",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Maison Maldivian Escape · 5th Night Free",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "シュヴァル・ブラン・ランデリ",
      "subtitle": "世界最高峰のサンクチュアリ · Noonu Atoll, Republic of Maldivesの息をのむ絶景と至高のプライベート空間",
      "country": "Maldives",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Maison Maldivian Escape · 5th Night Free",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "白马庄园兰德利岛度假村",
      "subtitle": "全球至臻隐世度假殿堂 · Noonu Atoll, Republic of Maldives无可比拟的壮丽私密秘境",
      "country": "Maldives",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Maison Maldivian Escape · 5th Night Free",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-14": {
    "en": {
      "name": "Belmond Hotel Caruso",
      "subtitle": "11th-Century Palatial Cliffside Sanctuary Suspended Between Sky and Sea in Ravello",
      "country": "Amalfi Coast, Italy",
      "activeDealTag": "$200 RESORT CREDIT",
      "activeDealTitle": "Bellini Club Exclusive · $200 Credit",
      "activeDealDesc": "Complimentary $200 USD Bellini experience credit + cliffside infinity pool cabana priority"
    },
    "ko": {
      "name": "벨몬드 호텔 카루소 아말피",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Ravello, Amalfi Coast의 압도적 비경과 프라이빗 휴식",
      "country": "이탈리아 아말피 코스트",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Bellini Club Exclusive · $200 Credit",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ベルモンド・ホテル・カルーソ",
      "subtitle": "世界最高峰のサンクチュアリ · Ravello, Amalfi Coastの息をのむ絶景と至高のプライベート空間",
      "country": "イタリア・アマルフィ海岸",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Bellini Club Exclusive · $200 Credit",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "贝梦德卡鲁索酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Ravello, Amalfi Coast无可比拟的壮丽私密秘境",
      "country": "意大利阿马尔菲海岸",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Bellini Club Exclusive · $200 Credit",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-15": {
    "en": {
      "name": "Aman Tokyo",
      "subtitle": "Monumental Washi Paper Lantern Atrium & Basalt Stone Sanctuary Above Otemachi",
      "country": "Tokyo, Japan",
      "activeDealTag": "$100 DINING CREDIT + SAKE TASTING",
      "activeDealTitle": "Oeno & Dining Experience · $100 Credit",
      "activeDealDesc": "Complimentary 33rd floor sommelier tasting + $100 hotel credit and daily breakfast"
    },
    "ko": {
      "name": "아만 도쿄 스카이 생추어리",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · The Otemachi Tower, Tokyo의 압도적 비경과 프라이빗 휴식",
      "country": "일본 도쿄",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Oeno & Dining Experience · $100 Credit",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "アマン東京 スカイサンクチュアリ",
      "subtitle": "世界最高峰のサンクチュアリ · The Otemachi Tower, Tokyoの息をのむ絶景と至高のプライベート空間",
      "country": "日本・東京",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Oeno & Dining Experience · $100 Credit",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "东京安缦凌空秘境",
      "subtitle": "全球至臻隐世度假殿堂 · The Otemachi Tower, Tokyo无可比拟的壮丽私密秘境",
      "country": "日本东京",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Oeno & Dining Experience · $100 Credit",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-16": {
    "en": {
      "name": "Royal Mansour Marrakech",
      "subtitle": "Palatial Masterpiece Commissioned by the King with Private Multi-Story Riads & Starlight Pools",
      "country": "Marrakech, Morocco",
      "activeDealTag": "STAY 4, PAY 3 (1 NIGHT FREE)",
      "activeDealTitle": "Medina Riad Experience · 4th Night Free",
      "activeDealDesc": "Stay 4 nights in a private multi-story riad, pay for 3 + traditional hammam experience for 2"
    },
    "ko": {
      "name": "로열 만수르 마라케시",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Rue Abou Abbas El Sebti, Marrakech의 압도적 비경과 프라이빗 휴식",
      "country": "모로코 마라케시",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "ロイヤル・マンスール・マラケシュ",
      "subtitle": "世界最高峰のサンクチュアリ · Rue Abou Abbas El Sebti, Marrakechの息をのむ絶景と至高のプライベート空間",
      "country": "モロッコ・マラケシュ",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "皇家曼苏尔马拉喀什酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Rue Abou Abbas El Sebti, Marrakech无可比拟的壮丽私密秘境",
      "country": "摩洛哥马拉喀什",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-17": {
    "en": {
      "name": "COMO Laucala Island",
      "subtitle": "Ultra-Exclusive 3,000-Acre Private Island Sanctuary with Iconic Glass-Cube Lap Pool",
      "country": "Fiji, South Pacific",
      "activeDealTag": "ALL-INCLUSIVE ISLAND RETREAT",
      "activeDealTitle": "Private Island All-Inclusive Sanctuary",
      "activeDealDesc": "All gourmet dining, private chef services, golf, horseback riding & watersports 100% included"
    },
    "ko": {
      "name": "코모 라우칼라 아일랜드",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Laucala Island, Cakaudrove의 압도적 비경과 프라이빗 휴식",
      "country": "Fiji, South Pacific",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Private Island All-Inclusive Sanctuary",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "COMOラウカラ・アイランド",
      "subtitle": "世界最高峰のサンクチュアリ · Laucala Island, Cakaudroveの息をのむ絶景と至高のプライベート空間",
      "country": "Fiji, South Pacific",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Private Island All-Inclusive Sanctuary",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "科莫劳卡拉私人岛屿度假村",
      "subtitle": "全球至臻隐世度假殿堂 · Laucala Island, Cakaudrove无可比拟的壮丽私密秘境",
      "country": "Fiji, South Pacific",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Private Island All-Inclusive Sanctuary",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-18": {
    "en": {
      "name": "Badrutt's Palace Hotel",
      "subtitle": "Legendary 128-Year-Old Fairy-Tale Alpine Castle Overlooking Lake St. Moritz",
      "country": "Engadin, Switzerland",
      "activeDealTag": "COMPLIMENTARY SKI PASS + $100",
      "activeDealTitle": "St. Moritz Ski Pass Included",
      "activeDealDesc": "Free Engadin ski pass for all guests staying 2+ nights + $100 Palace wellness credit"
    },
    "ko": {
      "name": "바드루츠 팰리스 호텔 생모리츠",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Via Serlas, St. Moritz의 압도적 비경과 프라이빗 휴식",
      "country": "Engadin, Switzerland",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "St. Moritz Ski Pass Included",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "バドラッツ・パレス・ホテル サンモリッツ",
      "subtitle": "世界最高峰のサンクチュアリ · Via Serlas, St. Moritzの息をのむ絶景と至高のプライベート空間",
      "country": "Engadin, Switzerland",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "St. Moritz Ski Pass Included",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "巴德鲁特宫殿酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Via Serlas, St. Moritz无可比拟的壮丽私密秘境",
      "country": "Engadin, Switzerland",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "St. Moritz Ski Pass Included",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-19": {
    "en": {
      "name": "Capella Ubud",
      "subtitle": "Bill Bensley’s Mystical Rainforest Tented Camp Sanctuary Above Sacred Wos River",
      "country": "Bali, Indonesia",
      "activeDealTag": "STAY 3, PAY 2 (1 NIGHT FREE)",
      "activeDealTitle": "Rainforest Retreat · 3rd Night Complimentary",
      "activeDealDesc": "Stay 3 nights for the price of 2 + $100 dining credit and daily tented camp breakfast"
    },
    "ko": {
      "name": "카펠라 우붓 텐트 리트리트",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Tegallalang, Ubud, Bali의 압도적 비경과 프라이빗 휴식",
      "country": "Bali, Indonesia",
      "activeDealTag": "3박 예약 시 1박 무료 (3 for 2)",
      "activeDealTitle": "시즌 한정 3박 결제 특전",
      "activeDealDesc": "3번째 투숙박 무료 제공 + 리조트 시그니처 웰컴 어메니티"
    },
    "ja": {
      "name": "カペラ・ウブド テントリトリート",
      "subtitle": "世界最高峰のサンクチュアリ · Tegallalang, Ubud, Baliの息をのむ絶景と至高のプライベート空間",
      "country": "Bali, Indonesia",
      "activeDealTag": "3泊目無料特典 (3 for 2)",
      "activeDealTitle": "シーズン限定 3泊目無料ステイ",
      "activeDealDesc": "3泊目のご宿泊無料 + リゾート特製ウェルカムギフト"
    },
    "zh": {
      "name": "乌布嘉佩乐帐篷度假酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Tegallalang, Ubud, Bali无可比拟的壮丽私密秘境",
      "country": "Bali, Indonesia",
      "activeDealTag": "住三付二 · 免费赠送第3晚",
      "activeDealTitle": "当季尊享第3晚免费礼遇",
      "activeDealDesc": "连续入住第3晚免费赠送 + 庄园尊荣迎宾礼遇"
    }
  },
  "stay-20": {
    "en": {
      "name": "Jade Mountain Resort",
      "subtitle": "Architectural Masterpiece with Open 4th Wall Framing the Iconic Volcanic Pitons",
      "country": "St. Lucia, Caribbean",
      "activeDealTag": "STAY 5, PAY 4 (1 NIGHT FREE)",
      "activeDealTitle": "Caribbean Escape · 5th Night Free",
      "activeDealDesc": "Book an open-air infinity sanctuary for 4 nights, receive 5th night on us + $100 credit"
    },
    "ko": {
      "name": "제이드 마운틴 리조트",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Soufrière, St. Lucia의 압도적 비경과 프라이빗 휴식",
      "country": "St. Lucia, Caribbean",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Caribbean Escape · 5th Night Free",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ジェイド・マウンテン・リゾート",
      "subtitle": "世界最高峰のサンクチュアリ · Soufrière, St. Luciaの息をのむ絶景と至高のプライベート空間",
      "country": "St. Lucia, Caribbean",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Caribbean Escape · 5th Night Free",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "玉山度假村",
      "subtitle": "全球至臻隐世度假殿堂 · Soufrière, St. Lucia无可比拟的壮丽私密秘境",
      "country": "St. Lucia, Caribbean",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Caribbean Escape · 5th Night Free",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-21": {
    "en": {
      "name": "Grace Hotel, Auberge Resorts Collection",
      "subtitle": "Whitewashed Cycladic Clifftop Cave Suites Overlooking Skaros Rock & World-Renowned Sunsets",
      "country": "Santorini, Greece",
      "activeDealTag": "STAY 4, PAY 3 (1 NIGHT FREE)",
      "activeDealTitle": "Santorini Escape · 4th Night Complimentary",
      "activeDealDesc": "Enjoy a complimentary 4th night + Private Santorini Airport/Port roundtrip limousine transfer"
    },
    "ko": {
      "name": "그레이스 호텔 오베르주 산토리니",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Imerovigli, Santorini의 압도적 비경과 프라이빗 휴식",
      "country": "그리스 산토리니",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "グレース・ホテル・オーベルジュ サントリーニ",
      "subtitle": "世界最高峰のサンクチュアリ · Imerovigli, Santoriniの息をのむ絶景と至高のプライベート空間",
      "country": "ギリシャ・サントリーニ",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "圣托里尼格雷斯傲途格精选酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Imerovigli, Santorini无可比拟的壮丽私密秘境",
      "country": "希腊圣托里尼",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-22": {
    "en": {
      "name": "Hôtel Plaza Athénée",
      "subtitle": "The Haute Couture Crown Jewel of Avenue Montaigne with Private Eiffel Tower Balconies",
      "country": "Paris, France",
      "activeDealTag": "GUARANTEED UPGRADE AT CONFIRMATION",
      "activeDealTitle": "Guaranteed Eiffel Upgrade & Double Credit",
      "activeDealDesc": "Guaranteed room upgrade at booking + €200 double culinary & spa credit"
    },
    "ko": {
      "name": "오텔 플라자 아테네 파리",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Avenue Montaigne, 8th Arr.의 압도적 비경과 프라이빗 휴식",
      "country": "프랑스 파리",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Guaranteed Eiffel Upgrade & Double Credit",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "オテル・プラザ・アテネ パリ",
      "subtitle": "世界最高峰のサンクチュアリ · Avenue Montaigne, 8th Arr.の息をのむ絶景と至高のプライベート空間",
      "country": "フランス・パリ",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Guaranteed Eiffel Upgrade & Double Credit",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "巴黎雅典娜广场酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Avenue Montaigne, 8th Arr.无可比拟的壮丽私密秘境",
      "country": "法国巴黎",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Guaranteed Eiffel Upgrade & Double Credit",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-23": {
    "en": {
      "name": "The St. Regis Bora Bora Resort",
      "subtitle": "French Polynesia’s Largest Overwater Villas with Glass Floor Panels & Mount Otemanu Views",
      "country": "Bora Bora, French Polynesia",
      "activeDealTag": "STAY 5, PAY 4 (1 NIGHT FREE)",
      "activeDealTitle": "Bora Bora Paradise · 5th Night Free",
      "activeDealDesc": "Enjoy a complimentary 5th night + Private roundtrip airport boat transfer & 24hr Butler Service"
    },
    "ko": {
      "name": "세인트 레지스 보라보라 리조트",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Motu Tupei, Bora Bora의 압도적 비경과 프라이빗 휴식",
      "country": "프랑스령 폴리네시아 보라보라",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Bora Bora Paradise · 5th Night Free",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "セントレジス・ボラボラ・リゾート",
      "subtitle": "世界最高峰のサンクチュアリ · Motu Tupei, Bora Boraの息をのむ絶景と至高のプライベート空間",
      "country": "仏領ポリネシア・ボラボラ島",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Bora Bora Paradise · 5th Night Free",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "波拉波拉瑞吉度假酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Motu Tupei, Bora Bora无可比拟的壮丽私密秘境",
      "country": "法属波利尼西亚波拉波拉岛",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Bora Bora Paradise · 5th Night Free",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-24": {
    "en": {
      "name": "Taj Lake Palace",
      "subtitle": "18th-Century Floating White Marble Royal Water Palace in the Center of Lake Pichola",
      "country": "Udaipur, India",
      "activeDealTag": "STAY 3, PAY 2 (1 NIGHT FREE)",
      "activeDealTitle": "Royal Heritage Special · 3rd Night Free",
      "activeDealDesc": "Complimentary 3rd night + Private Lake Pichola sunset champagne cruise on the historic royal barge"
    },
    "ko": {
      "name": "타지 레이크 팰리스 우다이푸르",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Lake Pichola, Udaipur, Rajasthan의 압도적 비경과 프라이빗 휴식",
      "country": "인도 우다이푸르",
      "activeDealTag": "3박 예약 시 1박 무료 (3 for 2)",
      "activeDealTitle": "시즌 한정 3박 결제 특전",
      "activeDealDesc": "3번째 투숙박 무료 제공 + 리조트 시그니처 웰컴 어메니티"
    },
    "ja": {
      "name": "タージ・レイク・パレス ウダイプル",
      "subtitle": "世界最高峰のサンクチュアリ · Lake Pichola, Udaipur, Rajasthanの息をのむ絶景と至高のプライベート空間",
      "country": "インド・ウダイプル",
      "activeDealTag": "3泊目無料特典 (3 for 2)",
      "activeDealTitle": "シーズン限定 3泊目無料ステイ",
      "activeDealDesc": "3泊目のご宿泊無料 + リゾート特製ウェルカムギフト"
    },
    "zh": {
      "name": "泰姬湖之宫殿酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Lake Pichola, Udaipur, Rajasthan无可比拟的壮丽私密秘境",
      "country": "印度乌代浦",
      "activeDealTag": "住三付二 · 免费赠送第3晚",
      "activeDealTitle": "当季尊享第3晚免费礼遇",
      "activeDealDesc": "连续入住第3晚免费赠送 + 庄园尊荣迎宾礼遇"
    }
  },
  "stay-25": {
    "en": {
      "name": "Bürgenstock Hotel & Alpine Spa",
      "subtitle": "500-Meter Sheer Clifftop Wonder with World-Famous Cantilevered Heated Infinity Spa",
      "country": "Lake Lucerne, Switzerland",
      "activeDealTag": "STAY 4, PAY 3 (1 NIGHT FREE)",
      "activeDealTitle": "Swiss Alpine Escape · 4th Night Free",
      "activeDealDesc": "Complimentary 4th night + Unlimited MS Bürgenstock lake catamaran & historic funicular pass"
    },
    "ko": {
      "name": "뷔르겐슈톡 호텔 & 알파인 스파",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Bürgenberg, Obbürgen의 압도적 비경과 프라이빗 휴식",
      "country": "스위스 루체른 호수",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "ビュルゲンシュトック・ホテル＆アルパインスパ",
      "subtitle": "世界最高峰のサンクチュアリ · Bürgenberg, Obbürgenの息をのむ絶景と至高のプライベート空間",
      "country": "スイス・ルツェルン湖",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "布尔根施托克度假酒店与高山水疗",
      "subtitle": "全球至臻隐世度假殿堂 · Bürgenberg, Obbürgen无可比拟的壮丽私密秘境",
      "country": "瑞士琉森湖",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-26": {
    "en": {
      "name": "The Silo Hotel",
      "subtitle": "Thomas Heatherwick’s Pillowed Glass Architectural Triumph Above V&A Waterfront",
      "country": "Cape Town, South Africa",
      "activeDealTag": "SAVE 25% (4+ NIGHTS)",
      "activeDealTitle": "Stay Longer · 25% Off (4+ Nights)",
      "activeDealDesc": "25% off room rates for 4+ nights + Private Zeitz MOCAA art museum tour & private wine tasting"
    },
    "ko": {
      "name": "더 사일로 호텔 케이프타운",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · V&A Waterfront, Cape Town의 압도적 비경과 프라이빗 휴식",
      "country": "남아프리카공화국 케이프타운",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Stay Longer · 25% Off (4+ Nights)",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ザ・サイロ・ホテル ケープタウン",
      "subtitle": "世界最高峰のサンクチュアリ · V&A Waterfront, Cape Townの息をのむ絶景と至高のプライベート空間",
      "country": "南アフリカ・ケープタウン",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Stay Longer · 25% Off (4+ Nights)",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "筒仓酒店",
      "subtitle": "全球至臻隐世度假殿堂 · V&A Waterfront, Cape Town无可比拟的壮丽私密秘境",
      "country": "南非开普敦",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Stay Longer · 25% Off (4+ Nights)",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-27": {
    "en": {
      "name": "Museum Hotel Cappadocia",
      "subtitle": "Turkey’s Sole Relais & Châteaux with Roman Infinity Pool Facing Daily Hot Air Balloons",
      "country": "Cappadocia, Turkey",
      "activeDealTag": "GUARANTEED CAVE SUITE UPGRADE",
      "activeDealTitle": "Guaranteed Cave Suite Upgrade",
      "activeDealDesc": "Guaranteed upgrade to Imperial Cave Suite for 3+ nights + Complimentary 4-course dinner for 2 at Lil'a"
    },
    "ko": {
      "name": "뮤지엄 호텔 카파도키아",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Uchisar, Nevsehir의 압도적 비경과 프라이빗 휴식",
      "country": "튀르키예 카파도키아",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Guaranteed Cave Suite Upgrade",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ミュージアム・ホテル・カッパドキア",
      "subtitle": "世界最高峰のサンクチュアリ · Uchisar, Nevsehirの息をのむ絶景と至高のプライベート空間",
      "country": "トルコ・カッパドキア",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Guaranteed Cave Suite Upgrade",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "卡帕多奇亚博物馆酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Uchisar, Nevsehir无可比拟的壮丽私密秘境",
      "country": "土耳其卡帕多奇亚",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Guaranteed Cave Suite Upgrade",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-28": {
    "en": {
      "name": "The Retreat at Blue Lagoon",
      "subtitle": "Subterranean Geothermal Sanctuary Carved into an 800-Year-Old Volcanic Lava Field",
      "country": "Grindavík, Iceland",
      "activeDealTag": "FREE IN-WATER MASSAGE FOR 2",
      "activeDealTitle": "In-Water Spa Ritual Special",
      "activeDealDesc": "Includes complimentary signature 4-step Blue Lagoon Ritual & private in-water geothermal massage for 2"
    },
    "ko": {
      "name": "더 리트리트 앳 블루 라군",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Grindavík, Reykjanes Peninsula의 압도적 비경과 프라이빗 휴식",
      "country": "아이슬란드 그린다비크",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "In-Water Spa Ritual Special",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ザ・リトリート・アット・ブルーラグーン",
      "subtitle": "世界最高峰のサンクチュアリ · Grindavík, Reykjanes Peninsulaの息をのむ絶景と至高のプライベート空間",
      "country": "アイスランド・グリンダヴィーク",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "In-Water Spa Ritual Special",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "蓝湖秘密水疗度假村",
      "subtitle": "全球至臻隐世度假殿堂 · Grindavík, Reykjanes Peninsula无可比拟的壮丽私密秘境",
      "country": "冰岛格林达维克",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "In-Water Spa Ritual Special",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-29": {
    "en": {
      "name": "Belmond Hotel Cipriani",
      "subtitle": "The Ultimate Venetian Aristocratic Hideaway on Giudecca Island with Olympic Seawater Pool",
      "country": "Venice, Italy",
      "activeDealTag": "DOUBLE RESORT CREDIT ($200)",
      "activeDealTitle": "Bellini Double Credit & Private Launch",
      "activeDealDesc": "$200 Bellini Club hotel credit + 24hr private mahogany launch service 'Shirley' across St. Mark's Square"
    },
    "ko": {
      "name": "벨몬드 호텔 치프리아니 베네치아",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Giudecca Island, Venice의 압도적 비경과 프라이빗 휴식",
      "country": "이탈리아 베네치아",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Bellini Double Credit & Private Launch",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ベルモンド・ホテル・チプリアーニ",
      "subtitle": "世界最高峰のサンクチュアリ · Giudecca Island, Veniceの息をのむ絶景と至高のプライベート空間",
      "country": "イタリア・ヴェネツィア",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Bellini Double Credit & Private Launch",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "贝梦德西普里亚尼酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Giudecca Island, Venice无可比拟的壮丽私密秘境",
      "country": "意大利威尼斯",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Bellini Double Credit & Private Launch",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-30": {
    "en": {
      "name": "Tierra Patagonia Hotel & Spa",
      "subtitle": "Organic Wind-Sculpted Lenga Lodge Framing Panoramic Horns of Torres del Paine",
      "country": "Patagonia, Chile",
      "activeDealTag": "STAY 4, PAY 3 (ALL-INCLUSIVE)",
      "activeDealTitle": "Patagonia All-Inclusive · Stay 4, Pay 3",
      "activeDealDesc": "Complimentary 4th night + Daily private excursions with naturalist guides & premium open bar"
    },
    "ko": {
      "name": "티에라 파타고니아 호텔 & 스파",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Torres del Paine, Magallanes의 압도적 비경과 프라이빗 휴식",
      "country": "Patagonia, Chile",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "ティエラ・パタゴニア・ホテル＆スパ",
      "subtitle": "世界最高峰のサンクチュアリ · Torres del Paine, Magallanesの息をのむ絶景と至高のプライベート空間",
      "country": "Patagonia, Chile",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "巴塔哥尼亚蒂埃拉酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Torres del Paine, Magallanes无可比拟的壮丽私密秘境",
      "country": "Patagonia, Chile",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-31": {
    "en": {
      "name": "Four Seasons Resort Bora Bora",
      "subtitle": "Monolithic Overwater Bungalows with Direct Panoramic Views of Sacred Mount Otemanu",
      "country": "Bora Bora, French Polynesia",
      "activeDealTag": "STAY 4, PAY 3 (1 NIGHT FREE)",
      "activeDealTitle": "Bora Bora Paradise · 4th Night Complimentary",
      "activeDealDesc": "Complimentary 4th night + Free round-trip catamaran boat transfers from Bora Bora Airport"
    },
    "ko": {
      "name": "포시즌스 리조트 보라보라",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Motu Tehotu, Bora Bora의 압도적 비경과 프라이빗 휴식",
      "country": "프랑스령 폴리네시아 보라보라",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "フォーシーズンズ リゾート ボラボラ",
      "subtitle": "世界最高峰のサンクチュアリ · Motu Tehotu, Bora Boraの息をのむ絶景と至高のプライベート空間",
      "country": "仏領ポリネシア・ボラボラ島",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "波拉波拉四季度假酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Motu Tehotu, Bora Bora无可比拟的壮丽私密秘境",
      "country": "法属波利尼西亚波拉波拉岛",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-32": {
    "en": {
      "name": "Rosewood Castiglion del Bosco",
      "subtitle": "800-Year-Old Medieval Tuscan Borgo and Historic Brunello di Montalcino Wine Estate",
      "country": "Tuscany, Italy",
      "activeDealTag": "STAY 3, PAY 2 (1 NIGHT FREE)",
      "activeDealTitle": "Tuscan Harvest · 3rd Night Complimentary",
      "activeDealDesc": "Complimentary 3rd night + Private Brunello di Montalcino historic winery tour & cellar tasting"
    },
    "ko": {
      "name": "로즈우드 카스틸리온 델 보스코",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Montalcino, Val d'Orcia의 압도적 비경과 프라이빗 휴식",
      "country": "이탈리아 토스카나",
      "activeDealTag": "3박 예약 시 1박 무료 (3 for 2)",
      "activeDealTitle": "시즌 한정 3박 결제 특전",
      "activeDealDesc": "3번째 투숙박 무료 제공 + 리조트 시그니처 웰컴 어메니티"
    },
    "ja": {
      "name": "ローズウッド・カスティリオン・デル・ボスコ",
      "subtitle": "世界最高峰のサンクチュアリ · Montalcino, Val d'Orciaの息をのむ絶景と至高のプライベート空間",
      "country": "イタリア・トスカーナ",
      "activeDealTag": "3泊目無料特典 (3 for 2)",
      "activeDealTitle": "シーズン限定 3泊目無料ステイ",
      "activeDealDesc": "3泊目のご宿泊無料 + リゾート特製ウェルカムギフト"
    },
    "zh": {
      "name": "瑰丽博斯克城堡庄园",
      "subtitle": "全球至臻隐世度假殿堂 · Montalcino, Val d'Orcia无可比拟的壮丽私密秘境",
      "country": "意大利托斯卡纳",
      "activeDealTag": "住三付二 · 免费赠送第3晚",
      "activeDealTitle": "当季尊享第3晚免费礼遇",
      "activeDealDesc": "连续入住第3晚免费赠送 + 庄园尊荣迎宾礼遇"
    }
  },
  "stay-33": {
    "en": {
      "name": "Amanzoe",
      "subtitle": "Modern Classical Acropolis Crowning an Olive-Clad Ridge on the Peloponnese",
      "country": "Porto Heli, Greece",
      "activeDealTag": "GUARANTEED UPGRADE AT BOOKING",
      "activeDealTitle": "Peloponnese Upgrade & Chauffeur",
      "activeDealDesc": "Guaranteed room upgrade upon confirmation + Complimentary round-trip Mercedes transfer from Athens"
    },
    "ko": {
      "name": "아만조에 펠로폰네소스",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Porto Heli, Peloponnese의 압도적 비경과 프라이빗 휴식",
      "country": "그리스 포르토 헬리",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Peloponnese Upgrade & Chauffeur",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "アマンゾエ ペロポネソス",
      "subtitle": "世界最高峰のサンクチュアリ · Porto Heli, Peloponneseの息をのむ絶景と至高のプライベート空間",
      "country": "ギリシャ・ポルトヘリ",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Peloponnese Upgrade & Chauffeur",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "伯罗奔尼撒安缦佐伊",
      "subtitle": "全球至臻隐世度假殿堂 · Porto Heli, Peloponnese无可比拟的壮丽私密秘境",
      "country": "希腊波多河丽",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Peloponnese Upgrade & Chauffeur",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-34": {
    "en": {
      "name": "One&Only Palmilla",
      "subtitle": "Legendary Baja Peninsula Hacienda Clifftop Retreat Overlooking the Sea of Cortez",
      "country": "Los Cabos, Mexico",
      "activeDealTag": "STAY 4, PAY 3 + $200 CREDIT",
      "activeDealTitle": "Baja Escape · 4th Night Free + Agave Masterclass",
      "activeDealDesc": "Complimentary 4th night + Exclusive private agave & vintage mezcal masterclass for two"
    },
    "ko": {
      "name": "원앤온리 팔밀라 로스카보스",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · San José del Cabo, Baja의 압도적 비경과 프라이빗 휴식",
      "country": "멕시코 로스카보스",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "ワン＆オンリー・パルミラ ロスカボス",
      "subtitle": "世界最高峰のサンクチュアリ · San José del Cabo, Bajaの息をのむ絶景と至高のプライベート空間",
      "country": "メキシコ・ロスカボス",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "洛斯卡波斯唯逸帕米拉酒店",
      "subtitle": "全球至臻隐世度假殿堂 · San José del Cabo, Baja无可比拟的壮丽私密秘境",
      "country": "墨西哥洛斯卡波斯",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-35": {
    "en": {
      "name": "Belmond Hotel Splendido",
      "subtitle": "Restored 16th-Century Clifftop Benedictine Monastery Overlooking Portofino Harbour",
      "country": "Portofino, Liguria, Italy",
      "activeDealTag": "SUNSET CRUISE & $200 CREDIT",
      "activeDealTitle": "Portofino Sunset Cruise & $200 Credit",
      "activeDealDesc": "Complimentary private 2-hour sunset cruise on wooden Gozzo boat + $200 culinary credit"
    },
    "ko": {
      "name": "벨몬드 호텔 스플렌디도 포르토피노",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Salita Baratta, Portofino의 압도적 비경과 프라이빗 휴식",
      "country": "Portofino, Liguria, Italy",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Portofino Sunset Cruise & $200 Credit",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ベルモンド・ホテル・スプレンディード",
      "subtitle": "世界最高峰のサンクチュアリ · Salita Baratta, Portofinoの息をのむ絶景と至高のプライベート空間",
      "country": "Portofino, Liguria, Italy",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Portofino Sunset Cruise & $200 Credit",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "贝梦德斯普兰迪多酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Salita Baratta, Portofino无可比拟的壮丽私密秘境",
      "country": "Portofino, Liguria, Italy",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Portofino Sunset Cruise & $200 Credit",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-36": {
    "en": {
      "name": "Soneva Fushi",
      "subtitle": "Barefoot Island Luxury & Two-Story Lagoon Water Slides in Baa Atoll Biosphere",
      "country": "Baa Atoll, Maldives",
      "activeDealTag": "STAY 4, PAY 3 + FREE SEAPLANE",
      "activeDealTitle": "Baa Atoll Special · Free Seaplane for Two",
      "activeDealDesc": "Complimentary 4th night + Free round-trip seaplane transfers for two from Malé"
    },
    "ko": {
      "name": "소네바 푸시 몰디브",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Kunfunadhoo Island, Baa Atoll의 압도적 비경과 프라이빗 휴식",
      "country": "몰디브 바 아톨",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "ソネバフシ モルディブ",
      "subtitle": "世界最高峰のサンクチュアリ · Kunfunadhoo Island, Baa Atollの息をのむ絶景と至高のプライベート空間",
      "country": "モルディブ・バア環礁",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "索尼娃芙西度假村",
      "subtitle": "全球至臻隐世度假殿堂 · Kunfunadhoo Island, Baa Atoll无可比拟的壮丽私密秘境",
      "country": "马尔代夫芭环礁",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-37": {
    "en": {
      "name": "The Brando",
      "subtitle": "Marlon Brando's 100% Sustainable Private Atoll of Pristine Polynesian Seclusion",
      "country": "Tetiaroa, French Polynesia",
      "activeDealTag": "25% EXTENDED STAY PRIVILEGE",
      "activeDealTitle": "Tetiaroa Extended Stay · 25% Off + Daily Spa",
      "activeDealDesc": "25% savings on stays of 4+ nights + Daily signature Polynesian spa treatment per villa"
    },
    "ko": {
      "name": "더 브란도 테티아로아",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Tetiaroa Atoll, French Polynesia의 압도적 비경과 프라이빗 휴식",
      "country": "프랑스령 폴리네시아 테티아로아",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Tetiaroa Extended Stay · 25% Off + Daily Spa",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ザ・ブランド テティアロア",
      "subtitle": "世界最高峰のサンクチュアリ · Tetiaroa Atoll, French Polynesiaの息をのむ絶景と至高のプライベート空間",
      "country": "仏領ポリネシア・テティアロア",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Tetiaroa Extended Stay · 25% Off + Daily Spa",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "白兰度私人岛屿度假村",
      "subtitle": "全球至臻隐世度假殿堂 · Tetiaroa Atoll, French Polynesia无可比拟的壮丽私密秘境",
      "country": "法属波利尼西亚特蒂亚罗阿",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Tetiaroa Extended Stay · 25% Off + Daily Spa",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-38": {
    "en": {
      "name": "Claridge's",
      "subtitle": "The Art Deco Crown Jewel of Mayfair Cherished by Royalty and Cinema Icons",
      "country": "London, United Kingdom",
      "activeDealTag": "GUARANTEED MAYFAIR UPGRADE",
      "activeDealTitle": "Mayfair Suite Upgrade & Champagne High Tea",
      "activeDealDesc": "Guaranteed room upgrade to Mayfair Suite at booking + Complimentary champagne afternoon tea for two"
    },
    "ko": {
      "name": "클라리지스 런던 메이페어",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Brook Street, Mayfair의 압도적 비경과 프라이빗 휴식",
      "country": "영국 런던",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Mayfair Suite Upgrade & Champagne High Tea",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "クラリッジズ ロンドン メイフェア",
      "subtitle": "世界最高峰のサンクチュアリ · Brook Street, Mayfairの息をのむ絶景と至高のプライベート空間",
      "country": "イギリス・ロンドン",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Mayfair Suite Upgrade & Champagne High Tea",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "伦敦克拉里奇酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Brook Street, Mayfair无可比拟的壮丽私密秘境",
      "country": "英国伦敦",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Mayfair Suite Upgrade & Champagne High Tea",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-39": {
    "en": {
      "name": "Mandapa, a Ritz-Carlton Reserve",
      "subtitle": "Sacred Ayung River Sanctuary Terraced into Ubud's Emerald Valley",
      "country": "Ubud, Bali, Indonesia",
      "activeDealTag": "STAY 3, PAY 2 + RIVER MASSAGE",
      "activeDealTitle": "Ubud Sacred Valley · 3rd Night Free + Massage",
      "activeDealDesc": "Complimentary 3rd night + 60-minute riverside Balinese signature massage for two"
    },
    "ko": {
      "name": "만다파 리츠칼튼 리저브 우붓",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Kedewatan, Ubud의 압도적 비경과 프라이빗 휴식",
      "country": "인도네시아 발리 우붓",
      "activeDealTag": "3박 예약 시 1박 무료 (3 for 2)",
      "activeDealTitle": "시즌 한정 3박 결제 특전",
      "activeDealDesc": "3번째 투숙박 무료 제공 + 리조트 시그니처 웰컴 어메니티"
    },
    "ja": {
      "name": "マンダパ・リッツ・カールトン・リザーブ",
      "subtitle": "世界最高峰のサンクチュアリ · Kedewatan, Ubudの息をのむ絶景と至高のプライベート空間",
      "country": "インドネシア・バリ島ウブド",
      "activeDealTag": "3泊目無料特典 (3 for 2)",
      "activeDealTitle": "シーズン限定 3泊目無料ステイ",
      "activeDealDesc": "3泊目のご宿泊無料 + リゾート特製ウェルカムギフト"
    },
    "zh": {
      "name": "曼达帕丽思卡尔顿隐世精品度假酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Kedewatan, Ubud无可比拟的壮丽私密秘境",
      "country": "印度尼西亚巴厘岛乌布",
      "activeDealTag": "住三付二 · 免费赠送第3晚",
      "activeDealTitle": "当季尊享第3晚免费礼遇",
      "activeDealDesc": "连续入住第3晚免费赠送 + 庄园尊荣迎宾礼遇"
    }
  },
  "stay-40": {
    "en": {
      "name": "Four Seasons Tented Camp Golden Triangle",
      "subtitle": "All-Inclusive Luxury Tented Safari High in the Misty Bamboo Jungle Overlooking Three Nations",
      "country": "Golden Triangle, Thailand",
      "activeDealTag": "ALL-INCLUSIVE EXPEDITION",
      "activeDealTitle": "Golden Triangle Expedition · Private Mekong Cruise",
      "activeDealDesc": "Full all-inclusive wilderness safari package + Complimentary private sunset longtail boat cruise on the Mekong"
    },
    "ko": {
      "name": "포시즌스 텐티드 캠프 골든 트라이앵글",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Sop Ruak, Chiang Rai의 압도적 비경과 프라이빗 휴식",
      "country": "태국 골든 트라이앵글",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Golden Triangle Expedition · Private Mekong Cruise",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "フォーシーズンズ テントキャンプ・ゴールデントライアングル",
      "subtitle": "世界最高峰のサンクチュアリ · Sop Ruak, Chiang Raiの息をのむ絶景と至高のプライベート空間",
      "country": "タイ・ゴールデントライアングル",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Golden Triangle Expedition · Private Mekong Cruise",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "金三角四季帐篷营地酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Sop Ruak, Chiang Rai无可比拟的壮丽私密秘境",
      "country": "泰国金三角",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Golden Triangle Expedition · Private Mekong Cruise",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-41": {
    "en": {
      "name": "Le Sirenuse",
      "subtitle": "18th-Century Crimson Palazzo Clinging to the Cliffs of Positano with 400 Evening Candles",
      "country": "Positano, Amalfi Coast, Italy",
      "activeDealTag": "STAY 4, PAY 3 + RIVA EXCURSION",
      "activeDealTitle": "Amalfi Dream · 4th Night Free + Riva Cruise",
      "activeDealDesc": "Complimentary 4th night + Sunset excursion along the Amalfi cliffs aboard vintage wooden boat Sant'Anna"
    },
    "ko": {
      "name": "르 시레누세 포지타노",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Via Cristoforo Colombo, Positano의 압도적 비경과 프라이빗 휴식",
      "country": "Positano, Amalfi Coast, Italy",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "ル・シレヌーセ ポジターノ",
      "subtitle": "世界最高峰のサンクチュアリ · Via Cristoforo Colombo, Positanoの息をのむ絶景と至高のプライベート空間",
      "country": "Positano, Amalfi Coast, Italy",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "波西塔诺塞壬海妖酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Via Cristoforo Colombo, Positano无可比拟的壮丽私密秘境",
      "country": "Positano, Amalfi Coast, Italy",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-42": {
    "en": {
      "name": "Rosewood Mayakoba",
      "subtitle": "Private Island Cenote Spa and Overwater Lagoon Suites in the Emerald Mangroves",
      "country": "Riviera Maya, Mexico",
      "activeDealTag": "STAY 4, PAY 3 + $200 DINING",
      "activeDealTitle": "Riviera Maya Retreat · 4th Night Free + $200 Dining",
      "activeDealDesc": "Complimentary 4th night + $200 culinary credit & private electric eco-boat lagoon wildlife tour"
    },
    "ko": {
      "name": "로즈우드 마야코바 리비에라 마야",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Playa del Carmen, Riviera Maya의 압도적 비경과 프라이빗 휴식",
      "country": "멕시코 리비에라 마야",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "ローズウッド・マヤコバ",
      "subtitle": "世界最高峰のサンクチュアリ · Playa del Carmen, Riviera Mayaの息をのむ絶景と至高のプライベート空間",
      "country": "メキシコ・リビエラマヤ",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "玛雅海岸瑰丽玛雅科巴酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Playa del Carmen, Riviera Maya无可比拟的壮丽私密秘境",
      "country": "墨西哥玛雅海岸",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-43": {
    "en": {
      "name": "Cheval Blanc St-Barth",
      "subtitle": "The Only Official French Palace in the Caribbean on the Sands of Flamands Bay",
      "country": "St-Barth, French West Indies",
      "activeDealTag": "GUARANTEED UPGRADE AT BOOKING",
      "activeDealTitle": "St-Barth Palace Upgrade & Transfers",
      "activeDealDesc": "Guaranteed room upgrade at confirmation + Round-trip luxury chauffeur airport/harbor transfers"
    },
    "ko": {
      "name": "슈발 블랑 세인트 바르스",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Anse des Flamands, Saint-Barth의 압도적 비경과 프라이빗 휴식",
      "country": "St-Barth, French West Indies",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "St-Barth Palace Upgrade & Transfers",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "シュヴァル・ブラン・サン・バルト",
      "subtitle": "世界最高峰のサンクチュアリ · Anse des Flamands, Saint-Barthの息をのむ絶景と至高のプライベート空間",
      "country": "St-Barth, French West Indies",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "St-Barth Palace Upgrade & Transfers",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "白马庄园圣巴泰勒米酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Anse des Flamands, Saint-Barth无可比拟的壮丽私密秘境",
      "country": "St-Barth, French West Indies",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "St-Barth Palace Upgrade & Transfers",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-44": {
    "en": {
      "name": "Amanyara",
      "subtitle": "Timber Pavilions Carved into Dramatic Ironshore Coastal Cliffs and Marine Park",
      "country": "Turks and Caicos Islands",
      "activeDealTag": "STAY 4, PAY 3 + $250 CREDIT",
      "activeDealTitle": "Amanyara Serenity · 4th Night Free + $250 Credit",
      "activeDealDesc": "Complimentary 4th night + $250 wellness & marine snorkeling safari credit"
    },
    "ko": {
      "name": "아만야라 터크스 케이커스",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Northwest Point, Providenciales의 압도적 비경과 프라이빗 휴식",
      "country": "Turks and Caicos Islands",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "アマンヤラ タークス・カイコス",
      "subtitle": "世界最高峰のサンクチュアリ · Northwest Point, Providencialesの息をのむ絶景と至高のプライベート空間",
      "country": "Turks and Caicos Islands",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "特克斯和凯科斯安缦亚拉",
      "subtitle": "全球至臻隐世度假殿堂 · Northwest Point, Providenciales无可比拟的壮丽私密秘境",
      "country": "Turks and Caicos Islands",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-45": {
    "en": {
      "name": "The Oberoi Amarvilas",
      "subtitle": "Unrivaled Direct Balcony Views of the Immortal Taj Mahal from Every Room",
      "country": "Agra, India",
      "activeDealTag": "GUARANTEED TAJ VIEW UPGRADE",
      "activeDealTitle": "Taj Mahal Royal View · Guaranteed Upgrade & Dinner",
      "activeDealDesc": "Guaranteed room upgrade to Taj Mahal View Premier Room + Private candlelit balcony dinner for two"
    },
    "ko": {
      "name": "디 오베로이 아마르빌라스 타지마할",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Taj East Gate Road, Agra의 압도적 비경과 프라이빗 휴식",
      "country": "인도 아그라",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Taj Mahal Royal View · Guaranteed Upgrade & Dinner",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "ジ・オベロイ・アマルヴィラス アーグラ",
      "subtitle": "世界最高峰のサンクチュアリ · Taj East Gate Road, Agraの息をのむ絶景と至高のプライベート空間",
      "country": "インド・アーグラ",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Taj Mahal Royal View · Guaranteed Upgrade & Dinner",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "阿格拉欧贝罗伊阿玛维拉酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Taj East Gate Road, Agra无可比拟的壮丽私密秘境",
      "country": "印度阿格拉",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Taj Mahal Royal View · Guaranteed Upgrade & Dinner",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-46": {
    "en": {
      "name": "Qasr Al Sarab Desert Resort by Anantara",
      "subtitle": "Monumental Arabian Fortress Emerging Amidst the Colossal Orange Dunes of the Empty Quarter",
      "country": "Rub' al Khali, Abu Dhabi, UAE",
      "activeDealTag": "STAY 3, PAY 2 + BEDOUIN DINNER",
      "activeDealTitle": "Desert Mirage · 3rd Night Free + Camel Safari",
      "activeDealDesc": "Complimentary 3rd night + Private sunset camel expedition & Bedouin campfire dinner under the stars"
    },
    "ko": {
      "name": "카스르 알 사랍 데저트 리조트 바이 아난타라",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Liwa Oasis, Rub' al Khali의 압도적 비경과 프라이빗 휴식",
      "country": "Rub' al Khali, Abu Dhabi, UAE",
      "activeDealTag": "3박 예약 시 1박 무료 (3 for 2)",
      "activeDealTitle": "시즌 한정 3박 결제 특전",
      "activeDealDesc": "3번째 투숙박 무료 제공 + 리조트 시그니처 웰컴 어메니티"
    },
    "ja": {
      "name": "カスル・アル・サラブ・デザートリゾート",
      "subtitle": "世界最高峰のサンクチュアリ · Liwa Oasis, Rub' al Khaliの息をのむ絶景と至高のプライベート空間",
      "country": "Rub' al Khali, Abu Dhabi, UAE",
      "activeDealTag": "3泊目無料特典 (3 for 2)",
      "activeDealTitle": "シーズン限定 3泊目無料ステイ",
      "activeDealDesc": "3泊目のご宿泊無料 + リゾート特製ウェルカムギフト"
    },
    "zh": {
      "name": "阿布扎比盖斯尔安萨拉卜沙漠度假酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Liwa Oasis, Rub' al Khali无可比拟的壮丽私密秘境",
      "country": "Rub' al Khali, Abu Dhabi, UAE",
      "activeDealTag": "住三付二 · 免费赠送第3晚",
      "activeDealTitle": "当季尊享第3晚免费礼遇",
      "activeDealDesc": "连续入住第3晚免费赠送 + 庄园尊荣迎宾礼遇"
    }
  },
  "stay-47": {
    "en": {
      "name": "Six Senses Zighy Bay",
      "subtitle": "Tandem Paraglide Arrival into Dramatic Musandam Fjords and Omani Stone Villas",
      "country": "Musandam Peninsula, Oman",
      "activeDealTag": "STAY 4, PAY 3 + FREE PARAGLIDE",
      "activeDealTitle": "Musandam Adventure · 4th Night Free + Paraglide",
      "activeDealDesc": "Complimentary 4th night + Complimentary tandem paragliding arrival into the bay for two"
    },
    "ko": {
      "name": "식스센스 지기 베이 오만",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Musandam Peninsula, Dibba의 압도적 비경과 프라이빗 휴식",
      "country": "오만 무산담 반도",
      "activeDealTag": "4박 예약 시 1박 무료 (4 for 3)",
      "activeDealTitle": "익스클루시브 4박 결제 특전",
      "activeDealDesc": "4번째 투숙박 무료 제공 + $200 프라이빗 리조트 크레딧"
    },
    "ja": {
      "name": "シックスセンシズ・ジギーベイ オマーン",
      "subtitle": "世界最高峰のサンクチュアリ · Musandam Peninsula, Dibbaの息をのむ絶景と至高のプライベート空間",
      "country": "オマーン・ムサンダム半島",
      "activeDealTag": "4泊目無料特典 (4 for 3)",
      "activeDealTitle": "ラグジュアリー長期滞在特典",
      "activeDealDesc": "4泊目のご宿泊無料 + $200相当のプライベートクレジット"
    },
    "zh": {
      "name": "阿曼杰格希湾六善酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Musandam Peninsula, Dibba无可比拟的壮丽私密秘境",
      "country": "阿曼穆桑代姆半岛",
      "activeDealTag": "住四付三 · 免费赠送第4晚",
      "activeDealTitle": "长假尊享第4晚免费礼遇",
      "activeDealDesc": "连续入住第4晚免费赠送 + 200美元度假村消费金额"
    }
  },
  "stay-48": {
    "en": {
      "name": "Explora Rapa Nui",
      "subtitle": "Sculptural Volcanic Eco-Lodge in Harmony with Easter Island's Ancient Moai Heritage",
      "country": "Easter Island, Chile",
      "activeDealTag": "ALL-INCLUSIVE ARCHAEOLOGY",
      "activeDealTitle": "Easter Island Discovery · All-Inclusive + 20% Off",
      "activeDealDesc": "All-inclusive private Moai expedition package + 20% savings on 4+ night extended stays"
    },
    "ko": {
      "name": "익스플로라 라파 누이 이스터 섬",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Te Miro Oone, Easter Island의 압도적 비경과 프라이빗 휴식",
      "country": "칠레 이스터 섬",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Easter Island Discovery · All-Inclusive + 20% Off",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "エクスプローラ・ラパ・ヌイ イースター島",
      "subtitle": "世界最高峰のサンクチュアリ · Te Miro Oone, Easter Islandの息をのむ絶景と至高のプライベート空間",
      "country": "チリ・イースター島",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Easter Island Discovery · All-Inclusive + 20% Off",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "复活节岛探索者酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Te Miro Oone, Easter Island无可比拟的壮丽私密秘境",
      "country": "智利复活节岛",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Easter Island Discovery · All-Inclusive + 20% Off",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-49": {
    "en": {
      "name": "Grand Hotel Tremezzo",
      "subtitle": "Belle Époque Floating Pontoon Pool Palace on Lake Como Overlooking Bellagio",
      "country": "Lake Como, Lombardy, Italy",
      "activeDealTag": "VINTAGE BOAT & $150 SPA",
      "activeDealTitle": "Lake Como Dolce Vita · Vintage Boat & $150 Spa",
      "activeDealDesc": "Complimentary 1-hour private tour aboard vintage wooden Ruy speed boat + $150 T Spa credit"
    },
    "ko": {
      "name": "그랜드 호텔 트레메초 코모 호수",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Via Regina, Tremezzina의 압도적 비경과 프라이빗 휴식",
      "country": "Lake Como, Lombardy, Italy",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Lake Como Dolce Vita · Vintage Boat & $150 Spa",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "グランド・ホテル・トレメッツォ コモ湖",
      "subtitle": "世界最高峰のサンクチュアリ · Via Regina, Tremezzinaの息をのむ絶景と至高のプライベート空間",
      "country": "Lake Como, Lombardy, Italy",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Lake Como Dolce Vita · Vintage Boat & $150 Spa",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "科莫湖特雷梅佐大酒店",
      "subtitle": "全球至臻隐世度假殿堂 · Via Regina, Tremezzina无可比拟的壮丽私密秘境",
      "country": "Lake Como, Lombardy, Italy",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Lake Como Dolce Vita · Vintage Boat & $150 Spa",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  },
  "stay-50": {
    "en": {
      "name": "Little Kulala",
      "subtitle": "Bleached Pod Architecture and Rooftop Starbeds in the Red Dunes of Sossusvlei",
      "country": "Sossusvlei, Namib Desert, Namibia",
      "activeDealTag": "HOT AIR BALLOON & STARBED",
      "activeDealTitle": "Namib Sky Safari · Hot Air Balloon & Starbed",
      "activeDealDesc": "Complimentary private sunrise Sossusvlei hot air balloon safari + Rooftop stargazing sleepout setup"
    },
    "ko": {
      "name": "리틀 쿨랄라 소서스블레이 나미비아",
      "subtitle": "세계 최고 권위의 럭셔리 생추어리 · Kulala Wilderness Reserve, Sossusvlei의 압도적 비경과 프라이빗 휴식",
      "country": "Sossusvlei, Namib Desert, Namibia",
      "activeDealTag": "공식 생추어리 익스클루시브 패키지",
      "activeDealTitle": "Namib Sky Safari · Hot Air Balloon & Starbed",
      "activeDealDesc": "호텔 공식 독점 혜택 + Fora VIP 예약 시 추가 혜택 적용"
    },
    "ja": {
      "name": "リトル・クララ ソススフレイ",
      "subtitle": "世界最高峰のサンクチュアリ · Kulala Wilderness Reserve, Sossusvleiの息をのむ絶景と至高のプライベート空間",
      "country": "Sossusvlei, Namib Desert, Namibia",
      "activeDealTag": "公式サンクチュアリ限定パッケージ",
      "activeDealTitle": "Namib Sky Safari · Hot Air Balloon & Starbed",
      "activeDealDesc": "ホテル公式特別特典 + Fora VIP予約による追加サービス"
    },
    "zh": {
      "name": "索苏斯弗莱小库拉拉野奢宿营地",
      "subtitle": "全球至臻隐世度假殿堂 · Kulala Wilderness Reserve, Sossusvlei无可比拟的壮丽私密秘境",
      "country": "Sossusvlei, Namib Desert, Namibia",
      "activeDealTag": "官方隐世庄园独家度假套餐",
      "activeDealTitle": "Namib Sky Safari · Hot Air Balloon & Starbed",
      "activeDealDesc": "官方专享礼遇 + 尊享Fora VIP贵宾叠加权益"
    }
  }
};


export function getLocalizedStay<T extends { id: string; name: string; subtitle: string; country: string; activeDeal?: any }>(stay: T, lang: Language): T {
  if (lang === 'en') return stay;
  const trans = HOTEL_TRANSLATIONS[stay.id]?.[lang];
  if (!trans) return stay;

  return {
    ...stay,
    name: trans.name || stay.name,
    subtitle: trans.subtitle || stay.subtitle,
    country: trans.country || stay.country,
    activeDeal: stay.activeDeal ? {
      ...stay.activeDeal,
      tag: trans.activeDealTag || stay.activeDeal.tag,
      title: trans.activeDealTitle || stay.activeDeal.title,
      desc: trans.activeDealDesc || stay.activeDeal.desc,
    } : undefined,
  };
}
