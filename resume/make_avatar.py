"""Generate face-focused circular avatars with a professional background.

The source photo has a solid WHITE background (no alpha), so we detect the
subject by finding non-white pixels, locate the head, crop tightly around the
face, replace white with a professional gradient, then apply a circular mask.
"""
from PIL import Image, ImageDraw

SRC = "public/profile.png"
im = Image.open(SRC).convert("RGB")
w, h = im.size
px = im.load()

def is_subject(r, g, b):
    # Non-white = part of the person. White background is ~>=245 on all channels.
    return not (r > 242 and g > 242 and b > 242)

# --- Per-row horizontal extent of the subject ---
row_extent = {}
min_y, max_y = h, 0
for y in range(h):
    rmin, rmax = None, None
    for x in range(w):
        r, g, b = px[x, y]
        if is_subject(r, g, b):
            if rmin is None:
                rmin = x
            rmax = x
    if rmin is not None and (rmax - rmin) > 5:
        row_extent[y] = (rmin, rmax)
        min_y = min(min_y, y)
        max_y = max(max_y, y)

head_top = min_y
subject_h = max_y - min_y

# Head band = top ~40% of the subject (head + neck). Use its width/centre.
band_bottom = head_top + int(subject_h * 0.40)
lefts, rights = [], []
for y in range(head_top, min(band_bottom, h)):
    if y in row_extent:
        lefts.append(row_extent[y][0])
        rights.append(row_extent[y][1])
head_left, head_right = min(lefts), max(rights)
face_cx = (head_left + head_right) // 2
head_w = head_right - head_left

# Horizontal centre of the whole subject (use full-body extent, not just head).
all_lefts = [row_extent[y][0] for y in row_extent]
all_rights = [row_extent[y][1] for y in row_extent]
body_left, body_right = min(all_lefts), max(all_rights)
body_cx = (body_left + body_right) // 2

# Show head down to ~waist. Start a little above the head top for breathing room,
# end near the lower torso. Make the crop a square large enough to fit that
# vertical span so the circle shows head-to-waist.
pad_top = int(subject_h * 0.04)
crop_top = max(head_top - pad_top, 0)
# Photo ends near the waist, so the lower torso is close to the subject bottom.
crop_bottom = min(head_top + int(subject_h * 0.98), h)
span = crop_bottom - crop_top

crop = span
left = body_cx - crop // 2
top = crop_top
print(f"subject y[{head_top},{max_y}] head_w={head_w} body_cx={body_cx} "
      f"crop={crop} box=({left},{top})")


def build_background(size, top_rgb, bot_rgb):
    bg = Image.new("RGB", (size, size))
    bd = bg.load()
    for y in range(size):
        t = y / max(size - 1, 1)
        row = tuple(int(top_rgb[i] + (bot_rgb[i] - top_rgb[i]) * t) for i in range(3))
        for x in range(size):
            bd[x, y] = row
    return bg


def composite(size, top_rgb, bot_rgb, transparent_outside):
    grad = build_background(crop, top_rgb, bot_rgb)
    out = grad.copy()
    op = out.load()
    cl, ct = max(left, 0), max(top, 0)
    for yy in range(crop):
        sy = top + yy
        if sy < 0 or sy >= h:
            continue
        for xx in range(crop):
            sx = left + xx
            if sx < 0 or sx >= w:
                continue
            r, g, b = px[sx, sy]
            if is_subject(r, g, b):
                op[xx, yy] = (r, g, b)
    out = out.resize((size, size), Image.LANCZOS).convert("RGBA")

    # Anti-aliased circular mask.
    ss = 4
    big = Image.new("L", (size * ss, size * ss), 0)
    ImageDraw.Draw(big).ellipse((0, 0, size * ss, size * ss), fill=255)
    mask = big.resize((size, size), Image.LANCZOS)

    if transparent_outside:
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    else:
        canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    canvas.paste(out, (0, 0), mask)
    return canvas


# Shared gradient so the website and resume avatars look identical.
GRAD_TOP = (237, 241, 249)
GRAD_BOT = (212, 223, 240)

# Website: same gradient, transparent outside the circle (sits on the dark theme).
web = composite(512, GRAD_TOP, GRAD_BOT, transparent_outside=True)
web.save("public/avatar.png")

# Resume: same gradient, white outside the circle for the PDF.
res = composite(400, GRAD_TOP, GRAD_BOT, transparent_outside=False)
res.convert("RGB").save("resume/avatar_resume.png", quality=95)

print("saved public/avatar.png and resume/avatar_resume.png")
