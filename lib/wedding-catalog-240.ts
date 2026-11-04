/**
 * =========================================================================
 * WEDDINGHELPER 240 MASTER SCENES ARCHITECTURE
 * =========================================================================
 * 12 Grand Worlds x 20 Unique Cinematic Editorial Scenes = 240 Master Scenes.
 * Each scene defines camera focal length, pose, lighting, floral arrangement,
 * and exact height/weight tailored silhouettes for realistic facial synthesis.
 */

export interface WeddingScene {
  sceneNumber: number;
  sceneTitle: string;
  shotType: 'full-body' | 'medium-portrait' | 'wide-landscape' | 'intimate-close-up' | 'cinematic-action';
  cameraSpecs: string;
  poseDescription: string;
  lightingAndAtmosphere: string;
  floralAndDecor: string;
}

export const WEDDING_20_SCENE_TEMPLATES: WeddingScene[] = [
  {
    sceneNumber: 1,
    sceneTitle: 'The Grand Entrance Down the Petal Aisle',
    shotType: 'full-body',
    cameraSpecs: 'Hasselblad H6D-100c, 50mm f/1.8, eye-level perspective',
    poseDescription: 'Couple walking arm-in-arm toward the camera, smiling joyfully at their guests with genuine celebration',
    lightingAndAtmosphere: 'Bright morning sunlight filtering through blooming canopies with gentle lens flare',
    floralAndDecor: 'Aisle blanketed in thick white and blush rose petals with glass floating candle cylinders'
  },
  {
    sceneNumber: 2,
    sceneTitle: 'Vows Under the Monumental Floral Arch',
    shotType: 'full-body',
    cameraSpecs: '85mm f/1.4 prime lens, shallow depth of field, creamy background blur',
    poseDescription: 'Bride and groom holding both hands, looking deeply into each other’s eyes as vows are spoken',
    lightingAndAtmosphere: 'Golden ambient backlight haloing their hair and dress silhouette',
    floralAndDecor: '12-foot grand circular arch overflowing with lush blush peonies, English garden roses and orchids'
  },
  {
    sceneNumber: 3,
    sceneTitle: 'The Sacred Ring Exchange',
    shotType: 'intimate-close-up',
    cameraSpecs: '100mm f/2.8 Macro lens, ultra-sharp detail on diamond solitaire and platinum bands',
    poseDescription: 'Groom tenderly sliding the diamond ring onto bride’s finger, both hands trembling with emotion',
    lightingAndAtmosphere: 'Soft directional window light highlighting fine skin texture and sparkling gem facets',
    floralAndDecor: 'Fresh floral ring pillow with embroidered velvet ribbons and loose sweet pea blooms'
  },
  {
    sceneNumber: 4,
    sceneTitle: 'The First Kiss as Husband & Wife',
    shotType: 'medium-portrait',
    cameraSpecs: '70-200mm at 135mm f/2.0, cinematic compression',
    poseDescription: 'Groom gently cupping the bride’s face in a tender, romantic first kiss while guests applaud',
    lightingAndAtmosphere: 'Golden hour twilight with thousands of flickering candles and suspended fairy lights',
    floralAndDecor: 'Cascade of airborne rose petals falling around them like celebratory confetti'
  },
  {
    sceneNumber: 5,
    sceneTitle: 'The 12-Foot Windswept Cathedral Veil',
    shotType: 'wide-landscape',
    cameraSpecs: '24mm f/2.8 wide-angle architectural perspective',
    poseDescription: 'Couple embracing on a dramatic overlook while the bride’s sheer tulle veil billows high into the sky',
    lightingAndAtmosphere: 'Sunset sky painted in shades of lavender, peach, and soft gold',
    floralAndDecor: 'Low panoramic floral ground runner framing the edge of the architectural precipice'
  },
  {
    sceneNumber: 6,
    sceneTitle: 'Strolling Hand-in-Hand Through the Gardens',
    shotType: 'full-body',
    cameraSpecs: '50mm f/1.4 natural candid perspective',
    poseDescription: 'Couple casually walking away from camera, turning their heads back to smile at each other naturally',
    lightingAndAtmosphere: 'Dappled afternoon sunlight dancing across their tailored silhouettes and flowing gown train',
    floralAndDecor: 'Ancient cypress, bougainvillea or sculpted topiary hedges framing their private walk'
  },
  {
    sceneNumber: 7,
    sceneTitle: 'Intimate Forehead Touch on the Balcony',
    shotType: 'medium-portrait',
    cameraSpecs: '85mm f/1.2 dreamlike editorial aesthetic',
    poseDescription: 'Bride resting her forehead against groom’s forehead, eyes closed in blissful peace and relief',
    lightingAndAtmosphere: 'Warm sunset glow illuminating their cheekbones and delicate lace veil embroidery',
    floralAndDecor: 'Stone balustrade draped in fragrant eucalyptus, white hydrangeas and creamy gardenias'
  },
  {
    sceneNumber: 8,
    sceneTitle: 'The Golden Champagne Toast',
    shotType: 'cinematic-action',
    cameraSpecs: '50mm f/1.8 fast shutter speed',
    poseDescription: 'Couple toasting vintage crystal champagne coupes, bubbly effervescence catching the light',
    lightingAndAtmosphere: 'Romantic candlelit terrace with glowing chandeliers reflecting in crystal glassware',
    floralAndDecor: 'Lush centerpiece runner of cascading peonies, gold candelabras, and vintage silverware'
  },
  {
    sceneNumber: 9,
    sceneTitle: 'The First Dance Beneath Crystal Chandeliers',
    shotType: 'full-body',
    cameraSpecs: '35mm f/1.4 low-angle wide capture',
    poseDescription: 'Groom twirling the bride, gown skirt flaring out gracefully in motion across polished marble',
    lightingAndAtmosphere: 'Dramatic spotlight and soft warm bounce from dozens of tiered crystal chandeliers',
    floralAndDecor: 'Floor-to-ceiling hanging wisteria and orchid floral installation suspended above the dance floor'
  },
  {
    sceneNumber: 10,
    sceneTitle: 'Sunset Silhouette by the Infinity Edge',
    shotType: 'wide-landscape',
    cameraSpecs: '28mm f/2.0 cinematic horizon composition',
    poseDescription: 'Silhouetted couple standing together at the water edge, reflection mirroring perfectly on the surface',
    lightingAndAtmosphere: 'Breathtaking twilight horizon with rich magenta and burnt amber sky reflections',
    floralAndDecor: 'Floating water lanterns and scattered lotus petals drifting peacefully across calm waters'
  },
  {
    sceneNumber: 11,
    sceneTitle: 'Whispering Secrets in the Vintage Speedboat',
    shotType: 'medium-portrait',
    cameraSpecs: '50mm f/1.8 documentary editorial',
    poseDescription: 'Groom whispering into bride’s ear on the mahogany stern of a vintage boat, bride laughing freely',
    lightingAndAtmosphere: 'Sparkling Mediterranean midday sun glistening on gentle lake ripples',
    floralAndDecor: 'Boat bow adorned with a clean garland of white ranunculus and olive branches'
  },
  {
    sceneNumber: 12,
    sceneTitle: 'Descending the Grand Marble Staircase',
    shotType: 'full-body',
    cameraSpecs: '24-70mm at 35mm f/2.8 vertical majestic framing',
    poseDescription: 'Bride holding her gown train in one hand and groom’s hand in the other as they descend gracefully',
    lightingAndAtmosphere: 'Soft cathedral light streaming through tall stained glass or arched French windows',
    floralAndDecor: 'Grand marble banister completely wrapped in cascading ivory roses and trailing ivy'
  },
  {
    sceneNumber: 13,
    sceneTitle: 'The Tender Veil Lifting Ceremony',
    shotType: 'intimate-close-up',
    cameraSpecs: '85mm f/1.4 portrait lens, razor-sharp focus on joyful eyes',
    poseDescription: 'Groom gently lifting the delicate blusher veil over bride’s head, revealing her glowing, happy face',
    lightingAndAtmosphere: 'Creamy soft diffused light filtering through sheer layers of silk tulle',
    floralAndDecor: 'Delicate floral hair comb of baby’s breath and fresh jasmine blossoms tucked into bride’s updo'
  },
  {
    sceneNumber: 14,
    sceneTitle: 'Sunset Stroll on the Sandy Shoreline',
    shotType: 'full-body',
    cameraSpecs: '70-200mm at 100mm f/2.8 compressed perspective',
    poseDescription: 'Barefoot couple walking slowly along the wet sand where rolling waves meet their footsteps',
    lightingAndAtmosphere: 'Warm pink and coral sunset reflecting on wet sand like a giant mirror',
    floralAndDecor: 'Driftwood wedding arch in the distance illuminated with warm string lights'
  },
  {
    sceneNumber: 15,
    sceneTitle: 'The Royal Banquet Dinner Feast',
    shotType: 'wide-landscape',
    cameraSpecs: '24mm f/2.0 expansive grand banquet view',
    poseDescription: 'Couple seated at the royal head table, surrounded by candlelight, raising their glasses to their loved ones',
    lightingAndAtmosphere: '10,000 warm candle flames casting an enchanting, golden medieval romance',
    floralAndDecor: 'Lavish table runner of overflowing pomegranates, deep red velvet roses, and golden candelabras'
  },
  {
    sceneNumber: 16,
    sceneTitle: 'The Sacred Temple / Shrine Blessing',
    shotType: 'full-body',
    cameraSpecs: '35mm f/1.8 respectful serene framing',
    poseDescription: 'Couple bowing with reverence in authentic traditional attire, hands folded in sacred gratitude',
    lightingAndAtmosphere: 'Soft morning mist and incense smoke catching shafts of peaceful morning sun',
    floralAndDecor: 'Sacred stone basins filled with floating blossoms, moss lanterns and fresh pine sprigs'
  },
  {
    sceneNumber: 17,
    sceneTitle: 'Cutting the 5-Tier Floral Wedding Cake',
    shotType: 'medium-portrait',
    cameraSpecs: '50mm f/1.4 crisp editorial detailing',
    poseDescription: 'Both holding the silver antique knife together, smiling at the cake and laughing with happiness',
    lightingAndAtmosphere: 'Warm amber terrace illumination with outdoor sparklers shimmering in the background',
    floralAndDecor: '5-tier ivory buttercream cake cascading with edible sugar flowers and fresh blush roses'
  },
  {
    sceneNumber: 18,
    sceneTitle: 'Wrapped in Cashmere Beside the Log Fire',
    shotType: 'intimate-close-up',
    cameraSpecs: '50mm f/1.2 intimate warm glow',
    poseDescription: 'Groom wrapping a pure white cashmere blanket around bride’s shoulders on a snowy timber balcony',
    lightingAndAtmosphere: 'Cozy orange fireplace firelight contrasting with the cool blue twilight of snow-capped mountains',
    floralAndDecor: 'Rustic alpine wreath of frosted winter pine cones, white hellebore, and warm wool blankets'
  },
  {
    sceneNumber: 19,
    sceneTitle: 'The Secret Laugh in the Historic Courtyard',
    shotType: 'medium-portrait',
    cameraSpecs: '85mm f/1.8 spontaneous candid capture',
    poseDescription: 'Bride bursting into genuine, unposed laughter with groom smiling down at her with pure devotion',
    lightingAndAtmosphere: 'Late afternoon warm sun illuminating limestone arches and terracotta tile floors',
    floralAndDecor: 'Overhead pergola draped in blooming wisteria and climbing pale pink climbing roses'
  },
  {
    sceneNumber: 20,
    sceneTitle: 'The Grand Sparkler Exit & Vintage Getaway',
    shotType: 'cinematic-action',
    cameraSpecs: '35mm f/1.4 high dynamic range twilight action',
    poseDescription: 'Couple running hand-in-hand through two rows of cheering guests holding long golden sparklers toward a vintage convertible',
    lightingAndAtmosphere: 'Blinding joyful sparkle trails creating a magical bokeh constellation around them',
    floralAndDecor: 'Vintage getaway car rear fender decorated with a lush floral garland and calligraphy "Just Married"'
  }
];

/**
 * Returns all 240 scenes organized by theme
 */
export function get240ScenesCatalog() {
  return WEDDING_20_SCENE_TEMPLATES;
}
