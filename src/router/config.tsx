import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import DevPage from "../pages/dev/page";
import MonthPage from "../pages/month/page";

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
    path: "/:month",
    element: <MonthPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
