import SectionTransition from "../SectionTransition";
import { recurringStories } from "../../data/wrappedChapters";

export default function StoriesChapter() {
  return (
    <SectionTransition className="wrapped-card wrapped-accent-teal" variant="rise">
      <span className="wrapped-kicker">chapter six · stories told more than once</span>
      <div className="wrapped-body">
        <ol className="wrapped-list wrapped-list-stories">
          {recurringStories.map((story, index) => (
            <li key={story.title}>
              <span className={`wrapped-rank ${index === 0 ? "is-first" : ""}`}>{index + 1}</span>
              <span className="wrapped-list-text">
                <span className="wrapped-list-name">{story.title}</span>
                <span className="wrapped-list-quote">{story.quote}</span>
              </span>
              <span className="wrapped-list-count">{story.tellCount}×</span>
            </li>
          ))}
        </ol>
      </div>
    </SectionTransition>
  );
}
