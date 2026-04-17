import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import DevPage from "../pages/dev/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dev",
    element: <DevPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
