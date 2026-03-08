"""
Generate AI images for PixelCode Studio portfolio using apifree.ai Nano Banana PRO
"""
import requests
import base64
import os
import time

API_URL = "https://api.apifree.ai/v1/chat/completions"
API_KEY = "sk-p12SszSDZGcE5rEJ0RXMXYKQFHMMF"
MODEL = "google/nano-banana-pro"
OUT_DIR = r"c:\Users\Administrador\Desktop\portifolio\public\images"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}


def generate_image(prompt: str, output_path: str, size: str = "1024x1024"):
    """Generate one image via Nano Banana PRO and save to disk."""
    print(f"  Generating: {os.path.basename(output_path)}...")
    body = {"model": MODEL, "prompt": prompt, "n": 1, "size": size}
    try:
        r = requests.post(API_URL, headers=HEADERS, json=body, timeout=120)
        data = r.json()
        if data.get("code") != 200:
            print(f"    ERROR: {data.get('error', data)}")
            return False

        b64 = data["resp_data"]["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(base64.b64decode(b64))
        fsize = os.path.getsize(output_path)
        print(f"    OK ({fsize // 1024}KB)")
        return True
    except Exception as e:
        print(f"    ERROR: {e}")
        return False


def main():
    print("=" * 60)
    print("PixelCode Studio - AI Image Generation Pipeline")
    print("Model: Nano Banana PRO (Google)")
    print("=" * 60)

    images = [
        # Loading screen background
        {
            "prompt": "abstract dark minimalist background, subtle geometric lines and nodes connected like a constellation, deep black with very faint blue-gray wireframe grid perspective, digital technology feel, clean modern aesthetic, 4k, no text, no watermark",
            "path": os.path.join(OUT_DIR, "loading-bg.png"),
            "size": "1536x1024",
        },
        # Hero section abstract visual
        {
            "prompt": "abstract minimalist 3D geometric composition, floating translucent glass cubes and spheres, very light gray and white background, soft shadows, subtle iridescent reflections, premium editorial design aesthetic, clean modern art, no text, 4k",
            "path": os.path.join(OUT_DIR, "hero-abstract.png"),
            "size": "1536x1024",
        },
        # About section - workspace/developer desk
        {
            "prompt": "top down view of a clean minimalist workspace desk, macbook laptop showing code editor with dark theme, cup of coffee, small succulent plant, mechanical keyboard, wireless mouse, clean white desk surface, soft lighting, professional product photography, editorial style, no person, 4k",
            "path": os.path.join(OUT_DIR, "workspace.png"),
            "size": "1024x1024",
        },
        # Contact section background pattern
        {
            "prompt": "abstract geometric pattern, thin dark lines forming interconnected triangles and polygons on off-white cream background, minimalist generative art, subtle mathematical precision, clean modern design, seamless tileable pattern, no text, 4k",
            "path": os.path.join(OUT_DIR, "pattern-contact.png"),
            "size": "1024x1024",
        },
        # Process section icon images
        {
            "prompt": "single minimalist 3D icon of a magnifying glass scanning a wireframe website layout, isometric view, soft white background, subtle glass material, premium app icon style, no text, centered, clean, 4k",
            "path": os.path.join(OUT_DIR, "process", "discovery.png"),
            "size": "1024x1024",
        },
        {
            "prompt": "single minimalist 3D icon of architectural blueprint paper with pencil and ruler, isometric view, soft white background, subtle glass material, premium app icon style, no text, centered, clean, 4k",
            "path": os.path.join(OUT_DIR, "process", "strategy.png"),
            "size": "1024x1024",
        },
        {
            "prompt": "single minimalist 3D icon of a paint palette with brush creating colorful UI interface, isometric view, soft white background, subtle glass material, premium app icon style, no text, centered, clean, 4k",
            "path": os.path.join(OUT_DIR, "process", "design.png"),
            "size": "1024x1024",
        },
        {
            "prompt": "single minimalist 3D icon of code brackets with glowing lightning bolt, isometric view, soft white background, subtle glass material, premium app icon style, no text, centered, clean, 4k",
            "path": os.path.join(OUT_DIR, "process", "code.png"),
            "size": "1024x1024",
        },
        {
            "prompt": "single minimalist 3D icon of a rocket launching from a laptop screen, isometric view, soft white background, subtle glass material, premium app icon style, no text, centered, clean, 4k",
            "path": os.path.join(OUT_DIR, "process", "launch.png"),
            "size": "1024x1024",
        },
    ]

    success = 0
    total = len(images)

    for i, img in enumerate(images):
        print(f"\n[{i+1}/{total}]")
        if generate_image(img["prompt"], img["path"], img["size"]):
            success += 1
        time.sleep(2)  # rate limit

    print(f"\n{'=' * 60}")
    print(f"Done! {success}/{total} images generated successfully.")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
