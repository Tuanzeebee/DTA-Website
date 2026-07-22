import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useLang, useSession } from "@/hooks/useLang";
import { PageShell } from "@/compenents/layout/PageShell";
import { Nav } from "@/compenents/layout/Nav";
import {
  PortalMenuBar,
  PortalBanner,
  PortalFooter,
} from "@/compenents/news/PortalChrome";
import { BoardSection, MemberLogoGrid } from "@/compenents/news/PortalBlocks";

/**
 * Layout for the news portal (/news/*), a "Trang thông tin điện tử tổng hợp"
 * under licence 447/GP-STTTT.
 *
 * The portal shares the site-wide header (Nav) with the landing page; its own
 * topic menu docks directly under that header as a sticky bar. Below:
 * banner zone -> content -> member logo strip (shuffled, all linked) ->
 * BCH/Ban Kiểm tra -> portal footer (licence, editorial board, repeated menu).
 */
export const Route = createFileRoute("/news")({
  component: NewsPortalLayout,
});

function NewsPortalLayout() {
  const { lang, toggleLang } = useLang();
  const { isLoggedIn } = useSession(lang);

  return (
    <PageShell>
      <Nav lang={lang} toggleLang={toggleLang} isLoggedIn={isLoggedIn} />

      {/* pt-16 clears the fixed shared header; the menu bar then sticks to
          top-16 so both bars stack while scrolling. */}
      <div className="pt-16">
        <PortalMenuBar />
        <PortalBanner />

        <main className="max-w-7xl mx-auto px-4 md:px-6 mt-10 min-h-[50vh]">
          <Outlet />
        </main>

        {/* Bottom member logo strip: random order each load so every member
            gets equal exposure; every logo links to the member's site. */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20">
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-6">
            Hội viên DTA
          </h3>
          <MemberLogoGrid />
        </section>

        <BoardSection />
        <PortalFooter />
      </div>
    </PageShell>
  );
}
