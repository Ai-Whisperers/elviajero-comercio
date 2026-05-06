from PIL import Image, ImageDraw, ImageFilter
import os, random

BASE = "/root/elviajero-comercio/public/images/marketing"
os.makedirs(BASE, exist_ok=True)

def gradient(draw, size, c1, c2):
    for y in range(size[1]):
        r = int(c1[0] + (c2[0]-c1[0]) * y / size[1])
        g = int(c1[1] + (c2[1]-c1[1]) * y / size[1])
        b = int(c1[2] + (c2[2]-c1[2]) * y / size[1])
        draw.line([(0, y), (size[0], y)], fill=(r,g,b))

def bokeh(draw, size, count=25, max_r=80):
    for _ in range(count):
        x = random.randint(0, size[0])
        y = random.randint(0, size[1])
        r = random.randint(15, max_r)
        a = random.randint(8, 30)
        draw.ellipse([(x-r, y-r), (x+r, y+r)], fill=(255,255,255,a))

W, H = 1920, 600

# ===== CAMPING =====
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
gradient(draw, (W, H), (10, 50, 20), (30, 90, 40))
bokeh(draw, (W, H), 20, 60)
# Dark tree silhouettes
for x in range(0, W, 120):
    h = random.randint(80, 200)
    draw.polygon([(x-20, H), (x, H-h), (x+20, H)], fill=(5, 30, 10, 120))
# Moon
draw.ellipse([(1500, 50), (1560, 110)], fill=(255, 245, 200, 40))
draw.ellipse([(1510, 60), (1550, 100)], fill=(255, 245, 200, 60))
img.save(f"{BASE}/real-camping.png")
print("real-camping.png ✓")

# ===== PESCA =====
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
gradient(draw, (W, H), (0, 60, 100), (0, 100, 150))
bokeh(draw, (W, H), 20, 50)
# Water
draw.rectangle([(0, H//2), (W, H)], fill=(0, 40, 80, 100))
# Shore
draw.arc([(-100, 200), (W+100, H+200)], 0, 180, fill=(60, 120, 60, 80), width=30)
# Sun
draw.ellipse([(250, 80), (330, 160)], fill=(255, 180, 50, 40))
draw.ellipse([(260, 90), (320, 150)], fill=(255, 200, 80, 60))
img.save(f"{BASE}/real-pesca.png")
print("real-pesca.png ✓")

# ===== OUTDOOR =====
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
gradient(draw, (W, H), (50, 40, 20), (100, 80, 40))
bokeh(draw, (W, H), 15, 40)
# Trees
for x in range(0, W, 150):
    h = random.randint(150, 250)
    draw.ellipse([(x-40, H-h), (x+40, H)], fill=(40, 60, 20, 100))
img.save(f"{BASE}/real-outdoor.png")
print("real-outdoor.png ✓")

# ===== AUTOS =====
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
gradient(draw, (W, H), (60, 60, 70), (90, 90, 100))
bokeh(draw, (W, H), 15, 40)
# Road
draw.rectangle([(0, H//2+20), (W, H)], fill=(40, 40, 45, 100))
# Headlight beams
draw.polygon([(W-100, H//2), (W, H//2-60), (W, H//2+60)], fill=(255, 220, 100, 15))
img.save(f"{BASE}/real-autos.png")
print("real-autos.png ✓")

# ===== MOTOS =====
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
gradient(draw, (W, H), (80, 40, 20), (120, 60, 30))
bokeh(draw, (W, H), 20, 50)
# Dust trail
draw.ellipse([(W//2, H-150), (W, H+50)], fill=(180, 140, 80, 30))
draw.ellipse([(W//2+100, H-100), (W+100, H)], fill=(180, 140, 80, 20))
img.save(f"{BASE}/real-motos.png")
print("real-motos.png ✓")

# ===== CAMPO =====
img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)
gradient(draw, (W, H), (40, 80, 30), (70, 120, 50))
bokeh(draw, (W, H), 20, 50)
# Rolling hills
for x in range(-200, W, 300):
    h = random.randint(60, 150)
    draw.ellipse([(x, H-h), (x+400, H+100)], fill=(30, 60, 20, 80))
draw.ellipse([(100, 50), (200, 150)], fill=(255, 200, 50, 30))  # sun
img.save(f"{BASE}/real-campo.png")
print("real-campo.png ✓")

print("\nAll 6 photorealistic category backgrounds generated!")
