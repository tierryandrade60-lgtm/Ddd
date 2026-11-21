import {
  AbilityDefinition,
  EMMA_FROST_ABILITIES,
  HELA_ABILITIES,
  PHOENIX_FORCE_ABILITIES,
  SCARLET_WITCH_ABILITIES,
} from './abilityConfig';
import {
  CHARACTER_PRESETS,
  CharacterAppearance,
  resolveCharacterAppearance,
} from './characterConfig';

export interface CharacterPreviewConfig {
  accentColor: string;
  badgeColor: string;
  podiumColor: string;
  cameraDistance: number;
  cameraOffsetY: number;
  initialYaw: number;
}

export interface CharacterSkinDefinition {
  id: string;
  name: string;
  displayName: string;
  price: number;
  nameColor: string;
  accentColor: string;
  badgeColor: string;
  podiumColor: string;
  appearance: CharacterAppearance;
}

export interface CharacterDefinition {
  id: string;
  name: string;
  nameColor: string;
  tags: ReadonlyArray<string>;
  description: string;
  maxHp: number;
  appearance: CharacterAppearance;
  preview: CharacterPreviewConfig;
  abilities: ReadonlyArray<AbilityDefinition>;
  skins?: ReadonlyArray<CharacterSkinDefinition>;
}

export const DARK_PHOENIX_SKIN_ID = 'dark-phoenix';
export const DARK_PHOENIX_PRICE = 100;

/**
 * Central extensible Character Registry.
 */
export const CHARACTER_REGISTRY: ReadonlyArray<CharacterDefinition> = [
  {
    id: 'scarlet-witch',
    name: 'SCARLET WITCH',
    nameColor: '#FF4557',
    tags: ['Witch', 'Sorceress', 'Chaos Magic'],
    description:
      'Master of Chaos Magic who levitates on crimson mist and overwhelms foes with hex bolts and inward implosions.',
    maxHp: 250,
    appearance: resolveCharacterAppearance(CHARACTER_PRESETS.scarletWitch),
    preview: {
      accentColor: '#E53540',
      badgeColor: '#FFD147',
      podiumColor: '#4A2B5E',
      cameraDistance: 3.1,
      cameraOffsetY: 1.04,
      initialYaw: 0.28,
    },
    abilities: SCARLET_WITCH_ABILITIES,
  },
  {
    id: 'phoenix-force',
    name: 'PHOENIX FORCE',
    nameColor: '#FFD53D',
    tags: ['Cosmic Fire', 'Telepath', 'Phoenix'],
    description:
      'Avatar of cosmic fire wielding triple Phoenix Waves, rapid fireballs, Pain Infliction, and radiant fiery wings.',
    maxHp: 250,
    appearance: resolveCharacterAppearance(CHARACTER_PRESETS.phoenixForce),
    preview: {
      accentColor: '#FF981A',
      badgeColor: '#FFD53D',
      podiumColor: '#1E522C',
      cameraDistance: 3.1,
      cameraOffsetY: 1.04,
      initialYaw: 0.28,
    },
    abilities: PHOENIX_FORCE_ABILITIES,
    skins: [
      {
        id: 'phoenix-default',
        name: 'Phoenix Force',
        displayName: 'PHOENIX FORCE',
        price: 0,
        nameColor: '#FFD53D',
        accentColor: '#FF981A',
        badgeColor: '#FFD53D',
        podiumColor: '#1E522C',
        appearance: resolveCharacterAppearance(CHARACTER_PRESETS.phoenixForce),
      },
      {
        id: DARK_PHOENIX_SKIN_ID,
        name: 'Dark Phoenix',
        displayName: 'DARK PHOENIX',
        price: DARK_PHOENIX_PRICE,
        nameColor: '#FF5E2B',
        accentColor: '#FF451A',
        badgeColor: '#FF5722',
        podiumColor: '#3A1112',
        appearance: resolveCharacterAppearance(CHARACTER_PRESETS.darkPhoenix),
      },
    ],
  },
  {
    id: 'emma-frost',
    name: 'EMMA FROST',
    nameColor: '#E8F6FF',
    tags: ['White Queen', 'Telepath', 'Diamond Form'],
    description:
      'The White Queen commands free-flying Astral Projection, crystal Diamond invulnerability, and forehead telepathic waves.',
    maxHp: 250,
    appearance: resolveCharacterAppearance(CHARACTER_PRESETS.emmaFrost),
    preview: {
      accentColor: '#9EDBFF',
      badgeColor: '#E8F6FF',
      podiumColor: '#253B56',
      cameraDistance: 3.1,
      cameraOffsetY: 1.04,
      initialYaw: 0.28,
    },
    abilities: EMMA_FROST_ABILITIES,
  },
  {
    id: 'hela',
    name: 'HELA',
    nameColor: '#3CE66B',
    tags: ['Goddess of Death', 'Necroswords', 'Crown Form'],
    description:
      'Goddess of Death wielding conjured Necroswords, massive emerald explosions, spinning leaps, and her empowering Crown Form.',
    maxHp: 250,
    appearance: resolveCharacterAppearance(CHARACTER_PRESETS.hela),
    preview: {
      accentColor: '#3CE66B',
      badgeColor: '#66FF92',
      podiumColor: '#122E21',
      cameraDistance: 3.1,
      cameraOffsetY: 1.04,
      initialYaw: 0.28,
    },
    abilities: HELA_ABILITIES,
  },
];

export function getCharacterById(id: string): CharacterDefinition {
  return (
    CHARACTER_REGISTRY.find((c) => c.id === id) ?? CHARACTER_REGISTRY[0]
  );
}

export function resolveCharacterWithSkin(
  char: CharacterDefinition,
  skinId?: string | null,
): {
  displayName: string;
  nameColor: string;
  appearance: CharacterAppearance;
  preview: CharacterPreviewConfig;
  skin: CharacterSkinDefinition | null;
} {
  if (!char.skins || char.skins.length === 0) {
    return {
      displayName: char.name,
      nameColor: char.nameColor,
      appearance: char.appearance,
      preview: char.preview,
      skin: null,
    };
  }
  const skin = char.skins.find((s) => s.id === skinId) ?? char.skins[0];
  return {
    displayName: skin.displayName,
    nameColor: skin.nameColor,
    appearance: skin.appearance,
    preview: {
      ...char.preview,
      accentColor: skin.accentColor,
      badgeColor: skin.badgeColor,
      podiumColor: skin.podiumColor,
    },
    skin,
  };
}
