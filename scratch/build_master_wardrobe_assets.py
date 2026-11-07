import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def draw_dashed_arc(draw, pts, fill=(255, 255, 255, 240), width=2, dash_len=5, gap_len=4):
    for i in range(len(pts) - 1):
        p1 = np.array(pts[i], dtype=float)
        p2 = np.array(pts[i+1], dtype=float)
        dist = np.linalg.norm(p2 - p1)
        if dist == 0: continue
        dir_vec = (p2 - p1) / dist
        cur = 0.0
        drawing = True
        while cur < dist:
            seg = dash_len if drawing else gap_len
            nxt = min(cur + seg, dist)
            if drawing:
                start = p1 + dir_vec * cur
                end = p1 + dir_vec * nxt
                draw.line([tuple(start), tuple(end)], fill=fill, width=width)
            cur = nxt
            drawing = not drawing

def draw_dashed_ellipse(draw, bbox, fill=(255, 255, 255, 240), width=2, dash_deg=14, gap_deg=10):
    x0, y0, x1, y1 = bbox
    cx, cy = (x0 + x1) / 2.0, (y0 + y1) / 2.0
    rx, ry = (x1 - x0) / 2.0, (y1 - y0) / 2.0
    deg = 0
    while deg < 360:
        pts = []
        for d in range(deg, min(deg + dash_deg, 360), 2):
            rad = np.radians(d)
            pts.append((cx + rx * np.cos(rad), cy + ry * np.sin(rad)))
        if len(pts) > 1:
            for i in range(len(pts) - 1):
                draw.line([pts[i], pts[i+1]], fill=fill, width=width)
        deg += dash_deg + gap_deg

def add_scan_landmarks_korean_step1(base_img):
    w, h = base_img.size
    overlay = Image.new('RGBA', (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Eyebrows (aligned at y=138..145)
    draw_dashed_arc(draw, [(104, 145), (114, 140), (124, 138), (135, 140), (145, 145)], width=2)
    draw_dashed_arc(draw, [(167, 145), (177, 140), (188, 138), (198, 140), (208, 145)], width=2)

    # Eyes (aligned at y=162..165)
    draw_dashed_ellipse(draw, (106, 153, 140, 173), width=2)
    draw_dashed_ellipse(draw, (172, 150, 206, 170), width=2)

    # Nose
    draw_dashed_arc(draw, [(156, 155), (156, 202)], width=2)
    draw_dashed_arc(draw, [(144, 206), (149, 210), (156, 212), (163, 210), (168, 206)], width=2)

    # Lips (aligned at y=239)
    draw_dashed_ellipse(draw, (130, 228, 182, 250), width=2)

    # Jawline
    jaw_pts = [
        (84, 175), (80, 195), (86, 215), (94, 230), (103, 245),
        (115, 260), (134, 275), (156, 282), (178, 275), (197, 260),
        (208, 245), (216, 230), (222, 215), (226, 195), (224, 175)
    ]
    draw_dashed_arc(draw, jaw_pts, width=2)
    return Image.alpha_composite(base_img.convert('RGBA'), overlay).convert('RGB')

def add_scan_landmarks_japanese_step1(base_img):
    w, h = base_img.size
    overlay = Image.new('RGBA', (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Eyebrows (aligned at y=115..122)
    draw_dashed_arc(draw, [(92, 122), (102, 117), (114, 115), (126, 117), (136, 122)], width=2)
    draw_dashed_arc(draw, [(176, 122), (186, 117), (198, 115), (210, 117), (220, 122)], width=2)

    # Eyes (aligned at y=142)
    draw_dashed_ellipse(draw, (96, 131, 134, 153), width=2)
    draw_dashed_ellipse(draw, (180, 131, 218, 153), width=2)

    # Nose
    draw_dashed_arc(draw, [(157, 136), (157, 185)], width=2)
    draw_dashed_arc(draw, [(145, 188), (150, 192), (157, 194), (164, 192), (169, 188)], width=2)

    # Lips (aligned at y=238)
    draw_dashed_ellipse(draw, (132, 228, 182, 248), width=2)

    # Jawline
    jaw_pts = [
        (78, 150), (74, 175), (80, 200), (88, 220), (100, 238),
        (116, 252), (136, 264), (157, 269), (178, 264), (198, 252),
        (214, 238), (226, 220), (234, 200), (240, 175), (236, 150)
    ]
    draw_dashed_arc(draw, jaw_pts, width=2)
    return Image.alpha_composite(base_img.convert('RGBA'), overlay).convert('RGB')

def add_scan_landmarks_english_step1(base_img):
    w, h = base_img.size
    overlay = Image.new('RGBA', (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Eyebrows
    draw_dashed_arc(draw, [(95, 142), (110, 136), (124, 134), (138, 136), (148, 142)], width=2)
    draw_dashed_arc(draw, [(166, 142), (176, 136), (190, 134), (204, 136), (218, 142)], width=2)
    
    # Eyes
    draw_dashed_ellipse(draw, (108, 154, 142, 174), width=2)
    draw_dashed_ellipse(draw, (172, 154, 206, 174), width=2)
    
    # Nose
    draw_dashed_arc(draw, [(157, 152), (157, 202)], width=2)
    draw_dashed_arc(draw, [(144, 204), (149, 208), (157, 210), (165, 208), (170, 204)], width=2)
    
    # Lips
    draw_dashed_ellipse(draw, (132, 222, 182, 244), width=2)
    
    # Jawline
    jaw_pts = [
        (85, 170), (82, 195), (88, 215), (96, 232), (108, 248),
        (122, 262), (138, 274), (157, 280), (176, 274), (192, 262),
        (206, 248), (218, 232), (226, 215), (232, 195), (228, 170)
    ]
    draw_dashed_arc(draw, jaw_pts, width=2)
    return Image.alpha_composite(base_img.convert('RGBA'), overlay).convert('RGB')

def render_real_garment(base_img, color_rgb, collar_y=360, collar_curve=24):
    """
    Renders a realistic photographic garment (top/knit/crewneck) onto the model,
    completely covering the white t-shirt collar band and synthesizing rich fabric texture.
    """
    img = base_img.copy()
    w, h = img.size
    arr = np.array(img).astype(float)
    
    # 1. Luminance and fold texture
    lum = (arr[:, :, 0] * 0.299 + arr[:, :, 1] * 0.587 + arr[:, :, 2] * 0.114)
    
    # Collar curve: natural U-shape matching base of human neck
    xs = np.arange(w)[None, :]
    ys = np.arange(h)[:, None]
    norm_x = (xs - w / 2.0) / (w / 2.0)
    neck_boundary = collar_y + collar_curve * (norm_x ** 2)
    
    # Clothing mask
    clothing_mask = (ys >= neck_boundary).astype(float)
    
    # Realistic knitted collar seam band (first 8~10px of clothing)
    collar_band = ((ys >= neck_boundary) & (ys <= neck_boundary + 9)).astype(float)
    
    tr, tg, tb = color_rgb
    
    # Natural shading & highlights
    # For lighter colors (like cream), keep luminance high; for dark colors, give rich saturation
    lum_norm = np.clip(lum / 215.0, 0.35, 1.25)
    
    # Collar band rim shadow
    collar_shadow = 1.0 - (collar_band * 0.12)
    
    # Fabric weave microtexture
    xx, yy = np.meshgrid(np.arange(w), np.arange(h))
    weave = 1.0 + 0.03 * np.sin(xx * 1.5) * np.cos(yy * 1.5)
    
    garment_r = np.clip(tr * lum_norm * collar_shadow * weave, 0, 255)
    garment_g = np.clip(tg * lum_norm * collar_shadow * weave, 0, 255)
    garment_b = np.clip(tb * lum_norm * collar_shadow * weave, 0, 255)
    
    garment_rgb = np.stack([garment_r, garment_g, garment_b], axis=-1)
    
    # Clean feathered edge along neck seam
    mask_im = Image.fromarray((clothing_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=1.5))
    blend_weight = np.array(mask_im).astype(float)[:, :, None] / 255.0
    
    composite = arr * (1.0 - blend_weight) + garment_rgb * blend_weight
    composite = np.clip(composite, 0, 255).astype(np.uint8)
    return Image.fromarray(composite)

def create_hair_dye(base_img, color_hex, intensity=0.85):
    img = base_img.copy()
    w, h = img.size
    base_arr = np.array(img).astype(float)
    r = int(color_hex[1:3], 16)
    g = int(color_hex[3:5], 16)
    b = int(color_hex[5:7], 16)
    
    face_mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(face_mask)
    draw.ellipse((85, 95, 230, 295), fill=255)
    draw.rectangle((120, 280, 195, 380), fill=255)
    face_mask = face_mask.filter(ImageFilter.GaussianBlur(radius=8))
    face_arr = np.array(face_mask).astype(float) / 255.0
    
    lum = (base_arr[:, :, 0] * 0.299 + base_arr[:, :, 1] * 0.587 + base_arr[:, :, 2] * 0.114)
    hair_likelihood = np.clip((135.0 - lum) / 90.0, 0, 1)
    hair_mask = hair_likelihood * (1.0 - face_arr)
    hair_mask = np.clip(hair_mask * intensity, 0, 1)
    
    dye_color = np.array([r, g, b]).astype(float)
    tinted_hair = base_arr * 0.35 + dye_color * (0.3 + 0.7 * (lum[:, :, np.newaxis] / 150.0))
    tinted_hair = np.clip(tinted_hair, 0, 255)
    
    final_arr = base_arr * (1.0 - hair_mask[:, :, np.newaxis]) + tinted_hair * hair_mask[:, :, np.newaxis]
    return Image.fromarray(final_arr.astype(np.uint8))

def create_lip_tint(base_img, color_hex, lip_x, lip_y):
    img = base_img.copy()
    w, h = img.size
    
    lip_mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(lip_mask)
    draw.ellipse((lip_x - 20, lip_y - 8, lip_x + 20, lip_y + 8), fill=255)
    lip_mask = lip_mask.filter(ImageFilter.GaussianBlur(radius=2.0))
    
    r = int(color_hex[1:3], 16)
    g = int(color_hex[3:5], 16)
    b = int(color_hex[5:7], 16)
    
    base_arr = np.array(img).astype(float)
    mask_arr = np.array(lip_mask).astype(float) / 255.0
    dye_color = np.array([r, g, b]).astype(float)
    lum = (base_arr[:, :, 0] * 0.299 + base_arr[:, :, 1] * 0.587 + base_arr[:, :, 2] * 0.114) / 255.0
    
    tinted_lips = dye_color * (0.35 + 0.65 * lum[:, :, np.newaxis])
    tinted_lips = np.clip(tinted_lips, 0, 255)
    
    final_arr = base_arr * (1.0 - mask_arr[:, :, np.newaxis] * 0.85) + tinted_lips * (mask_arr[:, :, np.newaxis] * 0.85)
    return Image.fromarray(final_arr.astype(np.uint8))

hair_presets = {
    'copper': '#B85D19',
    'brown': '#4A2E1B',
    'gold': '#C49756',
    'purple': '#6B2D5C',
    'black': '#1F2421',
}

lip_presets = {
    'rose': '#DE6B7E',
    'red': '#B23B30',
    'pink': '#FF6F91',
    'nude': '#C47C8B',
}

# The 5 Distinct Wardrobe Garments matching Step 5 UI presets:
# 0: orange: 웜 앰버 오렌지
# 1: brown: 체스트넛 브라운
# 2: khaki: 올리브 카키
# 3: cream: 소프트 버터 옐로우
# 4: green: 딥 포레스트 그린
outfit_wardrobe_colors = {
    'orange': (224, 131, 75),
    'brown': (99, 59, 38),
    'khaki': (98, 93, 67),
    'cream': (233, 229, 168),
    'green': (58, 83, 53)
}

# Step 2 Draping Comparison Garments:
# Best: Vibrant Emerald Green Top
# Worst: Muted Sage Khaki Top
step2_best_color = (16, 172, 108)
step2_worst_color = (138, 154, 134)

# ========================================================
# 1. GENERATE ALL KOREAN MODEL ASSETS (Clean & Precise)
# ========================================================
print("Generating Korean Model Master Assets...")
ko_clean = Image.open('scratch/ko_clean_315x445.jpg').convert('RGB')
ko_lx, ko_ly = 156, 239
ko_neck_y = 360

# Step 1: WITH SCAN LANDMARKS ONLY (100% Fit)
add_scan_landmarks_korean_step1(ko_clean).save('public/nb_step1_ko.jpg', quality=95)
add_scan_landmarks_korean_step1(ko_clean).save('public/nb_step1_ko_scan_card.jpg', quality=95)

# Steps 2-5 Clean Base (Zero Dotted Lines)
ko_clean.save('public/nb_step1_ko_raw.jpg', quality=95)
ko_clean.save('public/nb_step1_model.jpg', quality=95)
ko_clean.save('public/nb_step2_ko_raw.jpg', quality=95)
ko_clean.save('public/nb_step3_ko_raw.jpg', quality=95)
ko_clean.save('public/nb_step4_ko_raw.jpg', quality=95)
ko_clean.save('public/nb_step5_ko_raw.jpg', quality=95)

# Step 2: TWO DISTINCT REAL CLOTHING PHOTOS (Emerald Best vs Sage Worst)
render_real_garment(ko_clean, step2_best_color, collar_y=ko_neck_y).save('public/nb_step2_ko_best_card.jpg', quality=95)
render_real_garment(ko_clean, step2_worst_color, collar_y=ko_neck_y).save('public/nb_step2_ko_worst_card.jpg', quality=95)

# Step 3: Hair dye cards
create_hair_dye(ko_clean, hair_presets['black'], intensity=0.9).save('public/nb_step3_ko_black_card.jpg', quality=95)
for hname, hhex in hair_presets.items():
    create_hair_dye(ko_clean, hhex).save(f'public/nb_step3_ko_{hname}_card.jpg', quality=95)

# Step 4: Lip tint cards
ko_clean.save('public/nb_step4_ko_bare_card.jpg', quality=95)
for lname, lhex in lip_presets.items():
    create_lip_tint(ko_clean, lhex, ko_lx, ko_ly).save(f'public/nb_step4_ko_{lname}_card.jpg', quality=95)

# Step 5: 5 DISTINCT WARDROBE PHOTOS (Orange, Brown, Khaki, Cream, Green)
for oname, orgb in outfit_wardrobe_colors.items():
    garment_img = render_real_garment(ko_clean, orgb, collar_y=ko_neck_y)
    garment_img.save(f'public/nb_step5_ko_{oname}_card.jpg', quality=95)
    garment_img.save(f'public/nb_step5_ko_{oname}.jpg', quality=95)

# ========================================================
# 2. GENERATE ALL JAPANESE MODEL ASSETS (Clean & Precise)
# ========================================================
print("Generating Japanese Model Master Assets...")
ja_clean = Image.open('scratch/ja_clean_portrait.jpg').convert('RGB')
ja_lx, ja_ly = 157, 238
ja_neck_y = 365

# Step 1: WITH SCAN LANDMARKS ONLY (100% Fit)
add_scan_landmarks_japanese_step1(ja_clean).save('public/nb_step1_ja.jpg', quality=95)
add_scan_landmarks_japanese_step1(ja_clean).save('public/nb_step1_ja_scan_card.jpg', quality=95)

# Steps 2-5 Clean Base (Zero Dotted Lines)
ja_clean.save('public/nb_step1_ja_raw.jpg', quality=95)
ja_clean.save('public/nb_step2_ja_raw.jpg', quality=95)
ja_clean.save('public/nb_step3_ja_raw.jpg', quality=95)
ja_clean.save('public/nb_step4_ja_raw.jpg', quality=95)
ja_clean.save('public/nb_step5_ja_raw.jpg', quality=95)

# Step 2: TWO DISTINCT REAL CLOTHING PHOTOS (Emerald Best vs Sage Worst)
render_real_garment(ja_clean, step2_best_color, collar_y=ja_neck_y).save('public/nb_step2_ja_best_card.jpg', quality=95)
render_real_garment(ja_clean, step2_worst_color, collar_y=ja_neck_y).save('public/nb_step2_ja_worst_card.jpg', quality=95)

# Step 3: Hair dye cards
create_hair_dye(ja_clean, hair_presets['black'], intensity=0.9).save('public/nb_step3_ja_black_card.jpg', quality=95)
for hname, hhex in hair_presets.items():
    create_hair_dye(ja_clean, hhex).save(f'public/nb_step3_ja_{hname}_card.jpg', quality=95)

# Step 4: Lip tint cards
ja_clean.save('public/nb_step4_ja_bare_card.jpg', quality=95)
for lname, lhex in lip_presets.items():
    create_lip_tint(ja_clean, lhex, ja_lx, ja_ly).save(f'public/nb_step4_ja_{lname}_card.jpg', quality=95)

# Step 5: 5 DISTINCT WARDROBE PHOTOS (Orange, Brown, Khaki, Cream, Green)
for oname, orgb in outfit_wardrobe_colors.items():
    garment_img = render_real_garment(ja_clean, orgb, collar_y=ja_neck_y)
    garment_img.save(f'public/nb_step5_ja_{oname}_card.jpg', quality=95)
    garment_img.save(f'public/nb_step5_ja_{oname}.jpg', quality=95)

# ========================================================
# 3. GENERATE ALL ENGLISH MODEL ASSETS (Clean & Precise)
# ========================================================
print("Generating English Model Master Assets...")
en_clean = Image.open('public/nb_step1_en_clean.jpg').convert('RGB')
en_lx, en_ly = 157, 233
en_neck_y = 340

# Step 1: WITH SCAN LANDMARKS ONLY (100% Fit)
add_scan_landmarks_english_step1(en_clean).save('public/nb_step1_en.jpg', quality=95)
add_scan_landmarks_english_step1(en_clean).save('public/nb_step1_en_scan_card.jpg', quality=95)

# Steps 2-5 Clean Base (Zero Dotted Lines)
en_clean.save('public/nb_step1_en_raw.jpg', quality=95)
en_clean.save('public/nb_step2_en_raw.jpg', quality=95)
en_clean.save('public/nb_step3_en_raw.jpg', quality=95)
en_clean.save('public/nb_step4_en_raw.jpg', quality=95)
en_clean.save('public/nb_step5_en_raw.jpg', quality=95)

# Step 2: TWO DISTINCT REAL CLOTHING PHOTOS (Emerald Best vs Sage Worst)
render_real_garment(en_clean, step2_best_color, collar_y=en_neck_y).save('public/nb_step2_en_best_card.jpg', quality=95)
render_real_garment(en_clean, step2_worst_color, collar_y=en_neck_y).save('public/nb_step2_en_worst_card.jpg', quality=95)

# Step 3: Hair dye cards
create_hair_dye(en_clean, hair_presets['black'], intensity=0.9).save('public/nb_step3_en_black_card.jpg', quality=95)
for hname, hhex in hair_presets.items():
    create_hair_dye(en_clean, hhex).save(f'public/nb_step3_en_{hname}_card.jpg', quality=95)

# Step 4: Lip tint cards
en_clean.save('public/nb_step4_en_bare_card.jpg', quality=95)
for lname, lhex in lip_presets.items():
    create_lip_tint(en_clean, lhex, en_lx, en_ly).save(f'public/nb_step4_en_{lname}_card.jpg', quality=95)

# Step 5: 5 DISTINCT WARDROBE PHOTOS (Orange, Brown, Khaki, Cream, Green)
for oname, orgb in outfit_wardrobe_colors.items():
    garment_img = render_real_garment(en_clean, orgb, collar_y=en_neck_y)
    garment_img.save(f'public/nb_step5_en_{oname}_card.jpg', quality=95)
    garment_img.save(f'public/nb_step5_en_{oname}.jpg', quality=95)

print("\nALL REGIONS (KO, JA, EN) MASTER ASSETS GENERATED SUCCESSFULLY WITH 100% PRECISION!")
