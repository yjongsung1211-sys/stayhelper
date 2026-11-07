import os
from PIL import Image

# Exact 5 Distinct Real Fashion Editorial Photos for Step 5
# Each is an authentic, completely different model photo in that exact garment!
editorial_sources = {
    'orange': 'public/images/looks/look_15_hana_fifth_avenue_wrap.jpg',
    'brown': 'public/images/looks/look12_final_editorial.jpg',
    'khaki': 'public/images/looks/look_02_hannam_olive_swing.jpg',
    'cream': 'public/images/looks/look_07_parisian_riviera_minseo.jpg',
    'green': 'public/images/looks/look_10_chaewon_seongsu_vest.jpg'
}

# Step 2 Real Wardrobe Photos:
# Best: Look 10 (Deep Forest Green / Emerald Vest)
# Worst: Look 02 (Olive Swing / Khaki Trench)
step2_sources = {
    'best': 'public/images/looks/look_10_chaewon_seongsu_vest.jpg',
    'worst': 'public/images/looks/look_02_hannam_olive_swing.jpg'
}

def crop_and_resize(src_path, dst_path, target_size=(315, 445), top_ratio=0.08):
    im = Image.open(src_path).convert('RGB')
    w, h = im.size
    target_w, target_h = target_size
    target_aspect = target_w / target_h
    
    # Crop height & width to maintain aspect ratio
    src_aspect = w / h
    if src_aspect > target_aspect:
        # Image is wider than target: fit height, crop width
        new_w = int(h * target_aspect)
        left = (w - new_w) // 2
        top = int(h * top_ratio)
        bottom = top + int(new_w / target_aspect)
        if bottom > h:
            bottom = h
            top = bottom - int(new_w / target_aspect)
        im_cropped = im.crop((left, top, left + new_w, bottom))
    else:
        # Image is taller: fit width, crop height focusing on upper body/face
        new_h = int(w / target_aspect)
        top = int(h * top_ratio)
        bottom = top + new_h
        if bottom > h:
            bottom = h
            top = max(0, bottom - new_h)
        im_cropped = im.crop((0, top, w, bottom))
        
    final_im = im_cropped.resize(target_size, Image.Resampling.LANCZOS)
    final_im.save(dst_path, quality=95)
    print(f"Generated {dst_path} from {os.path.basename(src_path)} (size={final_im.size})")

# 1. Generate Step 5 for all regions (ko, ja, en)
for theme, src in editorial_sources.items():
    for reg in ['ko', 'ja', 'en']:
        dst_card = f'public/nb_step5_{reg}_{theme}_card.jpg'
        dst_std = f'public/nb_step5_{reg}_{theme}.jpg'
        crop_and_resize(src, dst_card)
        crop_and_resize(src, dst_std)

# Also generate general outfit fallback
crop_and_resize(editorial_sources['cream'], 'public/nb_step5_outfit.jpg')

# 2. Generate Step 2 Real Distinct Wardrobe Photos for all regions
for key, src in step2_sources.items():
    for reg in ['ko', 'ja', 'en']:
        dst_card = f'public/nb_step2_{reg}_{key}_card.jpg'
        crop_and_resize(src, dst_card)

print("\nALL DISTINCT 5-WARDROBE & STEP 2 ASSETS GENERATED SUCCESSFULLY!")
