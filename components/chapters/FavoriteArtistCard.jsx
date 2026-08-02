import SectionTransition from "../SectionTransition";
import { soundtrackChapter } from "../../data/wrappedChapters";

export default function FavoriteArtistCard() {
  const { favoriteArtist, favoriteSong } = soundtrackChapter;

  return (
    <SectionTransition className="wrapped-card wrapped-accent-green" variant="rise">
      <span className="wrapped-kicker">chapter one · your soundtrack</span>
      <div className="wrapped-body">
        <p className="wrapped-title">{favoriteArtist}</p>
        <p className="wrapped-caption">
          his favorite artist, no contest. on repeat this year: <strong>{favoriteSong.title}</strong> — {favoriteSong.note}
        </p>
      </div>
    </SectionTransition>
  );
}
