import { coursePaths } from "@/lib/nea";

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nexusmedia.co";

  const staticRoutes = ["/", "/courses", "/dashboard", "/checkout", "/success", "/cancel", "/profile"];

  const dynamicRoutes = coursePaths.map((phase) => `/courses/${phase.slug}`);

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
    })),
    ...dynamicRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
    })),
  ];
}
