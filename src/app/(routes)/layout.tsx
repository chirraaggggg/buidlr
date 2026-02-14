import type { ReactNode } from "react";

export default function AppLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <main className="w-full h-auto">{children}</main>;
}
