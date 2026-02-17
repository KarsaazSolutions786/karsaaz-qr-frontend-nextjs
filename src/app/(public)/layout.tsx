import { constructMetadata } from "@/lib/metadata";
import { ReactNode } from "react";

export const metadata = constructMetadata({
  title: "Public Page",
  description: "Access Karsaaz QR public features and information.",
});

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
