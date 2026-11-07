import os
from PIL import Image, ImageFilter
import numpy as np

# ==============================================================================
# 1. STEP 2: TWO AUTHENTIC REAL DRAPING PHOTOS (Emerald Best vs Sage Worst)
# ==============================================================================
print("1. Generating Step 2 Master Draping Photos (Zero Jitter, Zero Flaws)...")
best_drape_en = Image.open('scratch/en_best_drape_315.jpg').convert('RGB')
worst_drape_en = Image.open('scratch/en_worst_drape_315.jpg').convert('RGB')

# English / Global
best_drape_en.save('public/nb_step2_en_best_card.jpg', quality=95)
worst_drape_en.save('public/nb_step2_en_worst_card.jpg', quality=95)

# Japanese & Korean: Use their authentic regional model draping portraits
import shutil
shutil.copy('scratch/test_ja_best.jpg', 'public/nb_step2_ja_best_card.jpg')
shutil.copy('scratch/test_ja_worst.jpg', 'public/nb_step2_ja_worst_card.jpg')
shutil.copy('scratch/test_ko_real_drape_best.jpg', 'public/nb_step2_ko_best_card.jpg')
shutil.copy('scratch/test_ko_real_drape_worst.jpg', 'public/nb_step2_ko_worst_card.jpg')

print("Step 2 assets updated successfully with authentic studio draping portraits!")

# ==============================================================================
# 2. STEP 5: 5 COLOR-MATCHED BEAUTY PORTRAITS PER REGION
# (Matching media_1794031446338_322f7aa5.jpg exact luxury drape aesthetic)
# ==============================================================================
print("2. Generating Step 5 5-Color Beauty Portraits...")

outfit_presets = [
    { 'themeKey': 'orange', 'hex': '#E0834B', 'name': '웜 앰버 오렌지' },
    { 'themeKey': 'brown',  'hex': '#633B26', 'name': '체스트넛 브라운' },
    { 'themeKey': 'khaki',  'hex': '#625D43', 'name': '올리브 카키' },
    { 'themeKey': 'cream',  'hex': '#E9E5A8', 'name': '소프트 버터 옐로우' },
    { 'themeKey': 'green',  'hex': '#3A5335', 'name': '딥 포레스트 그린' }
]

def render_step5_drape(base_img_path, hex_color, start_y=355):
    img = Image.open(base_img_path).convert('RGB')
    w, h = img.size
    arr = np.array(img).astype(float)
    
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)
    
    # Create smooth parabolic chest drape panel
    xs = np.arange(w)[None, :]
    ys = np.arange(h)[:, None]
    norm_x = (xs - w/2.0) / (w/2.0)
    # Gentle scoop contour
    drape_boundary = start_y + 22.0 * (norm_x ** 2)
    
    in_drape = (ys >= drape_boundary).astype(float)
    
    # Smooth Gaussian feather
    mask_im = Image.fromarray((in_drape * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=3.0))
    mask_arr = np.array(mask_im).astype(float)[:, :, None] / 255.0
    
    # Drape fabric color with natural gradient
    lum = (arr[:, :, 0] * 0.299 + arr[:, :, 1] * 0.587 + arr[:, :, 2] * 0.114) / 255.0
    fabric_color = np.array([r, g, b]).astype(float)
    
    # Soft fabric shading (preserves underlying clothing folds)
    blended_fabric = fabric_color * (0.35 + 0.65 * lum[:, :, None])
    
    final_arr = arr * (1.0 - mask_arr * 0.92) + blended_fabric * (mask_arr * 0.92)
    final_arr = np.clip(final_arr, 0, 255).astype(np.uint8)
    return Image.fromarray(final_arr)

# Generate for Korean, Japanese, and English models
models = [
    ('ko', 'scratch/ko_clean_315x445.jpg', 355),
    ('ja', 'scratch/ja_clean_portrait.jpg', 362),
    ('en', 'public/nb_step1_en_clean.jpg', 335),
]

for reg, path, neck_y in models:
    for preset in outfit_presets:
        theme = preset['themeKey']
        color = preset['hex']
        out_im = render_step5_drape(path, color, start_y=neck_y)
        out_im.save(f'public/nb_step5_{reg}_{theme}_card.jpg', quality=95)
        out_im.save(f'public/nb_step5_{reg}_{theme}.jpg', quality=95)
        print(f"Generated public/nb_step5_{reg}_{theme}_card.jpg")

# Fallback outfit
render_step5_drape('scratch/ko_clean_315x445.jpg', '#E9E5A8', start_y=355).save('public/nb_step5_outfit.jpg', quality=95)

print("\nALL STREET PHOTOS COMPLETELY PURGED! STEP 2 & STEP 5 MASTER BEAUTY ASSETS RESTORED!")
