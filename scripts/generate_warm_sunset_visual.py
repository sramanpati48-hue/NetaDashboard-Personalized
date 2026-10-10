import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_warm_sunset_visual(output_path):
    tw, th = 768, 1440

    # 1. Load clean monument
    src_path = r'd:\HN-Personalized Neta Dashboard\public\images\sidebar\delhi_monument_clean_whole.png'
    raw_bgr = cv2.imread(src_path)
    
    # Target monument width & height
    mon_w = tw
    mon_h = int(raw_bgr.shape[0] * (tw / raw_bgr.shape[1])) # ~1149px

    # Upscale with Lanczos4
    mon_up = cv2.resize(raw_bgr, (mon_w, mon_h), interpolation=cv2.INTER_LANCZOS4)

    # Enhance details & remove jpeg artifacts
    # Edge-preserving filter smooths flat areas (sky, road) while keeping monument edges sharp
    filtered = cv2.edgePreservingFilter(mon_up, flags=1, sigma_s=12, sigma_r=0.25)
    detail = cv2.detailEnhance(filtered, sigma_s=10, sigma_r=0.15)
    
    # Color vibrancy adjustment matching sidebar_ref warm golden hour
    hsv = cv2.cvtColor(detail, cv2.COLOR_BGR2HSV).astype(np.float32)
    # Enhance warm tones: boost saturation slightly on monuments and glow
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.15, 0, 255)
    # Brighten highlights slightly
    hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.05, 0, 255)
    mon_enhanced = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB)
    mon_pil = Image.fromarray(mon_enhanced).convert('RGBA')

    # 2. Build full canvas (768 x 1440)
    # Base canvas background: warm sunset gradient
    canvas = Image.new('RGBA', (tw, th), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)

    # Vertical sunset sky gradient:
    # y=0..200: pure white (255, 255, 255) to soft ivory (254, 250, 244)
    # y=200..450: soft ivory to warm peach (253, 235, 215)
    # y=450..650: warm peach to golden amber (251, 210, 168)
    for y in range(th):
        if y < 180:
            t = y / 180.0
            r = int(255 * (1 - t) + 254 * t)
            g = int(255 * (1 - t) + 248 * t)
            b = int(255 * (1 - t) + 240 * t)
        elif y < 450:
            t = (y - 180) / 270.0
            r = int(254 * (1 - t) + 253 * t)
            g = int(248 * (1 - t) + 230 * t)
            b = int(240 * (1 - t) + 205 * t)
        elif y < 700:
            t = (y - 450) / 250.0
            r = int(253 * (1 - t) + 249 * t)
            g = int(230 * (1 - t) + 195 * t)
            b = int(205 * (1 - t) + 155 * t)
        else:
            t = min(1.0, (y - 700) / 300.0)
            r = int(249 * (1 - t) + 235 * t)
            g = int(195 * (1 - t) + 160 * t)
            b = int(155 * (1 - t) + 120 * t)
        draw.line([(0, y), (tw, y)], fill=(r, g, b, 255))

    # 3. Stylized warm golden-hour clouds in sky
    cloud_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(cloud_layer)
    # Left soft peach cloud
    cdraw.ellipse([-120, 160, 420, 600], fill=(255, 225, 195, 120))
    cdraw.ellipse([-60, 220, 360, 520], fill=(255, 215, 180, 140))
    # Right golden cloud
    cdraw.ellipse([260, 180, 920, 700], fill=(255, 220, 185, 130))
    cdraw.ellipse([340, 240, 860, 620], fill=(255, 205, 165, 150))
    cloud_layer = cloud_layer.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas, cloud_layer)

    # 4. Position and blend monument onto canvas
    # Monument goes at the bottom: y = th - mon_h (1440 - 1149 = 291)
    mon_y = th - mon_h # 291
    
    # Create smooth blend mask for monument top
    # The sky in mon_pil blends into canvas sky seamlessly
    mon_arr = np.array(mon_pil)
    blend_mask = np.ones((mon_h, mon_w), dtype=np.float32)
    # Blend top 250px of monument image smoothly
    blend_top_h = 240
    for y in range(blend_top_h):
        blend_mask[y, :] = (y / blend_top_h) ** 1.8
    
    # Apply mask to monument alpha channel
    mon_arr[:, :, 3] = (mon_arr[:, :, 3] * blend_mask).astype(np.uint8)
    mon_masked = Image.fromarray(mon_arr)
    canvas.paste(mon_masked, (0, mon_y), mon_masked)

    # 5. Golden Sun Glow through India Gate Arch
    glow_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow_layer)
    # Arch center is around x=384, y=mon_y + 460
    arch_x = 384
    arch_y = mon_y + 460
    gdraw.ellipse([arch_x - 180, arch_y - 180, arch_x + 180, arch_y + 180], fill=(255, 235, 160, 90))
    gdraw.ellipse([arch_x - 100, arch_y - 100, arch_x + 100, arch_y + 100], fill=(255, 245, 190, 130))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(30))
    canvas = Image.alpha_composite(canvas, glow_layer)

    # 6. Typography Layer: Inspiring Visual Quote in Golden Hour Sky
    # Placed in the upper sky (y=160..450) where background is soft ivory/warm peach
    text_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(text_layer)

    font_quote_mark = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 96)
    font_quote_text = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 52)
    font_sub_sans = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 30)
    font_sub_bold = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 30)

    # Navy text matching dashboard primary ink (#0B1B45), warm saffron quote mark (#FF7A18)
    color_navy = (11, 27, 69, 245)
    color_saffron = (255, 122, 24, 255)
    color_sub = (75, 85, 110, 230)

    qx = 84
    qy = 150

    # Quotation mark in saffron
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

    # 7. Soft top dissolve on alpha channel
    # Top 80px gradually fades to 0 opacity for seamless dissolve into sidebar white
    alpha = np.array(canvas.split()[3])
    fade_h = 90
    for y in range(fade_h):
        factor = (y / fade_h) ** 2.0
        alpha[y, :] = (alpha[y, :] * factor).astype(np.uint8)
    canvas.putalpha(Image.fromarray(alpha))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    canvas.save(output_path, 'WEBP', quality=95)
    print(f'Rendered warm sunset visual to {output_path} ({tw}x{th})')

if __name__ == '__main__':
    create_warm_sunset_visual(r'd:\HN-Personalized Neta Dashboard\public\images\sidebar\delhi_sunset_quote_hq.webp')
