from PIL import Image
import numpy as np
import os

# Load 8.png (white) and 10.png (pink)
d = r'c:\Users\SARA FAJARDO\Documents\PROGRAMACION\MYPORTAFOLIO\img\abecedario'
im_w = Image.open(os.path.join(d, '8.png')).convert('RGBA')
im_p = Image.open(os.path.join(d, '10.png')).convert('RGBA')
arr_w = np.array(im_w.convert('L'))

row_specs = [
    (55, 215, ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f']),
    (255, 420, ['G', 'g', 'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M']),
    (455, 660, ['m', 'N', 'n', 'Ñ', 'ñ', 'O', 'o', 'P', 'p', 'Q', 'q']),
    (670, 830, ['R', 'r', 'S', 's', 'T', 't', 'U', 'u', 'V', 'v', 'W']),
    (870, 1070, ['w', 'X', 'x', 'Y', 'y', 'Z', 'z'])
]

glyph_boxes = {}

for y0, y1, chars in row_specs:
    strip = arr_w[y0:y1, :] > 50
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

    if len(segs) != len(chars):
        print(f"Error in row: got {len(segs)}, expected {len(chars)}")
    else:
        for ch, (x0, x1) in zip(chars, segs):
            char_arr = strip[:, x0:x1]
            ys = np.where(char_arr.sum(axis=1) > 0)[0]
            actual_y0 = y0 + ys.min()
            actual_y1 = y0 + ys.max() + 1
            glyph_boxes[ch] = (x0, actual_y0, x1, actual_y1)

print(f"Successfully extracted {len(glyph_boxes)} glyph boxes.")

# Function to extract transparent RGBA crop
def extract_glyph(im_src, box):
    crop = im_src.crop(box)
    arr = np.array(crop)
    # Background is black (low RGB) -> make alpha 0
    # Text is bright -> make alpha 255
    luminance = arr[:, :, :3].mean(axis=2)
    alpha = np.clip((luminance - 20) * 10, 0, 255).astype(np.uint8)
    arr[:, :, 3] = alpha
    return Image.fromarray(arr)

# Save individual glyphs
out_w = os.path.join(d, 'white')
out_p = os.path.join(d, 'pink')
os.makedirs(out_w, exist_ok=True)
os.makedirs(out_p, exist_ok=True)

for ch, box in glyph_boxes.items():
    prefix = 'upper_' if ch.isupper() else 'lower_'
    safe_name = prefix + ch.lower()
    if ch in ['Ñ', 'ñ']:
        safe_name = prefix + 'enye'
    extract_glyph(im_w, box).save(os.path.join(out_w, f"{safe_name}.png"))
    extract_glyph(im_p, box).save(os.path.join(out_p, f"{safe_name}.png"))

print("Saved all transparent glyphs!")
