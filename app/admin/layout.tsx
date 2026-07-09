import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Panel de Administracion -- Colombia Sexys",
  description: "Panel de gestion de modelos para Colombia Sexys.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster theme="dark" position="bottom-right" richColors />
    </>
  );
}
