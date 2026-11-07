import { JapaneseGrammarLongformThumbnail } from "./JapaneseGrammarLongformThumbnail";
import { JapaneseGrammarLongformThumbnailStage3 } from "./JapaneseGrammarLongformThumbnailStage3";
import { JapaneseGrammarLongformThumbnailStage2 } from "./JapaneseGrammarLongformThumbnailStage2";
import React from "react";
import { Composition } from "remotion";
import { ReelsComp } from "./ReelsComp";
import { Scene as ProductAdScene } from "./ProductAd";
import { Scene as ProductLineupScene } from "./ProductLineup";
import { Scene as ProductFeatureScene } from "./ProductFeature";
import { Scene as ShortsAdScene } from "./ShortsAd";
import { Scene as ProductDiscountScene } from "./ProductDiscount";
import { Scene as ProductCharacterScene } from "./ProductCharacter";
import { Scene as ProductShowcaseScene } from "./ProductShowcase";
import { Scene as CharacterTypingScene } from "./CharacterTyping";
import { Scene as CharacterIdleScene } from "./CharacterIdle";
import { Scene as CharacterJumpScene } from "./CharacterJump";
import { Scene as ParallaxSceneComp } from "./ParallaxScene";
import { Scene as CharacterCardScene } from "./CharacterCard";
import { Scene as CharacterNetworkScene } from "./CharacterNetwork";
import { Scene as StickerEffectsScene } from "./StickerEffects";
import { Scene as EasingSpringCompareScene } from "./EasingSpringCompare";
import { Scene as SeriesLoopCompareScene } from "./SeriesLoopCompare";
import { Scene as MediaComponentsScene } from "./MediaComponents";
import { Scene as TransitionShowcaseScene } from "./TransitionShowcase";
import { Scene as LightLeakCompareScene } from "./LightLeakCompare";
import { Scene as StarburstCompareScene } from "./StarburstCompare";
import { Scene as ShaderEffectsGalleryScene } from "./ShaderEffectsGallery";
import { Scene as VideoEffectsRecipesScene } from "./VideoEffectsRecipes";
import { Scene as MotionBlurCompareScene } from "./MotionBlurCompare";
import { Scene as NoiseShowcaseScene } from "./NoiseShowcase";
import { Scene as PathsShowcaseScene } from "./PathsShowcase";
import { Scene as ShapesShowcaseScene } from "./ShapesShowcase";
import { Scene as Svg3DShowcaseScene } from "./Svg3DShowcase";
import { Scene as AnimationUtilsShowcaseScene } from "./AnimationUtilsShowcase";
import { Scene as RoughNotationShowcaseScene } from "./RoughNotationShowcase";
import { Scene as RoundedTextBoxShowcaseScene } from "./RoundedTextBoxShowcase";
import { Scene as TikTokCaptionsShowcaseScene } from "./TikTokCaptionsShowcase";
import { Scene as LayoutUtilsShowcaseScene } from "./LayoutUtilsShowcase";
// import { Scene as GoogleFontsShowcaseScene } from "./GoogleFontsShowcase";
// import { Scene as FontsShowcaseScene } from "./FontsShowcase";
import { Scene as AnimatedEmojiShowcaseScene } from "./AnimatedEmojiShowcase";
import { Scene as MacCursorShowcaseScene } from "./MacCursorShowcase";
import { Scene as GsapShowcaseScene } from "./GsapShowcase";
import { Scene as LottieShowcaseScene } from "./LottieShowcase";
import { Scene as GifShowcaseScene } from "./GifShowcase";
import { Scene as AudioVisualizerShowcaseScene } from "./AudioVisualizerShowcase";
import { Scene as SfxShowcaseScene } from "./SfxShowcase";
import { Scene as MediaControlsShowcaseScene } from "./MediaControlsShowcase";
import { Scene as ThreeCanvasShowcaseScene } from "./ThreeCanvasShowcase";
import { GirlGroupPureVisual } from "./GirlGroupPureVisual";
import { PostMotionLanguageCard } from "./PostMotionLanguageCard";
import { PostMotionGlobalSMB } from "./PostMotionGlobalSMB";
import { PostMotionProduct3D } from "./PostMotionProduct3D";
import { PostMotionVisualVibe } from "./PostMotionVisualVibe";
import { PostMotionWebHero } from "./PostMotionWebHero";
import { PostMotionStayHelper } from "./PostMotionStayHelper";
import { PostMotionStayHelperAmangiri } from "./PostMotionStayHelperAmangiri";
import { PostMotionStayHelperBulgari } from "./PostMotionStayHelperBulgari";
import { PostMotionStayHelperKohSamui } from "./PostMotionStayHelperKohSamui";
import { PostMotionStayHelperSonevaJani } from "./PostMotionStayHelperSonevaJani";
import { PostMotionStayHelperChedi } from "./PostMotionStayHelperChedi";
import { PostMotionStayHelperMonastero } from "./PostMotionStayHelperMonastero";
import { PostMotionStayHelperAmanKyoto } from "./PostMotionStayHelperAmanKyoto";
import { PostMotionStayHelperSingita } from "./PostMotionStayHelperSingita";
import { PostMotionStayHelperEdenRoc } from "./PostMotionStayHelperEdenRoc";
import { PostMotionStayHelperUniversal, defaultStayHelperProps } from "./PostMotionStayHelperUniversal";
import { PostMotionWeddingHelper, defaultWeddingHelperProps } from "./PostMotionWeddingHelper";
import { PostMotionThursdayTest } from "./PostMotionThursdayTest";
import { PostMotionLongformTest } from "./PostMotionLongformTest";
import { PostMotionKoreanLoop } from "./PostMotionKoreanLoop";
import { PostMotionKoreanLoopLongform } from "./PostMotionKoreanLoopLongform";
import { PostMotionKoreanLoopLove } from "./PostMotionKoreanLoopLove";
import { PostMotionKoreanLoopStreetFood } from "./PostMotionKoreanLoopStreetFood";
import { PostMotionKoreanLoop3in1 } from "./PostMotionKoreanLoop3in1";
import { PostMotionKoreanLoopBBQ } from "./PostMotionKoreanLoopBBQ";
import { PostMotionKoreanLoopOliveYoung } from "./PostMotionKoreanLoopOliveYoung";
import { PostMotionKoreanLoopSplitBill } from "./PostMotionKoreanLoopSplitBill";
import { PostMotionKoreanLoopAllInOne } from "./PostMotionKoreanLoopAllInOne";
import { PostMotionKoreanLoopSpanishLongform } from "./PostMotionKoreanLoopSpanishLongform";
import {
  PostMotionKoreanLoopSpanishLongform15,
  defaultSpanishLongformProps,
} from "./PostMotionKoreanLoopSpanishLongform15";
import {
  PostMotionKoreanLoopEnglishLongform15,
  defaultEnglishLongformProps,
} from "./PostMotionKoreanLoopEnglishLongform15";

import { PostMotionPassportReels } from "./PostMotionPassportReels";
import { PostMotionShortsTemplate } from "./PostMotionShortsTemplate";
import { PostMotionLongformTemplate } from "./PostMotionLongformTemplate";
import { PostMotionThursday3in1Template } from "./PostMotionThursday3in1Template";
import { PostMotion3in1Template } from "./PostMotion3in1Template";
import { NewsIn6Reels } from "./NewsIn6Reels";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ?-?- [NEWS IN 6 리얼 ?-적 모션 릴스: ?-레?-션 ?-동 가변 ?-독??(1080x1920) ?-?- */}
      <Composition
        id="NewsIn6Reels"
        component={NewsIn6Reels}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          const p = props as any;
          if (p.slides && Array.isArray(p.slides) && p.slides.length > 0) {
            const total = p.slides.reduce(
              (acc: number, s: any) => acc + (s.durationInFrames || p.framesPerSlide || 90),
              0
            );
            return { durationInFrames: total };
          }
          const framesPerSlide = p.framesPerSlide || 90;
          const totalSlides = p.slides?.length || 6;
          return {
            durationInFrames: framesPerSlide * totalSlides,
          };
        }}
        defaultProps={{
          slides: [],
        }}
      />
      {/* ?-?- [FirstMotion ?-권 주의?-항 카드?-스 릴스: 21-?6???-독??(1080x1920)] ?-?- */}
      <Composition
        id="PostMotionPassportReels"
        component={PostMotionPassportReels}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ?-?- [FirstMotion 코리?-루??KoreanLoop) ?-규 ?-츠: 3-?문장?????-츠???--? 3-in-1 (25-?무절??] ?-?- */}
      <Composition
        id="PostMotionKoreanLoop3in1"
        component={PostMotionKoreanLoop3in1}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ?-?- [FirstMotion 코리?-루??KoreanLoop) 16:9 ?-?-드 ?-스??롱폼] ?-?- */}
      <Composition
        id="PostMotionKoreanLoopLongform"
        component={PostMotionKoreanLoopLongform}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ?-?- [FirstMotion 코리?-루??KoreanLoop) ?-츠 1: K-?-라-?명-????--?] ?-?- */}
      <Composition
        id="PostMotionKoreanLoop"
        component={PostMotionKoreanLoop}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ?-?- [FirstMotion 코리?-루??KoreanLoop) ?-츠 2: 로맨??고백 ????좋아?? ?-?- */}
      <Composition
        id="PostMotionKoreanLoopLove"
        component={PostMotionKoreanLoopLove}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ?-?- [FirstMotion 코리?-루??KoreanLoop) ?-츠 3: 길거-??-식 주문 ?-볶?? ?-?- */}
      <Composition
        id="PostMotionKoreanLoopStreetFood"
        component={PostMotionKoreanLoopStreetFood}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ?-?- [FirstMotion 코리?-루???-인???-면 ?-독???-츠 3-?(???-레??100% ?-네???-출 보장)] ?-?- */}
      <Composition
        id="KoreanLoopShortsBBQ"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-BBQ Guide]",
          categoryColor: "#dc2626",
          categoryBg: "#fef2f2",
          title: "Must-Know Phrase at Korean BBQ ?--",
          tagText: "K-FOOD SURVIVAL",
          korean: "불판 좀 갈아주세??",
          romanization: "[Bul-pan jom ga-ra-ju-se-yo.]",
          english: '"Could you change the grill plate, please?"',
          nuanceTitle: "K-BBQ Pro Culture Tip ?--",
          nuanceDesc: "Swap grill nets anytime to prevent meat from burning!",
          audioFile: "audio_shorts_bbq.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsOliveYoung"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Olive Young & Shopping]",
          categoryColor: "#db2777",
          categoryBg: "#fdf2f8",
          title: "Magic Phrase at Olive Young ?--",
          tagText: "K-BEAUTY SHOPPING",
          korean: "?-일 ???--???-?뭐예??",
          romanization: "[Je-il jal na-ga-neun ge mwo-ye-yo?]",
          english: '"What\'s your #1 best seller here?"',
          nuanceTitle: "Olive Young Cheat Code ?--",
          nuanceDesc: "Ask this to instantly discover the viral #1 trending items!",
          audioFile: "audio_shorts_oliveyoung.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsSplitBill"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Dining in Korea]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "How to Split the Bill in Korea ?--",
          tagText: "DINING ETIQUETTE",
          korean: "?-로?-로 계산??주세??",
          romanization: "[Tta-ro-tta-ro gye-san-hae-ju-se-yo.]",
          english: '"Could we pay separately, please?"',
          nuanceTitle: "Seoul Dining Manners ?--",
          nuanceDesc: "The smoothest, most polite formula to split the bill with friends!",
          audioFile: "audio_shorts_splitbill.wav",
        }}
      />
      <Composition
        id="KoreanLoopShortsChicken"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Chicken Guide]",
          categoryColor: "#ea580c",
          categoryBg: "#fff7ed",
          title: "Order Korean Fried Chicken Like a Pro ?--",
          tagText: "K-CHICKEN HACK",
          korean: "반반?-로 ?-주?-요.",
          romanization: "[Ban-ban-eu-ro hae-ju-se-yo.]",
          english: '"Half and half, please! Crispy and Yangnyeom."',
          nuanceTitle: "Korea's #1 Delivery Formula ?--",
          nuanceDesc: 'Use "반반" to get half crispy original and half sweet spicy yangnyeom!',
          audioFile: "audio_shorts_chicken.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsSubway"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Subway and Transit]",
          categoryColor: "#059669",
          categoryBg: "#ecfdf5",
          title: "How to Ask for Subway Transfers in Seoul ?--",
          tagText: "SEOUL METRO ?--",
          korean: "?-디??갈아?-??",
          romanization: "[Eo-di-seo ga-ra-ta-yo?]",
          english: '"Where do I transfer, please?"',
          nuanceTitle: "Seoul Transit Survival ?--",
          nuanceDesc: "Ask this at massive transfer hubs like Gangnam, Hongdae or Seoul Station!",
          audioFile: "audio_shorts_subway.wav",
        }}
      />

      {/* ?-?- [FirstMotion 코리?-루???-규 6??(LIVE 3??+ ?-늘 -??-약 3??] ?-?- */}
      <Composition
        id="KoreanLoopShortsAah"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Cafe Culture]",
          categoryColor: "#b45309",
          categoryBg: "#fef3c7",
          title: "The #1 Slang Word at Korean Cafes",
          tagText: "K-CAFE CULTURE",
          korean: "?-아 ?-나 주세??",
          romanization: "[Ah-ah ha-na ju-se-yo.]",
          english: '"One Iced Americano, please!"',
          nuanceTitle: "Seoul Cafe Slang",
          nuanceDesc: '"Ah-ah" is short for Iced Americano, Korea\'s #1 drink!',
          audioFile: "audio_shorts_aah.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsRamyeon"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Han River Picnic]",
          categoryColor: "#dc2626",
          categoryBg: "#fef2f2",
          title: "Secret Formula for Han River Ramyeon",
          tagText: "HAN RIVER PICNIC",
          korean: "?-면 -??-디??받아??",
          romanization: "[Ra-myeon mul eo-di-seo ba-da-yo?]",
          english: '"Where do I get hot water for ramyeon?"',
          nuanceTitle: "Han River Instant Ramyeon Hack",
          nuanceDesc: "Instant ramyeon cookers at Han River dispense water automatically!",
          audioFile: "audio_shorts_ramyeon.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsPhoto"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Photo Booth]",
          categoryColor: "#7c3aed",
          categoryBg: "#f5f3ff",
          title: "Must-Know Phrase at Korean Photo Booths",
          tagText: "K-PHOTO BOOTH",
          korean: "?-진 ??-???찍을게요!",
          romanization: "[Sa-jin han beon deo jji-geul-ge-yo!]",
          english: '"Let\'s take one more shot!"',
          nuanceTitle: "Selfie Studio Survival",
          nuanceDesc: "Korea\'s famous 4-cut self-studios give you extra takes if you are quick!",
          audioFile: "audio_shorts_photo.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsDelivery"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Korean Food Delivery]",
          categoryColor: "#ea580c",
          categoryBg: "#fff7ed",
          title: "How Koreans Order Food Delivery Like a Local",
          tagText: "FOOD DELIVERY",
          korean: "-??-에 ?-고 가주세??",
          romanization: "[Mun a-pe du-go ga-ju-se-yo.]",
          english: '"Please leave it in front of the door."',
          nuanceTitle: "Seoul Contactless Delivery",
          nuanceDesc: "The universal instruction for Baemin and Coupang Eats riders!",
          audioFile: "audio_shorts_delivery.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsEncore"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Pop Concert]",
          categoryColor: "#db2777",
          categoryBg: "#fdf2f8",
          title: "The #1 Word Shouted at K-Pop Concerts",
          tagText: "K-POP CONCERT",
          korean: "?-콜 ??-???",
          romanization: "[Aeng-kol han beon deo!]",
          english: '"Encore, one more time!"',
          nuanceTitle: "Concert Live Survival",
          nuanceDesc: "Chant this with fans after the lights dim to call the idols back!",
          audioFile: "audio_shorts_encore.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsDiscount"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Korean Market Guide]",
          categoryColor: "#059669",
          categoryBg: "#ecfdf5",
          title: "How to Politely Ask for a Discount in Korea",
          tagText: "TRADITIONAL MARKET",
          korean: "조금-?깎아주세??",
          romanization: "[Jo-geum-man kka-kka-ju-se-yo.]",
          english: '"Could you give me a little discount, please?"',
          nuanceTitle: "Traditional Market Manners",
          nuanceDesc: "Use with a bright smile at traditional markets like Dongdaemun or Gwangjang!",
          audioFile: "audio_shorts_discount.wav",
        }}
      />


      {/* ?-?- [KoreanLoop Español ?-페?-어 -?론칭 ?-키지 (?-츠 3??+ 16:9 ?-?-드 롱폼 1??] ?-?- */}
      <Composition
        id="KoreanLoopShortsES01-Kdrama"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Frases de K-Dramas]",
          categoryColor: "#ef4444",
          categoryBg: "#fef2f2",
          title: "Frase Esencial en K-Dramas ?--",
          tagText: "K-DRAMA HIT",
          korean: "?--?",
          romanization: "[Dae-bak!]",
          english: '"¡Increíble! / ¡Qué genial!"',
          nuanceTitle: "?-- Consejo de K-Drama",
          nuanceDesc: "¡Úsalo cuando pase algo asombroso, divertido o genial!",
          audioFile: "audio_es_shorts_01.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES02-BBQ"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Food / K-BBQ]",
          categoryColor: "#ea580c",
          categoryBg: "#fff7ed",
          title: "Frase para Cambiar Parrilla ?--",
          tagText: "K-FOOD SURVIVAL",
          korean: "불판 좀 갈아주세??",
          romanization: "[Bul-pan yom ga-ra-ju-se-yo.]",
          english: '"¿Puede cambiar la parrilla, por favor?"',
          nuanceTitle: "?-- Consejo K-BBQ ?--",
          nuanceDesc: "¡Pide cambiar la parrilla gratis para no quemar la carne!",
          audioFile: "audio_es_shorts_02.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES03-OliveYoung"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Compras en Seúl]",
          categoryColor: "#db2777",
          categoryBg: "#fdf2f8",
          title: "Frase Secreta en Olive Young ?--",
          tagText: "K-BEAUTY SHOPPING",
          korean: "?-일 ???--???-?뭐예??",
          romanization: "[Ye-il yal na-ga-neun ge mwo-ye-yo?]",
          english: '"¿Cuál es el producto más vendido aquí?"',
          nuanceTitle: "?-- Consejo K-Beauty ?--",
          nuanceDesc: "¡Pregunta esto para descubrir los cosméticos virales al instante!",
          audioFile: "audio_es_shorts_03.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES04-Jinjjayo"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Reacciones en Coreano]",
          categoryColor: "#8b5cf6",
          categoryBg: "#f5f3ff",
          title: "La Reacción #1 en K-Dramas ?--",
          tagText: "REACCIÓN #1",
          korean: "진짜??!",
          romanization: "[Jin-jja-yo?!]",
          english: '"¿En serio? / ¡¿De verdad?!"',
          nuanceTitle: "?-- Consejo de K-Drama",
          nuanceDesc: "¡La pregunta más común en Corea para mostrar sorpresa e interés!",
          audioFile: "audio_es_shorts_04.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES05-SplitBill"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Restaurantes en Seúl]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "Frase para Dividir la Cuenta ?--",
          tagText: "PAGO SEPARADO",
          korean: "?-로?-로 계산??주세??",
          romanization: "[Tta-ro-tta-ro gye-san-hae ju-se-yo.]",
          english: '"¿Podemos pagar por separado?"',
          nuanceTitle: "?-- Consejo K-Food ?--",
          nuanceDesc: "En Corea se suele pagar todo junto, pero con esta frase pagas por separado.",
          audioFile: "audio_es_shorts_05.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES06-Convenience"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Tienda de Conveniencia]",
          categoryColor: "#16a34a",
          categoryBg: "#f0fdf4",
          title: "Frase Clave en Tiendas ?--",
          tagText: "TIENDA CONVENIENCIA",
          korean: "봉투 ?-요 ?-어??",
          romanization: "[Bong-tu pil-yo eop-seo-yo.]",
          english: '"No necesito bolsa, gracias."',
          nuanceTitle: "?-- Consejo K-Life ?--",
          nuanceDesc: "En Corea las bolsas plásticas se cobran aparte. ¡Usa esta frase para ahorrar!",
          audioFile: "audio_es_shorts_06.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES07-Fighting"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Ánimo en Coreano]",
          categoryColor: "#ef4444",
          categoryBg: "#fef2f2",
          title: "Cómo Dar Ánimos en Corea ??",
          tagText: "K-DRAMA HIT",
          korean: "?-이?? (?-내?-요!)",
          romanization: "[Pai-ting! / Jim-ne-se-yo!]",
          english: '"¡Ánimo! / ¡Tú puedes!"',
          nuanceTitle: "?-- Consejo de K-Drama",
          nuanceDesc: "¡La expresión #1 que escucharás en cada drama para dar fuerza y motivación!",
          audioFile: "audio_es_shorts_07.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES08-DidYouEat"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Cultura Coreana]",
          categoryColor: "#ea580c",
          categoryBg: "#fff7ed",
          title: "El Saludo Más Común en Seúl ?--",
          tagText: "SALUDO REAL",
          korean: "-?먹었?-요?",
          romanization: "[Bap mo-go-so-yo?]",
          english: '"¿Ya comiste? / ¿Cómo estás?"',
          nuanceTitle: "?-- Consejo Cultural ?--",
          nuanceDesc: "En Corea no es solo sobre comida; ¡es la forma más cálida de preguntar cómo estás!",
          audioFile: "audio_es_shorts_08.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES09-Delicious"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Food / Restaurantes]",
          categoryColor: "#d97706",
          categoryBg: "#fffbeb",
          title: "Frase para Elogiar la Comida ?--",
          tagText: "K-FOOD HIT",
          korean: "진짜 맛있?-요!",
          romanization: "[Chin-cha ma-si-so-yo!]",
          english: '"¡Está realmente delicioso!"',
          nuanceTitle: "?-- Consejo K-Food ?--",
          nuanceDesc: "Díselo al chef o al dueño del restaurante y te recibirán con una gran sonrisa.",
          audioFile: "audio_es_shorts_09.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES10-ExcuseMe"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Restaurantes en Seúl]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "Llamar al Mesero con Educación ?--",
          tagText: "EN EL RESTAURANTE",
          korean: "?-기요!",
          romanization: "[Cho-gui-yo!]",
          english: '"¡Disculpe! / ¡Por aquí, por favor!"',
          nuanceTitle: "?-- Consejo en Seúl ?--",
          nuanceDesc: "Si la mesa no tiene botón de llamada, alza la mano y di '?-기요' (Cho-gui-yo) con cortesía.",
          audioFile: "audio_es_shorts_10.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES11-HowMuch"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Compras en Seúl]",
          categoryColor: "#16a34a",
          categoryBg: "#f0fdf4",
          title: "Pregunta de Oro al Comprar ?---?",
          tagText: "COMPRAS EN SEÚL",
          korean: "?-거 ?-마?-요?",
          romanization: "[I-go ol-ma-ye-yo?]",
          english: '"¿Cuánto cuesta esto?"',
          nuanceTitle: "?-- Consejo de Compras ?---?",
          nuanceDesc: "Apunta al producto y haz esta pregunta en mercados tradicionales o tiendas de moda.",
          audioFile: "audio_es_shorts_11.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES12-Gwaenchana"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Frases Mágicas]",
          categoryColor: "#3b82f6",
          categoryBg: "#eff6ff",
          title: "La Frase Mágica para 'Está Bien' 👌",
          tagText: "K-DRAMA HIT",
          korean: "괜찮아요!",
          romanization: "[Guen-cha-na-yo!]",
          english: '"¡Está bien! / No te preocupes."',
          nuanceTitle: "💡 Consejo de K-Drama 👌",
          nuanceDesc: "La palabra más versátil de Corea: sirve para aceptar disculpas, tranquilizar o rechazar con cortesía.",
          audioFile: "audio_es_shorts_12.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES13-HowLong"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Viajar por Seúl]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "Preguntar '¿Cuánto Tarda?' ⏱️",
          tagText: "TIEMPO & VIAJE",
          korean: "얼마나 걸려요?",
          romanization: "[Ol-ma-na gol-lyo-yo?]",
          english: '"¿Cuánto tiempo tarda / se demora?"',
          nuanceTitle: "💡 Consejo en Seúl ⏱️",
          nuanceDesc: "Úsala en taxis, al esperar mesa en restaurantes virales o al pedir comida para llevar.",
          audioFile: "audio_es_shorts_13.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES14-TakePic"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Fotos en Corea]",
          categoryColor: "#ec4899",
          categoryBg: "#fdf2f8",
          title: "Pedir que te Tomen una Foto 📸",
          tagText: "FOTO PERFECTA",
          korean: "사진 좀 찍어주세요!",
          romanization: "[Sa-chin chom chi-go-chu-se-yo!]",
          english: '"¿Puede tomarnos una foto, por favor?"',
          nuanceTitle: "💡 Consejo Fotográfico 📸",
          nuanceDesc: "Los coreanos son expertos en tomar fotos de cuerpo entero con el mejor ángulo. ¡Pídelo sin pena!",
          audioFile: "audio_es_shorts_14.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES15-Discount"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Mercados de Corea]",
          categoryColor: "#d97706",
          categoryBg: "#fffbeb",
          title: "Pedir Descuento en Mercados 🛍️",
          tagText: "MERCADO REAL",
          korean: "조금만 깎아주세요!",
          romanization: "[Cho-guem-man kka-kka-chu-se-yo!]",
          english: '"¿Me hace un descuento, por favor?"',
          nuanceTitle: "💡 Consejo de Regateo 🛍️",
          nuanceDesc: "Díselo con una gran sonrisa a las 'ajummas' en mercados tradicionales. ¡En tiendas oficiales no se regatea!",
          audioFile: "audio_es_shorts_15.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES16-Cheers"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Food / Brindis]",
          categoryColor: "#e11d48",
          categoryBg: "#fff1f2",
          title: "Cómo Brindar en Corea 🍻",
          tagText: "BRINDIS COREANO",
          korean: "짠! (건배!)",
          romanization: "[Chan! / Gon-be!]",
          english: '"¡Salud! / ¡Brindemos!"',
          nuanceTitle: "💡 Etiqueta de Brindis 🍻",
          nuanceDesc: "Al brindar con mayores, sostén el vaso con dos manos y choca tu vaso un poco más abajo por respeto.",
          audioFile: "audio_es_shorts_16.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES17-ExcuseMe"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Moverse en Seúl]",
          categoryColor: "#2563eb",
          categoryBg: "#eff6ff",
          title: "Pedir Permiso en el Metro 🚇",
          tagText: "METRO DE SEÚL",
          korean: "잠시만요!",
          romanization: "[Cham-si-man-yo!]",
          english: '"¡Un momento! / Con permiso."',
          nuanceTitle: "💡 Consejo en Seúl 🚇",
          nuanceDesc: "Úsalo en el metro para pedir paso al bajar o cuando necesites un segundo.",
          audioFile: "audio_es_shorts_17.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES18-EnjoyMeal"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Food / Etiqueta]",
          categoryColor: "#ea580c",
          categoryBg: "#fff7ed",
          title: "Desear '¡Buen Provecho!' 🍲",
          tagText: "K-FOOD HIT",
          korean: "맛있게 드세요!",
          romanization: "[Ma-sit-gue deu-se-yo!]",
          english: '"¡Buen provecho! / ¡Que lo disfrutes!"',
          nuanceTitle: "💡 Etiqueta K-Food 🍲",
          nuanceDesc: "Lo que dicen los meseros o compañeros de mesa antes de empezar a comer.",
          audioFile: "audio_es_shorts_18.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES19-Goodbye"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Cultura Coreana]",
          categoryColor: "#8b5cf6",
          categoryBg: "#f5f3ff",
          title: "El Secreto para Decir 'Adiós' 👋",
          tagText: "DESPEDIDA REAL",
          korean: "안녕히 계세요!",
          romanization: "[An-nyong-ji gue-se-yo!]",
          english: '"¡Adiós! (al que se queda)"',
          nuanceTitle: "💡 Truco en Corea 👋",
          nuanceDesc: "Di '계세요' [gue-se-yo] si tú te vas del lugar y la otra persona se queda allí.",
          audioFile: "audio_es_shorts_19.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES20-ToGo"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Restaurantes / To-Go]",
          categoryColor: "#d97706",
          categoryBg: "#fffbeb",
          title: "Preguntar '¿Es Para Llevar?' 🥡",
          tagText: "COMIDA PARA LLEVAR",
          korean: "포장되나요?",
          romanization: "[Po-chang-dwe-na-yo?]",
          english: '"¿Se puede pedir para llevar?"',
          nuanceTitle: "💡 K-Food To-Go 🥡",
          nuanceDesc: "En Corea casi toda la comida de restaurantes se puede empacar para llevar a casa.",
          audioFile: "audio_es_shorts_20.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES21-Receipt"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Compras en Corea]",
          categoryColor: "#16a34a",
          categoryBg: "#f0fdf4",
          title: "Frase al Pagar en Tiendas 🧾",
          tagText: "PAGO EN CAJA",
          korean: "영수증 버려주세요!",
          romanization: "[Yong-su-cheung bo-ryo-chu-se-yo!]",
          english: '"Puede tirar el recibo, por favor."',
          nuanceTitle: "💡 Consejo Diario 🧾",
          nuanceDesc: "Si no necesitas el ticket de compra en tiendas o cafés, usa esta frase corta y natural.",
          audioFile: "audio_es_shorts_21.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES22-Toilet"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Supervivencia en Seúl]",
          categoryColor: "#ef4444",
          categoryBg: "#fef2f2",
          title: "La Pregunta de Oro en Seúl 🚻",
          tagText: "SUPERVIVENCIA",
          korean: "화장실 어디예요?",
          romanization: "[Jwa-chang-sil o-di-ye-yo?]",
          english: '"¿Dónde está el baño?"',
          nuanceTitle: "💡 Consejo en Corea 🚻",
          nuanceDesc: "En muchas cafeterías y tiendas, la clave del baño viene impresa al final del recibo.",
          audioFile: "audio_es_shorts_22.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES23-Water"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Restaurantes / K-Food]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "Pedir Agua en Restaurantes 💧",
          tagText: "RESTAURANTE",
          korean: "물 좀 주세요!",
          romanization: "[Mul chom chu-se-yo!]",
          english: '"¿Me da agua, por favor?"',
          nuanceTitle: "💡 Costumbre K-Food 💧",
          nuanceDesc: "En Corea el agua siempre es 100% gratis; si dice \'물은 셀프\', puedes servirte tú mismo.",
          audioFile: "audio_es_shorts_23.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES24-Congrats"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Amigos y Fiestas]",
          categoryColor: "#ec4899",
          categoryBg: "#fdf2f8",
          title: "Cómo Felicitar a Alguien 🎉",
          tagText: "CELEBRACIÓN",
          korean: "축하해요!",
          romanization: "[Chu-k'a-je-yo!]",
          english: '"¡Felicidades! / ¡Enhorabuena!"',
          nuanceTitle: "💡 Frase Festiva 🎉",
          nuanceDesc: "Para cumpleaños añade \'생일\' delante: \'생일 축하해요\' [Seng-il chu-k\'a-je-yo] con aplausos.",
          audioFile: "audio_es_shorts_24.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES25-Wifi"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Cafeterías de Seúl]",
          categoryColor: "#8b5cf6",
          categoryBg: "#f5f3ff",
          title: "Pedir la Contraseña de Wi-Fi 📶",
          tagText: "CAFÉ & TECH",
          korean: "와이파이 비밀번호 뭐예요?",
          romanization: "[Wa-i-p'a-i bi-mil-bon-jo mwo-ye-yo?]",
          english: '"¿Cuál es la clave del Wi-Fi?"',
          nuanceTitle: "💡 Tip Tecnológico 📶",
          nuanceDesc: "Corea tiene el Wi-Fi más veloz del mundo; casi siempre está en el mostrador o en la servilleta.",
          audioFile: "audio_es_shorts_25.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES26-Sorry"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Modales y Respeto]",
          categoryColor: "#059669",
          categoryBg: "#ecfdf5",
          title: "Disculparse con Educación 🙏",
          tagText: "MODALES FORMALES",
          korean: "죄송합니다!",
          romanization: "[Chwe-song-jam-ni-da!]",
          english: '"¡Lo siento mucho! / Disculpe."',
          nuanceTitle: "💡 Respeto en Seúl 🙏",
          nuanceDesc: "La disculpa más respetuosa y formal si tropiezas con alguien o cometes un error involuntario.",
          audioFile: "audio_es_shorts_26.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES27-Photo"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Fotografía en Corea]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "Pedir Permiso para Fotos 📸",
          tagText: "FOTO EN SEÚL",
          korean: "여기서 사진 찍어도 돼요?",
          romanization: "[Yo-gui-so sa-chin chi-go-do dwe-yo?]",
          english: '"¿Se pueden tomar fotos aquí?"',
          nuanceTitle: "💡 Consejo en Corea 📸",
          nuanceDesc: "Pregunta siempre en tiendas pop-up, galerías o cafés antes de grabar con tu cámara.",
          audioFile: "audio_es_shorts_27.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES28-Slowly"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Comunicación Fácil]",
          categoryColor: "#16a34a",
          categoryBg: "#f0fdf4",
          title: "Cuando Hablan Rápido 🗣️",
          tagText: "HABLAR DESPACIO",
          korean: "천천히 말씀해 주세요.",
          romanization: "[Chon-chon-ji mal-sseum-je chu-se-yo.]",
          english: '"Hable más despacio, por favor."',
          nuanceTitle: "💡 Salvavidas Real 🗣️",
          nuanceDesc: "Si un coreano habla muy veloz, dilo con una sonrisa y te explicarán palabra por palabra.",
          audioFile: "audio_es_shorts_28.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES29-Enjoyed"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Food y Restaurantes]",
          categoryColor: "#ea580c",
          categoryBg: "#fff7ed",
          title: "Al Terminar de Comer 🍲",
          tagText: "K-FOOD CHEF",
          korean: "맛있게 드셨어요?",
          romanization: "[Ma-sit-gue deu-syo-so-yo?]",
          english: '"¿Disfrutó la comida?"',
          nuanceTitle: "💡 Etiqueta en Seúl 🍲",
          nuanceDesc: "Te lo preguntará el dueño o chef al pagar; responde: \'네, 정말 맛있었어요!\' con energía.",
          audioFile: "audio_es_shorts_29.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES30-Menu"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Restaurantes de Seúl]",
          categoryColor: "#8b5cf6",
          categoryBg: "#f5f3ff",
          title: "Pedir la Carta o Menú 📋",
          tagText: "PEDIR EL MENÚ",
          korean: "저기요, 메뉴판 좀 주세요!",
          romanization: "[Cho-gui-yo, me-nyu-p'an chom chu-se-yo!]",
          english: '"Disculpe, ¿me da el menú, por favor?"',
          nuanceTitle: "💡 Restaurante Tip 📋",
          nuanceDesc: "En muchos locales la carta está en la mesa o pegada en la pared; pídelo así si falta.",
          audioFile: "audio_es_shorts_30.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES31-GoodDay"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Buenos Deseos]",
          categoryColor: "#f59e0b",
          categoryBg: "#fffbeb",
          title: "Desear un Buen Día ☀️",
          tagText: "BUEN DÍA",
          korean: "좋은 하루 보내세요!",
          romanization: "[Cho-eun ja-ru bo-ne-se-yo!]",
          english: '"¡Que tengas un buen día!"',
          nuanceTitle: "💡 Despedida Cálida ☀️",
          nuanceDesc: "Díselo a baristas, conductores o recepcionistas al salir; te recordarán con mucho cariño.",
          audioFile: "audio_es_shorts_31.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES32-TryOn"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Compras de Moda]",
          categoryColor: "#ec4899",
          categoryBg: "#fdf2f8",
          title: "Probarse Ropa en Seúl 👗",
          tagText: "MODA EN COREA",
          korean: "이거 입어봐도 돼요?",
          romanization: "[I-go i-bo-bwa-do dwe-yo?]",
          english: '"¿Me puedo probar esto?"',
          nuanceTitle: "💡 Tiendas de Ropa 👗",
          nuanceDesc: "En tiendas de Hongdae pregunta siempre; en prendas blancas suelen pedir usar protector facial.",
          audioFile: "audio_es_shorts_32.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES33-Spicy"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Food Extremo]",
          categoryColor: "#ef4444",
          categoryBg: "#fef2f2",
          title: "Pedir Comida Picante 🌶️",
          tagText: "K-FOOD PICANTE",
          korean: "맵게 해 주세요!",
          romanization: "[Mep-kke je chu-se-yo!]",
          english: '"Hágalo picante, por favor."',
          nuanceTitle: "💡 Reto K-Food 🌶️",
          nuanceDesc: "Díselo al mesero si amas el picante real coreano en tteokbokki o guisos.",
          audioFile: "audio_es_shorts_33.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES34-WhereBoard"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Transporte en Seúl]",
          categoryColor: "#2563eb",
          categoryBg: "#eff6ff",
          title: "Dónde Tomar el Transporte 🚇",
          tagText: "TRANSPORTE",
          korean: "어디서 타요?",
          romanization: "[O-di-so t'a-yo?]",
          english: '"¿Dónde se toma / sube?"',
          nuanceTitle: "💡 Tip en Estaciones 🚇",
          nuanceDesc: "En terminales grandes o paradas dobles, muestra el nombre de tu destino y usa esta frase.",
          audioFile: "audio_es_shorts_34.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES35-Service"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Cultura del Servicio]",
          categoryColor: "#f59e0b",
          categoryBg: "#fffbeb",
          title: "¿Regalo Gratis de la Casa? 🎁",
          tagText: "SERVICIO GRATIS",
          korean: "서비스예요?",
          romanization: "[So-bi-seu-ye-yo?]",
          english: '"¿Es cortesía de la casa?"',
          nuanceTitle: "💡 Cultura en Seúl 🎁",
          nuanceDesc: "En restaurantes a veces traen un platillo extra o bebida gratis como '서비스' [so-bi-seu].",
          audioFile: "audio_es_shorts_35.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES36-SeeYou"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Amigos en Corea]",
          categoryColor: "#10b981",
          categoryBg: "#ecfdf5",
          title: "Despedida Entre Amigos 👋",
          tagText: "AMIGOS COREANOS",
          korean: "다음에 또 봐요!",
          romanization: "[Da-eum-e tto bwa-yo!]",
          english: '"¡Nos vemos la próxima vez!"',
          nuanceTitle: "💡 Despedida Cálida 👋",
          nuanceDesc: "La frase perfecta para cerrar una velada o salida con amigos locales y mantener el contacto.",
          audioFile: "audio_es_shorts_36.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES37-KakaoTalk"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Conectar con Amigos]",
          categoryColor: "#f59e0b",
          categoryBg: "#fffbeb",
          title: "Pedir el KakaoTalk 📱",
          tagText: "KAKAOTALK",
          korean: "카톡 아이디 알려줄 수 있어요?",
          romanization: "[K'a-t'ok a-i-di al-ryo-chul su i-so-yo?]",
          english: '"¿Me das tu ID de KakaoTalk?"',
          nuanceTitle: "💡 Tip Social en Corea 📱",
          nuanceDesc: "En Corea casi nadie usa WhatsApp; el 99% se comunica por KakaoTalk. ¡Pide su ID para no perder el contacto!",
          audioFile: "audio_es_shorts_37.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES38-Headache"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Farmacia y Salud]",
          categoryColor: "#dc2626",
          categoryBg: "#fef2f2",
          title: "Medicina para el Dolor de Cabeza 💊",
          tagText: "FARMACIA EN COREA",
          korean: "두통약 하나 주세요.",
          romanization: "[Du-t'ong-nyak ja-na chu-se-yo.]",
          english: '"Deme medicina para el dolor de cabeza, por favor."',
          nuanceTitle: "💡 Farmacias en Seúl 💊",
          nuanceDesc: "En las farmacias ('약국' [yak-guk]) no requieres receta para analgésicos comunes. ¡Te entregarán una cajita al instante!",
          audioFile: "audio_es_shorts_38.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES39-LessIce"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Cafeterías en Seúl]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "Pedir Café con Poco Hielo 🧊",
          tagText: "CAFÉ EN COREA",
          korean: "얼음 적게 넣어주세요.",
          romanization: "[Ol-eum cho-kke no-o-chu-se-yo.]",
          english: '"Ponga poco hielo, por favor."',
          nuanceTitle: "💡 Tip en Cafeterías ☕",
          nuanceDesc: "En Corea suelen llenar el vaso con bastante hielo. Si dices esta frase tendrás más bebida y sabor concentrado.",
          audioFile: "audio_es_shorts_39.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES40-BestMenu"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Restaurantes Locales]",
          categoryColor: "#ea580c",
          categoryBg: "#fff7ed",
          title: "Preguntar el Plato Estrella 🍲",
          tagText: "K-FOOD RECOMENDADO",
          korean: "여기서 뭐가 제일 맛있어요?",
          romanization: "[Yo-gi-so mwo-ga che-il ma-si-so-yo?]",
          english: '"¿Qué es lo más delicioso aquí?"',
          nuanceTitle: "💡 Secreto Gourmet 🍲",
          nuanceDesc: "Los chefs locales adoran que les pidas su recomendación de la casa. ¡Te servirán su especialidad con el mejor trato!",
          audioFile: "audio_es_shorts_40.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsES41-Weekend"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Saludos Semanales]",
          categoryColor: "#10b981",
          categoryBg: "#ecfdf5",
          title: "Feliz Fin de Semana 🎉",
          tagText: "VIERNES EN COREA",
          korean: "주말 잘 보내세요!",
          romanization: "[Chu-mal chal bo-ne-se-yo!]",
          english: '"¡Que pase un buen fin de semana!"',
          nuanceTitle: "💡 Saludo de Viernes 🎉",
          nuanceDesc: "La despedida obligatoria de cada viernes al salir del trabajo, terminar clases o despedirte de conocidos en Corea.",
          audioFile: "audio_es_shorts_41.wav",
        }}
      />





            <Composition
        id="KoreanLoopLongformEN-Phrases15"
        component={PostMotionKoreanLoopEnglishLongform15}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultEnglishLongformProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(30, props.totalFrames),
        })}
      />

<Composition
        id="KoreanLoopLongformES-Phrases15"
        component={PostMotionKoreanLoopSpanishLongform15}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultSpanishLongformProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(30, props.totalFrames),
        })}
      />

      <Composition
        id="KoreanLoopLongformES01-Survival5"
        component={PostMotionKoreanLoopSpanishLongform}
        durationInFrames={1500}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ?-?- [FirstMotion 16:9 ?-?-드 롱폼 ?-스??(1920x1080 50문장 리마?-터)] ?-?- */}
      <Composition
        id="PostMotionLongformTest"
        component={PostMotionLongformTest}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ?-?- [FirstMotion ?-일 ?-상 ?-용 ?-스??(목요??직장??공감 ?-츠 3D ?-립 카드)] ?-?- */}
      <Composition
        id="PostMotionThursdayTest"
        component={PostMotionThursdayTest}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ?-?- [FirstMotion 목요??출근-?1-??-츠: ?-본?? ?-?- */}
      <Composition
        id="PostMotionThursdayJA"
        component={PostMotionShortsTemplate}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-본??",
          badgeColor: "#ef4444",
          badgeBg: "#fef2f2",
          title: "목요??출근-??-실 공감 ?-본??3문장",
          numberBadge: "1 / 3",
          primaryText: "?-だ?-曜?-だ?-ん?-信?-ら?-な?--?",
          pronunciation: "[마다 모쿠??비다 ?-테 ?--??-레?-이]",
          meaning: "?-직??목요?-이?-니... 주말 ?-제 ?-?",
          backSubtitle: "직장???-실 ?-앙???-전 ?-복",
          backMainQuote: "체감?- ?--? 금요??밤인??br />?-실?- ?-직 목요???-침!",
          backPoint1: "???-な?-て: '~?-니'?-며 믿기 ?-든 ?-정???--??-는 감정 ?-현",
          backPoint2: "???-쿄 직장?-들??목요???-침 지?-철?-서 가??많이 ?-는 ?-탄!",
          backShadowing: "?-だ?-曜?-だ?-ん?-信?-ら?-な?--?",
        }}
      />

      {/* ?-?- [FirstMotion 목요??출근-?1-??-츠: ?-페?-어] ?-?- */}
      <Composition
        id="PostMotionThursdayES"
        component={PostMotionShortsTemplate}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-페?-어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "목요??출근-??-실 공감 ?-페?-어 3문장",
          numberBadge: "1 / 3",
          primaryText: "No puedo creer que apenas sea jueves.",
          pronunciation: "[???-에???-레?-르 -??-페?-스 ?-아 ?-에베스]",
          meaning: "?-직??겨우 목요?-이?-니... 주말 ?-제 ?-?",
          backSubtitle: "직장???-실 ?-앙???-전 ?-복",
          backMainQuote: "몸-? ?--? 주말?-데<br />출근-??-계??목요??",
          backPoint1: "??apenas: '겨우/고작'?-라???-으-??-간???-디-?-????-는 부??",
          backPoint2: "???-페?-·중?--? 직장?-들??목요?-마???-아?-는 ?-??공감 구어-?",
          backShadowing: "No puedo creer que apenas sea jueves.",
        }}
      />

      {/* ?-?- [FirstMotion 목요??출근-?1-??-츠: 중국?? ?-?- */}
      <Composition
        id="PostMotionThursdayZH"
        component={PostMotionShortsTemplate}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 중국??",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "목요??출근-??-실 공감 중국??3문장",
          numberBadge: "1 / 3",
          primaryText: "?-不?-相信才?-四??",
          pronunciation: "[-?부 -??-앙??차이 ?-?-스]",
          meaning: "?-직 겨우 목요?-이?-니... 주말 ?-제 ?-?",
          backSubtitle: "직장???-실 ?-앙???-전 ?-복",
          backMainQuote: "마음?- ?--? ?-근?-는??br />?-력??보니 ?-직 목요??",
          backPoint1: "????cái): '겨우/?-제?-야'?-는 ?-앙?-로 ?-쉬?--??-탈??강조",
          backPoint2: "??베이징·상?-이 직장?-들???-침 출근길에 ?-로 건네???-실 ?-식!",
          backShadowing: "?-不?-相信才?-四??",
        }}
      />

      {/* ?-?- [FirstMotion 목요??출근-?1-??-츠: ?-도?-시?-어] ?-?- */}
      <Composition
        id="PostMotionThursdayID"
        component={PostMotionShortsTemplate}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-도?-시?-어]",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "목요??출근-??-실 공감 ?-니??3문장",
          numberBadge: "1 / 3",
          primaryText: "Nggak nyangka baru hari Kamis.",
          pronunciation: "[?-각 ?-까 바루 ?-리 까-???",
          meaning: "?-직??목요?-이?-니... 주말 ?-제 ?-?",
          backSubtitle: "직장???-실 ?-앙???-전 ?-복",
          backMainQuote: "체력?- ?--? 방전?-데<br />?-일 ??출근?-야 ?-다??",
          backPoint1: "??Nggak nyangka: '?-각지??못했??믿기지 ?-는?????--? 구어 ?-현",
          backPoint2: "???-카르-? ?-근 직장?-들??목요???-침 가??격하-??-치???-마??",
          backShadowing: "Nggak nyangka baru hari Kamis.",
        }}
      />

      {/* ?-?- [FirstMotion 목요??출근-?3-in-1 ?-츠: ?-어 (?-성 무절???-연 ?-흡)] ?-?- */}
      <Composition
        id="PostMotionThursday3in1EN"
        component={PostMotionThursday3in1Template}
        durationInFrames={927}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-어]",
          badgeColor: "#ef4444",
          badgeBg: "#fef2f2",
          title: "목요??출근-??-실 공감 ?-어 3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 168, flipEndFrame: 192, endFrame: 367 },
            { startFrame: 367, flipStartFrame: 487, flipEndFrame: 511, endFrame: 645 },
            { startFrame: 645, flipStartFrame: 780, flipEndFrame: 804, endFrame: 927 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "I'm already hungry. What should I eat for lunch?",
              pronunciation: "[?-임 ?-레???-그-? ???-드 ?-이 ?????-치?]",
              meaning: "벌써 배고?? ?-늘 ?-심 -?먹-??",
              backSubtitle: "직장???-실 공감",
              backMainQuote: "출근 지?-철 ?-?-마??br />?-심 메뉴부??고-? -?",
              backPoint1: "??already hungry: 출근-?공복???-탈???-태",
              backPoint2: "??직장?-들???-침??가??많이 ?-는 ?-각!",
              backShadowing: "I'm already hungry.",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "I can't believe it's only Thursday.",
              pronunciation: "[?-이 캔트 빌리-??-츠 ?-리 ?-스?-이]",
              meaning: "?-직??목요?-이?-니... 주말 ?-제 ?-?",
              backSubtitle: "직장???-실 ?-앙???-전 ?-복",
              backMainQuote: "몸-? ?--? 금요??밤인??br />출근-??-계??목요??",
              backPoint1: "??only Thursday: '고작 목요???-라???-탈-?",
              backPoint2: "??목요???-침 가??격하-?공감?-는 구어-?",
              backShadowing: "It's only Thursday.",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "Let's leave on time today without any trouble!",
              pronunciation: "[?-츠 리브 ???-???-데???-드?-웃 ?-니 ?-러-?]",
              meaning: "?-늘???-발 무사??칼퇴?-자!",
              backSubtitle: "직장?-의 간절???-근 기원",
              backMainQuote: "불필?-한 ?-근?- ?-절!<br />?-늘??최고 목표??칼퇴",
              backPoint1: "??leave on time: '?-시 ?-근(칼퇴)?-다'",
              backPoint2: "??without trouble: '?-무??문제 ?-이 무사??",
              backShadowing: "Let's leave on time today!",
            },
          ],
        }}
      />

      {/* ?-?- [FirstMotion 목요??출근-?3-in-1 ?-츠: ?-본??(?-성 무절???-연 ?-흡)] ?-?- */}
      <Composition
        id="PostMotionThursday3in1JA"
        component={PostMotionThursday3in1Template}
        durationInFrames={959}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-본??",
          badgeColor: "#ef4444",
          badgeBg: "#fef2f2",
          title: "목요??출근-??-실 공감 ?-본??3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 181, flipEndFrame: 205, endFrame: 380 },
            { startFrame: 380, flipStartFrame: 521, flipEndFrame: 545, endFrame: 680 },
            { startFrame: 680, flipStartFrame: 812, flipEndFrame: 836, endFrame: 959 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "?-う?-腹空い?-。今?-の?-昼何食?-よ?-？",
              pronunciation: "[-? ?-나-??-이?-. -????-히-??-니 ?-베요-?]",
              meaning: "벌써 배고?? ?-늘 ?-심 -?먹-??",
              backSubtitle: "직장???-실 공감",
              backMainQuote: "출근-?만원 ?-철?-서<br />?-늘 ?-심 메뉴 고-? -?",
              backPoint1: "???-腹空い?? '배고?-다'???-연?-러???-상 ?-현",
              backPoint2: "??何食?-よ?? '-?먹을-?' ?-잣-??-현",
              backShadowing: "今日??--?-何食べ?-う-?",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "?-だ?-曜?-だ?-ん?-信?-ら?-な?--?",
              pronunciation: "[마다 모쿠??비다 ?-테 ?--??-레?-이]",
              meaning: "?-직??목요?-이?-니... 주말 ?-제 ?-?",
              backSubtitle: "직장???-실 ?-앙???-전 ?-복",
              backMainQuote: "체감?- ?--? 주말?-데<br />?-실?- ?-직 목요???-침!",
              backPoint1: "???-な?-て: '~?-니'?-며 믿기 ?-든 ?-정 ?-현",
              backPoint2: "???-쿄 직장?-들??목요???-침 가??많이 ?-는 ?-탄!",
              backShadowing: "?-だ?-曜?-だ?-ん?-信?-ら?-な?--?",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "今日?-無事に定時?-社し?-う-?",
              pronunciation: "[-?-?무-?????지?-?-샤 ?-요-!]",
              meaning: "?-늘??무사??칼퇴?-자!",
              backSubtitle: "직장?-의 간절???-근 기원",
              backMainQuote: "?-늘 ?-루??버텨?-자!<br />목표??무사???-시 ?-근",
              backPoint1: "??定時?--???지?-?-샤): '?-시 ?-근(칼퇴)'",
              backPoint2: "???-事??무-???: '-????-이, 무사??",
              backShadowing: "今日?-定?-退社し?-う-?",
            },
          ],
        }}
      />

      {/* ?-?- [FirstMotion 목요??출근-?3-in-1 ?-츠: ?-페?-어 (?-성 무절???-연 ?-흡)] ?-?- */}
      <Composition
        id="PostMotionThursday3in1ES"
        component={PostMotionThursday3in1Template}
        durationInFrames={921}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-페?-어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "목요??출근-??-실 공감 ?-페?-어 3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 154, flipEndFrame: 178, endFrame: 353 },
            { startFrame: 353, flipStartFrame: 486, flipEndFrame: 510, endFrame: 644 },
            { startFrame: 644, flipStartFrame: 774, flipEndFrame: 798, endFrame: 921 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "Ya tengo hambre. ¿Qué comemos hoy?",
              pronunciation: "[???-고 ?-브?? -?꼬메모스 ?-이?]",
              meaning: "벌써 배고?? ?-늘 ?-심 -?먹-??",
              backSubtitle: "직장???-실 공감",
              backMainQuote: "출근-?버스 ?-?-마??br />?-심 메뉴부??고-? -?",
              backPoint1: "??tengo hambre: '배-? 고프??",
              backPoint2: "??¿Qué comemos?: '?-리 -?먹을-?'",
              backShadowing: "Ya tengo hambre.",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "No puedo creer que apenas sea jueves.",
              pronunciation: "[???-에???-레?-르 -??-페?-스 ?-아 ?-에베스]",
              meaning: "?-직??겨우 목요?-이?-니... 주말 ?-제 ?-?",
              backSubtitle: "직장???-실 ?-앙???-전 ?-복",
              backMainQuote: "몸-? ?--? 주말?-데<br />출근-??-계??목요??",
              backPoint1: "??apenas: '겨우/고작'?-라???-탈??감정",
              backPoint2: "???-페?-·중?--? 직장?-들???-??공감 구어-?",
              backShadowing: "Apenas sea jueves.",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "¡Salgamos a tiempo hoy sin problemas!",
              pronunciation: "[?--?모스 ???-엠???-이 ???-로블레마스!]",
              meaning: "?-늘??무사??칼퇴?-자!",
              backSubtitle: "직장?-의 간절???-근 기원",
              backMainQuote: "불필?-한 ?-근?- ?-절!<br />?-늘??최고 목표??칼퇴",
              backPoint1: "??salir a tiempo: '?-시간에 ?-근?-다'",
              backPoint2: "??sin problemas: '문제 ?-이 무사??",
              backShadowing: "¡Salgamos a tiempo!",
            },
          ],
        }}
      />

      {/* ?-?- [FirstMotion 목요??출근-?3-in-1 ?-츠: 중국??(?-성 무절???-연 ?-흡)] ?-?- */}
      <Composition
        id="PostMotionThursday3in1ZH"
        component={PostMotionThursday3in1Template}
        durationInFrames={880}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 중국??",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "목요??출근-??-실 공감 중국??3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 140, flipEndFrame: 164, endFrame: 339 },
            { startFrame: 339, flipStartFrame: 448, flipEndFrame: 472, endFrame: 612 },
            { startFrame: 612, flipStartFrame: 723, flipEndFrame: 747, endFrame: 880 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "已经饿了?-今天中?-吃什么？",
              pronunciation: "[?-징 ?-어?? 찐티??종우 -??-머?]",
              meaning: "벌써 배고?? ?-늘 ?-심 -?먹-??",
              backSubtitle: "직장???-실 공감",
              backMainQuote: "출근 지?-철 ?-?-마??br />?-심 메뉴부??고-? -?",
              backPoint1: "??已经饿了: '벌써 배고?-다'",
              backPoint2: "???--?-? '-?먹-??' ?-상 구어",
              backShadowing: "今天-?--?--?么？",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "?-不?-相信才?-四??",
              pronunciation: "[-?부 -??-앙??차이 ?-?-스]",
              meaning: "?-직 겨우 목요?-이?-니... 주말 ?-제 ?-?",
              backSubtitle: "직장???-실 ?-앙???-전 ?-복",
              backMainQuote: "마음?- ?--? ?-근?-는??br />?-력??보니 ?-직 목요??",
              backPoint1: "????cái): '겨우/고작'?-라???-탈??강조",
              backPoint2: "??중국 직장?-들??출근길에 ?-로 건네???-식!",
              backShadowing: "?-不?-相信才?-四??",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "今天也要?-时下班-?",
              pronunciation: "[찐티?????-오 준???-아-?]",
              meaning: "?-늘??무사??칼퇴?-자!",
              backSubtitle: "직장?-의 간절???-근 기원",
              backMainQuote: "?-늘 ?-루??버텨?-자!<br />목표??무사???-시 ?-근",
              backPoint1: "???-时下班: '?-시 ?-근(칼퇴)?-다'",
              backPoint2: "??也要: '~??-??-겠?????-짐",
              backShadowing: "?-时下班-?",
            },
          ],
        }}
      />

      {/* ?-?- [FirstMotion 목요??출근-?3-in-1 ?-츠: ?-도?-시?-어 (?-성 무절???-연 ?-흡)] ?-?- */}
      <Composition
        id="PostMotionThursday3in1ID"
        component={PostMotionThursday3in1Template}
        durationInFrames={983}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-도?-시?-어]",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "목요??출근-??-실 공감 ?-니??3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 189, flipEndFrame: 213, endFrame: 388 },
            { startFrame: 388, flipStartFrame: 523, flipEndFrame: 547, endFrame: 681 },
            { startFrame: 681, flipStartFrame: 835, flipEndFrame: 859, endFrame: 983 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "Udah laper nih. Makan siang apa ya hari ini?",
              pronunciation: "[?-다 ?-뻐-??? 마깐 ?-앙 ?-빠 ???-리 ?-니?]",
              meaning: "벌써 배고?? ?-늘 ?-심 -?먹-??",
              backSubtitle: "직장???-실 공감",
              backMainQuote: "출근-??-토바이 부?- ??br />?-심 메뉴부??고-? -?",
              backPoint1: "??Udah laper: '벌써 배고??",
              backPoint2: "??Makan siang apa: '?-심 -?먹-??'",
              backShadowing: "Udah laper nih.",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "Nggak nyangka baru hari Kamis.",
              pronunciation: "[?-각 ?-까 바루 ?-리 까-???",
              meaning: "?-직??목요?-이?-니... 주말 ?-제 ?-?",
              backSubtitle: "직장???-실 ?-앙???-전 ?-복",
              backMainQuote: "체력?- ?--? 방전?-데<br />?-일 ??출근?-야 ?-다??",
              backPoint1: "??Nggak nyangka: '?-각지??못했??믿기지 ?-는??",
              backPoint2: "???-카르-? ?-근 직장?-들???-???-실 공감!",
              backShadowing: "Nggak nyangka baru hari Kamis.",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "Semoga hari ini bisa pulang tepat waktu!",
              pronunciation: "[?-모가 ?-리 ?-니 비사 ?-???-빳 ?-뚜!]",
              meaning: "?-늘??무사??칼퇴?-자!",
              backSubtitle: "직장?-의 간절???-근 기원",
              backMainQuote: "?-늘 ?-루??버텨?-자!<br />목표??무사???-시 ?-근",
              backPoint1: "??pulang tepat waktu: '?-시 ?-근(칼퇴)?-다'",
              backPoint2: "??Semoga: '~?-기-?바-???기원)'",
              backShadowing: "Pulang tepat waktu!",
            },
          ],
        }}
      />

      {/* ?-?- [FirstMotion 목요???-규 롱폼: 12:30 ?-본???-당 ?-전 롤플?-잉] ?-?- */}
      <Composition
        id="PostMotionLongformJA"
        component={PostMotionLongformTemplate}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          categoryTitle: "[?-쿄 맛집 ?-전 ?-본?? ?-자카야·?-당 ?-수 ?-화 50",
          numberBadge: "01 / 50",
          stepTitle: "?-당 착석 & 메뉴 주문",
          primaryText: "?-す?-め??--?-ュ?-は?-り?-す?-？",
          pronunciation: "[?-스?-메??메뉴-?- ?-리마스-?]",
          meaning: "추천 메뉴가 ?-나??",
          meaningColor: "#dc2626",
          rightSubtitle: "?-쿄 ?--? 맛집 꿀??",
          rightMainQuote: "메뉴???-기 ?-들 ??br />무조-????-마?-면 ??",
          rightPoint: "???-す?-め(추천): ?--? ?-당?-서 직원??가???-신 ?-는 ?-그?-처 메뉴-?추천받는 마법???-현!",
          nextPreviewText: "?-ビ?-ル?-と?-お願い?-ま??(?-맥-??-나 부?-드?-요)",
          round1EndFrame: 255,
          round2EndFrame: 405,
          round3EndFrame: 595,
        }}
      />

      {/* ?-?- [FirstMotion 목요???-규 롱폼: 18:30 ?-어 ?-근-??-상 50] ?-?- */}
      <Composition
        id="PostMotionLongformEN"
        component={PostMotionLongformTemplate}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          categoryTitle: "[?-근-?리스?? ?-어-??-상 ?-화 ?-수 50??",
          numberBadge: "01 / 50",
          stepTitle: "?-근 & ?-상 ?-사",
          primaryText: "It's been a long day, I'm heading home.",
          pronunciation: "[?-츠 -???-??-이, ?-임 ?-딩 ??",
          meaning: "?-늘 -?-??-루?-?-요, ???-제 ?-근?-니??",
          meaningColor: "#dc2626",
          rightSubtitle: "?-근-??-실 구어-?",
          rightMainQuote: "?-늘 ?-루???-고?-어!<br />?-근-??-리베이???-사",
          rightPoint: "??head home: ?-순??집에 가??go home)보다 '?-근 발걸?-을 ??--?????-연?-러??직장???-현",
          nextPreviewText: "Let's grab a drink sometime soon! (조만-??-잔?-자!)",
          round1EndFrame: 255,
          round2EndFrame: 405,
          round3EndFrame: 595,
        }}
      />

      {/* ?-?- [FirstMotion 목요???-규 롱폼: 19:30 ?-페?-어 ?-면 100] ?-?- */}
      <Composition
        id="PostMotionLongformES"
        component={PostMotionLongformTemplate}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          categoryTitle: "[?-면???-는 ?-페?-어] 침-??-서 귀가 ?-리??기초 100",
          numberBadge: "01 / 100",
          stepTitle: "-??-사 & ?-식 ?-화",
          primaryText: "Buenas noches, que descanses bien.",
          pronunciation: "[부?-나???-체?? -??-스깐세??비엔]",
          meaning: "좋-? -??-세?? ?-안?????-세??",
          meaningColor: "#ea580c",
          rightSubtitle: "?-면 ???-링 ?-페?-어",
          rightMainQuote: "?-늘 밤도 ?-안??꿈꾸?-요<br />?-콤???-식???-사",
          rightPoint: "??descansar: ?-로-??--??-다. ?-페?-어권에???-자리에 ????건네??가???-정???-사",
          nextPreviewText: "Hasta mañana, que duermas bien. (?-일 봐요, ???-요.)",
          round1EndFrame: 255,
          round2EndFrame: 405,
          round3EndFrame: 595,
        }}
      />

      {/* ?-?- [FirstMotion 목요???-규 롱폼: 20:30 중국???-행 50] ?-?- */}
      <Composition
        id="PostMotionLongformZH"
        component={PostMotionLongformTemplate}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          categoryTitle: "[중국 ?-행·출장 ?-존] ?--??-서 바로 ?-먹???-수 50",
          numberBadge: "01 / 50",
          stepTitle: "?-핑 & 가-??-정",
          primaryText: "这个多少?-？??--便宜一?-吗-?",
          pronunciation: "[쩌거 ?-어?-오 치엔? 커이 ?-엔???-디??-?]",
          meaning: "?-거 ?-마?-요? 좀 깎아주실 ???-나??",
          meaningColor: "#dc2626",
          rightSubtitle: "?-시?-·쇼???-수 구어-?",
          rightMainQuote: "중국 ?-행 ?-수 ?-킬!<br />?-정-?가-?묻기 ?-스??",
          rightPoint: "??便宜一??piányi yīdi?n): '조금 ?-게'?-는 ?-현?-로 ?-행?-들???-존 ?-수 문장!",
          nextPreviewText: "?-要这个，-?-?--?-包??(?-걸-??-게?? ?-장??주세??)",
          round1EndFrame: 255,
          round2EndFrame: 405,
          round3EndFrame: 595,
        }}
      />

      {/* ?-?- [FirstMotion 코리?-루??롱폼: 22-?3?-차 ?-벽 ?-기??(16:9 ?-?-드)] ?-?- */}
      <Composition
        id="PostMotionLongformKR"
        component={PostMotionLongformTemplate}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          categoryTitle: "30 Survival Korean Phrases for Traveling in Korea",
          numberBadge: "01 / 30",
          stepTitle: "?-당 ?-존 ?-화 (Restaurant Survival)",
          primaryText: "?-기?? 주문?-게??",
          pronunciation: "[ Yeo-gi-yo! Ju-mun-hal-ge-yo ]",
          meaning: "Excuse me! We'd like to order, please.",
          meaningColor: "#2563eb",
          rightSubtitle: "Korea Travel Real Tip",
          rightMainQuote: "Say '?-기??' proudly<br />to call servers politely!",
          rightPoint: "???-기?? 'Here, please!' - completely polite etiquette.\n??주문?-게?? Lets the staff know you're ready to order.",
          nextPreviewText: "-?좀 ??주실 ???-나?? (Could we get some more water?)",
          footerTitle: "KOREANLOOP ??CLICK ANY LOOK, MASTER ANY KOREAN",
          round1EndFrame: 255,
          round2EndFrame: 405,
          round3EndFrame: 595,
        }}
      />

      {/* ?-?- [StayHelper 글로벌 ??---??-테??1??FirstMotion???-네마틱 릴스 (810?-레?? 27-??-독??] ?-?- */}
      <Composition
        id="PostMotionStayHelper"
        component={PostMotionStayHelper}
        durationInFrames={810}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ?-?- [StayHelper 글로벌 ??---??-테??2?? Amangiri Canyon Pavilion (1080x1920, 28-?6-Act ?-독??] ?-?- */}
      <Composition
        id="PostMotionStayHelperBulgari"
        component={PostMotionStayHelperBulgari}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="PostMotionStayHelperAmangiri"
        component={PostMotionStayHelperAmangiri}
        durationInFrames={840}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ?-?- [?-스?-모??PostMotion??5?- 코어 ?-이?-라?? ?-?- */}
      {/* 1. ?-국???-튜-??-츠 (KoreanLoop 3D ?-립 카드) */}
      <Composition
        id="PostMotionLanguageCard"
        component={PostMotionLanguageCard}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 2. 글로벌 로컬 비즈?-스 릴스 (미국/?-외 ?-어 3D VIP 카드) */}
      <Composition
        id="PostMotionGlobalSMB"
        component={PostMotionGlobalSMB}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 3. 글로벌 D2C ?-커머스 3D ?-품 ?--??-스 (?-피?-이 3D -?릴스) */}
      <Composition
        id="PostMotionProduct3D"
        component={PostMotionProduct3D}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 4. 걸그-??-수 비주??3D ?-비?-트 ?-보 릴스 (무자막·순??비주?? */}
      <Composition
        id="PostMotionVisualVibe"
        component={PostMotionVisualVibe}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 5. (-??-천?-스??본사 ?-크 IR 3D ???-어-?배너 */}
      <Composition
        id="PostMotionWebHero"
        component={PostMotionWebHero}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 0. 걸그-??-수 비주??릴스 (Remotion ?-진, 1080x1920, 21-? */}
      <Composition
        id="GirlGroupPureVisual"
        component={GirlGroupPureVisual}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 1. ?-로???-스?- 릴스 (1080x1920, 21-? */}
      <Composition
        id="ReelsVideo"
        component={ReelsComp}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 2. ?-일 ?-품 광고 ??(1280x720, 6-?= 180?-레?? */}
      <Composition
        id="ProductAd"
        component={ProductAdScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 3. ?-번 -??-품 ?-인???--??-스 (1280x720, 8-?= 240?-레?? */}
      <Composition
        id="ProductLineup"
        component={ProductLineupScene}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 4. ?-품 ?-징 콜아??광고 (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="ProductFeature"
        component={ProductFeatureScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 5. 비트/?-운???-츠 ?-품 광고 (1080x1920 ?-로?? 6.67-?= 200?-레?? */}
      <Composition
        id="ShortsAd"
        component={ShortsAdScene}
        durationInFrames={200}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 6. ?--? ?-인 & 가격표 진자 ?-동 광고 (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="ProductDiscount"
        component={ProductDiscountScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 7. 캐릭??추천 ?-개 광고 (1280x720, 7-?= 210?-레?? */}
      <Composition
        id="ProductCharacter"
        component={ProductCharacterScene}
        durationInFrames={210}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 8. 3D ?-형 받침?- & ?-포?-라?-트 ?-인???--??-스 (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="ProductShowcase"
        component={ProductShowcaseScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 9. 캐릭???-성 ?-하 & ?-?-핑 말풍??(1280x720, 6-?= 180?-레?? */}
      <Composition
        id="CharacterTyping"
        component={CharacterTypingScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 10. 캐릭???-아 ?-는 ?--?모션 & 감정 ?-시 (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="CharacterIdle"
        component={CharacterIdleScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 11. ?-물??곡선 ?-프 & squash & stretch 물리 (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="CharacterJump"
        component={CharacterJumpScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 12. ?-층 ?-럴?-스 ?-크-??-경 & ?-네마틱 -?(1280x720, 6-?= 180?-레?? */}
      <Composition
        id="ParallaxScene"
        component={ParallaxSceneComp}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 13. 캐릭??3D ?-로??/ 강의 카드 & ?-이???-윕 (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="CharacterCard"
        component={CharacterCardScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 14. 캐릭???-트?-크 군단 ?-결 & ?-이???-름 (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="CharacterNetwork"
        component={CharacterNetworkScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 15. ?--?지 ?-티-?& ?-수?-과 (outline, dropShadow, glow) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="StickerEffects"
        component={StickerEffectsScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 16. Easing 5-?곡선 -?Spring 물리 ?-라미터 비교 (1280x720, 5-?= 150?-레?? */}
      <Composition
        id="EasingSpringCompare"
        component={EasingSpringCompareScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 17. Series, Loop, Freeze, Sequence ?-간 ?-어 4?- 컴포?-트 ?-습 (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="SeriesLoopCompare"
        component={SeriesLoopCompareScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 18. OffthreadVideo, Img, Audio 미디??3-?-?interpolateColors (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="MediaComponents"
        component={MediaComponentsScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 19. ?-면 ?-환 ?-랜지??8-?(TransitionSeries, WebGL/CSS Transitions) (1280x720, 10.5-?= 315?-레?? */}
      <Composition
        id="TransitionShowcase"
        component={TransitionShowcaseScene}
        durationInFrames={315}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 20. -?번짐(?-이??-? 2가지 기법 비교 (LightLeak vs effects/lightLeak) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="LightLeakCompare"
        component={LightLeakCompareScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 21. 방사??광선 배경(?--?버스?? 2가지 구현 방식 비교 (Starburst vs effects/starburst) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="StarburstCompare"
        component={StarburstCompareScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 22. WebGL ?-이???-펙??6-?갤러-?(glow, vignette, chromaticAberration ?? (1280x720, 5-?= 150?-레?? */}
      <Composition
        id="ShaderEffectsGallery"
        component={ShaderEffectsGalleryScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 23. ?-전 비디???-펙???-시??3가지 (?-름-? 부-?블러 가리기, ?-포?-라?-트) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="VideoEffectsRecipes"
        component={VideoEffectsRecipesScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 24. 모션 블러 비교 (?-과 ?-음 vs Trail ?-상 vs CameraMotionBlur ?-터 블러) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="MotionBlurCompare"
        component={MotionBlurCompareScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 25. @remotion/noise ?-이-??-각??(?-떨-?카메??2D, 꿀?-이??블롭 3D, ?-름??3D) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="NoiseShowcase"
        component={NoiseShowcaseScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 26. @remotion/paths ?-스 ?-니메이??(???-로??evolvePath, 별↔??모핑 interpolatePath, 경로 추적 ?-리-?getPointAtLength) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="PathsShowcase"
        component={PathsShowcaseScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 27. @remotion/shapes 8-??-형 갤러-?(Rect, Circle, Triangle, Star, Pie -? Heart, Arrow, Callout) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="ShapesShowcase"
        component={ShapesShowcaseScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 28. @remotion/svg-3d-engine ?-수 SVG 3D ?-출 & ?-전 ?--??-스 (AI ?-스??3D ?-출 extrudeAndTransformElement) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="Svg3DShowcase"
        component={Svg3DShowcaseScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 29. @remotion/animation-utils ?-니메이???-틸 ?--??-스 (?-중 ?-성 ?--???보간 interpolateStyles & makeTransform) (1280x720, 5-?= 150?-레?? */}
      <Composition
        id="AnimationUtilsShowcase"
        component={AnimationUtilsShowcaseScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 30. @remotion/rough-notation ?-그-?주석 ?--??-스 (Highlight, Underline, Circle, Box, StrikeThrough, Bracket) (1280x720, 8-?= 240?-레?? */}
      <Composition
        id="RoughNotationShowcase"
        component={RoughNotationShowcaseScene}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 31. @remotion/rounded-text-box 가변 ?-근 ?-막 박스 (measureText-??-스??측정 & createRoundedTextBox-??-어-??-적 박스 ?-장) (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="RoundedTextBoxShowcase"
        component={RoundedTextBoxShowcaseScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 32. @remotion/captions ?-톡 ?--????-어-??-크 ?-막 (createTikTokStyleCaptions ?-어 ?-이?-이??& ?-업) (?-로??1080x1920, 6-?= 180?-레?? */}
      <Composition
        id="TikTokCaptionsShowcase"
        component={TikTokCaptionsShowcaseScene}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 33. @remotion/layout-utils ?-스???-이?-웃 ?-틸 (measureText ?-스??측정, fitText ?-동 ?-트 ?-기 맞춤, fitTextOnNLines N-??-한 ?-동 줄바-? (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="LayoutUtilsShowcase"
        component={LayoutUtilsShowcaseScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 34. @remotion/google-fonts ?--? ?-폰??6-??-브??최적??갤러-?*/}
      {/* <Composition
        id="GoogleFontsShowcase"
        component={GoogleFontsShowcaseScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      /> */}

      {/* 35. @remotion/fonts CDN ?-폰???-중 ?-이??로더 */}
      {/* <Composition
        id="FontsShowcase"
        component={FontsShowcaseScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      /> */}

      {/* 36. @remotion/animated-emoji ?-직이??구-? Noto ?-모지 8-?갤러-?(AnimatedEmoji CDN 로더 & ?-프-??-업) (1280x720, 5-?= 150?-레?? */}
      <Composition
        id="AnimatedEmojiShowcase"
        component={AnimatedEmojiShowcaseScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 37. @remotion/mac-cursors & @remotion/sfx macOS 마우??커서 -??-릭 ?-과???-토리얼 (MacOSCursor default/pointer ?-환 & mouseClick SFX) (1280x720, 5-?= 150?-레?? */}
      <Composition
        id="MacCursorShowcase"
        component={MacCursorShowcaseScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 38. @remotion/gsap 그린??GSAP) ?-?-라??& ?-태-??-니메이??(useGsapTimeline 글???-전 ?-장 & 카드 ?-계 ?-업) (1280x720, 5-?= 150?-레?? */}
      <Composition
        id="GsapShowcase"
        component={GsapShowcaseScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 39. @remotion/lottie 로티(Lottie) 벡터 ?-니메이??(Trim Paths 체크마크 & loop / playbackRate ?-어) (1280x720, 5-?= 150?-레?? */}
      <Composition
        id="LottieShowcase"
        component={LottieShowcaseScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 40. @remotion/gif GIF ?-니메이???-레???-기??& 3-?맞춤 모드 (Gif contain, cover, fill) (1280x720, 5-?= 150?-레?? */}
      <Composition
        id="GifShowcase"
        component={GifShowcaseScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 41. @remotion/media-utils ?-디???-펙?-럼 ?-각??(useWindowedAudioData 주파??분석 & visualizeAudio ?-시-?반응??막-?) (1280x720, 8-?= 240?-레?? */}
      <Composition
        id="AudioVisualizerShowcase"
        component={AudioVisualizerShowcaseScene}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 42. @remotion/sfx 공식 ?-과??6-??-리-?(whoosh, ding, mouseClick, pageTurn, vineBoom, uiSwitch) (1280x720, 8-?= 240?-레?? */}
      <Composition
        id="SfxShowcase"
        component={SfxShowcaseScene}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 43. @remotion/media 비디???-리-?-??-디??볼륨 ?-어 ?--??-스 (trimBefore/trimAfter, playbackRate, ?-수??volume ?-이?? (1280x720, 6-?= 180?-레?? */}
      <Composition
        id="MediaControlsShowcase"
        component={MediaControlsShowcaseScene}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 44. @remotion/three 3D WebGL 캔버??& 카메??공전 ?--??-스 (ThreeCanvas, React Three Fiber, OrbitCamera 360??공전) (1280x720, 5-?= 150?-레?? */}
      <Composition
        id="ThreeCanvasShowcase"
        component={ThreeCanvasShowcaseScene}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />

      {/* ?-?- [FirstMotion 금요??출근-?3-in-1 ?-츠: ?-어] ?-?- */}
      <Composition
        id="PostMotionFriday3in1EN"
        component={PostMotion3in1Template}
        durationInFrames={1010}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-어]",
          badgeColor: "#ef4444",
          badgeBg: "#fef2f2",
          title: "금요??출근-??-실 공감 ?-어 3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 198, flipEndFrame: 222, endFrame: 404 },
            { startFrame: 404, flipStartFrame: 516, flipEndFrame: 540, endFrame: 682 },
            { startFrame: 682, flipStartFrame: 825, flipEndFrame: 849, endFrame: 1010 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "TGIF! Finally Friday, I can't wait for the weekend!",
              pronunciation: "[?--??-이?-프! ?-이?-리 ?-라?-데?? ?-이 캔트 ?-이???????-켄??]",
              meaning: "?-디??금요?? 주말-??-꼽??기다?-어!",
              backSubtitle: "직장???-실 금요??공감",
              backMainQuote: "출근-?발걸?-이 가벼운 ?-유?<br />?-디??기다리던 금요??",
              backPoint1: "??TGIF: 'Thank God It's Friday' (금요?-이???-이?-여 감사?-니??",
              backPoint2: "??can't wait for: '~-??-꼽??기다리다, ?-무 기-??-다'",
              backShadowing: "TGIF! Finally Friday!",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "Just need to power through today!",
              pronunciation: "[?-?-트 ?-드 ???-워 ?-루 ?-데??]",
              meaning: "?-늘 ?-루-?-?버티-??-난??",
              backSubtitle: "직장???-이???-앙??",
              backMainQuote: "조금-????-내??<br />?-늘-?지?-면 ?-유??주말",
              backPoint1: "??power through: '?-렵-??-든 ?-을 ?-심 ?-게 버텨?-다'",
              backPoint2: "??금요???-전??버티?????-계 직장?-들??마법 주문!",
              backShadowing: "Just power through today!",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "No overtime today, leaving right on the dot!",
              pronunciation: "[???-버?-???-데?? 리빙 ?-잇 ??????]",
              meaning: "?-늘?- ?-근 ?--? ?-절, 무조-??-시 칼퇴!",
              backSubtitle: "불금 칼퇴 ?-수 ?-언",
              backMainQuote: "6???-각???-도 ???-아본다!<br />금요?--? 무조-??-시 ?-근",
              backPoint1: "??on the dot: '?-각????맞춰??칼같??'",
              backPoint2: "??leave on the dot: 망설???-는 초고???-시 ?-근 ?-현!",
              backShadowing: "Leaving right on the dot!",
            },
          ],
        }}
      />

      {/* ?-?- [FirstMotion 금요??출근-?3-in-1 ?-츠: ?-본?? ?-?- */}
      <Composition
        id="PostMotionFriday3in1JA"
        component={PostMotion3in1Template}
        durationInFrames={996}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-본??",
          badgeColor: "#ef4444",
          badgeBg: "#fef2f2",
          title: "금요??출근-??-실 공감 ?-본??3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 183, flipEndFrame: 207, endFrame: 397 },
            { startFrame: 397, flipStartFrame: 517, flipEndFrame: 541, endFrame: 674 },
            { startFrame: 674, flipStartFrame: 828, flipEndFrame: 852, endFrame: 996 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "?-っ?-金?-日！今?-も?-疲?-様?-し?--?",
              pronunciation: "[?-토 ?-요--? 콘슈--??-츠카레?-마?-시?-]",
              meaning: "?-디??금요?? ?-번 주도 ?-말 ?-고 많았?-요.",
              backSubtitle: "?--? 직장??금요???-사",
              backMainQuote: "체감??????같았???-번 -?<br />?-디??금요???-침 ?-래!",
              backPoint1: "???-っ?? '마침?? ?-디???-는 ?-도-??-치??부??",
              backPoint2: "???-본 직장?-들??금요??출근길에 ?-로-?격려?-는 ?-???-현!",
              backShadowing: "?-っ?-金?-日！お?-れ様で?-た??",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "今日一?-だ?-乗?-切?-う-?",
              pronunciation: "[-? ?-치?-치?--? ?-리?-로-!]",
              meaning: "?-늘 ???-루-???버텨?-자!",
              backSubtitle: "불금 ?-파 ?-이???-앙??",
              backMainQuote: "?--? ?-너지-?모두 쥐어짜서<br />?-늘 ?-루-?무사???-기-?",
              backPoint1: "??乗り?-る(?-리?-루): '고비???-든 ?-황???-겨?-고 ?-기??",
              backPoint2: "??~?-う: ?--?-??--???-?--/?--????-현",
              backShadowing: "今日一?-だ?-乗?-切?-う-?",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "今日??--対に残-??-し?-定?-退社！",
              pronunciation: "[-??- ????-니 ?-교-?-시????지?-?-샤!]",
              meaning: "?-늘?- 무조-??-업 ?-이 ?-시 ?-근!",
              backSubtitle: "불금 칼퇴 ?-수 ?-현",
              backMainQuote: "금요??-??-근?- ?-납 불-?!<br />빛의 ?-도-??-근-?직행",
              backPoint1: "??定時?--???지?-?-샤): '?-시 ?-근(칼퇴)'",
              backPoint2: "??残-??-し(?-교-?-시): '?-근/초과근무 ?-음'",
              backShadowing: "今日??--対定?-退社！",
            },
          ],
        }}
      />

      {/* ?-?- [FirstMotion 금요??출근-?3-in-1 ?-츠: ?-페?-어] ?-?- */}
      <Composition
        id="PostMotionFriday3in1ES"
        component={PostMotion3in1Template}
        durationInFrames={950}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-페?-어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "금요??출근-??-실 공감 ?-페?-어 3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 172, flipEndFrame: 196, endFrame: 381 },
            { startFrame: 381, flipStartFrame: 489, flipEndFrame: 513, endFrame: 653 },
            { startFrame: 653, flipStartFrame: 773, flipEndFrame: 797, endFrame: 950 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "¡Por fin es viernes! ¡Llegó el fin de semana!",
              pronunciation: "[뽀-??- ?-스 비에르네?? ?-고 ???- ???-마??]",
              meaning: "?-디??금요?-이?? 마침??주말???-어!",
              backSubtitle: "?-페???--? 불금 ?-호",
              backMainQuote: "?-화?-목??버텨???-리?-게<br />?-물처럼 찾아??금요??",
              backPoint1: "??¡Por fin!: '?-디??, 마침??'",
              backPoint2: "??fin de semana: '주말 (Finde)'",
              backShadowing: "¡Por fin es viernes!",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "¡Un último esfuerzo hoy!",
              pronunciation: "[???-띠-??-스?-에르소 ?-이!]",
              meaning: "?-늘 마-?막으-???????번만 ?-자!",
              backSubtitle: "금요???-너지 충전 ?-현",
              backMainQuote: "방전??체력??그러모아<br />?-늘 ?-루 멋-?-?버티-?",
              backPoint1: "??último esfuerzo: '마-?-??-력, 마-?-?분발'",
              backPoint2: "???-페???-료?-끼-?금요???-침 ?-을 북돋?-주??-?",
              backShadowing: "¡Un último esfuerzo hoy!",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "¡Hoy salgo volando del trabajo!",
              pronunciation: "[?-이 ?-고 볼-??????-라바호!]",
              meaning: "?-늘?- ?-근?-자마자 바람처럼 ?-아-?거야!",
              backSubtitle: "빛의 ?-도 칼퇴 ?-현",
              backMainQuote: "?-근 -??-리?-마???-속?-으-?<br />금요??-??-속 ?-소-?출격",
              backPoint1: "??salir volando: '?-아가??--(?-살같이) ?--????-근?-다'",
              backPoint2: "???--??-들??칼퇴?????-는 매우 ?-생??구어-?",
              backShadowing: "¡Salgo volando del trabajo!",
            },
          ],
        }}
      />

      {/* ?-?- [FirstMotion 금요??출근-?3-in-1 ?-츠: 중국?? ?-?- */}
      <Composition
        id="PostMotionFriday3in1ZH"
        component={PostMotion3in1Template}
        durationInFrames={893}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 중국??",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "금요??출근-??-실 공감 중국??3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 142, flipEndFrame: 166, endFrame: 357 },
            { startFrame: 357, flipStartFrame: 455, flipEndFrame: 479, endFrame: 616 },
            { startFrame: 616, flipStartFrame: 721, flipEndFrame: 745, endFrame: 893 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "终于?-五了！?-末终于要来了！",
              pronunciation: "[쭝위 ?-?-우?? ?-?-모 쭝위 ?-오 ?-이??]",
              meaning: "?-디??금요?-이?? 마침??주말???-고 ?-어!",
              backSubtitle: "?--? 직장??금요???-호",
              backMainQuote: "?-겨??4?-을 버텨?-고<br />마침???-착???-금??금요??",
              backPoint1: "??终于(zhōngyú): '?-디?? 마침??",
              backPoint2: "???-五(zhōuw?): 금요??/ ?-末(zhōumò): 주말",
              backShadowing: "终于?-五了！",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "今天?-坚?--?下！",
              pronunciation: "[진티??짜이 지?-츠 ?-샤!]",
              meaning: "?-늘 ?-루-?조금-???버텨보자!",
              backSubtitle: "불금 버티-??-이???-앙??",
              backMainQuote: "?-근 ?-계가 ?--??-다!<br />조금-???집중?-고 버티-?",
              backPoint1: "???-持(jiānchí): '?-기?--? ?-고 ?-까지 버티??견디??",
              backPoint2: "??一-?yíxià): '?-깐, 조금-?",
              backShadowing: "今天?-坚?--?下！",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "今天绝-??-时下班-?",
              pronunciation: "[진티??쥐에?-이 준???-아-?]",
              meaning: "?-늘?- 무조-??-시??칼퇴근한??",
              backSubtitle: "금요??칼퇴 ?-수 ?-현",
              backMainQuote: "?-근?- ?--? 거절!<br />?-근 ?-간 ?-각??바로 ?-웃",
              backPoint1: "???-时下班(zh?nshí xiàbān): '?-시 ?-근(칼퇴)'",
              backPoint2: "??绝-?(juéduì): '무조-? ?--??-으-?",
              backShadowing: "今天绝-??-时下班-?",
            },
          ],
        }}
      />

      {/* ?-?- [FirstMotion 금요??출근-?3-in-1 ?-츠: ?-도?-시?-어] ?-?- */}
      <Composition
        id="PostMotionFriday3in1ID"
        component={PostMotion3in1Template}
        durationInFrames={1057}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[출근-?1-??-수 ?-도?-시?-어]",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "금요??출근-??-실 공감 ?-니??3문장",
          cardTimings: [
            { startFrame: 0, flipStartFrame: 188, flipEndFrame: 212, endFrame: 391 },
            { startFrame: 391, flipStartFrame: 524, flipEndFrame: 548, endFrame: 682 },
            { startFrame: 682, flipStartFrame: 853, flipEndFrame: 877, endFrame: 1057 },
          ],
          cards: [
            {
              indexBadge: "1 / 3",
              primaryText: "Akhirnya hari Jumat! Nggak sabar mau weekend!",
              pronunciation: "[?-키르냐 ?-리 주맛! ?-각 ?-바-?마우 ?-켄??]",
              meaning: "?-디??금요?? 주말???-무?-무 기다?-져!",
              backSubtitle: "?-카르-? 직장??금요??공감",
              backMainQuote: "기다리고 기다리던 금요??<br />주말 카운?-다???-작!",
              backPoint1: "??Akhirnya: '?-디?? 마침??",
              backPoint2: "??Nggak sabar: '참을 ???-을 ?-도-?기-??-다/?-꼽??기다리다'",
              backShadowing: "Akhirnya hari Jumat!",
            },
            {
              indexBadge: "2 / 3",
              primaryText: "Semangat untuk hari ini saja!",
              pronunciation: "[?-망???-툭 ?-리 ?-니 ?-자!]",
              meaning: "?-늘 ???-루-??-내??버텨보자!",
              backSubtitle: "불금 버티-??-이???-앙??",
              backMainQuote: "지-?몸을 ?-끌-?출근?--?-?br />?-늘 ?-루-??-내-??-식!",
              backPoint1: "??Semangat: '?-이?? ?-내??' (?-도?-시??최고 ?-원 구호)",
              backPoint2: "??hari ini saja: '?-늘 ?-루-?",
              backShadowing: "Semangat hari ini saja!",
            },
            {
              indexBadge: "3 / 3",
              primaryText: "Hari ini pulang tepat waktu, nggak mau lembur!",
              pronunciation: "[?-리 ?-니 ?-???-빳 ?-투, ?-각 마우 름-?-?]",
              meaning: "?-늘?- 무조-??-시 칼퇴, ?-근?- ?--? ?-절!",
              backSubtitle: "금요??칼퇴 ?-언",
              backMainQuote: "금요???-근?- ?--? 불-?!<br />?-근 ?-간 ?-각???-근길로",
              backPoint1: "??pulang tepat waktu: '?-시 ?-근(칼퇴)?-다'",
              backPoint2: "??lembur: '?-근, 초과근무'",
              backShadowing: "Pulang tepat waktu today!",
            },
          ],
        }}
      />

    
      {/* ?-?- [FirstMotion 금요???-근-?3-in-1 ?-츠: [?-근-?1-??-수 ?-어]] ?-?- */}
      <Composition
        id="PostMotionFridayEve3in1EN"
        component={PostMotion3in1Template}
        durationInFrames={691}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[?-근-?1-??-수 ?-어]",
          badgeColor: "#ef4444",
          badgeBg: "#fef2f2",
          title: "금요???-근-??-실 공감 ?-어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 101, 'flipEndFrame': 101, 'endFrame': 228}, {'startFrame': 228, 'flipStartFrame': 330, 'flipEndFrame': 330, 'endFrame': 480}, {'startFrame': 480, 'flipStartFrame': 565, 'flipEndFrame': 565, 'endFrame': 686}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': "I'm clocking out, see you all on Monday!", 'pronunciation': '[?-임 ?-라???-웃, ????????먼데??]', 'meaning': '?- ?-근?-니?? 모두 ?-요?-에 봬요!', 'backSubtitle': '깔끔??금요??칼퇴 ?-사', 'backMainQuote': '주말 모드 ON!<br />주말???-무 ?-락 ?-절', 'audio_lang': "I'm clocking out, see you all on Monday!", 'audio_ko': '?- ?-근?-니?? 모두 ?-요?-에 봬요!'}, {'indexBadge': '2 / 3', 'primaryText': 'Drinks after work? Count me in!', 'pronunciation': '[?-링?-스 ?-프???-크? 카운??-???]', 'meaning': '?-근 ???-잔? ?-도 무조-??-게!', 'backSubtitle': '불금 ?-속 쿨한 ?-락', 'backMainQuote': '?-원??맥주 ?-잔!<br />?-도 무조-?참여?-게!', 'audio_lang': 'Drinks after work? Count me in!', 'audio_ko': '?-근 ???-잔? ?-도 무조-??-게!'}, {'indexBadge': '3 / 3', 'primaryText': 'Time to turn off work mode and relax!', 'pronunciation': '[?-???????-프 ?-크 모드 ??릴랙??]', 'meaning': '??모드 ?-고 ?-전?????-간!', 'backSubtitle': '진정???-유??주말 ?-작', 'backMainQuote': '?-번 주도 ?-고 많았??<br />?-전???-만???-한 ?-식', 'audio_lang': 'Time to turn off work mode and relax!', 'audio_ko': '??모드 ?-고 ?-전?????-간!'}],
        }}
      />

      {/* ?-?- [FirstMotion 금요???-근-?3-in-1 ?-츠: [?-근-?1-??-수 ?-본??] ?-?- */}
      <Composition
        id="PostMotionFridayEve3in1JA"
        component={PostMotion3in1Template}
        durationInFrames={815}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[?-근-?1-??-수 ?-본??",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "금요???-근-??-실 공감 ?-본??3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 136, 'flipEndFrame': 136, 'endFrame': 299}, {'startFrame': 299, 'flipStartFrame': 397, 'flipEndFrame': 397, 'endFrame': 517}, {'startFrame': 517, 'flipStartFrame': 653, 'flipEndFrame': 653, 'endFrame': 810}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '?-先?-失礼し?-す！良?-週末?-！', 'pronunciation': '[?-사?-니 ?-츠?-이?-마?? ?-이 ??마츠??]', 'meaning': '먼-? ?-근?-겠?-니?? 좋-? 주말 보내?-요!', 'backSubtitle': '?-본 직장???--? 금요???-근 ?-사', 'backMainQuote': '금요??칼퇴???-석 ?-사!<br />?-들 좋-? 주말 보내?-요!', 'audio_lang': '?-先?-失礼し?-す！良?-週末?-！', 'audio_ko': '먼-? ?-근?-겠?-니?? 좋-? 주말 보내?-요!'}, {'indexBadge': '2 / 3', 'primaryText': '??--?-し?--???--?-に行こ?-！', 'pronunciation': '[?-나?-다?? ?-파???--????-코-!]', 'meaning': '불금?-데 가볍게 ?-잔?-러 가??', 'backSubtitle': '불금(??--) ?-자카야 ?-안', 'backMainQuote': '??주의 ?-로-??-리???-원???-잔!<br />불금 ?--?-?즐기-?', 'audio_lang': '??--?-し?--???--?-に行こ?-！', 'audio_ko': '불금?-데 가볍게 ?-잔?-러 가??'}, {'indexBadge': '3 / 3', 'primaryText': '?-っ?-今?-終?-っ?-！解放?--?高！', 'pronunciation': '[?-토 콘슈- ?-왓?-! 카이??-??-이-?!]', 'meaning': '?-디???-번 -??-났?? ?-방-?최고!', 'backSubtitle': '?-근-?발걸??가벼운 ?-마??', 'backMainQuote': '?-번 주도 ?-말 ?-고 많았?-요!<br />?-유??주말 ?-작', 'audio_lang': '?-っ?-今?-終?-っ?-！解放?--?高！', 'audio_ko': '?-디???-번 -??-났?? ?-방-?최고!'}],
        }}
      />

      {/* ?-?- [FirstMotion 금요???-근-?3-in-1 ?-츠: [?-근-?1-??-수 ?-페?-어]] ?-?- */}
      <Composition
        id="PostMotionFridayEve3in1ES"
        component={PostMotion3in1Template}
        durationInFrames={718}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[?-근-?1-??-수 ?-페?-어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "금요???-근-??-실 공감 ?-페?-어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 143, 'flipEndFrame': 143, 'endFrame': 303}, {'startFrame': 303, 'flipStartFrame': 382, 'flipEndFrame': 382, 'endFrame': 491}, {'startFrame': 491, 'flipStartFrame': 593, 'flipEndFrame': 593, 'endFrame': 713}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '¡Por fin terminé! ¡Buen fin de semana!', 'pronunciation': '[?-르 ?- ?-르미네! 부???- ???-마??]', 'meaning': '?-디?????-났?? ?-들 좋-? 주말 보내!', 'backSubtitle': '?-페?-어-??--? ?-근 ?-사', 'backMainQuote': '?-무 종료 ?-언!<br />즐거??주말 보내?-요!', 'audio_lang': '¡Por fin terminé! ¡Buen fin de semana a todos!', 'audio_ko': '?-디?????-났?? ?-들 좋-? 주말 보내!'}, {'indexBadge': '2 / 3', 'primaryText': '¿Salimos de fiesta esta noche?', 'pronunciation': '[?-리모스 ???-에?--? ?-스?- ?-체?]', 'meaning': '?-늘 -?불금 즐기??갈까?', 'backSubtitle': '?-페?-식 불금 ?-티 ?-안', 'backMainQuote': '?-?-스?- ?-???-잔!<br />금요??-?분위-?만끽?-기', 'audio_lang': '¿Salimos de fiesta esta noche?', 'audio_ko': '?-늘 -?불금 즐기??갈까?'}, {'indexBadge': '3 / 3', 'primaryText': 'Apago la computadora y me desconecto.', 'pronunciation': '[?-파-???콤푸?-?-라 ??-??-스코넥??]', 'meaning': '컴퓨???-고 ???-각 ?-전 ?-래.', 'backSubtitle': '?-벽???-프(Off) ?-언', 'backMainQuote': '?-요?-까지 ???-각 ?-로!<br />?-전???--? ?-한 ?-식', 'audio_lang': 'Apago la computadora y me desconecto por completo.', 'audio_ko': '컴퓨???-고 ???-각 ?-전 ?-래.'}],
        }}
      />

      {/* ?-?- [FirstMotion 금요???-근-?3-in-1 ?-츠: [?-근-?1-??-수 중국??] ?-?- */}
      <Composition
        id="PostMotionFridayEve3in1ZH"
        component={PostMotion3in1Template}
        durationInFrames={637}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[?-근-?1-??-수 중국??",
          badgeColor: "#e11d48",
          badgeBg: "#fff1f2",
          title: "금요???-근-??-실 공감 중국??3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 97, 'flipEndFrame': 97, 'endFrame': 249}, {'startFrame': 249, 'flipStartFrame': 320, 'flipEndFrame': 320, 'endFrame': 432}, {'startFrame': 432, 'flipStartFrame': 517, 'flipEndFrame': 517, 'endFrame': 632}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '?-先下班了，大-??-末?-快-?', 'pronunciation': '[???-엔 ?-아-??? ?--????-?-모 ?-콰??]', 'meaning': '?- 먼-? ?-근?-니?? ?-들 즐거??주말 보내?-요!', 'backSubtitle': '직장???-시 ?-근 ?--? ?-사', 'backMainQuote': '?-돌?-보지 ?-고 빠른 ?-근!<br />?-들 즐거??주말 보내?-요!', 'audio_lang': '?-先下班了，大-??-末?-快-?', 'audio_ko': '?- 먼-? ?-근?-니?? ?-들 즐거??주말 보내?-요!'}, {'indexBadge': '2 / 3', 'primaryText': '今晚?-吃?-锅?--???---?', 'pronunciation': '[진완 -?-??-궈 ???-베??-?]', 'meaning': '?-늘 -??-궈 먹고 ?-잔?-자!', 'backSubtitle': '불금 모임·?-식 ?-안', 'backMainQuote': '?-끈???-궈???-원??맥주 ?-잔!<br />??-??-트?-스 ?-리-?', 'audio_lang': '今晚?-吃?-锅?--???---?', 'audio_ko': '?-늘 -??-궈 먹고 ?-잔?-자!'}, {'indexBadge': '3 / 3', 'primaryText': '?-掉?-脑，-???--?-模式！', 'pronunciation': '[꽌디?-오 ?-엔?-오, 카이-??-?-모 모스!]', 'meaning': '컴퓨???-고, 주말 모드 ?-입!', 'backSubtitle': '?-유로운 주말 모드 ?-언', 'backMainQuote': '?-번 주도 고생???-에-?박수!<br />주말???-전???-링', 'audio_lang': '?-掉?-脑，-???--?-模式！', 'audio_ko': '컴퓨???-고, 주말 모드 ?-입!'}],
        }}
      />

      {/* ?-?- [FirstMotion 금요???-근-?3-in-1 ?-츠: [?-근-?1-??-수 ?-니??] ?-?- */}
      <Composition
        id="PostMotionFridayEve3in1ID"
        component={PostMotion3in1Template}
        durationInFrames={747}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[?-근-?1-??-수 ?-니??",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "금요???-근-??-실 공감 ?-니??3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 136, 'flipEndFrame': 136, 'endFrame': 277}, {'startFrame': 277, 'flipStartFrame': 364, 'flipEndFrame': 364, 'endFrame': 486}, {'startFrame': 486, 'flipStartFrame': 609, 'flipEndFrame': 609, 'endFrame': 742}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Saya pulang duluan ya, selamat berakhir pekan!', 'pronunciation': '[?-야 ?-???-루???? ?-라-?브라?-르 ?-깐!]', 'meaning': '?- 먼-? ?-근?-게?? 즐거??주말 보내?-요!', 'backSubtitle': '?-연?-러???--? 직장???-근 ?-사', 'backMainQuote': '칼퇴?- ?-께 ?-하???-사!<br />즐거??주말 보내?-요!', 'audio_lang': 'Saya pulang duluan ya, selamat berakhir pekan!', 'audio_ko': '?- 먼-? ?-근?-게?? 즐거??주말 보내?-요!'}, {'indexBadge': '2 / 3', 'primaryText': 'Nongkrong santai yuk malam ini!', 'pronunciation': '[?-끄-??--?????말람 ?-니!]', 'meaning': '?-늘 밤에 ?-하-?카페/?-자-?모이??', 'backSubtitle': "?-도?-시???-통 '?-끄-??-다 모임)'", 'backMainQuote': '친구?-과 밤새 ?-누???-야-?<br />불금 ?-링 ?-??', 'audio_lang': 'Nongkrong santai yuk malam ini!', 'audio_ko': '?-늘 밤에 ?-하-?카페??모임 가??'}, {'indexBadge': '3 / 3', 'primaryText': 'Akhirnya selesai kerja, saatnya istirahat!', 'pronunciation': '[?-히르냐 ?-르?-이 ?-르?? ?-앗???-스?-라??]', 'meaning': '?-디???-무 ?? ?-제 ?????-간!', 'backSubtitle': '주말 ?-링 ?-언', 'backMainQuote': '?-번 주도 최선???-했??<br />충분???-고 ?-충?-하-?', 'audio_lang': 'Akhirnya selesai kerja, saatnya istirahat!', 'audio_ko': '?-디???-무 ?? ?-제 ?????-간!'}],
        }}
      />
    
      {/* ?-?- [FirstMotion ?-요??주말 3-in-1 ?-츠: [주말 1-??-수 ?-어]] ?-?- */}
      <Composition
        id="PostMotionSat3in1EN"
        component={PostMotion3in1Template}
        durationInFrames={748}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[주말 1-??-수 ?-어]",
          badgeColor: "#2563eb",
          badgeBg: "#eff6ff",
          title: "?-요??주말 ?-링 ?-수 ?-어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 136, 'flipEndFrame': 136, 'endFrame': 300}, {'startFrame': 300, 'flipStartFrame': 379, 'flipEndFrame': 379, 'endFrame': 506}, {'startFrame': 506, 'flipStartFrame': 604, 'flipEndFrame': 604, 'endFrame': 743}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'I finally slept in! What a relaxing morning.', 'pronunciation': '[?-이 ?-이?-리 ?-렙???? ????릴랙??모닝.]', 'meaning': '?-디????-- ?-어! ?-말 ?-유로운 ?-침?-야.', 'backSubtitle': '주말 ??--???-복', 'backMainQuote': '?-람 ?-이 ???-고 ?-어???-침!<br />진짜 주말???-작?-다', 'audio_lang': 'I finally slept in! What a relaxing morning.', 'audio_ko': '?-디????-- ?-어! ?-말 ?-유로운 ?-침?-야.'}, {'indexBadge': '2 / 3', 'primaryText': "Let's grab some brunch and chill today.", 'pronunciation': '[?-츠 그랩 ??브런-???-??-데??]', 'meaning': '?-늘 브런-?먹고 ?-하-????-자.', 'backSubtitle': '?-요???-유로운 ?-속', 'backMainQuote': '맛있??브런치-? 커피 ?-잔!<br />?-늘 ?-루 ?-하-??-기', 'audio_lang': "Let's grab some brunch and chill today.", 'audio_ko': '?-늘 브런-?먹고 ?-하-????-자.'}, {'indexBadge': '3 / 3', 'primaryText': "No plans today, and that's the best part!", 'pronunciation': '[???-랜???-데?? ???-츠 ??베스???-트!]', 'meaning': '?-늘?- ?-무 계획 ?-어, 그게 ?-일 좋아!', 'backSubtitle': '무계??주말???-유', 'backMainQuote': '?-무것도 ???-도 ?-벽???-루!<br />집에???-전???-링', 'audio_lang': "No plans today, and that's the best part!", 'audio_ko': '?-늘?- ?-무 계획 ?-어, 그게 ?-일 좋아!'}],
        }}
      />

      {/* ?-?- [FirstMotion ?-요??주말 3-in-1 ?-츠: [주말 1-??-수 ?-본??] ?-?- */}
      <Composition
        id="PostMotionSat3in1JA"
        component={PostMotion3in1Template}
        durationInFrames={729}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[주말 1-??-수 ?-본??",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "?-요??주말 ?-링 ?-수 ?-본??3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 121, 'flipEndFrame': 121, 'endFrame': 249}, {'startFrame': 249, 'flipStartFrame': 352, 'flipEndFrame': 352, 'endFrame': 475}, {'startFrame': 475, 'flipStartFrame': 588, 'flipEndFrame': 588, 'endFrame': 724}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '??--?-し?-し?-起?-る?-曜?-、-?高！', 'pronunciation': '[메자마시 ?-시???-키-??-요--? ?-이-?!]', 'meaning': '?-람 ?-이 ?-어?-는 ?-요?? 최고??', 'backSubtitle': '주말 ?-침 최고???-방-?', 'backMainQuote': '?-일 ?-로 ???-리??꿀??<br />?-요???-침???-복', 'audio_lang': '??--?-し?-し?-起?-る?-曜?-、-?高！', 'audio_ko': '?-람 ?-이 ?-어?-는 ?-요?? 최고??'}, {'indexBadge': '2 / 3', 'primaryText': '今日??--?-し?-ブ?-ン?-で?-食?-に行こ?--?', 'pronunciation': '[-??- ?-이?-이 브-?치데-??-베니 ?-코-.]', 'meaning': '?-늘?- 맛있??브런치나 먹으??가??', 'backSubtitle': '?-요???-유로운 ?-출', 'backMainQuote': '좋아?-는 카페?-서 커피 ?-잔!<br />?-요???-전 ?-유 즐기-?', 'audio_lang': '今日??--?-し?-ブ?-ン?-で?-食?-に行こ?--?', 'audio_ko': '?-늘?- 맛있??브런치나 먹으??가??'}, {'indexBadge': '3 / 3', 'primaryText': '予定?-入?-ず?-、の?-び?-過?-す??--一?-！', 'pronunciation': '[?-테?-오 ?-레즈니, ?-비-??-고?-노가 ?-치-?]', 'meaning': '?-속 ?-이 ?--?-?-- ?-굴거리??-?최고??', 'backSubtitle': '?-비-???--?-り) 주말 ?-링', 'backMainQuote': '?-속 ?-이 ???-는 ?-만???-간!<br />?-전???-충??', 'audio_lang': '予定?-入?-ず?-、の?-び?-過?-す??--一?-！', 'audio_ko': '?-속 ?-이 ?--?-?-- ?-굴거리??-?최고??'}],
        }}
      />

      {/* ?-?- [FirstMotion ?-요??주말 3-in-1 ?-츠: [주말 1-??-수 ?-페?-어]] ?-?- */}
      <Composition
        id="PostMotionSat3in1ES"
        component={PostMotion3in1Template}
        durationInFrames={712}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[주말 1-??-수 ?-페?-어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "?-요??주말 ?-링 ?-수 ?-페?-어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 101, 'flipEndFrame': 101, 'endFrame': 240}, {'startFrame': 240, 'flipStartFrame': 337, 'flipEndFrame': 337, 'endFrame': 472}, {'startFrame': 472, 'flipStartFrame': 562, 'flipEndFrame': 562, 'endFrame': 707}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '¡Qué rico es despertar tarde un sábado!', 'pronunciation': '[케 리코 ?-스 ?-스?-르?--??-르데 ???-바??]', 'meaning': '?-요?-에 ??-- ?-고 ?-어?-는 -??-말 최고??', 'backSubtitle': '?-요???-침???-콤???-유', 'backMainQuote': '?-람 ?-는 ?-벽???-침!<br />??--???-복 만끽?-기', 'audio_lang': '¡Qué rico es despertar tarde un sábado!', 'audio_ko': '?-요?-에 ??-- ?-고 ?-어?-는 -??-말 최고??'}, {'indexBadge': '2 / 3', 'primaryText': 'Vamos a desayunar rico y disfrutar el día.', 'pronunciation': '[바모?????-사?-나-?리코 ???-스?-루?--????-아.]', 'meaning': '맛있??브런-?먹고 ?-늘 ?-루-?즐기??', 'backSubtitle': '주말 ?-유로운 ?-사', 'backMainQuote': '맛있??커피?- ?-침 ?-사!<br />?-유-?-- 주말 ?-작?-기', 'audio_lang': 'Vamos a desayunar rico y disfrutar el día.', 'audio_ko': '맛있??브런-?먹고 ?-늘 ?-루-?즐기??'}, {'indexBadge': '3 / 3', 'primaryText': 'Hoy no tengo planes y eso es perfecto.', 'pronunciation': '[?-이 ???-고 ?-라?-스 ???-소 ?-스 ?-르?-토.]', 'meaning': '?-늘?- ?-무 계획???-어, 그게 ?-벽??', 'backSubtitle': '?-벽???-유??주말', 'backMainQuote': '계획 ?-는 ?-루가 주는 ?-유!<br />마음 ?-히 ???-기', 'audio_lang': 'Hoy no tengo planes y eso es perfecto.', 'audio_ko': '?-늘?- ?-무 계획???-어, 그게 ?-벽??'}],
        }}
      />

      {/* ?-?- [FirstMotion ?-요??주말 3-in-1 ?-츠: [주말 1-??-수 중국??] ?-?- */}
      <Composition
        id="PostMotionSat3in1ZH"
        component={PostMotion3in1Template}
        durationInFrames={678}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[주말 1-??-수 중국??",
          badgeColor: "#e11d48",
          badgeBg: "#fff1f2",
          title: "?-요??주말 ?-링 ?-수 중국??3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 98, 'flipEndFrame': 98, 'endFrame': 234}, {'startFrame': 234, 'flipStartFrame': 324, 'flipEndFrame': 324, 'endFrame': 444}, {'startFrame': 444, 'flipStartFrame': 535, 'flipEndFrame': 535, 'endFrame': 673}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '不用定闹?-的?-六，太幸福了！', 'pronunciation': '[부?????-오-????-?-류, ?-???-푸 ??]', 'meaning': '?-람 ??맞추-??-는 ?-요?? ?-무 ?-복??', 'backSubtitle': '?-람 ?-는 ?-침???-복', 'backMainQuote': '?-연?-럽-??-뜨???-요??<br />??--???-유 즐기-?', 'audio_lang': '不用定闹?-的?-六，太幸福了！', 'audio_ko': '?-람 ??맞추-??-는 ?-요?? ?-무 ?-복??'}, {'indexBadge': '2 / 3', 'primaryText': '今天?-吃个早?-餐，放?--?下-?', 'pronunciation': '[진티??-?-?-??-오?-찬, ?-송 ?-시??]', 'meaning': '?-늘 브런-?먹으??가???-링?-자.', 'backSubtitle': '?-요??브런-??-이??', 'backMainQuote': '맛있??브런치-? ?-뜻??-??-잔!<br />마음???-유 찾기', 'audio_lang': '今天?-吃个早?-餐，放?--?下-?', 'audio_ko': '?-늘 브런-?먹으??가???-링?-자.'}, {'indexBadge': '3 / 3', 'primaryText': '今天什么都不做，就?--?躺平-?', 'pronunciation': '[진티???-머 ?-우 부 주오, 지???-이 지???-핑!]', 'meaning': '?-늘?- ?-무것도 ???-고 집에???-굴거릴??', 'backSubtitle': '?-핑(躺平) ?-링 ?-식', 'backMainQuote': '?-전???--? ?-해 ?-어가???-간!<br />침-??-서 ???-기', 'audio_lang': '今天什么都不做，就?--?躺平-?', 'audio_ko': '?-늘?- ?-무것도 ???-고 집에???-굴거릴??'}],
        }}
      />

      {/* ?-?- [FirstMotion ?-요??주말 3-in-1 ?-츠: [주말 1-??-수 ?-니??] ?-?- */}
      <Composition
        id="PostMotionSat3in1ID"
        component={PostMotion3in1Template}
        durationInFrames={779}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[주말 1-??-수 ?-니??",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "?-요??주말 ?-링 ?-수 ?-니??3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 127, 'flipEndFrame': 127, 'endFrame': 260}, {'startFrame': 260, 'flipStartFrame': 363, 'flipEndFrame': 363, 'endFrame': 489}, {'startFrame': 489, 'flipStartFrame': 628, 'flipEndFrame': 628, 'endFrame': 774}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Bangun siang di hari Sabtu rasanya luar biasa!', 'pronunciation': '[방운 ?-앙 ???-리 ?-투 ?-사??루아-?비아??]', 'meaning': '?-요?-에 ??-- ?-고 ?-어?-니 기분 최고??', 'backSubtitle': '?-요????--???-복', 'backMainQuote': '?-람 ?-이 맞이?-는 ?-침!<br />?-로가 ???-리는 기분', 'audio_lang': 'Bangun siang di hari Sabtu rasanya luar biasa!', 'audio_ko': '?-요?-에 ??-- ?-고 ?-어?-니 기분 최고??'}, {'indexBadge': '2 / 3', 'primaryText': 'Yuk kita cari sarapan enak dan santai!', 'pronunciation': '[???--? 차리 ?-라???-낙 ???--???]', 'meaning': '?-리 맛있??브런-?먹고 ?-유 즐기??', 'backSubtitle': '?--???Santai) ?-유로운 ?-사', 'backMainQuote': '맛있???-사?- ?-원??커피!<br />주말 ?-침 ?-유 만끽?-기', 'audio_lang': 'Yuk kita cari sarapan enak dan santai!', 'audio_ko': '?-리 맛있??브런-?먹고 ?-유 즐기??'}, {'indexBadge': '3 / 3', 'primaryText': 'Hari ini nggak ada acara, rebahan aja di rumah.', 'pronunciation': '[?-리 ?-니 ?-각 ?-다 ?-차?? 르바???-자 ??루마.]', 'meaning': '?-늘?- ?-무 ?-정 ?-어, 집에???-워 ?-래.', 'backSubtitle': '르바??Rebahan) 집콕 ?-링', 'backMainQuote': '?-속 ?-이 ?-안?-게 ?-굴거리-?<br />최고??주말 ?-링', 'audio_lang': 'Hari ini nggak ada acara, rebahan aja di rumah.', 'audio_ko': '?-늘?- ?-무 ?-정 ?-어, 집에???-워 ?-래.'}],
        }}
      />

      {/* ?-?- [StayHelper 글로벌 ??---??-테??4?? Four Seasons Resort Koh Samui (1080x1920, 32-?8-Act 마스??릴스)] ?-?- */}
      <Composition
        id="PostMotionStayHelperKohSamui"
        component={PostMotionStayHelperKohSamui}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="PostMotionStayHelperSonevaJani"
        component={PostMotionStayHelperSonevaJani}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── [StayHelper 글로벌 럭셔리 6호 The Chedi Andermatt] ── */}
      <Composition
        id="PostMotionStayHelperChedi"
        component={PostMotionStayHelperChedi}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 🌊 [StayHelper 마스터 7호 Monastero Santa Rosa] 🌊 */}
      <Composition
        id="PostMotionStayHelperMonastero"
        component={PostMotionStayHelperMonastero}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ⛩️ [StayHelper 마스터 8호 Aman Kyoto] ⛩️ */}
      <Composition
        id="PostMotionStayHelperAmanKyoto"
        component={PostMotionStayHelperAmanKyoto}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 🦁 [StayHelper 마스터 9호 Singita Sasakwa Lodge] 🦁 */}
      <Composition
        id="PostMotionStayHelperSingita"
        component={PostMotionStayHelperSingita}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 🌊 [StayHelper 마스터 10호 Hôtel du Cap-Eden-Roc] 🌊 */}
      <Composition
        id="PostMotionStayHelperEdenRoc"
        component={PostMotionStayHelperEdenRoc}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── [StayHelper 범용 럭셔리 스테이 6-Act 무인 자동화 마스터 릴스 (35초, 1050프레임)] ── */}
      <Composition
        id="PostMotionStayHelperUniversal"
        component={PostMotionStayHelperUniversal}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          const p = props as any;
          if (p.totalDurationInFrames) {
            return { durationInFrames: p.totalDurationInFrames };
          }
          if (p.acts && Array.isArray(p.acts) && p.acts.length > 0) {
            const total = p.acts.reduce((acc: number, a: any) => {
              const dur = a.durationInFrames || (a.voDurationFrames ? a.voDurationFrames + 26 : 210);
              return acc + dur;
            }, 0) + 70;
            return { durationInFrames: total };
          }
          return { durationInFrames: 1050 };
        }}
        defaultProps={defaultStayHelperProps}
      />

      {/* ── [WeddingHelper 글로벌 럭셔리 데스티네이션 바이럴 릴스 (30초, 900프레임)] ── */}
      <Composition
        id="PostMotionWeddingHelper"
        component={PostMotionWeddingHelper}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultWeddingHelperProps}
      />

      {/* ── [FirstMotion 코리안루프 (KoreanLoop) 바이럴 쇼츠 3편] ── */}
      <Composition
        id="KoreanLoopShortsNunchi"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Untranslatable Korean]",
          categoryColor: "#7c3aed",
          categoryBg: "#f5f3ff",
          title: "Untranslatable Korean Words You Must Know! #Shorts",
          tagText: "KOREAN SLANG",
          korean: "눈치 챙겨!",
          romanization: "[Nun-chi chaeng-gyeo!]",
          english: "Read the room! Pick up the vibe.",
          nuanceTitle: "Korean Social Radar",
          nuanceDesc: "Literally 'Pack your Nunchi!' Use when someone is socially oblivious.",
          audioFile: "audio_shorts_nunchi.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsBab"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Real Korean Greeting]",
          categoryColor: "#ea580c",
          categoryBg: "#fff7ed",
          title: "What Koreans Say Instead of How Are You? #Shorts",
          tagText: "CULTURE SHOCK",
          korean: "밥 먹었어?",
          romanization: "[Bap meo-geo-sseo?]",
          english: "Did you eat? (Korea's true greeting!)",
          nuanceTitle: "The Ultimate Love Language",
          nuanceDesc: "Koreans ask about food to ask if you are doing well! Reply '응, 먹었어!' (Yes, I ate!)",
          audioFile: "audio_shorts_bab.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsService"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Secret Restaurant Hack]",
          categoryColor: "#059669",
          categoryBg: "#ecfdf5",
          title: "The Magic Word to Get Free Food in Korea #Shorts",
          tagText: "K-RESTAURANT HACK",
          korean: "이거 서비스예요!",
          romanization: "[I-geo seo-bi-seu-ye-yo!]",
          english: "This is on the house! (Free food!)",
          nuanceTitle: "Korea's Service Culture",
          nuanceDesc: "When owners say '서비스', it means 100% free complimentary gift from the chef!",
          audioFile: "audio_shorts_service.wav",
        }}
      />


      <Composition
        id="KoreanLoopShortsTreat"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Dining in Korea]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "How to Say \"It's on Me\" in Korean Like a Boss 💳 #Shorts",
          tagText: "KOREAN MANNERS",
          korean: "내가 낼게!",
          romanization: "[Nae-ga nael-ge!]",
          english: "It's on me! I'll pay for this.",
          nuanceTitle: "Cool Dining Flex",
          nuanceDesc: "Say this smoothly when grabbing coffee or meals to show generous warmth!",
          audioFile: "audio_shorts_treat.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsInsane"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Food Slang]",
          categoryColor: "#ea580c",
          categoryBg: "#fff7ed",
          title: "The #1 Slang Koreans Say When Food is Insane 🤤 #Shorts",
          tagText: "TASTE REACTION",
          korean: "미쳤다, 진짜!",
          romanization: "[Mi-chyeot-da, jin-jja!]",
          english: "This is insane! So good it's crazy.",
          nuanceTitle: "The Craziest Compliment",
          nuanceDesc: "Literally 'Crazy, for real!' Used when food tastes unbelievably amazing.",
          audioFile: "audio_shorts_insane.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsExcuse"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Seoul Street Survival]",
          categoryColor: "#059669",
          categoryBg: "#ecfdf5",
          title: "The Magic Word to Get Through Crowds in Seoul ✋ #Shorts",
          tagText: "STREET SURVIVAL",
          korean: "잠시만요!",
          romanization: "[Jam-shi-man-yo!]",
          english: "Excuse me! Just a moment, please.",
          nuanceTitle: "Crowd Parting Spell",
          nuanceDesc: "Say this on packed subways or busy streets to politely part the crowd!",
          audioFile: "audio_shorts_excuse.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsSpicy"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Spicy Challenge]",
          categoryColor: "#dc2626",
          categoryBg: "#fef2f2",
          title: "How to Order Extra Spicy Food in Korea 🌶️ #Shorts",
          tagText: "SPICY CHALLENGE",
          korean: "아주 맵게 해주세요!",
          romanization: "[A-ju maep-ge hae-ju-se-yo!]",
          english: "Please make it extra spicy!",
          nuanceTitle: "Bulldak Level Challenge",
          nuanceDesc: "Use this if you love fiery chili heat! Warning: Korean spicy is serious!",
          audioFile: "audio_shorts_spicy.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsFighting"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Korean Motivation]",
          categoryColor: "#7c3aed",
          categoryBg: "#f5f3ff",
          title: "Korea's #1 National Cheering Phrase 🔥 #Shorts",
          tagText: "K-SPIRIT CHEER",
          korean: "파이팅! 할 수 있어!",
          romanization: "[Pai-ting! Hal su i-sseo!]",
          english: "Fighting! You can do it!",
          nuanceTitle: "K-Spirit Encouragement",
          nuanceDesc: "'Fighting' is Korea's universal power cheer! Pair with a fist pump!",
          audioFile: "audio_shorts_fighting.wav",
        }}
      />

      {/* ── [FirstMotion 일요일 주말 3-in-1 쇼츠: [일요일 1분 필수 영어]] ── */}
      <Composition
        id="PostMotionSun3in1EN"
        component={PostMotion3in1Template}
        durationInFrames={699}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[일요일 1분 필수 영어]",
          badgeColor: "#2563eb",
          badgeBg: "#eff6ff",
          title: "일요일 주말 힐링 필수 영어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 88, 'flipEndFrame': 88, 'endFrame': 226}, {'startFrame': 226, 'flipStartFrame': 322, 'flipEndFrame': 322, 'endFrame': 460}, {'startFrame': 460, 'flipStartFrame': 546, 'flipEndFrame': 546, 'endFrame': 694}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Sundays are meant for doing nothing.', 'pronunciation': '[선데이즈 아 멘트 포 두잉 너씽.]', 'meaning': '일요일은 원래 아무것도 안 하라고 있는 날이야.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• be meant for: '~를 위해 존재하다'<br />• doing nothing: 아무것도 안 하고 푹 쉬기", 'audio_lang': 'Sundays are meant for doing nothing.', 'audio_ko': '일요일은 원래 아무것도 안 하라고 있는 날이야.'}, {'indexBadge': '2 / 3', 'primaryText': 'Recharging my battery before Monday comes.', 'pronunciation': '[리차징 마이 배터리 비포 먼데이 컴스.]', 'meaning': '월요일 오기 전에 에너지 100% 충전 중!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• recharge battery: '에너지를 재충전하다'<br />• before Monday: 월요일이 오기 전에", 'audio_lang': 'Recharging my battery before Monday comes.', 'audio_ko': '월요일 오기 전에 에너지 100% 충전 중!'}, {'indexBadge': '3 / 3', 'primaryText': 'Just chilling at home with some good coffee.', 'pronunciation': '[저스트 칠링 앳 홈 위드 썸 굿 커피.]', 'meaning': '맛있는 커피 마시면서 집에서 편하게 쉬는 중.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• chilling: '집에서 느긋하게 힐링하다'<br />• at home: 집에서 온전히 쉬는 모양", 'audio_lang': 'Just chilling at home with some good coffee.', 'audio_ko': '맛있는 커피 마시면서 집에서 편하게 쉬는 중.'}],
        }}
      />

      {/* ── [FirstMotion 일요일 주말 3-in-1 쇼츠: [일요일 1분 필수 일본어]] ── */}
      <Composition
        id="PostMotionSun3in1JA"
        component={PostMotion3in1Template}
        durationInFrames={753}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[일요일 1분 필수 일본어]",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "일요일 주말 힐링 필수 일본어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 115, 'flipEndFrame': 115, 'endFrame': 245}, {'startFrame': 245, 'flipStartFrame': 369, 'flipEndFrame': 369, 'endFrame': 491}, {'startFrame': 491, 'flipStartFrame': 614, 'flipEndFrame': 614, 'endFrame': 748}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '日曜日は何もしないでゴロゴロする日！', 'pronunciation': '[니치요-비와 나니모 시나이데 고로고로스루 히!]', 'meaning': '일요일은 아무것도 안 하고 뒹굴거리는 날!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': '• ゴロゴロ: 집에서 빈둥빈둥 뒹굴거리는 모양<br />• 何もしない: 아무것도 하지 않다', 'audio_lang': '日曜日は何もしないでゴロゴロする日！', 'audio_ko': '일요일은 아무것도 안 하고 뒹굴거리는 날!'}, {'indexBadge': '2 / 3', 'primaryText': '明日からのために、しっかりエネルギー充電中。', 'pronunciation': '[아시타카라노 타메니, 싯카리 에네루기- 주-덴추-.]', 'meaning': '내일을 위해 제대로 에너지 충전 중!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': '• しっかり: 확실하게, 제대로 푹<br />• 充電(じゅうでん): 기력을 회복함, 충전', 'audio_lang': '明日からのために、しっかりエネルギー充電中。', 'audio_ko': '내일을 위해 제대로 에너지 충전 중!'}, {'indexBadge': '3 / 3', 'primaryText': '温かいコーヒーを飲みながら、静かに過ごそう。', 'pronunciation': '[아타타카이 코-히-오 노미나가라, 시즈카니 스고소-.]', 'meaning': '따뜻한 커피 마시면서 조용히 쉬어야지.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': '• 飲みながら: 마시면서 (동사+ながら: ~하며)<br />• 過ごす(すごす): (시간을) 보내다, 지내다', 'audio_lang': '温かいコーヒーを飲みながら、静かに過ごそう。', 'audio_ko': '따뜻한 커피 마시면서 조용히 쉬어야지.'}],
        }}
      />

      {/* ── [FirstMotion 일요일 주말 3-in-1 쇼츠: [일요일 1분 필수 스페인어]] ── */}
      <Composition
        id="PostMotionSun3in1ES"
        component={PostMotion3in1Template}
        durationInFrames={704}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[일요일 1분 필수 스페인어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "일요일 주말 힐링 필수 스페인어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 110, 'flipEndFrame': 110, 'endFrame': 244}, {'startFrame': 244, 'flipStartFrame': 349, 'flipEndFrame': 349, 'endFrame': 470}, {'startFrame': 470, 'flipStartFrame': 565, 'flipEndFrame': 565, 'endFrame': 699}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Los domingos son para descansar y no hacer nada.', 'pronunciation': '[로스 도민고스 손 파라 데스칸사르 이 노 아세르 나다.]', 'meaning': '일요일은 푹 쉬고 아무것도 안 하는 날이야.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• descansar: '(피로를 풀며) 편히 쉬다'<br />• no hacer nada: 아무것도 안 하다", 'audio_lang': 'Los domingos son para descansar y no hacer nada.', 'audio_ko': '일요일은 푹 쉬고 아무것도 안 하는 날이야.'}, {'indexBadge': '2 / 3', 'primaryText': 'Recargando energías antes de que llegue el lunes.', 'pronunciation': '[레카르간도 에네르히아스 안테스 데 케 예게 엘 루네스.]', 'meaning': '월요일이 오기 전에 에너지 완충 중!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• recargar: '재충전하다' (현재분사형)<br />• antes de que: '~하기 전에' (접속법)", 'audio_lang': 'Recargando energías antes de que llegue el lunes.', 'audio_ko': '월요일이 오기 전에 에너지 완충 중!'}, {'indexBadge': '3 / 3', 'primaryText': 'Disfrutando de un café tranquilo en casa.', 'pronunciation': '[디스프루탄도 데 운 카페 트란킬로 엔 카사.]', 'meaning': '집에서 여유롭게 커피 한잔 즐기는 중.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• disfrutar de: '~를 마음껏 만끽하다'<br />• tranquilo: '조용한, 평온한, 여유로운'", 'audio_lang': 'Disfrutando de un café tranquilo en casa.', 'audio_ko': '집에서 여유롭게 커피 한잔 즐기는 중.'}],
        }}
      />

      {/* ── [FirstMotion 일요일 주말 3-in-1 쇼츠: [일요일 1분 필수 중국어]] ── */}
      <Composition
        id="PostMotionSun3in1ZH"
        component={PostMotion3in1Template}
        durationInFrames={710}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[일요일 1분 필수 중국어]",
          badgeColor: "#e11d48",
          badgeBg: "#fff1f2",
          title: "일요일 주말 힐링 필수 중국어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 89, 'flipEndFrame': 89, 'endFrame': 231}, {'startFrame': 231, 'flipStartFrame': 323, 'flipEndFrame': 323, 'endFrame': 457}, {'startFrame': 457, 'flipStartFrame': 559, 'flipEndFrame': 559, 'endFrame': 705}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '周日就是用来彻底躺平的！', 'pronunciation': '[저우르 지우 쉬 용라이 치어디 탕핑 더!]', 'meaning': '일요일은 원래 완벽하게 뒹굴거리라고 있는 날이야!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': '• 彻底(chèdǐ): 철저하게, 완벽하게<br />• 躺平(tǎngpíng): 푹 누워서 힐링하다', 'audio_lang': '周日就是用来彻底躺平的！', 'audio_ko': '일요일은 원래 완벽하게 뒹굴거리라고 있는 날이야!'}, {'indexBadge': '2 / 3', 'primaryText': '在周一到来之前，好好充满电。', 'pronunciation': '[짜이 저우이 다오라이 지치엔, 하오하오 충만 띠엔.]', 'meaning': '월요일이 오기 전에 제대로 에너지 완충하기.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 充满电: '에너지를 완충하다, 원기 회복'<br />• 好好: '제대로, 푹, 알차게'", 'audio_lang': '在周一到来之前，好好充满电。', 'audio_ko': '월요일이 오기 전에 제대로 에너지 완충하기.'}, {'indexBadge': '3 / 3', 'primaryText': '喝杯热咖啡，安安静静度过今天。', 'pronunciation': '[허 베이 러 카페이, 안안징징 두궈 진티엔.]', 'meaning': '따뜻한 커피 한잔하며 조용하게 오늘을 보내자.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 安安静静: '아주 조용하고 평온한 모양'<br />• 度过: '(시간이나 휴일을) 보내다, 지내다'", 'audio_lang': '喝杯热咖啡，安安静静度过今天。', 'audio_ko': '따뜻한 커피 한잔하며 조용하게 오늘을 보내자.'}],
        }}
      />

      {/* ── [FirstMotion 일요일 주말 3-in-1 쇼츠: [일요일 1분 필수 인니어]] ── */}
      <Composition
        id="PostMotionSun3in1ID"
        component={PostMotion3in1Template}
        durationInFrames={777}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[일요일 1분 필수 인니어]",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "일요일 주말 힐링 필수 인니어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 127, 'flipEndFrame': 127, 'endFrame': 267}, {'startFrame': 267, 'flipStartFrame': 382, 'flipEndFrame': 382, 'endFrame': 513}, {'startFrame': 513, 'flipStartFrame': 629, 'flipEndFrame': 629, 'endFrame': 772}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Hari Minggu waktunya santai dan rebahan total!', 'pronunciation': '[하리 밍구 왁투냐 산타이 단 르바한 토탈!]', 'meaning': '일요일은 온전히 여유 부리며 누워 쉬는 시간!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• santai: '여유로운, 편안히 쉬는'<br />• rebahan: '침대에 편히 누워 뒹굴거리다'", 'audio_lang': 'Hari Minggu waktunya santai dan rebahan total!', 'audio_ko': '일요일은 온전히 여유 부리며 누워 쉬는 시간!'}, {'indexBadge': '2 / 3', 'primaryText': 'Isi energi lagi sebelum hari Senin datang.', 'pronunciation': '[이시 에네르기 라기 스블룸 하리 스닌 다탕.]', 'meaning': '월요일이 오기 전에 에너지 다시 완충 중!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• isi energi: '에너지를 채우다, 재충전하다'<br />• sebelum: '~하기 전에'", 'audio_lang': 'Isi energi lagi sebelum hari Senin datang.', 'audio_ko': '월요일이 오기 전에 에너지 다시 완충 중!'}, {'indexBadge': '3 / 3', 'primaryText': 'Ngopi santai di rumah sambil menikmati hari.', 'pronunciation': '[응오피 산타이 디 루마 삼빌 므닉마티 하리.]', 'meaning': '집에서 여유롭게 커피 마시며 하루를 즐기기.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• ngopi: '커피를 마시다' (kopi의 구어 동사)<br />• menikmati: '~를 만끽하다, 즐기다'", 'audio_lang': 'Ngopi santai di rumah sambil menikmati hari.', 'audio_ko': '집에서 여유롭게 커피 마시며 하루를 즐기기.'}],
        }}
      />
    
      {/* ── [FirstMotion 월요일 출근길 3-in-1 쇼츠: [월요일 출근길 필수 영어]] ── */}
      <Composition
        id="PostMotionMon3in1EN"
        component={PostMotion3in1Template}
        durationInFrames={621}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[월요일 출근길 필수 영어]",
          badgeColor: "#2563eb",
          badgeBg: "#eff6ff",
          title: "월요일 출근길 필수 영어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 94, 'flipEndFrame': 94, 'endFrame': 219}, {'startFrame': 219, 'flipStartFrame': 300, 'flipEndFrame': 300, 'endFrame': 429}, {'startFrame': 429, 'flipStartFrame': 499, 'flipEndFrame': 499, 'endFrame': 616}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Monday morning comes way too fast.', 'pronunciation': '[먼데이 모닝 컴스 웨이 투 패스트.]', 'meaning': '월요일 아침은 왜 이렇게 빨리 올까요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• way too: '너무나, 훨씬 더 (강조)'<br />• come fast: 빠르게 다가오다", 'audio_lang': 'Monday morning comes way too fast.', 'audio_ko': '월요일 아침은 왜 이렇게 빨리 올까요.'}, {'indexBadge': '2 / 3', 'primaryText': 'Grabbing my coffee to survive today.', 'pronunciation': '[그래빙 마이 커피 투 서바이브 투데이.]', 'meaning': '오늘 하루 버티려고 모닝커피 수혈 중!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• grab coffee: '커피를 사 마시다'<br />• survive: 하루를 버텨내다, 살아남다", 'audio_lang': 'Grabbing my coffee to survive today.', 'audio_ko': '오늘 하루 버티려고 모닝커피 수혈 중!'}, {'indexBadge': '3 / 3', 'primaryText': "Let's make this week a good one!", 'pronunciation': '[렛츠 메이크 디스 위크 어 굿 원!]', 'meaning': '이번 주도 우리 힘차게 파이팅해요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• make it a good one: '알찬 시간으로 만들다'<br />• let's: ~하자 (긍정적 응원)", 'audio_lang': "Let's make this week a good one!", 'audio_ko': '이번 주도 우리 힘차게 파이팅해요!'}],
        }}
      />

      {/* ── [FirstMotion 월요일 출근길 3-in-1 쇼츠: [월요일 출근길 필수 일본어]] ── */}
      <Composition
        id="PostMotionMon3in1JA"
        component={PostMotion3in1Template}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[월요일 출근길 필수 일본어]",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "월요일 출근길 필수 일본어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 124, 'flipEndFrame': 124, 'endFrame': 262}, {'startFrame': 262, 'flipStartFrame': 374, 'flipEndFrame': 374, 'endFrame': 516}, {'startFrame': 516, 'flipStartFrame': 624, 'flipEndFrame': 624, 'endFrame': 745}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '月曜日の朝って、本当に早すぎる。', 'pronunciation': '[게츠요-비노 아삿테, 혼토-니 하야스기루.]', 'meaning': '월요일 아침은 정말 눈 깜짝할 사이에 와요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 〜すぎる: '너무 ~하다 (지나침)'<br />• 朝って: 아침이란 건 (구어 강조)", 'audio_lang': '月曜日の朝って、本当に早すぎる。', 'audio_ko': '월요일 아침은 정말 눈 깜짝할 사이에 와요.'}, {'indexBadge': '2 / 3', 'primaryText': '今週を乗り切るために、まずはコーヒー！', 'pronunciation': '[콘슈-오 노리키루 타메니, 마즈와 코-히-!]', 'meaning': '이번 주를 버티기 위해, 일단 모닝커피부터!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 乗り切る(のりきる): '어려움을 극복하다, 버티다'<br />• まずは: 우선, 일단", 'audio_lang': '今週を乗り切るために、まずはコーヒー！', 'audio_ko': '이번 주를 버티기 위해, 일단 모닝커피부터!'}, {'indexBadge': '3 / 3', 'primaryText': '今週も一週間、無理せず頑張ろう！', 'pronunciation': '[콘슈-모 잇슈-칸, 무리세즈 간바로우!]', 'meaning': '이번 주도 무리하지 말고 기운 내봐요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 無理せず(むりせず): '무리하지 않고, 적당히'<br />• 頑張ろう: 힘내자", 'audio_lang': '今週も一週間、無理せず頑張ろう！', 'audio_ko': '이번 주도 무리하지 말고 기운 내봐요!'}],
        }}
      />

      {/* ── [FirstMotion 월요일 출근길 3-in-1 쇼츠: [월요일 출근길 필수 스페인어]] ── */}
      <Composition
        id="PostMotionMon3in1ES"
        component={PostMotion3in1Template}
        durationInFrames={709}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[월요일 출근길 필수 스페인어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "월요일 출근길 필수 스페인어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 111, 'flipEndFrame': 111, 'endFrame': 236}, {'startFrame': 236, 'flipStartFrame': 333, 'flipEndFrame': 333, 'endFrame': 475}, {'startFrame': 475, 'flipStartFrame': 561, 'flipEndFrame': 561, 'endFrame': 704}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'El lunes por la mañana llega demasiado rápido.', 'pronunciation': '[엘 루네스 포르 라 마냐나 예가 데마시아도 라피도.]', 'meaning': '월요일 아침은 너무나도 빨리 찾아와요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• demasiado: '너무, 지나치게 (too much)'<br />• por la mañana: 오전에, 아침에", 'audio_lang': 'El lunes por la mañana llega demasiado rápido.', 'audio_ko': '월요일 아침은 너무나도 빨리 찾아와요.'}, {'indexBadge': '2 / 3', 'primaryText': 'Necesito un café bien cargado para empezar.', 'pronunciation': '[네세시토 운 카페 비엔 카르가도 파라 엠페사르.]', 'meaning': '하루를 시작하려면 진한 커피가 꼭 필요해요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• café cargado: '진한 커피, 에스프레소 느낌의 샷'<br />• para empezar: 시작하기 위해", 'audio_lang': 'Necesito un café bien cargado para empezar.', 'audio_ko': '하루를 시작하려면 진한 커피가 꼭 필요해요.'}, {'indexBadge': '3 / 3', 'primaryText': '¡Ánimo, vamos a tener una gran semana!', 'pronunciation': '[아니모, 바모스 아 테네르 우나 그란 세마나!]', 'meaning': '기운 내요, 이번 주도 멋진 한 주가 될 거예요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• ¡Ánimo!: '힘내!, 파이팅!' (대표 응원사)<br />• gran semana: 멋진 한 주", 'audio_lang': '¡Ánimo, vamos a tener una gran semana!', 'audio_ko': '기운 내요, 이번 주도 멋진 한 주가 될 거예요!'}],
        }}
      />

      {/* ── [FirstMotion 월요일 출근길 3-in-1 쇼츠: [월요일 출근길 필수 중국어]] ── */}
      <Composition
        id="PostMotionMon3in1ZH"
        component={PostMotion3in1Template}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[월요일 출근길 필수 중국어]",
          badgeColor: "#d97706",
          badgeBg: "#fffbeb",
          title: "월요일 출근길 필수 중국어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 82, 'flipEndFrame': 82, 'endFrame': 218}, {'startFrame': 218, 'flipStartFrame': 309, 'flipEndFrame': 309, 'endFrame': 435}, {'startFrame': 435, 'flipStartFrame': 507, 'flipEndFrame': 507, 'endFrame': 625}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '周一早上来得太快了吧。', 'pronunciation': '[저우이 자오상 라이 더 타이 콰이 러 바.]', 'meaning': '월요일 아침은 왜 이렇게 빨리 오는지 몰라요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 来得太快: '너무 빨리 오다 (정도보어 得)'<br />• 周一(zhōuyī): 월요일", 'audio_lang': '周一早上来得太快了吧。', 'audio_ko': '월요일 아침은 왜 이렇게 빨리 오는지 몰라요.'}, {'indexBadge': '2 / 3', 'primaryText': '买杯咖啡，准备开启新的一周！', 'pronunciation': '[마이 베이 카페이, 준베이 카이치 신 더 이 저우!]', 'meaning': '커피 한 잔 사서 새로운 한 주를 시작해요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 开启(kāiqǐ): '(본격적으로) 시작하다, 열다'<br />• 买杯: 한 잔 사다", 'audio_lang': '买杯咖啡，准备开启新的一周！', 'audio_ko': '커피 한 잔 사서 새로운 한 주를 시작해요!'}, {'indexBadge': '3 / 3', 'primaryText': '这周大家一起加油吧！', 'pronunciation': '[저 저우 다자 이치 자유 바!]', 'meaning': '이번 주도 우리 모두 다 같이 힘내요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 一起加油: '함께 힘내다, 파이팅하다'<br />• 这周: 이번 주", 'audio_lang': '这周大家一起加油吧！', 'audio_ko': '이번 주도 우리 모두 다 같이 힘내요!'}],
        }}
      />

      {/* ── [FirstMotion 월요일 출근길 3-in-1 쇼츠: [월요일 출근길 필수 인니어]] ── */}
      <Composition
        id="PostMotionMon3in1ID"
        component={PostMotion3in1Template}
        durationInFrames={773}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[월요일 출근길 필수 인니어]",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "월요일 출근길 필수 인니어 3문장",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 123, 'flipEndFrame': 123, 'endFrame': 264}, {'startFrame': 264, 'flipStartFrame': 371, 'flipEndFrame': 371, 'endFrame': 507}, {'startFrame': 507, 'flipStartFrame': 625, 'flipEndFrame': 625, 'endFrame': 768}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Senin pagi datangnya cepat banget, ya.', 'pronunciation': '[스닌 파기 다탕냐 츠팟 방엣, 야.]', 'meaning': '월요일 아침은 정말 눈 깜짝할 사이에 오네요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• cepat banget: '진짜 너무 빠르다 (인니 구어)'<br />• Senin pagi: 월요일 아침", 'audio_lang': 'Senin pagi datangnya cepat banget, ya.', 'audio_ko': '월요일 아침은 정말 눈 깜짝할 사이에 오네요.'}, {'indexBadge': '2 / 3', 'primaryText': 'Ngopi dulu biar semangat kerja hari ini.', 'pronunciation': '[응오피 둘루 비아르 스망앗 크르자 하리 이니.]', 'meaning': '오늘 힘내서 일하려고 일단 모닝커피 한잔!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• ngopi dulu: '일단 커피 마시다 (친근한 구어)'<br />• biar semangat: 기운 내기 위해", 'audio_lang': 'Ngopi dulu biar semangat kerja hari ini.', 'audio_ko': '오늘 힘내서 일하려고 일단 모닝커피 한잔!'}, {'indexBadge': '3 / 3', 'primaryText': 'Semangat ya, semoga minggu ini lancar!', 'pronunciation': '[스망앗 야, 스모가 밍구 이니 란차르!]', 'meaning': '힘내세요, 이번 주도 모든 일이 술술 풀리길!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• lancar: '(일이나 막힘없이) 순조롭다, 술술 풀리다'<br />• semangat: 파이팅!", 'audio_lang': 'Semangat ya, semoga minggu ini lancar!', 'audio_ko': '힘내세요, 이번 주도 모든 일이 술술 풀리길!'}],
        }}
      />
    
      {/* ── [3분 일본어 문법 시리즈 01화: は vs が] ── */}
      <Composition
        id="JapaneseGrammarEp01"
        component={PostMotion3in1Template}
        durationInFrames={510}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[3분 일본어 문법] 01화",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "한국인이 99% 헷갈리는 は vs が",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 76, 'flipEndFrame': 76, 'endFrame': 169}, {'startFrame': 169, 'flipStartFrame': 235, 'flipEndFrame': 235, 'endFrame': 328}, {'startFrame': 328, 'flipStartFrame': 404, 'flipEndFrame': 404, 'endFrame': 505}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '私は田中です。', 'pronunciation': '[와타시와 타나카데스.]', 'meaning': '저는 다나카입니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': "• は(wa): '이미 아는 주제 제시 (구정보, ~은/는)'<br />• 私(わたし): 나, 저 | です: ~입니다", 'audio_lang': '私は田中です。', 'audio_ko': '저는 다나카입니다.'}, {'indexBadge': '2 / 3', 'primaryText': '私が田中です。', 'pronunciation': '[와타시가 타나카데스.]', 'meaning': '(누가 다나카냐고요?) 제가 다나카입니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• が(ga): \'주어 특정 & 새로운 정보 지정 (~이/가)\'<br />• 뉘앙스: "누가 다나카죠?" 질문에 대한 특정 답변', 'audio_lang': '私が田中です。', 'audio_ko': '제가 다나카입니다.'}, {'indexBadge': '3 / 3', 'primaryText': '象は鼻が長いです。', 'pronunciation': '[조-와 하나가 나가이데스.]', 'meaning': '코끼리는 코가 깁니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• 전체 주제(は) + 부분 특징(が) 서술 공식<br />• 象(ぞう): 코끼리 | 鼻(はな): 코 | 長い: 길다', 'audio_lang': '象は鼻が長いです。', 'audio_ko': '코끼리는 코가 깁니다.'}],
          footerTitle: "3분 일본어 문법 루프 | LanguageLoop",
          footerDesc: "구독하고 매일 1개씩 일본어 문법 공식 마스터!",
        }}
      />
    
      {/* ── [3분 일본어 문법 시리즈: [3분 일본어 문법] 02화] ── */}
      <Composition
        id="JapaneseGrammarEp02"
        component={PostMotion3in1Template}
        durationInFrames={507}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[3분 일본어 문법] 02화",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "한국인이 99% 헷갈리는 に vs で",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 75, 'flipEndFrame': 75, 'endFrame': 173}, {'startFrame': 173, 'flipStartFrame': 242, 'flipEndFrame': 242, 'endFrame': 337}, {'startFrame': 337, 'flipStartFrame': 406, 'flipEndFrame': 406, 'endFrame': 502}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '部屋に猫がいます。', 'pronunciation': '[헤야니 네코가 이마스.]', 'meaning': '방에 고양이가 있어요.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• に: 정적인 존재·위치 (~에 있다)<br />• 部屋(へや): 방 | 猫(ねこ): 고양이 | いる: 있다', 'audio_lang': '部屋に猫がいます。', 'audio_ko': '방에 고양이가 있어요.'}, {'indexBadge': '2 / 3', 'primaryText': '部屋で本を読みます。', 'pronunciation': '[헤야데 홍오 요미마스.]', 'meaning': '방에서 책을 읽어요.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• で: 동적인 행위·동작 발생 장소 (~에서)<br />• 本(ほん): 책 | 読む(よむ): 읽다', 'audio_lang': '部屋で本を読みます。', 'audio_ko': '방에서 책을 읽어요.'}, {'indexBadge': '3 / 3', 'primaryText': '東京に住んでいます。', 'pronunciation': '[토-쿄-니 순데이마스.]', 'meaning': '도쿄에 살고 있습니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': "• '살다(住む)'는 정착 상태이므로 で가 아닌 に 사용<br />• 東京(とうきょう): 도쿄 | 住む(すむ): 살다", 'audio_lang': '東京に住んでいます。', 'audio_ko': '도쿄에 살고 있습니다.'}],
          footerTitle: "3분 일본어 문법 루프 | LanguageLoop",
          footerDesc: "구독하고 매일 1개씩 일본어 문법 공식 마스터!",
        }}
      />

      {/* ── [3분 일본어 문법 시리즈: [3분 일본어 문법] 03화] ── */}
      <Composition
        id="JapaneseGrammarEp03"
        component={PostMotion3in1Template}
        durationInFrames={461}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[3분 일본어 문법] 03화",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "한국인이 99% 헷갈리는 を vs に",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 68, 'flipEndFrame': 68, 'endFrame': 155}, {'startFrame': 155, 'flipStartFrame': 218, 'flipEndFrame': 218, 'endFrame': 309}, {'startFrame': 309, 'flipStartFrame': 367, 'flipEndFrame': 367, 'endFrame': 456}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '水を飲みます。', 'pronunciation': '[미즈오 노미마스.]', 'meaning': '물을 마십니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• を(o): 타동사의 직접 목적어 (~을/를)<br />• 水(みず): 물 | 飲む(のむ): 마시다', 'audio_lang': '水を飲みます。', 'audio_ko': '물을 마십니다.'}, {'indexBadge': '2 / 3', 'primaryText': '友達に会います。', 'pronunciation': '[토모다치니 아이마스.]', 'meaning': '친구를 만납니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• 会う(만나다)는 상호 마주치는 접촉이므로 に 필수<br />• 友達(ともだち): 친구 | 会う(あう): 만나다', 'audio_lang': '友達に会います。', 'audio_ko': '친구를 만납니다.'}, {'indexBadge': '3 / 3', 'primaryText': 'バスに乗ります。', 'pronunciation': '[바스니 노리마스.]', 'meaning': '버스를 탑니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• 乗る(타다)는 올라타는 대상 접촉점이므로 に 사용<br />• バス: 버스 | 乗る(のる): 타다', 'audio_lang': 'バスに乗ります。', 'audio_ko': '버스를 탑니다.'}],
          footerTitle: "3분 일본어 문법 루프 | LanguageLoop",
          footerDesc: "구독하고 매일 1개씩 일본어 문법 공식 마스터!",
        }}
      />

      {/* ── [3분 일본어 문법 시리즈: [3분 일본어 문법] 04화] ── */}
      <Composition
        id="JapaneseGrammarEp04"
        component={PostMotion3in1Template}
        durationInFrames={498}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[3분 일본어 문법] 04화",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "한국인이 99% 헷갈리는 へ vs まで",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 71, 'flipEndFrame': 71, 'endFrame': 161}, {'startFrame': 161, 'flipStartFrame': 225, 'flipEndFrame': 225, 'endFrame': 321}, {'startFrame': 321, 'flipStartFrame': 392, 'flipEndFrame': 392, 'endFrame': 493}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '日本へ行きます。', 'pronunciation': '[니혼에 이키마스.]', 'meaning': '일본으로 갑니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• へ(조사 발음 e): 이동의 목표 방향 (~쪽으로, ~로)<br />• 日本(にほん): 일본 | 行く(いく): 가다', 'audio_lang': '日本へ行きます。', 'audio_ko': '일본으로 갑니다.'}, {'indexBadge': '2 / 3', 'primaryText': '駅まで歩きます。', 'pronunciation': '[에키마데 아루키마스.]', 'meaning': '역까지 걸어갑니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• まで: 행위가 끝나는 명확한 종착점·한계 (~까지)<br />• 駅(えき): 역 | 歩く(あるく): 걷다', 'audio_lang': '駅まで歩きます。', 'audio_ko': '역까지 걸어갑니다.'}, {'indexBadge': '3 / 3', 'primaryText': '５時まで勉強します。', 'pronunciation': '[고지마데 벵쿄-시마스.]', 'meaning': '5시까지 공부합니다.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• 時間 + まで: 그 시점까지 동작이 계속 지속됨<br />• ５時(ごじ): 5시 | 勉強する: 공부하다', 'audio_lang': '５時まで勉強します。', 'audio_ko': '5시까지 공부합니다.'}],
          footerTitle: "3분 일본어 문법 루프 | LanguageLoop",
          footerDesc: "구독하고 매일 1개씩 일본어 문법 공식 마스터!",
        }}
      />

      {/* ── [3분 일본어 문법 시리즈: [3분 일본어 문법] 05화] ── */}
      <Composition
        id="JapaneseGrammarEp05"
        component={PostMotion3in1Template}
        durationInFrames={566}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[3분 일본어 문법] 05화",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "한국인이 99% 헷갈리는 조사 나열 3종",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 88, 'flipEndFrame': 88, 'endFrame': 194}, {'startFrame': 194, 'flipStartFrame': 265, 'flipEndFrame': 265, 'endFrame': 369}, {'startFrame': 369, 'flipStartFrame': 448, 'flipEndFrame': 448, 'endFrame': 561}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'りんごとバナナを買いました。', 'pronunciation': '[링고토 바나나오 카이마시타.]', 'meaning': '사과와 바나나를 샀어요.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• と: 나열된 항목이 전부일 때 (완전 나열, ~와/과)<br />• りんご: 사과 | バナナ: 바나나 | 買う: 사다', 'audio_lang': 'りんごとバナナを買いました。', 'audio_ko': '사과와 바나나를 샀어요.'}, {'indexBadge': '2 / 3', 'primaryText': '本やノートがあります。', 'pronunciation': '[홍야 노-토가 아리마스.]', 'meaning': '책이랑 공책 등이 있어요.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• や: 여러 개 중 일부만 대표로 예시 (불완전 나열)<br />• 本(ほん): 책 | ノート: 공책 | ある: 있다', 'audio_lang': '本やノートがあります。', 'audio_ko': '책이랑 공책 등이 있어요.'}, {'indexBadge': '3 / 3', 'primaryText': '寿司とかラーメンが好きです。', 'pronunciation': '[스시토카 라-멩가 스키데스.]', 'meaning': '초밥이라든가 라멘을 좋아해요.', 'backSubtitle': '핵심 문법 공식 & 어휘', 'backMainQuote': '• とか: 회화에서 편하게 예시를 들 때 (~라든가)<br />• 寿司(すし): 초밥 | ラーメン: 라멘 | 好き: 좋아함', 'audio_lang': '寿司とかラーメンが好きです。', 'audio_ko': '초밥이라든가 라멘을 좋아해요.'}],
          footerTitle: "3분 일본어 문법 루프 | LanguageLoop",
          footerDesc: "구독하고 매일 1개씩 일본어 문법 공식 마스터!",
        }}
      />
    
      {/* ── [3분 일본어 문법 롱폼 15문장] ── */}
      <Composition
        id="JapaneseGrammarLongform15"
        component={PostMotionKoreanLoopSpanishLongform15}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultSpanishLongformProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(30, props.totalFrames),
        })}
      />
    
      {/* ── [3분 일본어 문법 롱폼 Stage 2 동사 활용 15문장] ── */}
      <Composition
        id="JapaneseGrammarLongformStage2"
        component={PostMotionKoreanLoopSpanishLongform15}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultSpanishLongformProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(30, props.totalFrames),
        })}
      />

      {/* ── [일본어 문법 롱폼 16:9 전용 썸네일] ── */}
      <Composition
        id="JapaneseGrammarLongformThumbnail"
        component={JapaneseGrammarLongformThumbnail}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── [일본어 문법 롱폼 16:9 전용 썸네일 Stage 2] ── */}
      <Composition
        id="JapaneseGrammarLongformThumbnailStage2"
        component={JapaneseGrammarLongformThumbnailStage2}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── [3분 일본어 문법 롱폼 Stage 3 필수 형용사 활용 15문장] ── */}
      <Composition
        id="JapaneseGrammarLongformStage3"
        component={PostMotionKoreanLoopSpanishLongform15}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultSpanishLongformProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(30, props.totalFrames),
        })}
      />

      {/* ── [일본어 문법 롱폼 16:9 전용 썸네일 Stage 3] ── */}
      <Composition
        id="JapaneseGrammarLongformThumbnailStage3"
        component={JapaneseGrammarLongformThumbnailStage3}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />


    

      

      <Composition
        id="KoreanLoopShortsAaCoffee"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Seoul Cafe Culture]",
          categoryColor: "#b45309",
          categoryBg: "#fef3c7",
          title: "What Koreans Say When They Desperately Need Coffee ☕ #Shorts",
          tagText: "CAFE SURVIVAL",
          korean: "아아 수혈 필요해!",
          romanization: "[A-a su-hyeol pil-yo-hae!]",
          english: "I need an Iced Americano IV drip right now!",
          nuanceTitle: "The 'Ah-Ah' Lifeline",
          nuanceDesc: "'Ah-Ah' (아아) is short for Iced Americano. Koreans treat it like emergency fuel!",
          audioFile: "audio_shorts_aacoffee.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsMondayBlues"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Workplace Korean]",
          categoryColor: "#4338ca",
          categoryBg: "#e0e7ff",
          title: "How Koreans Express the Dreaded 'Monday Blues' 😴 #Shorts",
          tagText: "MONDAY MOOD",
          korean: "월요병 도졌어...",
          romanization: "[Wol-yo-byeong do-jyeo-sseo...]",
          english: "My Monday blues just kicked in...",
          nuanceTitle: "The Monday Sickness",
          nuanceDesc: "'Wol-yo-byeong' literally means 'Monday Disease'—the universal fatigue on Monday morning!",
          audioFile: "audio_shorts_mondayblues.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsHangInThere"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Daily Encouragement]",
          categoryColor: "#059669",
          categoryBg: "#ecfdf5",
          title: "What Koreans Say to Power Through Tough Days 💪 #Shorts",
          tagText: "POWER THROUGH",
          korean: "조금만 더 버티자!",
          romanization: "[Jo-geum-man deo beo-ti-ja!]",
          english: "Let's hang in there just a little longer!",
          nuanceTitle: "Grit & Solidarity",
          nuanceDesc: "Said to coworkers or friends when surviving grueling workdays or final exams!",
          audioFile: "audio_shorts_hanginthere.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsClockOut"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Office Survival]",
          categoryColor: "#dc2626",
          categoryBg: "#fef2f2",
          title: "How to Say 'Leaving on Time' Like a Boss in Korean 🏃‍♂️ #Shorts",
          tagText: "OFFICE VICTORY",
          korean: "오늘 칼퇴할 거야!",
          romanization: "[O-neul kal-toe-hal geo-ya!]",
          english: "I'm clocking out right on the dot today!",
          nuanceTitle: "Blade-Sharp Clock Out",
          nuanceDesc: "'Kal-toe' (칼퇴) means clocking out sharp like a blade (칼) the exact second shift ends!",
          audioFile: "audio_shorts_clockout.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsBeerAfterWork"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Nightlife & Friendship]",
          categoryColor: "#d97706",
          categoryBg: "#fffbeb",
          title: "The Magic Invitation After a Long Day in Seoul 🍻 #Shorts",
          tagText: "AFTER WORK DRINK",
          korean: "퇴근하고 맥주 한잔?",
          romanization: "[Toe-geun-ha-go maek-ju han-jan?]",
          english: "Down for a cold beer after work?",
          nuanceTitle: "The Ultimate Bonding Line",
          nuanceDesc: "The most casual, friendly invite to wash away work stress with chicken & beer (Chimaek)!",
          audioFile: "audio_shorts_beerafterwork.wav",
        }}
      />

      {/* ── [FirstMotion 화요일 출근길 3-in-1 쇼츠: [화요일 출근길 필수 스페인어]] ── */}
      <Composition
        id="PostMotionTue3in1ES"
        component={PostMotion3in1Template}
        durationInFrames={712}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[화요일 출근길 필수 스페인어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "화요일 출근길 필수 스페인어 3문장 🇪🇸 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 111, 'flipEndFrame': 111, 'endFrame': 251}, {'startFrame': 251, 'flipStartFrame': 343, 'flipEndFrame': 343, 'endFrame': 477}, {'startFrame': 477, 'flipStartFrame': 569, 'flipEndFrame': 569, 'endFrame': 707}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Superamos el lunes, ¡ahora por el martes!', 'pronunciation': '[수페라모스 엘 루네스, 아오라 포르 엘 마르테스!]', 'meaning': '월요일은 넘겼으니, 이제 화요일도 힘내봐요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• superar: '(힘든 고비를) 극복하다, 넘기다'<br />• ¡a por ~!: '~를 향해 가자, 파이팅하자!'", 'audio_lang': 'Superamos el lunes, ¡ahora por el martes!', 'audio_ko': '월요일은 넘겼으니, 이제 화요일도 힘내봐요!'}, {'indexBadge': '2 / 3', 'primaryText': 'Tomando el ritmo de la semana poco a poco.', 'pronunciation': '[토만도 엘 리트모 데 라 세마나 포코 아 포코.]', 'meaning': '이번 주 페이스를 조금씩 찾아가는 중이에요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• poco a poco: '차근차근, 조금씩 (step by step)'<br />• tomar el ritmo: 리듬/페이스를 잡다", 'audio_lang': 'Tomando el ritmo de la semana poco a poco.', 'audio_ko': '이번 주 페이스를 조금씩 찾아가는 중이에요.'}, {'indexBadge': '3 / 3', 'primaryText': '¡Ánimo con el día, todo saldrá bien!', 'pronunciation': '[아니모 콘 엘 디아, 토도 살드라 비엔!]', 'meaning': '오늘 하루도 파이팅, 다 잘 풀릴 거예요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• todo saldrá bien: '모든 일이 잘 풀릴 것이다'<br />• ¡Ánimo!: 힘내요! (대표 응원사)", 'audio_lang': '¡Ánimo con el día, todo saldrá bien!', 'audio_ko': '오늘 하루도 파이팅, 다 잘 풀릴 거예요!'}],
        }}
      />

      {/* ── [FirstMotion 화요일 출근길 3-in-1 쇼츠: [화요일 출근길 필수 영어]] ── */}
      <Composition
        id="PostMotionTue3in1EN"
        component={PostMotion3in1Template}
        durationInFrames={657}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[화요일 출근길 필수 영어]",
          badgeColor: "#2563eb",
          badgeBg: "#eff6ff",
          title: "화요일 출근길 필수 영어 3문장 🇺🇸 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 97, 'flipEndFrame': 97, 'endFrame': 239}, {'startFrame': 239, 'flipStartFrame': 307, 'flipEndFrame': 307, 'endFrame': 442}, {'startFrame': 442, 'flipStartFrame': 524, 'flipEndFrame': 524, 'endFrame': 652}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'We survived Monday, on to Tuesday!', 'pronunciation': '[위 서바이브드 먼데이, 온 투 튜즈데이!]', 'meaning': '월요일 잘 넘겼으니, 화요일도 가보자고요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• on to ~: '~로 넘어가다, 다음 단계로 가다'<br />• survive: 힘든 고비를 넘기다", 'audio_lang': 'We survived Monday, on to Tuesday!', 'audio_ko': '월요일 잘 넘겼으니, 화요일도 가보자고요!'}, {'indexBadge': '2 / 3', 'primaryText': 'Getting into my rhythm today.', 'pronunciation': '[게팅 인투 마이 리듬 투데이.]', 'meaning': '오늘 하루 내 페이스대로 슬슬 시동 거는 중!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• get into rhythm: '업무나 생활의 페이스를 찾다'<br />• rhythm: 일상의 박자, 흐름", 'audio_lang': 'Getting into my rhythm today.', 'audio_ko': '오늘 하루 내 페이스대로 슬슬 시동 거는 중!'}, {'indexBadge': '3 / 3', 'primaryText': 'Step by step, making it through.', 'pronunciation': '[스텝 바이 스텝, 메이킹 잇 쓰루.]', 'meaning': '차근차근 하나씩, 오늘도 파이팅!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• make it through: '(어려운 하루를) 무사히 해내다'<br />• step by step: 한 걸음씩 차근차근", 'audio_lang': 'Step by step, making it through.', 'audio_ko': '차근차근 하나씩, 오늘도 파이팅!'}],
        }}
      />

      {/* ── [FirstMotion 화요일 출근길 3-in-1 쇼츠: [화요일 출근길 필수 일본어]] ── */}
      <Composition
        id="PostMotionTue3in1JA"
        component={PostMotion3in1Template}
        durationInFrames={687}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[화요일 출근길 필수 일본어]",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "화요일 출근길 필수 일본어 3문장 🇯🇵 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 120, 'flipEndFrame': 120, 'endFrame': 262}, {'startFrame': 262, 'flipStartFrame': 349, 'flipEndFrame': 349, 'endFrame': 471}, {'startFrame': 471, 'flipStartFrame': 564, 'flipEndFrame': 564, 'endFrame': 682}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '月曜日を乗り切ったから、今日も大丈夫！', 'pronunciation': '[게츠요-비오 노리킷타카라, 쿄-모 다이죠-부!]', 'meaning': '월요일도 넘겼으니, 오늘 하루도 문제없어요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 乗り切る(のりきる): '어려움을 극복하다, 잘 버티다'<br />• 大丈夫(だいじょうぶ): 괜찮음, 문제없음", 'audio_lang': '月曜日を乗り切ったから、今日も大丈夫！', 'audio_ko': '월요일도 넘겼으니, 오늘 하루도 문제없어요!'}, {'indexBadge': '2 / 3', 'primaryText': 'マイペースでコツコツ進めよう。', 'pronunciation': '[마이페-스데 코츠코츠 스스메요-.]', 'meaning': '내 속도에 맞춰서 차근차근 해봐요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• コツコツ: '꾸준히 한 걸음씩, 차근차근'<br />• マイペース: 자기 페이스대로", 'audio_lang': 'マイペースでコツコツ進めよう。', 'audio_ko': '내 속도에 맞춰서 차근차근 해봐요.'}, {'indexBadge': '3 / 3', 'primaryText': '今日も一日、無理せず行こう！', 'pronunciation': '[쿄-모 이치니치, 무리세즈 이코-!]', 'meaning': '오늘도 무리하지 말고 기운 내봐요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 無理せず(むりせず): '무리하지 않고, 적당히'<br />• 行こう: 가자, 해보자", 'audio_lang': '今日も一日、無理せず行こう！', 'audio_ko': '오늘도 무리하지 말고 기운 내봐요!'}],
        }}
      />

      {/* ── [FirstMotion 화요일 출근길 3-in-1 쇼츠: [화요일 출근길 필수 중국어]] ── */}
      <Composition
        id="PostMotionTue3in1ZH"
        component={PostMotion3in1Template}
        durationInFrames={658}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[화요일 출근길 필수 중국어]",
          badgeColor: "#d97706",
          badgeBg: "#fffbeb",
          title: "화요일 출근길 필수 중국어 3문장 🇨🇳 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 97, 'flipEndFrame': 97, 'endFrame': 241}, {'startFrame': 241, 'flipStartFrame': 320, 'flipEndFrame': 320, 'endFrame': 445}, {'startFrame': 445, 'flipStartFrame': 524, 'flipEndFrame': 524, 'endFrame': 653}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '度过了周一，今天继续加油！', 'pronunciation': '[두궈러 저우이, 진톈 지쉬 자요우!]', 'meaning': '월요일 잘 넘겼으니, 오늘도 계속 힘내봐요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 度过(dùguò): '(힘든 시간을) 넘기다, 보내다'<br />• 继续加油: 계속 파이팅하다", 'audio_lang': '度过了周一，今天继续加油！', 'audio_ko': '월요일 잘 넘겼으니, 오늘도 계속 힘내봐요!'}, {'indexBadge': '2 / 3', 'primaryText': '按自己的节奏，一步步来。', 'pronunciation': '[안 쯔지 더 지에저우, 이부부 라이.]', 'meaning': '내 속도에 맞춰서 차근차근 하나씩!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 节奏(jiézòu): '생활이나 일의 리듬, 페이스'<br />• 一步步来: 한 걸음씩 천천히 하다", 'audio_lang': '按自己的节奏，一步步来。', 'audio_ko': '내 속도에 맞춰서 차근차근 하나씩!'}, {'indexBadge': '3 / 3', 'primaryText': '新的一天，保持好心情！', 'pronunciation': '[신 더 이 톈, 바오츠 하오 신칭!]', 'meaning': '새로운 하루, 기분 좋은 마음으로 출발!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 保持(bǎochí): '유지하다, 지키다'<br />• 好心情: 좋은 기분/컨디션", 'audio_lang': '新的一天，保持好心情！', 'audio_ko': '새로운 하루, 기분 좋은 마음으로 출발!'}],
        }}
      />

      {/* ── [FirstMotion 화요일 출근길 3-in-1 쇼츠: [화요일 출근길 필수 인니어]] ── */}
      <Composition
        id="PostMotionTue3in1ID"
        component={PostMotion3in1Template}
        durationInFrames={754}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[화요일 출근길 필수 인니어]",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "화요일 출근길 필수 인니어 3문장 🇮🇩 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 114, 'flipEndFrame': 114, 'endFrame': 249}, {'startFrame': 249, 'flipStartFrame': 353, 'flipEndFrame': 353, 'endFrame': 489}, {'startFrame': 489, 'flipStartFrame': 604, 'flipEndFrame': 604, 'endFrame': 749}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Senin lewat, Selasa pasti bisa!', 'pronunciation': '[스닌 레왓, 슬라사 파스티 비사!]', 'meaning': '월요일 지났으니, 화요일도 문제없어요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• lewat: '(시간이나 날이) 지나다, 넘기다'<br />• pasti bisa: 분명 해낼 수 있다 (파이팅)", 'audio_lang': 'Senin lewat, Selasa pasti bisa!', 'audio_ko': '월요일 지났으니, 화요일도 문제없어요!'}, {'indexBadge': '2 / 3', 'primaryText': 'Pelan-pelan atur ritme kerja hari ini.', 'pronunciation': '[플란플란 아투르 리트메 크르자 하리 이니.]', 'meaning': '오늘 하루 일의 페이스를 차근차근 맞추는 중!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• pelan-pelan: '차근차근, 천천히 (step by step)'<br />• atur ritme: 페이스/리듬을 조절하다", 'audio_lang': 'Pelan-pelan atur ritme kerja hari ini.', 'audio_ko': '오늘 하루 일의 페이스를 차근차근 맞추는 중!'}, {'indexBadge': '3 / 3', 'primaryText': 'Semangat ya, semoga lancar semuanya!', 'pronunciation': '[스망앗 야, 스모가 란차르 스무아냐!]', 'meaning': '기운 내요, 오늘도 모든 일이 술술 풀리길!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• lancar: '(일이) 막힘없이 순조롭다, 술술 풀리다'<br />• semuanya: 모든 일, 전부", 'audio_lang': 'Semangat ya, semoga lancar semuanya!', 'audio_ko': '기운 내요, 오늘도 모든 일이 술술 풀리길!'}],
        }}
      />
    

      <Composition
        id="KoreanLoopShortsBongtu"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Korean Convenience Store]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "The #1 Question at Korean Convenience Stores 🏪 #Shorts",
          tagText: "STORE SURVIVAL",
          korean: "봉투 필요하세요?",
          romanization: "[Bong-tu pil-yo-ha-se-yo?]",
          english: "Do you need a plastic bag?",
          nuanceTitle: "Convenience Store Habit",
          nuanceDesc: "Say '네, 주세요' (Yes please) or '괜찮아요' (No thanks). Plastic bags cost 100 won in Korea!",
          audioFile: "audio_shorts_bongtu.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsGrill"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-BBQ Dining]",
          categoryColor: "#dc2626",
          categoryBg: "#fef2f2",
          title: "Must-Know Phrase at Korean BBQ 🥩 #Shorts",
          tagText: "K-BBQ ETIQUETTE",
          korean: "불판 좀 갈아주세요!",
          romanization: "[Bul-pan jom ga-ra-ju-se-yo!]",
          english: "Could you change the grill plate, please?",
          nuanceTitle: "K-BBQ Pro Etiquette",
          nuanceDesc: "Koreans change the grill mesh frequently to keep meat from scorching. Don't be shy to ask!",
          audioFile: "audio_shorts_grill.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsDropOff"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Seoul Taxi Survival]",
          categoryColor: "#d97706",
          categoryBg: "#fffbeb",
          title: "How to Stop a Taxi in Seoul Like a Local 🚕 #Shorts",
          tagText: "TAXI SURVIVAL",
          korean: "여기서 내려주세요!",
          romanization: "[Yeo-gi-seo nae-ryeo-ju-se-yo!]",
          english: "Please drop me off right here!",
          nuanceTitle: "Taxi Drop-off Magic",
          nuanceDesc: "Say this clearly when you see your subway exit or hotel! Taxis will pull over safely.",
          audioFile: "audio_shorts_dropoff.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsMaepjjiri"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[K-Food Slang]",
          categoryColor: "#e11d48",
          categoryBg: "#ffe4e6",
          title: "Korea's Cutest Slang for Spice Beginners 🌶️ #Shorts",
          tagText: "SPICE SLANG",
          korean: "저 맵찔이예요!",
          romanization: "[Jeo maep-jji-ri-ye-yo!]",
          english: "I'm totally a spice wimp!",
          nuanceTitle: "The 'Maep-jjiri' Confession",
          nuanceDesc: "'Maep-jjiri' is the hilarious modern slang for someone who can't handle spicy food. Servers will kindly tone it down!",
          audioFile: "audio_shorts_maepjjiri.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsDelicious"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Friendship & Dining]",
          categoryColor: "#16a34a",
          categoryBg: "#f0fdf4",
          title: "The Best Invitation You Can Hear in Korea 🍜 #Shorts",
          tagText: "DELICIOUS PLANS",
          korean: "맛있는 거 먹으러 가자!",
          romanization: "[Ma-sin-neun geo meo-geu-reo ga-ja!]",
          english: "Let's go eat something super delicious!",
          nuanceTitle: "Ultimate Friendship Call",
          nuanceDesc: "The happiest sentence in Korean culture! Always reply with a cheerful '좋아! 가자!' (Sounds great, let's go)!",
          audioFile: "audio_shorts_delicious.wav",
        }}
      />

      {/* ── [FirstMotion 수요일 출근길 3-in-1 쇼츠: [수요일 출근길 필수 영어]] ── */}
      <Composition
        id="PostMotionWed3in1EN"
        component={PostMotion3in1Template}
        durationInFrames={676}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[수요일 출근길 필수 영어]",
          badgeColor: "#2563eb",
          badgeBg: "#eff6ff",
          title: "수요일 출근길 필수 영어 3문장 🇺🇸 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 94, 'flipEndFrame': 94, 'endFrame': 228}, {'startFrame': 228, 'flipStartFrame': 317, 'flipEndFrame': 317, 'endFrame': 457}, {'startFrame': 457, 'flipStartFrame': 539, 'flipEndFrame': 539, 'endFrame': 671}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': "Happy Wednesday, we're halfway there!", 'pronunciation': '[해피 웬즈데이, 위얼 해프웨이 데어!]', 'meaning': '벌써 수요일, 이번 주도 딱 반 왔어요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• halfway there: '(일정의) 절반쯤 와 있는'<br />• Happy Wednesday: 기분 좋은 수요일 인사", 'audio_lang': "Happy Wednesday, we're halfway there!", 'audio_ko': '벌써 수요일, 이번 주도 딱 반 왔어요!'}, {'indexBadge': '2 / 3', 'primaryText': "Almost over the hump, let's keep going.", 'pronunciation': '[올모스트 오버 더 험프, 렛츠 킵 고잉.]', 'meaning': '고비만 넘기면 주말이에요, 계속 힘내봐요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• over the hump: '큰 고비를 넘긴 (수요일 비유)'<br />• keep going: 계속 나아가다", 'audio_lang': "Almost over the hump, let's keep going.", 'audio_ko': '고비만 넘기면 주말이에요, 계속 힘내봐요.'}, {'indexBadge': '3 / 3', 'primaryText': 'Coffee in hand, ready for the day!', 'pronunciation': '[커피 인 핸드, 레디 포 더 데이!]', 'meaning': '커피 한 손에 들고, 오늘 하루도 출발!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': '• coffee in hand: 한 손에 커피를 든 채로<br />• ready for: ~를 맞이할 준비가 된', 'audio_lang': 'Coffee in hand, ready for the day!', 'audio_ko': '커피 한 손에 들고, 오늘 하루도 출발!'}],
        }}
      />

      {/* ── [FirstMotion 수요일 출근길 3-in-1 쇼츠: [수요일 출근길 필수 일본어]] ── */}
      <Composition
        id="PostMotionWed3in1JA"
        component={PostMotion3in1Template}
        durationInFrames={738}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[수요일 출근길 필수 일본어]",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "수요일 출근길 필수 일본어 3문장 🇯🇵 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 138, 'flipEndFrame': 138, 'endFrame': 289}, {'startFrame': 289, 'flipStartFrame': 387, 'flipEndFrame': 387, 'endFrame': 515}, {'startFrame': 515, 'flipStartFrame': 615, 'flipEndFrame': 615, 'endFrame': 733}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '水曜日！今週もあと半分ですね。', 'pronunciation': '[스이요-비! 콘슈-모 아토 한분데스네.]', 'meaning': '수요일! 이번 주도 이제 반 남았네요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': '• 水曜日(すいようび): 수요일<br />• あと半分(はんぶん): 이제 절반', 'audio_lang': '水曜日！今週もあと半分ですね。', 'audio_ko': '수요일! 이번 주도 이제 반 남았네요.'}, {'indexBadge': '2 / 3', 'primaryText': '週の折り返し、もうひと踏ん張り！', 'pronunciation': '[슈-노 오리카에시, 모- 히토훈바리!]', 'meaning': '주중 반환점, 조금만 더 힘내봐요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 折り返し(おりかえし): '반환점, 반환 코스'<br />• もうひと踏ん張り: '조금만 더 힘내기'", 'audio_lang': '週の折り返し、もうひと踏ん張り！', 'audio_ko': '주중 반환점, 조금만 더 힘내봐요!'}, {'indexBadge': '3 / 3', 'primaryText': 'コーヒー飲んで、今日も頑張りましょう！', 'pronunciation': '[코-히- 논데, 쿄-모 감바리마쇼-!]', 'meaning': '커피 마시고 오늘도 기운 내봐요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': '• 頑張る(がんばる): 힘내다, 최선을 다하다<br />• 飲む(のむ): 마시다', 'audio_lang': 'コーヒー飲んで、今日も頑張りましょう！', 'audio_ko': '커피 마시고 오늘도 기운 내봐요!'}],
        }}
      />

      {/* ── [FirstMotion 수요일 출근길 3-in-1 쇼츠: [수요일 출근길 필수 스페인어]] ── */}
      <Composition
        id="PostMotionWed3in1ES"
        component={PostMotion3in1Template}
        durationInFrames={697}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[수요일 출근길 필수 스페인어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "수요일 출근길 필수 스페인어 3문장 🇪🇸 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 99, 'flipEndFrame': 99, 'endFrame': 231}, {'startFrame': 231, 'flipStartFrame': 318, 'flipEndFrame': 318, 'endFrame': 454}, {'startFrame': 454, 'flipStartFrame': 551, 'flipEndFrame': 551, 'endFrame': 692}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '¡Mitad de semana, ya falta menos!', 'pronunciation': '[미타드 데 세마나, 야 팔타 메노스!]', 'meaning': '벌써 수요일, 이제 며칠 안 남았어요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• mitad de semana: 주중 절반 (수요일)<br />• ya falta menos: '얼마 안 남았다, 고지가 눈앞이다'", 'audio_lang': '¡Mitad de semana, ya falta menos!', 'audio_ko': '벌써 수요일, 이제 며칠 안 남았어요!'}, {'indexBadge': '2 / 3', 'primaryText': 'Tomando fuerza para terminar la semana.', 'pronunciation': '[토만도 푸에르사 파라 테르미나르 라 세마나.]', 'meaning': '이번 주 잘 마무리하려고 기운 내는 중이에요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': '• tomar fuerza: 힘/기운을 내다<br />• terminar: 마무리하다, 끝마치다', 'audio_lang': 'Tomando fuerza para terminar la semana.', 'audio_ko': '이번 주 잘 마무리하려고 기운 내는 중이에요.'}, {'indexBadge': '3 / 3', 'primaryText': '¡Un café bien cargado y a por el miércoles!', 'pronunciation': '[운 카페 비엔 카르가도 이 아 포르 엘 미에르콜레스!]', 'meaning': '진한 커피 한 잔 마시고, 수요일도 파이팅!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• café bien cargado: '진한 커피 (샷 추가 느낌)'<br />• ¡a por ~!: ~를 향해 힘차게 가자!", 'audio_lang': '¡Un café bien cargado y a por el miércoles!', 'audio_ko': '진한 커피 한 잔 마시고, 수요일도 파이팅!'}],
        }}
      />

      {/* ── [FirstMotion 수요일 출근길 3-in-1 쇼츠: [수요일 출근길 필수 중국어]] ── */}
      <Composition
        id="PostMotionWed3in1ZH"
        component={PostMotion3in1Template}
        durationInFrames={688}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[수요일 출근길 필수 중국어]",
          badgeColor: "#d97706",
          badgeBg: "#fffbeb",
          title: "수요일 출근길 필수 중국어 3문장 🇨🇳 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 97, 'flipEndFrame': 97, 'endFrame': 244}, {'startFrame': 244, 'flipStartFrame': 330, 'flipEndFrame': 330, 'endFrame': 462}, {'startFrame': 462, 'flipStartFrame': 545, 'flipEndFrame': 545, 'endFrame': 683}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': '周三了，这周已经过半啦！', 'pronunciation': '[저우산러, 저 저우 이징 궈반 라!]', 'meaning': '벌써 수요일, 이번 주도 벌써 반이나 지났네요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 周三(zhōusān): 수요일<br />• 过半(guòbàn): '절반을 넘다, 반이 지나다'", 'audio_lang': '周三了，这周已经过半啦！', 'audio_ko': '벌써 수요일, 이번 주도 벌써 반이나 지났네요!'}, {'indexBadge': '2 / 3', 'primaryText': '度过分水岭，周末就不远了。', 'pronunciation': '[두궈 펀슈이링, 저우모 지우 부 위안 러.]', 'meaning': '고비만 넘기면 주말도 멀지 않았어요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 分水岭(fēnshuǐlǐng): '분수령, 주중의 전환점/고비'<br />• 周末(zhōumò): 주말", 'audio_lang': '度过分水岭，周末就不远了。', 'audio_ko': '고비만 넘기면 주말도 멀지 않았어요.'}, {'indexBadge': '3 / 3', 'primaryText': '喝杯咖啡，给今天充充电！', 'pronunciation': '[허 베이 카페이, 게이 진톈 충충디엔!]', 'meaning': '커피 한 잔 마시고, 오늘도 에너지 충전!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• 充电(chōngdiàn): '기운을 북돋우다, 에너지를 충전하다'<br />• 喝杯咖啡: 커피 한 잔 마시다", 'audio_lang': '喝杯咖啡，给今天充充电！', 'audio_ko': '커피 한 잔 마시고, 오늘도 에너지 충전!'}],
        }}
      />

      {/* ── [FirstMotion 수요일 출근길 3-in-1 쇼츠: [수요일 출근길 필수 인니어]] ── */}
      <Composition
        id="PostMotionWed3in1ID"
        component={PostMotion3in1Template}
        durationInFrames={691}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[수요일 출근길 필수 인니어]",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "수요일 출근길 필수 인니어 3문장 🇮🇩 #Shorts",
          cardTimings: [{'startFrame': 10, 'flipStartFrame': 115, 'flipEndFrame': 115, 'endFrame': 249}, {'startFrame': 249, 'flipStartFrame': 346, 'flipEndFrame': 346, 'endFrame': 454}, {'startFrame': 454, 'flipStartFrame': 559, 'flipEndFrame': 559, 'endFrame': 686}],
          cards: [{'indexBadge': '1 / 3', 'primaryText': 'Rabu tiba, sudah setengah jalan!', 'pronunciation': '[라부 티바, 수다 스틍아 잘란!]', 'meaning': '수요일 도착, 벌써 절반이나 왔어요!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• setengah jalan: '반쯤 온, 일정의 절반 (halfway)'<br />• tiba: 도착하다, 다다르다", 'audio_lang': 'Rabu tiba, sudah setengah jalan!', 'audio_ko': '수요일 도착, 벌써 절반이나 왔어요!'}, {'indexBadge': '2 / 3', 'primaryText': 'Sedikit lagi sampai akhir pekan.', 'pronunciation': '[스디킷 라기 삼파이 아키르 프칸.]', 'meaning': '조금만 더 힘내면 주말이에요.', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• akhir pekan: '주말 (weekend)'<br />• sedikit lagi: 조금만 더", 'audio_lang': 'Sedikit lagi sampai akhir pekan.', 'audio_ko': '조금만 더 힘내면 주말이에요.'}, {'indexBadge': '3 / 3', 'primaryText': 'Ngopi dulu yuk, biar makin semangat!', 'pronunciation': '[응오피 둘루 육, 비아르 마킨 스망앗!]', 'meaning': '커피 한잔하고 오늘도 더 활기차게!', 'backSubtitle': '핵심 어휘 & 표현', 'backMainQuote': "• ngopi: '커피 마시다 (실생활 일상 구어)'<br />• makin semangat: 더 힘차게/활력 있게", 'audio_lang': 'Ngopi dulu yuk, biar makin semangat!', 'audio_ko': '커피 한잔하고 오늘도 더 활기차게!'}],
        }}
      />
    

      <Composition
        id="KoreanLoopShortsDaebak"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Universal K-Reaction]",
          categoryColor: "#e11d48",
          categoryBg: "#ffe4e6",
          title: "The #1 Exclamation Every Korean Shouts When Shocked 🤯 #Shorts",
          tagText: "K-REACTION",
          korean: "진짜 대박이다!",
          romanization: "[Jin-jja dae-ba-gi-da!]",
          english: "That's totally epic! What a jackpot!",
          nuanceTitle: "The 'Daebak' Jackpot",
          nuanceDesc: "'Daebak' (대박) is Korea's most iconic exclamation for shocking good luck, amazing food, or epic news!",
          audioFile: "audio_shorts_daebak.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsStyle"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Compliment & Romance]",
          categoryColor: "#4f46e5",
          categoryBg: "#e0e7ff",
          title: "How to Say 'Totally My Type' in Korean Like a Local ✨ #Shorts",
          tagText: "MY STYLE",
          korean: "완전 내 스타일이야!",
          romanization: "[Wan-jeon nae seu-ta-i-ri-ya!]",
          english: "That's totally my style! So my type!",
          nuanceTitle: "Aesthetic & Charm Flex",
          nuanceDesc: "Used for fashionable outfits, aesthetic Seongsu cafes, catchy K-pop songs, or your crush!",
          audioFile: "audio_shorts_style.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsContact"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Warm Friendly Goodbye]",
          categoryColor: "#059669",
          categoryBg: "#ecfdf5",
          title: "The Sweetest Way Koreans Say Goodbye After Hanging Out 💬 #Shorts",
          tagText: "FRIENDLY GOODBYE",
          korean: "집에 가서 연락해!",
          romanization: "[Ji-be ga-seo yeol-la-kae!]",
          english: "Text me when you get home safely!",
          nuanceTitle: "The Safe Arrival Check",
          nuanceDesc: "The warmest way Koreans show caring affection after a night out. Shows you reached home safe!",
          audioFile: "audio_shorts_contact.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsSimkung"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Heart-Flutter Slang]",
          categoryColor: "#db2777",
          categoryBg: "#fdf2f8",
          title: "Korea's #1 Slang for When Your Heart Skips a Beat 💓 #Shorts",
          tagText: "HEART FLUTTER",
          korean: "방금 심쿵했잖아!",
          romanization: "[Bang-geum sim-kung-haet-ja-na!]",
          english: "My heart just skipped a beat!",
          nuanceTitle: "The 'Sim-kung' Thud",
          nuanceDesc: "'Sim-kung' combines 'Simjang' (heart) + 'Kung' (thud)! Used when a sweet gesture melts your heart.",
          audioFile: "audio_shorts_simkung.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsSsolge"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Generous K-Treat]",
          categoryColor: "#d97706",
          categoryBg: "#fffbeb",
          title: "How Koreans Say 'Coffee is on Me' Like a Cool Friend ☕ #Shorts",
          tagText: "TREATING FRIENDS",
          korean: "오늘 커피 내가 쏠게!",
          romanization: "[O-neul keo-pi nae-ga ssol-ge!]",
          english: "Coffee is on me today! I am treating!",
          nuanceTitle: "Shooting the Bill",
          nuanceDesc: "'Ssoda' (쏠게) literally means 'to shoot'—firing off your wallet to treat close friends proudly!",
          audioFile: "audio_shorts_ssolge.wav",
        }}
      />

      {/* ── [FirstMotion 목요일 출근길 3-in-1 쇼츠: [목요일 출근길 필수 영어]] ── */}
      <Composition
        id="PostMotionThuCommute3in1EN"
        component={PostMotion3in1Template}
        durationInFrames={662}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[목요일 출근길 필수 영어]",
          badgeColor: "#2563eb",
          badgeBg: "#eff6ff",
          title: "목요일 출근길 필수 영어 3문장 🇺🇸 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 110, "flipEndFrame": 110, "endFrame": 238}, {"startFrame": 238, "flipStartFrame": 333, "flipEndFrame": 333, "endFrame": 480}, {"startFrame": 480, "flipStartFrame": 549, "flipEndFrame": 549, "endFrame": 657}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "It's Thursday, Friday is just around the corner!", "pronunciation": "[잇츠 서스데이, 프라이데이 이즈 저스트 어라운드 더 코너!]", "meaning": "벌써 목요일, 금요일이 코앞이에요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• just around the corner: '(시간/장소가) 코앞에, 바로 가까이에'<br />• It's Thursday: 벌써 목요일이네요", "audio_lang": "It's Thursday, Friday is just around the corner!", "audio_ko": "벌써 목요일, 금요일이 코앞이에요!"}, {"indexBadge": "2 / 3", "primaryText": "One more day until the weekend, hang in there!", "pronunciation": "[원 모어 데이 언틸 더 위켄드, 행 인 데어!]", "meaning": "주말까지 딱 하루 남았어요, 조금만 버텨봐요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• hang in there: '조금만 버티다, 꿋꿋이 견디다'<br />• one more day: 하루만 더", "audio_lang": "One more day until the weekend, hang in there!", "audio_ko": "주말까지 딱 하루 남았어요, 조금만 버텨봐요!"}, {"indexBadge": "3 / 3", "primaryText": "Let's finish the week strong!", "pronunciation": "[렛츠 피니시 더 위크 스트롱!]", "meaning": "이번 주도 멋지게 마무리해 봐요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• finish strong: '(마지막까지) 힘차게 잘 마무리하다'<br />• week: 한 주, 주간", "audio_lang": "Let's finish the week strong!", "audio_ko": "이번 주도 멋지게 마무리해 봐요!"}],
        }}
      />

      {/* ── [FirstMotion 목요일 출근길 3-in-1 쇼츠: [목요일 출근길 필수 일본어]] ── */}
      <Composition
        id="PostMotionThuCommute3in1JA"
        component={PostMotion3in1Template}
        durationInFrames={762}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[목요일 출근길 필수 일본어]",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "목요일 출근길 필수 일본어 3문장 🇯🇵 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 140, "flipEndFrame": 140, "endFrame": 296}, {"startFrame": 296, "flipStartFrame": 404, "flipEndFrame": 404, "endFrame": 536}, {"startFrame": 536, "flipStartFrame": 637, "flipEndFrame": 637, "endFrame": 757}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "木曜日！明日はもう金曜日ですね。", "pronunciation": "[모쿠요-비! 아시타와 모- 킨요-비데스네.]", "meaning": "목요일! 내일이면 벌써 금요일이네요.", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 木曜日(もくようび): 목요일<br />• 明日(あした): 내일<br />• もう: 벌써, 이미", "audio_lang": "木曜日！明日はもう金曜日ですね。", "audio_ko": "목요일! 내일이면 벌써 금요일이네요."}, {"indexBadge": "2 / 3", "primaryText": "週末まであと少し、乗り切りましょう！", "pronunciation": "[슈-마츠마데 아토 스코시, 노리키리마쇼-!]", "meaning": "주말까지 이제 조금, 잘 이겨내 봐요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 乗り切る(のりきる): '고비를 잘 넘기다, 극복하다'<br />• あと少し: 조금만 더", "audio_lang": "週末まであと少し、乗り切りましょう！", "audio_ko": "주말까지 이제 조금, 잘 이겨내 봐요!"}, {"indexBadge": "3 / 3", "primaryText": "今日も一日、前向きに頑張ろう！", "pronunciation": "[쿄-모 이치니치, 마에무키니 감바로-!]", "meaning": "오늘 하루도 긍정적으로 파이팅!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 前向き(まえむき): '긍정적, 적극적, 진취적 태도'<br />• 一日(いちにち): 하루", "audio_lang": "今日も一日、前向きに頑張ろう！", "audio_ko": "오늘 하루도 긍정적으로 파이팅!"}],
        }}
      />

      {/* ── [FirstMotion 목요일 출근길 3-in-1 쇼츠: [목요일 출근길 필수 스페인어]] ── */}
      <Composition
        id="PostMotionThuCommute3in1ES"
        component={PostMotion3in1Template}
        durationInFrames={679}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[목요일 출근길 필수 스페인어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "목요일 출근길 필수 스페인어 3문장 🇪🇸 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 103, "flipEndFrame": 103, "endFrame": 239}, {"startFrame": 239, "flipStartFrame": 331, "flipEndFrame": 331, "endFrame": 445}, {"startFrame": 445, "flipStartFrame": 537, "flipEndFrame": 537, "endFrame": 674}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "¡Ya es jueves, el viernes está a la vuelta!", "pronunciation": "[야 에스 후에베스, 엘 비에르네스 에스타 아 라 부엘타!]", "meaning": "벌써 목요일, 금요일이 바로 코앞이에요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• a la vuelta de la esquina: '(시간/장소가) 코앞에, 바로 가까이에'<br />• ya es jueves: 벌써 목요일이다", "audio_lang": "¡Ya es jueves, el viernes está a la vuelta!", "audio_ko": "벌써 목요일, 금요일이 바로 코앞이에요!"}, {"indexBadge": "2 / 3", "primaryText": "¡Un último empujón antes del fin de semana!", "pronunciation": "[운 울티모 엠푸혼 안테스 델 핀 데 세마나!]", "meaning": "주말 전 마지막 스퍼트를 내봐요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• último empujón: '마지막 스퍼트, 막판에 힘을 내기'<br />• fin de semana: 주말", "audio_lang": "¡Un último empujón antes del fin de semana!", "audio_ko": "주말 전 마지막 스퍼트를 내봐요!"}, {"indexBadge": "3 / 3", "primaryText": "¡Ánimo, que ya casi terminamos la semana!", "pronunciation": "[아니모, 케 야 카시 테르미나모스 라 세마나!]", "meaning": "힘내요, 이번 주도 거의 다 끝나가요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• ¡Ánimo!: 힘내라, 파이팅!<br />• ya casi: '이제 거의, 다 되어가는'", "audio_lang": "¡Ánimo, que ya casi terminamos la semana!", "audio_ko": "힘내요, 이번 주도 거의 다 끝나가요!"}],
        }}
      />

      {/* ── [FirstMotion 목요일 출근길 3-in-1 쇼츠: [목요일 출근길 필수 중국어]] ── */}
      <Composition
        id="PostMotionThuCommute3in1ZH"
        component={PostMotion3in1Template}
        durationInFrames={687}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[목요일 출근길 필수 중국어]",
          badgeColor: "#d97706",
          badgeBg: "#fffbeb",
          title: "목요일 출근길 필수 중국어 3문장 🇨🇳 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 90, "flipEndFrame": 90, "endFrame": 228}, {"startFrame": 228, "flipStartFrame": 317, "flipEndFrame": 317, "endFrame": 443}, {"startFrame": 443, "flipStartFrame": 535, "flipEndFrame": 535, "endFrame": 682}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "周四了，明天就是周五啦！", "pronunciation": "[저우스러, 밍톈 지우 스 저우우 라!]", "meaning": "목요일이에요, 내일이면 바로 금요일이죠!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 周四(zhōusì): 목요일<br />• 明天(míngtiān): 내일<br />• 就是: 바로 ~이다", "audio_lang": "周四了，明天就是周五啦！", "audio_ko": "목요일이에요, 내일이면 바로 금요일이죠!"}, {"indexBadge": "2 / 3", "primaryText": "再坚持一天，周末马上就到。", "pronunciation": "[짜이 지엔츠 이 톈, 저우모 마상 지우 다오.]", "meaning": "하루만 더 버티면 주말이 금방 와요.", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 坚持(jiānchí): 버티다, 견디다<br />• 马上(mǎshàng): 곧, 바로, 즉시", "audio_lang": "再坚持一天，周末马上就到。", "audio_ko": "하루만 더 버티면 주말이 금방 와요."}, {"indexBadge": "3 / 3", "primaryText": "打起精神，今天也要元气满满！", "pronunciation": "[다 치 징선, 진톈 예 야오 위안치 만만!]", "meaning": "정신 바짝 차리고, 오늘도 활력 충만하게!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 打起精神(dǎ qǐ jīngshén): 기운을 차리다, 정신을 바짝 차리다<br />• 元气满满: 활력과 에너지가 가득한", "audio_lang": "打起精神，今天也要元气满满！", "audio_ko": "정신 바짝 차리고, 오늘도 활력 충만하게!"}],
        }}
      />

      {/* ── [FirstMotion 목요일 출근길 3-in-1 쇼츠: [목요일 출근길 필수 인니어]] ── */}
      <Composition
        id="PostMotionThuCommute3in1ID"
        component={PostMotion3in1Template}
        durationInFrames={723}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[목요일 출근길 필수 인니어]",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "목요일 출근길 필수 인니어 3문장 🇮🇩 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 112, "flipEndFrame": 112, "endFrame": 254}, {"startFrame": 254, "flipStartFrame": 369, "flipEndFrame": 369, "endFrame": 488}, {"startFrame": 488, "flipStartFrame": 585, "flipEndFrame": 585, "endFrame": 718}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "Sudah Kamis, besok sudah Jumat!", "pronunciation": "[수다 카미스, 베속 수다 주맛!]", "meaning": "벌써 목요일, 내일이면 벌써 금요일이에요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• Kamis: 목요일<br />• Jumat: 금요일<br />• besok: 내일", "audio_lang": "Sudah Kamis, besok sudah Jumat!", "audio_ko": "벌써 목요일, 내일이면 벌써 금요일이에요!"}, {"indexBadge": "2 / 3", "primaryText": "Tinggal satu hari lagi menuju akhir pekan.", "pronunciation": "[팅갈 사투 하리 라기 머누주 악히르 뻐칸.]", "meaning": "주말까지 이제 딱 하루 남았어요.", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• tinggal satu hari lagi: '딱 하루 남았다'<br />• akhir pekan: 주말", "audio_lang": "Tinggal satu hari lagi menuju akhir pekan.", "audio_ko": "주말까지 이제 딱 하루 남았어요."}, {"indexBadge": "3 / 3", "primaryText": "Tetap semangat dan tuntaskan hari ini!", "pronunciation": "[뜨탑 스망앗 단 툰타스칸 하리 이니!]", "meaning": "계속 힘내서 오늘 하루도 멋지게 끝내봐요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• tetap semangat: '계속 힘내다, 파이팅을 유지하다'<br />• tuntaskan: 말끔히 끝내다, 완수하다", "audio_lang": "Tetap semangat dan tuntaskan hari ini!", "audio_ko": "계속 힘내서 오늘 하루도 멋지게 끝내봐요!"}],
        }}
      />
    

      <Composition
        id="KoreanLoopShortsBulgeum"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Weekend Anticipation]",
          categoryColor: "#e11d48",
          categoryBg: "#ffe4e6",
          title: "What Koreans Ask Right Before Friday Night 🔥 #Shorts",
          tagText: "BURNING FRIDAY",
          korean: "불금에 뭐해?",
          romanization: "[Bul-geu-me mwo-hae?]",
          english: "Any plans for Burning Friday night?",
          nuanceTitle: "The 'Bul-geum' Hype",
          nuanceDesc: "'Bul-geum' (불금) is short for 'Burning Friday'—the universal Korean equivalent of TGIF!",
          audioFile: "audio_shorts_bulgeum.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsJjaejinda"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Pure Joy & Euphoria]",
          categoryColor: "#4f46e5",
          categoryBg: "#e0e7ff",
          title: "Korea's Most Expressive Slang for 'I'm on Cloud Nine!' 🎉 #Shorts",
          tagText: "PURE EUPHORIA",
          korean: "오늘 기분 째진다!",
          romanization: "[O-neul gi-bun jjae-jin-da!]",
          english: "I'm on cloud nine today! Feeling amazing!",
          nuanceTitle: "Splitting with Joy",
          nuanceDesc: "'Jjaejinda' (째진다) literally means splitting with happiness—the ultimate good mood flex!",
          audioFile: "audio_shorts_jjaejinda.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsKkuljaem"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Entertainment & Fun]",
          categoryColor: "#d97706",
          categoryBg: "#fffbeb",
          title: "How Koreans Describe Something Crazy Fun & Addictive 🍯 #Shorts",
          tagText: "HONEY FUN",
          korean: "이거 완전 꿀잼이야!",
          romanization: "[I-geo wan-jeon kkul-jae-mi-ya!]",
          english: "This is crazy fun! Absolutely hilarious!",
          nuanceTitle: "Honey-Sweet Entertainment",
          nuanceDesc: "'Kkul-jaem' (꿀잼) combines 'Kkul' (Honey) + 'Jaemi' (Fun)—sweet, addictive entertainment!",
          audioFile: "audio_shorts_kkuljaem.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsRecharge"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Weekend Healing]",
          categoryColor: "#059669",
          categoryBg: "#ecfdf5",
          title: "What Every Exhausted Worker Dreams of Saying 🛌 #Shorts",
          tagText: "WEEKEND REST",
          korean: "주말에 푹 쉬어야지!",
          romanization: "[Ju-ma-re puk swi-eo-ya-ji!]",
          english: "I'm definitely resting deeply this weekend!",
          nuanceTitle: "Deep Recharging Sleep",
          nuanceDesc: "'Puk' (푹) means deeply, thoroughly, and peacefully—giving yourself permission to recharge!",
          audioFile: "audio_shorts_recharge.wav",
        }}
      />

      <Composition
        id="KoreanLoopShortsCatchUp"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "[Warm Promise]",
          categoryColor: "#0284c7",
          categoryBg: "#f0f9ff",
          title: "The Most Natural Way to Say 'See You Next Time!' 👋 #Shorts",
          tagText: "FRIENDSHIP PROMISE",
          korean: "다음에 또 보자!",
          romanization: "[Da-eu-me tto bo-ja!]",
          english: "Let's definitely catch up again soon!",
          nuanceTitle: "Promise of Next Meeting",
          nuanceDesc: "Warm, casual closing phrase that keeps the friendship connection alive and smiling!",
          audioFile: "audio_shorts_catchup.wav",
        }}
      />

      {/* ── [FirstMotion 금요일 출근길 3-in-1 쇼츠: [금요일 출근길 필수 영어]] ── */}
      <Composition
        id="PostMotionFriCommute3in1EN"
        component={PostMotion3in1Template}
        durationInFrames={758}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[금요일 출근길 필수 영어]",
          badgeColor: "#2563eb",
          badgeBg: "#eff6ff",
          title: "금요일 출근길 필수 영어 3문장 🇺🇸 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 134, "flipEndFrame": 134, "endFrame": 298}, {"startFrame": 298, "flipStartFrame": 394, "flipEndFrame": 394, "endFrame": 520}, {"startFrame": 520, "flipStartFrame": 611, "flipEndFrame": 611, "endFrame": 753}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "TGIF! We finally made it to Friday!", "pronunciation": "[티지아이에프! 위 파이널리 메이드 잇 투 프라이데이!]", "meaning": "드디어 금요일! 이번 주도 잘 버텨냈어요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• TGIF: 'Thank God It's Friday (신이시여 감사합니다, 금요일입니다)'<br />• make it to: '~에 무사히 도달하다/도착하다'", "audio_lang": "TGIF! We finally made it to Friday!", "audio_ko": "드디어 금요일! 이번 주도 잘 버텨냈어요!"}, {"indexBadge": "2 / 3", "primaryText": "Just power through today, the weekend is here!", "pronunciation": "[저스트 파워 쓰루 투데이, 더 위켄드 이즈 히어!]", "meaning": "오늘 하루만 꾹 버티면 주말 시작이에요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• power through: '어렵고 힘든 일을 뚝심 있게 버텨내다'<br />• the weekend is here: 주말이 왔다", "audio_lang": "Just power through today, the weekend is here!", "audio_ko": "오늘 하루만 꾹 버티면 주말 시작이에요!"}, {"indexBadge": "3 / 3", "primaryText": "Leaving on the dot today, happy weekend!", "pronunciation": "[리빙 온 더 닷 투데이, 해피 위켄드!]", "meaning": "오늘은 무조건 칼퇴, 행복한 주말 보내세요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• on the dot: '정각에 딱 맞춰서(칼같이)'<br />• leave on the dot: 망설임 없이 정시 칼퇴하다", "audio_lang": "Leaving on the dot today, happy weekend!", "audio_ko": "오늘은 무조건 칼퇴, 행복한 주말 보내세요!"}],
        }}
      />

      {/* ── [FirstMotion 금요일 출근길 3-in-1 쇼츠: [금요일 출근길 필수 일본어]] ── */}
      <Composition
        id="PostMotionFriCommute3in1JA"
        component={PostMotion3in1Template}
        durationInFrames={802}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[금요일 출근길 필수 일본어]",
          badgeColor: "#dc2626",
          badgeBg: "#fef2f2",
          title: "금요일 출근길 필수 일본어 3문장 🇯🇵 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 146, "flipEndFrame": 146, "endFrame": 317}, {"startFrame": 317, "flipStartFrame": 431, "flipEndFrame": 431, "endFrame": 561}, {"startFrame": 561, "flipStartFrame": 667, "flipEndFrame": 667, "endFrame": 797}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "やっと金曜日！今週もお疲れ様でした。", "pronunciation": "[얏토 킨요-비! 콘슈-모 오츠카레사마데시타.]", "meaning": "드디어 금요일! 이번 주도 정말 수고 많으셨어요.", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• やっと: '드디어, 마침내, 겨우'<br />• お疲れ様でした(おつかれさまでした): 수고하셨습니다", "audio_lang": "やっと金曜日！今週もお疲れ様でした。", "audio_ko": "드디어 금요일! 이번 주도 정말 수고 많으셨어요."}, {"indexBadge": "2 / 3", "primaryText": "今日一日乗り切れば、楽しい週末です！", "pronunciation": "[쿄- 이치니치 노리키레바, 타노시이 슈-마츠데스!]", "meaning": "오늘 하루만 잘 버티면 즐거운 주말이에요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 乗り切る(のりきる): '고비를 잘 넘기다, 극복하다'<br />• 週末(しゅうまつ): 주말", "audio_lang": "今日一日乗り切れば、楽しい週末です！", "audio_ko": "오늘 하루만 잘 버티면 즐거운 주말이에요!"}, {"indexBadge": "3 / 3", "primaryText": "今日は定時で帰って、ゆっくり休もう！", "pronunciation": "[쿄-와 테-지데 카에테, 육쿠리 야수모-!]", "meaning": "오늘은 정시 칼퇴해서 푹 쉬어야지!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 定時(ていじ): 정시 (정규 근무시간)<br />• ゆっくり休む: 푹 쉬다, 여유롭게 쉬다", "audio_lang": "今日は定時で帰って、ゆっくり休もう！", "audio_ko": "오늘은 정시 칼퇴해서 푹 쉬어야지!"}],
        }}
      />

      {/* ── [FirstMotion 금요일 출근길 3-in-1 쇼츠: [금요일 출근길 필수 스페인어]] ── */}
      <Composition
        id="PostMotionFriCommute3in1ES"
        component={PostMotion3in1Template}
        durationInFrames={667}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[금요일 출근길 필수 스페인어]",
          badgeColor: "#ea580c",
          badgeBg: "#fff7ed",
          title: "금요일 출근길 필수 스페인어 3문장 🇪🇸 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 107, "flipEndFrame": 107, "endFrame": 232}, {"startFrame": 232, "flipStartFrame": 314, "flipEndFrame": 314, "endFrame": 431}, {"startFrame": 431, "flipStartFrame": 525, "flipEndFrame": 525, "endFrame": 662}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "¡Por fin es viernes, llegó el fin de semana!", "pronunciation": "[포르 핀 에스 비에르네스, 예고 엘 핀 데 세마나!]", "meaning": "드디어 금요일, 주말이 찾아왔어요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• por fin: '마침내, 드디어'<br />• fin de semana: 주말 (줄여서 finde)", "audio_lang": "¡Por fin es viernes, llegó el fin de semana!", "audio_ko": "드디어 금요일, 주말이 찾아왔어요!"}, {"indexBadge": "2 / 3", "primaryText": "¡Un esfuerzo más y a descansar!", "pronunciation": "[운 에스푸에르소 마스 이 아 데스칸사르!]", "meaning": "조금만 더 힘내고 이제 푹 쉬어요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• un esfuerzo más: '마지막 한 번의 노력, 조금만 더 힘내기'<br />• descansar: 휴식하다, 쉬다", "audio_lang": "¡Un esfuerzo más y a descansar!", "audio_ko": "조금만 더 힘내고 이제 푹 쉬어요!"}, {"indexBadge": "3 / 3", "primaryText": "¡Hoy salgo puntual sin falta, buen finde!", "pronunciation": "[오이 살고 푼투알 신 팔타, 부엔 핀데!]", "meaning": "오늘은 무조건 칼퇴, 좋은 주말 보내세요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• salir puntual: 정시에 칼퇴하다<br />• sin falta: 틀림없이, 반드시", "audio_lang": "¡Hoy salgo puntual sin falta, buen finde!", "audio_ko": "오늘은 무조건 칼퇴, 좋은 주말 보내세요!"}],
        }}
      />

      {/* ── [FirstMotion 금요일 출근길 3-in-1 쇼츠: [금요일 출근길 필수 중국어]] ── */}
      <Composition
        id="PostMotionFriCommute3in1ZH"
        component={PostMotion3in1Template}
        durationInFrames={712}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[금요일 출근길 필수 중국어]",
          badgeColor: "#d97706",
          badgeBg: "#fffbeb",
          title: "금요일 출근길 필수 중국어 3문장 🇨🇳 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 111, "flipEndFrame": 111, "endFrame": 251}, {"startFrame": 251, "flipStartFrame": 346, "flipEndFrame": 346, "endFrame": 472}, {"startFrame": 472, "flipStartFrame": 556, "flipEndFrame": 556, "endFrame": 707}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "终于周五了，这周大家都辛苦啦！", "pronunciation": "[중위 저우우러, 저 저우 다자 더우 신쿠 라!]", "meaning": "드디어 금요일, 이번 주 다들 수고 많으셨어요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 终于(zhōngyú): '드디어, 마침내'<br />• 辛苦了(xīnkǔ le): 수고하셨습니다", "audio_lang": "终于周五了，这周大家都辛苦啦！", "audio_ko": "드디어 금요일, 이번 주 다들 수고 많으셨어요!"}, {"indexBadge": "2 / 3", "primaryText": "今天再加把劲，马上就能放假了。", "pronunciation": "[진톈 짜이 지아바진, 마상 지우 넝 팡지아 러.]", "meaning": "오늘 조금만 더 힘내면 바로 휴일이에요.", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 加把劲(jiā bǎ jìn): '조금만 더 힘을 내다, 스퍼트를 올리다'<br />• 放假: 쉬다, 휴일/방학을 맞이하다", "audio_lang": "今天再加把劲，马上就能放假了。", "audio_ko": "오늘 조금만 더 힘내면 바로 휴일이에요."}, {"indexBadge": "3 / 3", "primaryText": "今天坚决不加班，准时下班！", "pronunciation": "[진톈 지안쥐에 부 지아반, 준스 시아반!]", "meaning": "오늘은 야근 절대 사절, 무조건 정시 칼퇴!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• 准时下班(zhǔnshí xiàbān): 정시 퇴근하다 (칼퇴)<br />• 坚决(jiānjué): 단호하게, 굳세게", "audio_lang": "今天坚决不加班，准时下班！", "audio_ko": "오늘은 야근 절대 사절, 무조건 정시 칼퇴!"}],
        }}
      />

      {/* ── [FirstMotion 금요일 출근길 3-in-1 쇼츠: [금요일 출근길 필수 인니어]] ── */}
      <Composition
        id="PostMotionFriCommute3in1ID"
        component={PostMotion3in1Template}
        durationInFrames={799}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          badgeText: "[금요일 출근길 필수 인니어]",
          badgeColor: "#059669",
          badgeBg: "#ecfdf5",
          title: "금요일 출근길 필수 인니어 3문장 🇮🇩 #Shorts",
          cardTimings: [{"startFrame": 10, "flipStartFrame": 131, "flipEndFrame": 131, "endFrame": 260}, {"startFrame": 260, "flipStartFrame": 393, "flipEndFrame": 393, "endFrame": 546}, {"startFrame": 546, "flipStartFrame": 669, "flipEndFrame": 669, "endFrame": 794}],
          cards: [{"indexBadge": "1 / 3", "primaryText": "Akhirnya hari Jumat, selamat berakhir pekan!", "pronunciation": "[악히르냐 하리 주맛, 슬라맛 버르악히르 뻐칸!]", "meaning": "드디어 금요일, 행복한 주말 보내세요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• akhirnya: '마침내, 드디어'<br />• selamat berakhir pekan: 좋은 주말 보내세요", "audio_lang": "Akhirnya hari Jumat, selamat berakhir pekan!", "audio_ko": "드디어 금요일, 행복한 주말 보내세요!"}, {"indexBadge": "2 / 3", "primaryText": "Semangat hari ini, liburan sudah di depan mata.", "pronunciation": "[스망앗 하리 이니, 리부란 수다 디 드판 마타.]", "meaning": "오늘도 파이팅, 주말 휴일이 바로 눈앞이에요.", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• di depan mata: '눈앞에 있는, 코앞에 다가온'<br />• liburan: 휴일, 방학", "audio_lang": "Semangat hari ini, liburan sudah di depan mata.", "audio_ko": "오늘도 파이팅, 주말 휴일이 바로 눈앞이에요."}, {"indexBadge": "3 / 3", "primaryText": "Hari ini pulang tepat waktu, mau istirahat!", "pronunciation": "[하리 이니 풀랑 트팟 왁투, 마우 이스티라핫!]", "meaning": "오늘은 정시 칼퇴하고 푹 쉴 거예요!", "backSubtitle": "핵심 어휘 & 표현", "backMainQuote": "• tepat waktu: 정각에, 시간에 딱 맞춰 (칼퇴)<br />• istirahat: 휴식하다, 쉬다", "audio_lang": "Hari ini pulang tepat waktu, mau istirahat!", "audio_ko": "오늘은 정시 칼퇴하고 푹 쉴 거예요!"}],
        }}
      />
    
      <Composition
        id="KoreanLoopShortsHanjan"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: '[Friday Hangout]',
          categoryColor: '#d97706',
          categoryBg: '#fef3c7',
          title: 'How Koreans Ask \'Wanna Grab a Drink Tonight?\' 🍻 #Shorts',
          tagText: 'TGIF DRINKS',
          korean: '오늘 한잔할래?',
          romanization: '[O-neul han-jan-hal-lae?]',
          english: 'Do you want to grab a drink today?',
          nuanceTitle: 'The Friday Magic Phrase',
          nuanceDesc: '\'한잔\' literally means \'one glass,\' but culturally it\'s the warm Korean invitation to hang out, share drinks, and unwind together!',
          audioFile: 'audio_shorts_hanjan.wav',
        }}
      />

      <Composition
        id="KoreanLoopShortsWeekendPlan"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: '[Weekend Plans]',
          categoryColor: '#2563eb',
          categoryBg: '#dbeafe',
          title: 'The #1 Weekend Question Every Korean Asks 💬 #Shorts',
          tagText: 'WEEKEND PLANS',
          korean: '이번 주말에 뭐해?',
          romanization: '[I-beon ju-ma-re mwo-hae?]',
          english: 'What are you up to this weekend?',
          nuanceTitle: 'Casual Connection',
          nuanceDesc: 'The friendliest and most natural way to check someone\'s weekend plans or subtly suggest hanging out!',
          audioFile: 'audio_shorts_weekendplan.wav',
        }}
      />

      <Composition
        id="KoreanLoopShortsBinge"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: '[Weekend Binge]',
          categoryColor: '#7c3aed',
          categoryBg: '#f3e8ff',
          title: 'How Koreans Say \'Binge-Watching All Night!\' 🍿 #Shorts',
          tagText: 'ALL-NIGHT BINGE',
          korean: '오늘 밤새서 볼 거야!',
          romanization: '[O-neul bam-sae-seo bol geo-ya!]',
          english: 'I\'m binge-watching all night tonight!',
          nuanceTitle: 'Friday Night Freedom',
          nuanceDesc: '\'밤새다\' means staying up all night—a glorious Friday declaration for K-Drama lovers knowing there\'s no work tomorrow morning!',
          audioFile: 'audio_shorts_binge.wav',
        }}
      />

      <Composition
        id="KoreanLoopShortsNeutjam"
        component={PostMotionKoreanLoopAllInOne}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: '[Saturday Healing]',
          categoryColor: '#059669',
          categoryBg: '#d1fae5',
          title: 'The Sweetest Saturday Morning Wish in Korea 🛌 #Shorts',
          tagText: 'SLEEPING IN',
          korean: '내일 늦잠 잘 거야!',
          romanization: '[Nae-il neut-jam jal geo-ya!]',
          english: 'I\'m definitely sleeping in tomorrow!',
          nuanceTitle: 'No Alarm Saturday',
          nuanceDesc: '\'늦잠\' means oversleeping or sleeping in. Turning off the 7:00 AM alarm and sleeping in with zero guilt is the ultimate weekend luxury!',
          audioFile: 'audio_shorts_neutjam.wav',
        }}
      />
    </>
  );
};