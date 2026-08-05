/** Shared album audio — survives client navigations so a tracklist click can start playback. */

let sharedAudio = null;

export function getAlbumAudio() {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = "auto";
  }
  return sharedAudio;
}

export async function playAlbumSong(src) {
  const audio = getAlbumAudio();
  if (!audio || !src) return false;

  const absolute = new URL(src, window.location.origin).href;
  if (audio.dataset.trackSrc !== src) {
    audio.dataset.trackSrc = src;
    audio.src = absolute;
  }

  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function pauseAlbumSong() {
  sharedAudio?.pause();
}
