/**
 * The analytics surface the pages import from. Keeping the individual modules
 * behind one entry point means a page never has to know whether the visitor id
 * lives in localStorage or how an event is posted.
 */

export { currentPage, trackClick, trackView, withTracking } from "./track.js";
export { usePageView } from "./usePageView.js";
export { forgetVisitor, getSessionId, getVisitorId } from "./visitor.js";
export { forgetOwnerDevice, isOwnerDevice, markOwnerDevice } from "./owner.js";
export {
  CLICK_ACTIONS,
  PAGES,
  PAGE_BY_PATH,
  PAGE_LABELS,
  PAGE_SLUGS,
  labelFor,
} from "../../../shared/tracking.js";
