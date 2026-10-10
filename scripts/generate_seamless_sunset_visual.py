import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def generate_seamless_sunset_visual(output_path):
    # 1. Load transferred sunset artwork (768 x 1060)
    base_bgr = cv2.imread(r'C:\Users\Sraman\AppData\Local\Temp\reinhard_sunset.png')
    base_rgb = cv2.cvtColor(base_bgr, cv2.COLOR_BGR2RGB)
    
    # Crop from y=175 downwards (just above the dome finial)
    mon_crop = base_rgb[175:, :] # (885, 768, 3)
    mon_h, mon_w = mon_crop.shape[:2]

    # Total canvas: 768 x 1440
    tw, th = 768, 1440
    sky_h = th - mon_h # 555px of pure warm sunset sky above monument

    canvas = Image.new('RGBA', (tw, th), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)

    # 2. Perfect continuous sunset sky gradient:
    # y=0..120: Pure white (255, 255, 255)
    # y=120..260: Soft ivory (255, 253, 248) -> (255, 248, 236)
    # y=260..420: Warm peach / apricot (255, 238, 215) -> (254, 222, 185)
    # y=420..580: Golden sunset horizon (254, 210, 160) -> (248, 195, 140)
    for y in range(th):
        if y < 120:
            t = y / 120.0
            r = 255
            g = int(255 * (1 - t) + 253 * t)
            b = int(255 * (1 - t) + 248 * t)
        elif y < 260:
            t = (y - 120) / 140.0
            r = 255
            g = int(253 * (1 - t) + 242 * t)
            b = int(248 * (1 - t) + 225 * t)
        elif y < 420:
            t = (y - 260) / 160.0
            r = int(255 * (1 - t) + 254 * t)
            g = int(242 * (1 - t) + 220 * t)
            b = int(225 * (1 - t) + 180 * t)
        elif y < 580:
            t = (y - 420) / 160.0
            r = int(254 * (1 - t) + 248 * t)
            g = int(220 * (1 - t) + 185 * t)
            b = int(180 * (1 - t) + 135 * t)
        else:
            t = min(1.0, (y - 580) / 300.0)
            r = int(248 * (1 - t) + 230 * t)
            g = int(185 * (1 - t) + 160 * t)
            b = int(135 * (1 - t) + 115 * t)
        draw.line([(0, y), (tw, y)], fill=(r, g, b, 255))

    # 3. Soft golden sunset clouds in the sky
    cloud_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(cloud_layer)
    # Soft peach cloud puffs
    cdraw.ellipse([-120, 200, 380, 560], fill=(255, 235, 210, 110))
    cdraw.ellipse([-60, 260, 320, 500], fill=(255, 225, 195, 130))
    cdraw.ellipse([260, 220, 920, 680], fill=(255, 230, 200, 110))
    cdraw.ellipse([340, 280, 860, 600], fill=(255, 220, 185, 130))
    cdraw.ellipse([480, 120, 880, 420], fill=(255, 240, 225, 90))
    cloud_layer = cloud_layer.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, cloud_layer)

    # 4. Paste monument image
    # We blend the top 60px of the monument crop so the dome tip meets the golden sky naturally
    mon_pil = Image.fromarray(mon_crop).convert('RGBA')
    mon_arr = np.array(mon_pil)
    blend_top = 70
    for y in range(blend_top):
        factor = (y / blend_top) ** 1.5
        mon_arr[y, :, 3] = int(255 * factor)
    
    masked_mon = Image.fromarray(mon_arr)
    canvas.paste(masked_mon, (0, sky_h), masked_mon)

    # 5. Sun burst glow behind & through the arch of India Gate
    # Arch center in canvas coords: x=384, y = sky_h + (384) ~ 940
    arch_glow = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    agdraw = ImageDraw.Draw(arch_glow)
    agdraw.ellipse([384 - 160, 930 - 160, 384 + 160, 930 + 160], fill=(255, 238, 140, 70))
    agdraw.ellipse([384 - 90, 930 - 90, 384 + 90, 930 + 90], fill=(255, 248, 180, 100))
    arch_glow = arch_glow.filter(ImageFilter.GaussianBlur(25))
    canvas = Image.alpha_composite(canvas, arch_glow)

    # 6. Graceful flying birds in the warm sunset sky
    def draw_bird(bdraw, cx, cy, span):
        bdraw.arc([cx - span, cy - span//2, cx, cy + span//2], start=210, end=350, fill=(185, 120, 65, 210), width=3)
        bdraw.arc([cx, cy - span//2, cx + span, cy + span//2], start=190, end=330, fill=(185, 120, 65, 210), width=3)

    bird_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(bird_layer)
    draw_bird(bdraw, 620, 210, 26)
    draw_bird(bdraw, 668, 175, 20)
    draw_bird(bdraw, 642, 260, 23)
    canvas = Image.alpha_composite(canvas, bird_layer)

    # 7. Typography: Inspiring Visual Quote in Golden Hour Sky
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
    qy = 150

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

    # 8. Silk-smooth dissolve at the top 80px (fading to transparent)
    alpha = np.array(canvas.split()[3])
    fade_h = 80
    for y in range(fade_h):
        factor = (y / fade_h) ** 2.0
        alpha[y, :] = (alpha[y, :] * factor).astype(np.uint8)
    canvas.putalpha(Image.fromarray(alpha))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    canvas.save(output_path, 'WEBP', quality=95)
    print(f'Rendered seamless sunset visual to {output_path} ({tw}x{th})')

if __name__ == '__main__':
    generate_seamless_sunset_visual(r'd:\HN-Personalized Neta Dashboard\public\images\sidebar\delhi_sunset_quote_seamless.webp')
