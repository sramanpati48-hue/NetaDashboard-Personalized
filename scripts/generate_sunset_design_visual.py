import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def generate_sunset_design_visual(output_path):
    # 1. Load transferred sunset artwork (768 x 1060)
    base_bgr = cv2.imread(r'C:\Users\Sraman\AppData\Local\Temp\reinhard_sunset.png')
    base_rgb = cv2.cvtColor(base_bgr, cv2.COLOR_BGR2RGB)
    base_pil = Image.fromarray(base_rgb).convert('RGBA')
    bw, bh = base_pil.size # 768, 1060

    # Total high-res canvas: 768 x 1560 (extra 500px on top for the quote & sky)
    tw, th = 768, 1560
    sky_extra = th - bh # 500px

    canvas = Image.new('RGBA', (tw, th), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)

    # Vertical sunset sky gradient:
    # y=0..120: Pure white (255, 255, 255)
    # y=120..280: Soft ivory (255, 252, 246)
    # y=280..460: Warm peach / apricot (254, 238, 218)
    # y=460..sky_extra + 150: Transitioning into the horizon tones
    for y in range(th):
        if y < 140:
            t = y / 140.0
            r = int(255 * (1 - t) + 255 * t)
            g = int(255 * (1 - t) + 252 * t)
            b = int(255 * (1 - t) + 246 * t)
        elif y < 320:
            t = (y - 140) / 180.0
            r = int(255 * (1 - t) + 254 * t)
            g = int(252 * (1 - t) + 236 * t)
            b = int(246 * (1 - t) + 214 * t)
        elif y < 520:
            t = (y - 320) / 200.0
            r = int(254 * (1 - t) + 250 * t)
            g = int(236 * (1 - t) + 215 * t)
            b = int(214 * (1 - t) + 185 * t)
        else:
            t = min(1.0, (y - 520) / 300.0)
            r = int(250 * (1 - t) + 238 * t)
            g = int(215 * (1 - t) + 185 * t)
            b = int(185 * (1 - t) + 150 * t)
        draw.line([(0, y), (tw, y)], fill=(r, g, b, 255))

    # Paste base monument artwork
    # In base_pil, the top ~160px has dark sky from the transfer.
    # We blend the monument image so its sky transitions seamlessly into our warm sunset sky
    base_arr = np.array(base_pil)
    # Create smooth blend mask for monument top
    blend_top = 220
    for y in range(blend_top):
        factor = (y / blend_top) ** 1.8
        base_arr[y, :, 3] = int(255 * factor)
    
    masked_base = Image.fromarray(base_arr)
    canvas.paste(masked_base, (0, sky_extra), masked_base)

    # 3. Soft golden-hour clouds in the upper sky
    cloud_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(cloud_layer)
    cdraw.ellipse([-140, 180, 420, 600], fill=(255, 230, 205, 110))
    cdraw.ellipse([-80, 240, 360, 520], fill=(255, 220, 190, 130))
    cdraw.ellipse([260, 200, 940, 720], fill=(255, 225, 195, 120))
    cdraw.ellipse([340, 260, 880, 640], fill=(255, 215, 180, 140))
    cdraw.ellipse([520, 80, 900, 420], fill=(255, 235, 215, 90))
    cloud_layer = cloud_layer.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, cloud_layer)

    # 4. Graceful flying birds in the warm sunset sky
    def draw_bird(bdraw, cx, cy, span):
        bdraw.arc([cx - span, cy - span//2, cx, cy + span//2], start=210, end=350, fill=(180, 120, 70, 220), width=3)
        bdraw.arc([cx, cy - span//2, cx + span, cy + span//2], start=190, end=330, fill=(180, 120, 70, 220), width=3)

    bird_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(bird_layer)
    draw_bird(bdraw, 620, 210, 28)
    draw_bird(bdraw, 670, 175, 22)
    draw_bird(bdraw, 645, 265, 25)
    canvas = Image.alpha_composite(canvas, bird_layer)

    # 5. Typography Layer: Inspiring Visual Quote matching the dashboard design
    text_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(text_layer)

    font_quote_mark = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 96)
    font_quote_text = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 52)
    font_sub_sans = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 30)
    font_sub_bold = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 30)

    # Dashboard palette tokens: Deep Navy (#0B1B45), Saffron (#FF7A18), Muted Slate (#475569)
    color_navy = (11, 27, 69, 250)
    color_saffron = (255, 122, 24, 255)
    color_sub = (71, 85, 105, 235)

    qx = 82
    qy = 180

    # Opening quotation mark in saffron
    tdraw.text((qx - 8, qy), '\u201C', font=font_quote_mark, fill=color_saffron)

    # 3 Quote lines in Deep Navy
    line_x = qx + 50
    line_y = qy + 40
    tdraw.text((line_x, line_y), 'People.', font=font_quote_text, fill=color_navy)
    tdraw.text((line_x, line_y + 68), 'Progress.', font=font_quote_text, fill=color_navy)
    tdraw.text((line_x, line_y + 136), 'Partnership.\u201D', font=font_quote_text, fill=color_navy)

    # Dash + Subtitle
    sub_y = line_y + 235
    tdraw.line([(line_x, sub_y + 16), (line_x + 52, sub_y + 16)], fill=color_saffron, width=3)
    tdraw.text((line_x + 72, sub_y - 2), 'A Stronger', font=font_sub_bold, fill=color_navy)
    tdraw.text((line_x + 72, sub_y + 36), 'Delhi Together.', font=font_sub_sans, fill=color_sub)

    canvas = Image.alpha_composite(canvas, text_layer)

    # 6. Silk-smooth dissolve at the top 80px (fading to transparent)
    alpha = np.array(canvas.split()[3])
    fade_h = 80
    for y in range(fade_h):
        factor = (y / fade_h) ** 2.0
        alpha[y, :] = (alpha[y, :] * factor).astype(np.uint8)
    canvas.putalpha(Image.fromarray(alpha))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    canvas.save(output_path, 'WEBP', quality=95)
    print(f'Rendered design-matching sunset visual to {output_path} ({tw}x{th})')

if __name__ == '__main__':
    generate_sunset_design_visual(r'd:\HN-Personalized Neta Dashboard\public\images\sidebar\delhi_monument_sunset_design_hq.webp')
