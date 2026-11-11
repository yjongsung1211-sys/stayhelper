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
    
    # 1. Left eyebrow (perfect fit)
    draw_dashed_arc(draw, [(102, 146), (112, 142), (124, 141), (136, 143), (146, 148)], width=2)
    # 2. Right eyebrow (perfect fit)
    draw_dashed_arc(draw, [(165, 148), (176, 143), (188, 141), (200, 142), (210, 146)], width=2)

    # 3. Left eye (around 124, 166)
    draw_dashed_ellipse(draw, (108, 156, 142, 176), width=2)
    # 4. Right eye (around 189, 161)
    draw_dashed_ellipse(draw, (172, 152, 206, 172), width=2)

    # 5. Nose bridge & nostrils
    draw_dashed_arc(draw, [(156, 156), (156, 204)], width=2)
    draw_dashed_arc(draw, [(143, 210), (148, 213), (156, 215), (164, 213), (169, 210)], width=2)

    # 6. Lips
    draw_dashed_ellipse(draw, (133, 231, 177, 249), width=2)

    # 7. Jawline
    jaw_pts = [
        (85, 175), (80, 195), (86, 215), (94, 230), (103, 245),
        (115, 260), (134, 275), (156, 282), (178, 275), (197, 260),
        (208, 245), (216, 230), (222, 215), (226, 195), (225, 175)
    ]
    draw_dashed_arc(draw, jaw_pts, width=2)
    
    return Image.alpha_composite(base_img.convert('RGBA'), overlay).convert('RGB')

def add_scan_landmarks_japanese_step1(base_img):
    w, h = base_img.size
    overlay = Image.new('RGBA', (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 1. Eyebrows
    draw_dashed_arc(draw, [(98, 142), (110, 137), (124, 135), (138, 137), (148, 143)], width=2)
    draw_dashed_arc(draw, [(168, 143), (178, 137), (192, 135), (206, 137), (218, 142)], width=2)

    # 2. Eyes
    draw_dashed_ellipse(draw, (108, 156, 142, 176), width=2)
    draw_dashed_ellipse(draw, (176, 153, 210, 173), width=2)

    # 3. Nose bridge & nostrils
    draw_dashed_arc(draw, [(158, 155), (158, 203)], width=2)
    draw_dashed_arc(draw, [(143, 205), (148, 208), (158, 210), (168, 208), (173, 205)], width=2)

    # 4. Lips
    draw_dashed_ellipse(draw, (128, 230, 188, 252), width=2)

    # 5. Jawline
    jaw_pts = [
        (85, 175), (80, 195), (86, 215), (94, 230), (105, 245), 
        (118, 260), (136, 275), (158, 282), (180, 275), (198, 260), 
        (210, 245), (220, 230), (226, 215), (230, 195), (228, 175)
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

def realistic_shirt_dye(img, color_hex, neck_y=372):
    arr = np.array(img).astype(float)
    w, h = img.size
    r = int(color_hex[1:3], 16)
    g = int(color_hex[3:5], 16)
    b = int(color_hex[5:7], 16)
    
    y_indices = np.arange(h)[:, None]
    xs = np.arange(w)[None, :]
    norm_x = (xs - w/2) / (w/2)
    neck_boundary_y = neck_y - 32 * (norm_x ** 2)
    
    shirt_zone = y_indices >= neck_boundary_y
    lum = (arr[:, :, 0] * 0.299 + arr[:, :, 1] * 0.587 + arr[:, :, 2] * 0.114) / 255.0
    
    dye = np.array([r, g, b]).astype(float)
    blended = dye * (0.15 + 0.85 * lum[:, :, np.newaxis])
    
    mask = shirt_zone.astype(float)
    mask_im = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=1.5))
    mask_arr = np.array(mask_im).astype(float) / 255.0
    
    out = arr * (1.0 - mask_arr[:, :, np.newaxis]) + blended * mask_arr[:, :, np.newaxis]
    out = np.clip(out, 0, 255).astype(np.uint8)
    return Image.fromarray(out)

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

outfit_presets = {
    'orange': '#E0834B',
    'brown': '#633B26',
    'khaki': '#625D43',
    'cream': '#E9E5A8',
    'green': '#3A5335'
}

# ==========================================
# 1. PROCESS KOREAN MODEL (AUTHENTIC EAST ASIAN BEAUTY)
# ==========================================
print("Processing Korean Model...")
ko_clean = Image.open('scratch/ko_clean_315x445.jpg').convert('RGB')
ko_lx, ko_ly = 155, 240

# Step 1: WITH SCAN LANDMARKS ONLY (PERFECT 100% FIT)
add_scan_landmarks_korean_step1(ko_clean).save('public/nb_step1_ko.jpg', quality=95)

# Steps 2-5: 100% CLEAN FACE (ZERO DOTTED LINES!)
ko_clean.save('public/nb_step1_ko_raw.jpg', quality=95)
ko_clean.save('public/nb_step1_model.jpg', quality=95)
ko_clean.save('public/nb_step2_ko_raw.jpg', quality=95)
ko_clean.save('public/nb_step3_ko_raw.jpg', quality=95)
ko_clean.save('public/nb_step4_ko_raw.jpg', quality=95)
ko_clean.save('public/nb_step5_ko_raw.jpg', quality=95)

# Step 2: Realistic Draping
realistic_shirt_dye(ko_clean, '#00A86B', neck_y=372).save('public/nb_step2_ko_best_card.jpg', quality=95)
realistic_shirt_dye(ko_clean, '#8A9A86', neck_y=372).save('public/nb_step2_ko_worst_card.jpg', quality=95)

# Step 3: Realistic Hair Dye
create_hair_dye(ko_clean, hair_presets['black'], intensity=0.9).save('public/nb_step3_ko_black_card.jpg', quality=95)
for hname, hhex in hair_presets.items():
    create_hair_dye(ko_clean, hhex).save(f'public/nb_step3_ko_{hname}_card.jpg', quality=95)

# Step 4: Realistic Lip Tint
ko_clean.save('public/nb_step4_ko_bare_card.jpg', quality=95)
for lname, lhex in lip_presets.items():
    create_lip_tint(ko_clean, lhex, ko_lx, ko_ly).save(f'public/nb_step4_ko_{lname}_card.jpg', quality=95)

# Step 5: All 5 Outfit Colors for Interactive Clicking!
for oname, ohex in outfit_presets.items():
    realistic_shirt_dye(ko_clean, ohex, neck_y=372).save(f'public/nb_step5_ko_{oname}_card.jpg', quality=95)
realistic_shirt_dye(ko_clean, outfit_presets['cream'], neck_y=372).save('public/nb_step5_outfit.jpg', quality=95)

# ==========================================
# 2. PROCESS JAPANESE MODEL
# ==========================================
print("Processing Japanese Model...")
ja_clean = Image.open('scratch/ja_clean_portrait.jpg').convert('RGB')
ja_lx, ja_ly = 158, 241

# Step 1: WITH SCAN LANDMARKS ONLY (PERFECT 100% FIT)
add_scan_landmarks_japanese_step1(ja_clean).save('public/nb_step1_ja.jpg', quality=95)

# Steps 2-5: 100% CLEAN FACE (ZERO DOTTED LINES!)
ja_clean.save('public/nb_step1_ja_raw.jpg', quality=95)
ja_clean.save('public/nb_step2_ja_raw.jpg', quality=95)
ja_clean.save('public/nb_step3_ja_raw.jpg', quality=95)
ja_clean.save('public/nb_step4_ja_raw.jpg', quality=95)
ja_clean.save('public/nb_step5_ja_raw.jpg', quality=95)

realistic_shirt_dye(ja_clean, '#00A86B', neck_y=375).save('public/nb_step2_ja_best_card.jpg', quality=95)
realistic_shirt_dye(ja_clean, '#8A9A86', neck_y=375).save('public/nb_step2_ja_worst_card.jpg', quality=95)

create_hair_dye(ja_clean, hair_presets['black'], intensity=0.9).save('public/nb_step3_ja_black_card.jpg', quality=95)
for hname, hhex in hair_presets.items():
    create_hair_dye(ja_clean, hhex).save(f'public/nb_step3_ja_{hname}_card.jpg', quality=95)

ja_clean.save('public/nb_step4_ja_bare_card.jpg', quality=95)
for lname, lhex in lip_presets.items():
    create_lip_tint(ja_clean, lhex, ja_lx, ja_ly).save(f'public/nb_step4_ja_{lname}_card.jpg', quality=95)

for oname, ohex in outfit_presets.items():
    realistic_shirt_dye(ja_clean, ohex, neck_y=375).save(f'public/nb_step5_ja_{oname}_card.jpg', quality=95)

# ==========================================
# 3. PROCESS ENGLISH MODEL
# ==========================================
print("Processing English Model...")
en_clean = Image.open('public/nb_step1_en_clean.jpg').convert('RGB')
en_lx, en_ly = 157, 228

# Step 1: WITH SCAN LANDMARKS ONLY
add_scan_landmarks_english_step1(en_clean).save('public/nb_step1_en.jpg', quality=95)
add_scan_landmarks_english_step1(en_clean).save('public/nb_step1_en_card.jpg', quality=95)

# Steps 2-5: 100% CLEAN FACE (ZERO DOTTED LINES!)
en_clean.save('public/nb_step1_en_raw.jpg', quality=95)
en_clean.save('public/nb_step2_en_raw.jpg', quality=95)
en_clean.save('public/nb_step3_en_raw.jpg', quality=95)
en_clean.save('public/nb_step4_en_raw.jpg', quality=95)
en_clean.save('public/nb_step5_en_raw.jpg', quality=95)

realistic_shirt_dye(en_clean, '#00A86B', neck_y=370).save('public/nb_step2_en_best_card.jpg', quality=95)
realistic_shirt_dye(en_clean, '#8A9A86', neck_y=370).save('public/nb_step2_en_worst_card.jpg', quality=95)

create_hair_dye(en_clean, hair_presets['black'], intensity=0.9).save('public/nb_step3_en_black_card.jpg', quality=95)
for hname, hhex in hair_presets.items():
    create_hair_dye(en_clean, hhex).save(f'public/nb_step3_en_{hname}_card.jpg', quality=95)

en_clean.save('public/nb_step4_en_bare_card.jpg', quality=95)
for lname, lhex in lip_presets.items():
    create_lip_tint(en_clean, lhex, en_lx, en_ly).save(f'public/nb_step4_en_{lname}_card.jpg', quality=95)

for oname, ohex in outfit_presets.items():
    realistic_shirt_dye(en_clean, ohex, neck_y=370).save(f'public/nb_step5_en_{oname}_card.jpg', quality=95)

print("All card assets regenerated successfully with 100% precision!")
