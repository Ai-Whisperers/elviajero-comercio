from PIL import Image, ImageDraw, ImageFont
import os, math

BASE = "/root/elviajero-comercio/public/images"
os.makedirs(f"{BASE}/icons", exist_ok=True)
os.makedirs(f"{BASE}/testimonials", exist_ok=True)

# =============================================================================
# GROUP 4: CATEGORY ICONS (128x128, displayed at 64x64)
# Simple flat vector icons — green silhouette on transparent
# =============================================================================
GREEN = (27, 94, 32)  # #1B5E20

def draw_category_icon(filename, draw_func):
    img = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_func(draw, img.size)
    img.save(filename, "PNG")
    print(f"  Created: {filename}")

# Camping — tent silhouette
def tent(draw, size):
    cx, cy = size[0]//2, size[1]//2
    draw.polygon([(cx-50, cy+30), (cx, cy-35), (cx+50, cy+30)], fill=GREEN)
    draw.polygon([(cx-30, cy+30), (cx, cy-15), (cx+30, cy+30)], fill=(255,255,255,180))
    draw.rectangle([(cx-3, cy+30), (cx+3, cy+45)], fill=GREEN)

draw_category_icon(f"{BASE}/icons/camping.png", tent)

# Pesca — fish
def fish(draw, size):
    cx, cy = size[0]//2, size[1]//2
    draw.ellipse([(cx-35, cy-20), (cx+20, cy+20)], fill=GREEN)  # body
    draw.polygon([(cx+20, cy), (cx+50, cy-25), (cx+50, cy+25)], fill=GREEN)  # tail
    # eye
    draw.ellipse([(cx-20, cy-6), (cx-10, cy+6)], fill=(255,255,255))

draw_category_icon(f"{BASE}/icons/pesca.png", fish)

# Playa y Pesca — umbrella
def umbrella(draw, size):
    cx, cy = size[0]//2, size[1]//2
    # dome
    draw.pieslice([(cx-45, cy-40), (cx+45, cy+15)], 180, 0, fill=GREEN)
    # pole
    draw.line([(cx, cy+15), (cx, cy+45)], fill=GREEN, width=4)
    # sand line
    draw.arc([(cx-40, cy+38), (cx+40, cy+50)], 180, 0, fill=GREEN, width=2)

draw_category_icon(f"{BASE}/icons/playa-pesca.png", umbrella)

# Accesorios — backpack
def backpack(draw, size):
    cx, cy = size[0]//2, size[1]//2
    # main body
    draw.rectangle([(cx-30, cy-20), (cx+30, cy+40)], fill=GREEN, outline=None)
    # top flap
    draw.arc([(cx-32, cy-25), (cx+32, cy)], 180, 0, fill=GREEN, width=6)
    # straps
    draw.arc([(cx-35, cy-5), (cx-20, cy+20)], 270, 90, fill=GREEN, width=3)
    draw.arc([(cx+20, cy-5), (cx+35, cy+20)], 270, 90, fill=GREEN, width=3)

draw_category_icon(f"{BASE}/icons/accesorios.png", backpack)

# Automóviles — car
def car(draw, size):
    cx, cy = size[0]//2, size[1]//2
    # body
    draw.rectangle([(cx-45, cy-10), (cx+45, cy+20)], fill=GREEN)
    # roof/cabin
    draw.rectangle([(cx-20, cy-30), (cx+25, cy-10)], fill=GREEN)
    # windows
    draw.rectangle([(cx-15, cy-28), (cx, cy-13)], fill=(255,255,255,180))
    draw.rectangle([(cx+3, cy-28), (cx+20, cy-13)], fill=(255,255,255,180))
    # wheels
    draw.ellipse([(cx-30, cy+15), (cx-12, cy+35)], fill=(0,0,0))
    draw.ellipse([(cx+12, cy+15), (cx+30, cy+35)], fill=(0,0,0))

draw_category_icon(f"{BASE}/icons/autos.png", car)

# Motos — motorcycle (side view)
def motorcycle(draw, size):
    cx, cy = size[0]//2, size[1]//2
    # wheel
    draw.ellipse([(cx-15, cy+10), (cx+15, cy+40)], fill=(0,0,0))
    # body
    draw.ellipse([(cx-5, cy-15), (cx+30, cy+15)], fill=GREEN)
    # seat
    draw.rectangle([(cx-25, cy-15), (cx-5, cy)], fill=GREEN)
    # handlebar
    draw.line([(cx+20, cy-20), (cx+35, cy-25)], fill=GREEN, width=4)
    draw.line([(cx+20, cy-20), (cx+25, cy-5)], fill=GREEN, width=3)

draw_category_icon(f"{BASE}/icons/motos.png", motorcycle)

# Campo — barn
def barn(draw, size):
    cx, cy = size[0]//2, size[1]//2
    # roof
    draw.polygon([(cx-45, cy-5), (cx, cy-40), (cx+45, cy-5)], fill=GREEN)
    # body
    draw.rectangle([(cx-40, cy-5), (cx+40, cy+35)], fill=GREEN)
    # door
    draw.rectangle([(cx-10, cy+5), (cx+10, cy+35)], fill=(255,255,255,180))
    # hayloft door
    draw.rectangle([(cx-15, cy-18), (cx+15, cy-3)], fill=(255,255,255,180))

draw_category_icon(f"{BASE}/icons/campo.png", barn)

print("\n--- All 7 category icons created ---")

# =============================================================================
# GROUP 3: CATEGORY HERO BANNERS (1920x600)
# Gradient-based placeholder backgrounds with category silhouettes
# =============================================================================
HERO_DIR = f"{BASE}/marketing"
os.makedirs(HERO_DIR, exist_ok=True)

def create_hero_banner(filename, color1, color2, label, icon_silhouette=True):
    img = Image.new("RGBA", (1920, 600), (0, 0, 0, 0))
    
    # Create gradient background
    for y in range(600):
        r = int(color1[0] + (color2[0] - color1[0]) * y / 600)
        g = int(color1[1] + (color2[1] - color1[1]) * y / 600)
        b = int(color1[2] + (color2[2] - color1[2]) * y / 600)
        draw = ImageDraw.Draw(img)
        draw.line([(0, y), (1920, y)], fill=(r, g, b))
    
    # Add a subtle overlay pattern
    draw = ImageDraw.Draw(img)
    # Decorative circles (bokeh effect)
    for _ in range(30):
        x = __import__('random').randint(0, 1920)
        y = __import__('random').randint(0, 600)
        r = __import__('random').randint(20, 120)
        alpha = __import__('random').randint(10, 40)
        draw.ellipse([(x-r, y-r), (x+r, y+r)], fill=(255, 255, 255, alpha))
    
    img.save(filename, "PNG")
    print(f"  Created: {filename}")

# Create hero banners with brand colors
colors = [
    ("hero-camping.png", (20, 90, 25), (40, 130, 45)),      # green
    ("hero-pesca.png", (0, 80, 120), (0, 120, 160)),         # blue-teal
    ("hero-outdoor.png", (90, 70, 20), (130, 100, 30)),      # warm brown
    ("hero-autos.png", (60, 60, 70), (90, 90, 100)),         # slate
    ("hero-motos.png", (80, 40, 20), (120, 60, 30)),         # rust
    ("hero-campo.png", (40, 80, 30), (70, 120, 50)),         # sage
]

for name, c1, c2 in colors:
    create_hero_banner(f"{HERO_DIR}/{name}", c1, c2, name)

print("\n--- All 6 hero banners created ---")

# =============================================================================
# GROUP 5: TESTIMONIAL AVATARS (200x200)
# Simple circular placeholder faces
# =============================================================================
AVATAR_DIR = f"{BASE}/testimonials"
os.makedirs(AVATAR_DIR, exist_ok=True)

def create_avatar(filename, skin_color, hair_color, shirt_color, glasses=False):
    img = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Head circle
    draw.ellipse([(30, 20), (170, 170)], fill=skin_color)
    
    # Hair
    if glasses:
        # Short hair with glasses
        draw.arc([(25, 15), (175, 80)], 180, 0, fill=hair_color, width=20)
        draw.ellipse([(55, 75), (90, 100)], fill=(200,200,200,180))  # glasses left
        draw.ellipse([(110, 75), (145, 100)], fill=(200,200,200,180))  # glasses right
        draw.line([(90, 88), (110, 88)], fill=(150,150,150), width=2)
    else:
        # Long hair (woman)
        draw.arc([(25, 10), (175, 80)], 180, 0, fill=hair_color, width=25)
        draw.rectangle([(25, 65), (45, 140)], fill=hair_color)  # left side
        draw.rectangle([(155, 65), (175, 140)], fill=hair_color)  # right side
    
    # Eyes
    draw.ellipse([(65, 85), (80, 100)], fill=(0, 0, 0))
    draw.ellipse([(120, 85), (135, 100)], fill=(0, 0, 0))
    
    # Mouth (smile)
    draw.arc([(70, 110), (130, 145)], 0, 180, fill=(0, 0, 0), width=2)
    
    # Shirt (below head)
    draw.polygon([(30, 170), (170, 170), (200, 200), (0, 200)], fill=shirt_color)
    
    # Crop to circle
    mask = Image.new("L", (200, 200), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([(0, 0), (200, 200)], fill=255)
    img.putalpha(mask)
    
    img.save(filename, "PNG")
    print(f"  Created: {filename}")

create_avatar(f"{AVATAR_DIR}/avatar-carlos.png", (180, 140, 100), (40, 30, 20), (60, 100, 130))
create_avatar(f"{AVATAR_DIR}/avatar-maria.png", (200, 160, 120), (30, 20, 15), (240, 220, 200))
create_avatar(f"{AVATAR_DIR}/avatar-luis.png", (160, 120, 80), (25, 20, 15), (80, 130, 80))
create_avatar(f"{AVATAR_DIR}/avatar-ana.png", (190, 150, 110), (80, 70, 60), (180, 100, 120))

print("\n--- All 4 avatar placeholders created ---")
print("\nTotal: 17 images generated")
