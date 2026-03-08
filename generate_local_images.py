"""Generate remaining images locally with Pillow for process icons and pattern"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, math, random

OUT = r"c:\Users\Administrador\Desktop\portifolio\public\images"

def create_process_icon(icon_char, label, filename, base_hue):
    """Create a premium 3D-style process icon"""
    size = 400
    img = Image.new("RGBA", (size, size), (250, 250, 250, 255))
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2

    # Outer subtle circle
    r = 160
    for i in range(r, r - 8, -1):
        alpha = int(20 + (r - i) * 3)
        draw.ellipse([cx - i, cy - i, cx + i, cy + i], outline=(220, 220, 220, alpha), width=1)

    # Inner gradient circle
    for i in range(120, 0, -1):
        t = i / 120
        gray = int(245 - t * 15)
        draw.ellipse([cx - i, cy - i, cx + i, cy + i], fill=(gray, gray, gray))

    # Small accent circle
    accent_r = 8
    draw.ellipse([cx + 80, cy - 100, cx + 80 + accent_r * 2, cy - 100 + accent_r * 2], fill=(10, 10, 10))

    # Large emoji/icon text
    try:
        font_large = ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", 80)
    except:
        font_large = ImageFont.load_default()

    try:
        font_label = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 22)
    except:
        font_label = ImageFont.load_default()

    # Draw icon
    draw.text((cx, cy - 20), icon_char, fill=(10, 10, 10), font=font_large, anchor="mm")
    # Draw label
    draw.text((cx, cy + 70), label, fill=(120, 120, 120), font=font_label, anchor="mm")

    # Add subtle shadow
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse([cx - 100, cy + 100, cx + 100, cy + 130], fill=(0, 0, 0, 15))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))

    final = Image.alpha_composite(shadow, img)
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    final.save(filename, "PNG")
    print(f"  Created: {os.path.basename(filename)} ({os.path.getsize(filename) // 1024}KB)")


def create_contact_pattern(filename):
    """Create geometric line pattern for contact section"""
    w, h = 1200, 1200
    img = Image.new("RGBA", (w, h), (250, 250, 250, 255))
    draw = ImageDraw.Draw(img)

    random.seed(42)

    # Generate points
    points = []
    grid = 12
    spacing = w // grid
    for gx in range(grid + 1):
        for gy in range(grid + 1):
            px = gx * spacing + random.randint(-20, 20)
            py = gy * spacing + random.randint(-20, 20)
            points.append((px, py))

    # Draw connections
    for i, p1 in enumerate(points):
        for j, p2 in enumerate(points):
            if i >= j:
                continue
            dist = math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)
            if dist < spacing * 1.6:
                alpha = max(10, min(40, int(60 - dist / 5)))
                draw.line([p1, p2], fill=(180, 180, 180, alpha), width=1)

    # Draw dots at points
    for p in points:
        r = random.choice([2, 3, 4])
        gray = random.randint(160, 200)
        draw.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=(gray, gray, gray))

    # A few accent dots
    for _ in range(15):
        p = random.choice(points)
        draw.ellipse([p[0] - 4, p[1] - 4, p[0] + 4, p[1] + 4], fill=(10, 10, 10, 60))

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    img.save(filename, "PNG")
    print(f"  Created: {os.path.basename(filename)} ({os.path.getsize(filename) // 1024}KB)")


def main():
    print("Generating process icons and pattern...")

    icons = [
        ("🔍", "Descoberta", os.path.join(OUT, "process", "discovery.png"), 200),
        ("📐", "Estratégia", os.path.join(OUT, "process", "strategy.png"), 40),
        ("🎨", "Design", os.path.join(OUT, "process", "design.png"), 280),
        ("⚡", "Código", os.path.join(OUT, "process", "code.png"), 50),
        ("🚀", "Lançamento", os.path.join(OUT, "process", "launch.png"), 10),
    ]

    for icon_char, label, path, hue in icons:
        create_process_icon(icon_char, label, path, hue)

    create_contact_pattern(os.path.join(OUT, "pattern-contact.png"))
    print("\nAll done!")


if __name__ == "__main__":
    main()
