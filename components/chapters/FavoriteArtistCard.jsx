import SectionTransition from "../SectionTransition";
import { soundtrackChapter } from "../../data/wrappedChapters";

/** Figma frame: 04 Chapter 01 - Your Soundtrack */
export default function FavoriteArtistCard() {
  const { favoriteArtist, favoriteSong, concertMemory } = soundtrackChapter;

  return (
    <SectionTransition className="wrapped-card wrapped-accent-green" variant="rise">
      <span className="wrapped-kicker">chapter 01 · your soundtrack</span>
      <div className="wrapped-body">
        <p className="wrapped-title">{favoriteSong.title}</p>
        <p className="wrapped-caption">{favoriteArtist}</p>
        <p className="wrapped-caption">{concertMemory.body}</p>
        <p className="wrapped-caption wrapped-runners">
          runner-up: Delilah (pull me out of this) · Turn on the lights again..
        </p>
      </div>
    </SectionTransition>
  );
}
