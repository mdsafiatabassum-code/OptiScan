import { Cpu, LayoutDashboard, ScanSearch, type LucideIcon } from 'lucide-react';

export interface NavLink {
  label: string;
  to: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Model', to: '/#model' },
  { label: 'Limitations', to: '/#limitations' },
  { label: 'About', to: '/#about' },
];

export interface DashboardLink extends NavLink {
  icon: LucideIcon;
}

export const DASHBOARD_LINKS: DashboardLink[] = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'New Screening', to: '/screening', icon: ScanSearch },
  { label: 'About the Model', to: '/model', icon: Cpu },
];
