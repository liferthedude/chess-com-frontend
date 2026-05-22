import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: "lifer-on-duty",
  project: "chess-com-frontend",
  silent: true,
  disableLogger: true,
});
