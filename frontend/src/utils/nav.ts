export interface NavItem {
  label: string
  to: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Circuits', to: '/circuits' },
  { label: 'Drivers', to: '/drivers' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Statistics', to: '/statistics' },
]
