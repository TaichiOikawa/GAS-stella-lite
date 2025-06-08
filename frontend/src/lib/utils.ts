import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function navigate(url: string) {
  if (url.startsWith("/")) {
    url = url.slice(1);
  }
  if (!import.meta.env.DEV && window.top) {
    let path = "<?= getAppUrl() ?>" + "/" + url;
    if (path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    window.top.location.href = path;
  } else {
    const path = window.location.origin + "/" + url;
    window.location.href = path;
  }
}
