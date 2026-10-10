import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_pure_master_artwork():
    src_path = r'C:\Users\Sraman\.gemini\antigravity\brain\53609c23-2fb7-45e0-82c6-7ecb6c2033c4\india_gate_warm_sunset_1791573160563.jpg'
    base = Image.open(src_path).convert('RGB')
    tw, th = base.size # 768, 1376
    arr = np.array(base, dtype=np.float32)

    # 1. Warm Golden Sky Transition to Pure White (y: 0 -> 260)
    # Replaces dusky/purple clouds with warm golden sunset sky that gently fades to pure white #FFFFFF
    gold_sky = np.array([250.0, 222.0, 192.0])
    sky_h = 260
    for y in range(sky_h):
        t = y / float(sky_h)
        target_sky = 255.0 * (1.0 - t**1.1) + gold_sky * (t**1.1)
        blend_factor = 1.0 - (y / float(sky_h))**1.4
        for x in range(tw):
            arr[y, x] = arr[y, x] * (1.0 - blend_factor) + target_sky * blend_factor

    # Convert to RGBA
    canvas = Image.fromarray(arr.astype(np.uint8)).convert('RGBA')

    # Fade top 70px alpha slightly so CSS mask has an ultra-soft start
    alpha = np.ones((th, tw), dtype=np.uint8) * 255
    fade_top = 70
    for y in range(fade_top):
        t = y / float(fade_top)
        t = t * t * (3.0 - 2.0 * t)
        alpha[y, :] = int(255 * t)
    canvas.putalpha(Image.fromarray(alpha))

    # 2. Typography Layer directly on the glowing golden sky
    text_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(text_layer)

    font_quote_mark = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 72)
    font_quote_text = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 44)
    font_sub_bold = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 24)

    shadow_color = (255, 255, 255, 200)
    navy_color = (11, 27, 69, 255)
    saffron_color = (255, 122, 24, 255)

    qx = 64
    qy = 65

    # Soft ambient glow behind quote for crisp, elegant contrast
    glow_box = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow_box)
    gdraw.ellipse([qx - 30, qy - 15, qx + 560, qy + 195], fill=(255, 250, 240, 160))
    glow_box = glow_box.filter(ImageFilter.GaussianBlur(30))
    canvas = Image.alpha_composite(canvas, glow_box)

    def draw_text_with_glow(draw, pos, text, font, fill, glow):
        x, y = pos
        for dx, dy in [(-1,-1), (1,-1), (-1,1), (1,1), (0,1), (0,-1), (1,0), (-1,0)]:
            draw.text((x + dx, y + dy), text, font=font, fill=glow)
        draw.text((x, y), text, font=font, fill=fill)

    # Saffron Quotation Mark
    draw_text_with_glow(tdraw, (qx - 2, qy - 4), '\u201C', font_quote_mark, saffron_color, (255, 240, 200, 200))

    # 2-line headline in Georgia Bold
    line_x = qx + 40
    line_y = qy + 16
    draw_text_with_glow(tdraw, (line_x, line_y), 'People. Progress.', font_quote_text, navy_color, shadow_color)
    draw_text_with_glow(tdraw, (line_x, line_y + 54), 'Partnership.\u201D', font_quote_text, navy_color, shadow_color)

    # Subtitle with brand saffron accent bar
    sub_y = line_y + 118
    tdraw.line([(line_x, sub_y + 12), (line_x + 36, sub_y + 12)], fill=saffron_color, width=3)
    draw_text_with_glow(tdraw, (line_x + 48, sub_y - 2), 'A Stronger Delhi Together', font_sub_bold, navy_color, shadow_color)

    # 3 Graceful silhouette birds in upper right golden sky
    def draw_bird(bdraw, cx, cy, span):
        bdraw.arc([cx - span, cy - span//2, cx, cy + span//2], start=210, end=350, fill=(100, 65, 45, 220), width=3)
        bdraw.arc([cx, cy - span//2, cx + span, cy + span//2], start=190, end=330, fill=(100, 65, 45, 220), width=3)

    draw_bird(tdraw, 650, qy + 40, 24)
    draw_bird(tdraw, 690, qy + 15, 18)
    draw_bird(tdraw, 670, qy + 75, 21)

    canvas = Image.alpha_composite(canvas, text_layer)

    out_path = r'd:\HN-Personalized Neta Dashboard\public\images\sidebar\delhi_gate_warm_sunset_master_hq.webp'
    canvas.save(out_path, 'WEBP', quality=96)
    print('Master artwork created successfully:', out_path)

if __name__ == '__main__':
    create_pure_master_artwork()
