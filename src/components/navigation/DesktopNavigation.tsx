import Link from "next/link";
import { mainNavigation } from "@/config/navigation";
import { RollText } from "@/components/ui/RollText";

export function DesktopNavigation({ className }: { className?: string }) {
  return (
    <nav aria-label="Main" className={className}>
      <ul className="flex items-center gap-6">
        {mainNavigation.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="group/roll relative font-medium uppercase">
              <RollText>{item.label}</RollText>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
