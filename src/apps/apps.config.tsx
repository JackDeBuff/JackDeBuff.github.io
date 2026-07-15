import type { ComponentType, ReactNode } from "react";
import {
  NotesIcon,
  SafariIcon,
  GithubIcon,
  LinkedinIcon,
  MusicIcon,
  PhotosIcon,
  SettingsIcon,
  TerminalIcon,
  StocksIcon,
  MapsIcon,
  TrashIcon,
  LineupIcon,
} from "../icons/AppIcons";
import Notes from "./Notes";
import Chrome from "./Chrome";
import Photos from "./Photos";
import Terminal from "./Terminal";
import Settings from "./Settings";
import YouTubeMusic from "./YouTubeMusic";
import Stocks from "./Stocks";
import Maps from "./Maps";
import Trash from "./Trash";
import Lineup from "./Lineup";
import { profile } from "../data/profile";

export interface AppDef {
  id: string;
  title: string;
  /** Shorter label for the mobile home-screen grid (e.g. "Settings"). */
  mobileTitle?: string;
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
    title: "Notes",
    icon: <NotesIcon />,
    dock: true,
    desktop: true,
    component: Notes,
    defaultSize: { width: 900, height: 600 },
    defaultPosition: { x: 120, y: 80 },
  },
  {
    id: "chrome", // id kept for Terminal's `open chrome` + persisted window state
    title: "Safari",
    icon: <SafariIcon />,
    dock: true,
    desktop: true,
    component: Chrome,
    defaultSize: { width: 960, height: 620 },
    defaultPosition: { x: 200, y: 60 },
  },
  {
    id: "photos",
    title: "Photos",
    icon: <PhotosIcon />,
    dock: true,
    desktop: true,
    component: Photos,
    defaultSize: { width: 980, height: 640 },
    defaultPosition: { x: 160, y: 70 },
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
    id: "maps",
    title: "Maps",
    icon: <MapsIcon />,
    dock: false,
    desktop: true,
    component: Maps,
    defaultSize: { width: 940, height: 620 },
    defaultPosition: { x: 150, y: 60 },
  },
  {
    id: "stocks",
    title: "Stocks",
    icon: <StocksIcon />,
    dock: false,
    desktop: true,
    component: Stocks,
    defaultSize: { width: 560, height: 640 },
    defaultPosition: { x: 380, y: 80 },
  },
  {
    id: "lineup",
    title: "FootMob",
    mobileTitle: "FootMob",
    icon: <LineupIcon />,
    dock: false,
    desktop: true,
    component: Lineup,
    defaultSize: { width: 560, height: 640 },
    defaultPosition: { x: 300, y: 70 },
  },
  {
    id: "trash",
    title: "Trash",
    icon: <TrashIcon />,
    dock: false,
    desktop: true,
    component: Trash,
    defaultSize: { width: 560, height: 560 },
    defaultPosition: { x: 260, y: 100 },
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
    mobileTitle: "Settings",
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
