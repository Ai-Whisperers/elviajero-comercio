"""
Replace all 17 programmatic PNGs with higher-quality AI-generated images.
Uses Replicate API if available, or falls back to richer Pillow renders.
"""

import os, requests, json, base64
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import io, math, random

BASE = "/root/elviajero-comercio/public/images"
GREEN = "#1B5E20"

# Check if Replicate API key is available
REPLICATE_KEY = os.environ.get("REPLICATE_API_TOKEN") or ""
HAS_REPLICATE = bool(REPLICATE_KEY)

def call_replicate(prompt, width, height, output_path):
    """Call Replicate Flux model for image generation."""
    if not HAS_REPLICATE:
        return False
    
    try:
        resp = requests.post(
            "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions",
            headers={"Authorization": f"Bearer {REPLICATE_KEY}", "Content-Type": "application/json"},
            json={
                "input": {
                    "prompt": prompt,
                    "aspect_ratio": f"{width}:{height}",
                    "output_format": "png",
                    "raw": False
                }
            },
            timeout=30
        )
        if resp.status_code != 201:
            print(f"  Replicate error {resp.status_code}: {resp.text[:200]}")
            return False
        
        url = resp.json().get("urls", {}).get("get")
        if not url:
            return False
        
        # Poll for completion
        for _ in range(30):
            poll = requests.get(url, headers={"Authorization": f"Bearer {REPLICATE_KEY}"}, timeout=10).json()
            if poll.get("status") == "succeeded":
                img_url = poll.get("output", [None])
                if isinstance(img_url, list):
                    img_url = img_url[0] if img_url else None
                if img_url:
                    img_data = requests.get(img_url, timeout=30).content
                    with open(output_path, "wb") as f:
                        f.write(img_data)
                    return True
            elif poll.get("status") == "failed":
                return False
            import time
            time.sleep(2)
    except Exception as e:
        print(f"  Replicate error: {e}")
    return False

def render_fallback_icon(path, label, color=GREEN):
    """Rich fallback if Replicate unavailable — colored circle with icon hint."""
    img = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Gradient circle bg
    for r in range(64, 0, -1):
        t = r / 64
        shade = (int(27 + (50-27) * t), int(94 + (130-94) * t), int(32 + (50-32) * t))
        draw.ellipse([(64-r, 64-r), (64+r, 64+r)], fill=shade)
    
    # White shape
    if label == "camping":
        draw.polygon([(30, 90), (64, 25), (98, 90)], fill=(255,255,255,200))
        draw.polygon([(45, 90), (64, 50), (83, 90)], fill=(255,255,255,80))
    elif label == "pesca":
        draw.ellipse([(35, 50), (85, 90)], fill=(255,255,255,180))
        draw.polygon([(85, 70), (105, 50), (105, 90)], fill=(255,255,255,180))
    elif label in ["playa-pesca"]:
        draw.pieslice([(30, 30), (98, 80)], 180, 0, fill=(255,255,255,180))
        draw.line([(64, 80), (64, 105)], fill=(255,255,255,150), width=3)
    elif label in ["accesorios", "outdoor"]:
        draw.rectangle([(40, 40), (88, 95)], fill=(255,255,255,180))
        draw.arc([(38, 35), (90, 70)], 180, 0, fill=(255,255,255,180), width=4)
    elif label == "autos":
        draw.rectangle([(25, 60), (103, 85)], fill=(255,255,255,180))
        draw.rectangle([(40, 35), (80, 60)], fill=(255,255,255,160))
        draw.ellipse([(35, 80), (55, 100)], fill=(0,0,0))
        draw.ellipse([(73, 80), (93, 100)], fill=(0,0,0))
    elif label == "motos":
        draw.ellipse([(80, 75), (110, 105)], fill=(0,0,0))
        draw.ellipse([(40, 75), (70, 105)], fill=(0,0,0))
        draw.ellipse([(50, 55), (85, 85)], fill=(255,255,255,180))
        draw.line([(55, 55), (30, 35)], fill=(255,255,255,150), width=3)
    elif label == "campo":
        draw.polygon([(25, 60), (64, 20), (103, 60)], fill=(255,255,255,180))
        draw.rectangle([(30, 60), (98, 100)], fill=(255,255,255,160))
        draw.rectangle([(52, 70), (76, 100)], fill=(180,140,80,100))
    else:  # generic
        draw.ellipse([(30, 30), (98, 98)], fill=(255,255,255,180))
    
    # Soft glow
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    img.save(path, "PNG")
    print(f"  FALLBACK: {path} (label: {label})")

# ============================================================
# Generate 7 category icons (128x128)
# ============================================================
print("=== Category Icons (128x128) ===")
icons = [
    ("camping", "Flat vector icon of a mountain tent, minimal style, white silhouette on dark green circular background, clean lines, high contrast, 128x128"),
    ("pesca", "Flat vector icon of a fish jumping out of water, white silhouette on dark green circular background, minimal, clean, 128x128"),
    ("playa-pesca", "Flat vector icon of a beach umbrella, white on dark green circle, minimal, 128x128"),
    ("accesorios", "Flat vector icon of a hiking backpack, white silhouette on dark green circle, minimal, 128x128"),
    ("autos", "Flat vector icon of a car side view, white on dark green circle, minimal, 128x128"),
    ("motos", "Flat vector icon of a motorcycle side view, white on dark green circle, minimal, 128x128"),
    ("campo", "Flat vector icon of a barn, white silhouette on dark green circle, minimal, 128x128"),
]

for name, prompt in icons:
    path = f"{BASE}/icons/{name}.png"
    # Try AI, fallback to render
    if not call_replicate(prompt, 128, 128, path):
        render_fallback_icon(path, name)
print("---")

# ============================================================
# Generate 6 hero banners (1920x600)
# ============================================================
print("=== Hero Banners (1920x600) ===")
heroes = [
    ("hero-camping", "Wide landscape photograph of a campsite at night in a South American forest, a glowing tent with warm light inside, starry sky visible through tree canopy, mist on the ground, dark moody atmosphere, cinematic quality, 1920x600"),
    ("hero-pesca", "Wide landscape photograph of a calm river at golden hour in Paraguay, a fishing rod silhouetted against the orange sunset sky, mist rising from the water, tropical vegetation on the banks, peaceful mood, 1920x600"),
    ("hero-outdoor", "Wide landscape photograph of a mountain trail in South America, a hiker with backpack walking towards a distant peak, morning light, dramatic clouds, green hills, adventure atmosphere, 1920x600"),
    ("hero-autos", "Wide photograph of a car driving on a highway at sunset, headlights cutting through evening light, dashboard view or road stretching ahead, warm golden tones, road trip mood, 1920x600"),
    ("hero-motos", "Wide landscape photograph of a motorcycle on a countryside dirt road in Paraguay, dust kicked up behind, golden afternoon sun, rolling green hills, freedom and adventure, 1920x600"),
    ("hero-campo", "Wide landscape photograph of a Paraguayan farm at sunset, a rustic barn silhouette, cattle grazing, golden light, rolling hills, peaceful rural atmosphere, 1920x600"),
]

for name, prompt in heroes:
    path = f"{BASE}/marketing/{name}.png"
    if not call_replicate(prompt, 1920, 600, path):
        # Fallback: use existing file (the better Pillow one we already generated)
        print(f"  KEEP EXISTING: {path}")
print("---")

# ============================================================
# Generate 4 testimonial avatars (200x200)
# ============================================================
print("=== Testimonial Avatars (200x200) ===")
avatars = [
    ("avatar-carlos", "Professional headshot photo of a friendly Latino man in his 40s, warm smile, dark short hair with grey temples, casual plaid shirt, natural outdoor lighting, blurred green forest background, trustworthy expression, 200x200"),
    ("avatar-maria", "Professional headshot photo of a friendly Latina woman in her 30s, warm smile, long dark hair tied back, white blouse, natural lighting, blurred river background, approachable, 200x200"),
    ("avatar-luis", "Professional headshot photo of a confident Latino man in his 30s, short beard, short dark hair, denim jacket, outdoor lighting, blurred camping background, adventurous look, 200x200"),
    ("avatar-ana", "Professional headshot photo of a warm Latina woman in her 50s, genuine smile, grey-streaked dark hair in a bun, colorful scarf, natural outdoor lighting, blurred garden background, maternal, trustworthy, 200x200"),
]

for name, prompt in avatars:
    path = f"{BASE}/testimonials/{name}.png"
    if not call_replicate(prompt, 200, 200, path):
        # Keep existing placeholder
        print(f"  KEEP EXISTING: {path}")
print("---")

# ============================================================
# Generate PWA icons (192/512) from SVG -> high quality render
# ============================================================
print("=== PWA Icons ===")
# Render from the SVG logo programmatically with anti-aliasing
for size in [192, 512]:
    path = f"{BASE}/icon-{size}.png"
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    rr = size // 5
    draw.rounded_rectangle([(0, 0), (size, size)], radius=rr, fill="#1B5E20")
    
    cx, cy = size // 2, size // 2
    s = size
    
    # Mountain
    draw.polygon([(cx - s//3, cy + s//5), (cx, cy - s//3), (cx + s//3, cy + s//5)], fill=(255,255,255,240))
    draw.polygon([(cx, cy - s//3), (cx - s//8, cy - s//10), (cx + s//8, cy - s//10)], fill=(200,230,201))
    
    # Trail
    tw = max(2, s // 20)
    draw.line([(cx + tw, cy - s//10), (cx + tw*2, cy + 5), (cx - tw, cy + s//6), (cx + tw, cy + s//4), (cx - tw, cy + s//5)], 
              fill=(255, 180, 0), width=tw)
    
    # Sun
    sr = s // 14
    draw.ellipse([(cx + s//3 - sr, cy - s//3 - sr), (cx + s//3 + sr, cy - s//3 + sr)], fill="#FFB300")
    
    img = img.filter(ImageFilter.GaussianBlur(radius=0.8))
    img.save(path, "PNG")
    print(f"  RENDERED: {path} ({size}x{size})")
print("---")

print("\nDone!")
