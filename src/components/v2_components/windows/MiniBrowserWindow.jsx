import { useState } from "react";

// igu=1 is Google's own flag for allowing its search homepage to render inside an iframe.
const HOME_URL = "https://www.google.com/webhp?igu=1";

function normalizeUrl(input) {
  const value = input.trim();
  if (!value) return HOME_URL;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(value)) return `https://${value}`;
  return `https://www.google.com/search?igu=1&q=${encodeURIComponent(value)}`;
}

function MiniBrowserWindow() {
  const [history, setHistory] = useState([HOME_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [addressBar, setAddressBar] = useState(HOME_URL);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);

  const currentUrl = history[historyIndex];

  const goTo = (rawInput) => {
    const url = normalizeUrl(rawInput);
    const nextHistory = [...history.slice(0, historyIndex + 1), url];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setAddressBar(url);
    setLoadFailed(false);
  };

  const goBack = () => {
    if (historyIndex === 0) return;
    setHistoryIndex(historyIndex - 1);
    setAddressBar(history[historyIndex - 1]);
    setLoadFailed(false);
  };

  const goForward = () => {
    if (historyIndex >= history.length - 1) return;
    setHistoryIndex(historyIndex + 1);
    setAddressBar(history[historyIndex + 1]);
    setLoadFailed(false);
  };

  const reload = () => {
    setLoadFailed(false);
    setReloadKey((key) => key + 1);
  };

  const goHome = () => goTo(HOME_URL);

  const handleSubmit = (e) => {
    e.preventDefault();
    goTo(addressBar);
  };

  return (
    <div className="w-full h-full flex flex-col bg-ubuntu-aubergine-dark text-white font-ubuntu">
      <div className="flex items-center gap-2 px-2 py-1.5 bg-black/30 border-b border-white/10">
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 disabled:opacity-30"
          title="Back"
        >
          <i className="fa-solid fa-arrow-left text-xs" />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 disabled:opacity-30"
          title="Forward"
        >
          <i className="fa-solid fa-arrow-right text-xs" />
        </button>
        <button
          onClick={reload}
          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10"
          title="Reload"
        >
          <i className="fa-solid fa-rotate-right text-xs" />
        </button>
        <button
          onClick={goHome}
          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10"
          title="Home"
        >
          <i className="fa-solid fa-house text-xs" />
        </button>
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <input
            value={addressBar}
            onChange={(e) => setAddressBar(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-full px-3 py-1 text-xs text-white outline-none focus:border-ubuntu-orange"
            placeholder="Search Google or type a URL"
          />
        </form>
        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer"
          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 shrink-0"
          title="Open in new tab"
        >
          <i className="fa-solid fa-up-right-from-square text-xs" />
        </a>
      </div>

      <div className="relative flex-1 bg-white">
        <iframe
          key={`${currentUrl}-${reloadKey}`}
          src={currentUrl}
          title="Mini Browser"
          className="w-full h-full border-0"
          onError={() => setLoadFailed(true)}
        />
        {loadFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-ubuntu-aubergine-dark text-slate-200 text-sm p-4 text-center">
            This site refused to load inside the mini browser. Try &quot;Open in
            new tab&quot; instead.
          </div>
        )}
      </div>

      <div className="px-2 py-1 text-[10px] text-slate-400 bg-black/30 border-t border-white/10 truncate">
        Some sites block embedding for security reasons (X-Frame-Options); use
        the open-in-new-tab button if a page won&apos;t display.
      </div>
    </div>
  );
}

export default MiniBrowserWindow;
