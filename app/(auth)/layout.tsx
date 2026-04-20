import { LogoStacked } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted/40">
      <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
        <LogoStacked className="mb-8" />
        {children}
      </div>
    </div>
  );
}
