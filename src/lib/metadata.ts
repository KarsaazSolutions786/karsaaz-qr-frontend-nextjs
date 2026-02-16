import { Metadata } from "next";

export const siteConfig = {
  name: "Karsaaz QR",
  description: "Advanced QR Code Generation & Management Platform for Businesses",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://dashboard.karsaazqr.com",
  ogImage: "https://dashboard.karsaazqr.com/og.jpg",
  links: {
    twitter: "https://twitter.com/karsaazqr",
    github: "https://github.com/karsaazqr",
  },
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@karsaazqr",
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}