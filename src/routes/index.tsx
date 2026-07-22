import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useLang, useSession } from "@/hooks/useLang";
import { PageShell } from "@/compenents/layout/PageShell";
import { Nav } from "@/compenents/layout/Nav";
import { Footer } from "@/compenents/layout/Footer";
import { CharterModal } from "@/compenents/CharterModal";
import { Hero } from "@/compenents/sections/Hero";
import { AboutSection } from "@/compenents/sections/AboutSection";
import { TopicsSection } from "@/compenents/sections/TopicsSection";
import { ServicesSection } from "@/compenents/sections/ServicesSection";
import { TimelineSection } from "@/compenents/sections/TimelineSection";
import { MembersDirectorySection } from "@/compenents/sections/MembersDirectorySection";
import { MapAddressSection } from "@/compenents/sections/MapAddressSection";
import { FAQSection } from "@/compenents/sections/FAQSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { lang, toggleLang } = useLang();
  const { isLoggedIn } = useSession(lang);
  const [showCharter, setShowCharter] = useState(false);

  return (
    <PageShell>
      <Nav lang={lang} toggleLang={toggleLang} isLoggedIn={isLoggedIn} />
      <Hero lang={lang} />
      <AboutSection lang={lang} setShowCharter={setShowCharter} />

      {/* From the tech pillars to the footer the page sits one step brighter:
          a translucent blue lift over the dark base (0.10 -> ~0.14 perceived),
          fading in over the first 12rem so there is no line where it starts.
          Same hue family, so the theme lock holds — this is a lighting change,
          not a palette change. */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[oklch(0.28_0.05_262_/_0.4)] [mask-image:linear-gradient(to_bottom,transparent,black_12rem)]"
        />
        <TopicsSection lang={lang} />
        <ServicesSection lang={lang} />
        <TimelineSection lang={lang} />
        <MembersDirectorySection lang={lang} />
        <MapAddressSection lang={lang} />
        <FAQSection lang={lang} />
        <Footer lang={lang} />
      </div>

      <AnimatePresence>
        {showCharter && (
          <CharterModal lang={lang} onClose={() => setShowCharter(false)} />
        )}
      </AnimatePresence>
    </PageShell>
  );
}
