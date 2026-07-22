import { useState } from "react";
import { Building, Phone, Mail, MapPin } from "lucide-react";
import { SectionBackground, seamTint } from "@/compenents/SectionBackground";
import { ScrollReveal } from "@/compenents/ScrollReveal";
import { SectionHeader } from "@/compenents/SectionHeader";
import type { Lang } from "@/types";

export function MapAddressSection({ lang }: { lang: Lang }) {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section
      id="location"
      className="py-20 md:py-28 px-5 md:px-6 relative overflow-hidden"
    >
      {/* No "horizon" layer here: its cyan glow anchors at this section's
          bottom edge — exactly where the gold handoff band lives — and the
          two hues muddied each other. With dots only, the bottom is clean
          and the gold wave crosses into FAQ unpolluted. */}
      <SectionBackground
        variant="dots"
        tintTop={seamTint.cyan}
        tintBottom={seamTint.gold}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          title={
            <>
              {lang === "vn" ? "Trụ sở & Văn phòng" : "Headquarters & Office"}
              <br />
              <span className="text-gradient-cyan">
                {lang === "vn" ? "Kết nối trực tiếp" : "Visit our Digital Hub"}
              </span>
            </>
          }
          subtitle={
            lang === "vn"
              ? "Tọa lạc tại vị trí chiến lược của Trung tâm CNTT & Phần mềm TP. Đà Nẵng, nơi quy tụ hàng loạt doanh nghiệp công nghệ số hàng đầu."
              : "Located in the heart of Danang's premier Software & Technology hub, home to elite digital enterprises."
          }
        />

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Address Details Panel (5 cols) */}
          <ScrollReveal direction="right" className="lg:col-span-5 flex">
            <div className="w-full flex flex-col justify-between card-surface rounded-3xl p-8 md:p-10 relative overflow-hidden group">
              {/* Background glowing effects, adhering to subtle neutral styling */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-700" />

              <div className="space-y-8 relative z-10">
                <div>
                  <span className="text-[10px] font-black uppercase text-accent tracking-widest block mb-2">
                    {lang === "vn" ? "ĐỊA CHỈ TRỤ SỞ" : "HEADQUARTERS ADDRESS"}
                  </span>
                  <h4 className="text-xl md:text-2xl font-black text-white leading-snug mb-4">
                    {lang === "vn"
                      ? "Hiệp hội Công nghệ số Đà Nẵng (DTA)"
                      : "Danang Digital Technology Association"}
                  </h4>

                  {/* Physical Address details requested by user */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        <p className="font-bold text-white text-base">
                          Tầng 4 tòa nhà Công Viên Phần Mềm Đà Nẵng
                        </p>
                        <p className="text-sm text-white/90 font-medium">
                          02 Quang Trung
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Quận Hải Châu, TP Đà Nẵng
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Details and regulatory bodies info */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-white/70">
                        {lang === "vn" ? "Hotline hỗ trợ" : "Support Hotline"}
                      </p>
                      <p className="text-sm font-semibold text-white/90">
                        +84 (0236) 3888-299
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-white/70">Email</p>
                      <a
                        href="mailto:office@dtadanang.org.vn"
                        className="text-sm font-semibold text-white/90 hover:text-accent transition-colors"
                      >
                        office@dtadanang.org.vn
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Directions Action Button */}
              <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                <a
                  href="https://maps.google.com/?q=Công+viên+phần+mềm+Đà+Nẵng,+2+Quang+Trung,+Hải+Châu"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-3.5 rounded-xl font-bold text-xs text-primary-foreground hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  <span>
                    {lang === "vn"
                      ? "Chỉ đường trên Google Maps"
                      : "Get Directions on Google Maps"}
                  </span>
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Interactive Google Map Panel (7 cols) */}
          <ScrollReveal
            direction="left"
            delay={0.15}
            className="lg:col-span-7 flex"
          >
            <div className="w-full glass rounded-[2.5rem] border border-white/10 overflow-hidden relative min-h-[350px] lg:min-h-[450px]">
              {/* Loading skeleton wrapper */}
              {!mapLoaded && (
                <div className="absolute inset-0 bg-white/[0.02] flex flex-col items-center justify-center gap-3 z-10 backdrop-blur-sm animate-pulse">
                  <div className="w-10 h-10 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                  <span className="text-xs text-muted-foreground font-semibold font-mono tracking-wider">
                    {lang === "vn"
                      ? "ĐANG TẢI BẢN ĐỒ..."
                      : "LOADING MAP DATA..."}
                  </span>
                </div>
              )}

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8024213797665!2d108.2198006!3d16.0757422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314218307bf26f95%3A0xe54dfaa94b4e7235!2zQ8O0bmcgdmnDqm4gcGjhuqduIG3hu4FtIMSQw6AgTuG6tW5n!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter:
                    "invert(90%) hue-rotate(180deg) grayscale(10%) contrast(110%)",
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
                onLoad={() => setMapLoaded(true)}
                className="w-full h-full min-h-[350px] lg:min-h-[450px] select-none"
                title="DTA Danang Office Location Map"
              />

              {/* "HERE" ping. The embed URL centres the venue in the frame, so
                  an overlay at the exact centre sits on the venue without any
                  Maps API. pointer-events-none keeps the map fully
                  interactive; if the user pans away, the ping simply floats
                  until the map springs back. Hidden until the map loads. */}
              {mapLoaded && (
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center"
                >
                  {/* Label pill */}
                  <div className="mb-2 px-3 py-1.5 rounded-full glass border border-accent/30 shadow-[0_0_20px_oklch(0.85_0.16_90_/_0.25)] whitespace-nowrap">
                    <span className="text-[10px] font-black uppercase tracking-wider text-accent">
                      {lang === "vn" ? "Trụ sở DTA tại đây" : "DTA HQ is here"}
                    </span>
                  </div>
                  {/* Radar rings + core dot */}
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-cyan-400/40 animate-ping motion-reduce:animate-none" />
                    <span
                      className="absolute inline-flex w-2/3 h-2/3 rounded-full bg-cyan-400/30 animate-ping motion-reduce:animate-none"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <span className="relative w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-white shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
