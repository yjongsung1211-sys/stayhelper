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
import { PostMotionStayHelperUniversal, defaultStayHelperProps } from "./PostMotionStayHelperUniversal";
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

      {/* ── [StayHelper 범용 럭셔리 스테이 6-Act 무인 자동화 마스터 릴스 (35초, 1050프레임)] ── */}
      <Composition
        id="PostMotionStayHelperUniversal"
        component={PostMotionStayHelperUniversal}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultStayHelperProps}
      />
    </>
  );
};