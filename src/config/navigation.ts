import { Clock, Cpu, LayoutDashboard, ScanSearch, Stethoscope, type LucideIcon } from 'lucide-react';

export interface NavLink {
  labelKey: 'navHowItWorks' | 'navModel' | 'navLimitations' | 'navAbout';
  to: string;
}

export const NAV_LINKS: NavLink[] = [
  { labelKey: 'navHowItWorks', to: '/#how-it-works' },
  { labelKey: 'navModel', to: '/#model' },
  { labelKey: 'navLimitations', to: '/#limitations' },
  { labelKey: 'navAbout', to: '/#about' },
];

export interface DashboardLink {
  labelKey: 'navOverview' | 'navNewScreening' | 'navScreeningHistory' | 'navAboutModel' | 'navDoctorReview';
  to: string;
  icon: LucideIcon;
}

export const DASHBOARD_LINKS: DashboardLink[] = [
  { labelKey: 'navOverview', to: '/dashboard', icon: LayoutDashboard },
  { labelKey: 'navNewScreening', to: '/screening', icon: ScanSearch },
  { labelKey: 'navScreeningHistory', to: '/history', icon: Clock },
  { labelKey: 'navDoctorReview', to: '/doctor-review', icon: Stethoscope },
  { labelKey: 'navAboutModel', to: '/model', icon: Cpu },
];
