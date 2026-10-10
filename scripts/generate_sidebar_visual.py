import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

def generate_hq_sidebar_artwork(output_path):
    # Base twilight artwork (768 x 1060)
    base_src = r'D:\HN-website\hn-neta-dashboard\public\brand\sidebar-monument-twilight.png'
    base = Image.open(base_src).convert('RGBA')
    bw, bh = base.size # 768 x 1060

    # Total high-res canvas: 768 x 1560
    # Extra 500px on top gives generous breathing room for the quote & soft fade
    tw, th = 768, 1560
    sky_extra = th - bh # 500px

    # Gradient sky background
    canvas = Image.new('RGBA', (tw, th), (26, 10, 56, 255))
    draw = ImageDraw.Draw(canvas)

    # Vertical sky gradient matching base artwork seamlessly
    for y in range(sky_extra + 180):
        t = y / (sky_extra + 180)
        r = int(22 * (1 - t) + 36 * t)
        g = int(8 * (1 - t) + 15 * t)
        b = int(50 * (1 - t) + 75 * t)
        draw.line([(0, y), (tw, y)], fill=(r, g, b, 255))

    # Paste base monument artwork
    canvas.paste(base, (0, sky_extra), base)

    # Cloud layer
    cloud_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(cloud_layer)

    # Left stylized cloud
    cdraw.ellipse([-160, 80, 380, 620], fill=(55, 20, 100, 100))
    cdraw.ellipse([-100, 140, 320, 540], fill=(68, 26, 118, 115))

    # Center-right prominent circular cloud dome (behind quote towards right)
    cdraw.ellipse([260, 100, 940, 780], fill=(60, 24, 112, 105))
    cdraw.ellipse([340, 160, 880, 700], fill=(74, 30, 132, 120))

    # Upper right atmospheric cloud
    cdraw.ellipse([520, 10, 900, 380], fill=(48, 18, 92, 80))

    # Soft blur on cloud shapes
    cloud_layer = cloud_layer.filter(ImageFilter.GaussianBlur(12))
    canvas = Image.alpha_composite(canvas, cloud_layer)

    # Delicate stars in open sky (strictly outside text box x: 50-600, y: 120-560)
    star_draw = ImageDraw.Draw(canvas)
    np.random.seed(101)
    for _ in range(65):
        sx = int(np.random.uniform(25, tw - 25))
        sy = int(np.random.uniform(60, sky_extra + 120))
        # Protect text area
        if 50 < sx < 580 and 110 < sy < 560:
            continue
        brightness = int(np.random.uniform(140, 250))
        size = np.random.choice([1, 1, 2, 2, 3], p=[0.55, 0.25, 0.12, 0.06, 0.02])
        star_draw.ellipse([sx, sy, sx + size, sy + size], fill=(235, 240, 255, brightness))
        if size == 3:
            star_draw.line([(sx-2, sy+1), (sx+4, sy+1)], fill=(255, 255, 255, 160))
            star_draw.line([(sx+1, sy-2), (sx+1, sy+4)], fill=(255, 255, 255, 160))

    # 3 Graceful flying birds in upper right sky
    def draw_bird(bdraw, cx, cy, span):
        bdraw.arc([cx - span, cy - span//2, cx, cy + span//2], start=210, end=350, fill=(155, 115, 200, 220), width=3)
        bdraw.arc([cx, cy - span//2, cx + span, cy + span//2], start=190, end=330, fill=(155, 115, 200, 220), width=3)

    bird_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(bird_layer)
    draw_bird(bdraw, 620, 195, 28)
    draw_bird(bdraw, 670, 160, 22)
    draw_bird(bdraw, 645, 250, 25)
    canvas = Image.alpha_composite(canvas, bird_layer)

    # Typography Layer
    text_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(text_layer)

    font_quote_mark = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 92)
    font_quote_text = ImageFont.truetype(r'C:\Windows\Fonts\georgia.ttf', 52)
    font_sub_sans = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 29)

    # Coords for quote - well below top edge so it never touches the dissolve mask
    qx = 82
    qy = 185

    # Opening quotation mark
    tdraw.text((qx - 8, qy), '\u201C', font=font_quote_mark, fill=(255, 255, 255, 250))

    # 3 Quote lines
    line_x = qx + 50
    line_y = qy + 40
    tdraw.text((line_x, line_y), 'People.', font=font_quote_text, fill=(255, 255, 255, 250))
    tdraw.text((line_x, line_y + 68), 'Progress.', font=font_quote_text, fill=(255, 255, 255, 250))
    tdraw.text((line_x, line_y + 136), 'Partnership.\u201D', font=font_quote_text, fill=(255, 255, 255, 250))

    # Dash + Subtitle
    sub_y = line_y + 235
    tdraw.line([(line_x, sub_y + 16), (line_x + 52, sub_y + 16)], fill=(205, 190, 235, 220), width=3)
    tdraw.text((line_x + 72, sub_y - 2), 'A Stronger', font=font_sub_sans, fill=(215, 205, 245, 230))
    tdraw.text((line_x + 72, sub_y + 36), 'Delhi Together.', font=font_sub_sans, fill=(215, 205, 245, 230))

    canvas = Image.alpha_composite(canvas, text_layer)

    # Gentle, silky smooth top fade on alpha channel for seamless dissolve into sidebar
    alpha = np.array(canvas.split()[3])
    fade_h = 130
    for y in range(fade_h):
        factor = (y / fade_h) ** 2.0
        alpha[y, :] = (alpha[y, :] * factor).astype(np.uint8)
    canvas.putalpha(Image.fromarray(alpha))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    canvas.save(output_path, 'WEBP', quality=95)
    print(f'Rendered HQ visual to {output_path} ({tw}x{th})')

if __name__ == '__main__':
    generate_hq_sidebar_artwork(r'd:\HN-Personalized Neta Dashboard\public\images\sidebar\delhi_monument_quote_hq.webp')
