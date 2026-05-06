"""
Generate improved SVGs for:
1. logo.svg — proper brand logo with mountain + tent icon
2. favicon.svg — branded favicon (mountain silhouette green square)
3. og-viajero.svg — proper Open Graph image
4. 6 category background SVGs — replace emoji with vector illustrations of category items
5. icon-192.png, icon-512.png — PWA icons from favicon SVG
"""
import os, subprocess
from PIL import Image, ImageDraw

BASE = "/root/elviajero-comercio/public/images"
GREEN = "#1B5E20"
BLUE = "#1565C0"
DARK = "#37474F"
GOLD = "#FFB300"

# ============================================================
# 1. IMPROVED LOGO SVG
# ============================================================
LOGO = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64" fill="none">
  <defs>
    <linearGradient id="mountGrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#1B5E20"/>
      <stop offset="100%" stop-color="#2E7D32"/>
    </linearGradient>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8F5E9"/>
      <stop offset="100%" stop-color="#C8E6C9"/>
    </linearGradient>
  </defs>
  <!-- Background circle -->
  <circle cx="28" cy="32" r="24" fill="url(#skyGrad)" stroke="#1B5E20" stroke-width="1.5"/>
  <!-- Mountain range back -->
  <path d="M4 44 L14 20 L24 44Z" fill="#4CAF50" opacity="0.3"/>
  <!-- Main mountain -->
  <path d="M8 44 L20 14 L32 44Z" fill="url(#mountGrad)"/>
  <!-- Snow cap -->
  <path d="M20 14 L17 24 L23 24Z" fill="white" opacity="0.7"/>
  <!-- Sun -->
  <circle cx="34" cy="14" r="5" fill="#FFB300" opacity="0.6"/>
  <!-- Trail path -->
  <path d="M32 44 Q28 38 32 34 Q36 30 32 26" stroke="#8D6E63" stroke-width="1" fill="none" opacity="0.4"/>
  <!-- Tent -->
  <path d="M26 44 L30 36 L34 44Z" fill="#37474F"/>
  <path d="M28 44 L30 39 L32 44Z" fill="white" opacity="0.3"/>
  <!-- Pine tree right -->
  <rect x="36" y="34" width="2" height="6" fill="#37474F"/>
  <polygon points="35,34 37,28 39,34" fill="#1B5E20" opacity="0.6"/>
  <!-- Company name -->
  <text x="60" y="34" font-family="'Poppins',sans-serif" font-size="22" font-weight="700" fill="#1B5E20" letter-spacing="-0.5">El Viajero</text>
  <!-- Tagline -->
  <text x="60" y="50" font-family="'Inter',sans-serif" font-size="10" fill="#37474F" opacity="0.8">Todo para tu aventura · Paraguay</text>
</svg>"""

with open(f"{BASE}/logo.svg", "w") as f:
    f.write(LOGO)
print("logo.svg ✓")

# ============================================================
# 2. IMPROVED FAVICON SVG
# ============================================================
FAVICON = """<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="favGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2E7D32"/>
      <stop offset="100%" stop-color="#1B5E20"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#favGrad)"/>
  <!-- Mountain icon -->
  <path d="M12 48 L22 20 L32 48Z" fill="white" opacity="0.9"/>
  <!-- Snow cap -->
  <path d="M22 20 L19 30 L25 30Z" fill="#C8E6C9"/>
  <!-- Tent -->
  <path d="M20 42 L24 34 L28 42Z" fill="white" opacity="0.7"/>
  <path d="M22 42 L24 37 L26 42Z" fill="#1B5E20" opacity="0.3"/>
  <!-- Sun -->
  <circle cx="38" cy="18" r="5" fill="#FFB300" opacity="0.8"/>
</svg>"""

with open(f"{BASE}/favicon.svg", "w") as f:
    f.write(FAVICON)
print("favicon.svg ✓")

# ============================================================
# 3. IMPROVED OG IMAGE SVG
# ============================================================
OG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ogBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1B5E20"/>
      <stop offset="40%" stop-color="#2E7D32"/>
      <stop offset="100%" stop-color="#1565C0"/>
    </linearGradient>
    <linearGradient id="ogSun" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5" gradientUnits="objectBoundingBox" spreadMethod="pad">
      <stop offset="0%" stop-color="#FFB300"/>
      <stop offset="100%" stop-color="#FF8F00"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogBg)"/>
  
  <!-- Decorative mountains layer 1 -->
  <path d="M0 630 L80 480 L160 550 L280 400 L400 520 L520 350 L640 490 L760 380 L880 510 L1000 360 L1120 480 L1200 420 L1200 630Z" fill="white" opacity="0.06"/>
  <!-- Decorative mountains layer 2 -->
  <path d="M0 630 L120 520 L240 580 L360 450 L480 560 L600 400 L720 530 L840 440 L960 540 L1080 470 L1200 530 L1200 630Z" fill="white" opacity="0.04"/>
  
  <!-- Sun circle top right -->
  <circle cx="950" cy="180" r="60" fill="#FFB300" opacity="0.15"/>
  <circle cx="950" cy="180" r="40" fill="#FFB300" opacity="0.25"/>
  <circle cx="950" cy="180" r="20" fill="#FFB300" opacity="0.4"/>
  
  <!-- Logo area - mountain with tent icon -->
  <rect x="100" y="200" width="90" height="90" rx="18" fill="white" opacity="0.15"/>
  <path d="M110 270 L130 225 L150 270Z" fill="white" opacity="0.95"/>
  <path d="M130 225 L127 238 L133 238Z" fill="#C8E6C9"/>
  <path d="M122 268 L126 258 L130 268Z" fill="white" opacity="0.7"/>
  <circle cx="155" cy="220" r="10" fill="#FFB300" opacity="0.7"/>
  
  <!-- Title -->
  <text x="220" y="248" font-family="'Poppins',sans-serif" font-size="52" fill="white" font-weight="bold">El Viajero</text>
  <text x="220" y="290" font-family="'Inter',sans-serif" font-size="22" fill="white" opacity="0.9">Todo para tu aventura al aire libre</text>
  
  <!-- Category tags -->
  <g transform="translate(100, 380)">
    <rect x="0" y="0" width="120" height="36" rx="18" fill="white" opacity="0.12"/>
    <text x="60" y="24" font-family="sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="500">🏕️ Camping</text>
    <rect x="135" y="0" width="110" height="36" rx="18" fill="white" opacity="0.12"/>
    <text x="190" y="24" font-family="sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="500">🎣 Pesca</text>
    <rect x="260" y="0" width="130" height="36" rx="18" fill="white" opacity="0.12"/>
    <text x="325" y="24" font-family="sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="500">🎒 Outdoor</text>
    <rect x="405" y="0" width="140" height="36" rx="18" fill="white" opacity="0.12"/>
    <text x="475" y="24" font-family="sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="500">🚗 Automóviles</text>
  </g>
  
  <!-- Address -->
  <text x="100" y="480" font-family="sans-serif" font-size="18" fill="white" opacity="0.6">Mariano Roque Alonso · Paraguay</text>
  
  <!-- URL -->
  <text x="1100" y="590" font-family="monospace" font-size="16" fill="white" opacity="0.35" text-anchor="end">el-viajero.paragu-ai.com</text>
  
  <!-- Decorative bottom wave -->
  <path d="M0 610 Q200 580 400 600 Q600 620 800 595 Q1000 570 1200 590 L1200 630 L0 630Z" fill="white" opacity="0.03"/>
</svg>"""

with open(f"{BASE}/og-viajero.svg", "w") as f:
    f.write(OG)
print("og-viajero.svg ✓")

# ============================================================
# 4. CATEGORY BACKGROUND SVGs — replace emoji text with real vectors
# ============================================================

# Camping — Tent in forest
CAT_CAMPING = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 267">
  <defs>
    <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8F5E9"/>
      <stop offset="100%" stop-color="#A5D6A7"/>
    </linearGradient>
  </defs>
  <rect width="400" height="267" fill="url(#cg1)"/>
  <!-- Trees -->
  <rect x="30" y="120" width="6" height="50" fill="#5D4037"/>
  <polygon points="10,120 33,70 56,120" fill="#388E3C"/>
  <rect x="340" y="100" width="7" height="60" fill="#5D4037"/>
  <polygon points="320,100 343,45 366,100" fill="#2E7D32"/>
  <rect x="370" y="130" width="5" height="40" fill="#5D4037"/>
  <polygon points="355,130 373,90 390,130" fill="#43A047"/>
  <!-- Tent -->
  <polygon points="120,180 200,80 280,180" fill="#1B5E20" opacity="0.85"/>
  <polygon points="150,180 200,110 250,180" fill="#C8E6C9" opacity="0.3"/>
  <!-- Tent pole -->
  <line x1="200" y1="80" x2="200" y2="180" stroke="#5D4037" stroke-width="1.5" opacity="0.4"/>
  <!-- Ground -->
  <rect x="0" y="180" width="400" height="87" fill="#388E3C" opacity="0.3"/>
  <!-- Campfire -->
  <ellipse cx="310" cy="190" rx="10" ry="5" fill="#5D4037"/>
  <path d="M310 190 Q305 170 310 160 Q315 170 310 190" fill="#FF6D00" opacity="0.7"/>
  <path d="M310 190 Q307 175 310 168 Q313 175 310 190" fill="#FFB300" opacity="0.5"/>
  <!-- Stars -->
  <circle cx="50" cy="30" r="1.5" fill="#FFF9C4"/>
  <circle cx="150" cy="20" r="1" fill="#FFF9C4"/>
  <circle cx="280" cy="35" r="1.5" fill="#FFF9C4"/>
  <circle cx="350" cy="25" r="1" fill="#FFF9C4"/>
  <!-- Moon -->
  <circle cx="80" cy="40" r="12" fill="#FFF9C4" opacity="0.4"/>
  <circle cx="86" cy="38" r="10" fill="#A5D6A7"/>
</svg>"""

with open(f"{BASE}/categories/camping.svg", "w") as f:
    f.write(CAT_CAMPING)
print("categories/camping.svg ✓")

# Pesca — Fishing scene with rod
CAT_PESCA = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 267">
  <defs>
    <linearGradient id="pg1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#B3E5FC"/>
      <stop offset="100%" stop-color="#81D4FA"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0288D1"/>
      <stop offset="100%" stop-color="#01579B"/>
    </linearGradient>
  </defs>
  <rect width="400" height="267" fill="url(#pg1)"/>
  <!-- Water -->
  <rect x="0" y="140" width="400" height="127" fill="url(#water)" opacity="0.5"/>
  <!-- Waves -->
  <path d="M0 155 Q50 148 100 155 Q150 162 200 155 Q250 148 300 155 Q350 162 400 155" stroke="white" stroke-width="1" fill="none" opacity="0.3"/>
  <path d="M0 175 Q50 168 100 175 Q150 182 200 175 Q250 168 300 175 Q350 182 400 175" stroke="white" stroke-width="1" fill="none" opacity="0.2"/>
  <!-- Shore/grass -->
  <path d="M0 140 Q100 130 200 140 Q300 150 400 140 L400 0 L0 0Z" fill="#4CAF50" opacity="0.6"/>
  <path d="M0 140 Q100 130 200 140 Q300 150 400 140" stroke="#388E3C" stroke-width="2" fill="none"/>
  <!-- Fishing rod -->
  <line x1="120" y1="180" x2="80" y2="60" stroke="#5D4037" stroke-width="3" stroke-linecap="round"/>
  <line x1="80" y1="60" x2="60" y2="30" stroke="#5D4037" stroke-width="1.5"/>
  <!-- Fishing line -->
  <path d="M60 30 Q55 100 80 160 Q90 180 100 175" stroke="#90A4AE" stroke-width="0.8" fill="none"/>
  <!-- Bobber -->
  <circle cx="100" cy="175" r="4" fill="#F44336"/>
  <circle cx="100" cy="173" r="2" fill="white" opacity="0.6"/>
  <!-- Sun -->
  <circle cx="340" cy="50" r="20" fill="#FFB300" opacity="0.3"/>
  <circle cx="340" cy="50" r="14" fill="#FFC107" opacity="0.5"/>
  <!-- Clouds -->
  <ellipse cx="250" cy="50" rx="30" ry="10" fill="white" opacity="0.4"/>
  <ellipse cx="270" cy="48" rx="20" ry="8" fill="white" opacity="0.3"/>
</svg>"""

with open(f"{BASE}/categories/pesca.svg", "w") as f:
    f.write(CAT_PESCA)
print("categories/pesca.svg ✓")

# Outdoor — Backpack with gear
CAT_OUTDOOR = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 267">
  <defs>
    <linearGradient id="og1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF3E0"/>
      <stop offset="100%" stop-color="#FFE0B2"/>
    </linearGradient>
  </defs>
  <rect width="400" height="267" fill="url(#og1)"/>
  <!-- Backpack body -->
  <rect x="140" y="70" width="120" height="130" rx="12" fill="#FF6F00" opacity="0.85"/>
  <!-- Backpack flap -->
  <path d="M140 85 Q200 60 260 85" fill="#E65100" opacity="0.7"/>
  <!-- Backpack pocket -->
  <rect x="160" y="105" width="80" height="60" rx="6" fill="#FF8F00" opacity="0.5"/>
  <!-- Backpack straps -->
  <path d="M150 80 Q145 130 155 170" stroke="#5D4037" stroke-width="4" fill="none" opacity="0.4"/>
  <path d="M250 80 Q255 130 245 170" stroke="#5D4037" stroke-width="4" fill="none" opacity="0.4"/>
  <!-- Water bottle side -->
  <rect x="262" y="100" width="20" height="50" rx="4" fill="#0288D1" opacity="0.7"/>
  <rect x="262" y="100" width="20" height="10" rx="3" fill="#01579B" opacity="0.5"/>
  <!-- Compass -->
  <circle cx="210" cy="130" r="15" fill="white" opacity="0.4"/>
  <circle cx="210" cy="130" r="12" fill="#E0E0E0" opacity="0.5"/>
  <path d="M210 120 L210 140 M200 130 L220 130" stroke="#F44336" stroke-width="1.5" opacity="0.4"/>
  <!-- Ground shadow -->
  <ellipse cx="200" cy="200" rx="100" ry="10" fill="#5D4037" opacity="0.08"/>
  <!-- Pine trees background -->
  <polygon points="50,200 65,140 80,200" fill="#388E3C" opacity="0.3"/>
  <polygon points="320,200 338,120 356,200" fill="#2E7D32" opacity="0.25"/>
  <rect x="60" y="140" width="4" height="30" fill="#5D4037" opacity="0.2"/>
  <rect x="334" y="120" width="4" height="40" fill="#5D4037" opacity="0.2"/>
</svg>"""

with open(f"{BASE}/categories/outdoor.svg", "w") as f:
    f.write(CAT_OUTDOOR)
print("categories/outdoor.svg ✓")

# Automoviles — Car dash silhouette
CAT_AUTOS = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 267">
  <defs>
    <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ECEFF1"/>
      <stop offset="100%" stop-color="#CFD8DC"/>
    </linearGradient>
  </defs>
  <rect width="400" height="267" fill="url(#ag1)"/>
  <!-- Road -->
  <rect x="0" y="160" width="400" height="107" fill="#616161" opacity="0.15"/>
  <line x1="0" y1="210" x2="400" y2="210" stroke="white" stroke-width="1" opacity="0.15" stroke-dasharray="20,15"/>
  <!-- Car body -->
  <path d="M60 160 L80 120 L140 110 L260 110 L320 120 L340 160Z" fill="#1B5E20" opacity="0.85"/>
  <!-- Car roof -->
  <path d="M130 110 L160 60 L240 60 L270 110Z" fill="#1B5E20" opacity="0.8"/>
  <!-- Windows -->
  <path d="M135 108 L158 65 L195 65 L195 108Z" fill="#B3E5FC" opacity="0.5"/>
  <path d="M200 108 L200 65 L235 65 L265 108Z" fill="#B3E5FC" opacity="0.5"/>
  <!-- Headlights -->
  <ellipse cx="335" cy="140" rx="8" ry="5" fill="#FFD54F" opacity="0.6"/>
  <ellipse cx="65" cy="140" rx="6" ry="4" fill="#F44336" opacity="0.4"/>
  <!-- Wheels -->
  <circle cx="130" cy="165" r="18" fill="#212121"/>
  <circle cx="130" cy="165" r="10" fill="#424242"/>
  <circle cx="130" cy="165" r="4" fill="#757575"/>
  <circle cx="270" cy="165" r="18" fill="#212121"/>
  <circle cx="270" cy="165" r="10" fill="#424242"/>
  <circle cx="270" cy="165" r="4" fill="#757575"/>
  <!-- Headlight beams -->
  <path d="M340 140 L390 130 L390 150Z" fill="#FFD54F" opacity="0.08"/>
</svg>"""

with open(f"{BASE}/categories/autos.svg", "w") as f:
    f.write(CAT_AUTOS)
print("categories/autos.svg ✓")

# Motos — Motorcycle side view
CAT_MOTOS = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 267">
  <defs>
    <linearGradient id="mg1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FBE9E7"/>
      <stop offset="100%" stop-color="#FFCCBC"/>
    </linearGradient>
  </defs>
  <rect width="400" height="267" fill="url(#mg1)"/>
  <!-- Road -->
  <rect x="0" y="190" width="400" height="77" fill="#616161" opacity="0.12"/>
  <line x1="0" y1="230" x2="400" y2="230" stroke="white" stroke-width="1" opacity="0.1" stroke-dasharray="15,15"/>
  <!-- Motorcycle body -->
  <ellipse cx="250" cy="145" rx="45" ry="15" fill="#37474F" opacity="0.85"/>
  <!-- Frame -->
  <path d="M250 145 L180 120 L140 130 L120 145" stroke="#37474F" stroke-width="4" fill="none"/>
  <path d="M250 145 L230 120 L200 115 L180 120" stroke="#37474F" stroke-width="3" fill="none"/>
  <!-- Seat -->
  <ellipse cx="235" cy="118" rx="25" ry="6" fill="#5D4037"/>
  <!-- Handlebar -->
  <path d="M170 108 L155 95 L145 100" stroke="#37474F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Exhaust -->
  <path d="M260 155 L290 160 L290 170" stroke="#757575" stroke-width="3" fill="none"/>
  <!-- Front wheel -->
  <circle cx="130" cy="160" r="25" fill="#212121"/>
  <circle cx="130" cy="160" r="16" fill="#424242"/>
  <circle cx="130" cy="160" r="6" fill="#757575"/>
  <!-- Back wheel -->
  <circle cx="280" cy="160" r="25" fill="#212121"/>
  <circle cx="280" cy="160" r="16" fill="#424242"/>
  <circle cx="280" cy="160" r="6" fill="#757575"/>
  <!-- Spokes hint -->
  <line x1="130" y1="140" x2="130" y2="180" stroke="#616161" stroke-width="1" opacity="0.3"/>
  <line x1="110" y1="160" x2="150" y2="160" stroke="#616161" stroke-width="1" opacity="0.3"/>
  <line x1="280" y1="140" x2="280" y2="180" stroke="#616161" stroke-width="1" opacity="0.3"/>
  <line x1="260" y1="160" x2="300" y2="160" stroke="#616161" stroke-width="1" opacity="0.3"/>
  <!-- Speed lines -->
  <line x1="310" y1="135" x2="360" y2="135" stroke="#FF6D00" stroke-width="2" opacity="0.2" stroke-linecap="round"/>
  <line x1="320" y1="145" x2="370" y2="145" stroke="#FF6D00" stroke-width="1.5" opacity="0.15" stroke-linecap="round"/>
  <line x1="310" y1="155" x2="350" y2="155" stroke="#FF6D00" stroke-width="1" opacity="0.1" stroke-linecap="round"/>
</svg>"""

with open(f"{BASE}/categories/motos.svg", "w") as f:
    f.write(CAT_MOTOS)
print("categories/motos.svg ✓")

# Campo — Rural farm scene
CAT_CAMPO = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 267">
  <defs>
    <linearGradient id="fag1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8F5E9"/>
      <stop offset="50%" stop-color="#C8E6C9"/>
      <stop offset="100%" stop-color="#A5D6A7"/>
    </linearGradient>
  </defs>
  <rect width="400" height="267" fill="url(#fag1)"/>
  <!-- Sky gradient -->
  <rect x="0" y="0" width="400" height="140" fill="url(#fag1)"/>
  <!-- Field/green area -->
  <rect x="0" y="140" width="400" height="127" fill="#66BB6A" opacity="0.3"/>
  <!-- Rolling hills -->
  <path d="M0 140 Q100 100 200 140 Q300 180 400 140 L400 267 L0 267Z" fill="#81C784" opacity="0.2"/>
  <!-- Barn -->
  <polygon points="120,160 160,100 200,160" fill="#D32F2F" opacity="0.8"/>
  <rect x="120" y="160" width="80" height="60" fill="#C62828" opacity="0.85"/>
  <!-- Barn door -->
  <rect x="145" y="175" width="30" height="45" rx="2" fill="#5D4037" opacity="0.5"/>
  <!-- Hayloft window -->
  <rect x="155" y="120" width="12" height="14" rx="1" fill="#5D4037" opacity="0.3"/>
  <!-- Fence -->
  <line x1="40" y1="200" x2="100" y2="200" stroke="#5D4037" stroke-width="2" opacity="0.5"/>
  <line x1="40" y1="185" x2="100" y2="185" stroke="#5D4037" stroke-width="1.5" opacity="0.4"/>
  <line x1="55" y1="180" x2="55" y2="205" stroke="#5D4037" stroke-width="2" opacity="0.5"/>
  <line x1="85" y1="182" x2="85" y2="205" stroke="#5D4037" stroke-width="2" opacity="0.5"/>
  <!-- Tree -->
  <rect x="280" y="100" width="8" height="50" fill="#5D4037"/>
  <circle cx="284" cy="85" r="30" fill="#388E3C" opacity="0.7"/>
  <circle cx="270" cy="95" r="20" fill="#43A047" opacity="0.5"/>
  <circle cx="300" cy="90" r="22" fill="#2E7D32" opacity="0.5"/>
  <!-- Clouds -->
  <ellipse cx="300" cy="50" rx="40" ry="12" fill="white" opacity="0.4"/>
  <ellipse cx="330" cy="45" rx="25" ry="10" fill="white" opacity="0.3"/>
  <!-- Sun -->
  <circle cx="50" cy="50" r="18" fill="#FFB300" opacity="0.3"/>
  <circle cx="50" cy="50" r="12" fill="#FFC107" opacity="0.5"/>
</svg>"""

with open(f"{BASE}/categories/campo.svg", "w") as f:
    f.write(CAT_CAMPO)
print("categories/campo.svg ✓")

# ============================================================
# 5. PWA ICONS — render favicon SVG to PNG
# ============================================================
# We'll render using cairosvg or similar if available
# Otherwise create simple green icon PNGs

def create_pwa_icon(path, size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Green rounded rect background
    r = size // 4  # corner radius
    draw.rounded_rectangle([(0, 0), (size, size)], radius=size//5, fill="#1B5E20")
    
    # White mountain
    cx, cy = size//2, size//2
    # Mountain shape
    m_top = cy - size//4
    m_bot = cy + size//5
    draw.polygon([(cx - size//3, m_bot), (cx, m_top), (cx + size//3, m_bot)], fill=(255,255,255,230))
    # Snow cap
    snow_w = size // 8
    draw.polygon([(cx, m_top), (cx - snow_w, m_top + snow_w*2), (cx + snow_w, m_top + snow_w*2)], fill=(200, 230, 201))
    # Tent
    tent_top = cy - size//12
    tent_bot = m_bot - size//10
    draw.polygon([(cx - size//5, tent_bot), (cx, tent_top), (cx + size//5, tent_bot)], fill=(255,255,255,180))
    # Sun
    sun_r = size // 12
    draw.ellipse([(cx + size//4 - sun_r, cy - size//3 - sun_r), (cx + size//4 + sun_r, cy - size//3 + sun_r)], fill="#FFB300")
    
    img.save(path, "PNG")
    print(f"{path} ({size}x{size}) ✓")

create_pwa_icon(f"{BASE}/icon-192.png", 192)
create_pwa_icon(f"{BASE}/icon-512.png", 512)

print("\nAll assets regenerated!")
