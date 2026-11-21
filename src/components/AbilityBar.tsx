import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  AUTO_SHIELD_DURATION_MS,
  AbilityDefinition,
  AbilityId,
  DARKHOLD_DURATION_MS,
  DARKHOLD_SUB_ABILITIES,
  EMMA_ASTRAL_DURATION_MS,
  EMMA_DIAMOND_DURATION_MS,
  HELA_SWORD_SUMMON_DURATION_MS,
  SCARLET_WITCH_ABILITIES,
} from '../game/abilityConfig';
import { AbilityIcon } from './AbilityIcon';

interface CooldownState {
  startMs: number;
  durationMs: number;
}

const PURPLE_DOT_PATTERN =
  'radial-gradient(circle, rgba(142, 145, 218, 0.36) 1.45px, transparent 1.55px), radial-gradient(circle, rgba(142, 145, 218, 0.36) 1.45px, transparent 1.55px)';

const DARKHOLD_DOT_PATTERN =
  'radial-gradient(circle, rgba(255, 118, 142, 0.32) 1.45px, transparent 1.55px), radial-gradient(circle, rgba(255, 118, 142, 0.32) 1.45px, transparent 1.55px)';

export type AbilitySoundKind =
  | 'flight-on'
  | 'flight-off'
  | 'chaos-bolt'
  | 'darkhold-open'
  | 'darkhold-close'
  | 'teleport-start'
  | 'telekinetic-explosion'
  | 'auto-shield'
  | 'chaos-implosion'
  | 'phoenix-fireball'
  | 'pain-start'
  | 'pain-cancel'
  | 'phoenix-flight-on'
  | 'phoenix-flight-off'
  | 'astral-on'
  | 'astral-off'
  | 'mental-attack'
  | 'diamond-on'
  | 'diamond-off'
  | 'telepathic-wave'
  | 'sword-summon'
  | 'green-explosion'
  | 'spinning-leap'
  | 'ground-sword';

export interface AbilityBarHandle {
  startCooldown: (id: AbilityId) => void;
  endFlightWithCooldown: () => void;
}

export interface AbilityBarProps {
  abilities?: ReadonlyArray<AbilityDefinition>;
  locked?: boolean;
  painChanneling?: boolean;
  darkholdActive?: boolean;
  autoShieldActive?: boolean;
  astralActive?: boolean;
  diamondActive?: boolean;
  telepathicWaveActive?: boolean;
  swordSummonActive?: boolean;
  lockedAbilityIds?: ReadonlyArray<AbilityId>;
  flightCancelVisible?: boolean;
  onFlightToggle?: (active: boolean) => boolean;
  onFlightStateChange?: (active: boolean) => void;
  onCastChaosBolt?: () => boolean;
  onToggleDarkhold?: () => boolean;
  onCastTeleport?: () => boolean;
  onCastTelekineticExplosion?: () => boolean;
  onCastAutoShield?: () => boolean;
  onCastChaosImplosion?: () => boolean;
  onCastPhoenixWave?: () => boolean;
  onCastPhoenixFireball?: () => boolean;
  onTogglePainInfliction?: () => boolean;
  onToggleAstral?: () => boolean;
  onCastMentalAttack?: () => boolean;
  onToggleDiamond?: () => boolean;
  onCastTelepathicWave?: () => boolean;
  onActivateSwordSummon?: () => boolean;
  onCastGreenExplosion?: () => boolean;
  onCastSpinningLeap?: () => boolean;
  onCastGroundSword?: () => boolean;
  onAbilitySound?: (kind: AbilitySoundKind) => void;
}

function isFlightAbility(id: AbilityId): boolean {
  return id === 'flight' || id === 'phoenix-flight';
}

function isChargedAbility(def: AbilityDefinition): boolean {
  return def.maxCharges !== undefined && def.maxCharges > 0;
}

function isDarkholdSubAbility(id: AbilityId): boolean {
  return (
    id === 'teleport' || id === 'telekinetic-explosion' || id === 'auto-shield'
  );
}

export const AbilityBar = forwardRef<AbilityBarHandle, AbilityBarProps>(
  function AbilityBar(
    {
      abilities = SCARLET_WITCH_ABILITIES,
      locked = false,
      painChanneling = false,
      darkholdActive = false,
      autoShieldActive = false,
      astralActive = false,
      diamondActive = false,
      telepathicWaveActive = false,
      swordSummonActive = false,
      lockedAbilityIds,
      flightCancelVisible = false,
      onFlightToggle,
      onFlightStateChange,
      onCastChaosBolt,
      onToggleDarkhold,
      onCastTeleport,
      onCastTelekineticExplosion,
      onCastAutoShield,
      onCastChaosImplosion,
      onCastPhoenixWave,
      onCastPhoenixFireball,
      onTogglePainInfliction,
      onToggleAstral,
      onCastMentalAttack,
      onToggleDiamond,
      onCastTelepathicWave,
      onActivateSwordSummon,
      onCastGreenExplosion,
      onCastSpinningLeap,
      onCastGroundSword,
      onAbilitySound,
    },
    ref,
  ) {
    const [flightOn, setFlightOn] = useState(false);
    const flightOnRef = useRef(false);
    flightOnRef.current = flightOn;

    const hasDarkholdMain = abilities.some((a) => a.id === 'darkhold');
    const showDarkholdSubBar = hasDarkholdMain && darkholdActive;

    const chargeDef = abilities.find(isChargedAbility);
    const chargeAbilityId: AbilityId | null = chargeDef?.id ?? null;
    const maxCharges = chargeDef?.maxCharges ?? 0;
    const chargeRechargeMs = chargeDef?.cooldownMs ?? 1500;
    const chargeCastIntervalMs = chargeDef?.stepCooldownMs ?? 280;

    const [charges, setCharges] = useState(maxCharges);
    const chargesRef = useRef(maxCharges);
    chargesRef.current = charges;

    const rechargeQueueRef = useRef<Array<{ startMs: number; endMs: number }>>([]);
    const [isRecharging, setIsRecharging] = useState(false);
    const castUnlockAtRef = useRef(0);

    // Active duration bar refs
    const painStartMsRef = useRef<number>(0);
    const painBarRef = useRef<HTMLDivElement | null>(null);
    const darkholdStartMsRef = useRef<number>(0);
    const darkholdBarRef = useRef<HTMLDivElement | null>(null);
    const shieldStartMsRef = useRef<number>(0);
    const shieldBarRef = useRef<HTMLDivElement | null>(null);
    const astralStartMsRef = useRef<number>(0);
    const astralBarRef = useRef<HTMLDivElement | null>(null);
    const diamondStartMsRef = useRef<number>(0);
    const diamondBarRef = useRef<HTMLDivElement | null>(null);
    const telepathicStartMsRef = useRef<number>(0);
    const telepathicBarRef = useRef<HTMLDivElement | null>(null);
    const swordSummonStartMsRef = useRef<number>(0);
    const swordSummonBarRef = useRef<HTMLDivElement | null>(null);

    const [chargeAnimKey, setChargeAnimKey] = useState(0);
    const [triggerPulseId, setTriggerPulseId] = useState<AbilityId | null>(null);

    const [cooldowns, setCooldowns] = useState<Partial<Record<AbilityId, CooldownState>>>({});
    const cooldownsRef = useRef<Partial<Record<AbilityId, CooldownState>>>({});
    cooldownsRef.current = cooldowns;

    const veilRefs = useRef<Partial<Record<AbilityId, HTMLDivElement | null>>>({});
    const chargeBarRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number>(0);
    const pulseTimerRef = useRef<number>(0);

    // Sync charge pool & reset flight/cooldown state whenever character ability preset changes
    useEffect(() => {
      const def = abilities.find(isChargedAbility);
      const nextMax = def?.maxCharges ?? 0;
      chargesRef.current = nextMax;
      setCharges(nextMax);
      rechargeQueueRef.current = [];
      setIsRecharging(false);
      castUnlockAtRef.current = 0;
      flightOnRef.current = false;
      setFlightOn(false);
      cooldownsRef.current = {};
      setCooldowns({});
      onFlightStateChange?.(false);
    }, [abilities, onFlightStateChange]);

    useEffect(() => {
      if (painChanneling) {
        painStartMsRef.current = performance.now();
      }
    }, [painChanneling]);

    useEffect(() => {
      if (darkholdActive) {
        darkholdStartMsRef.current = performance.now();
      }
    }, [darkholdActive]);

    useEffect(() => {
      if (autoShieldActive) {
        shieldStartMsRef.current = performance.now();
      }
    }, [autoShieldActive]);

    useEffect(() => {
      if (astralActive) {
        astralStartMsRef.current = performance.now();
      }
    }, [astralActive]);

    useEffect(() => {
      if (diamondActive) {
        diamondStartMsRef.current = performance.now();
      }
    }, [diamondActive]);

    useEffect(() => {
      if (telepathicWaveActive) {
        telepathicStartMsRef.current = performance.now();
      }
    }, [telepathicWaveActive]);

    useEffect(() => {
      if (swordSummonActive) {
        swordSummonStartMsRef.current = performance.now();
      }
    }, [swordSummonActive]);

    useImperativeHandle(
      ref,
      () => ({
        startCooldown: (id: AbilityId) => {
          const def =
            abilities.find((a) => a.id === id) ??
            DARKHOLD_SUB_ABILITIES.find((a) => a.id === id);
          if (!def || def.cooldownMs <= 0) return;
          const now = performance.now();
          const nextCd: Partial<Record<AbilityId, CooldownState>> = {
            ...cooldownsRef.current,
            [id]: {
              startMs: now,
              durationMs: def.cooldownMs,
            },
          };
          cooldownsRef.current = nextCd;
          setCooldowns(nextCd);
        },
        endFlightWithCooldown: () => {
          const def = abilities.find((a) => isFlightAbility(a.id));
          flightOnRef.current = false;
          setFlightOn(false);
          onFlightStateChange?.(false);
          if (!def || def.cooldownMs <= 0) return;
          const now = performance.now();
          const nextCd: Partial<Record<AbilityId, CooldownState>> = {
            ...cooldownsRef.current,
            [def.id]: {
              startMs: now,
              durationMs: def.cooldownMs,
            },
          };
          cooldownsRef.current = nextCd;
          setCooldowns(nextCd);
        },
      }),
      [abilities, onFlightStateChange],
    );

    useEffect(() => {
      const hasStandardCd = (Object.keys(cooldowns) as AbilityId[]).some(
        (id) => cooldowns[id] !== undefined,
      );
      if (
        !hasStandardCd &&
        !isRecharging &&
        !painChanneling &&
        !darkholdActive &&
        !autoShieldActive &&
        !astralActive &&
        !diamondActive &&
        !telepathicWaveActive &&
        !swordSummonActive
      ) {
        cancelAnimationFrame(rafRef.current);
        return;
      }

      const tick = () => {
        const now = performance.now();
        let anyRemaining = false;

        // 1. Standard single-cooldown abilities (main + Darkhold sub-abilities)
        const current = cooldownsRef.current;
        const finished: AbilityId[] = [];
        for (const id of Object.keys(current) as AbilityId[]) {
          const cd = current[id];
          if (!cd) continue;

          const elapsed = now - cd.startMs;
          const progress = Math.min(Math.max(elapsed / cd.durationMs, 0), 1);
          const remaining = 1 - progress;
          const veilEl = veilRefs.current[id];
          if (veilEl) {
            veilEl.style.transform = `scaleY(${remaining})`;
          }

          if (elapsed >= cd.durationMs) {
            finished.push(id);
          } else {
            anyRemaining = true;
          }
        }

        if (finished.length > 0) {
          const nextCooldowns = { ...current };
          for (const id of finished) {
            delete nextCooldowns[id];
          }
          cooldownsRef.current = nextCooldowns;
          setCooldowns(nextCooldowns);
        }

        // 2. Multi-charge sequential recharge (Chaos Bolt 3 / Phoenix Fireballs 5)
        const queue = rechargeQueueRef.current;
        if (queue.length > 0 && chargeAbilityId) {
          let restored = 0;
          while (queue.length > 0 && now >= queue[0].endMs) {
            queue.shift();
            restored++;
          }
          if (restored > 0) {
            const nextCharges = Math.min(maxCharges, chargesRef.current + restored);
            chargesRef.current = nextCharges;
            setCharges(nextCharges);
            setChargeAnimKey((k) => k + 1);
          }

          if (queue.length > 0) {
            anyRemaining = true;
            const active = queue[0];
            const dur = Math.max(1, active.endMs - active.startMs);
            const progress = Math.min(Math.max((now - active.startMs) / dur, 0), 1);

            const chargeVeil = veilRefs.current[chargeAbilityId];
            if (chargeVeil) {
              chargeVeil.style.transform =
                chargesRef.current === 0 ? `scaleY(${1 - progress})` : 'scaleY(0)';
            }
            if (chargeBarRef.current) {
              chargeBarRef.current.style.transform = `scaleX(${progress})`;
            }
          } else {
            if (chargeBarRef.current) {
              chargeBarRef.current.style.transform = 'scaleX(0)';
            }
            const chargeVeil = veilRefs.current[chargeAbilityId];
            if (chargeVeil) {
              chargeVeil.style.transform = 'scaleY(0)';
            }
            setIsRecharging(false);
          }
        }

        // 3. Pain Infliction 5.0s channel countdown bar
        if (painChanneling && painBarRef.current) {
          anyRemaining = true;
          const elapsed = now - painStartMsRef.current;
          const rem = Math.max(0, 1 - elapsed / 5000);
          painBarRef.current.style.transform = `scaleX(${rem})`;
        }

        // 4. Darkhold 12s active grimoire duration bar
        if (darkholdActive && darkholdBarRef.current) {
          anyRemaining = true;
          const elapsed = now - darkholdStartMsRef.current;
          const rem = Math.max(0, 1 - elapsed / DARKHOLD_DURATION_MS);
          darkholdBarRef.current.style.transform = `scaleX(${rem})`;
        }

        // 5. Automatic Shield 10s active barrier bar
        if (autoShieldActive && shieldBarRef.current) {
          anyRemaining = true;
          const elapsed = now - shieldStartMsRef.current;
          const rem = Math.max(0, 1 - elapsed / AUTO_SHIELD_DURATION_MS);
          shieldBarRef.current.style.transform = `scaleX(${rem})`;
        }

        // 6. Emma Frost Astral Projection 10s duration bar
        if (astralActive && astralBarRef.current) {
          anyRemaining = true;
          const elapsed = now - astralStartMsRef.current;
          const rem = Math.max(0, 1 - elapsed / EMMA_ASTRAL_DURATION_MS);
          astralBarRef.current.style.transform = `scaleX(${rem})`;
        }

        // 7. Emma Frost Diamond Form 15s duration bar
        if (diamondActive && diamondBarRef.current) {
          anyRemaining = true;
          const elapsed = now - diamondStartMsRef.current;
          const rem = Math.max(0, 1 - elapsed / EMMA_DIAMOND_DURATION_MS);
          diamondBarRef.current.style.transform = `scaleX(${rem})`;
        }

        // 8. Emma Frost Telepathic Wave 2.4s channel bar
        if (telepathicWaveActive && telepathicBarRef.current) {
          anyRemaining = true;
          const elapsed = now - telepathicStartMsRef.current;
          const rem = Math.max(0, 1 - elapsed / 2400);
          telepathicBarRef.current.style.transform = `scaleX(${rem})`;
        }

        // 9. Hela Sword Summon 14s duration bar
        if (swordSummonActive && swordSummonBarRef.current) {
          anyRemaining = true;
          const elapsed = now - swordSummonStartMsRef.current;
          const rem = Math.max(0, 1 - elapsed / HELA_SWORD_SUMMON_DURATION_MS);
          swordSummonBarRef.current.style.transform = `scaleX(${rem})`;
        }

        if (anyRemaining) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }, [
      cooldowns,
      isRecharging,
      painChanneling,
      darkholdActive,
      autoShieldActive,
      astralActive,
      diamondActive,
      telepathicWaveActive,
      swordSummonActive,
      chargeAbilityId,
      maxCharges,
    ]);

    useEffect(() => {
      return () => clearTimeout(pulseTimerRef.current);
    }, []);

    const triggerSubtlePulse = useCallback((id: AbilityId) => {
      clearTimeout(pulseTimerRef.current);
      setTriggerPulseId(id);
      pulseTimerRef.current = window.setTimeout(() => setTriggerPulseId(null), 130);
    }, []);

    const activateAbility = useCallback(
      (id: AbilityId) => {
        if (locked) return;
        if (painChanneling && id !== 'pain-infliction') return;
        if (lockedAbilityIds?.includes(id)) return;

        // Strictly block Darkhold sub-abilities unless Darkhold is currently active
        if (isDarkholdSubAbility(id) && !(hasDarkholdMain && darkholdActive)) {
          return;
        }

        const def =
          abilities.find((a) => a.id === id) ??
          (hasDarkholdMain && darkholdActive
            ? DARKHOLD_SUB_ABILITIES.find((a) => a.id === id)
            : undefined);
        if (!def) return;

        const now = performance.now();

        if (id === 'chaos-bolt' || id === 'phoenix-fireballs') {
          if (now < castUnlockAtRef.current) return;
          const prevCharges = chargesRef.current;
          if (prevCharges <= 0) return;

          const accepted =
            id === 'chaos-bolt'
              ? onCastChaosBolt
                ? onCastChaosBolt()
                : true
              : onCastPhoenixFireball
                ? onCastPhoenixFireball()
                : true;
          if (!accepted) return;

          castUnlockAtRef.current = now + chargeCastIntervalMs;
          const nextCharges = prevCharges - 1;
          chargesRef.current = nextCharges;
          setCharges(nextCharges);
          setChargeAnimKey((k) => k + 1);
          triggerSubtlePulse(id);
          onAbilitySound?.(id === 'chaos-bolt' ? 'chaos-bolt' : 'phoenix-fireball');

          const q = rechargeQueueRef.current;
          const startMs = q.length > 0 ? q[q.length - 1].endMs : now;
          q.push({ startMs, endMs: startMs + chargeRechargeMs });
          setIsRecharging(true);
          return;
        }

        if (id === 'pain-infliction') {
          if (!painChanneling) {
            const activeCd = cooldownsRef.current[id];
            if (activeCd && now - activeCd.startMs < activeCd.durationMs) {
              return;
            }
          }
          const wasChanneling = painChanneling;
          const accepted = onTogglePainInfliction ? onTogglePainInfliction() : true;
          if (!accepted) return;

          triggerSubtlePulse(id);
          onAbilitySound?.(wasChanneling ? 'pain-cancel' : 'pain-start');
          return;
        }

        if (id === 'darkhold') {
          if (!darkholdActive) {
            const activeCd = cooldownsRef.current[id];
            if (activeCd && now - activeCd.startMs < activeCd.durationMs) {
              return;
            }
          }
          const wasOpen = darkholdActive;
          const accepted = onToggleDarkhold ? onToggleDarkhold() : true;
          if (!accepted) return;

          triggerSubtlePulse(id);
          if (!wasOpen) {
            onAbilitySound?.('darkhold-open');
          }
          return;
        }

        const activeCd = cooldownsRef.current[id];
        if (activeCd && now - activeCd.startMs < activeCd.durationMs) {
          return;
        }

        if (isFlightAbility(id)) {
          const nextActive = !flightOnRef.current;
          const accepted = onFlightToggle ? onFlightToggle(nextActive) : true;
          if (!accepted) return;

          flightOnRef.current = nextActive;
          setFlightOn(nextActive);
          onFlightStateChange?.(nextActive);
          triggerSubtlePulse(id);
          if (id === 'phoenix-flight') {
            onAbilitySound?.(nextActive ? 'phoenix-flight-on' : 'phoenix-flight-off');
          } else {
            onAbilitySound?.(nextActive ? 'flight-on' : 'flight-off');
          }

          if (!nextActive) {
            const nextCd: Partial<Record<AbilityId, CooldownState>> = {
              ...cooldownsRef.current,
              [id]: {
                startMs: now,
                durationMs: def.cooldownMs,
              },
            };
            cooldownsRef.current = nextCd;
            setCooldowns(nextCd);
          }
          return;
        }

        if (id === 'teleport') {
          const accepted = onCastTeleport ? onCastTeleport() : true;
          if (!accepted) return;

          triggerSubtlePulse(id);
          onAbilitySound?.('teleport-start');

          const nextCd: Partial<Record<AbilityId, CooldownState>> = {
            ...cooldownsRef.current,
            teleport: {
              startMs: now,
              durationMs: def.cooldownMs,
            },
          };
          cooldownsRef.current = nextCd;
          setCooldowns(nextCd);
          return;
        }

        if (id === 'telekinetic-explosion') {
          const accepted = onCastTelekineticExplosion
            ? onCastTelekineticExplosion()
            : true;
          if (!accepted) return;

          triggerSubtlePulse(id);
          onAbilitySound?.('telekinetic-explosion');

          const nextCd: Partial<Record<AbilityId, CooldownState>> = {
            ...cooldownsRef.current,
            'telekinetic-explosion': {
              startMs: now,
              durationMs: def.cooldownMs,
            },
          };
          cooldownsRef.current = nextCd;
          setCooldowns(nextCd);
          return;
        }

        if (id === 'auto-shield') {
          if (autoShieldActive) return;
          const accepted = onCastAutoShield ? onCastAutoShield() : true;
          if (!accepted) return;

          triggerSubtlePulse(id);
          onAbilitySound?.('auto-shield');
          return;
        }

        if (id === 'astral-projection') {
          if (!astralActive) {
            const activeCd = cooldownsRef.current[id];
            if (activeCd && now - activeCd.startMs < activeCd.durationMs) {
              return;
            }
          }
          const wasOn = astralActive;
          const accepted = onToggleAstral ? onToggleAstral() : true;
          if (!accepted) return;

          triggerSubtlePulse(id);
          if (!wasOn) {
            onAbilitySound?.('astral-on');
          }
          return;
        }

        if (id === 'diamond-form') {
          if (!diamondActive) {
            const activeCd = cooldownsRef.current[id];
            if (activeCd && now - activeCd.startMs < activeCd.durationMs) {
              return;
            }
          }
          const wasOn = diamondActive;
          const accepted = onToggleDiamond ? onToggleDiamond() : true;
          if (!accepted) return;

          triggerSubtlePulse(id);
          if (!wasOn) {
            onAbilitySound?.('diamond-on');
          }
          return;
        }

        if (id === 'telepathic-wave') {
          if (telepathicWaveActive) return;
          const activeCd = cooldownsRef.current[id];
          if (activeCd && now - activeCd.startMs < activeCd.durationMs) {
            return;
          }
          const accepted = onCastTelepathicWave ? onCastTelepathicWave() : true;
          if (!accepted) return;

          triggerSubtlePulse(id);
          onAbilitySound?.('telepathic-wave');
          return;
        }

        if (id === 'sword-summon') {
          if (swordSummonActive) return;
          const activeCd = cooldownsRef.current[id];
          if (activeCd && now - activeCd.startMs < activeCd.durationMs) {
            return;
          }
          const accepted = onActivateSwordSummon ? onActivateSwordSummon() : true;
          if (!accepted) return;

          triggerSubtlePulse(id);
          onAbilitySound?.('sword-summon');
          return;
        }

        if (
          id === 'chaos-implosion' ||
          id === 'phoenix-wave' ||
          id === 'mental-attack' ||
          id === 'green-explosion' ||
          id === 'spinning-leap' ||
          id === 'ground-sword'
        ) {
          let accepted = true;
          if (id === 'chaos-implosion') {
            accepted = onCastChaosImplosion ? onCastChaosImplosion() : true;
          } else if (id === 'phoenix-wave') {
            accepted = onCastPhoenixWave ? onCastPhoenixWave() : true;
          } else if (id === 'mental-attack') {
            accepted = onCastMentalAttack ? onCastMentalAttack() : true;
          } else if (id === 'green-explosion') {
            accepted = onCastGreenExplosion ? onCastGreenExplosion() : true;
          } else if (id === 'spinning-leap') {
            accepted = onCastSpinningLeap ? onCastSpinningLeap() : true;
          } else if (id === 'ground-sword') {
            accepted = onCastGroundSword ? onCastGroundSword() : true;
          }
          if (!accepted) return;

          triggerSubtlePulse(id);
          if (id === 'chaos-implosion') {
            onAbilitySound?.('chaos-implosion');
          } else if (id === 'mental-attack') {
            onAbilitySound?.('mental-attack');
          } else if (id === 'green-explosion') {
            onAbilitySound?.('green-explosion');
          } else if (id === 'spinning-leap') {
            onAbilitySound?.('spinning-leap');
          } else if (id === 'ground-sword') {
            onAbilitySound?.('ground-sword');
          }

          const nextCd: Partial<Record<AbilityId, CooldownState>> = {
            ...cooldownsRef.current,
            [id]: {
              startMs: now,
              durationMs: def.cooldownMs,
            },
          };
          cooldownsRef.current = nextCd;
          setCooldowns(nextCd);
        }
      },
      [
        abilities,
        astralActive,
        autoShieldActive,
        chargeCastIntervalMs,
        chargeRechargeMs,
        darkholdActive,
        diamondActive,
        hasDarkholdMain,
        locked,
        lockedAbilityIds,
        onAbilitySound,
        onActivateSwordSummon,
        onCastAutoShield,
        onCastChaosBolt,
        onCastChaosImplosion,
        onCastGreenExplosion,
        onCastGroundSword,
        onCastMentalAttack,
        onCastPhoenixFireball,
        onCastPhoenixWave,
        onCastSpinningLeap,
        onCastTelekineticExplosion,
        onCastTelepathicWave,
        onCastTeleport,
        onFlightStateChange,
        onFlightToggle,
        onToggleAstral,
        onToggleDarkhold,
        onToggleDiamond,
        onTogglePainInfliction,
        painChanneling,
        swordSummonActive,
        telepathicWaveActive,
        triggerSubtlePulse,
      ],
    );

    // Silent keyboard shortcuts: 1..4 for main abilities, Q/E/R for Darkhold sub-abilities while active
    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.repeat) return;
        switch (e.code) {
          case 'Digit1':
            if (abilities[0]) activateAbility(abilities[0].id);
            break;
          case 'Digit2':
            if (abilities[1]) activateAbility(abilities[1].id);
            break;
          case 'Digit3':
            if (abilities[2]) activateAbility(abilities[2].id);
            break;
          case 'Digit4':
            if (abilities[3]) activateAbility(abilities[3].id);
            break;
          case 'KeyQ':
            if (showDarkholdSubBar && DARKHOLD_SUB_ABILITIES[0]) {
              activateAbility(DARKHOLD_SUB_ABILITIES[0].id);
            }
            break;
          case 'KeyE':
            if (showDarkholdSubBar && DARKHOLD_SUB_ABILITIES[1]) {
              activateAbility(DARKHOLD_SUB_ABILITIES[1].id);
            }
            break;
          case 'KeyR':
            if (showDarkholdSubBar && DARKHOLD_SUB_ABILITIES[2]) {
              activateAbility(DARKHOLD_SUB_ABILITIES[2].id);
            }
            break;
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [abilities, activateAbility, showDarkholdSubBar]);

    return (
      <>
        {/* Darkhold Sub-Ability Bar: visible STRICTLY ONLY while Darkhold is active */}
        {showDarkholdSubBar && (
          <div
            className="animate-cartoon-pop-in fixed z-20 flex items-center select-none"
            style={{
              right: flightCancelVisible
                ? 'calc(max(18px, var(--stage-safe-right, 0px) + 12px) + clamp(54px, 8.4vw, 66px) + clamp(10px, 1.8vw, 16px) + clamp(54px, 8.4vw, 66px) + 10px)'
                : 'calc(max(18px, var(--stage-safe-right, 0px) + 12px) + clamp(54px, 8.4vw, 66px) + clamp(10px, 1.8vw, 16px))',
              bottom:
                'calc(max(20px, calc(var(--stage-safe-bottom, 0px) + 14px)) + clamp(50px, 7.8vw, 62px) + 12px)',
              gap: 'clamp(6px, 1.0vw, 8px)',
              touchAction: 'manipulation',
              transition: 'right 140ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onPointerCancel={(e) => e.stopPropagation()}
          >
            {DARKHOLD_SUB_ABILITIES.map((sub) => {
              const cd = cooldowns[sub.id];
              const isOnCd = cd !== undefined;
              const isShieldOn = sub.id === 'auto-shield' && autoShieldActive;
              const isDisabled = isOnCd || locked || isShieldOn;
              const isPulsing = triggerPulseId === sub.id;

              const bg = isShieldOn ? '#2A0D1D' : '#3E1C36';
              const pressY = isPulsing ? 1.5 : isShieldOn ? 1 : 0;
              const scale = isPulsing ? 0.94 : 1;

              return (
                <div
                  key={sub.id}
                  className="relative"
                  style={{
                    transform: `rotate(${sub.tiltDeg}deg)`,
                    opacity: locked && !isOnCd ? 0.56 : 1,
                    transition: 'opacity 120ms ease',
                  }}
                >
                  <button
                    type="button"
                    disabled={isDisabled}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      activateAbility(sub.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        activateAbility(sub.id);
                      }
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-pressed={sub.id === 'auto-shield' ? isShieldOn : undefined}
                    aria-label={sub.name}
                    className="relative flex flex-col items-center justify-center gap-[2px] overflow-hidden rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    style={{
                      width: 'clamp(46px, 7.2vw, 56px)',
                      height: 'clamp(46px, 7.2vw, 56px)',
                      padding: '3px',
                      backgroundColor: bg,
                      backgroundImage: DARKHOLD_DOT_PATTERN,
                      backgroundSize: '10px 10px',
                      backgroundPosition: '0 0, 5px 5px',
                      border: isShieldOn
                        ? '2.5px solid #FF4D6A'
                        : '2.5px solid #0B0D18',
                      boxShadow: isShieldOn
                        ? '1px 1.5px 0 rgba(8, 10, 18, 0.92), inset 0 0 0 1.5px rgba(255, 118, 142, 0.6)'
                        : '2px 3px 0 rgba(8, 10, 18, 0.88), inset 0 0 0 1.5px rgba(255, 92, 122, 0.34)',
                      transform: `translateY(${pressY}px) scale(${scale})`,
                      cursor: isDisabled ? 'default' : 'pointer',
                      transition:
                        'transform 110ms cubic-bezier(0.16, 1, 0.3, 1), background-color 140ms ease, box-shadow 140ms ease',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <AbilityIcon id={sub.id} size={18} />
                    </span>

                    <span
                      className="relative z-10 font-cartoon font-bold italic uppercase text-center leading-[0.95]"
                      style={{
                        fontSize:
                          sub.name.length > 9
                            ? 'clamp(6.2px, 0.88vw, 7.4px)'
                            : 'clamp(7px, 0.96vw, 8.4px)',
                        color: isShieldOn ? 'rgba(255, 224, 232, 0.98)' : '#FFFFFF',
                        textShadow: '0 1.5px 0 rgba(8, 10, 18, 0.94)',
                      }}
                    >
                      {sub.name}
                    </span>

                    {/* Active 4.5s Automatic Shield countdown bar */}
                    {sub.id === 'auto-shield' && autoShieldActive && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[4px] bg-[#0B0D18]/85"
                      >
                        <div
                          ref={shieldBarRef}
                          className="h-full w-full bg-[#FF4D6A]"
                          style={{
                            transformOrigin: 'left center',
                            transform: 'scaleX(1)',
                            willChange: 'transform',
                          }}
                        />
                      </div>
                    )}

                    {/* Dark reveal wipe for sub-ability cooldowns */}
                    {isOnCd && (
                      <div
                        ref={(el) => {
                          veilRefs.current[sub.id] = el;
                        }}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-20"
                        style={{
                          backgroundColor: 'rgba(10, 11, 24, 0.74)',
                          borderTop: '1.5px solid rgba(255, 165, 185, 0.35)',
                          transformOrigin: 'bottom center',
                          transform: 'scaleY(1)',
                          willChange: 'transform',
                        }}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main 4-Slot Ability Bar */}
        <div
          className="fixed z-20 flex items-center select-none"
          style={{
            right:
              'calc(max(18px, var(--stage-safe-right, 0px) + 12px) + clamp(54px, 8.4vw, 66px) + clamp(10px, 1.8vw, 16px))',
            bottom: 'max(20px, calc(var(--stage-safe-bottom, 0px) + 14px))',
            gap: 'clamp(6px, 1.1vw, 9px)',
            touchAction: 'manipulation',
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onPointerCancel={(e) => e.stopPropagation()}
        >
          {abilities.map((card) => {
            const isCharged = isChargedAbility(card);
            const isDarkholdSelected = card.id === 'darkhold' && darkholdActive;
            const isAstralSelected =
              card.id === 'astral-projection' && astralActive;
            const isDiamondSelected =
              card.id === 'diamond-form' && diamondActive;
            const isTelepathicSelected =
              card.id === 'telepathic-wave' && telepathicWaveActive;
            const isSwordSummonSelected =
              card.id === 'sword-summon' && swordSummonActive;
            const isToggleSelected =
              (isFlightAbility(card.id) && flightOn) ||
              (card.id === 'pain-infliction' && painChanneling) ||
              isDarkholdSelected ||
              isAstralSelected ||
              isDiamondSelected ||
              isTelepathicSelected ||
              isSwordSummonSelected;
            const cd = cooldowns[card.id];
            const isOnStandardCd = cd !== undefined;
            const isChargeEmpty = isCharged && charges === 0;
            const blockedByPain = painChanneling && card.id !== 'pain-infliction';
            const blockedByGroupLock = Boolean(lockedAbilityIds?.includes(card.id));
            const isDisabled =
              isOnStandardCd ||
              isChargeEmpty ||
              locked ||
              blockedByPain ||
              blockedByGroupLock;
            const isTriggerPulsing = triggerPulseId === card.id;

            const baseBg = isDarkholdSelected
              ? '#2A0E22'
              : isToggleSelected
                ? '#1C1D3A'
                : '#353664';
            const pressOffsetY = isTriggerPulsing ? 1.5 : isToggleSelected ? 1 : 0;
            const scaleVal = isTriggerPulsing ? 0.94 : 1;

            return (
              <div
                key={card.id}
                className="relative"
                style={{
                  transform: `rotate(${card.tiltDeg}deg)`,
                  opacity:
                    (locked || blockedByPain || blockedByGroupLock) &&
                    !isOnStandardCd &&
                    !isChargeEmpty
                      ? 0.56
                      : 1,
                  transition: 'opacity 120ms ease',
                }}
              >
                {/* Synchronized Red Circular Stack Counter */}
                {card.maxCharges !== undefined && (
                  <div
                    key={chargeAnimKey}
                    className="pointer-events-none absolute z-30 flex items-center justify-center rounded-full font-cartoon font-bold italic text-white animate-charge-pop"
                    style={{
                      top: '-9px',
                      right: '-7px',
                      width: '21px',
                      height: '21px',
                      fontSize: '12px',
                      lineHeight: 1,
                      backgroundColor: charges === 0 ? '#B82834' : '#E53540',
                      border: '2px solid #0B0D18',
                      boxShadow: '1px 2px 0 rgba(8, 10, 18, 0.78)',
                    }}
                  >
                    {charges}
                  </div>
                )}

                {/* Compact Square Dotted Purple Cartoon Ability Card */}
                <button
                  type="button"
                  disabled={isDisabled}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    activateAbility(card.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      activateAbility(card.id);
                    }
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  aria-pressed={
                    isFlightAbility(card.id) ||
                    card.id === 'pain-infliction' ||
                    card.id === 'darkhold' ||
                    card.id === 'astral-projection' ||
                    card.id === 'diamond-form' ||
                    card.id === 'telepathic-wave' ||
                    card.id === 'sword-summon'
                      ? isToggleSelected
                      : undefined
                  }
                  aria-label={card.name}
                  className="relative flex flex-col items-center justify-center gap-[2px] overflow-hidden rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{
                    width: 'clamp(50px, 7.8vw, 62px)',
                    height: 'clamp(50px, 7.8vw, 62px)',
                    padding: '3px',
                    backgroundColor: baseBg,
                    backgroundImage: isDarkholdSelected
                      ? DARKHOLD_DOT_PATTERN
                      : PURPLE_DOT_PATTERN,
                    backgroundSize: '11px 11px',
                    backgroundPosition: '0 0, 5.5px 5.5px',
                    border: isDarkholdSelected
                      ? '2.5px solid #FF3B5C'
                      : card.id === 'pain-infliction' && painChanneling
                        ? '2.5px solid #FFA726'
                        : isAstralSelected || isTelepathicSelected
                          ? '2.5px solid #80DCFF'
                          : isDiamondSelected
                            ? '2.5px solid #D8F5FF'
                            : isSwordSummonSelected
                              ? '2.5px solid #3CE66B'
                              : '2.5px solid #0B0D18',
                    boxShadow: isDarkholdSelected
                      ? '1px 1.5px 0 rgba(8, 10, 18, 0.92), inset 0 0 0 1.5px rgba(255, 78, 108, 0.56)'
                      : isToggleSelected
                        ? '1px 1.5px 0 rgba(8, 10, 18, 0.9), inset 0 0 0 1.5px rgba(255, 168, 96, 0.56)'
                        : '2px 3px 0 rgba(8, 10, 18, 0.85), inset 0 0 0 1.5px rgba(155, 160, 230, 0.22)',
                    transform: `translateY(${pressOffsetY}px) scale(${scaleVal})`,
                    cursor: isDisabled ? 'default' : 'pointer',
                    transition:
                      'transform 110ms cubic-bezier(0.16, 1, 0.3, 1), background-color 140ms ease, box-shadow 140ms ease',
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <AbilityIcon id={card.id} size={20} />
                  </span>

                  <span
                    className="relative z-10 font-cartoon font-bold italic uppercase text-center leading-[0.95]"
                    style={{
                      fontSize:
                        card.name.length > 10
                          ? 'clamp(6.4px, 0.92vw, 7.8px)'
                          : 'clamp(7.5px, 1.05vw, 9px)',
                      color: isToggleSelected ? 'rgba(255, 224, 232, 0.96)' : '#FFFFFF',
                      textShadow: '0 1.5px 0 rgba(8, 10, 18, 0.94)',
                    }}
                  >
                    {card.name}
                  </span>

                  {/* Stack recharge progress bar */}
                  {isCharged && isRecharging && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[4px] bg-[#0B0D18]/80"
                    >
                      <div
                        ref={chargeBarRef}
                        className="h-full w-full"
                        style={{
                          backgroundColor:
                            card.id === 'phoenix-fireballs' ? '#FF981A' : '#FF4D6A',
                          transformOrigin: 'left center',
                          transform: 'scaleX(0)',
                          willChange: 'transform',
                        }}
                      />
                    </div>
                  )}

                  {/* Active 12s Darkhold summon countdown bar */}
                  {card.id === 'darkhold' && darkholdActive && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[4px] bg-[#0B0D18]/85"
                    >
                      <div
                        ref={darkholdBarRef}
                        className="h-full w-full bg-[#FF3B5C]"
                        style={{
                          transformOrigin: 'left center',
                          transform: 'scaleX(1)',
                          willChange: 'transform',
                        }}
                      />
                    </div>
                  )}

                  {/* Active 5s Pain Infliction channel countdown bar */}
                  {card.id === 'pain-infliction' && painChanneling && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[4px] bg-[#0B0D18]/85"
                    >
                      <div
                        ref={painBarRef}
                        className="h-full w-full bg-[#FFA726]"
                        style={{
                          transformOrigin: 'left center',
                          transform: 'scaleX(1)',
                          willChange: 'transform',
                        }}
                      />
                    </div>
                  )}

                  {/* Active 10s Astral Projection countdown bar */}
                  {card.id === 'astral-projection' && astralActive && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[4px] bg-[#0B0D18]/85"
                    >
                      <div
                        ref={astralBarRef}
                        className="h-full w-full bg-[#80DCFF]"
                        style={{
                          transformOrigin: 'left center',
                          transform: 'scaleX(1)',
                          willChange: 'transform',
                        }}
                      />
                    </div>
                  )}

                  {/* Active 15s Diamond Form countdown bar */}
                  {card.id === 'diamond-form' && diamondActive && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[4px] bg-[#0B0D18]/85"
                    >
                      <div
                        ref={diamondBarRef}
                        className="h-full w-full bg-[#D8F5FF]"
                        style={{
                          transformOrigin: 'left center',
                          transform: 'scaleX(1)',
                          willChange: 'transform',
                        }}
                      />
                    </div>
                  )}

                  {/* Active 2.4s Telepathic Wave channel countdown bar */}
                  {card.id === 'telepathic-wave' && telepathicWaveActive && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[4px] bg-[#0B0D18]/85"
                    >
                      <div
                        ref={telepathicBarRef}
                        className="h-full w-full bg-[#80DCFF]"
                        style={{
                          transformOrigin: 'left center',
                          transform: 'scaleX(1)',
                          willChange: 'transform',
                        }}
                      />
                    </div>
                  )}

                  {/* Active 14s Sword Summon countdown bar */}
                  {card.id === 'sword-summon' && swordSummonActive && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[4px] bg-[#0B0D18]/85"
                    >
                      <div
                        ref={swordSummonBarRef}
                        className="h-full w-full bg-[#3CE66B]"
                        style={{
                          transformOrigin: 'left center',
                          transform: 'scaleX(1)',
                          willChange: 'transform',
                        }}
                      />
                    </div>
                  )}

                  {/* Dark reveal wipe for standard cooldowns OR while 0 charges remain */}
                  {(isOnStandardCd || isChargeEmpty) && (
                    <div
                      ref={(el) => {
                        veilRefs.current[card.id] = el;
                      }}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-20"
                      style={{
                        backgroundColor: 'rgba(10, 11, 24, 0.74)',
                        borderTop: '1.5px solid rgba(190, 195, 255, 0.32)',
                        transformOrigin: 'bottom center',
                        transform: 'scaleY(1)',
                        willChange: 'transform',
                      }}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  },
);
