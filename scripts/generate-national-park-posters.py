#!/usr/bin/env python3
"""Generate high-resolution National Park poster thumbnails.

This replaces the low-resolution photographic thumbnails in-place while keeping
the filenames used by the React app unchanged.
"""

from __future__ import annotations

import argparse
import hashlib
import math
import random
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PARK_LIST = ROOT / "src" / "data" / "parkList.js"
THUMBNAILS = ROOT / "public" / "thumbnails"

SIZE = 1200
DRAW_SIZE = 2400
S = DRAW_SIZE / SIZE

PALETTE = {
    "sky": "#c9dde2",
    "sky_deep": "#a9c8d1",
    "cloud": "#eef0e8",
    "sun": "#e5c485",
    "water": "#5f9eaa",
    "water_dark": "#3f7887",
    "water_light": "#8bbdc2",
    "forest": "#536f55",
    "forest_dark": "#314a3c",
    "forest_light": "#789070",
    "grass": "#a8a26f",
    "rock": "#a98b6d",
    "rock_light": "#d5b085",
    "sandstone": "#c77c4a",
    "sandstone_dark": "#9a563d",
    "sand": "#d8c68e",
    "dune": "#ece2bf",
    "snow": "#f0f0e9",
    "shadow": "#4b4f4c",
    "cave": "#2f302d",
    "lava": "#d25b38",
}


THEMES = {
    "Acadia": "coast",
    "American_Samoa": "tropical_coast",
    "Arches": "arch",
    "Badlands": "badlands",
    "Big_Bend": "big_bend",
    "Biscayne": "marine",
    "Black_Canyon": "dark_canyon",
    "Bryce_Canyon": "hoodoos",
    "Canyonlands": "canyon",
    "Capitol_Reef": "capitol_reef",
    "Carlsbad_Caverns": "cave",
    "Channel_Islands": "coast",
    "Congaree": "swamp",
    "Crater_Lake": "crater_lake",
    "Cuyahoga_Valley": "waterfall",
    "Death_Valley": "dunes",
    "Denali": "denali",
    "Dry_Tortugas": "fort_island",
    "Everglades": "wetlands",
    "Gates_of_the_Arctic": "arctic_tundra",
    "Gateway_Arch": "gateway_arch",
    "Glacier": "glacier_lake",
    "Glacier_Bay": "glacier_bay",
    "Grand_Canyon": "grand_canyon",
    "Grand_Teton": "grand_teton",
    "Great_Basin": "great_basin",
    "Great_Sand_Dunes": "dunes_mountains",
    "Great_Smoky_Mountains": "smoky",
    "Guadalupe_Mountains": "guadalupe",
    "Haleakal": "haleakala",
    "Hawaii_Volcanoes": "lava_volcano",
    "Hot_Springs": "hot_springs",
    "Indiana_Dunes": "dunes_lake",
    "Isle_Royale": "isle_royale",
    "Joshua_Tree": "joshua_tree",
    "Katmai": "katmai",
    "Kenai_Fjords": "glacier_fjord",
    "Kings_Canyon": "forest_canyon",
    "Kobuk_Valley": "kobuk_dunes",
    "Lake_Clark": "lake_clark",
    "Lassen_Volcanic": "volcano_lake",
    "Mammoth_Cave": "cave",
    "Mesa_Verde": "cliff_dwellings",
    "Mount_Rainier": "rainier",
    "New_River_Gorge": "bridge_river",
    "North_Cascades": "north_cascades",
    "Olympic": "olympic_rainforest",
    "Petrified_Forest": "painted_desert",
    "Pinnacles": "pinnacles",
    "Redwood": "redwood",
    "Rocky_Mountain": "rocky_mountain",
    "Saguaro": "saguaro",
    "Sequoia": "sequoia",
    "Shenandoah": "shenandoah",
    "Theodore_Roosevelt": "badlands_grass",
    "Virgin_Islands": "tropical_coast",
    "Voyageurs": "voyageurs",
    "White_Sands": "white_dunes",
    "Wind_Cave": "prairie_cave",
    "WrangellSt_Elias": "wrangell_icefield",
    "Yellowstone": "geyser",
    "Yosemite": "yosemite",
    "Zion": "zion",
}


def park_filename(name: str) -> str:
    sanitized = name.replace("’", "")
    sanitized = re.sub(r"[^\w\s]", "", sanitized, flags=re.ASCII)
    sanitized = re.sub(r"\s+", "_", sanitized)
    return f"{sanitized}_National_Park.jpg"


def park_key(name: str) -> str:
    return park_filename(name).removesuffix("_National_Park.jpg")


def read_park_names() -> list[str]:
    source = PARK_LIST.read_text(encoding="utf-8")
    match = re.search(r"export\s+const\s+PARK_NAMES\s*=\s*\[(.*?)\];", source, re.S)
    if not match:
        raise RuntimeError("Could not find PARK_NAMES in src/data/parkList.js")
    return re.findall(r'"([^"]+)"', match.group(1))


def seed_for(text: str) -> int:
    return int(hashlib.sha256(text.encode("utf-8")).hexdigest()[:8], 16)


class Poster:
    def __init__(self, seed: int):
        self.rng = random.Random(seed)
        self.image = Image.new("RGB", (DRAW_SIZE, DRAW_SIZE), PALETTE["sky"])
        self.draw = ImageDraw.Draw(self.image)

    def x(self, value: float) -> int:
        return round(value * DRAW_SIZE)

    def y(self, value: float) -> int:
        return round(value * DRAW_SIZE)

    def p(self, points: list[tuple[float, float]]) -> list[tuple[int, int]]:
        return [(self.x(x), self.y(y)) for x, y in points]

    def rect(self, box: tuple[float, float, float, float], fill: str) -> None:
        self.draw.rectangle([self.x(box[0]), self.y(box[1]), self.x(box[2]), self.y(box[3])], fill=fill)

    def ellipse(self, box: tuple[float, float, float, float], fill: str) -> None:
        self.draw.ellipse([self.x(box[0]), self.y(box[1]), self.x(box[2]), self.y(box[3])], fill=fill)

    def polygon(self, points: list[tuple[float, float]], fill: str) -> None:
        self.draw.polygon(self.p(points), fill=fill)

    def line(self, points: list[tuple[float, float]], fill: str, width: float, joint: str = "curve") -> None:
        self.draw.line(self.p(points), fill=fill, width=round(width * DRAW_SIZE), joint=joint)

    def rounded_rect(self, box: tuple[float, float, float, float], radius: float, fill: str) -> None:
        self.draw.rounded_rectangle(
            [self.x(box[0]), self.y(box[1]), self.x(box[2]), self.y(box[3])],
            radius=round(radius * DRAW_SIZE),
            fill=fill,
        )

    def finish(self) -> Image.Image:
        self.image = self.image.filter(ImageFilter.GaussianBlur(0.15 * S))
        out = self.image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
        arr = np.asarray(out).astype(np.int16)
        rng = np.random.default_rng(seed_for(str(self.rng.random())))
        noise = rng.normal(0, 1.2, size=arr.shape[:2] + (1,))
        arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
        return Image.fromarray(arr, "RGB")


def sky(c: Poster, *, sun: bool = True, horizon: float = 0.66) -> None:
    bands = [
        (0.0, 0.28, "#bed5dc"),
        (0.28, horizon, PALETTE["sky"]),
        (horizon, 1.0, "#d7d1b8"),
    ]
    for y0, y1, color in bands:
        c.rect((0, y0, 1, y1), color)
    if sun:
        sx = c.rng.uniform(0.16, 0.82)
        sy = c.rng.uniform(0.12, 0.28)
        c.ellipse((sx - 0.05, sy - 0.05, sx + 0.05, sy + 0.05), PALETTE["sun"])
    for _ in range(3):
        x = c.rng.uniform(0.08, 0.78)
        y = c.rng.uniform(0.16, 0.34)
        c.ellipse((x, y, x + 0.16, y + 0.035), "#dbe5e3")
    c.rect((0, horizon - 0.012, 1, horizon), "#d3e2df")


def water(c: Poster, y0: float, color: str = PALETTE["water"]) -> None:
    c.rect((0, y0, 1, 1), color)
    c.polygon([(0, y0 + 0.06), (1, y0 + 0.0), (1, 1), (0, 1)], PALETTE["water_dark"])
    for y in [y0 + 0.1, y0 + 0.2, y0 + 0.32]:
        c.line([(0.08, y), (0.28, y - 0.018), (0.48, y + 0.006), (0.7, y - 0.015), (0.92, y)], PALETTE["water_light"], 0.006)


def mountains(c: Poster, *, snow: bool = True, base: float = 0.78, colors: tuple[str, str, str] | None = None) -> None:
    colors = colors or ("#8fa4a0", "#6f8580", "#526b68")
    c.polygon([(0, base), (0.17, 0.43), (0.35, base), (0.53, 0.36), (0.78, base), (1, 0.49), (1, 1), (0, 1)], colors[0])
    c.polygon([(0, 0.86), (0.26, 0.50), (0.45, 0.88), (0.68, 0.40), (0.9, 0.86), (1, 0.58), (1, 1), (0, 1)], colors[1])
    c.polygon([(0.08, 0.92), (0.37, 0.47), (0.55, 0.92), (0.78, 0.37), (1, 0.88), (1, 1), (0.08, 1)], colors[2])
    if snow:
        c.polygon([(0.30, 0.58), (0.37, 0.47), (0.43, 0.58), (0.38, 0.55), (0.35, 0.61)], PALETTE["snow"])
        c.polygon([(0.70, 0.51), (0.78, 0.37), (0.88, 0.58), (0.80, 0.53), (0.75, 0.58)], PALETTE["snow"])


def forest(c: Poster, y0: float = 0.66, count: int = 18, tall: bool = False) -> None:
    c.rect((0, y0, 1, 1), "#789070")
    for i in range(count):
        x = (i + 0.25 + c.rng.random() * 0.5) / count
        h = c.rng.uniform(0.18, 0.34) if tall else c.rng.uniform(0.11, 0.22)
        base = c.rng.uniform(y0 + 0.12, 0.98)
        color = c.rng.choice([PALETTE["forest"], PALETTE["forest_dark"], "#667c5f"])
        c.rect((x - 0.006, base - h * 0.55, x + 0.006, base), "#775f49")
        c.polygon([(x, base - h), (x - 0.045, base - h * 0.44), (x + 0.045, base - h * 0.44)], color)
        c.polygon([(x, base - h * 0.75), (x - 0.06, base - h * 0.22), (x + 0.06, base - h * 0.22)], color)


def mesas(c: Poster, y0: float = 0.46) -> None:
    c.polygon([(0, 0.62), (0.09, y0), (0.24, y0), (0.29, 0.55), (0.45, 0.55), (0.52, 0.43), (0.72, 0.43), (0.78, 0.58), (1, 0.58), (1, 1), (0, 1)], PALETTE["sandstone"])
    c.polygon([(0, 0.72), (0.26, 0.58), (0.5, 0.68), (0.82, 0.54), (1, 0.66), (1, 1), (0, 1)], PALETTE["sandstone_dark"])
    for y, col in [(0.68, "#d79a64"), (0.76, "#8f5141"), (0.84, "#c98859")]:
        c.line([(0, y), (1, y - 0.035)], col, 0.012)


def canyon(c: Poster, grand: bool = False, dark: bool = False) -> None:
    sky(c, horizon=0.48)
    colors = ["#c98958", "#ad6948", "#8f5946"] if not dark else ["#64645d", "#4c4e4b", "#373a38"]
    c.polygon([(0, 0.43), (0.16, 0.38), (0.28, 0.42), (0.37, 0.36), (0.52, 0.42), (0.66, 0.35), (0.82, 0.41), (1, 0.37), (1, 1), (0, 1)], colors[0])
    c.polygon([(0, 0.58), (0.12, 0.47), (0.26, 0.53), (0.38, 0.46), (0.5, 0.6), (0.62, 0.48), (0.76, 0.61), (1, 0.48), (1, 1), (0, 1)], colors[1])
    c.polygon([(0, 1), (0, 0.72), (0.16, 0.56), (0.28, 0.88), (0.42, 0.6), (0.56, 0.94), (0.71, 0.57), (0.84, 0.9), (1, 0.62), (1, 1)], colors[2])
    c.polygon([(0, 1), (0.14, 0.76), (0.25, 1), (0.42, 0.72), (0.56, 1), (0.74, 0.69), (0.9, 1), (1, 0.78), (1, 1)], "#744a3e" if not dark else "#2f3332")
    if grand:
        for y, width in [(0.50, 0.009), (0.58, 0.012), (0.67, 0.009), (0.78, 0.012), (0.89, 0.009)]:
            c.line([(0.02, y), (0.28, y - 0.025), (0.55, y + 0.015), (0.98, y - 0.035)], "#dba46e", width)
    c.line([(0.32, 1.0), (0.42, 0.82), (0.52, 0.94), (0.64, 0.72), (0.74, 0.88), (0.83, 0.68)], PALETTE["water"], 0.022)


def arch(c: Poster) -> None:
    sky(c, horizon=0.64)
    mesas(c, 0.48)
    c.line([(0.27, 0.78), (0.33, 0.53), (0.48, 0.39), (0.64, 0.51), (0.73, 0.78)], "#c87848", 0.084)
    c.line([(0.37, 0.79), (0.42, 0.6), (0.5, 0.5), (0.59, 0.61), (0.66, 0.79)], "#c9dde2", 0.043)
    c.line([(0.31, 0.73), (0.39, 0.55), (0.5, 0.45), (0.63, 0.56), (0.7, 0.74)], "#d69259", 0.012)
    c.rect((0, 0.8, 1, 1), "#b98258")
    for x in [0.18, 0.82]:
        c.polygon([(x, 0.74), (x + 0.07, 0.8), (x + 0.03, 1), (x - 0.05, 1)], "#9d5d44")
    for x in [0.11, 0.2, 0.8, 0.9]:
        c.line([(x, 0.94), (x + 0.01, 0.86)], "#6e7a52", 0.008)


def hoodoos(c: Poster) -> None:
    sky(c, horizon=0.58)
    c.rect((0, 0.6, 1, 1), "#c48658")
    for i in range(14):
        x = 0.06 + i * 0.068 + c.rng.uniform(-0.01, 0.01)
        top = c.rng.uniform(0.38, 0.56)
        w = c.rng.uniform(0.025, 0.045)
        c.polygon([(x - w, 1), (x - w * 0.6, top), (x + w * 0.6, top), (x + w, 1)], c.rng.choice(["#d1915e", "#bf744d", "#e0a36b"]))
        c.rounded_rect((x - w * 0.9, top - 0.025, x + w * 0.9, top + 0.015), 0.01, "#a86246")
    forest(c, 0.78, 10)


def dunes(c: Poster, white: bool = False, mountains_back: bool = False, lake: bool = False) -> None:
    sky(c, horizon=0.56)
    if mountains_back:
        mountains(c, snow=False, base=0.68, colors=("#9aa08a", "#777d69", "#596858"))
    if lake:
        water(c, 0.58)
    base = PALETTE["dune"] if white else PALETTE["sand"]
    shade = "#cdbb82" if not white else "#d8d9cf"
    c.rect((0, 0.62, 1, 1), base)
    for y in [0.68, 0.77, 0.88]:
        c.polygon([(0, y), (0.22, y - 0.05), (0.48, y + 0.02), (0.74, y - 0.04), (1, y + 0.01), (1, 1), (0, 1)], shade)
    for x in [0.18, 0.44, 0.7]:
        c.line([(x, 0.66), (x + 0.16, 0.78), (x + 0.26, 0.94)], "#f4edd5" if not white else "#f5f3e8", 0.006)


def coast(c: Poster, tropical: bool = False) -> None:
    sky(c, horizon=0.52)
    water(c, 0.48, PALETTE["water_light"] if tropical else PALETTE["water"])
    hill = "#59745a" if tropical else "#8d8c77"
    c.polygon([(0, 0.52), (0.15, 0.38), (0.34, 0.48), (0.56, 0.34), (0.78, 0.46), (1, 0.36), (1, 0.58), (0, 0.68)], hill)
    c.polygon([(0, 0.75), (0.28, 0.62), (0.55, 0.7), (1, 0.55), (1, 1), (0, 1)], "#b79269")
    c.polygon([(0.12, 0.76), (0.34, 0.67), (0.48, 0.76), (0.22, 0.85)], "#786d5d")
    forest(c, 0.7 if tropical else 0.74, 12)


def cave(c: Poster) -> None:
    c.rect((0, 0, 1, 1), PALETTE["cave"])
    c.ellipse((-0.15, -0.1, 1.15, 1.2), "#46453e")
    c.ellipse((0.12, 0.18, 0.88, 0.9), "#2d2e2b")
    for i in range(12):
        x = 0.08 + i * 0.075
        h = c.rng.uniform(0.12, 0.32)
        c.polygon([(x - 0.02, 0.05), (x + 0.02, 0.05), (x + 0.005, h)], "#b18a68")
        c.polygon([(x - 0.02, 0.95), (x + 0.02, 0.95), (x + 0.003, 0.95 - h * 0.8)], "#9e765d")
    c.ellipse((0.36, 0.48, 0.64, 0.66), "#d3a46e")


def waterfall(c: Poster) -> None:
    sky(c, horizon=0.54)
    forest(c, 0.48, 24, tall=True)
    c.polygon([(0, 0.68), (0.34, 0.58), (0.66, 0.64), (1, 0.56), (1, 1), (0, 1)], "#8b7f68")
    c.rounded_rect((0.43, 0.42, 0.57, 1.0), 0.02, "#d7e9e9")
    c.line([(0.48, 0.42), (0.5, 0.8)], PALETTE["water_light"], 0.014)
    water(c, 0.82)


def swamp(c: Poster) -> None:
    c.rect((0, 0, 1, 0.58), "#b9d1c5")
    water(c, 0.58, "#4b6f69")
    for i in range(18):
        x = 0.03 + i * 0.056
        c.rect((x, 0.18, x + 0.014, 0.94), "#564934")
        c.ellipse((x - 0.055, 0.12, x + 0.07, 0.31), c.rng.choice(["#587155", "#476349", "#6e865f"]))
    c.line([(0.04, 0.72), (0.96, 0.62)], "#b99468", 0.018)


def badlands_scene(c: Poster, grass: bool = False) -> None:
    sky(c, sun=False, horizon=0.48)
    c.rect((0, 0.42, 1, 1), "#d7bd82" if grass else "#d3a06d")
    colors = ["#d59866", "#c47d58", "#b26650", "#e0bc83"]
    for i in range(11):
        x0 = i * 0.105 - 0.06
        x1 = x0 + 0.18
        top = 0.36 + (i % 4) * 0.035
        c.polygon([(x0, 1), (x0 + 0.04, top + 0.08), (x0 + 0.09, top), (x1 - 0.04, top + 0.12), (x1, 1)], colors[i % len(colors)])
    for y, col in [(0.5, "#efd09a"), (0.6, "#9a6558"), (0.71, "#e0ad77"), (0.83, "#9a6558")]:
        c.line([(0.02, y), (0.28, y - 0.02), (0.55, y + 0.01), (0.98, y - 0.018)], col, 0.01)
    if grass:
        c.rect((0, 0.82, 1, 1), "#9c9a66")
        for x in [0.1, 0.2, 0.32, 0.47, 0.63, 0.81, 0.93]:
            c.line([(x, 0.96), (x + 0.015, 0.84)], "#65704d", 0.006)


def capitol_reef_scene(c: Poster) -> None:
    sky(c, horizon=0.52)
    c.rect((0, 0.48, 1, 1), "#c7774b")
    c.polygon([(0, 0.58), (0.18, 0.42), (0.34, 0.58), (0.52, 0.36), (0.74, 0.58), (1, 0.4), (1, 1), (0, 1)], "#d99a62")
    c.ellipse((0.18, 0.33, 0.5, 0.72), "#dcb57d")
    c.ellipse((0.52, 0.31, 0.86, 0.72), "#d8ad77")
    for y in [0.55, 0.64, 0.74, 0.84]:
        c.line([(0, y), (0.34, y - 0.025), (0.68, y + 0.018), (1, y - 0.02)], "#9b5d43", 0.012)
    c.line([(0.12, 1), (0.36, 0.8), (0.58, 0.9), (0.86, 0.72)], "#6f9a9a", 0.015)


def big_bend_scene(c: Poster) -> None:
    sky(c, horizon=0.58)
    c.rect((0, 0.72, 1, 1), "#c8b276")
    c.polygon([(0, 0.7), (0.2, 0.46), (0.36, 0.66), (0.52, 0.42), (0.72, 0.68), (1, 0.48), (1, 1), (0, 1)], "#796e5d")
    c.polygon([(0.1, 0.75), (0.32, 0.54), (0.5, 0.77), (0.73, 0.52), (0.95, 0.76), (1, 1), (0.1, 1)], "#9a6a4f")
    c.line([(0.05, 0.95), (0.25, 0.83), (0.46, 0.9), (0.68, 0.79), (0.95, 0.86)], PALETTE["water"], 0.02)
    for x in [0.16, 0.84]:
        c.rounded_rect((x - 0.012, 0.72, x + 0.012, 0.94), 0.01, "#687650")
        c.line([(x, 0.81), (x + 0.05, 0.78)], "#687650", 0.012)


def denali_scene(c: Poster) -> None:
    sky(c, sun=False, horizon=0.55)
    c.rect((0, 0.78, 1, 1), "#9b9e78")
    c.polygon([(0, 0.74), (0.16, 0.55), (0.32, 0.72), (0.5, 0.28), (0.74, 0.76), (1, 0.56), (1, 1), (0, 1)], "#687b7a")
    c.polygon([(0.18, 0.78), (0.5, 0.25), (0.82, 0.78), (1, 1), (0.18, 1)], "#586f72")
    c.polygon([(0.37, 0.48), (0.5, 0.25), (0.66, 0.54), (0.54, 0.49), (0.47, 0.57)], PALETTE["snow"])
    c.polygon([(0, 0.88), (0.25, 0.82), (0.5, 0.88), (0.76, 0.81), (1, 0.86), (1, 1), (0, 1)], "#b5ad86")


def arctic_tundra_scene(c: Poster) -> None:
    sky(c, sun=False, horizon=0.5)
    mountains(c, snow=True, base=0.7, colors=("#90a2a0", "#778b8c", "#5d7478"))
    c.rect((0, 0.68, 1, 1), "#aaa77c")
    c.line([(0.05, 0.88), (0.28, 0.75), (0.5, 0.9), (0.72, 0.77), (0.95, 0.84)], "#75a2a8", 0.018)
    c.line([(0.18, 0.98), (0.38, 0.83), (0.66, 0.94), (0.88, 0.8)], "#75a2a8", 0.012)


def grand_teton_scene(c: Poster) -> None:
    sky(c, sun=False, horizon=0.52)
    c.polygon([(0, 0.68), (0.16, 0.54), (0.28, 0.67), (0.38, 0.31), (0.49, 0.66), (0.61, 0.29), (0.74, 0.68), (0.91, 0.45), (1, 0.62), (1, 0.72), (0, 0.72)], "#536b6e")
    c.polygon([(0.3, 0.48), (0.38, 0.31), (0.45, 0.52), (0.39, 0.47)], PALETTE["snow"])
    c.polygon([(0.53, 0.48), (0.61, 0.29), (0.69, 0.52), (0.62, 0.47)], PALETTE["snow"])
    water(c, 0.68, "#4f8791")
    c.polygon([(0, 0.78), (0.25, 0.72), (0.52, 0.78), (0.8, 0.71), (1, 0.77), (1, 0.84), (0, 0.86)], "#6d8464")
    forest(c, 0.78, 12)


def glacier_lake_scene(c: Poster, rocky: bool = False) -> None:
    sky(c, sun=False, horizon=0.5)
    mountains(c, snow=True, base=0.68, colors=("#8aa0a0", "#637f82", "#48666c"))
    c.polygon([(0.34, 0.68), (0.48, 0.45), (0.62, 0.68), (0.56, 0.74), (0.44, 0.74)], "#dbe7e3")
    water(c, 0.66, "#4e8790")
    if rocky:
        c.rect((0, 0.78, 1, 1), "#8e956f")
        for x in [0.2, 0.38, 0.58, 0.76]:
            c.ellipse((x - 0.012, 0.88, x + 0.012, 0.91), "#d5ad5f")
    else:
        forest(c, 0.78, 14)


def north_cascades_scene(c: Poster) -> None:
    sky(c, sun=False, horizon=0.48)
    for i in range(10):
        x = i * 0.11 - 0.05
        peak = 0.28 + (i % 3) * 0.055
        c.polygon([(x, 0.75), (x + 0.08, peak), (x + 0.18, 0.75)], c.rng.choice(["#5d7478", "#6f8583", "#48636a"]))
        c.polygon([(x + 0.055, peak + 0.08), (x + 0.08, peak), (x + 0.115, peak + 0.12), (x + 0.085, peak + 0.09)], PALETTE["snow"])
    forest(c, 0.68, 28)


def wrangell_scene(c: Poster) -> None:
    sky(c, sun=False, horizon=0.45)
    c.polygon([(0, 0.7), (0.14, 0.54), (0.3, 0.65), (0.52, 0.26), (0.8, 0.7), (1, 0.48), (1, 1), (0, 1)], "#6f8384")
    c.polygon([(0.36, 0.48), (0.52, 0.26), (0.69, 0.58), (0.56, 0.51), (0.47, 0.62)], PALETTE["snow"])
    c.rect((0, 0.66, 1, 1), "#dbe8e4")
    for x in [0.08, 0.22, 0.4, 0.58, 0.76]:
        c.line([(x, 0.72), (x + 0.18, 1)], "#a9c7c8", 0.01)
    c.polygon([(0, 0.86), (0.2, 0.8), (0.5, 0.86), (0.78, 0.79), (1, 0.84), (1, 1), (0, 1)], "#b8d0ce")


def lake_clark_scene(c: Poster) -> None:
    sky(c, horizon=0.5)
    c.polygon([(0, 0.66), (0.22, 0.5), (0.38, 0.66), (0.56, 0.34), (0.8, 0.66), (1, 0.47), (1, 0.72), (0, 0.72)], "#7d7163")
    c.polygon([(0.45, 0.48), (0.56, 0.34), (0.68, 0.52), (0.58, 0.49)], PALETTE["snow"])
    water(c, 0.68, "#4b8e9a")
    c.polygon([(0, 0.75), (0.24, 0.7), (0.48, 0.76), (0.72, 0.7), (1, 0.76), (1, 0.82), (0, 0.84)], "#8d8f62")


def misty_ridges_scene(c: Poster, autumn: bool = False) -> None:
    sky(c, sun=False, horizon=0.52)
    ridge_colors = ["#b6c3b5", "#91aa94", "#6f8d78", "#4f715f"]
    for i, color in enumerate(ridge_colors):
        y = 0.42 + i * 0.115
        c.polygon([(0, y + 0.12), (0.16, y), (0.34, y + 0.075), (0.56, y - 0.025), (0.78, y + 0.08), (1, y + 0.015), (1, 1), (0, 1)], color)
        c.polygon([(0, y + 0.08), (0.22, y + 0.055), (0.48, y + 0.085), (0.72, y + 0.052), (1, y + 0.075), (1, y + 0.115), (0, y + 0.13)], "#d3ded6")
    foreground = "#a77c57" if autumn else "#5d765b"
    c.rect((0, 0.82, 1, 1), foreground)
    if autumn:
        for x, color in [(0.14, "#c78a55"), (0.28, "#d1a15e"), (0.78, "#b36f4d"), (0.9, "#d1a15e")]:
            c.polygon([(x, 0.76), (x - 0.035, 0.84), (x + 0.035, 0.84)], color)
        c.line([(0.15, 0.97), (0.42, 0.86), (0.74, 0.92), (0.95, 0.84)], "#eadb9e", 0.012)


def olympic_scene(c: Poster) -> None:
    c.rect((0, 0, 1, 1), "#8fb2a8")
    c.ellipse((-0.2, 0.05, 1.2, 0.35), "#c9d8d0")
    c.rect((0, 0.36, 1, 1), "#3f604c")
    for i in range(14):
        x = 0.03 + i * 0.075
        c.rect((x, 0.18, x + 0.026, 1), "#604b37")
        c.line([(x + 0.012, 0.28), (x - 0.055, 0.5)], "#86a879", 0.01)
        c.ellipse((x - 0.08, 0.12, x + 0.11, 0.38), c.rng.choice(["#345640", "#456b4f", "#58795a"]))
    c.line([(0.08, 0.92), (0.32, 0.84), (0.58, 0.9), (0.86, 0.82)], "#557f80", 0.018)


def voyageurs_scene(c: Poster) -> None:
    sky(c, sun=False, horizon=0.36)
    water(c, 0.38, "#4b8790")
    for y, offset in [(0.46, 0.0), (0.6, 0.08), (0.74, -0.04)]:
        c.polygon([(0 + offset, y), (0.18 + offset, y - 0.04), (0.34 + offset, y + 0.015), (0.52 + offset, y - 0.045), (0.78 + offset, y + 0.02), (1 + offset, y - 0.025), (1, y + 0.08), (0, y + 0.1)], "#66825e")
        for x in [0.12 + offset, 0.25 + offset, 0.48 + offset, 0.72 + offset]:
            c.polygon([(x, y - 0.09), (x - 0.035, y), (x + 0.035, y)], PALETTE["forest_dark"])


def desert_peak_scene(c: Poster, guadalupe: bool = False) -> None:
    sky(c, horizon=0.58)
    c.rect((0, 0.74, 1, 1), "#c8b57c")
    if guadalupe:
        c.polygon([(0, 0.78), (0.34, 0.38), (0.52, 0.76), (0.62, 0.56), (1, 0.78), (1, 1), (0, 1)], "#806b59")
        c.polygon([(0.18, 0.78), (0.34, 0.38), (0.47, 0.78)], "#a88868")
    else:
        c.polygon([(0, 0.72), (0.2, 0.48), (0.42, 0.74), (0.68, 0.42), (1, 0.72), (1, 1), (0, 1)], "#7f806d")
        for x in [0.22, 0.66]:
            c.polygon([(x, 0.73), (x - 0.04, 0.64), (x + 0.04, 0.64)], "#425c48")


def haleakala_scene(c: Poster) -> None:
    sky(c, horizon=0.5)
    c.ellipse((-0.1, 0.34, 1.1, 0.9), "#8f6b5b")
    c.ellipse((0.08, 0.43, 0.92, 0.82), "#b9805f")
    c.ellipse((0.2, 0.52, 0.8, 0.76), "#7a5d53")
    c.polygon([(0, 0.78), (0.26, 0.68), (0.5, 0.76), (0.76, 0.66), (1, 0.76), (1, 1), (0, 1)], "#d6ded8")


def lava_volcano_scene(c: Poster) -> None:
    c.rect((0, 0, 1, 1), "#536f6c")
    c.rect((0, 0.56, 1, 1), "#303330")
    c.polygon([(0.08, 0.58), (0.36, 0.28), (0.62, 0.58)], "#4a4641")
    c.polygon([(0.44, 0.58), (0.68, 0.34), (0.94, 0.58)], "#5b5147")
    c.line([(0.36, 0.28), (0.42, 0.48), (0.55, 0.66), (0.7, 0.82), (0.9, 0.92)], PALETTE["lava"], 0.022)
    c.line([(0.18, 0.9), (0.32, 0.82), (0.46, 0.9)], "#e0783f", 0.014)


def hot_springs_scene(c: Poster) -> None:
    sky(c, horizon=0.56)
    forest(c, 0.48, 14)
    c.rect((0.18, 0.56, 0.82, 0.82), "#d2b98a")
    c.rect((0.22, 0.48, 0.78, 0.58), "#a5775c")
    for i in range(6):
        x = 0.25 + i * 0.08
        c.rect((x, 0.62, x + 0.035, 0.82), "#f0ead8")
    c.ellipse((0.32, 0.82, 0.68, 0.94), PALETTE["water_light"])
    c.ellipse((0.38, 0.26, 0.46, 0.7), "#eef0e8")
    c.ellipse((0.52, 0.22, 0.6, 0.68), "#eef0e8")


def island_lake_scene(c: Poster) -> None:
    sky(c, sun=False, horizon=0.44)
    water(c, 0.45, "#4e8992")
    for island in [(0.04, 0.58, 0.36, 0.68), (0.42, 0.5, 0.76, 0.62), (0.66, 0.7, 1.02, 0.8)]:
        c.ellipse(island, "#6e865f")
        for x in np.linspace(island[0] + 0.04, island[2] - 0.04, 5):
            c.polygon([(float(x), island[1] - 0.08), (float(x) - 0.035, island[1] + 0.03), (float(x) + 0.035, island[1] + 0.03)], PALETTE["forest_dark"])


def katmai_scene(c: Poster) -> None:
    sky(c, sun=False, horizon=0.54)
    c.rect((0, 0.66, 1, 1), "#b9a476")
    c.polygon([(0.02, 0.68), (0.25, 0.36), (0.48, 0.68)], "#7b7467")
    c.polygon([(0.4, 0.68), (0.62, 0.32), (0.88, 0.68)], "#8a6f5d")
    c.ellipse((0.58, 0.16, 0.76, 0.32), "#dce2dd")
    c.line([(0.08, 0.94), (0.3, 0.78), (0.48, 0.86), (0.72, 0.7), (0.94, 0.82)], PALETTE["water"], 0.018)


def painted_desert_scene(c: Poster) -> None:
    sky(c, sun=False, horizon=0.44)
    c.rect((0, 0.44, 1, 1), "#d5bd85")
    for y, color in [(0.5, "#b8735d"), (0.58, "#d8a46c"), (0.67, "#8f6b67"), (0.77, "#c4875d"), (0.88, "#ead09a")]:
        c.polygon([(0, y), (0.2, y - 0.04), (0.45, y + 0.03), (0.72, y - 0.035), (1, y + 0.02), (1, 1), (0, 1)], color)
    c.line([(0.12, 0.82), (0.42, 0.76)], "#6f5842", 0.025)
    c.line([(0.58, 0.9), (0.86, 0.83)], "#6f5842", 0.025)


def pinnacles_scene(c: Poster) -> None:
    sky(c, horizon=0.58)
    c.rect((0, 0.74, 1, 1), "#9f9f72")
    for x, h, w in [(0.18, 0.38, 0.07), (0.34, 0.48, 0.09), (0.52, 0.34, 0.075), (0.7, 0.44, 0.085), (0.86, 0.36, 0.06)]:
        c.polygon([(x - w, 0.78), (x - w * 0.45, h), (x + w * 0.4, h + 0.04), (x + w, 0.78)], "#8e806d")
        c.polygon([(x, h + 0.04), (x + w * 0.4, h + 0.04), (x + w, 0.78), (x + w * 0.25, 0.78)], "#675e55")
    forest(c, 0.82, 8)


def prairie_cave_scene(c: Poster) -> None:
    sky(c, horizon=0.58)
    c.rect((0, 0.58, 1, 1), "#b6a76f")
    for x in [0.1, 0.22, 0.4, 0.57, 0.73, 0.9]:
        c.line([(x, 0.95), (x + 0.02, 0.72)], "#6f7048", 0.007)
    c.ellipse((0.28, 0.58, 0.72, 0.9), "#78715d")
    c.ellipse((0.38, 0.64, 0.62, 0.88), "#2f302d")


def special_scene(c: Poster, theme: str) -> None:
    if theme == "arch":
        arch(c)
    elif theme == "badlands":
        badlands_scene(c)
    elif theme == "badlands_grass":
        badlands_scene(c, grass=True)
    elif theme == "big_bend":
        big_bend_scene(c)
    elif theme == "capitol_reef":
        capitol_reef_scene(c)
    elif theme in {"canyon", "grand_canyon", "forest_canyon"}:
        canyon(c, grand=theme == "grand_canyon")
        if theme == "forest_canyon":
            forest(c, 0.78, 14)
    elif theme == "dark_canyon":
        canyon(c, dark=True)
    elif theme == "hoodoos":
        hoodoos(c)
    elif theme in {"dunes", "white_dunes", "arctic_dunes"}:
        dunes(c, white=theme == "white_dunes")
    elif theme == "dunes_mountains":
        dunes(c, mountains_back=True)
    elif theme == "dunes_lake":
        dunes(c, lake=True)
    elif theme in {"coast", "tropical_coast", "marine"}:
        coast(c, tropical=theme != "coast")
    elif theme == "cave":
        cave(c)
    elif theme == "waterfall":
        waterfall(c)
    elif theme in {"swamp", "wetlands"}:
        swamp(c)
    elif theme == "denali":
        denali_scene(c)
    elif theme == "arctic_tundra":
        arctic_tundra_scene(c)
    elif theme == "gateway_arch":
        sky(c, horizon=0.64)
        water(c, 0.68, "#6f9fa7")
        c.line([(0.28, 0.82), (0.36, 0.28), (0.5, 0.18), (0.64, 0.28), (0.72, 0.82)], "#d8d7cf", 0.038)
        c.line([(0.35, 0.82), (0.42, 0.37), (0.5, 0.3), (0.58, 0.37), (0.65, 0.82)], PALETTE["sky"], 0.021)
    elif theme == "grand_teton":
        grand_teton_scene(c)
    elif theme == "glacier_lake":
        glacier_lake_scene(c)
    elif theme == "rocky_mountain":
        glacier_lake_scene(c, rocky=True)
    elif theme == "north_cascades":
        north_cascades_scene(c)
    elif theme == "wrangell_icefield":
        wrangell_scene(c)
    elif theme == "lake_clark":
        lake_clark_scene(c)
    elif theme in {"alpine_lake", "teton_lake", "lake_mountains", "crater_lake", "volcano_lake"}:
        sky(c, horizon=0.5)
        mountains(c, snow=True, base=0.66)
        water(c, 0.62, PALETTE["water_dark"] if theme == "crater_lake" else PALETTE["water"])
        if theme == "crater_lake":
            c.polygon([(0.48, 0.68), (0.58, 0.61), (0.67, 0.71), (0.6, 0.76)], "#6d7c60")
    elif theme == "great_basin":
        desert_peak_scene(c)
    elif theme == "guadalupe":
        desert_peak_scene(c, guadalupe=True)
    elif theme in {"alpine_peak", "arctic_mountains", "glacier_mountain", "rainier"}:
        sky(c, horizon=0.55)
        mountains(c, snow=True, base=0.82)
        forest(c, 0.76, 18)
        if theme == "rainier":
            c.rect((0, 0.9, 1, 1), "#a9a66f")
            for x in [0.16, 0.3, 0.48, 0.68, 0.84]:
                c.ellipse((x - 0.012, 0.9, x + 0.012, 0.925), "#d6a65d")
    elif theme in {"glacier_bay", "glacier_fjord"}:
        sky(c, horizon=0.48)
        mountains(c, snow=True, base=0.7)
        water(c, 0.6, PALETTE["water_dark"])
        c.polygon([(0.1, 0.6), (0.3, 0.48), (0.52, 0.62), (0.72, 0.5), (0.92, 0.6), (0.92, 0.8), (0.1, 0.8)], "#dce8e6")
    elif theme == "smoky":
        misty_ridges_scene(c)
    elif theme == "shenandoah":
        misty_ridges_scene(c, autumn=True)
    elif theme == "olympic_rainforest":
        olympic_scene(c)
    elif theme == "voyageurs":
        voyageurs_scene(c)
    elif theme in {"misty_mountains", "rainforest_mountains"}:
        sky(c, horizon=0.58)
        mountains(c, snow=False, base=0.78, colors=("#9bb0a0", "#7d967f", "#5c765f"))
        c.ellipse((-0.2, 0.44, 1.2, 0.7), "#cbd7cc")
        forest(c, 0.66, 28, tall=theme == "rainforest_mountains")
    elif theme == "haleakala":
        haleakala_scene(c)
    elif theme == "lava_volcano":
        lava_volcano_scene(c)
    elif theme == "hot_springs":
        hot_springs_scene(c)
    elif theme == "isle_royale":
        island_lake_scene(c)
    elif theme == "katmai":
        katmai_scene(c)
    elif theme == "kobuk_dunes":
        dunes(c, white=False)
        c.rect((0, 0.84, 1, 1), "#9c9d73")
    elif theme == "painted_desert":
        painted_desert_scene(c)
    elif theme == "pinnacles":
        pinnacles_scene(c)
    elif theme == "prairie_cave":
        prairie_cave_scene(c)
    elif theme == "redwood":
        sky(c, horizon=0.5)
        c.rect((0, 0.45, 1, 1), "#49654e")
        for i in range(9):
            x = 0.08 + i * 0.105
            c.rect((x - 0.025, 0.08, x + 0.025, 1), "#6a4b37")
            c.ellipse((x - 0.12, 0.08, x + 0.12, 0.42), "#365441")
    elif theme == "sequoia":
        sky(c, horizon=0.54)
        c.rect((0, 0.5, 1, 1), "#5d7655")
        for x, w in [(0.2, 0.07), (0.5, 0.1), (0.78, 0.075)]:
            c.rounded_rect((x - w, 0.12, x + w, 1), 0.025, "#8a593f")
            c.ellipse((x - 0.18, 0.08, x + 0.18, 0.42), "#3f5f45")
    elif theme == "saguaro":
        sky(c, horizon=0.62)
        mesas(c, 0.5)
        c.rect((0, 0.78, 1, 1), "#cdb87a")
        for x, h in [(0.22, 0.28), (0.5, 0.36), (0.78, 0.24)]:
            c.rounded_rect((x - 0.018, 0.78 - h, x + 0.018, 0.95), 0.02, "#587556")
            c.line([(x - 0.015, 0.86 - h * 0.4), (x - 0.08, 0.86 - h * 0.4), (x - 0.08, 0.76 - h * 0.35)], "#587556", 0.022)
            c.line([(x + 0.015, 0.88 - h * 0.5), (x + 0.08, 0.88 - h * 0.5), (x + 0.08, 0.76 - h * 0.45)], "#587556", 0.022)
    elif theme == "joshua_tree":
        sky(c, horizon=0.62)
        mesas(c, 0.52)
        c.rect((0, 0.78, 1, 1), "#c9b77d")
        for x in [0.25, 0.58, 0.82]:
            c.line([(x, 0.86), (x + 0.02, 0.66)], "#6f6146", 0.017)
            for dx, dy in [(-0.05, 0.64), (0.06, 0.62), (0.0, 0.56)]:
                c.line([(x + 0.02, 0.68), (x + dx, dy)], "#6f6146", 0.014)
                c.ellipse((x + dx - 0.035, dy - 0.035, x + dx + 0.035, dy + 0.035), "#6f7a51")
    elif theme == "yosemite":
        sky(c, horizon=0.55)
        c.polygon([(0, 1), (0, 0.42), (0.22, 0.36), (0.34, 1)], "#858273")
        c.polygon([(0.02, 0.52), (0.18, 0.48), (0.26, 1), (0.04, 1)], "#a09b87")
        c.polygon([(1, 1), (1, 0.33), (0.79, 0.32), (0.66, 0.42), (0.58, 1)], "#8f8b7a")
        c.polygon([(0.6, 0.62), (0.68, 0.42), (0.78, 0.34), (0.9, 0.36), (1, 0.42), (1, 1), (0.6, 1)], "#9c9580")
        c.line([(0.18, 0.47), (0.19, 0.72)], "#e8eee8", 0.018)
        c.line([(0.19, 0.72), (0.18, 0.88)], PALETTE["water_light"], 0.012)
        c.rect((0, 0.78, 1, 1), "#78906a")
        forest(c, 0.68, 24)
        water(c, 0.88, "#5f8e90")
    elif theme == "zion":
        sky(c, horizon=0.54)
        c.polygon([(0, 1), (0, 0.42), (0.28, 0.34), (0.44, 1)], "#b96845")
        c.polygon([(1, 1), (1, 0.38), (0.72, 0.28), (0.55, 1)], "#cf8550")
        c.line([(0.08, 0.52), (0.42, 0.48)], "#e2a16a", 0.014)
        c.line([(0.62, 0.48), (0.95, 0.43)], "#e2a16a", 0.014)
        forest(c, 0.78, 10)
    elif theme == "geyser":
        sky(c, horizon=0.58)
        forest(c, 0.48, 16)
        c.rect((0, 0.74, 1, 1), "#d7cda8")
        c.ellipse((0.31, 0.62, 0.69, 0.86), "#d6d5bd")
        c.ellipse((0.35, 0.65, 0.65, 0.83), PALETTE["water_light"])
        c.ellipse((0.42, 0.69, 0.58, 0.8), PALETTE["water_dark"])
        c.ellipse((0.43, 0.2, 0.57, 0.72), "#ecede4")
        c.ellipse((0.47, 0.12, 0.53, 0.3), "#f5f4eb")
        c.line([(0.2, 0.88), (0.82, 0.8)], "#bd9c6b", 0.01)
    elif theme == "bridge_river":
        sky(c, horizon=0.56)
        mountains(c, snow=False, base=0.74, colors=("#849977", "#687f62", "#4f654f"))
        water(c, 0.72)
        c.line([(0.12, 0.55), (0.28, 0.45), (0.5, 0.42), (0.72, 0.45), (0.88, 0.55)], "#4f5049", 0.024)
        c.line([(0.12, 0.55), (0.88, 0.55)], "#4f5049", 0.018)
    elif theme == "cliff_dwellings":
        sky(c, horizon=0.58)
        c.rect((0, 0.38, 1, 1), "#b98159")
        c.polygon([(0, 0.52), (1, 0.42), (1, 0.62), (0, 0.72)], "#7d5a45")
        for i in range(7):
            x = 0.22 + i * 0.07
            c.rounded_rect((x, 0.58, x + 0.05, 0.7), 0.006, "#d7b184")
            c.rect((x + 0.018, 0.62, x + 0.033, 0.7), "#6a4e3c")
        forest(c, 0.82, 8)
    elif theme == "fort_island":
        sky(c, horizon=0.54)
        water(c, 0.45, PALETTE["water_light"])
        c.rect((0.19, 0.56, 0.82, 0.78), "#b96f54")
        c.rect((0.24, 0.49, 0.77, 0.58), "#c98260")
        for i in range(5):
            c.rect((0.27 + i * 0.09, 0.6, 0.31 + i * 0.09, 0.68), "#704739")
        c.rect((0, 0.78, 1, 1), "#d8c98f")
    else:
        sky(c, horizon=0.58)
        mountains(c, snow=False, base=0.78)
        forest(c, 0.72, 16)


def render_park(name: str) -> Image.Image:
    key = park_key(name)
    theme = THEMES.get(key, "mountains")
    c = Poster(seed_for(key))
    special_scene(c, theme)
    return c.finish()


def make_contact_sheet(paths: list[Path], out_path: Path, cols: int = 7) -> None:
    thumb_w, thumb_h = 180, 180
    rows = math.ceil(len(paths) / cols)
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h), (250, 250, 246))
    for index, path in enumerate(paths):
        image = Image.open(path).convert("RGB")
        image.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        x = (index % cols) * thumb_w + (thumb_w - image.width) // 2
        y = (index // cols) * thumb_h + (thumb_h - image.height) // 2
        sheet.paste(image, (x, y))
    sheet.save(out_path, quality=94, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--contact-sheet", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    park_names = read_park_names()
    files = [THUMBNAILS / park_filename(name) for name in park_names]
    missing = [path for path in files if not path.exists()]
    if missing:
        missing_text = "\n".join(str(path) for path in missing)
        raise FileNotFoundError(f"Missing expected National Park thumbnails:\n{missing_text}")

    if args.dry_run:
        print(f"Would generate {len(files)} poster thumbnails at {SIZE}x{SIZE}")
        return

    processed: list[Path] = []
    for index, (name, path) in enumerate(zip(park_names, files), 1):
        image = render_park(name)
        image.save(path, quality=94, optimize=True, progressive=True)
        processed.append(path)
        print(f"generated {index:02d}/{len(files)} {path.name}")

    if args.contact_sheet:
        args.contact_sheet.parent.mkdir(parents=True, exist_ok=True)
        make_contact_sheet(processed, args.contact_sheet)
        print(f"contact sheet: {args.contact_sheet}")


if __name__ == "__main__":
    main()
