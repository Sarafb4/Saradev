from PIL import Image
import numpy as np
import os

d = r'c:\Users\SARA FAJARDO\Documents\PROGRAMACION\MYPORTAFOLIO\img\abecedario'
im_w = Image.open(os.path.join(d, '8.png')).convert('RGB')
arr_w = np.array(im_w)
lum_full = arr_w.mean(axis=2)

row_specs = [
    (55, 215, 201, ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f']),
    (255, 430, 406, ['G', 'g', 'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M']),
    (455, 660, 611, ['m', 'N', 'n', 'Ñ', 'ñ', 'O', 'o', 'P', 'p', 'Q', 'q']),
    (670, 830, 816, ['R', 'r', 'S', 's', 'T', 't', 'U', 'u', 'V', 'v', 'W']),
    (870, 1070, 1021, ['w', 'X', 'x', 'Y', 'y', 'Z', 'z'])
]

glyph_data = {}
for y0, y1, baseline_y, chars in row_specs:
    strip = lum_full[y0:y1, :] > 50
    col_sum = strip.sum(axis=0)
    in_char = False
    segs = []
    for x, v in enumerate(col_sum):
        if v > 0 and not in_char:
            in_char = True
            x0 = x
        elif v == 0 and in_char:
            in_char = False
            segs.append((x0, x))
    if in_char:
        segs.append((x0, len(col_sum)))

    if 'j' in chars and len(segs) == 14:
        new_segs = []
        skip_next = False
        for i in range(len(segs)):
            if skip_next:
                skip_next = False
                continue
            if i + 1 < len(segs) and segs[i][0] >= 1000 and segs[i+1][1] <= 1100:
                new_segs.append((segs[i][0], segs[i+1][1]))
                skip_next = True
            else:
                new_segs.append(segs[i])
        segs = new_segs

    for ch, (x0, x1) in zip(chars, segs):
        char_arr = strip[:, x0:x1]
        ys = np.where(char_arr.sum(axis=1) > 0)[0]
        actual_y0 = y0 + ys.min()
        actual_y1 = y0 + ys.max() + 1
        
        crop_lum = lum_full[actual_y0:actual_y1, x0:x1]
        h, w = crop_lum.shape
        
        # PURE WHITE RGBA with crystal clear alpha curve (no dark grey fringe)
        rgba = np.zeros((h, w, 4), dtype=np.uint8)
        rgba[:, :, :3] = 255 # Pure white
        
        alpha = np.zeros((h, w), dtype=np.float32)
        alpha[crop_lum >= 90] = 255.0
        blend_mask = (crop_lum >= 25) & (crop_lum < 90)
        alpha[blend_mask] = ((crop_lum[blend_mask] - 25.0) / (90.0 - 25.0)) * 255.0
        rgba[:, :, 3] = alpha.astype(np.uint8)
        
        glyph_data[ch] = {
            'img': Image.fromarray(rgba),
            'width': w,
            'height': h,
            'y_offset': actual_y0 - baseline_y
        }

def render_hq(text, scale=3, spacing=12, space_width=54):
    total_w = 0
    for i, ch in enumerate(text):
        if ch == ' ':
            total_w += space_width
        elif ch in glyph_data:
            total_w += glyph_data[ch]['width']
            if i < len(text) - 1 and text[i+1] != ' ':
                total_w += spacing

    baseline = 160
    total_h = 240
    out_im = Image.new('RGBA', (total_w + 40, total_h), (0, 0, 0, 0))
    curr_x = 20
    for i, ch in enumerate(text):
        if ch == ' ':
            curr_x += space_width
        elif ch in glyph_data:
            g = glyph_data[ch]
            img = g['img']
            y = baseline + g['y_offset']
            out_im.paste(img, (curr_x, y), img)
            curr_x += g['width'] + (spacing if (i < len(text) - 1 and text[i+1] != ' ') else 0)

    bbox = out_im.getbbox()
    if bbox:
        out_im = out_im.crop(bbox)
        
    if scale > 1:
        w_scaled = out_im.width * scale
        h_scaled = out_im.height * scale
        out_im = out_im.resize((w_scaled, h_scaled), Image.NEAREST)
        
    return out_im

if __name__ == '__main__':
    img_dir = r'c:\Users\SARA FAJARDO\Documents\PROGRAMACION\MYPORTAFOLIO\img'
    
    # Render Ultra High Quality 3x (Retina / 4K) titles
    hero_title = render_hq('saradev', scale=3, spacing=12)
    contact_title = render_hq('Sara Fajardo', scale=3, spacing=12, space_width=54)
    
    hero_title.save(os.path.join(img_dir, 'hero-title.png'))
    contact_title.save(os.path.join(img_dir, 'contact-title.png'))
    
    print(f"hero-title.png saved: {hero_title.size}")
    print(f"contact-title.png saved: {contact_title.size}")
