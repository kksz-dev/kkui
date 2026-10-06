import { Navigate } from "react-router-dom";

/**
 * The motion showcase moved into the component catalog at /components/motion.
 * Kept as a redirect so existing links (site header, bookmarks) still land somewhere.
 */
export default function MotionRedirect() {
  return <Navigate to="/components/motion" replace />;
}
