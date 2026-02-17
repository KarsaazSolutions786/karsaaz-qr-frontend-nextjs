import { constructMetadata } from "@/lib/metadata";
import { ReactNode } from "react";

export const metadata = constructMetadata({
  title: "Thank You",
  description: "Thank you for your purchase on Karsaaz QR.",
});

export default function ThankYouLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
