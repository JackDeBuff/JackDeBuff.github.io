import type { ComponentType, ReactNode } from "react";
import {
  AboutIcon,
  ChromeIcon,
  GithubIcon,
  LinkedinIcon,
  MusicIcon,
  SettingsIcon,
  TerminalIcon,
} from "../icons/AppIcons";
import AboutJack from "./AboutJack";
import Chrome from "./Chrome";
import Terminal from "./Terminal";
import Settings from "./Settings";
import YouTubeMusic from "./YouTubeMusic";
import { profile } from "../data/profile";

export interface AppDef {
  id: string;
  title: string;
  icon: ReactNode;
  dock: boolean;
  desktop: boolean;
  external?: string;
  component?: ComponentType;
  defaultSize?: { width: number; height: number };
  defaultPosition?: { x: number; y: number };
}

export const apps: AppDef[] = [
  {
    id: "about",
    title: "About Jack",
    icon: <AboutIcon />,
    dock: true,
    desktop: true,
    component: AboutJack,
    defaultSize: { width: 860, height: 560 },
    defaultPosition: { x: 120, y: 80 },
  },
  {
    id: "chrome",
    title: "Google Chrome",
    icon: <ChromeIcon />,
    dock: true,
    desktop: true,
    component: Chrome,
    defaultSize: { width: 960, height: 620 },
    defaultPosition: { x: 200, y: 60 },
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: <TerminalIcon />,
    dock: true,
    desktop: false,
    component: Terminal,
    defaultSize: { width: 680, height: 440 },
    defaultPosition: { x: 300, y: 160 },
  },
  {
    id: "music",
    title: "YouTube Music",
    icon: <MusicIcon />,
    dock: true,
    desktop: false,
    component: YouTubeMusic,
    defaultSize: { width: 900, height: 580 },
    defaultPosition: { x: 240, y: 100 },
  },
  {
    id: "settings",
    title: "System Settings",
    icon: <SettingsIcon />,
    dock: true,
    desktop: false,
    component: Settings,
    defaultSize: { width: 760, height: 520 },
    defaultPosition: { x: 340, y: 130 },
  },
  {
    id: "github",
    title: "GitHub",
    icon: <GithubIcon />,
    dock: true,
    desktop: true,
    external: profile.github,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    icon: <LinkedinIcon />,
    dock: true,
    desktop: true,
    external: profile.linkedin,
  },
];
