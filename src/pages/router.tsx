// eslint-disable-next-line no-restricted-imports
import { createBrowserRouter, ScrollRestoration } from "react-router-dom";

import { Layout } from "shared/Layout";

import { homePageLoader } from "./Home/loader";

export const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollRestoration getKey={(location) => location.pathname} />
        <Layout />
      </>
    ),
    children: [
      {
        path: "/",
        loader: homePageLoader,
        lazy: () => import("./Home"),
      },
    ],
  },
]);
