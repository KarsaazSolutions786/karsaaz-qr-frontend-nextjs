import { constructMetadata } from "@/lib/metadata";
import { ReactNode } from "react";
import InstallLayoutClient from "./InstallLayoutClient";

export const metadata = constructMetadata({
  title: "Installation Wizard",
  description: "Setup and configure your Karsaaz QR platform.",
  noIndex: true,
});

export default function InstallLayout({ children }: { children: ReactNode }) {
  return <InstallLayoutClient>{children}</InstallLayoutClient>;
}
