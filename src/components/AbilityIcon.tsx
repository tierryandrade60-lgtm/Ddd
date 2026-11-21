import { AbilityId } from '../game/abilityConfig';

interface AbilityIconProps {
  id: AbilityId;
  size?: number;
}

/**
 * Shared Cartoon SVG icon set for Scarlet Witch and Phoenix Force abilities,
 * used identically in both gameplay AbilityBar and CharacterSelector.
 */
export function AbilityIcon({ id, size = 22 }: AbilityIconProps) {
  switch (id) {
    case 'flight':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3.5L16.8 8.8H13.8V13.8H10.2V8.8H7.2L12 3.5Z"
            fill="#FFFFFF"
            stroke="#0B0D18"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 16.5C6.8 15 9.2 17.8 12 16.4C14.8 15 17.2 17.8 19.5 16.3"
            stroke="#FF7B93"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <path
            d="M6.5 19.8C8.8 18.6 11.2 20.6 14 19.4C15.8 18.6 17.2 19.2 18.2 19.6"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'chaos-bolt':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="6.2"
            fill="#FF4B64"
            stroke="#0B0D18"
            strokeWidth="1.7"
          />
          <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
          <path
            d="M12 2.2V5.3M12 18.7V21.8M2.2 12H5.3M18.7 12H21.8M5.1 5.1L7.3 7.3M16.7 16.7L18.9 18.9M18.9 5.1L16.7 7.3M7.3 16.7L5.1 18.9"
            stroke="#FFFFFF"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'darkhold':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Open Darkhold grimoire pages with dark-crimson filigree cover & Chaos Star sigil */}
          <path
            d="M3 6.2C3 5.3 3.7 4.7 4.6 4.8L11.4 6.2V19.6L4.2 18.2C3.5 18 3 17.4 3 16.7V6.2Z"
            fill="#5C1324"
            stroke="#0B0D18"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M21 6.2C21 5.3 20.3 4.7 19.4 4.8L12.6 6.2V19.6L19.8 18.2C20.5 18 21 17.4 21 16.7V6.2Z"
            fill="#5C1324"
            stroke="#0B0D18"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M4.6 6.6L10.8 7.8V17.8L4.6 16.6V6.6Z"
            fill="#F4E3C9"
            stroke="#0B0D18"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 6.6L13.2 7.8V17.8L19.4 16.6V6.6Z"
            fill="#EAD2B0"
            stroke="#0B0D18"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          {/* Glowing Scarlet Chaos Rune Sigil over Darkhold */}
          <circle cx="12" cy="12" r="3.4" fill="#FF3258" stroke="#0B0D18" strokeWidth="1.2" />
          <path
            d="M12 7.3L13.1 10.6L16.5 10.6L13.8 12.6L14.8 15.9L12 13.9L9.2 15.9L10.2 12.6L7.5 10.6L10.9 10.6Z"
            fill="#FFE6EC"
          />
        </svg>
      );

    case 'teleport':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="8.2"
            stroke="#FF637D"
            strokeWidth="2.1"
            strokeDasharray="4 2.5"
          />
          <path
            d="M7.5 14.5L13.5 8.5M13.5 8.5H9.2M13.5 8.5V12.8"
            stroke="#FFFFFF"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16.8" cy="16.4" r="2.2" fill="#FFFFFF" stroke="#0B0D18" strokeWidth="1.3" />
        </svg>
      );

    case 'telekinetic-explosion':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Outward scarlet telekinetic shockwave ring & directional burst rays */}
          <circle
            cx="12"
            cy="12"
            r="7.8"
            stroke="#FF4B6E"
            strokeWidth="2.1"
            strokeDasharray="4.5 2.4"
          />
          <circle
            cx="12"
            cy="12"
            r="3.8"
            fill="#FF2E54"
            stroke="#FFFFFF"
            strokeWidth="1.7"
          />
          <path
            d="M12 2.4V5.2M12 18.8V21.6M2.4 12H5.2M18.8 12H21.6M5 5L7.1 7.1M16.9 16.9L19 19M19 5L16.9 7.1M7.1 16.9L5 19"
            stroke="#FFFFFF"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'auto-shield':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Crimson Hex Protection Shield */}
          <path
            d="M12 2.8L19.4 5.8V11.6C19.4 16.3 16.2 19.9 12 21.4C7.8 19.9 4.6 16.3 4.6 11.6V5.8L12 2.8Z"
            fill="#E01F47"
            stroke="#0B0D18"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 5.4L16.8 7.4V11.4C16.8 14.7 14.7 17.3 12 18.5C9.3 17.3 7.2 14.7 7.2 11.4V7.4L12 5.4Z"
            fill="#FF6B88"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11.6" r="2.2" fill="#FFFFFF" />
        </svg>
      );

    case 'chaos-implosion':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="4.2"
            fill="#D91E36"
            stroke="#FFFFFF"
            strokeWidth="1.8"
          />
          <path
            d="M3.5 3.5L8.2 8.2M8.2 8.2H5.3M8.2 8.2V5.3"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.5 3.5L15.8 8.2M15.8 8.2H18.7M15.8 8.2V5.3"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.5 20.5L8.2 15.8M8.2 15.8H5.3M8.2 15.8V18.7"
            stroke="#FF8FA3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.5 20.5L15.8 15.8M15.8 15.8H18.7M15.8 15.8V18.7"
            stroke="#FF8FA3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'phoenix-wave':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Triple erupting flame wave plumes */}
          <path
            d="M4.2 18.5C4.2 15 6 12.6 7.4 11.2C7.6 13.1 8.8 14.3 9.2 14.8C9.8 11.2 11.6 6.2 12.2 3.5C14.1 6.7 15.5 10.2 15.3 14.1C16.2 13.1 17 11.8 17.1 10.6C18.8 12.6 19.8 15.3 19.8 18.5H4.2Z"
            fill="#FFA726"
            stroke="#0B0D18"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 18.5C8.5 15.9 10.2 13.4 12 10.6C13.8 13.4 15.5 15.9 15.5 18.5H8.5Z"
            fill="#FFF3A8"
          />
          <path
            d="M3 20.4H21"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'phoenix-fireballs':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Blazing comet fireball with fiery tail */}
          <path
            d="M4.5 6.5L10.8 10.2M3.2 12.4H9.4M5.4 18L10.8 14.2"
            stroke="#FFD54F"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <circle
            cx="14.8"
            cy="12"
            r="5.6"
            fill="#FF6D1A"
            stroke="#0B0D18"
            strokeWidth="1.7"
          />
          <circle cx="15.2" cy="11.6" r="2.8" fill="#FFF6B3" />
        </svg>
      );

    case 'pain-infliction':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Psychic fire constriction reticle & burst */}
          <circle
            cx="12"
            cy="12"
            r="7.6"
            stroke="#FF981A"
            strokeWidth="2.1"
            strokeDasharray="4 2.5"
          />
          <path
            d="M12 4.4V8.2M12 15.8V19.6M4.4 12H8.2M15.8 12H19.6"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 8.2C13.6 10 14.4 11.4 14.4 12.8C14.4 14.2 13.3 15.2 12 15.2C10.7 15.2 9.6 14.2 9.6 12.8C9.6 11.4 10.4 10 12 8.2Z"
            fill="#FF5722"
            stroke="#FFFFFF"
            strokeWidth="1.4"
          />
        </svg>
      );

    case 'phoenix-flight':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Spread Phoenix fiery wings */}
          <path
            d="M12 14.5C9.4 14.5 5.2 11.4 3.2 6.8C6.6 7.5 9.2 9.1 11.2 11.2L12 6.2L12.8 11.2C14.8 9.1 17.4 7.5 20.8 6.8C18.8 11.4 14.6 14.5 12 14.5Z"
            fill="#FFAB2E"
            stroke="#0B0D18"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M6.4 15.2C8.5 16.5 10.4 16.9 12 19.6C13.6 16.9 15.5 16.5 17.6 15.2"
            stroke="#FFFFFF"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'astral-projection':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Luminous translucent psychic astral silhouette */}
          <circle
            cx="12"
            cy="7.5"
            r="3.2"
            fill="#BCEEFF"
            stroke="#0B0D18"
            strokeWidth="1.6"
          />
          <path
            d="M6.2 18.8C6.6 14.4 9 12.2 12 12.2C15 12.2 17.4 14.4 17.8 18.8"
            fill="#93E2FF"
            stroke="#0B0D18"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="9.1"
            stroke="#E8F6FF"
            strokeWidth="1.5"
            strokeDasharray="3.5 2.5"
          />
        </svg>
      );

    case 'mental-attack':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Telepathic forehead wind bolt + comic starburst */}
          <path
            d="M12 2.8L14 8.2L19.6 6.8L15.8 11.4L21 13.8L15.4 15.2L17 20.6L12.4 16.8L8.2 20.8L9.2 15.4L3.4 14L8.6 11.2L5.2 6.6L10.4 8.2Z"
            fill="#E8F6FF"
            stroke="#0B0D18"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.6" fill="#7CD8FF" />
        </svg>
      );

    case 'diamond-form':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Faceted living diamond crystal */}
          <path
            d="M6.5 4.2H17.5L21.2 9.4L12 20.4L2.8 9.4L6.5 4.2Z"
            fill="#C7F0FF"
            stroke="#0B0D18"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M2.8 9.4H21.2M6.5 4.2L9.2 9.4L12 20.4L14.8 9.4L17.5 4.2"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'telepathic-wave':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Expanding concentric psychic rings */}
          <circle cx="12" cy="12" r="2.6" fill="#FFFFFF" stroke="#0B0D18" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="5.6" stroke="#9EE4FF" strokeWidth="2" />
          <circle
            cx="12"
            cy="12"
            r="8.8"
            stroke="#E8F6FF"
            strokeWidth="1.8"
            strokeDasharray="4.5 2.2"
          />
        </svg>
      );

    case 'diamond-projectile':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Razor diamond crystal shard projectile */}
          <path
            d="M20.5 4.2L15.2 15.8L9.6 14.4L8.2 8.8L20.5 4.2Z"
            fill="#D8F5FF"
            stroke="#0B0D18"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M20.5 4.2L12.4 11.6M4 19.6L8.8 14.8M3.4 14.2L6.8 11.2"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'sword-summon':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Conjured Necrosword with emerald glow */}
          <path
            d="M19.8 3.6L16.8 9.8L13.8 10.6L11.2 13.4L10.6 16L8.2 15.4L5.2 18.8L4 17.6L7.4 14.6L6.8 12.2L9.4 11.6L12.2 9L13 6L19.8 3.6Z"
            fill="#283536"
            stroke="#3CE66B"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M18.6 4.8L11.2 12.2"
            stroke="#98FFB4"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'green-explosion':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Emerald energy burst */}
          <circle
            cx="12"
            cy="12"
            r="8.1"
            stroke="#3CE66B"
            strokeWidth="2.1"
            strokeDasharray="4.5 2.4"
          />
          <circle
            cx="12"
            cy="12"
            r="4.2"
            fill="#26C458"
            stroke="#FFFFFF"
            strokeWidth="1.6"
          />
          <path
            d="M12 2.4V5.2M12 18.8V21.6M2.4 12H5.2M18.8 12H21.6"
            stroke="#B9FFD0"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'spinning-leap':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Spiral aerial leap arrow */}
          <path
            d="M6.2 18.5C5.2 14.6 8.2 11.6 12.6 11.6C16.2 11.6 18.4 13.6 18.2 16"
            stroke="#3CE66B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M12 4.2L16.5 9.2H13.4V15.4H10.6V9.2H7.5L12 4.2Z"
            fill="#FFFFFF"
            stroke="#0B0D18"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'ground-sword':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Giant Necrosword erupting up from earth */}
          <path
            d="M12 2.8L15.4 9.5L13.9 10.6L14.5 18.4H9.5L10.1 10.6L8.6 9.5L12 2.8Z"
            fill="#1D2628"
            stroke="#3CE66B"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M4.2 19.6H19.8M6.2 17.5L8.6 19.6M17.8 17.5L15.4 19.6"
            stroke="#B4FFD0"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'crown-form':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Hela's 6-pronged obsidian & emerald antlered crown */}
          <path
            d="M3.2 7.2L8.4 13.6L6.6 5.4L10.6 12.4L12 4.2L13.4 12.4L17.4 5.4L15.6 13.6L20.8 7.2L17.8 17.4C15.8 18.6 14 19.2 12 19.2C10 19.2 8.2 18.6 6.2 17.4L3.2 7.2Z"
            fill="#1D2628"
            stroke="#3CE66B"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="15.8" r="1.6" fill="#3CE66B" />
        </svg>
      );

    case 'throw-sword':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Flying angled Necrosword with speed lines */}
          <path
            d="M20.6 4.4L15.4 12.6L12.6 12.4L11 14.8L8.8 13.2L11.2 11.4L11 8.6L20.6 4.4Z"
            fill="#1D2628"
            stroke="#3CE66B"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M3.4 18.6L8.2 15.2M3.2 13.6L6.8 11.6M6.8 20.6L10 17.6"
            stroke="#B4FFD0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'sword-slash':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Dual Necrosword slash arc */}
          <path
            d="M4.2 16.5C8.5 9.2 14.6 5.2 20.4 4.2"
            stroke="#98FFB4"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M19.8 4.2L13.8 10.8L11.8 11.2L8.4 15L6.8 13.4L10.6 10L11 8L19.8 4.2Z"
            fill="#1D2628"
            stroke="#3CE66B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M5.2 5.4L18.6 18.8"
            stroke="#3CE66B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
