const COUNTRY_FLAGS: Record<string, string> = {
  bahrain: '🇧🇭',
  saudi_arabia: '🇸🇦',
  australia: '🇦🇺',
  japan: '🇯🇵',
  china: '🇨🇳',
  usa: '🇺🇸',
  united_states: '🇺🇸',
  miami: '🇺🇸',
  las_vegas: '🇺🇸',
  monaco: '🇲🇨',
  canada: '🇨🇦',
  spain: '🇪🇸',
  austria: '🇦🇹',
  uk: '🇬🇧',
  united_kingdom: '🇬🇧',
  great_britain: '🇬🇧',
  hungary: '🇭🇺',
  belgium: '🇧🇪',
  netherlands: '🇳🇱',
  italy: '🇮🇹',
  azerbaijan: '🇦🇿',
  singapore: '🇸🇬',
  qatar: '🇶🇦',
  mexico: '🇲🇽',
  brazil: '🇧🇷',
  uae: '🇦🇪',
  abu_dhabi: '🇦🇪',
  portugal: '🇵🇹',
  turkey: '🇹🇷',
  russia: '🇷🇺',
  germany: '🇩🇪',
  france: '🇫🇷',
  malaysia: '🇲🇾',
}

export function getCountryFlag(country?: string | null): string {
  if (!country) return '🏁'
  const key = country.toLowerCase().trim().replace(/[\s-]/g, '_')
  for (const [k, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (key.includes(k) || k.includes(key)) return flag
  }
  return '🏁'
}
