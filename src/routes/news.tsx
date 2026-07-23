import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useLang, useSession } from "@/hooks/useLang";
import { PageShell } from "@/compenents/layout/PageShell";
import { Nav } from "@/compenents/layout/Nav";
import {
  PortalMenuBar,
  PortalBanner,
  PortalBottomMenu,
} from "@/compenents/news/PortalChrome";
import { Footer } from "@/compenents/layout/Footer";

/**
 * Layout for the news portal (/news/*), a "Trang thông tin điện tử tổng hợp"
 * under licence 447/GP-STTTT.
 *
 * The portal shares the site-wide header (Nav) with the landing page; its own
 * topic menu docks directly under that header as a sticky bar. Below:
 * banner zone -> content -> portal footer (licence, editorial board, repeated
 * menu). The bottom member-logo strip and the BCH/Ban Kiểm tra block were
 * removed on request; member logos still appear in the sidebar (column 3),
 * and BoardSection remains available in PortalBlocks if it is wanted back.
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

        <main className="max-w-7xl mx-auto px-4 md:px-6 mt-10 pb-4 min-h-[50vh]">
          <Outlet />
        </main>

        {/* Full topic+category menu repeated at the bottom of every portal
            page (brief requirement, laodong.vn pattern). */}
        <PortalBottomMenu />

        <Footer lang={lang} />

        {/* Licence strip: the shared landing Footer replaces the portal
            footer, but a news site operating under giấy phép 447/GP-STTTT is
            required to display its licence — kept as one compact line at the
            very bottom, under the shared footer. */}
        <div className="border-t border-white/10 bg-black/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 text-[10px] font-light leading-relaxed text-white/45 text-center space-y-0.5">
            {lang === "vn" ? (
              <>
                <p>
                  DTA News — Trang thông tin điện tử tổng hợp của Hiệp hội Công
                  nghệ số Đà Nẵng. Giấy phép số{" "}
                  <span className="font-normal text-white/70">
                    447/GP-STTTT
                  </span>{" "}
                  ngày 29/05/2019 do Sở Thông tin và Truyền thông TP. Đà Nẵng
                  cấp.
                </p>
                <p>
                  Chịu trách nhiệm xuất bản: Ông Phạm Kim Sơn – Chủ tịch Hiệp
                  hội · Thư ký tòa soạn: Nhà báo Trần Ngọc · © DTA — Ghi rõ
                  nguồn "dta.org.vn" khi phát hành lại thông tin từ website này.
                </p>
              </>
            ) : (
              <>
                <p>
                  DTA News — the aggregated e-information page of the Danang
                  Digital Technology Association. Licence No.{" "}
                  <span className="font-normal text-white/70">
                    447/GP-STTTT
                  </span>{" "}
                  dated 29/05/2019, issued by the Danang Department of
                  Information and Communications.
                </p>
                <p>
                  Publisher-in-charge: Mr. Pham Kim Son – Association Chairman ·
                  Managing editor: Journalist Tran Ngoc · © DTA — cite
                  "dta.org.vn" when republishing content from this website.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
