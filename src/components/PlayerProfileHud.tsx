import { useMemo } from 'react';
import { getCharacterPortraitUrl } from '../game/characterPortrait';
import { CharacterDefinition, resolveCharacterWithSkin } from '../game/characters';

interface PlayerProfileHudProps {
  character: CharacterDefinition;
  skinId?: string | null;
  hp: number;
  maxHp: number;
}

const YELLOW_DOT_PATTERN =
  'radial-gradient(circle, rgba(217, 134, 0, 0.34) 1.5px, transparent 1.6px), radial-gradient(circle, rgba(217, 134, 0, 0.34) 1.5px, transparent 1.6px)';

const HEALTH_DOT_PATTERN =
  'radial-gradient(circle, rgba(160, 168, 200, 0.42) 1.15px, transparent 1.25px), radial-gradient(circle, rgba(160, 168, 200, 0.42) 1.15px, transparent 1.25px)';

const SEGMENTS = 10;

/**
 * Left-side Cartoon Gameplay Profile HUD matching the visual reference:
 * slightly tilted square portrait on golden-yellow polka-dot backing,
 * slanted bright yellow name banner, and 10-segment white dotted health bar.
 */
export function PlayerProfileHud({
  character,
  skinId,
  hp,
  maxHp,
}: PlayerProfileHudProps) {
  const resolved = useMemo(
    () => resolveCharacterWithSkin(character, skinId),
    [character, skinId],
  );

  const portraitUrl = useMemo(
    () =>
      getCharacterPortraitUrl(
        `${character.id}:${resolved.skin?.id ?? 'base'}`,
        resolved.appearance,
      ),
    [character.id, resolved.skin?.id, resolved.appearance],
  );

  const clampedMax = Math.max(1, maxHp);
  const clampedHp = Math.max(0, Math.min(clampedMax, Math.round(hp)));
  const hpFraction = clampedHp / clampedMax;

  return (
    <div
      className="pointer-events-none fixed z-20 flex items-center select-none"
      style={{
        top: 'max(6px, var(--stage-safe-top, 0px))',
        left: 'max(10px, var(--stage-safe-left, 0px))',
        gap: 'clamp(6px, 1vw, 9px)',
      }}
    >
      {/* Left Tilted Character Portrait Frame */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: 'clamp(52px, 8.2vw, 70px)',
          height: 'clamp(52px, 8.2vw, 70px)',
          backgroundColor: '#FFFFFF',
          border: '3px solid #0B0D18',
          boxShadow: '2.5px 3.5px 0 rgba(8, 10, 18, 0.9)',
          transform: 'rotate(-2.8deg)',
          padding: '3px',
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            backgroundColor: '#FFD12A',
            backgroundImage: YELLOW_DOT_PATTERN,
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 5px 5px',
            border: '1.5px solid #0B0D18',
          }}
        >
          {portraitUrl ? (
            <img
              src={portraitUrl}
              alt={resolved.displayName}
              draggable={false}
              className="h-full w-full object-cover object-top scale-[1.18]"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ backgroundColor: resolved.appearance.topPrimary }}
            />
          )}
        </div>
      </div>

      {/* Right Column: Yellow Name Banner + 10-Segment Dotted Health Bar */}
      <div
        className="flex flex-col items-start"
        style={{ gap: 'clamp(4px, 0.7vw, 6px)' }}
      >
        {/* Slanted Dark Character Name Banner with Character-Specific Name Color */}
        <div
          className="px-2.5 py-[2px]"
          style={{
            backgroundColor: '#1C1E38',
            border: '2.5px solid #0B0D18',
            boxShadow: '2px 2.5px 0 rgba(8, 10, 18, 0.9)',
            transform: 'rotate(-1.8deg)',
          }}
        >
          <span
            className="block font-cartoon font-extrabold italic uppercase leading-tight tracking-tight"
            style={{
              fontSize: 'clamp(11px, 1.8vw, 15px)',
              color: resolved.nameColor,
              textShadow: '0 1.5px 0 #0B0D18',
            }}
          >
            {resolved.displayName}
          </span>
        </div>

        {/* 10-Segment White Polka-Dot Health Bar with Bold Outlined HP Readout */}
        <div
          className="relative flex items-center"
          style={{
            width: 'clamp(138px, 22vw, 205px)',
            height: 'clamp(20px, 3vw, 26px)',
            backgroundColor: '#0B0D18',
            border: '2.5px solid #0B0D18',
            boxShadow: '2px 3px 0 rgba(8, 10, 18, 0.9)',
            transform: 'rotate(-1.3deg)',
            gap: '2px',
            padding: '2px',
          }}
        >
          {Array.from({ length: SEGMENTS }).map((_, idx) => {
            const segStart = idx / SEGMENTS;
            const segEnd = (idx + 1) / SEGMENTS;
            const segFill = Math.max(
              0,
              Math.min(1, (hpFraction - segStart) / (segEnd - segStart)),
            );

            return (
              <div
                key={idx}
                className="relative h-full flex-1 overflow-hidden"
                style={{
                  backgroundColor: '#232645',
                }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${segFill * 100}%`,
                    backgroundColor: '#F7F8FC',
                    backgroundImage: HEALTH_DOT_PATTERN,
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 4px 4px',
                    transition: 'width 90ms linear',
                  }}
                />
              </div>
            );
          })}

          {/* Centered Bold Outlined HP Value */}
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-cartoon font-extrabold italic tabular-nums text-white"
            style={{
              fontSize: 'clamp(11px, 1.55vw, 14px)',
              WebkitTextStroke: '3px #0B0D18',
              paintOrder: 'stroke fill',
              textShadow: '0 1.5px 0 #0B0D18',
            }}
          >
            {clampedHp}/{clampedMax}
          </span>
        </div>
      </div>
    </div>
  );
}
