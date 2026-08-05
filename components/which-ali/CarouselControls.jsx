"use client";

export default function CarouselControls({ onPrev, onNext, disabled = false }) {
  return (
    <div className="which-ali-controls" aria-hidden={false}>
      <button
        type="button"
        className="which-ali-arrow which-ali-arrow--prev"
        onClick={onPrev}
        disabled={disabled}
        aria-label="Previous character"
      >
        <span className="which-ali-arrow-glyph" aria-hidden="true">
          ◀
        </span>
      </button>
      <button
        type="button"
        className="which-ali-arrow which-ali-arrow--next"
        onClick={onNext}
        disabled={disabled}
        aria-label="Next character"
      >
        <span className="which-ali-arrow-glyph" aria-hidden="true">
          ▶
        </span>
      </button>
    </div>
  );
}
