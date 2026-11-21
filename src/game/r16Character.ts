import * as THREE from 'three';
import { CharacterAppearance } from './characterConfig';
import { buildNecroswordGroup, NecroswordRig } from './necrosword';
import { createCharacterPixelTextures } from './pixelTextures';

export interface R16Rig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  pelvis: THREE.Group;
  waist: THREE.Group;
  chest: THREE.Group;
  head: THREE.Group;

  leftUpperArm: THREE.Group;
  leftLowerArm: THREE.Group;
  leftHand: THREE.Group;

  rightUpperArm: THREE.Group;
  rightLowerArm: THREE.Group;
  rightHand: THREE.Group;

  leftUpperLeg: THREE.Group;
  leftLowerLeg: THREE.Group;
  leftFoot: THREE.Group;

  rightUpperLeg: THREE.Group;
  rightLowerLeg: THREE.Group;
  rightFoot: THREE.Group;

  capePivot: THREE.Group | null;
  hairBackPivot: THREE.Group | null;
  sashPivot: THREE.Group | null;

  setOpacity: (alpha: number) => void;
  setHitFlash: (amount: number) => void;
  setDiamondForm: (blend: number) => void;
  setAstralProjection: (active: boolean) => void;
  setHelaCrownMode: (enabled: boolean) => void;
  setHelaCrownProgress: (blend: number) => void;
  setHelaHandSword: (visible: boolean) => void;
  setHelaHandSwords: (leftVisible: boolean, rightVisible: boolean) => void;
  setNpcWeapon: (kind: 'none' | 'blade' | 'mace') => void;
  dispose: () => void;
}

interface MaterialSnapshot {
  mat: THREE.MeshStandardMaterial;
  map: THREE.Texture | null;
  colorHex: number;
  roughness: number;
  metalness: number;
  opacity: number;
  transparent: boolean;
  emissiveHex: number;
  emissiveIntensity: number;
}

function makeMat(
  map: THREE.Texture,
  roughness = 0.82,
  metalness = 0.02,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map,
    roughness,
    metalness,
  });
}

function makeColorMat(
  color: string,
  roughness = 0.82,
  metalness = 0.02,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
  });
}

export function createR16Character(appearance: CharacterAppearance): R16Rig {
  const tex = createCharacterPixelTextures(appearance);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.MeshStandardMaterial[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.MeshStandardMaterial>(m: T): T => {
    materials.push(m);
    return m;
  };

  const makeShadowMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material | THREE.Material[],
  ) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  const isScarletWitch = appearance.archetype === 'scarlet-witch';
  const isPhoenixForce = appearance.archetype === 'phoenix-force';
  const isEmmaFrost = appearance.archetype === 'emma-frost';
  const isHela = appearance.archetype === 'hela';
  const isHeroine = isScarletWitch || isPhoenixForce || isEmmaFrost || isHela;

  const root = new THREE.Group();
  const bodyPivot = new THREE.Group();
  root.add(bodyPivot);

  // 1. Pelvis (LowerTorso)
  const pelvis = new THREE.Group();
  pelvis.position.set(0, 0.88, 0);
  bodyPivot.add(pelvis);

  const pelvisMat = trackMat(makeMat(tex.waistBand, 0.86));
  const pelvisMesh = makeShadowMesh(
    trackGeo(new THREE.BoxGeometry(0.5, 0.16, 0.28)),
    pelvisMat,
  );
  pelvisMesh.position.set(0, 0.06, 0);
  pelvis.add(pelvisMesh);

  // Phoenix Force / Dark Phoenix iconic 3D diagonal waist sash + draping hip ribbon tails
  let sashPivot: THREE.Group | null = null;
  if (isPhoenixForce) {
    const sashMainMat = trackMat(
      makeColorMat(appearance.sashColor ?? appearance.topSecondary, 0.56, 0.18),
    );
    const sashTrimMat = trackMat(
      makeColorMat(appearance.shoeAccent ?? '#FFE680', 0.52, 0.22),
    );

    const sashWrap = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.54, 0.075, 0.305)),
      sashMainMat,
    );
    sashWrap.position.set(0, 0.11, 0);
    sashWrap.rotation.z = -0.18;
    pelvis.add(sashWrap);

    sashPivot = new THREE.Group();
    sashPivot.position.set(-0.275, 0.09, 0.01);
    pelvis.add(sashPivot);

    const sashTailA = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.055, 0.52, 0.14)),
      sashMainMat,
    );
    sashTailA.position.set(-0.025, -0.25, 0.01);
    sashTailA.rotation.z = -0.14;
    sashTailA.rotation.x = 0.06;
    sashPivot.add(sashTailA);

    const sashTailB = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.045, 0.38, 0.1)),
      sashTrimMat,
    );
    sashTailB.position.set(-0.045, -0.19, -0.05);
    sashTailB.rotation.z = -0.22;
    sashTailB.rotation.x = -0.08;
    sashPivot.add(sashTailB);
  }

  // 2. Waist (MidTorso connector)
  const waist = new THREE.Group();
  waist.position.set(0, 0.12, 0);
  pelvis.add(waist);

  const waistMat = isEmmaFrost
    ? trackMat(makeMat(tex.skinPlain, 0.78))
    : trackMat(makeColorMat(appearance.topPrimary, 0.84));
  const waistMesh = makeShadowMesh(
    trackGeo(new THREE.BoxGeometry(isHeroine ? 0.44 : 0.49, 0.1, 0.25)),
    waistMat,
  );
  waistMesh.position.set(0, 0.04, 0);
  waist.add(waistMesh);

  // 3. Chest (UpperTorso)
  const chest = new THREE.Group();
  chest.position.set(0, 0.07, 0);
  waist.add(chest);

  const chestMaterials = [
    trackMat(makeMat(tex.chestSide, 0.84)),
    trackMat(makeMat(tex.chestSide, 0.84)),
    trackMat(makeMat(tex.chestTop, 0.84)),
    trackMat(
      isEmmaFrost
        ? makeMat(tex.skinPlain, 0.78)
        : makeColorMat(appearance.topPrimary, 0.86),
    ),
    trackMat(makeMat(tex.chestBack, 0.84)),
    trackMat(makeMat(tex.chestFront, 0.84)),
  ];
  const chestMesh = makeShadowMesh(
    trackGeo(new THREE.BoxGeometry(isHeroine ? 0.52 : 0.56, 0.4, 0.29)),
    chestMaterials,
  );
  chestMesh.position.set(0, 0.2, 0);
  chest.add(chestMesh);

  if (isPhoenixForce) {
    const collarMat = trackMat(makeColorMat(appearance.topAccent, 0.72, 0.08));
    const collarMesh = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.24, 0.085, 0.23)),
      collarMat,
    );
    collarMesh.position.set(0, 0.41, 0);
    chest.add(collarMesh);
  }

  if (isHela) {
    // High dark collar + pointed angled emerald-black shoulder pauldrons
    const armorMat = trackMat(makeColorMat('#151B1E', 0.55, 0.35));
    const armorTrimMat = trackMat(makeColorMat('#648276', 0.38, 0.55));
    const collarMesh = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.25, 0.1, 0.24)),
      armorMat,
    );
    collarMesh.position.set(0, 0.42, 0);
    chest.add(collarMesh);

    for (const side of [-1, 1] as const) {
      const pauldron = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.22, 0.065, 0.22)),
        armorMat,
      );
      pauldron.position.set(side * 0.36, 0.4, 0);
      pauldron.rotation.z = side * 0.24;
      chest.add(pauldron);

      const pauldronSpike = makeShadowMesh(
        trackGeo(new THREE.ConeGeometry(0.055, 0.12, 4)),
        armorTrimMat,
      );
      pauldronSpike.position.set(side * 0.46, 0.44, 0);
      pauldronSpike.rotation.z = side * -1.15;
      pauldronSpike.scale.set(1, 1, 0.55);
      chest.add(pauldronSpike);
    }
  }

  if (appearance.topStyle === 'hoodie') {
    const hoodMat = trackMat(makeColorMat(appearance.topPrimary, 0.86));
    const hoodMesh = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.36, 0.12, 0.12)),
      hoodMat,
    );
    hoodMesh.position.set(0, 0.38, 0.16);
    hoodMesh.rotation.x = 0.18;
    chest.add(hoodMesh);
  }

  // Scarlet Witch & Emma Frost flowing capes
  let capePivot: THREE.Group | null = null;
  if (isScarletWitch || isEmmaFrost) {
    const capeOuterMat = trackMat(
      makeColorMat(isEmmaFrost ? '#F6F9FC' : '#B91323', 0.8, 0.04),
    );
    const capeInnerMat = trackMat(
      makeColorMat(isEmmaFrost ? '#CEDAE6' : '#720914', 0.86, 0.02),
    );
    const claspMat = trackMat(
      makeColorMat(isEmmaFrost ? '#EEF3F9' : '#E32436', 0.55, 0.1),
    );

    const cowl = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.56, isEmmaFrost ? 0.07 : 0.1, 0.34)),
      claspMat,
    );
    cowl.position.set(0, isEmmaFrost ? 0.36 : 0.39, 0.02);
    cowl.rotation.x = 0.08;
    chest.add(cowl);

    if (isEmmaFrost) {
      // 3D circular red/gold X brooch clasp on chest center
      const broochRim = makeShadowMesh(
        trackGeo(new THREE.CylinderGeometry(0.068, 0.068, 0.025, 12)),
        trackMat(makeColorMat('#D62828', 0.38, 0.35)),
      );
      broochRim.rotation.x = Math.PI * 0.5;
      broochRim.position.set(0, 0.33, -0.155);
      chest.add(broochRim);

      const broochGold = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.082, 0.018, 0.032)),
        trackMat(makeColorMat('#F4C430', 0.3, 0.65)),
      );
      broochGold.position.set(0, 0.33, -0.162);
      broochGold.rotation.z = Math.PI * 0.25;
      chest.add(broochGold);

      const broochGoldB = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.082, 0.018, 0.032)),
        trackMat(makeColorMat('#F4C430', 0.3, 0.65)),
      );
      broochGoldB.position.set(0, 0.33, -0.162);
      broochGoldB.rotation.z = -Math.PI * 0.25;
      chest.add(broochGoldB);
    }

    capePivot = new THREE.Group();
    capePivot.position.set(0, 0.37, 0.16);
    capePivot.rotation.x = 0.14;
    chest.add(capePivot);

    const capeUpper = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.64, 0.56, 0.04)),
      capeOuterMat,
    );
    capeUpper.position.set(0, -0.28, 0.02);
    capePivot.add(capeUpper);

    const capeLower = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.76, 0.54, 0.035)),
      capeOuterMat,
    );
    capeLower.position.set(0, -0.76, 0.05);
    capeLower.rotation.x = 0.09;
    capePivot.add(capeLower);

    const capeLining = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.68, 0.94, 0.015)),
      capeInnerMat,
    );
    capeLining.position.set(0, -0.5, 0.01);
    capeLining.rotation.x = 0.05;
    capePivot.add(capeLining);
  }

  // 4. Faceless Head + Neck
  const head = new THREE.Group();
  head.position.set(0, 0.42, 0);
  chest.add(head);

  const skinMat = trackMat(makeMat(tex.skinPlain, 0.78));
  const neckMesh = makeShadowMesh(
    trackGeo(new THREE.BoxGeometry(0.18, 0.1, 0.18)),
    skinMat,
  );
  neckMesh.position.set(0, 0.03, 0);
  head.add(neckMesh);

  if (isEmmaFrost) {
    // Sleek white choker around Emma Frost's neck
    const choker = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.205, 0.042, 0.205)),
      trackMat(makeColorMat('#F4F8FC', 0.55, 0.08)),
    );
    choker.position.set(0, 0.038, 0);
    head.add(choker);
  }

  // Box faces: [+X, -X, +Y, -Y, +Z (back), -Z (front)]
  const headMaterials = [
    trackMat(makeMat(tex.headSideR, 0.78)),
    trackMat(makeMat(tex.headSideL, 0.78)),
    trackMat(makeMat(tex.headTop, 0.82)),
    skinMat,
    trackMat(makeMat(tex.headBack, 0.84)),
    trackMat(makeMat(tex.headFront, 0.76)),
  ];
  const headMesh = makeShadowMesh(
    trackGeo(new THREE.BoxGeometry(0.46, 0.44, 0.44)),
    headMaterials,
  );
  headMesh.position.set(0, 0.28, 0);
  head.add(headMesh);

  const hairCrownMat = trackMat(makeColorMat(appearance.hair, 0.86));
  const hairCrown = makeShadowMesh(
    trackGeo(new THREE.BoxGeometry(0.49, 0.09, 0.47)),
    hairCrownMat,
  );
  hairCrown.position.set(0, 0.49, 0.01);
  head.add(hairCrown);

  // Flowing hair for Scarlet Witch, Phoenix Force, Emma Frost (shoulder-length), and Hela (tousled)
  let hairBackPivot: THREE.Group | null = null;
  let helaHairGroup: THREE.Group | null = null;
  let helaCrownGroup: THREE.Group | null = null;

  if (isHela) {
    // Default tousled voluminous jet-black hair (hidden when Crown Form is active)
    helaHairGroup = new THREE.Group();
    head.add(helaHairGroup);

    const helaHairMat = hairCrownMat;
    const helaHairShadeMat = trackMat(
      makeColorMat(appearance.hairSecondary ?? '#0A0B0E', 0.9),
    );

    const topVolume = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.52, 0.11, 0.49)),
      helaHairMat,
    );
    topVolume.position.set(0, 0.51, 0.01);
    helaHairGroup.add(topVolume);

    // Messy sweeping bangs / cheek locks
    for (const side of [-1, 1] as const) {
      const sideLock = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.11, 0.48, 0.26)),
        helaHairMat,
      );
      sideLock.position.set(side * 0.265, 0.26, 0.05);
      helaHairGroup.add(sideLock);

      const wildWave = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.125, 0.34, 0.22)),
        helaHairShadeMat,
      );
      wildWave.position.set(side * 0.285, 0.0, 0.04);
      wildWave.rotation.z = side * -0.14;
      helaHairGroup.add(wildWave);
    }

    hairBackPivot = new THREE.Group();
    hairBackPivot.position.set(0, 0.43, 0.21);
    helaHairGroup.add(hairBackPivot);

    const backMane = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.54, 0.58, 0.16)),
      helaHairMat,
    );
    backMane.position.set(0, -0.28, 0.05);
    backMane.rotation.x = 0.08;
    hairBackPivot.add(backMane);

    const backEnds = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.48, 0.28, 0.13)),
      helaHairShadeMat,
    );
    backEnds.position.set(0, -0.62, 0.08);
    backEnds.rotation.x = 0.15;
    hairBackPivot.add(backEnds);

    // Hela Iconic Antlered Dark Emerald-Black Crown (visible ONLY during Crown Form)
    helaCrownGroup = new THREE.Group();
    helaCrownGroup.visible = false;
    head.add(helaCrownGroup);

    const crownMat = trackMat(makeColorMat('#0D1813', 0.36, 0.62));
    const crownEdgeMat = trackMat(makeColorMat('#264A3B', 0.28, 0.72));

    // Sleek armored helmet cap covering hair dome
    const helmCap = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.5, 0.22, 0.48)),
      crownMat,
    );
    helmCap.position.set(0, 0.44, 0.01);
    helaCrownGroup.add(helmCap);

    // Brow V-ridge framing face
    const helmBrow = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.49, 0.08, 0.06)),
      crownEdgeMat,
    );
    helmBrow.position.set(0, 0.4, -0.23);
    helaCrownGroup.add(helmBrow);

    // Symmetrical multi-antler branches sweeping outward & upward (reference image)
    const antlerSpecs: Array<{
      x: number;
      y: number;
      z: number;
      len: number;
      w: number;
      rz: number;
      rx: number;
    }> = [
      // Inner steep horns
      { x: 0.14, y: 0.68, z: -0.02, len: 0.42, w: 0.055, rz: -0.24, rx: -0.05 },
      // Mid sweeping tall tines
      { x: 0.34, y: 0.76, z: 0.02, len: 0.62, w: 0.065, rz: -0.68, rx: 0.04 },
      // Outer dramatic wide antlers
      { x: 0.56, y: 0.72, z: 0.05, len: 0.86, w: 0.072, rz: -1.04, rx: 0.08 },
      // Outer tip flare upward
      { x: 0.88, y: 0.92, z: 0.08, len: 0.42, w: 0.045, rz: -0.78, rx: 0.1 },
    ];

    for (const side of [-1, 1] as const) {
      // Cheek / ear armor guard
      const cheek = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.06, 0.32, 0.28)),
        crownMat,
      );
      cheek.position.set(side * 0.255, 0.31, 0.02);
      helaCrownGroup.add(cheek);

      // Curved lower antler bridge
      const bridge = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.46, 0.075, 0.06)),
        crownMat,
      );
      bridge.position.set(side * 0.38, 0.53, 0.01);
      bridge.rotation.z = side * 0.24;
      helaCrownGroup.add(bridge);

      for (const a of antlerSpecs) {
        const antler = makeShadowMesh(
          trackGeo(new THREE.ConeGeometry(a.w * 0.55, a.len, 4)),
          a.len > 0.7 ? crownMat : crownEdgeMat,
        );
        antler.position.set(side * a.x, a.y, a.z);
        antler.rotation.z = side * a.rz;
        antler.rotation.x = a.rx;
        antler.scale.set(1.0, 1.0, 0.52);
        helaCrownGroup.add(antler);
      }
    }
  } else if (isHeroine) {
    const hairMat = hairCrownMat;
    const hairDarkMat = trackMat(
      makeColorMat(appearance.hairSecondary ?? '#321712', 0.88),
    );

    for (const side of [-1, 1] as const) {
      const sideUpper = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.095, 0.44, 0.26)),
        hairMat,
      );
      sideUpper.position.set(side * 0.255, 0.27, 0.06);
      head.add(sideUpper);

      const sideWave = makeShadowMesh(
        trackGeo(
          new THREE.BoxGeometry(
            0.11,
            isEmmaFrost ? 0.26 : 0.36,
            0.21,
          ),
        ),
        hairDarkMat,
      );
      sideWave.position.set(
        side * 0.27,
        isEmmaFrost ? 0.05 : -0.01,
        0.04,
      );
      sideWave.rotation.z = side * (isEmmaFrost ? -0.14 : -0.09);
      head.add(sideWave);
    }

    hairBackPivot = new THREE.Group();
    hairBackPivot.position.set(0, 0.42, 0.21);
    head.add(hairBackPivot);

    const backHeight = isEmmaFrost ? 0.44 : 0.62;
    const hairBackMain = makeShadowMesh(
      trackGeo(
        new THREE.BoxGeometry(
          isPhoenixForce ? 0.54 : 0.5,
          backHeight,
          0.14,
        ),
      ),
      hairMat,
    );
    hairBackMain.position.set(0, -backHeight * 0.5, 0.05);
    hairBackMain.rotation.x = 0.07;
    hairBackPivot.add(hairBackMain);

    const hairBackTip = makeShadowMesh(
      trackGeo(
        new THREE.BoxGeometry(
          isPhoenixForce ? 0.48 : 0.44,
          isEmmaFrost ? 0.18 : 0.32,
          0.12,
        ),
      ),
      hairDarkMat,
    );
    hairBackTip.position.set(0, isEmmaFrost ? -0.49 : -0.71, 0.085);
    hairBackTip.rotation.x = isEmmaFrost ? 0.2 : 0.13;
    hairBackPivot.add(hairBackTip);
  }

  // Optional Hat / Cap / Beanie / Scarlet Witch Tiara silhouette
  if (appearance.hatStyle === 'tiara') {
    const tiaraMat = trackMat(makeColorMat(appearance.hatColor, 0.42, 0.18));
    const tiaraTrimMat = trackMat(makeColorMat('#FF4D5C', 0.36, 0.22));

    const browBand = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.48, 0.09, 0.06)),
      tiaraMat,
    );
    browBand.position.set(0, 0.42, -0.225);
    head.add(browBand);

    const centerPoint = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.11, 0.1, 0.065)),
      tiaraTrimMat,
    );
    centerPoint.position.set(0, 0.37, -0.23);
    centerPoint.rotation.z = Math.PI * 0.25;
    head.add(centerPoint);

    for (const side of [-1, 1] as const) {
      const hornPeak = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.13, 0.28, 0.06)),
        tiaraMat,
      );
      hornPeak.position.set(side * 0.175, 0.56, -0.225);
      hornPeak.rotation.z = side * -0.24;
      head.add(hornPeak);

      const hornTip = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.075, 0.12, 0.05)),
        tiaraTrimMat,
      );
      hornTip.position.set(side * 0.215, 0.69, -0.225);
      hornTip.rotation.z = side * -0.28;
      head.add(hornTip);

      const cheekGuard = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.055, 0.29, 0.12)),
        tiaraMat,
      );
      cheekGuard.position.set(side * 0.235, 0.28, -0.18);
      head.add(cheekGuard);
    }
  } else if (appearance.hatStyle === 'beanie') {
    const beanieMat = trackMat(makeColorMat(appearance.hatColor, 0.88));
    const beanieRim = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.5, 0.1, 0.48)),
      beanieMat,
    );
    beanieRim.position.set(0, 0.44, 0.01);
    head.add(beanieRim);

    const beanieTop = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.44, 0.12, 0.42)),
      beanieMat,
    );
    beanieTop.position.set(0, 0.53, 0.02);
    head.add(beanieTop);
  } else if (appearance.hatStyle === 'cap') {
    const capMat = trackMat(makeColorMat(appearance.hatColor, 0.8));
    const capDome = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.49, 0.13, 0.47)),
      capMat,
    );
    capDome.position.set(0, 0.47, 0);
    head.add(capDome);

    const capVisor = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.46, 0.04, 0.22)),
      capMat,
    );
    capVisor.position.set(0, 0.41, -0.31);
    head.add(capVisor);
  }

  // Shared Arm & Leg materials
  const upperArmMat = trackMat(makeMat(tex.upperArm, 0.84));
  const lowerArmMat = trackMat(makeMat(tex.lowerArm, 0.84));
  const handMat = trackMat(makeMat(tex.hand, 0.78));

  const upperLegMat = trackMat(makeMat(tex.upperLeg, 0.86));
  const lowerLegMat = trackMat(makeMat(tex.lowerLeg, 0.86));
  const footMaterials = [
    trackMat(makeMat(tex.footSide, 0.65)),
    trackMat(makeMat(tex.footSide, 0.65)),
    trackMat(makeMat(tex.footTop, 0.68)),
    trackMat(makeMat(tex.footSole, 0.75)),
    trackMat(makeMat(tex.footBack, 0.68)),
    trackMat(makeMat(tex.footFront, 0.65)),
  ];

  const cuffMat = isScarletWitch
    ? trackMat(makeColorMat('#DF1E30', 0.72, 0.06))
    : isPhoenixForce
      ? trackMat(makeColorMat(appearance.topSecondary, 0.48, 0.22))
      : isEmmaFrost
        ? trackMat(makeColorMat('#E5EDF6', 0.6, 0.08))
        : null;

  const buildArm = (side: -1 | 1) => {
    const upperArm = new THREE.Group();
    upperArm.position.set(side * (isHeroine ? 0.365 : 0.39), 0.35, 0);
    chest.add(upperArm);

    const upperMesh = makeShadowMesh(
      trackGeo(
        new THREE.BoxGeometry(
          isHeroine ? 0.18 : 0.2,
          0.28,
          isHeroine ? 0.18 : 0.2,
        ),
      ),
      upperArmMat,
    );
    upperMesh.position.set(0, -0.11, 0);
    upperArm.add(upperMesh);

    const lowerArm = new THREE.Group();
    lowerArm.position.set(0, -0.24, 0);
    upperArm.add(lowerArm);

    const lowerMesh = makeShadowMesh(
      trackGeo(
        new THREE.BoxGeometry(
          isHeroine ? 0.175 : 0.185,
          0.26,
          isHeroine ? 0.175 : 0.185,
        ),
      ),
      lowerArmMat,
    );
    lowerMesh.position.set(0, -0.12, 0);
    lowerArm.add(lowerMesh);

    if (cuffMat) {
      const gloveCuff = makeShadowMesh(
        trackGeo(new THREE.BoxGeometry(0.205, 0.05, 0.205)),
        cuffMat,
      );
      gloveCuff.position.set(0, -0.02, 0);
      lowerArm.add(gloveCuff);
    }

    const hand = new THREE.Group();
    hand.position.set(0, -0.24, 0);
    lowerArm.add(hand);

    const handMesh = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.16, 0.15, 0.16)),
      handMat,
    );
    handMesh.position.set(0, -0.06, 0);
    hand.add(handMesh);

    return { upperArm, lowerArm, hand };
  };

  const leftArm = buildArm(-1);
  const rightArm = buildArm(1);

  // Hela's conjured dual Necrosword attachments (one in each hand, toggled on Sword Summon)
  let helaLeftHandSword: NecroswordRig | null = null;
  let helaRightHandSword: NecroswordRig | null = null;
  if (isHela) {
    helaLeftHandSword = buildNecroswordGroup('standard');
    helaLeftHandSword.group.position.set(-0.02, -0.08, -0.04);
    helaLeftHandSword.group.rotation.set(-Math.PI * 0.45, 0, 0.14);
    helaLeftHandSword.group.visible = false;
    leftArm.hand.add(helaLeftHandSword.group);

    helaRightHandSword = buildNecroswordGroup('standard');
    helaRightHandSword.group.position.set(0.02, -0.08, -0.04);
    helaRightHandSword.group.rotation.set(-Math.PI * 0.45, 0, -0.14);
    helaRightHandSword.group.visible = false;
    rightArm.hand.add(helaRightHandSword.group);
  }

  // Bandit NPC held weapon attachments (multi-part blade or heavy mace)
  let npcBladeGroup: THREE.Group | null = null;
  let npcMaceGroup: THREE.Group | null = null;
  if (appearance.archetype === 'npc-bandit') {
    const steelMat = trackMat(makeColorMat('#7B8696', 0.28, 0.85));
    const darkIronMat = trackMat(makeColorMat('#2B303B', 0.45, 0.72));
    const woodMat = trackMat(makeColorMat('#4A3222', 0.78, 0.08));

    // Bandit Blade (short jagged bandit machete/blade)
    npcBladeGroup = new THREE.Group();
    const bGrip = makeShadowMesh(trackGeo(new THREE.CylinderGeometry(0.022, 0.024, 0.22, 7)), woodMat);
    bGrip.position.set(0, -0.02, 0);
    const bGuard = makeShadowMesh(trackGeo(new THREE.BoxGeometry(0.16, 0.036, 0.055)), darkIronMat);
    bGuard.position.set(0, 0.1, 0);
    const bBlade = makeShadowMesh(trackGeo(new THREE.BoxGeometry(0.075, 0.56, 0.024)), steelMat);
    bBlade.position.set(0, 0.39, 0);
    const bTip = makeShadowMesh(trackGeo(new THREE.ConeGeometry(0.042, 0.18, 4)), steelMat);
    bTip.position.set(0, 0.74, 0);
    bTip.rotation.y = Math.PI * 0.25;
    bTip.scale.set(1, 1, 0.45);
    npcBladeGroup.add(bGrip, bGuard, bBlade, bTip);
    npcBladeGroup.position.set(0.02, -0.07, -0.04);
    npcBladeGroup.rotation.set(-Math.PI * 0.48, 0, -0.06);
    npcBladeGroup.visible = false;
    rightArm.hand.add(npcBladeGroup);

    // Bandit Heavy Mace
    npcMaceGroup = new THREE.Group();
    const mShaft = makeShadowMesh(trackGeo(new THREE.CylinderGeometry(0.024, 0.026, 0.54, 7)), woodMat);
    mShaft.position.set(0, 0.15, 0);
    const mCollar = makeShadowMesh(trackGeo(new THREE.CylinderGeometry(0.04, 0.034, 0.08, 8)), darkIronMat);
    mCollar.position.set(0, 0.42, 0);
    const mHead = makeShadowMesh(trackGeo(new THREE.DodecahedronGeometry(0.11, 0)), darkIronMat);
    mHead.position.set(0, 0.52, 0);
    const mBand = makeShadowMesh(trackGeo(new THREE.BoxGeometry(0.24, 0.045, 0.24)), steelMat);
    mBand.position.set(0, 0.52, 0);
    npcMaceGroup.add(mShaft, mCollar, mHead, mBand);
    npcMaceGroup.position.set(0.02, -0.07, -0.04);
    npcMaceGroup.rotation.set(-Math.PI * 0.48, 0, -0.06);
    npcMaceGroup.visible = false;
    rightArm.hand.add(npcMaceGroup);
  }

  const buildLeg = (side: -1 | 1) => {
    const upperLeg = new THREE.Group();
    upperLeg.position.set(side * 0.145, -0.02, 0);
    pelvis.add(upperLeg);

    const upperMesh = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.23, 0.38, 0.23)),
      upperLegMat,
    );
    upperMesh.position.set(0, -0.18, 0);
    upperLeg.add(upperMesh);

    const lowerLeg = new THREE.Group();
    lowerLeg.position.set(0, -0.36, 0);
    upperLeg.add(lowerLeg);

    const lowerMesh = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.22, 0.36, 0.22)),
      lowerLegMat,
    );
    lowerMesh.position.set(0, -0.18, 0);
    lowerLeg.add(lowerMesh);

    const foot = new THREE.Group();
    foot.position.set(0, -0.36, 0);
    lowerLeg.add(foot);

    const footMesh = makeShadowMesh(
      trackGeo(new THREE.BoxGeometry(0.235, 0.14, 0.33)),
      footMaterials,
    );
    footMesh.position.set(0, -0.07, -0.045);
    foot.add(footMesh);

    return { upperLeg, lowerLeg, foot };
  };

  const leftLeg = buildLeg(-1);
  const rightLeg = buildLeg(1);

  // Save baseline material state so Diamond Form & Astral Projection cleanly morph & restore
  const snapshots: MaterialSnapshot[] = materials.map((mat) => ({
    mat,
    map: mat.map,
    colorHex: mat.color.getHex(),
    roughness: mat.roughness,
    metalness: mat.metalness,
    opacity: mat.opacity,
    transparent: mat.transparent,
    emissiveHex: mat.emissive.getHex(),
    emissiveIntensity: mat.emissiveIntensity,
  }));

  let baseOpacity = 1;
  let diamondBlend = 0;
  let astralActive = false;
  let hitFlashAmt = 0;

  const crystalColor = new THREE.Color(0xdcf2ff);
  const origColorTmp = new THREE.Color();

  const applyVisualMaterialState = () => {
    const db = diamondBlend;
    const isCrystal = db > 0.02;
    const targetAlpha =
      baseOpacity *
      (astralActive ? 0.38 : 1) *
      (isCrystal ? THREE.MathUtils.lerp(1, 0.84, db) : 1);
    const isTransparent = targetAlpha < 0.995;

    for (let i = 0; i < snapshots.length; i++) {
      const s = snapshots[i];
      const m = s.mat;
      const desiredMap = db > 0.55 ? null : s.map;
      if (m.map !== desiredMap) {
        m.map = desiredMap;
        m.needsUpdate = true;
      }

      if (isCrystal) {
        origColorTmp.setHex(s.colorHex);
        m.color.copy(origColorTmp).lerp(crystalColor, db * 0.92);
        m.roughness = THREE.MathUtils.lerp(s.roughness, 0.08, db);
        m.metalness = THREE.MathUtils.lerp(s.metalness, 0.52, db);
      } else {
        m.color.setHex(s.colorHex);
        m.roughness = s.roughness;
        m.metalness = s.metalness;
      }

      m.transparent = isTransparent;
      m.opacity = targetAlpha;
      m.depthWrite = targetAlpha > 0.3;

      if (hitFlashAmt > 0.005) {
        m.emissive.setRGB(
          hitFlashAmt * 0.72,
          hitFlashAmt * 0.16,
          hitFlashAmt * 0.16,
        );
        m.emissiveIntensity = 1;
      } else if (astralActive) {
        m.emissive.setHex(0x6fd4ff);
        m.emissiveIntensity = 0.62;
      } else if (isCrystal) {
        m.emissive.setHex(0x88c8f5);
        m.emissiveIntensity = db * 0.34;
      } else {
        m.emissive.setHex(s.emissiveHex);
        m.emissiveIntensity = s.emissiveIntensity;
      }
    }
    root.visible = targetAlpha > 0.015;
  };

  return {
    root,
    bodyPivot,
    pelvis,
    waist,
    chest,
    head,
    leftUpperArm: leftArm.upperArm,
    leftLowerArm: leftArm.lowerArm,
    leftHand: leftArm.hand,
    rightUpperArm: rightArm.upperArm,
    rightLowerArm: rightArm.lowerArm,
    rightHand: rightArm.hand,
    leftUpperLeg: leftLeg.upperLeg,
    leftLowerLeg: leftLeg.lowerLeg,
    leftFoot: leftLeg.foot,
    rightUpperLeg: rightLeg.upperLeg,
    rightLowerLeg: rightLeg.lowerLeg,
    rightFoot: rightLeg.foot,
    capePivot,
    hairBackPivot,
    sashPivot,
    setOpacity: (alpha: number) => {
      baseOpacity = THREE.MathUtils.clamp(alpha, 0, 1);
      applyVisualMaterialState();
    },
    setHitFlash: (amount: number) => {
      hitFlashAmt = THREE.MathUtils.clamp(amount, 0, 1);
      applyVisualMaterialState();
    },
    setDiamondForm: (blend: number) => {
      diamondBlend = THREE.MathUtils.clamp(blend, 0, 1);
      applyVisualMaterialState();
    },
    setAstralProjection: (active: boolean) => {
      astralActive = active;
      applyVisualMaterialState();
    },
    setHelaCrownMode: (enabled: boolean) => {
      if (helaHairGroup) {
        helaHairGroup.visible = !enabled;
        helaHairGroup.position.set(0, 0, 0);
        helaHairGroup.scale.setScalar(1);
      }
      if (helaCrownGroup) {
        helaCrownGroup.visible = enabled;
        helaCrownGroup.position.set(0, 0, 0);
        helaCrownGroup.scale.setScalar(1);
      }
    },
    setHelaCrownProgress: (blend: number) => {
      const b = THREE.MathUtils.clamp(blend, 0, 1);
      if (helaHairGroup) {
        helaHairGroup.visible = b < 0.68;
        helaHairGroup.position.set(0, -b * 0.04, b * 0.14);
        helaHairGroup.scale.setScalar(Math.max(0.2, 1 - b * 0.65));
      }
      if (helaCrownGroup) {
        helaCrownGroup.visible = b > 0.22;
        helaCrownGroup.position.set(0, (1 - b) * 0.06, -(1 - b) * 0.14);
        helaCrownGroup.scale.setScalar(0.35 + 0.65 * b);
      }
    },
    setHelaHandSword: (visible: boolean) => {
      if (helaLeftHandSword) helaLeftHandSword.group.visible = visible;
      if (helaRightHandSword) helaRightHandSword.group.visible = visible;
    },
    setHelaHandSwords: (leftVisible: boolean, rightVisible: boolean) => {
      if (helaLeftHandSword) helaLeftHandSword.group.visible = leftVisible;
      if (helaRightHandSword) helaRightHandSword.group.visible = rightVisible;
    },
    setNpcWeapon: (kind: 'none' | 'blade' | 'mace') => {
      if (npcBladeGroup) npcBladeGroup.visible = kind === 'blade';
      if (npcMaceGroup) npcMaceGroup.visible = kind === 'mace';
    },
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      tex.dispose();
      helaLeftHandSword?.dispose();
      helaRightHandSword?.dispose();
    },
  };
}
