import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/api/report/pdf/[id]": [
      "./node_modules/pdfkit/js/data/**/*",
      "./node_modules/pdfkit/js/**/*.js",
    ],
  },
};

export default nextConfig;
