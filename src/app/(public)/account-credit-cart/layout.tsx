import { constructMetadata } from "@/lib/metadata";
import { ReactNode } from "react";

export const metadata = constructMetadata({
  title: "Shopping Cart",
  description: "Review your items and proceed to checkout.",
});

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
