export type AbilityId =
  | 'flight'
  | 'chaos-bolt'
  | 'darkhold'
  | 'chaos-implosion'
  | 'teleport'
  | 'telekinetic-explosion'
  | 'auto-shield'
  | 'phoenix-wave'
  | 'phoenix-fireballs'
  | 'pain-infliction'
  | 'phoenix-flight'
  | 'astral-projection'
  | 'mental-attack'
  | 'diamond-form'
  | 'telepathic-wave'
  | 'diamond-projectile'
  | 'sword-summon'
  | 'green-explosion'
  | 'spinning-leap'
  | 'ground-sword'
  | 'crown-form'
  | 'throw-sword'
  | 'sword-slash';

export type AbilityTypeLabel =
  | 'Toggle'
  | 'Summon'
  | 'Defense'
  | 'Projectile'
  | 'Targeted'
  | 'Targeted Area Attack'
  | 'Area Attack';

export interface AbilityDefinition {
  id: AbilityId;
  name: string;
  type: AbilityTypeLabel;
  description: string;
  tiltDeg: number;
  maxCharges?: number;
  cooldownMs: number;
  stepCooldownMs?: number;
  durationMs?: number;
}

export const DARKHOLD_DURATION_MS = 12000;
export const AUTO_SHIELD_DURATION_MS = 10000;
export const AUTO_SHIELD_MAX_ABSORB = 100;
export const PHOENIX_SPECIAL_REVIVAL_COOLDOWN_MS = 60000;

export const EMMA_ASTRAL_DURATION_MS = 10000;
export const EMMA_ASTRAL_COOLDOWN_MS = 10000;
export const EMMA_DIAMOND_DURATION_MS = 15000;
export const EMMA_DIAMOND_COOLDOWN_MS = 8000;
export const EMMA_DIAMOND_PROJECTILE_COOLDOWN_MS = 1200;

export const HELA_CROWN_DURATION_MS = 15000;
export const HELA_CROWN_COOLDOWN_MS = 20000;
export const HELA_SWORD_SUMMON_DURATION_MS = 14000;
export const HELA_SWORD_APPEAR_MS = 1000;
export const HELA_SWORD_THROW_READY_MS = 2000;
export const HELA_SWORD_SLASH_COOLDOWN_MS = 800;
export const HELA_CROWN_BONUS_DAMAGE = 5;

export const SCARLET_WITCH_ABILITIES: ReadonlyArray<AbilityDefinition> = [
  {
    id: 'flight',
    name: 'FLIGHT',
    type: 'Toggle',
    description:
      'Levitate swiftly on swirling dark-red chaos mist with responsive directional aerial tilt.',
    tiltDeg: 2.0,
    cooldownMs: 2500,
  },
  {
    id: 'chaos-bolt',
    name: 'CHAOS BOLT',
    type: 'Projectile',
    description:
      'Alternates hands to fire 3 hex stacks dealing 30 damage each. Recharges 1 stack every 1.5s.',
    tiltDeg: -1.8,
    maxCharges: 3,
    stepCooldownMs: 300,
    cooldownMs: 1500,
  },
  {
    id: 'darkhold',
    name: 'DARKHOLD',
    type: 'Summon',
    description:
      'Summon the floating Book of Sins for 12s, unlocking Teleport, Telekinetic Explosion, and Automatic Shield.',
    tiltDeg: 1.6,
    cooldownMs: 9000,
    durationMs: DARKHOLD_DURATION_MS,
  },
  {
    id: 'chaos-implosion',
    name: 'CHAOS EXPLOSION',
    type: 'Targeted Area Attack',
    description:
      'Unleash a supernatural crimson sphere that expands outward, pulling nearby foes inward into a 2s ragdoll.',
    tiltDeg: -1.8,
    cooldownMs: 6500,
  },
];

export const DARKHOLD_SUB_ABILITIES: ReadonlyArray<AbilityDefinition> = [
  {
    id: 'teleport',
    name: 'TELEPORT',
    type: 'Targeted',
    description:
      'Vanish into crimson mist for 0.5s while invulnerable, then reappear at the aimed spot.',
    tiltDeg: -1.5,
    cooldownMs: 4000,
  },
  {
    id: 'telekinetic-explosion',
    name: 'TK BLAST',
    type: 'Area Attack',
    description:
      'Unleash an outward scarlet telekinetic shockwave (28 dmg), blasting nearby foes into a 2s ragdoll.',
    tiltDeg: 1.4,
    cooldownMs: 4500,
  },
  {
    id: 'auto-shield',
    name: 'AUTO SHIELD',
    type: 'Defense',
    description:
      'Project a subtle dark-red barrier for up to 10s that absorbs up to 100 damage points.',
    tiltDeg: -1.6,
    cooldownMs: 6500,
    durationMs: AUTO_SHIELD_DURATION_MS,
  },
];

export const PHOENIX_FORCE_ABILITIES: ReadonlyArray<AbilityDefinition> = [
  {
    id: 'phoenix-wave',
    name: 'PHOENIX WAVE',
    type: 'Area Attack',
    description:
      'Three consecutive ground fire explosions (right, left, both hands), dealing 20 damage each, 3s burn, knockback & ragdoll.',
    tiltDeg: 2.0,
    cooldownMs: 5500,
  },
  {
    id: 'phoenix-fireballs',
    name: 'PHOENIX FIREBALLS',
    type: 'Projectile',
    description:
      'Five independent fireball charges dealing 10 damage each and applying burning damage over time.',
    tiltDeg: -1.8,
    maxCharges: 5,
    stepCooldownMs: 220,
    cooldownMs: 1200,
  },
  {
    id: 'pain-infliction',
    name: 'PAIN INFLICTION',
    type: 'Targeted',
    description:
      'Channel on a target for 5s (5 dmg/s), restricting movement & abilities. Ends in a fire blast (10 AoE dmg) & 2s ragdoll.',
    tiltDeg: 1.6,
    cooldownMs: 7500,
  },
  {
    id: 'phoenix-flight',
    name: 'PHOENIX FLIGHT',
    type: 'Toggle',
    description:
      'Fast aerial spin activation rising into graceful flight with animated fiery wings and ember trails.',
    tiltDeg: -1.8,
    cooldownMs: 2500,
  },
];

export const EMMA_FROST_ABILITIES: ReadonlyArray<AbilityDefinition> = [
  {
    id: 'astral-projection',
    name: 'ASTRAL FORM',
    type: 'Toggle',
    description:
      'Leave your invulnerable physical body behind while flying freely for up to 10s as a psychic projection.',
    tiltDeg: 2.0,
    cooldownMs: EMMA_ASTRAL_COOLDOWN_MS,
    durationMs: EMMA_ASTRAL_DURATION_MS,
  },
  {
    id: 'mental-attack',
    name: 'MENTAL ATTACK',
    type: 'Targeted',
    description:
      'Focus psychic energy from your forehead to blast a target’s mind for 15 damage with a telepathic burst.',
    tiltDeg: -1.8,
    cooldownMs: 1400,
  },
  {
    id: 'diamond-form',
    name: 'DIAMOND FORM',
    type: 'Toggle',
    description:
      'Transform into living crystal for 15s, gaining full damage immunity and unlocking Diamond Shard projectiles.',
    tiltDeg: 1.6,
    cooldownMs: EMMA_DIAMOND_COOLDOWN_MS,
    durationMs: EMMA_DIAMOND_DURATION_MS,
  },
  {
    id: 'telepathic-wave',
    name: 'TELEPATHIC WAVE',
    type: 'Targeted Area Attack',
    description:
      'Emit expanding circular psychic waves from your forehead, dealing periodic damage and stunning foes with pain.',
    tiltDeg: -1.8,
    cooldownMs: 7500,
  },
];

export const EMMA_DIAMOND_PROJECTILE: AbilityDefinition = {
  id: 'diamond-projectile',
  name: 'DIAMOND SHARD',
  type: 'Projectile',
  description: 'Launch a razor crystal shard dealing 22 damage on impact.',
  tiltDeg: -1.5,
  cooldownMs: EMMA_DIAMOND_PROJECTILE_COOLDOWN_MS,
};

export const HELA_ABILITIES: ReadonlyArray<AbilityDefinition> = [
  {
    id: 'sword-summon',
    name: 'SWORD SUMMON',
    type: 'Summon',
    description:
      'Conjure dual Necroswords for 14s and unlock alternating thrown and close-range slash attacks.',
    tiltDeg: 2.0,
    cooldownMs: 8000,
    durationMs: HELA_SWORD_SUMMON_DURATION_MS,
  },
  {
    id: 'green-explosion',
    name: 'GREEN EXPLOSION',
    type: 'Area Attack',
    description:
      'Gather swirling emerald energy and slam downward, unleashing a massive explosion (32 dmg) with billowing mist.',
    tiltDeg: -1.8,
    cooldownMs: 6500,
  },
  {
    id: 'spinning-leap',
    name: 'SPINNING LEAP',
    type: 'Targeted',
    description:
      'Propels Hela upward and forward in a fierce aerial spin, landing in a poised crouched impact stance.',
    tiltDeg: 1.6,
    cooldownMs: 5000,
  },
  {
    id: 'ground-sword',
    name: 'GROUND SWORD',
    type: 'Targeted Area Attack',
    description:
      'Erupt a gigantic Necrosword straight out of the earth at the aimed target (35 dmg & knockback).',
    tiltDeg: -1.8,
    cooldownMs: 6500,
  },
];

export const HELA_CROWN_FORM: AbilityDefinition = {
  id: 'crown-form',
  name: 'CROWN FORM',
  type: 'Toggle',
  description:
    'Manifest Hela’s antlered crown for 15s, granting +5 bonus damage to Sword Summon throws, Green Explosion, and Ground Sword.',
  tiltDeg: 1.6,
  cooldownMs: HELA_CROWN_COOLDOWN_MS,
  durationMs: HELA_CROWN_DURATION_MS,
};

export const HELA_THROW_SWORD: AbilityDefinition = {
  id: 'throw-sword',
  name: 'THROW SWORD',
  type: 'Projectile',
  description:
    'Alternate throwing your right and left conjured Necroswords (25 dmg). Embedded blades linger before returning.',
  tiltDeg: -1.6,
  cooldownMs: HELA_SWORD_THROW_READY_MS,
};

export const HELA_SWORD_SLASH: AbilityDefinition = {
  id: 'sword-slash',
  name: 'SLASH',
  type: 'Targeted',
  description:
    'Strike an adjacent enemy at close range with a right, left, or coordinated dual-sword slash.',
  tiltDeg: 1.5,
  cooldownMs: HELA_SWORD_SLASH_COOLDOWN_MS,
};
