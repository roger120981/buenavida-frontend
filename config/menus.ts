import {
  DashBoard,
  Users, // Para Participants
  Building, // Para Agencies
  Medical, // Para Caregivers (como alternativa a Heart)
  ClipBoard, // Para Case Managers (como alternativa a Briefcase)
} from "@/components/svg";

export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
}

export const menusConfig = {
  mainNav: [
    {
      title: "Dashboard",
      icon: DashBoard,
      href: "/dashboard",
    },
  ],
  sidebarNav: {
    modern: [
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        title: "Participants",
        icon: Users,
        child: [
          {
            title: "Overview",
            href: "/participants",
            icon: DashBoard,
          },
          {
            title: "Create Participant",
            href: "/participants/create",
            icon: "heroicons:plus-circle",
          },
        ],
      },
      {
        title: "Case Managers",
        icon: ClipBoard, // Reemplacé Briefcase por ClipBoard
        child: [
          {
            title: "Overview",
            href: "/case-managers",
            icon: DashBoard,
          },
          {
            title: "Create Case Manager",
            href: "/case-managers/create",
            icon: "heroicons:plus-circle",
          },
        ],
      },
      {
        title: "Agencies",
        icon: Building,
        child: [
          {
            title: "Overview",
            href: "/agencies",
            icon: DashBoard,
          },
          {
            title: "Create Agency",
            href: "/agencies/create",
            icon: "heroicons:plus-circle",
          },
        ],
      },
      {
        title: "Caregivers",
        icon: Medical, // Reemplacé Heart por Medical
        child: [
          {
            title: "Overview",
            href: "/caregivers",
            icon: DashBoard,
          },
          {
            title: "Create Caregiver",
            href: "/caregivers/create",
            icon: "heroicons:plus-circle",
          },
        ],
      },
    ],
    classic: [
      {
        isHeader: true,
        title: "MENU",
      },
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        title: "Participants",
        icon: Users,
        child: [
          {
            title: "Overview",
            href: "/participants",
            icon: DashBoard,
          },
          {
            title: "Create Participant",
            href: "/participants/create",
            icon: "heroicons:plus-circle",
          },
        ],
      },
      {
        title: "Case Managers",
        icon: ClipBoard, // Reemplacé Briefcase por ClipBoard
        child: [
          {
            title: "Overview",
            href: "/case-managers",
            icon: DashBoard,
          },
          {
            title: "Create Case Manager",
            href: "/case-managers/create",
            icon: "heroicons:plus-circle",
          },
        ],
      },
      {
        title: "Agencies",
        icon: Building,
        child: [
          {
            title: "Overview",
            href: "/agencies",
            icon: DashBoard,
          },
          {
            title: "Create Agency",
            href: "/agencies/create",
            icon: "heroicons:plus-circle",
          },
        ],
      },
      {
        title: "Caregivers",
        icon: Medical, // Reemplacé Heart por Medical
        child: [
          {
            title: "Overview",
            href: "/caregivers",
            icon: DashBoard,
          },
          {
            title: "Create Caregiver",
            href: "/caregivers/create",
            icon: "heroicons:plus-circle",
          },
        ],
      },
    ],
  },
};

export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];