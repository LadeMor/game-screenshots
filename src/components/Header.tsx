import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ImageIcon className="size-5" aria-hidden="true" />
          </span>
          <span>GameShots</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav aria-label="Основная навигация">
            <Link
              href="/#screenshots"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ScreenShots
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
