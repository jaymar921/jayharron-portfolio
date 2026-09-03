// Desktop chrome measurements, shared so the layout maths cannot drift from
// what is actually rendered.
//
// TopBar renders itself at exactly DESKTOP_TOPBAR_HEIGHT, and index.css pins
// .window-titlebar to WINDOW_TITLEBAR_HEIGHT. Home.jsx uses both to centre
// windows in the space the desktop really leaves free, and DragWindow uses
// them so a maximized window fills the screen without its bottom edge falling
// past it.
export const DESKTOP_TOPBAR_HEIGHT = 28;
export const WINDOW_TITLEBAR_HEIGHT = 34;
// DragWindow draws a 1px border all the way round, so a window's outer frame
// is this much taller and wider than the content area it is given.
export const WINDOW_BORDER_WIDTH = 1;
export const WINDOW_CHROME_HEIGHT =
  WINDOW_TITLEBAR_HEIGHT + WINDOW_BORDER_WIDTH * 2;
export const WINDOW_CHROME_WIDTH = WINDOW_BORDER_WIDTH * 2;
