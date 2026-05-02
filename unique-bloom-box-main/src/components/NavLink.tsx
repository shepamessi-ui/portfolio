import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ href, children, className }: NavLinkProps) => {
  // بما أننا نستخدم صفحة واحدة، سنحول الروابط لتعمل بنظام الـ Anchor Tags
  return (
    <a
      href={href.startsWith("/") ? `#${href.substring(1)}` : href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary/80 text-foreground/60",
        className
      )}
      onClick={(e) => {
        // إذا كان الرابط يبدأ بـ #، سنقوم بعمل تمرير ناعم (Smooth Scroll)
        if (href.startsWith("#") || (href.startsWith("/") && href.length > 1)) {
          e.preventDefault();
          const id = href.startsWith("/") ? href.substring(1) : href.substring(1);
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }}
    >
      {children}
    </a>
  );
};

export default NavLink;