import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, List, Calendar, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/programs", label: "Programs", icon: List },
  { href: "/timeline", label: "Timeline", icon: Calendar },
];

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate rounded-md px-2 py-1">
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl hidden sm:inline">Erasmus Tracker</span>
              <span className="font-bold text-xl sm:hidden">EM Tracker</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = location === href || (href !== "/" && location.startsWith(href));
              return (
                <Link key={href} href={href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="gap-2"
                    data-testid={`nav-${label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = location === href || (href !== "/" && location.startsWith(href));
              return (
                <Link key={href} href={href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`nav-mobile-${label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
