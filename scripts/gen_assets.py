from PIL import Image, ImageDraw
import math

BG = (10, 10, 15, 255)
ACCENT_A = (79, 140, 255, 255)
ACCENT_B = (56, 214, 255, 255)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(4))


def gradient_polygon(draw, points, size):
    # approximate a linear gradient fill for the bolt by rasterizing per-row masks
    minx = min(p[0] for p in points)
    maxx = max(p[0] for p in points)
    mask = Image.new("L", (size, size), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.polygon(points, fill=255)

    grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grad)
    for x in range(size):
        t = max(0.0, min(1.0, (x - minx) / max(1, (maxx - minx))))
        color = lerp(ACCENT_A, ACCENT_B, t)
        gdraw.line([(x, 0), (x, size)], fill=color)

    result = Image.composite(grad, Image.new("RGBA", (size, size), (0, 0, 0, 0)), mask)
    return result


def bolt_points(size, scale=1.0, offset=(0, 0)):
    # Coordinates in a 64x64 design space, matching src/components/Logo.tsx
    raw = [(36, 4), (14, 34), (28, 34), (24, 60), (52, 26), (36, 26)]
    s = size / 64 * scale
    ox, oy = offset
    return [(x * s + ox, y * s + oy) for x, y in raw]


def make_icon(path, size, bg=True, padding_ratio=0.16):
    img = Image.new("RGBA", (size, size), BG if bg else (0, 0, 0, 0))
    pad = int(size * padding_ratio)
    inner = size - pad * 2
    points = bolt_points(inner, scale=1.0, offset=(pad, pad))
    bolt = gradient_polygon(ImageDraw.Draw(img), points, size)
    img.alpha_composite(bolt)
    img.convert("RGB" if bg else "RGBA").save(path)


def make_splash(path, size=1284):
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)
    # soft radial-ish vignette using concentric circles
    cx, cy = size // 2, int(size * 0.42)
    for r in range(int(size * 0.5), 0, -6):
        t = 1 - (r / (size * 0.5))
        alpha = int(18 * t)
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            outline=None,
            fill=(20, 30, 55, alpha),
        )
    bolt_size = int(size * 0.22)
    points = bolt_points(bolt_size, scale=1.0, offset=(cx - bolt_size * 0.68, cy - bolt_size * 0.5))
    bolt = gradient_polygon(draw, points, size)
    img.alpha_composite(bolt)
    img.convert("RGB").save(path)


make_icon("assets/icon.png", 1024, bg=True)
make_icon("assets/adaptive-icon.png", 1024, bg=False, padding_ratio=0.22)
make_icon("assets/favicon.png", 196, bg=True)
make_splash("assets/splash.png", 1284)

print("done")
