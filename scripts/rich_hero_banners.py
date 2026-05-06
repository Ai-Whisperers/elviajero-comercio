"""
Rich hero banner generation — details, texture, depth.
Each 1920x600 scene with real subjects and atmosphere.
"""

from PIL import Image, ImageDraw, ImageFilter
import random, math, os

HERO = "/root/elviajero-comercio/public/images/marketing"
os.makedirs(HERO, exist_ok=True)
W, H = 1920, 600

def sky_gradient(draw, top, bot):
    for y in range(H):
        t = y / H
        r = int(top[0] + (bot[0]-top[0]) * t)
        g = int(top[1] + (bot[1]-top[1]) * t)
        b = int(top[2] + (bot[2]-top[2]) * t)
        draw.line([(0, y), (W, y)], fill=(r,g,b))

def tree_silhouette(draw, x, ground, height, color):
    draw.polygon([(x-20, ground), (x, ground-height), (x+20, ground)], fill=color)
    # Branches
    draw.line([(x-10, ground-height+20), (x-25, ground-height+15)], fill=color, width=2)
    draw.line([(x+10, ground-height+25), (x+28, ground-height+18)], fill=color, width=2)

def stars(draw, count=40):
    for _ in range(count):
        sx, sy = random.randint(0, W), random.randint(0, H//2)
        sr = random.uniform(0.5, 1.8)
        da = random.randint(60, 200)
        draw.ellipse([(sx-sr, sy-sr), (sx+sr, sy+sr)], fill=(255, 255, 240, da))

def moon(draw, x, y, r):
    draw.ellipse([(x-r, y-r), (x+r, y+r)], fill=(255, 245, 200, 25))
    draw.ellipse([(x-r+3, y-r+3), (x+r-3, y+r-3)], fill=(255, 245, 200, 45))
    draw.ellipse([(x-r+6, y-r+6), (x+r-6, y+r-6)], fill=(255, 245, 200, 70))

# ======================
# 1. CAMPING — Forest night with tent glow
# ======================
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
sky_gradient(draw, (5, 12, 22), (15, 35, 18))
stars(draw, 50)
moon(draw, W-200, 80, 50)

# Ground
draw.rectangle([(0, H//2+20), (W, H)], fill=(8, 25, 12))

# Tree line
for x in range(0, W, random.randint(60, 100)):
    th = random.randint(120, 220)
    tree_silhouette(draw, x, H//2+20, th, (3, 15, 8))

# Tent glow
gx, gy = W//2, H//2+30
for r in range(80, 5, -5):
    a = max(0, 18 - (80 - r) // 5)
    draw.ellipse([(gx-r, gy-r*0.5), (gx+r, gy+r*0.5)], fill=(255, 180, 60, a))

# Tent
draw.polygon([(gx-35, gy+15), (gx, gy-30), (gx+35, gy+15)], fill=(0, 0, 0, 100))
draw.polygon([(gx-18, gy+15), (gx, gy-5), (gx+18, gy+15)], fill=(255, 210, 100, 50))

# Ground texture
for _ in range(80):
    gx2 = random.randint(0, W)
    gy2 = random.randint(H//2+20, H)
    draw.ellipse([(gx2, gy2), (gx2+random.randint(2,6), gy2+1)], fill=(15, 35, 18, random.randint(30, 80)))

img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
img.save(f"{HERO}/hero-camping.png")
print("hero-camping.png — Forest tent scene")

# ======================
# 2. PESCA — River golden hour
# ======================
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
sky_gradient(draw, (70, 55, 35), (140, 100, 55))

# Distant mountains
draw.polygon([(0, H//2), (W//3, H//2-60), (2*W//3, H//2-40), (W, H//2)], fill=(80, 70, 50, 80))
draw.polygon([(W//3, H//2), (W//2, H//2-80), (2*W//3, H//2)], fill=(70, 65, 45, 60))

# Water
draw.rectangle([(0, H//2+20), (W, H)], fill=(40, 60, 70, 150))

# Water reflections
for _ in range(30):
    rx = random.randint(0, W)
    ry = random.randint(H//2+30, H-20)
    rw = random.randint(20, 120)
    draw.rectangle([(rx, ry), (rx+rw, ry+3)], fill=(255, 200, 100, random.randint(3, 12)))

# Sun/glow on horizon
sx, sy = W//2+100, H//2-20
draw.ellipse([(sx-50, sy-60), (sx+50, sy+20)], fill=(255, 180, 60, 25))
draw.ellipse([(sx-30, sy-40), (sx+30, sy)], fill=(255, 200, 80, 40))

# Shore vegetation
draw.arc([(-100, H//2-30), (W+100, H//2+40)], 180, 0, fill=(30, 60, 25, 100), width=25)

# Fishing rod
rx2, ry2 = W//4, H//2+30
draw.line([(rx2-15, ry2+20), (rx2-50, ry2-80)], fill=(0, 0, 0, 60), width=4)
draw.line([(rx2-50, ry2-80), (rx2-70, ry2-130)], fill=(0, 0, 0, 40), width=2)
# Line
draw.line([(rx2-70, ry2-130), (rx2-10, ry2+30), (rx2, ry2+40)], fill=(100, 100, 100, 40), width=1)

img = img.filter(ImageFilter.GaussianBlur(radius=0.3))
img.save(f"{HERO}/hero-pesca.png")
print("hero-pesca.png — River golden hour")

# ======================
# 3. OUTDOOR — Mountain trail
# ======================
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
sky_gradient(draw, (50, 65, 85), (100, 120, 95))

# Mountain range
draw.polygon([(0, H//2), (W//4, H//2-180), (W//2, H//2-50), (3*W//4, H//2-220), (W, H//2-30)], fill=(35, 55, 30, 80))
draw.polygon([(W//2, H//2), (3*W//4, H//2-220), (W, H//2)], fill=(30, 50, 25, 60))

# Snow caps
draw.polygon([(W//4, H//2-180), (W//4-20, H//2-130), (W//4+20, H//2-130)], fill=(200, 220, 200, 80))
draw.polygon([(3*W//4, H//2-220), (3*W//4-25, H//2-160), (3*W//4+25, H//2-160)], fill=(200, 220, 200, 70))

# Ground
draw.rectangle([(0, H//2+30), (W, H)], fill=(35, 55, 30))

# Trail path (winding)
for i in range(0, H-H//2-30, 15):
    tx = W//2 + int(math.sin(i * 0.04) * 120)
    ty = H//2+30 + i
    draw.ellipse([(tx-4, ty-4), (tx+4, ty+4)], fill=(100, 85, 55, 50))

# Hiker silhouette
hx, hy = W//2+30, H//2+60
# Body
draw.rectangle([(hx-5, hy-15), (hx+5, hy+15)], fill=(0, 0, 0, 50))
# Head
draw.ellipse([(hx-5, hy-22), (hx+5, hy-15)], fill=(0, 0, 0, 40))
# Backpack
draw.rectangle([(hx+5, hy-12), (hx+12, hy+8)], fill=(0, 0, 0, 40))

# Clouds
for _ in range(5):
    cx = random.randint(0, W)
    cy = random.randint(20, 120)
    draw.ellipse([(cx-30, cy-10), (cx+30, cy+10)], fill=(255, 255, 255, random.randint(10, 30)))

img = img.filter(ImageFilter.GaussianBlur(radius=0.3))
img.save(f"{HERO}/hero-outdoor.png")
print("hero-outdoor.png — Mountain trail")

# ======================
# 4. AUTOS — Night highway
# ======================
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
sky_gradient(draw, (8, 8, 18), (20, 15, 25))

# City glow on horizon
for r in range(300, 50, -20):
    a = max(0, 20 - (300 - r) // 15)
    draw.ellipse([(W//2-r, H//2-r//2), (W//2+r, H//2+r//2)], fill=(255, 180, 80, a))

# Road
draw.rectangle([(0, H//2+30), (W, H)], fill=(18, 18, 22))
# Road center line
for x in range(0, W, 50):
    draw.rectangle([(x, H//2+70), (x+25, H//2+74)], fill=(255, 255, 200, 25))

# Headlight beams (coming toward viewer)
beam_w = 80
draw.polygon([(W//2-beam_w, H//2+30), (W//2-300, H//2-80), (W//2+300, H//2-80)], fill=(255, 220, 100, 6))
draw.polygon([(W//2-beam_w, H//2+30), (W//2-200, H//2+150), (W//2+200, H//2+150)], fill=(255, 220, 100, 4))

# Car approaching
draw.rectangle([(W//2-35, H//2+10), (W//2+35, H//2+40)], fill=(0, 0, 0, 60))
draw.rectangle([(W//2-20, H//2-5), (W//2+20, H//2+10)], fill=(0, 0, 0, 50))
# Headlight points
draw.ellipse([(W//2-30, H//2+15), (W//2-15, H//2+30)], fill=(255, 220, 100, 60))
draw.ellipse([(W//2+15, H//2+15), (W//2+30, H//2+30)], fill=(255, 220, 100, 60))

# Stars
stars(draw, 20)

img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
img.save(f"{HERO}/hero-autos.png")
print("hero-autos.png — Night highway")

# ======================
# 5. MOTOS — Countryside dirt road
# ======================
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
sky_gradient(draw, (85, 75, 55), (160, 130, 70))

# Rolling hills
for x in range(-100, W, 180):
    fh = random.randint(60, 140)
    draw.ellipse([(x, H-fh), (x+350, H+50)], fill=(55, 75, 40, 70))

# Dirt road
draw.polygon([(W//2-50, H), (W//2+50, H), (W//2+25, H//2), (W//2-25, H//2)], fill=(90, 80, 60, 100))

# Dust cloud
for _ in range(20):
    dx = random.randint(W//2, W//2+250)
    dy = random.randint(H//2+40, H-30)
    dr = random.randint(15, 50)
    draw.ellipse([(dx-dr, dy-dr//2), (dx+dr, dy+dr//2)], fill=(150, 130, 100, random.randint(8, 25)))

# Motorcycle silhouette (moving away)
mx, my = W//2+40, H//2+15
draw.ellipse([(mx-15, my-12), (mx+5, my+15)], fill=(0, 0, 0, 50))
draw.ellipse([(mx+10, my-10), (mx+28, my+16)], fill=(0, 0, 0, 50))
draw.ellipse([(mx-5, my-10), (mx+15, my+5)], fill=(0, 0, 0, 40))
# Rider
draw.ellipse([(mx-5, my-25), (mx+5, my-12)], fill=(0, 0, 0, 35))

# Fence
for fx in range(50, W-50, 35):
    draw.rectangle([(fx, H//2-10), (fx+3, H//2+15)], fill=(40, 30, 20, 50))
    draw.line([(fx-10, H//2+2), (fx+10, H//2+2)], fill=(40, 30, 20, 40), width=2)

img = img.filter(ImageFilter.GaussianBlur(radius=0.3))
img.save(f"{HERO}/hero-motos.png")
print("hero-motos.png — Countryside dirt road")

# ======================
# 6. CAMPO — Farmland sunset
# ======================
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
sky_gradient(draw, (90, 65, 45), (170, 130, 65))

# Sun
draw.ellipse([(W-220, 60), (W-80, 200)], fill=(255, 160, 50, 20))
draw.ellipse([(W-200, 80), (W-100, 180)], fill=(255, 180, 70, 30))
draw.ellipse([(W-180, 100), (W-120, 160)], fill=(255, 200, 90, 40))

# Fields
for x in range(-100, W, 200):
    fh = random.randint(50, 110)
    draw.ellipse([(x, H-fh), (x+350, H+50)], fill=(55, 85, 40, 60))

# Barn
bx, by = W//3-50, H//2-10
draw.polygon([(bx-35, by+25), (bx, by-45), (bx+35, by+25)], fill=(40, 18, 15, 90))
draw.rectangle([(bx-30, by+25), (bx+30, by+60)], fill=(40, 18, 15, 80))
# Barn door
draw.rectangle([(bx-8, by+35), (bx+8, by+60)], fill=(20, 8, 6, 60))

# Fence
for fx in range(W//2+60, W-60, 30):
    draw.rectangle([(fx, H//2), (fx+3, H//2+25)], fill=(40, 30, 20, 55))
    draw.line([(fx-8, H//2+8), (fx+10, H//2+8)], fill=(40, 30, 20, 45), width=2)

# Clouds
for _ in range(6):
    cx = random.randint(0, W-100)
    cy = random.randint(30, 100)
    draw.ellipse([(cx-35, cy-10), (cx+35, cy+10)], fill=(255, 200, 150, random.randint(10, 25)))

# Ground texture
for _ in range(100):
    gx = random.randint(0, W)
    gy = random.randint(H//2+20, H)
    draw.ellipse([(gx, gy), (gx+random.randint(2,5), gy+1)], fill=(50, 70, 35, random.randint(20, 60)))

img = img.filter(ImageFilter.GaussianBlur(radius=0.3))
img.save(f"{HERO}/hero-campo.png")
print("hero-campo.png — Farmland sunset")

print("\nAll 6 hero banners regenerated with richer detail!")
