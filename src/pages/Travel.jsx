import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { travelIntro, travelPhotos } from "../constants";
import { CLICK_ACTIONS, trackClick } from "../lib/analytics";

const Travel = () => {
  // Index of the photo open in the modal, or null when it is closed.
  const [openIndex, setOpenIndex] = useState(null);
  const isOpen = openIndex !== null;

  const openPhoto = (index) => {
    trackClick(null, {
      action: CLICK_ACTIONS.PREVIEW,
      label: `Travel: ${travelPhotos[index].title}`,
    });
    setOpenIndex(index);
  };

  const step = useCallback((direction) => {
    setOpenIndex((index) =>
      index === null
        ? index
        : (index + direction + travelPhotos.length) % travelPhotos.length,
    );
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, step]);

  const active = isOpen ? travelPhotos[openIndex] : null;

  return (
    <section className="min-h-full bg-ubuntu-aubergine-dark p-4 pb-10 font-mono text-white sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ubuntu-warm-grey">
            <span className="flex items-center gap-2">
              <i
                className="fa-solid fa-plane-departure text-ubuntu-orange"
                aria-hidden="true"
              />
              ~/jayharron/travel
            </span>
            <span>{travelPhotos.length} chapters</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {travelIntro.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ubuntu-warm-grey">
            {travelIntro.caption}
          </p>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-ubuntu-warm-grey">
          <span className="text-ubuntu-orange">$</span>
          <span>cat ./story.log</span>
        </div>

        {/* One chapter per photo, read top to bottom along the rail. On wide
            screens the photo swaps sides each chapter so it reads like a
            path rather than a list. */}
        <ol className="relative space-y-8 border-l border-white/10 pl-5 sm:pl-7">
          {travelPhotos.map((photo, index) => (
            <li key={photo.title} className="relative">
              <span
                className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-ubuntu-orange ring-4 ring-ubuntu-orange/20 sm:-left-[33px]"
                aria-hidden="true"
              />
              <div
                className={`grid items-center gap-4 lg:grid-cols-2 lg:gap-6 ${
                  index % 2 === 1 ? "lg:[&>button]:order-2" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => openPhoto(index)}
                  className="group relative aspect-[4/3] overflow-hidden border border-white/10 bg-black/30 text-left transition-colors hover:border-ubuntu-orange/60 focus:outline-none focus-visible:border-ubuntu-orange"
                  title={`Open ${photo.title}`}
                >
                  <img
                    src={photo.image}
                    alt={`${photo.title}, ${photo.place}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <i className="fa-solid fa-expand" aria-hidden="true" />
                  </span>
                </button>
                <div>
                  <p className="text-xs text-ubuntu-warm-grey">
                    chapter {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-white">
                    {photo.title}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ubuntu-warm-grey">
                    <i
                      className="fa-solid fa-location-dot text-ubuntu-orange"
                      aria-hidden="true"
                    />
                    {photo.place}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </li>
          ))}
          <li className="relative">
            <span
              className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border border-ubuntu-orange bg-ubuntu-aubergine-dark sm:-left-[33px]"
              aria-hidden="true"
            />
            <p className="text-xs text-ubuntu-warm-grey">
              <span className="text-ubuntu-orange">$</span> ./next-trip.sh
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {travelIntro.outro}
              <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-ubuntu-orange" />
            </p>
          </li>
        </ol>
      </div>

      {active &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/85 p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={() => setOpenIndex(null)}
          >
            <figure
              className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-white/10 bg-ubuntu-aubergine-dark font-mono shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
                <img
                  key={active.title}
                  src={active.image}
                  alt={`${active.title}, ${active.place}`}
                  className="max-h-[calc(100vh-12rem)] w-auto max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-ubuntu-orange"
                  title="Previous photo"
                  aria-label="Previous photo"
                >
                  <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-ubuntu-orange"
                  title="Next photo"
                  aria-label="Next photo"
                >
                  <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-ubuntu-orange"
                  title="Close"
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              </div>
              <figcaption className="border-t border-white/10 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-base font-bold text-ubuntu-orange">
                    {active.title}
                  </h2>
                  <span className="text-xs text-ubuntu-warm-grey">
                    {openIndex + 1} / {travelPhotos.length}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ubuntu-warm-grey">
                  <i
                    className="fa-solid fa-location-dot text-ubuntu-orange"
                    aria-hidden="true"
                  />
                  {active.place}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {active.caption}
                </p>
              </figcaption>
            </figure>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default Travel;
