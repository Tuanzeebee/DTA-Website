import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { RefreshCw, Wrench } from "lucide-react";
import { useLang, useSession } from "@/hooks/useLang";
import { PageShell } from "@/compenents/layout/PageShell";
import { Nav } from "@/compenents/layout/Nav";
import {
  PortalMenuBar,
  PortalBanner,
  PortalBottomMenu,
} from "@/compenents/news/PortalChrome";
import { Footer } from "@/compenents/layout/Footer";
import { authService } from "@/lib/auth/service";
import { useTopics } from "@/hooks/useNewsApi";
import type { Lang } from "@/types";

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
  const role = authService.getRole();
  // Mọi trang tin cần danh sách chủ đề: không tải được = máy chủ tin đang ngừng.
  const { isError: offline, refetch, isFetching } = useTopics();

  return (
    <PageShell>
      <Nav lang={lang} toggleLang={toggleLang} isLoggedIn={isLoggedIn} role={role} />

      {/* pt-16 clears the fixed shared header; the menu bar then sticks to
          top-16 so both bars stack while scrolling. */}
      <div className="pt-16">
        <PortalMenuBar />
        <PortalBanner />

        <main className="max-w-7xl mx-auto px-4 md:px-6 mt-10 pb-4 min-h-[50vh]">
          {offline ? (
            <ServiceUnavailable lang={lang} onRetry={() => refetch()} retrying={isFetching} />
          ) : (
            <Outlet />
          )}
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

/** Thay cho trang trắng khi backend tin tức không phản hồi. */
function ServiceUnavailable({
  lang,
  onRetry,
  retrying,
}: {
  lang: Lang;
  onRetry: () => void;
  retrying: boolean;
}) {
  const vn = lang === "vn";
  return (
    <section
      role="status"
      className="max-w-xl mx-auto my-10 md:my-16 text-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 md:px-10"
    >
      <span className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center">
        <Wrench className="w-6 h-6 text-accent" />
      </span>
      <h1 className="display text-xl md:text-2xl font-black text-white leading-snug">
        {vn ? "Trang tin đang được bảo trì" : "News is temporarily unavailable"}
      </h1>
      <p className="mt-3 text-sm text-white/65 leading-relaxed">
        {vn
          ? "Chúng tôi đang nâng cấp hệ thống để phục vụ bạn tốt hơn. Vui lòng quay lại sau ít phút — xin cảm ơn sự kiên nhẫn của bạn."
          : "We're upgrading our system to serve you better. Please check back in a few minutes — thank you for your patience."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={onRetry}
          disabled={retrying}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-xl font-bold text-sm text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} />
          {vn ? "Thử lại" : "Try again"}
        </button>
        <Link
          to="/"
          className="inline-flex items-center px-5 h-11 rounded-xl border border-white/15 text-sm font-bold text-white/80 hover:text-white hover:border-white/30 transition-colors"
        >
          {vn ? "Về trang chủ DTA" : "Back to DTA home"}
        </Link>
      </div>
      <p className="mt-6 text-xs text-white/40">
        {vn ? "Cần hỗ trợ gấp? Liên hệ Văn phòng Hiệp hội: " : "Need urgent help? Contact the Association office: "}
        <a href="/#location" className="text-accent hover:underline">
          {vn ? "thông tin liên hệ" : "contact details"}
        </a>
      </p>
    </section>
  );
}
