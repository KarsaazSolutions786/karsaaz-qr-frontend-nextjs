import { constructMetadata } from "@/lib/metadata";
import { ReactNode } from "react";

export const metadata = constructMetadata({
  title: "Payment Failed",
  description: "There was an issue processing your payment.",
});

export default function PaymentInvalidLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
