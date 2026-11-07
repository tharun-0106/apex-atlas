/** Official Formula 1 constructor color themes and badge helpers */
export interface TeamTheme {
  primary: string
  border: string
  bg: string
  text: string
}

const DEFAULT_THEME: TeamTheme = {
  primary: '#E10600',
  border: 'border-apex/40',
  bg: 'bg-apex/10',
  text: 'text-apex',
}

const TEAM_MAP: Record<string, TeamTheme> = {
  ferrari: {
    primary: '#E8002D',
    border: 'border-[#E8002D]/50',
    bg: 'bg-[#E8002D]/10',
    text: 'text-[#E8002D]',
  },
  mclaren: {
    primary: '#FF8000',
    border: 'border-[#FF8000]/50',
    bg: 'bg-[#FF8000]/10',
    text: 'text-[#FF8000]',
  },
  mercedes: {
    primary: '#00D2BE',
    border: 'border-[#00D2BE]/50',
    bg: 'bg-[#00D2BE]/10',
    text: 'text-[#00D2BE]',
  },
  red_bull: {
    primary: '#3671C6',
    border: 'border-[#3671C6]/50',
    bg: 'bg-[#3671C6]/10',
    text: 'text-[#3671C6]',
  },
  aston_martin: {
    primary: '#229971',
    border: 'border-[#229971]/50',
    bg: 'bg-[#229971]/10',
    text: 'text-[#229971]',
  },
  williams: {
    primary: '#64C4FF',
    border: 'border-[#64C4FF]/50',
    bg: 'bg-[#64C4FF]/10',
    text: 'text-[#64C4FF]',
  },
  alpine: {
    primary: '#0093CC',
    border: 'border-[#0093CC]/50',
    bg: 'bg-[#0093CC]/10',
    text: 'text-[#0093CC]',
  },
  sauber: {
    primary: '#52E252',
    border: 'border-[#52E252]/50',
    bg: 'bg-[#52E252]/10',
    text: 'text-[#52E252]',
  },
  audi: {
    primary: '#52E252',
    border: 'border-[#52E252]/50',
    bg: 'bg-[#52E252]/10',
    text: 'text-[#52E252]',
  },
  haas: {
    primary: '#B6BABD',
    border: 'border-[#B6BABD]/50',
    bg: 'bg-[#B6BABD]/10',
    text: 'text-[#B6BABD]',
  },
  rb: {
    primary: '#6692FF',
    border: 'border-[#6692FF]/50',
    bg: 'bg-[#6692FF]/10',
    text: 'text-[#6692FF]',
  },
  alphatauri: {
    primary: '#5E8FAA',
    border: 'border-[#5E8FAA]/50',
    bg: 'bg-[#5E8FAA]/10',
    text: 'text-[#5E8FAA]',
  },
  racing_point: {
    primary: '#F596C8',
    border: 'border-[#F596C8]/50',
    bg: 'bg-[#F596C8]/10',
    text: 'text-[#F596C8]',
  },
  renault: {
    primary: '#FFF500',
    border: 'border-[#FFF500]/50',
    bg: 'bg-[#FFF500]/10',
    text: 'text-[#FFF500]',
  },
}

export function getTeamTheme(constructorRef?: string | null): TeamTheme {
  if (!constructorRef) return DEFAULT_THEME
  const normalized = constructorRef.toLowerCase().replace(/[\s-]/g, '_')
  for (const [key, theme] of Object.entries(TEAM_MAP)) {
    if (normalized.includes(key)) return theme
  }
  return DEFAULT_THEME
}
