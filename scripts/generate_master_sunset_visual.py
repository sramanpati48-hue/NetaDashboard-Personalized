import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_quote_sunset_edition():
    src_path = r'd:\HN-Personalized Neta Dashboard\public\images\sidebar\delhi_gate_warm_sunset_hq.jpg'
    base = Image.open(src_path).convert('RGBA')
    bw, bh = base.size # 768, 1376

    # Let's extend the golden sunset sky upwards slightly (by 200px) so the quote has plenty of room
    # and dissolves smoothly into the sidebar
    extra_sky = 220
    tw, th = bw, bh + extra_sky # 768 x 1596

    canvas = Image.new('RGBA', (tw, th), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)

    # Gradient from pure white at top (y=0) to the warm sunset cloud color at y=extra_sky
    # Color at top of base image is around RGB(145, 120, 118)
    for y in range(extra_sky + 80):
        t = y / (extra_sky + 80.0)
        # Ease in
        factor = t ** 1.3
        r = int(255 * (1 - factor) + 148 * factor)
        g = int(255 * (1 - factor) + 125 * factor)
        b = int(255 * (1 - factor) + 120 * factor)
        draw.line([(0, y), (tw, y)], fill=(r, g, b, 255))

    # Paste base image with smooth top blend
    base_arr = np.array(base)
    blend_h = 100
    for y in range(blend_h):
        factor = (y / blend_h) ** 1.5
        base_arr[y, :, 3] = int(255 * factor)
    masked_base = Image.fromarray(base_arr)
    canvas.paste(masked_base, (0, extra_sky), masked_base)

    # Add soft clouds in upper sky
    cloud_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(cloud_layer)
    cdraw.ellipse([-80, 80, 450, 420], fill=(240, 215, 195, 90))
    cdraw.ellipse([280, 100, 850, 460], fill=(245, 210, 185, 80))
    cloud_layer = cloud_layer.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas, cloud_layer)

    # 3 Graceful flying birds
    def draw_bird(bdraw, cx, cy, span):
        bdraw.arc([cx - span, cy - span//2, cx, cy + span//2], start=210, end=350, fill=(110, 75, 60, 210), width=3)
        bdraw.arc([cx, cy - span//2, cx + span, cy + span//2], start=190, end=330, fill=(110, 75, 60, 210), width=3)

    bird_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(bird_layer)
    draw_bird(bdraw, 620, 180, 28)
    draw_bird(bdraw, 670, 145, 22)
    draw_bird(bdraw, 645, 230, 25)
    canvas = Image.alpha_composite(canvas, bird_layer)

    # Typography
    text_layer = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(text_layer)

    font_quote_mark = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 96)
    font_quote_text = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 52)
    font_sub_sans = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 30)
    font_sub_bold = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 30)

    # Typography with soft drop shadow for ultra-clear legibility
    shadow_color = (20, 15, 25, 90)
    navy_color = (11, 27, 69, 250)
    saffron_color = (255, 122, 24, 255)
    sub_color = (55, 45, 60, 230)

    qx = 84
    qy = 140

    def draw_text_with_shadow(draw, pos, text, font, fill, shadow):
        x, y = pos
        # Soft shadow
        draw.text((x + 1, y + 2), text, font=font, fill=shadow)
        draw.text((x, y), text, font=font, fill=fill)

    # Quotation mark
    draw_text_with_shadow(tdraw, (qx - 8, qy), '\u201C', font_quote_mark, saffron_color, (180, 80, 10, 80))

    # Quote lines
    line_x = qx + 50
    line_y = qy + 40
    draw_text_with_shadow(tdraw, (line_x, line_y), 'People.', font_quote_text, navy_color, shadow_color)
    draw_text_with_shadow(tdraw, (line_x, line_y + 68), 'Progress.', font_quote_text, navy_color, shadow_color)
    draw_text_with_shadow(tdraw, (line_x, line_y + 136), 'Partnership.\u201D', font_quote_text, navy_color, shadow_color)

    # Dash + Subtitle
    sub_y = line_y + 235
    tdraw.line([(line_x, sub_y + 16), (line_x + 52, sub_y + 16)], fill=saffron_color, width=3)
    draw_text_with_shadow(tdraw, (line_x + 72, sub_y - 2), 'A Stronger', font_sub_bold, navy_color, shadow_color)
    draw_text_with_shadow(tdraw, (line_x + 72, sub_y + 36), 'Delhi Together.', font_sub_sans, sub_color, shadow_color)

    canvas = Image.alpha_composite(canvas, text_layer)

    # Top fade to transparent (over top 90px)
    alpha = np.array(canvas.split()[3])
    fade_h = 90
    for y in range(fade_h):
        factor = (y / fade_h) ** 2.0
        alpha[y, :] = (alpha[y, :] * factor).astype(np.uint8)
    canvas.putalpha(Image.fromarray(alpha))

    out_path = r'd:\HN-Personalized Neta Dashboard\public\images\sidebar\delhi_gate_sunset_quote_master.webp'
    canvas.save(out_path, 'WEBP', quality=96)
    print('Master edition saved to:', out_path)

if __name__ == '__main__':
    create_quote_sunset_edition()
