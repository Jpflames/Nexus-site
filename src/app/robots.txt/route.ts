import { NextResponse } from "next/server";

export function GET() {
  const content = `User-agent: *
Disallow:

Sitemap: ${process.env.NEXT_PUBLIC_APP_URL || "https://nexusmedia.co"}/sitemap.xml
`;
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
