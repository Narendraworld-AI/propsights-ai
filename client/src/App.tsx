import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Analysis from "@/pages/Analysis";
import BuyersPage from "@/pages/Buyers";
import SellersPage from "@/pages/Sellers";
import ComingSoon from "@/pages/ComingSoon";
import HistoricalArchive from "@/pages/HistoricalArchive";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/analysis/:location" component={Analysis} />
      <Route path="/buyers" component={BuyersPage} />
      <Route path="/sellers" component={SellersPage} />
      <Route path="/archive" component={HistoricalArchive} />
      <Route path="/documentation" component={HistoricalArchive} />
      <Route path="/coming-soon" component={ComingSoon} />
      <Route component={NotFound} />
    </Switch>
  );
}
function App() {
  // Global handler to open external links, government portals, and documents in the default mobile browser
  useEffect(() => {
    const handleGlobalLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const isExternal =
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        anchor.getAttribute("target") === "_blank" ||
        href.endsWith(".pdf") ||
        href.endsWith(".doc") ||
        href.endsWith(".docx");

      // If it's an external link or doc not belonging to internal client router
      if (isExternal && (!href.startsWith("/") && !href.startsWith("#") && !href.includes(window.location.host))) {
        e.preventDefault();
        e.stopPropagation();
        window.open(href, "_system", "location=yes");
      }
    };

    document.addEventListener("click", handleGlobalLinkClick, true);
    return () => document.removeEventListener("click", handleGlobalLinkClick, true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
