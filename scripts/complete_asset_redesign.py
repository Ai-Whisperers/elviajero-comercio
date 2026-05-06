"""
Complete asset redesign: logo, favicon, OG image, PWA icons, category hero banners.
Everything from scratch, cohesive brand identity.
"""

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import random, math

BASE = "/root/elviajero-comercio/public/images"
os.makedirs(f"{BASE}/marketing", exist_ok=True)

GREEN = "#1B5E20"
ORANGE = "#E65100"
DARK = "#37474F"
GOLD = "#FFB300"
WHITE = "#FFFFFF"

# ============================================================
# 1. NEW LOGO SVG — Mountain "V" with trail, outdoor brand mark
# The "V" in Viajero forms the mountain shape. Warm gold trail.
# ============================================================
LOGO = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64" fill="none">
  <defs>
    <linearGradient id="logomount" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#1B5E20"/>
      <stop offset="100%" stop-color="#2E7D32"/>
    </linearGradient>
    <linearGradient id="logotrail" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#E65100"/>
      <stop offset="100%" stop-color="#FF8F00"/>
    </linearGradient>
  </defs>
  <!-- Background circle -->
  <circle cx="28" cy="32" r="25" fill="#F1F8E9" stroke="#1B5E20" stroke-width="1.5"/>
  <!-- Mountain "V" shape === Viajero V -->
  <path d="M8 48 L20 12 L32 48Z" fill="url(#logomount)" stroke="#1B5E20" stroke-width="0.8"/>
  <!-- Snow cap -->
  <path d="M20 12 L17 22 L23 22Z" fill="#E8F5E9"/>
  <!-- Trail glowing path (the key differentiator) -->
  <path d="M24 22 Q28 26 26 30 Q24 34 28 38 Q30 42 26 48" stroke="url(#logotrail)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.85"/>
  <!-- Trail dots -->
  <circle cx="26" cy="26" r="1.5" fill="#FF8F00" opacity="0.6"/>
  <circle cx="27" cy="36" r="1" fill="#FF8F00" opacity="0.5"/>
  <circle cx="24" cy="44" r="1.2" fill="#FF8F00" opacity="0.4"/>
  <!-- Small pines -->
  <polygon points="37,38 39,30 41,38" fill="#1B5E20" opacity="0.3"/>
  <polygon points="14,32 16,26 18,32" fill="#1B5E20" opacity="0.2"/>
  <!-- Brand name with inline font paths for universal render -->
  <text x="60" y="30" font-family="system-ui,-apple-system,sans-serif" font-size="21" font-weight="700" fill="#1B5E20" letter-spacing="-0.3">El Viajero</text>
  <!-- Tagline -->
  <text x="60" y="46" font-family="system-ui,-apple-system,sans-serif" font-size="9.5" fill="#37474F" opacity="0.7">Camping · Pesca · Outdoor · Paraguay</text>
  <!-- Decorative dot after tagline -->
  <circle cx="172" cy="42" r="2" fill="#E65100" opacity="0.4"/>
</svg>'''

with open(f"{BASE}/logo.svg", "w") as f:
    f.write(LOGO)
print("✓ logo.svg — Mountain V with glowing trail path")

# ============================================================
# 2. FAVICON — Minimalist mountain peak, 64x64, recognizable at 16px
# ============================================================
FAVICON = '''<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="favmount" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2E7D32"/>
      <stop offset="100%" stop-color="#1B5E20"/>
    </linearGradient>
  </defs>
  <!-- Base rounded square -->
  <rect width="64" height="64" rx="14" fill="url(#favmount)"/>
  <!-- Mountain peak (bold, simple) -->
  <path d="M14 52 L24 22 L34 52Z" fill="white" opacity="0.95"/>
  <!-- Snow -->
  <path d="M24 22 L22 30 L26 30Z" fill="#C8E6C9"/>
  <!-- Trail (orange stripe, thin) -->
  <path d="M26 30 Q28 34 27 38 Q26 42 28 46 Q28 48 27 52" stroke="#FFB300" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>
  <!-- Star hint -->
  <circle cx="44" cy="20" r="2" fill="white" opacity="0.4"/>
</svg>'''

with open(f"{BASE}/favicon.svg", "w") as f:
    f.write(FAVICON)
print("✓ favicon.svg — Bold mountain silhouette with trail")

# ============================================================
# 3. OG IMAGE — Professional social preview
# No emoji. Proper SVG shapes. Brand-first.
# ============================================================
OG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ogbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1B5E20"/>
      <stop offset="45%" stop-color="#2E7D32"/>
      <stop offset="100%" stop-color="#1B5E20"/>
    </linearGradient>
    <linearGradient id="ogmount" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#2E7D32"/>
      <stop offset="100%" stop-color="#43A047"/>
    </linearGradient>
    <linearGradient id="ogsun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFB300"/>
      <stop offset="100%" stop-color="#E65100"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogbg)"/>
  
  <!-- Decorative mountain silhouettes -->
  <path d="M0 630 L80 480 L160 550 L280 400 L400 520 L520 350 L640 490 L760 380 L880 510 L1000 360 L1120 480 L1200 420 L1200 630Z" fill="white" opacity="0.04"/>
  <path d="M0 630 L120 520 L240 580 L360 450 L480 560 L600 400 L720 530 L840 440 L960 540 L1080 470 L1200 530 L1200 630Z" fill="white" opacity="0.03"/>
  
  <!-- Glowing sun -->
  <circle cx="950" cy="200" r="80" fill="#FFB300" opacity="0.06"/>
  <circle cx="950" cy="200" r="50" fill="#FFB300" opacity="0.1"/>
  <circle cx="950" cy="200" r="25" fill="#FFB300" opacity="0.2"/>
  
  <!-- Left: Brand Icon Area -->
  <g transform="translate(80, 180)">
    <!-- Icon circle -->
    <circle cx="70" cy="70" r="65" fill="white" opacity="0.1"/>
    <circle cx="70" cy="70" r="55" fill="white" opacity="0.08"/>
    <!-- Mountain V -->
    <path d="M30 120 L55 30 L80 120Z" fill="white" opacity="0.95"/>
    <path d="M55 30 L50 55 L60 55Z" fill="#C8E6C9"/>
    <!-- Trail -->
    <path d="M58 55 Q62 70 60 80 Q58 90 62 100 Q63 110 60 120" stroke="#FFB300" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.85"/>
    <!-- Tent -->
    <path d="M62 95 L70 80 L78 95Z" fill="white" opacity="0.5"/>
  </g>
  
  <!-- Right: Typography -->
  <text x="240" y="210" font-family="system-ui,-apple-system,sans-serif" font-size="56" fill="white" font-weight="700">El Viajero</text>
  <text x="240" y="265" font-family="system-ui,-apple-system,sans-serif" font-size="26" fill="white" opacity="0.9">Todo para tu aventura al aire libre</text>
  
  <!-- Category pills (no emoji) -->
  <g transform="translate(240, 310)">
    <rect x="0" y="0" width="95" height="32" rx="16" fill="white" opacity="0.12"/>
    <text x="47" y="21" font-family="system-ui,sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="500">Camping</text>
    <rect x="105" y="0" width="80" height="32" rx="16" fill="white" opacity="0.12"/>
    <text x="145" y="21" font-family="system-ui,sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="500">Pesca</text>
    <rect x="195" y="0" width="90" height="32" rx="16" fill="white" opacity="0.12"/>
    <text x="240" y="21" font-family="system-ui,sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="500">Outdoor</text>
    <rect x="295" y="0" width="110" height="32" rx="16" fill="white" opacity="0.12"/>
    <text x="350" y="21" font-family="system-ui,sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="500">Automoviles</text>
    <rect x="415" y="0" width="75" height="32" rx="16" fill="white" opacity="0.12"/>
    <text x="452" y="21" font-family="system-ui,sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="500">Motos</text>
  </g>
  
  <!-- Location -->
  <g transform="translate(240, 390)">
    <circle cx="0" cy="-4" r="5" fill="#E65100" opacity="0.6"/>
    <text x="15" y="0" font-family="system-ui,sans-serif" font-size="16" fill="white" opacity="0.6">Mariano Roque Alonso · Paraguay · Pedi por WhatsApp</text>
  </g>
  
  <!-- Decorative bottom wave -->
  <path d="M0 590 Q200 565 400 585 Q600 605 800 580 Q1000 555 1200 575 L1200 630 L0 630Z" fill="white" opacity="0.03"/>
  
  <!-- URL -->
  <text x="1100" y="595" font-family="monospace" font-size="15" fill="white" opacity="0.3" text-anchor="end">el-viajero.paragu-ai.com</text>
</svg>'''

with open(f"{BASE}/og-viajero.svg", "w") as f:
    f.write(OG)
print("✓ og-viajero.svg — Full brand OG layout, no emoji")

# ============================================================
# 4. PWA ICONS from SVG — render via Pillow with anti-aliasing
# ============================================================
def render_pwa_icon(path, size):
    """Render a polished PWA icon matching the brand."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    rr = size // 5
    draw.rounded_rectangle([(0, 0), (size, size)], radius=rr, fill="#1B5E20")
    
    cx, cy = size // 2, size // 2
    s = size  # scale factor
    
    # Mountain
    m_l = cx - s//3
    m_r = cx + s//3
    m_t = cy - s//3
    m_b = cy + s//5
    draw.polygon([(m_l, m_b), (cx, m_t), (m_r, m_b)], fill=(255, 255, 255, 240))
    
    # Snow cap
    sw = s // 8
    draw.polygon([(cx, m_t), (cx - sw, m_t + sw*2), (cx + sw, m_t + sw*2)], fill=(200, 230, 201))
    
    # Trail (orange path)
    trail_pts = [
        (cx + sw//2, m_t + sw*2),
        (cx + sw, m_t + sw*3),
        (cx - sw//4, m_t + sw*4),
        (cx + sw//2, m_t + sw*5),
        (cx - sw//3, m_b)
    ]
    for i in range(len(trail_pts)-1):
        draw.line([trail_pts[i], trail_pts[i+1]], fill=(255, 180, 0), width=max(2, s//20))
    
    # Sun
    sun_r = s // 14
    draw.ellipse([(cx + s//3 - sun_r, cy - s//3 - sun_r), (cx + s//3 + sun_r, cy - s//3 + sun_r)], fill="#FFB300")
    
    # Soft glow
    img2 = img.filter(ImageFilter.GaussianBlur(radius=1))
    img = Image.alpha_composite(img2, img)
    
    img.save(path, "PNG")
    print(f"✓ {path} ({size}x{size})")

render_pwa_icon(f"{BASE}/icon-192.png", 192)
render_pwa_icon(f"{BASE}/icon-512.png", 512)

# ============================================================
# 5. CATEGORY HERO BANNERS — 1920x600 with actual scene subjects
# Rich, high-contrast PNGs for overlay at bg-primary/82 opacity
# ============================================================
HERO_DIR = f"{BASE}/marketing"
os.makedirs(HERO_DIR, exist_ok=True)

def hero_bg(w, h, sky_top, sky_bot, ground_color, elements_func):
    """Create a hero background with sky gradient + ground + elements."""
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Sky gradient
    for y in range(h):
        t = y / h
        r = int(sky_top[0] + (sky_bot[0] - sky_top[0]) * t)
        g = int(sky_top[1] + (sky_bot[1] - sky_top[1]) * t)
        b = int(sky_top[2] + (sky_bot[2] - sky_top[2]) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    
    # Ground
    draw.rectangle([(0, h//2+40), (w, h)], fill=ground_color)
    
    # Elements
    if elements_func:
        elements_func(draw, w, h)
    
    # Dark vignette overlay
    for y in range(h):
        t = y / h
        v = int(20 * (1 - abs(t - 0.5) * 2)) if t < 0.5 else 0
        if v > 0:
            draw.line([(0, y), (w, y)], fill=(0, 0, 0, min(v, 15)))
    
    return img

# --- CAMPING: Forest night with tent glow ---
def camping_elements(d, w, h):
    # Tree silhouettes
    for x in range(0, w, random.randint(80, 150)):
        th = random.randint(80, 200)
        d.polygon([(x-25, h), (x, h-th), (x+25, h)], fill=(5, 25, 10, 150))
    # Stars
    for _ in range(30):
        sx = random.randint(0, w)
        sy = random.randint(0, h//2)
        sr = random.uniform(0.5, 1.5)
        d.ellipse([(sx-sr, sy-sr), (sx+sr, sy+sr)], fill=(255, 255, 240, random.randint(60, 180)))
    # Moon
    d.ellipse([(w-250, 40), (w-170, 120)], fill=(255, 245, 200, 30))
    d.ellipse([(w-240, 50), (w-180, 110)], fill=(255, 245, 200, 50))
    # Tent glow (warm light)
    glow_cx, glow_cy = w//3, h//2+30
    for r in range(60, 10, -5):
        a = max(0, 15 - (60 - r) // 4)
        d.ellipse([(glow_cx-r, glow_cy-r*0.6), (glow_cx+r, glow_cy+r*0.6)], fill=(255, 180, 50, a))
    # Tent silhouette
    d.polygon([(glow_cx-30, glow_cy+20), (glow_cx, glow_cy-25), (glow_cx+30, glow_cy+20)], fill=(0, 0, 0, 80))
    d.polygon([(glow_cx-15, glow_cy+20), (glow_cx, glow_cy), (glow_cx+15, glow_cy+20)], fill=(255, 220, 100, 40))

img = hero_bg(1920, 600, (5, 15, 25), (15, 40, 20), (10, 30, 15), camping_elements)
img.save(f"{HERO_DIR}/hero-camping.png")
print("✓ hero-camping.png — Forest night with tent glow")

# --- PESCA: River at golden hour with fishing scene ---
def pesca_elements(d, w, h):
    # Water
    d.rectangle([(0, h//2), (w, h)], fill=(0, 50, 80, 120))
    # Water reflections
    for _ in range(20):
        rx = random.randint(0, w)
        rw = random.randint(30, 100)
        y1 = h//2+random.randint(20, 200)
        d.rectangle([(rx, y1), (rx+rw, y1+5)], fill=(255, 200, 100, random.randint(3, 10)))
    # Distant shore
    d.arc([(-200, h//2-100), (w+200, h//2+50)], 0, 180, fill=(30, 70, 30, 80), width=random.randint(20, 40))
    # Sun at horizon
    d.ellipse([(w//2-40, h//2-60), (w//2+40, h//2+20)], fill=(255, 180, 50, 30))
    d.ellipse([(w//2-25, h//2-45), (w//2+25, h//2+5)], fill=(255, 200, 80, 50))
    # Fishing rod silhouette
    rod_x = w//4
    d.line([(rod_x-20, h//2+50), (rod_x-60, h//2-80)], fill=(0, 0, 0, 60), width=3)
    d.line([(rod_x-60, h//2-80), (rod_x-80, h//2-120)], fill=(0, 0, 0, 40), width=2)
    # Line
    d.line([(rod_x-80, h//2-120), (rod_x-40, h//2+10), (rod_x-30, h//2+20)], fill=(100, 100, 100, 30), width=1)

img = hero_bg(1920, 600, (60, 50, 30), (80, 100, 60), (40, 50, 30), pesca_elements)
img.save(f"{HERO_DIR}/hero-pesca.png")
print("✓ hero-pesca.png — River golden hour with fishing") 

# --- OUTDOOR: Mountain trail with backpack ---
def outdoor_elements(d, w, h):
    # Mountain silhouettes
    d.polygon([(0, h//2), (w//4, h//2-150), (w//2, h//2)], fill=(30, 50, 20, 80))
    d.polygon([(w//2, h//2), (3*w//4, h//2-200), (w, h//2)], fill=(25, 45, 20, 60))
    # Snow caps
    d.polygon([(w//4, h//2-150), (w//4-15, h//2-110), (w//4+15, h//2-110)], fill=(200, 220, 200, 60))
    d.polygon([(3*w//4, h//2-200), (3*w//4-20, h//2-150), (3*w//4+20, h//2-150)], fill=(200, 220, 200, 50))
    # Trail path
    for i in range(0, h, 20):
        tx = w//2 + int(math.sin(i * 0.03) * 80)
        d.ellipse([(tx-3, h-i-5), (tx+3, h-i+5)], fill=(140, 110, 70, 40))
    # Backpack silhouette mid-trail
    bx, by = w//2+20, h//2+20
    d.rectangle([(bx-8, by-15), (bx+8, by+15)], fill=(0, 0, 0, 50))
    d.arc([(bx-10, by-18), (bx+10, by)], 180, 0, fill=(0, 0, 0, 50), width=3)

img = hero_bg(1920, 600, (50, 60, 80), (100, 120, 100), (40, 55, 35), outdoor_elements)
img.save(f"{HERO_DIR}/hero-outdoor.png")
print("✓ hero-outdoor.png — Mountain trail scene")

# --- AUTOS: Night highway with headlights ---
def autos_elements(d, w, h):
    # Road
    d.rectangle([(0, h//2+40), (w, h)], fill=(25, 25, 28, 180))
    # Road lines
    for x in range(0, w, 60):
        d.rectangle([(x, h//2+80), (x+30, h//2+84)], fill=(255, 255, 255, 20))
    # Headlight beams
    d.polygon([(100, h//2+40), (-200, h//2-80), (-100, h//2+40)], fill=(255, 220, 100, 8))
    d.polygon([(100, h//2+40), (-200, h//2+160), (-100, h//2+40)], fill=(255, 220, 100, 5))
    # Car silhouette
    d.rectangle([(50, h//2+25), (130, h//2+55)], fill=(0, 0, 0, 60))
    d.rectangle([(70, h//2+10), (115, h//2+25)], fill=(0, 0, 0, 50))
    # Headlights glow
    d.ellipse([(125, h//2+30), (140, h//2+45)], fill=(255, 220, 100, 40))
    d.ellipse([(55, h//2+32), (65, h//2+43)], fill=(255, 50, 50, 20))
    # Tail lights
    d.ellipse([(45, h//2+35), (52, h//2+45)], fill=(255, 0, 0, 30))

img = hero_bg(1920, 600, (10, 10, 20), (30, 20, 30), (20, 20, 25), autos_elements)
img.save(f"{HERO_DIR}/hero-autos.png")
print("✓ hero-autos.png — Night highway with headlights")

# --- MOTOS: Dirt road countryside ---
def motos_elements(d, w, h):
    # Rolling hills
    d.ellipse([(-200, h//2-120), (400, h//2+100)], fill=(50, 70, 35, 80))
    d.ellipse([(300, h//2-150), (800, h//2+80)], fill=(45, 65, 30, 70))
    d.ellipse([(700, h//2-100), (1200, h//2+100)], fill=(55, 75, 40, 60))
    # Dirt road
    d.polygon([(w//2-60, h), (w//2+60, h), (w//2+30, h//2), (w//2-30, h//2)], fill=(80, 70, 55, 100))
    # Dust
    for _ in range(15):
        dx = random.randint(w//2, w//2+200)
        dy = random.randint(h//2+40, h-40)
        dr = random.randint(10, 40)
        d.ellipse([(dx-dr, dy-dr//2), (dx+dr, dy+dr//2)], fill=(150, 130, 100, random.randint(10, 30)))
    # Motorcycle silhouette
    mx, my = w//2+50, h//2+30
    # Wheels
    d.ellipse([(mx-20, my-15), (mx-4, my+15)], fill=(0, 0, 0, 60))
    d.ellipse([(mx+10, my-15), (mx+26, my+15)], fill=(0, 0, 0, 60))
    # Body
    d.ellipse([(mx-5, my-12), (mx+20, my+5)], fill=(0, 0, 0, 50))
    d.line([(mx-5, my), (mx-25, my-10)], fill=(0, 0, 0, 40), width=3)
    
img = hero_bg(1920, 600, (80, 70, 50), (130, 120, 60), (60, 80, 40), motos_elements)
img.save(f"{HERO_DIR}/hero-motos.png")
print("✓ hero-motos.png — Dirt road countryside with bike")

# --- CAMPO: Rural farmland sunset ---
def campo_elements(d, w, h):
    # Rolling fields
    for x in range(-100, w, 200):
        fh = random.randint(40, 100)
        d.ellipse([(x, h-fh), (x+300, h+50)], fill=(50, 80, 35, 60))
    # Barn silhouette
    bx, by = w//3, h//2+20
    d.polygon([(bx-30, by+20), (bx, by-40), (bx+30, by+20)], fill=(30, 15, 15, 80))
    d.rectangle([(bx-25, by+20), (bx+25, by+50)], fill=(30, 15, 15, 70))
    # Fence
    for fx in range(w//2+50, w-50, 30):
        d.rectangle([(fx, h//2+10), (fx+3, h//2+30)], fill=(40, 30, 20, 60))
        d.line([(fx-5, h//2+15), (fx+8, h//2+15)], fill=(40, 30, 20, 50), width=2)
    # Sun
    d.ellipse([(w-200, 80), (w-100, 180)], fill=(255, 150, 50, 25))
    d.ellipse([(w-180, 100), (w-120, 160)], fill=(255, 180, 70, 35))
    # Clouds
    d.ellipse([(100, 60), (200, 100)], fill=(255, 200, 150, 20))
    d.ellipse([(150, 50), (250, 95)], fill=(255, 200, 150, 15))

img = hero_bg(1920, 600, (80, 60, 40), (160, 120, 60), (50, 70, 35), campo_elements)
img.save(f"{HERO_DIR}/hero-campo.png")
print("✓ hero-campo.png — Rural farmland sunset with barn")

print("\n=== ALL ASSETS GENERATED ===")
