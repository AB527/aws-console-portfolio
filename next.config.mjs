const dev = process.env.NODE_ENV === "development"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Route files named *.dev.tsx (the data studio) only exist while running `next dev`
  pageExtensions: dev ? ["dev.tsx", "dev.ts", "tsx", "ts"] : ["tsx", "ts"],
  // The build must not type-check the dev server's generated route types, which include those routes
  typescript: { tsconfigPath: dev ? "tsconfig.json" : "tsconfig.build.json" },
  // The studio uploads document files through a Server Action
  ...(dev ? { experimental: { serverActions: { bodySizeLimit: "50mb" } } } : {}),
};

export default nextConfig;
