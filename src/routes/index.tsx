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
      <TopicsSection lang={lang} />
      <ServicesSection lang={lang} />
      <TimelineSection lang={lang} />
      <MembersDirectorySection lang={lang} />
      <MapAddressSection lang={lang} />
      <FAQSection lang={lang} />
      <Footer lang={lang} />

      <AnimatePresence>
        {showCharter && (
          <CharterModal lang={lang} onClose={() => setShowCharter(false)} />
        )}
      </AnimatePresence>
    </PageShell>
  );
}
