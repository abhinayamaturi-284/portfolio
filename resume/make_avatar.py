"""Generate circular avatar variants from the transparent-background photo."""
from PIL import Image, ImageDraw, ImageOps

SRC = "public/profile.png"

im = Image.open(SRC).convert("RGBA")
w, h = im.size

# Composite the transparent photo onto a soft light background so the circular
# crop looks clean (no hard transparent gaps inside the circle).
# Light neutral used for the resume/light contexts.
def composite_on(bg_color):
    bg = Image.new("RGBA", im.size, bg_color)
    return Image.alpha_composite(bg, im)

# --- Square crop focused on head & shoulders (top-weighted) ---
side = min(w, h)
# Center horizontally, bias toward the top so the face sits nicely in the circle.
left = (w - side) // 2
top = 0
box = (left, top, left + side, top + side)

def circular(img_rgba, size=512, ring=True):
    sq = img_rgba.crop(box).resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((0, 0, size, size), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(sq, (0, 0), mask)
    return out

# Website avatar: transparent outside the circle (sits on dark theme).
# Fill the person's transparent background with a soft light tone so skin/shirt
# edges read cleanly against the circle.
web = composite_on((233, 238, 247, 255))  # soft light blue-gray
web_circle = circular(web, 512)
web_circle.save("public/avatar.png")

# Resume avatar: white background inside circle, for the light PDF.
res = composite_on((255, 255, 255, 255))
res_circle = circular(res, 400)
# Flatten onto white for PDF friendliness but keep circle via white corners.
res_bg = Image.new("RGBA", res_circle.size, (255, 255, 255, 255))
res_final = Image.alpha_composite(res_bg, res_circle)
res_final.convert("RGB").save("resume/avatar_resume.png", quality=95)

print("avatar.png", web_circle.size)
print("avatar_resume.png", res_final.size)
