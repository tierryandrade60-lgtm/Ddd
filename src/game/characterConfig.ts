export type TopStyle =
  | 'hoodie'
  | 'varsity'
  | 'tee'
  | 'corset'
  | 'bodysuit'
  | 'emma-corset'
  | 'hela-armor';
export type PantsStyle = 'joggers' | 'shorts' | 'jeans' | 'tights';
export type HatStyle = 'none' | 'beanie' | 'cap' | 'tiara';
export type CharacterArchetype =
  | 'standard'
  | 'scarlet-witch'
  | 'phoenix-force'
  | 'emma-frost'
  | 'hela'
  | 'npc-thug'
  | 'npc-bandit'
  | 'npc-prisoner'
  | 'npc-basic';
export type PhoenixSkinVariant = 'phoenix' | 'dark-phoenix';

export interface CharacterAppearance {
  archetype?: CharacterArchetype;
  skinVariant?: PhoenixSkinVariant;
  skin: string;
  hair: string;
  hairSecondary?: string;
  topPrimary: string;
  topSecondary: string;
  topAccent: string;
  emblemColor?: string;
  sashColor?: string;
  pantsPrimary: string;
  pantsAccent: string;
  shoePrimary: string;
  shoeSole: string;
  shoeAccent: string;
  topStyle: TopStyle;
  pantsStyle: PantsStyle;
  hatStyle: HatStyle;
  hatColor: string;
}

export const CHARACTER_PRESETS: Record<string, CharacterAppearance> = {
  scarletWitch: {
    archetype: 'scarlet-witch',
    skin: '#F3C5AC',
    hair: '#4A251D',
    hairSecondary: '#321712',
    topPrimary: '#CE192A', // Classic scarlet corset bodysuit
    topSecondary: '#EE738E', // Soft rose-pink sleeves / sheer fabric
    topAccent: '#9E0B1B', // Deep crimson bodice trim & cape lining
    pantsPrimary: '#EE738E', // Rose-pink tights
    pantsAccent: '#CE192A', // Scarlet hip V-cut & belt accents
    shoePrimary: '#C61626', // Scarlet knee-high boots
    shoeSole: '#7A0D18',
    shoeAccent: '#E82E3F',
    topStyle: 'corset',
    pantsStyle: 'tights',
    hatStyle: 'tiara',
    hatColor: '#D61C2C',
  },
  phoenixForce: {
    archetype: 'phoenix-force',
    skinVariant: 'phoenix',
    skin: '#F4C3A8',
    hair: '#B8341A', // Vibrant fiery copper-red hair
    hairSecondary: '#84200E',
    topPrimary: '#278E38', // Classic emerald green bodysuit
    topSecondary: '#F2C12E', // Bright gold long gloves
    topAccent: '#14171C', // Sleek black high collar
    emblemColor: '#FFD53D', // Gold Phoenix bird chest emblem
    sashColor: '#F2C12E', // Flowing gold waist sash
    pantsPrimary: '#278E38', // Emerald green upper thighs
    pantsAccent: '#F2C12E', // Gold sash waist trim
    shoePrimary: '#F2C12E', // Metallic gold thigh-high boots
    shoeSole: '#B3820D',
    shoeAccent: '#FFE680',
    topStyle: 'bodysuit',
    pantsStyle: 'tights',
    hatStyle: 'none',
    hatColor: '#278E38',
  },
  darkPhoenix: {
    archetype: 'phoenix-force',
    skinVariant: 'dark-phoenix',
    skin: '#F0BEA4',
    hair: '#2B0D0F', // Deep dark crimson-black hair
    hairSecondary: '#5A1618',
    topPrimary: '#14141B', // Sleek dark obsidian bodysuit
    topSecondary: '#C82218', // Deep fiery crimson-red long gloves
    topAccent: '#0B0B10', // High black collar
    emblemColor: '#FF451A', // Intense orange-crimson Phoenix chest emblem
    sashColor: '#E83D1B', // Fiery orange-red flowing waist sash
    pantsPrimary: '#14141B', // Dark obsidian upper thighs
    pantsAccent: '#E83D1B', // Crimson-orange waist sash accent
    shoePrimary: '#C82218', // Crimson-red thigh-high boots
    shoeSole: '#73100C',
    shoeAccent: '#FF642E',
    topStyle: 'bodysuit',
    pantsStyle: 'tights',
    hatStyle: 'none',
    hatColor: '#14141B',
  },
  emmaFrost: {
    archetype: 'emma-frost',
    skin: '#F3C4AC',
    hair: '#F0C65A',
    hairSecondary: '#D1A03B',
    topPrimary: '#F5F7FA', // White strapped corset crop top
    topSecondary: '#F5F7FA', // White long opera gloves & cape
    topAccent: '#C9D3E0', // Crisp silver-white corset seams & choker trim
    emblemColor: '#D62828', // Iconic circular red/gold X-clasp emblem
    sashColor: '#F4C430',
    pantsPrimary: '#F2F5F8', // Sleek white pants
    pantsAccent: '#D4DCE6', // Tailored belt & seams
    shoePrimary: '#EFF3F7', // White heeled boots
    shoeSole: '#B8C2CE',
    shoeAccent: '#FFFFFF',
    topStyle: 'emma-corset',
    pantsStyle: 'tights',
    hatStyle: 'none',
    hatColor: '#F5F7FA',
  },
  hela: {
    archetype: 'hela',
    skin: '#EAC2AC',
    hair: '#15171C', // Tousled jet-black wavy hair
    hairSecondary: '#0A0B0E',
    topPrimary: '#151B1E', // Dark scaly black-teal armor bodysuit
    topSecondary: '#1B2E28', // Deep emerald-black scale plates
    topAccent: '#2CE66D', // Emerald accents
    emblemColor: '#8DA89E', // Silver-emerald vertical chest ribs
    sashColor: '#1F3A30',
    pantsPrimary: '#151B1E', // Dark armored leggings
    pantsAccent: '#48685B', // Silver-emerald leg trim
    shoePrimary: '#111618', // Dark armored boots
    shoeSole: '#0A0D0E',
    shoeAccent: '#5C8574',
    topStyle: 'hela-armor',
    pantsStyle: 'tights',
    hatStyle: 'none',
    hatColor: '#13241D',
  },
  npcThug: {
    archetype: 'npc-thug',
    skin: '#CFA68A',
    hair: '#22242E',
    topPrimary: '#363C4D',
    topSecondary: '#525B73',
    topAccent: '#9AA3BA',
    pantsPrimary: '#242936',
    pantsAccent: '#3A4154',
    shoePrimary: '#1D202B',
    shoeSole: '#3C4252',
    shoeAccent: '#6B748C',
    topStyle: 'hoodie',
    pantsStyle: 'joggers',
    hatStyle: 'none',
    hatColor: '#363C4D',
  },
  banditBlade: {
    archetype: 'npc-bandit',
    skin: '#D6A486',
    hair: '#1D1D24',
    topPrimary: '#262932',
    topSecondary: '#3E4352',
    topAccent: '#B5383E',
    pantsPrimary: '#191C24',
    pantsAccent: '#363C4A',
    shoePrimary: '#14161D',
    shoeSole: '#2B303C',
    shoeAccent: '#B5383E',
    topStyle: 'varsity',
    pantsStyle: 'jeans',
    hatStyle: 'beanie',
    hatColor: '#2E1E24',
  },
  banditMace: {
    archetype: 'npc-bandit',
    skin: '#B98768',
    hair: '#2B1F1B',
    topPrimary: '#47252B',
    topSecondary: '#2C2E38',
    topAccent: '#D98A3C',
    pantsPrimary: '#22242D',
    pantsAccent: '#483439',
    shoePrimary: '#181920',
    shoeSole: '#363844',
    shoeAccent: '#D98A3C',
    topStyle: 'hoodie',
    pantsStyle: 'joggers',
    hatStyle: 'cap',
    hatColor: '#3B1E24',
  },
  prisonerOrange: {
    archetype: 'npc-prisoner',
    skin: '#D8A280',
    hair: '#272220',
    topPrimary: '#EB6D24',
    topSecondary: '#D85B16',
    topAccent: '#F8B98B',
    pantsPrimary: '#D85B16',
    pantsAccent: '#A6410B',
    shoePrimary: '#2C2F38',
    shoeSole: '#4A4E5A',
    shoeAccent: '#EB6D24',
    topStyle: 'tee',
    pantsStyle: 'joggers',
    hatStyle: 'none',
    hatColor: '#EB6D24',
  },
  prisonerStriped: {
    archetype: 'npc-prisoner',
    skin: '#C48D6D',
    hair: '#1C1D24',
    topPrimary: '#4D5566',
    topSecondary: '#DCE2EC',
    topAccent: '#2C323D',
    pantsPrimary: '#3D4452',
    pantsAccent: '#C8D0DC',
    shoePrimary: '#1F232B',
    shoeSole: '#3B414E',
    shoeAccent: '#9AA5B8',
    topStyle: 'hoodie',
    pantsStyle: 'joggers',
    hatStyle: 'beanie',
    hatColor: '#353C4A',
  },
  basicCivilianA: {
    archetype: 'npc-basic',
    skin: '#F3C1A0',
    hair: '#432D24',
    topPrimary: '#FF7D6B',
    topSecondary: '#FFF4E8',
    topAccent: '#3CC6B8',
    pantsPrimary: '#374B63',
    pantsAccent: '#526B87',
    shoePrimary: '#F7F3EC',
    shoeSole: '#FFFFFF',
    shoeAccent: '#FF7D6B',
    topStyle: 'hoodie',
    pantsStyle: 'jeans',
    hatStyle: 'none',
    hatColor: '#3CC6B8',
  },
  basicCivilianB: {
    archetype: 'npc-basic',
    skin: '#D99F7A',
    hair: '#231D1B',
    topPrimary: '#48C79F',
    topSecondary: '#F8F4EC',
    topAccent: '#FFB36B',
    pantsPrimary: '#4A445C',
    pantsAccent: '#69607E',
    shoePrimary: '#FAF6F0',
    shoeSole: '#FFFDF9',
    shoeAccent: '#48C79F',
    topStyle: 'varsity',
    pantsStyle: 'shorts',
    hatStyle: 'cap',
    hatColor: '#48C79F',
  },
  coralHoodie: {
    archetype: 'standard',
    skin: '#F5C4A1',
    hair: '#3A2824',
    topPrimary: '#FF6B5A',
    topSecondary: '#FFF3E4',
    topAccent: '#3CC6B8',
    pantsPrimary: '#33465E',
    pantsAccent: '#49617D',
    shoePrimary: '#FAF6F0',
    shoeSole: '#FFFFFF',
    shoeAccent: '#FF6B5A',
    topStyle: 'hoodie',
    pantsStyle: 'joggers',
    hatStyle: 'none',
    hatColor: '#3CC6B8',
  },
  skyVarsity: {
    archetype: 'standard',
    skin: '#ECC09E',
    hair: '#2B2430',
    topPrimary: '#4B8BF5',
    topSecondary: '#FFF7EC',
    topAccent: '#FFC857',
    pantsPrimary: '#3D4859',
    pantsAccent: '#58667B',
    shoePrimary: '#2F3947',
    shoeSole: '#FAF6F0',
    shoeAccent: '#FFC857',
    topStyle: 'varsity',
    pantsStyle: 'jeans',
    hatStyle: 'cap',
    hatColor: '#4B8BF5',
  },
  meadowMint: {
    archetype: 'standard',
    skin: '#D69B76',
    hair: '#221C1A',
    topPrimary: '#44C29A',
    topSecondary: '#F8F4EC',
    topAccent: '#FF8A65',
    pantsPrimary: '#4D455D',
    pantsAccent: '#69607C',
    shoePrimary: '#FAF6F0',
    shoeSole: '#FFFDF9',
    shoeAccent: '#44C29A',
    topStyle: 'tee',
    pantsStyle: 'shorts',
    hatStyle: 'beanie',
    hatColor: '#FF8A65',
  },
};

function sanitizeHex(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed}`;
  return null;
}

/**
 * Resolves customizable R16 character clothing and colors from presets or URL params
 * while keeping the screen completely clean of extra UI.
 */
export function resolveCharacterAppearance(
  overrides?: Partial<CharacterAppearance>,
): CharacterAppearance {
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const presetKey = params.get('preset');
  const base =
    (presetKey && CHARACTER_PRESETS[presetKey]) || CHARACTER_PRESETS.scarletWitch;

  const topStyleParam = params.get('topStyle') as TopStyle | null;
  const pantsStyleParam = params.get('pantsStyle') as PantsStyle | null;
  const hatStyleParam = params.get('hatStyle') as HatStyle | null;

  return {
    ...base,
    skin: sanitizeHex(params.get('skin')) ?? base.skin,
    hair: sanitizeHex(params.get('hair')) ?? base.hair,
    topPrimary: sanitizeHex(params.get('top')) ?? base.topPrimary,
    topSecondary: sanitizeHex(params.get('sleeves')) ?? base.topSecondary,
    topAccent: sanitizeHex(params.get('accent')) ?? base.topAccent,
    pantsPrimary: sanitizeHex(params.get('pants')) ?? base.pantsPrimary,
    shoePrimary: sanitizeHex(params.get('shoes')) ?? base.shoePrimary,
    hatColor: sanitizeHex(params.get('hatColor')) ?? base.hatColor,
    topStyle:
      topStyleParam &&
      [
        'hoodie',
        'varsity',
        'tee',
        'corset',
        'bodysuit',
        'emma-corset',
        'hela-armor',
      ].includes(topStyleParam)
        ? topStyleParam
        : base.topStyle,
    pantsStyle:
      pantsStyleParam &&
      ['joggers', 'shorts', 'jeans', 'tights'].includes(pantsStyleParam)
        ? pantsStyleParam
        : base.pantsStyle,
    hatStyle:
      hatStyleParam &&
      ['none', 'beanie', 'cap', 'tiara'].includes(hatStyleParam)
        ? hatStyleParam
        : base.hatStyle,
    ...overrides,
  };
}
