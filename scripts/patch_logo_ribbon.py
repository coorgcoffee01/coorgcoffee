import math
import random
import os
from PIL import Image, ImageDraw, ImageFont

def patch_master_packet():
    master_path = 'public/products/arabica-coffee-beans.png'
    print(f"Loading master pouch: {master_path}")
    base = Image.open(master_path).convert('RGB')
    
    # 1. Sticker coordinates on full 1536x2730 pouch image
    ox, oy = 400, 950
    sw, sh = 450, 500
    sticker = base.crop((ox, oy, ox + sw, oy + sh)).convert('RGBA')
    
    # Mathematical ribbon circle center & radius on sticker
    cx, cy = 182.0, 282.0
    r_min, r_max = 145.0, 182.0
    theta_min, theta_max = 230.0, 310.0
    
    arc_len = (r_min + r_max) / 2.0 * math.radians(theta_max - theta_min)
    w_polar = int(round(arc_len))      # 228
    h_polar = int(round(r_max - r_min)) # 37
    
    # 2. Forward polar unwrap (straight horizontal ribbon)
    polar = Image.new('RGBA', (w_polar, h_polar))
    for px in range(w_polar):
        ang = theta_min + (px / float(w_polar - 1)) * (theta_max - theta_min)
        rad = math.radians(ang)
        for py in range(h_polar):
            r = r_max - (py / float(h_polar - 1)) * (r_max - r_min)
            rx = cx + r * math.cos(rad)
            ry = cy + r * math.sin(rad)
            x0 = int(math.floor(rx))
            y0 = int(math.floor(ry))
            x1 = min(sticker.width - 1, x0 + 1)
            y1 = min(sticker.height - 1, y0 + 1)
            fx = rx - x0
            fy = ry - y0
            c00 = sticker.getpixel((x0, y0))
            c10 = sticker.getpixel((x1, y0))
            c01 = sticker.getpixel((x0, y1))
            c11 = sticker.getpixel((x1, y1))
            r_col = int(c00[0]*(1-fx)*(1-fy) + c10[0]*fx*(1-fy) + c01[0]*(1-fx)*fy + c11[0]*fx*fy)
            g_col = int(c00[1]*(1-fx)*(1-fy) + c10[1]*fx*(1-fy) + c01[1]*(1-fx)*fy + c11[1]*fx*fy)
            b_col = int(c00[2]*(1-fx)*(1-fy) + c10[2]*fx*(1-fy) + c01[2]*(1-fx)*fy + c11[2]*fx*fy)
            polar.putpixel((px, py), (r_col, g_col, b_col, 255))
            
    # 3. Silky smooth inpainting of old text area
    clean = polar.copy()
    x_start, x_end = 28, 204
    
    top_smoothed = {}
    bot_smoothed = {}
    for x in range(x_start - 5, x_end + 6):
        r_t, g_t, b_t = 0, 0, 0
        r_b, g_b, b_b = 0, 0, 0
        count = 0
        for dx in range(-3, 4):
            px = max(0, min(polar.width - 1, x + dx))
            ct = polar.getpixel((px, 9))
            cb = polar.getpixel((px, 27))
            r_t += ct[0]; g_t += ct[1]; b_t += ct[2]
            r_b += cb[0]; g_b += cb[1]; b_b += cb[2]
            count += 1
        top_smoothed[x] = (r_t / count, g_t / count, b_t / count)
        bot_smoothed[x] = (r_b / count, g_b / count, b_b / count)
        
    random.seed(99)
    for x in range(x_start, x_end + 1):
        top_c = top_smoothed[x]
        bot_c = bot_smoothed[x]
        dist_x = min(x - x_start, x_end - x)
        h_weight = min(1.0, dist_x / 4.0)
        
        for y in range(10, 27):
            t = (y - 9) / 18.0
            r_int = top_c[0] * (1 - t) + bot_c[0] * t
            g_int = top_c[1] * (1 - t) + bot_c[1] * t
            b_int = top_c[2] * (1 - t) + bot_c[2] * t
            
            noise = random.randint(-1, 1)
            r = int(min(255, max(0, r_int + noise)))
            g = int(min(255, max(0, g_int + noise)))
            b = int(min(255, max(0, b_int + noise)))
            
            orig = polar.getpixel((x, y))
            fr = int(orig[0] * (1 - h_weight) + r * h_weight)
            fg = int(orig[1] * (1 - h_weight) + g * h_weight)
            fb = int(orig[2] * (1 - h_weight) + b * h_weight)
            clean.putpixel((x, y), (fr, fg, fb, 255))
            
    # 4. Render "COORG COFFEE" in condensed bold
    draw = ImageDraw.Draw(clean)
    font_path = '/System/Library/Fonts/Supplemental/Arial Narrow Bold.ttf'
    font = ImageFont.truetype(font_path, 18)
    sp = 1.2
    wsp = 5.0
    y_offset = 9
    
    words = ['COORG', 'COFFEE']
    w_chars = []
    total_w = 0
    for w_idx, word in enumerate(words):
        for ch in word:
            b = draw.textbbox((0, 0), ch, font=font)
            cw = b[2] - b[0]
            w_chars.append((ch, cw))
            total_w += cw + sp
        total_w -= sp
        if w_idx == 0:
            total_w += wsp
            
    start_x = int(117.5 - total_w / 2.0)
    cur_x = start_x
    
    char_counter = 0
    for w_idx, word in enumerate(words):
        for ch in word:
            ch_info = w_chars[char_counter]
            draw.text((cur_x, y_offset), ch, font=font, fill=(50, 24, 12, 255))
            cur_x += ch_info[1] + sp
            char_counter += 1
        cur_x -= sp
        if w_idx == 0:
            cur_x += wsp
            
    # 5. Inverse mapping back onto sticker
    reconstructed = sticker.copy()
    for y in range(sticker.height):
        for x in range(sticker.width):
            dx = x - cx
            dy = y - cy
            r = math.sqrt(dx*dx + dy*dy)
            if r_min <= r <= r_max:
                ang = math.degrees(math.atan2(dy, dx))
                if ang < 0:
                    ang += 360
                if theta_min <= ang <= theta_max:
                    u = (ang - theta_min) / (theta_max - theta_min) * (w_polar - 1)
                    v = (r_max - r) / (r_max - r_min) * (h_polar - 1)
                    u0 = int(math.floor(u)); v0 = int(math.floor(v))
                    u1 = min(w_polar - 1, u0 + 1); v1 = min(h_polar - 1, v0 + 1)
                    fu = u - u0; fv = v - v0
                    c00 = clean.getpixel((u0, v0))
                    c10 = clean.getpixel((u1, v0))
                    c01 = clean.getpixel((u0, v1))
                    c11 = clean.getpixel((u1, v1))
                    rc = int(c00[0]*(1-fu)*(1-fv) + c10[0]*fu*(1-fv) + c01[0]*(1-fu)*fv + c11[0]*fu*fv)
                    gc = int(c00[1]*(1-fu)*(1-fv) + c10[1]*fu*(1-fv) + c01[1]*(1-fu)*fv + c11[1]*fu*fv)
                    bc = int(c00[2]*(1-fu)*(1-fv) + c10[2]*fu*(1-fv) + c01[2]*(1-fu)*fv + c11[2]*fu*fv)
                    reconstructed.putpixel((x, y), (rc, gc, bc, 255))
                    
    # 6. Paste patched sticker back onto master pouch
    base.paste(reconstructed.convert('RGB'), (ox, oy))
    base.save(master_path)
    print(f"Updated master pouch: {master_path}")
    
    # Also save 768px JPG preview for arabica beans
    jpg_path = 'public/products/arabica-coffee-beans.jpg'
    preview = base.resize((768, int(768 * base.height / base.width)), Image.LANCZOS)
    preview.save(jpg_path, quality=94)
    print(f"Saved master preview: {jpg_path}")
    return base

if __name__ == '__main__':
    patch_master_packet()
