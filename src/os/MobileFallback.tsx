import { profile } from "../data/profile";
import { AboutIcon, GithubIcon, LinkedinIcon } from "../icons/AppIcons";
import { useSettings, wallpaperUrl } from "../state/settings";

export default function MobileFallback() {
  const wallpaper = useSettings((s) => s.wallpaper);
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center bg-cover bg-center p-6 text-white"
      style={{ backgroundImage: `url(${wallpaperUrl(wallpaper)})` }}
    >
      <div className="glass w-full max-w-sm rounded-3xl p-6 text-center">
        <div className="mx-auto h-16 w-16"><AboutIcon /></div>
        <h1 className="mt-4 text-xl font-bold">{profile.name}</h1>
        <p className="mt-1 text-sm text-white/85">{profile.title}</p>
        <p className="mt-3 text-sm text-white/75">
          This portfolio is a full macOS desktop experience — open it on a bigger screen 💻
        </p>
        <div className="mt-5 flex justify-center gap-4">
          <a href={profile.github} target="_blank" rel="noopener" className="h-12 w-12">
            <GithubIcon />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener" className="h-12 w-12">
            <LinkedinIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
