import * as THREE from 'three';
import { CharacterAppearance } from './characterConfig';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function shadeHex(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const nr = clamp(r * factor);
  const ng = clamp(g * factor);
  const nb = clamp(b * factor);
  return `rgb(${nr}, ${ng}, ${nb})`;
}

function mixHex(hexA: string, hexB: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `rgb(${clamp(r1 + (r2 - r1) * t)}, ${clamp(g1 + (g2 - g1) * t)}, ${clamp(b1 + (b2 - b1) * t)})`;
}

function createPixelCanvas(
  width: number,
  height: number,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

function finalizePixelTexture(
  canvas: HTMLCanvasElement,
  options?: {
    repeatX?: number;
    repeatY?: number;
    mipmaps?: boolean;
    anisotropy?: number;
  },
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;

  if (options?.mipmaps) {
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
  } else {
    tex.generateMipmaps = false;
    tex.minFilter = THREE.NearestFilter;
  }

  if (options?.repeatX && options?.repeatY) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(options.repeatX, options.repeatY);
  } else {
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
  }

  if (options?.anisotropy) {
    tex.anisotropy = options.anisotropy;
  }

  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a clean, dark-blue classic baseplate texture with thin white lines
 * forming uniform squares across the entire surface (no studs or clutter).
 */
export function createBaseplateTopTexture(
  maxAnisotropy: number,
  repeatCount = 108,
): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Elegant dark-blue baseplate surface balanced with the stylized sky
  ctx.fillStyle = '#182848';
  ctx.fillRect(0, 0, size, size);

  // Thin crisp white square grid lines (split evenly on borders for seamless tiling)
  ctx.fillStyle = 'rgba(240, 246, 255, 0.44)';
  ctx.fillRect(0, 0, size, 1.5);
  ctx.fillRect(0, 0, 1.5, size);
  ctx.fillRect(0, size - 1.5, size, 1.5);
  ctx.fillRect(size - 1.5, 0, 1.5, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatCount, repeatCount);
  if (maxAnisotropy > 0) {
    tex.anisotropy = maxAnisotropy;
  }
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a cohesive dark-navy border texture for the distant baseplate perimeter.
 */
export function createBaseplateTrimTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 32;
  const { canvas, ctx } = createPixelCanvas(size, size);

  ctx.fillStyle = '#14223E';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#20335A';
  ctx.fillRect(0, 0, size, 3);

  ctx.fillStyle = '#0F1A31';
  ctx.fillRect(0, 16, size, 16);

  return finalizePixelTexture(canvas, {
    repeatX: 54,
    repeatY: 1,
    mipmaps: true,
    anisotropy: maxAnisotropy,
  });
}

/**
 * Soft radial ground contact shadow texture tuned for the dark-blue baseplate.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    2,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, 'rgba(5, 9, 20, 0.5)');
  grad.addColorStop(0.52, 'rgba(5, 9, 20, 0.2)');
  grad.addColorStop(1, 'rgba(5, 9, 20, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Brighter, balanced stylized Cartoon Sky gradient texture with natural atmospheric depth.
 */
export function createSkyDomeTexture(): THREE.CanvasTexture {
  const width = 64;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0.0, '#4982C6'); // Rich atmospheric zenith blue
  grad.addColorStop(0.24, '#6CA4DF'); // Clear mid-sky Cartoon blue
  grad.addColorStop(0.42, '#99C5EE'); // Soft luminous lower sky
  grad.addColorStop(0.5, '#C0DBF4'); // Exact horizon mist matching Three.Fog
  grad.addColorStop(0.56, '#B8D4EE'); // Horizon continuation
  grad.addColorStop(0.75, '#769AC2'); // Gentle below-horizon fade
  grad.addColorStop(1.0, '#2E466E'); // Nadir balance
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Clean, softly blurred radial glowing sun sky texture with warm pale-gold falloff.
 */
export function createSunGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const half = size * 0.5;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0.0, 'rgba(255, 253, 240, 1.0)');
  grad.addColorStop(0.15, 'rgba(255, 247, 214, 0.96)');
  grad.addColorStop(0.24, 'rgba(255, 235, 174, 0.72)');
  grad.addColorStop(0.42, 'rgba(255, 224, 152, 0.26)');
  grad.addColorStop(0.7, 'rgba(255, 218, 146, 0.06)');
  grad.addColorStop(1.0, 'rgba(255, 215, 140, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export interface CharacterTextureSet {
  headFront: THREE.CanvasTexture;
  headBack: THREE.CanvasTexture;
  headSideL: THREE.CanvasTexture;
  headSideR: THREE.CanvasTexture;
  headTop: THREE.CanvasTexture;
  skinPlain: THREE.CanvasTexture;

  chestFront: THREE.CanvasTexture;
  chestBack: THREE.CanvasTexture;
  chestSide: THREE.CanvasTexture;
  chestTop: THREE.CanvasTexture;

  waistBand: THREE.CanvasTexture;
  upperArm: THREE.CanvasTexture;
  lowerArm: THREE.CanvasTexture;
  hand: THREE.CanvasTexture;

  upperLeg: THREE.CanvasTexture;
  lowerLeg: THREE.CanvasTexture;
  footFront: THREE.CanvasTexture;
  footSide: THREE.CanvasTexture;
  footBack: THREE.CanvasTexture;
  footTop: THREE.CanvasTexture;
  footSole: THREE.CanvasTexture;

  dispose: () => void;
}

export function createCharacterPixelTextures(
  appearance: CharacterAppearance,
): CharacterTextureSet {
  const created: THREE.CanvasTexture[] = [];
  const track = (tex: THREE.CanvasTexture) => {
    created.push(tex);
    return tex;
  };

  const skin = appearance.skin;
  const skinLight = shadeHex(skin, 1.06);
  const skinShadow = shadeHex(skin, 0.88);
  const skinBlush = mixHex(skin, '#F28B82', 0.16);

  const hair = appearance.hair;
  const hairLight = shadeHex(hair, 1.18);
  const hairDark = shadeHex(hair, 0.82);

  const top = appearance.topPrimary;
  const topLight = shadeHex(top, 1.12);
  const topDark = shadeHex(top, 0.78);
  const top2 = appearance.topSecondary;
  const top2Light = shadeHex(top2, 1.12);
  const top2Dark = shadeHex(top2, 0.84);
  const accent = appearance.topAccent;
  const emblem = appearance.emblemColor ?? top2;
  const sash = appearance.sashColor ?? top2;

  const pants = appearance.pantsPrimary;
  const pantsLight = shadeHex(pants, 1.1);
  const pantsDark = shadeHex(pants, 0.8);
  const pantsAccent = appearance.pantsAccent;

  const shoe = appearance.shoePrimary;
  const shoeDark = shadeHex(shoe, 0.84);
  const sole = appearance.shoeSole;
  const shoeAccent = appearance.shoeAccent;

  // --- FACELESS HEAD (16x16) ---
  // Explicitly NO eyes, NO nose, NO mouth — clean soft cartoon pixel shading + hair silhouette
  const headFront = (() => {
    const { canvas, ctx } = createPixelCanvas(16, 16);
    ctx.fillStyle = skin;
    ctx.fillRect(0, 0, 16, 16);
    // Soft cheek warmth (no facial features)
    ctx.fillStyle = skinLight;
    ctx.fillRect(3, 5, 10, 6);
    ctx.fillStyle = skinBlush;
    ctx.fillRect(2, 9, 2, 2);
    ctx.fillRect(12, 9, 2, 2);
    // Chin / jaw subtle AO shadow
    ctx.fillStyle = skinShadow;
    ctx.fillRect(0, 14, 16, 2);
    ctx.fillRect(0, 4, 1, 10);
    ctx.fillRect(15, 4, 1, 10);

    // Hairline fringe across top of forehead
    ctx.fillStyle = hair;
    ctx.fillRect(0, 0, 16, 4);
    ctx.fillRect(1, 4, 3, 2);
    ctx.fillRect(5, 4, 4, 1);
    ctx.fillRect(12, 4, 3, 2);
    ctx.fillStyle = hairLight;
    ctx.fillRect(3, 1, 7, 1);
    ctx.fillStyle = hairDark;
    ctx.fillRect(0, 3, 1, 3);
    ctx.fillRect(15, 3, 1, 3);

    return track(finalizePixelTexture(canvas));
  })();

  const headBack = (() => {
    const { canvas, ctx } = createPixelCanvas(16, 16);
    ctx.fillStyle = hair;
    ctx.fillRect(0, 0, 16, 13);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(0, 13, 16, 3);
    // Hair taper at nape
    ctx.fillStyle = hairDark;
    ctx.fillRect(2, 12, 12, 2);
    ctx.fillRect(5, 14, 6, 1);
    ctx.fillStyle = hairLight;
    ctx.fillRect(3, 3, 10, 2);
    ctx.fillRect(4, 7, 8, 1);
    return track(finalizePixelTexture(canvas));
  })();

  const makeHeadSide = (flip: boolean) => {
    const { canvas, ctx } = createPixelCanvas(16, 16);
    ctx.fillStyle = skin;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(0, 14, 16, 2);
    // Hair covering back + sideburn
    ctx.fillStyle = hair;
    if (!flip) {
      ctx.fillRect(0, 0, 16, 4);
      ctx.fillRect(6, 4, 10, 8);
      ctx.fillRect(10, 12, 6, 2);
      ctx.fillRect(3, 4, 2, 4); // sideburn
      ctx.fillStyle = hairLight;
      ctx.fillRect(4, 2, 8, 1);
    } else {
      ctx.fillRect(0, 0, 16, 4);
      ctx.fillRect(0, 4, 10, 8);
      ctx.fillRect(0, 12, 6, 2);
      ctx.fillRect(11, 4, 2, 4); // sideburn
      ctx.fillStyle = hairLight;
      ctx.fillRect(4, 2, 8, 1);
    }
    return track(finalizePixelTexture(canvas));
  };

  const headSideL = makeHeadSide(false);
  const headSideR = makeHeadSide(true);

  const headTop = (() => {
    const { canvas, ctx } = createPixelCanvas(16, 16);
    ctx.fillStyle = hair;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = hairLight;
    ctx.fillRect(3, 3, 10, 6);
    ctx.fillStyle = hairDark;
    ctx.fillRect(0, 13, 16, 3);
    return track(finalizePixelTexture(canvas));
  })();

  const skinPlain = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 8);
    ctx.fillStyle = skin;
    ctx.fillRect(0, 0, 8, 8);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(0, 6, 8, 2);
    return track(finalizePixelTexture(canvas));
  })();

  // --- CHEST / UPPER TORSO (16x16) ---
  const chestFront = (() => {
    const { canvas, ctx } = createPixelCanvas(16, 16);
    if (appearance.topStyle === 'bodysuit') {
      // Phoenix Force / Dark Phoenix sleek bodysuit with high collar & Phoenix bird emblem
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = topLight;
      ctx.fillRect(1, 2, 14, 3);
      ctx.fillStyle = topDark;
      ctx.fillRect(0, 14, 16, 2);

      // High sleek black neck collar
      ctx.fillStyle = accent;
      ctx.fillRect(4, 0, 8, 3);

      // Iconic V-spread Phoenix bird chest emblem across upper torso
      ctx.fillStyle = emblem;
      // Spread wings along shoulders/chest
      ctx.fillRect(1, 2, 3, 2);
      ctx.fillRect(12, 2, 3, 2);
      ctx.fillRect(2, 3, 4, 2);
      ctx.fillRect(10, 3, 4, 2);
      ctx.fillRect(4, 5, 8, 2);
      // Bird head crest & central descending tail V
      ctx.fillRect(7, 3, 2, 9);
      ctx.fillRect(6, 7, 4, 3);
      ctx.fillRect(7, 12, 2, 2);

      // Highlight core inside emblem
      ctx.fillStyle = shadeHex(emblem, 1.15);
      ctx.fillRect(7, 5, 2, 4);

      return track(finalizePixelTexture(canvas));
    }
    if (appearance.topStyle === 'emma-corset') {
      // Emma Frost off-shoulder white corset with red/gold X emblem & bare midriff
      ctx.fillStyle = skin;
      ctx.fillRect(0, 0, 16, 16);

      // Off-shoulder cape strap across upper chest
      ctx.fillStyle = top;
      ctx.fillRect(0, 2, 16, 3);
      ctx.fillStyle = accent;
      ctx.fillRect(0, 4, 16, 1);

      // Sculpted white corset bodice ending cleanly above midriff
      ctx.fillStyle = top;
      ctx.fillRect(2, 4, 12, 8);
      ctx.fillStyle = topDark;
      ctx.fillRect(4, 5, 1, 7);
      ctx.fillRect(11, 5, 1, 7);
      ctx.fillRect(2, 11, 12, 1);

      // Circular red & gold X clasp in center of upper chest
      ctx.fillStyle = emblem;
      ctx.fillRect(6, 3, 4, 4);
      ctx.fillStyle = sash;
      ctx.fillRect(6, 3, 1, 1);
      ctx.fillRect(9, 3, 1, 1);
      ctx.fillRect(7, 4, 2, 2);
      ctx.fillRect(6, 6, 1, 1);
      ctx.fillRect(9, 6, 1, 1);

      // Exposed bare midriff at bottom 4 rows
      ctx.fillStyle = skin;
      ctx.fillRect(0, 12, 16, 4);
      ctx.fillStyle = skinShadow;
      ctx.fillRect(7, 13, 2, 2);
      return track(finalizePixelTexture(canvas));
    }
    if (appearance.topStyle === 'hela-armor') {
      // Hela dark scaly black-teal armor with silver-emerald chest ribs (no face/flesh)
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 16, 16);
      // Fine scale texture dots
      ctx.fillStyle = top2;
      for (let y = 1; y < 15; y += 2) {
        for (let x = (y % 4 === 1 ? 1 : 2); x < 15; x += 2) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // High dark armored collar
      ctx.fillStyle = '#0D1214';
      ctx.fillRect(4, 0, 8, 3);
      // Iconic symmetrical curved silver-emerald vertical rib plates
      ctx.fillStyle = emblem;
      ctx.fillRect(3, 3, 2, 5);
      ctx.fillRect(11, 3, 2, 5);
      ctx.fillRect(5, 5, 2, 9);
      ctx.fillRect(9, 5, 2, 9);
      ctx.fillRect(7, 2, 2, 13);
      ctx.fillStyle = shadeHex(emblem, 1.2);
      ctx.fillRect(7, 4, 2, 4);
      ctx.fillStyle = top2;
      ctx.fillRect(0, 14, 16, 2);
      return track(finalizePixelTexture(canvas));
    }
    if (appearance.topStyle === 'corset') {
      // Classic Scarlet Witch crimson bodice over soft rose-pink sheer shoulders/neckline
      ctx.fillStyle = top2; // rose-pink upper chest / neckline
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = skin;
      ctx.fillRect(5, 0, 6, 3);
      ctx.fillRect(6, 3, 4, 2);

      // Crimson corset cups & sweetheart V-cut bodice
      ctx.fillStyle = top;
      ctx.fillRect(1, 3, 5, 4);
      ctx.fillRect(10, 3, 5, 4);
      ctx.fillRect(1, 6, 14, 10);
      ctx.fillStyle = skin;
      ctx.fillRect(7, 4, 2, 2); // subtle V plunge highlight

      // Bodice seam highlights & dark crimson contouring
      ctx.fillStyle = topLight;
      ctx.fillRect(2, 4, 3, 2);
      ctx.fillRect(11, 4, 3, 2);
      ctx.fillStyle = accent;
      ctx.fillRect(4, 7, 1, 8);
      ctx.fillRect(11, 7, 1, 8);
      ctx.fillRect(7, 7, 2, 9);
      ctx.fillStyle = topDark;
      ctx.fillRect(0, 14, 16, 2);
      return track(finalizePixelTexture(canvas));
    }

    ctx.fillStyle = top;
    ctx.fillRect(0, 0, 16, 16);

    // Subtle soft shading top & bottom
    ctx.fillStyle = topLight;
    ctx.fillRect(1, 1, 14, 3);
    ctx.fillStyle = topDark;
    ctx.fillRect(0, 13, 16, 3);

    // Neckline / undershirt V or crew collar
    ctx.fillStyle = top2;
    ctx.fillRect(5, 0, 6, 2);
    ctx.fillStyle = skin;
    ctx.fillRect(6, 0, 4, 1);

    if (appearance.topStyle === 'hoodie') {
      // Drawstrings
      ctx.fillStyle = top2;
      ctx.fillRect(6, 2, 1, 5);
      ctx.fillRect(9, 2, 1, 5);
      // Center seam & kangaroo pocket
      ctx.fillStyle = topDark;
      ctx.fillRect(4, 10, 8, 4);
      ctx.fillStyle = topLight;
      ctx.fillRect(5, 10, 6, 1);
      // Accent chest stripe / patch
      ctx.fillStyle = accent;
      ctx.fillRect(10, 4, 3, 2);
    } else if (appearance.topStyle === 'varsity') {
      // Center button placket & snaps
      ctx.fillStyle = top2;
      ctx.fillRect(7, 2, 2, 12);
      ctx.fillStyle = accent;
      ctx.fillRect(7, 4, 2, 1);
      ctx.fillRect(7, 8, 2, 1);
      ctx.fillRect(7, 12, 2, 1);
      // Ribbed accent hem
      ctx.fillStyle = accent;
      ctx.fillRect(0, 14, 16, 2);
    } else {
      // Clean graphic tee band
      ctx.fillStyle = top2;
      ctx.fillRect(0, 5, 16, 4);
      ctx.fillStyle = accent;
      ctx.fillRect(4, 6, 8, 2);
    }

    return track(finalizePixelTexture(canvas));
  })();

  const chestBack = (() => {
    const { canvas, ctx } = createPixelCanvas(16, 16);
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = topLight;
    ctx.fillRect(2, 1, 12, 3);
    ctx.fillStyle = topDark;
    ctx.fillRect(0, 13, 16, 3);

    if (appearance.topStyle === 'bodysuit') {
      ctx.fillStyle = accent;
      ctx.fillRect(4, 0, 8, 3);
      ctx.fillStyle = emblem;
      ctx.fillRect(2, 3, 12, 2);
      ctx.fillRect(7, 5, 2, 6);
    } else if (appearance.topStyle === 'emma-corset') {
      ctx.fillStyle = skin;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = top;
      ctx.fillRect(0, 2, 16, 10);
      ctx.fillStyle = accent;
      ctx.fillRect(7, 4, 2, 8);
    } else if (appearance.topStyle === 'hela-armor') {
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = emblem;
      ctx.fillRect(5, 3, 2, 11);
      ctx.fillRect(9, 3, 2, 11);
      ctx.fillRect(3, 2, 10, 2);
    } else if (appearance.topStyle === 'corset') {
      ctx.fillStyle = top2;
      ctx.fillRect(4, 0, 8, 3);
      ctx.fillStyle = accent;
      ctx.fillRect(7, 4, 2, 11);
    } else if (appearance.topStyle === 'hoodie') {
      // Folded hood silhouette on upper back
      ctx.fillStyle = topDark;
      ctx.fillRect(3, 0, 10, 5);
      ctx.fillStyle = top;
      ctx.fillRect(4, 0, 8, 4);
      ctx.fillStyle = accent;
      ctx.fillRect(5, 1, 6, 1);
    } else if (appearance.topStyle === 'varsity') {
      ctx.fillStyle = accent;
      ctx.fillRect(0, 14, 16, 2);
      ctx.fillStyle = top2;
      ctx.fillRect(4, 4, 8, 2);
    } else {
      ctx.fillStyle = top2;
      ctx.fillRect(0, 5, 16, 4);
    }

    return track(finalizePixelTexture(canvas));
  })();

  const chestSide = (() => {
    const { canvas, ctx } = createPixelCanvas(12, 16);
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, 12, 16);
    ctx.fillStyle = topDark;
    ctx.fillRect(0, 13, 12, 3);
    if (appearance.topStyle === 'bodysuit') {
      ctx.fillStyle = emblem;
      ctx.fillRect(4, 2, 4, 2);
    } else if (appearance.topStyle === 'emma-corset') {
      ctx.fillStyle = skin;
      ctx.fillRect(0, 0, 12, 16);
      ctx.fillStyle = top;
      ctx.fillRect(0, 2, 12, 10);
    } else if (appearance.topStyle === 'hela-armor') {
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 12, 16);
      ctx.fillStyle = emblem;
      ctx.fillRect(5, 4, 2, 10);
    } else if (appearance.topStyle === 'corset') {
      ctx.fillStyle = top2;
      ctx.fillRect(0, 0, 12, 3);
      ctx.fillStyle = accent;
      ctx.fillRect(5, 4, 2, 10);
    } else if (appearance.topStyle === 'tee') {
      ctx.fillStyle = top2;
      ctx.fillRect(0, 5, 12, 4);
    } else if (appearance.topStyle === 'varsity') {
      ctx.fillStyle = accent;
      ctx.fillRect(0, 14, 12, 2);
    }
    return track(finalizePixelTexture(canvas));
  })();

  const chestTop = (() => {
    const { canvas, ctx } = createPixelCanvas(16, 12);
    ctx.fillStyle =
      appearance.topStyle === 'corset'
        ? top2
        : appearance.topStyle === 'bodysuit' || appearance.topStyle === 'hela-armor'
          ? top
          : appearance.topStyle === 'emma-corset'
            ? skin
            : topLight;
    ctx.fillRect(0, 0, 16, 12);
    ctx.fillStyle =
      appearance.topStyle === 'bodysuit' || appearance.topStyle === 'hela-armor'
        ? accent
        : appearance.topStyle === 'emma-corset'
          ? skin
          : top2;
    ctx.fillRect(5, 3, 6, 6);
    ctx.fillStyle = skin;
    ctx.fillRect(6, 4, 4, 4);
    return track(finalizePixelTexture(canvas));
  })();

  // --- WAIST / LOWER TORSO (16x8) ---
  const waistBand = (() => {
    const { canvas, ctx } = createPixelCanvas(16, 8);
    if (appearance.topStyle === 'bodysuit') {
      // Diagonal Phoenix sash across bodysuit waist
      ctx.fillStyle = pants;
      ctx.fillRect(0, 0, 16, 8);
      ctx.fillStyle = sash;
      for (let x = 0; x < 16; x++) {
        const y = Math.floor(1 + (x / 15) * 3);
        ctx.fillRect(x, y, 1, 3);
      }
      ctx.fillStyle = shadeHex(sash, 0.82);
      ctx.fillRect(0, 7, 16, 1);
      return track(finalizePixelTexture(canvas));
    }
    if (appearance.topStyle === 'emma-corset') {
      // Exposed midriff skin blending down into tailored white waistband
      ctx.fillStyle = skin;
      ctx.fillRect(0, 0, 16, 3);
      ctx.fillStyle = pants;
      ctx.fillRect(0, 3, 16, 5);
      ctx.fillStyle = pantsAccent;
      ctx.fillRect(0, 3, 16, 1);
      ctx.fillRect(6, 3, 4, 2);
      return track(finalizePixelTexture(canvas));
    }
    if (appearance.topStyle === 'hela-armor') {
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 16, 8);
      ctx.fillStyle = emblem;
      ctx.fillRect(2, 0, 2, 7);
      ctx.fillRect(7, 0, 2, 8);
      ctx.fillRect(12, 0, 2, 7);
      return track(finalizePixelTexture(canvas));
    }
    if (appearance.pantsStyle === 'tights') {
      // Crimson bodysuit V-cut over rose-pink tights
      ctx.fillStyle = pants;
      ctx.fillRect(0, 0, 16, 8);
      ctx.fillStyle = pantsAccent;
      ctx.fillRect(1, 0, 14, 3);
      ctx.fillRect(3, 3, 10, 3);
      ctx.fillRect(6, 6, 4, 2);
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, 16, 1);
      return track(finalizePixelTexture(canvas));
    }
    ctx.fillStyle = pants;
    ctx.fillRect(0, 0, 16, 8);
    ctx.fillStyle = pantsDark;
    ctx.fillRect(0, 6, 16, 2);
    // Clean belt/waistband trim
    ctx.fillStyle = pantsAccent;
    ctx.fillRect(0, 0, 16, 2);
    ctx.fillStyle = top2;
    ctx.fillRect(6, 0, 4, 2);
    return track(finalizePixelTexture(canvas));
  })();

  // --- ARMS (8x10) ---
  const upperArm = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 10);
    if (appearance.topStyle === 'bodysuit') {
      // Green / black short bodysuit shoulder transitioning into gold / crimson-red long gloves
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 8, 5);
      ctx.fillStyle = top2;
      ctx.fillRect(0, 5, 8, 5);
      ctx.fillStyle = top2Light;
      ctx.fillRect(2, 6, 3, 4);
      ctx.fillStyle = top2Dark;
      ctx.fillRect(0, 5, 8, 1);
    } else if (appearance.topStyle === 'emma-corset') {
      // Bare shoulder skin transitioning into white long opera glove
      ctx.fillStyle = skin;
      ctx.fillRect(0, 0, 8, 5);
      ctx.fillStyle = top2;
      ctx.fillRect(0, 5, 8, 5);
      ctx.fillStyle = accent;
      ctx.fillRect(0, 5, 8, 1);
    } else if (appearance.topStyle === 'hela-armor') {
      ctx.fillStyle = skin;
      ctx.fillRect(0, 0, 8, 2);
      ctx.fillStyle = top;
      ctx.fillRect(0, 2, 8, 8);
      ctx.fillStyle = emblem;
      ctx.fillRect(3, 3, 2, 6);
    } else if (appearance.topStyle === 'corset') {
      // Rose-pink sheer sleeves + flared crimson upper glove cuff
      ctx.fillStyle = top2;
      ctx.fillRect(0, 0, 8, 8);
      ctx.fillStyle = top2Dark;
      ctx.fillRect(0, 6, 8, 2);
      ctx.fillStyle = top;
      ctx.fillRect(0, 8, 8, 2);
      ctx.fillStyle = accent;
      ctx.fillRect(0, 8, 8, 1);
    } else if (appearance.topStyle === 'tee') {
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 8, 6);
      ctx.fillStyle = top2;
      ctx.fillRect(0, 5, 8, 1);
      ctx.fillStyle = skin;
      ctx.fillRect(0, 6, 8, 4);
    } else {
      const sleeveColor = appearance.topStyle === 'varsity' ? top2 : top;
      const sleeveShade = appearance.topStyle === 'varsity' ? top2Dark : topDark;
      ctx.fillStyle = sleeveColor;
      ctx.fillRect(0, 0, 8, 10);
      ctx.fillStyle = sleeveShade;
      ctx.fillRect(0, 8, 8, 2);
      // Shoulder accent stripe
      ctx.fillStyle = accent;
      ctx.fillRect(3, 0, 2, 10);
    }
    return track(finalizePixelTexture(canvas));
  })();

  const lowerArm = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 10);
    if (appearance.topStyle === 'bodysuit' || appearance.topStyle === 'emma-corset') {
      // Sleek gold / crimson / crisp white long opera gloves
      ctx.fillStyle = top2;
      ctx.fillRect(0, 0, 8, 10);
      ctx.fillStyle = top2Light;
      ctx.fillRect(2, 1, 3, 7);
      ctx.fillStyle = top2Dark;
      ctx.fillRect(0, 8, 8, 2);
    } else if (appearance.topStyle === 'hela-armor') {
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 8, 10);
      ctx.fillStyle = emblem;
      ctx.fillRect(2, 2, 1, 7);
      ctx.fillRect(5, 2, 1, 7);
      ctx.fillStyle = top2;
      ctx.fillRect(0, 8, 8, 2);
    } else if (appearance.topStyle === 'corset') {
      // Crimson elbow-length gloves with subtle highlight & seam
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 8, 10);
      ctx.fillStyle = topLight;
      ctx.fillRect(2, 1, 3, 7);
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, 8, 2);
      ctx.fillStyle = topDark;
      ctx.fillRect(0, 8, 8, 2);
    } else if (appearance.topStyle === 'tee') {
      ctx.fillStyle = skin;
      ctx.fillRect(0, 0, 8, 10);
      ctx.fillStyle = skinShadow;
      ctx.fillRect(0, 8, 8, 2);
      // Wristband
      ctx.fillStyle = accent;
      ctx.fillRect(0, 6, 8, 2);
    } else {
      const sleeveColor = appearance.topStyle === 'varsity' ? top2 : top;
      const sleeveShade = appearance.topStyle === 'varsity' ? top2Dark : topDark;
      ctx.fillStyle = sleeveColor;
      ctx.fillRect(0, 0, 8, 8);
      ctx.fillStyle = sleeveShade;
      ctx.fillRect(0, 6, 8, 2);
      // Ribbed cuff
      ctx.fillStyle = accent;
      ctx.fillRect(0, 8, 8, 2);
    }
    return track(finalizePixelTexture(canvas));
  })();

  const hand = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 8);
    if (appearance.topStyle === 'bodysuit' || appearance.topStyle === 'emma-corset') {
      ctx.fillStyle = top2;
      ctx.fillRect(0, 0, 8, 8);
      ctx.fillStyle = top2Light;
      ctx.fillRect(2, 1, 4, 4);
      ctx.fillStyle = top2Dark;
      ctx.fillRect(0, 6, 8, 2);
      return track(finalizePixelTexture(canvas));
    }
    if (appearance.topStyle === 'corset' || appearance.topStyle === 'hela-armor') {
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, 8, 8);
      ctx.fillStyle = topLight;
      ctx.fillRect(2, 1, 4, 4);
      ctx.fillStyle = topDark;
      ctx.fillRect(0, 6, 8, 2);
      return track(finalizePixelTexture(canvas));
    }
    ctx.fillStyle = skin;
    ctx.fillRect(0, 0, 8, 8);
    ctx.fillStyle = skinLight;
    ctx.fillRect(2, 1, 4, 4);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(0, 6, 8, 2);
    return track(finalizePixelTexture(canvas));
  })();

  // --- LEGS (8x10) ---
  const upperLeg = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 10);
    if (appearance.topStyle === 'bodysuit') {
      // Upper thigh bodysuit transitioning into angled thigh-high gold/crimson boots
      ctx.fillStyle = pants;
      ctx.fillRect(0, 0, 8, 4);
      ctx.fillStyle = shoe;
      ctx.fillRect(0, 4, 8, 6);
      ctx.fillRect(3, 3, 2, 1); // angled V-cut thigh boot peak
      ctx.fillStyle = shoeAccent;
      ctx.fillRect(2, 5, 3, 4);
      ctx.fillStyle = shoeDark;
      ctx.fillRect(0, 8, 8, 2);
      return track(finalizePixelTexture(canvas));
    }
    if (appearance.topStyle === 'hela-armor') {
      ctx.fillStyle = pants;
      ctx.fillRect(0, 0, 8, 10);
      ctx.fillStyle = emblem;
      ctx.fillRect(1, 0, 1, 10);
      ctx.fillRect(5, 1, 1, 8);
      ctx.fillStyle = pantsDark;
      ctx.fillRect(0, 8, 8, 2);
      return track(finalizePixelTexture(canvas));
    }
    if (appearance.pantsStyle === 'tights') {
      ctx.fillStyle = pants;
      ctx.fillRect(0, 0, 8, 10);
      ctx.fillStyle = pantsLight;
      ctx.fillRect(2, 1, 4, 7);
      ctx.fillStyle = pantsAccent;
      ctx.fillRect(0, 0, 8, 2);
      ctx.fillStyle = pantsDark;
      ctx.fillRect(0, 8, 8, 2);
      return track(finalizePixelTexture(canvas));
    }
    ctx.fillStyle = pants;
    ctx.fillRect(0, 0, 8, 10);
    ctx.fillStyle = pantsLight;
    ctx.fillRect(2, 1, 4, 7);
    ctx.fillStyle = pantsAccent;
    ctx.fillRect(0, 0, 1, 10);
    ctx.fillStyle = pantsDark;
    ctx.fillRect(0, 8, 8, 2);
    return track(finalizePixelTexture(canvas));
  })();

  const lowerLeg = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 10);
    if (appearance.topStyle === 'bodysuit' || appearance.topStyle === 'emma-corset') {
      // Full thigh/knee-high boots / white tailored boots
      ctx.fillStyle = shoe;
      ctx.fillRect(0, 0, 8, 10);
      ctx.fillStyle = shoeAccent;
      ctx.fillRect(2, 1, 3, 7);
      ctx.fillStyle = shoeDark;
      ctx.fillRect(0, 8, 8, 2);
    } else if (appearance.topStyle === 'hela-armor') {
      ctx.fillStyle = shoe;
      ctx.fillRect(0, 0, 8, 10);
      ctx.fillStyle = shoeAccent;
      ctx.fillRect(3, 1, 2, 7);
      ctx.fillStyle = shoeDark;
      ctx.fillRect(0, 8, 8, 2);
    } else if (appearance.pantsStyle === 'tights') {
      // Rose-pink tights down to crimson V-notched knee-high boots
      ctx.fillStyle = pants;
      ctx.fillRect(0, 0, 8, 4);
      ctx.fillStyle = shoe;
      ctx.fillRect(0, 3, 8, 7);
      ctx.fillStyle = shoeAccent;
      ctx.fillRect(3, 2, 2, 2); // V-notch boot peak
      ctx.fillStyle = shoeDark;
      ctx.fillRect(0, 8, 8, 2);
    } else if (appearance.pantsStyle === 'shorts') {
      ctx.fillStyle = skin;
      ctx.fillRect(0, 0, 8, 7);
      ctx.fillStyle = skinShadow;
      ctx.fillRect(0, 5, 8, 2);
      // Crew socks
      ctx.fillStyle = sole;
      ctx.fillRect(0, 7, 8, 3);
      ctx.fillStyle = shoeAccent;
      ctx.fillRect(0, 7, 8, 1);
    } else {
      ctx.fillStyle = pants;
      ctx.fillRect(0, 0, 8, 8);
      ctx.fillStyle = pantsDark;
      ctx.fillRect(0, 6, 8, 2);
      // Jogger cuff / folded denim cuff
      ctx.fillStyle = pantsAccent;
      ctx.fillRect(0, 8, 8, 2);
    }
    return track(finalizePixelTexture(canvas));
  })();

  // --- SNEAKERS / BOOTS / FEET ---
  const footFront = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 8);
    ctx.fillStyle = shoe;
    ctx.fillRect(0, 0, 8, 6);
    if (appearance.pantsStyle === 'tights') {
      ctx.fillStyle = shoeAccent;
      ctx.fillRect(2, 1, 4, 3);
      ctx.fillStyle = sole;
      ctx.fillRect(0, 6, 8, 2);
    } else {
      // Tongue + pixel laces
      ctx.fillStyle = shoeAccent;
      ctx.fillRect(2, 0, 4, 2);
      ctx.fillStyle = sole;
      ctx.fillRect(2, 2, 4, 1);
      ctx.fillRect(2, 4, 4, 1);
      // Crisp midsole
      ctx.fillStyle = sole;
      ctx.fillRect(0, 5, 8, 3);
    }
    return track(finalizePixelTexture(canvas));
  })();

  const footSide = (() => {
    const { canvas, ctx } = createPixelCanvas(12, 8);
    ctx.fillStyle = shoe;
    ctx.fillRect(0, 0, 12, 6);
    ctx.fillStyle = shoeDark;
    ctx.fillRect(0, 4, 12, 2);
    if (appearance.pantsStyle === 'tights') {
      ctx.fillStyle = sole;
      ctx.fillRect(0, 6, 12, 2);
    } else {
      ctx.fillStyle = shoeAccent;
      ctx.fillRect(3, 2, 6, 2);
      ctx.fillStyle = sole;
      ctx.fillRect(0, 5, 12, 3);
    }
    return track(finalizePixelTexture(canvas));
  })();

  const footBack = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 8);
    ctx.fillStyle = shoe;
    ctx.fillRect(0, 0, 8, 6);
    ctx.fillStyle = shoeAccent;
    ctx.fillRect(2, 0, 4, 3);
    ctx.fillStyle = sole;
    ctx.fillRect(0, appearance.pantsStyle === 'tights' ? 6 : 5, 8, 3);
    return track(finalizePixelTexture(canvas));
  })();

  const footTop = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 12);
    ctx.fillStyle = shoe;
    ctx.fillRect(0, 0, 8, 12);
    ctx.fillStyle = sole;
    ctx.fillRect(2, 3, 4, 5);
    ctx.fillStyle = shoeAccent;
    ctx.fillRect(2, 9, 4, 3);
    return track(finalizePixelTexture(canvas));
  })();

  const footSole = (() => {
    const { canvas, ctx } = createPixelCanvas(8, 12);
    ctx.fillStyle = shadeHex(sole, 0.86);
    ctx.fillRect(0, 0, 8, 12);
    ctx.fillStyle = shoeAccent;
    ctx.fillRect(1, 2, 6, 2);
    ctx.fillRect(1, 8, 6, 2);
    return track(finalizePixelTexture(canvas));
  })();

  return {
    headFront,
    headBack,
    headSideL,
    headSideR,
    headTop,
    skinPlain,
    chestFront,
    chestBack,
    chestSide,
    chestTop,
    waistBand,
    upperArm,
    lowerArm,
    hand,
    upperLeg,
    lowerLeg,
    footFront,
    footSide,
    footBack,
    footTop,
    footSole,
    dispose: () => {
      created.forEach((t) => t.dispose());
    },
  };
}
