import math
import random
import os
from PIL import Image, ImageDraw, ImageFont

BASE_PATH = 'public/products/arabica-coffee-beans.png'
print(f"Loading base packet from: {BASE_PATH}")
base_img = Image.open(BASE_PATH).convert('RGB')
W_FULL, H_FULL = base_img.size

# Badge coordinates in full 1536x2730
ox = 550 + 180  # 730
oy = 1020 + 90  # 1110
bw, bh = 390, 90

inner_poly = [
    (18, 15),
    (100, 16),
    (200, 18),
    (300, 22),
    (373, 26),
    (373, 73),
    (300, 71),
    (200, 69),
    (100, 67),
    (18, 66)
]

font_path = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'

products = [
    {
        'file_base': 'blend-roasted-beans',
        'badge_text': 'BLEND ROASTED BEANS',
        'font_size': 25,
    },
    {
        'file_base': 'robusta-coffee-beans',
        'badge_text': 'ROBUSTA COFFEE',
        'font_size': 28,
    },
    {
        'file_base': 'arabica-coffee-powder',
        'badge_text': 'ARABICA COFFEE POWDER',
        'font_size': 23,
    },
    {
        'file_base': 'robusta-coffee-powder',
        'badge_text': 'ROBUSTA COFFEE POWDER',
        'font_size': 23,
    },
    {
        'file_base': 'arabica-filter-coffee',
        'badge_text': 'ARABICA FILTER COFFEE',
        'font_size': 23,
    },
    {
        'file_base': 'robusta-filter-coffee',
        'badge_text': 'ROBUSTA FILTER COFFEE',
        'font_size': 23,
    },
    {
        'file_base': 'coorg-mist-blend-filter-coffee',
        'badge_text': 'COORG MIST BLEND',
        'font_size': 27,
    },
    {
        'file_base': 'espresso-coffee-powder',
        'badge_text': 'ESPRESSO COFFEE',
        'font_size': 28,
    },
    {
        'file_base': 'moka-pot-coffee-powder',
        'badge_text': 'MOKA POT COFFEE',
        'font_size': 28,
    },
]

def make_packet(badge_text, font_size):
    packet = base_img.copy()
    tight = packet.crop((ox, oy, ox + bw, oy + bh))

    # Inner mask
    mask = Image.new('L', (bw, bh), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.polygon(inner_poly, fill=255)

    # Textured background with gradient
    bg = Image.new('RGB', (bw, bh), (45, 37, 32))
    for x in range(bw):
        factor = x / float(bw)
        r = int(52 * (1 - factor) + 40 * factor)
        g = int(42 * (1 - factor) + 32 * factor)
        b = int(36 * (1 - factor) + 27 * factor)
        for y in range(bh):
            fold = int(math.sin(x / float(bw) * math.pi) * 3)
            noise = random.randint(-4, 4)
            bg.putpixel((x, y), (
                max(0, min(255, r + fold + noise)),
                max(0, min(255, g + fold + noise)),
                max(0, min(255, b + fold + noise))
            ))

    tight.paste(bg, (0, 0), mask)

    # Render rotated text on transparent image
    text_layer = Image.new('RGBA', (600, 150), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(text_layer)
    font = ImageFont.truetype(font_path, font_size)

    spacing = 1
    chars = list(badge_text)
    total_w = sum(tdraw.textbbox((0, 0), ch, font=font)[2] - tdraw.textbbox((0, 0), ch, font=font)[0] + spacing for ch in chars) - spacing
    bbox0 = tdraw.textbbox((0, 0), badge_text, font=font)
    th = bbox0[3] - bbox0[1]

    cx = (600 - total_w) // 2
    cy = (150 - th) // 2

    cur_x = cx
    for ch in chars:
        cb = tdraw.textbbox((0, 0), ch, font=font)
        cw = cb[2] - cb[0]
        # subtle shadow / depth
        tdraw.text((cur_x, cy + 1), ch, font=font, fill=(55, 35, 20, 200))
        # metallic gold text
        tdraw.text((cur_x, cy), ch, font=font, fill=(205, 150, 95, 255))
        cur_x += cw + spacing

    # Rotate text by -1.85 degrees to match badge slope
    rotated_text = text_layer.rotate(-1.85, resample=Image.BICUBIC)

    # Paste rotated text onto tight badge
    tight.paste(rotated_text, (195 - 300 + 4, 45 - 75 + 1), rotated_text)

    # Paste tight badge back into full image
    packet.paste(tight, (ox, oy))
    return packet

if __name__ == '__main__':
    for p in products:
        print(f"Generating packet for {p['file_base']} -> {p['badge_text']}...")
        img = make_packet(p['badge_text'], p['font_size'])

        # Save high-res PNG
        png_path = f"public/products/{p['file_base']}.png"
        img.save(png_path)

        # Save web-optimized 768px JPG
        jpg_path = f"public/products/{p['file_base']}.jpg"
        preview_img = img.resize((768, int(768 * H_FULL / W_FULL)), Image.LANCZOS)
        preview_img.save(jpg_path, quality=94)
        print(f"Saved {png_path} and {jpg_path}")

    print("All packets regenerated successfully!")
