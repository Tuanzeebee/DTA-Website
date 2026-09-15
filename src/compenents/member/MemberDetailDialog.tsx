import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building,
  Phone,
  User,
  Globe,
  Newspaper,
  ArrowUpRight,
  X,
} from "lucide-react";
import type { DtaMember } from "@/data";
import type { Lang } from "@/types";
import { MEMBER_OWNERSHIP_LABEL } from "@/data";
import { fetchArticles } from "@/lib/api";
import type { ArticleListItem } from "@/lib/newsApiTypes";

/**
 * Hồ sơ công khai của một hội viên: đủ 7 trường Danh bạ
 * (tên Việt/Anh, loại hình, lãnh đạo, điện thoại, lĩnh vực, thế mạnh)
 * + bài viết đã đăng của hội viên đó (khớp tên tác giả).
 * Card danh bạ giữ gọn; bấm vào mới mở dialog này.
 */
export function MemberDetailDialog({
  member,
  lang,
  onClose,
}: {
  member: DtaMember | null;
  lang: Lang;
  onClose: () => void;
}) {
  const [posts, setPosts] = useState<ArticleListItem[] | null>(null);

  useEffect(() => {
    if (!member) {
      setPosts(null);
      return;
    }
    let alive = true;
    setPosts(null);
    fetchArticles({ pageSize: 100 })
      .then((res) => {
        if (!alive) return;
        const mine = res.items.filter((a) => a.author === member.name);
        // Bài nền (tag hoi-vien / chuyên mục Hội Viên) ghim lên đầu.
        mine.sort((a, b) => {
          const aBase =
            a.tags.includes("hoi-vien") ||
            a.categoryName.toLowerCase().includes("hội viên")
              ? 0
              : 1;
          const bBase =
            b.tags.includes("hoi-vien") ||
            b.categoryName.toLowerCase().includes("hội viên")
              ? 0
              : 1;
          return aBase - bBase;
        });
        setPosts(mine);
      })
      .catch(() => {
        if (alive) setPosts([]);
      });
    return () => {
      alive = false;
    };
  }, [member]);

  useEffect(() => {
    if (!member) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [member, onClose]);

  if (!member) return null;

  const rows: { icon: typeof User; label: string; value: string }[] = [
    {
      icon: User,
      label: lang === "vn" ? "Lãnh đạo" : "Leader",
      value: member.leader ?? "—",
    },
    {
      icon: Phone,
      label: lang === "vn" ? "Điện thoại" : "Phone",
      value: member.phone ?? "—",
    },
    {
      icon: Building,
      label: lang === "vn" ? "Lĩnh vực hoạt động" : "Field",
      value: member.domain || "—",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[85dvh] overflow-y-auto glass rounded-3xl border border-white/15 p-6 md:p-7 space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/90 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {member.logoUrl ? (
              <img
                src={member.logoUrl}
                alt={member.name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain p-1"
              />
            ) : (
              <Building className="w-7 h-7 text-slate-500" />
            )}
          </div>
          <div className="min-w-0 mr-auto">
            <h3 className="text-base font-black text-white leading-tight">
              {member.name}
            </h3>
            {member.nameEn && (
              <p className="text-xs text-white/50 mt-0.5">{member.nameEn}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">
                {member.type === "organization"
                  ? lang === "vn"
                    ? "Tổ chức"
                    : "Corp"
                  : member.type === "individual"
                    ? lang === "vn"
                      ? "Cá nhân"
                      : "Individual"
                    : lang === "vn"
                      ? "Cố vấn"
                      : "Advisor"}
              </span>
              {member.ownership && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                  {MEMBER_OWNERSHIP_LABEL[member.ownership]}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={lang === "vn" ? "Đóng" : "Close"}
            className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <dl className="space-y-2.5">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-2.5"
            >
              <r.icon className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
                  {r.label}
                </dt>
                <dd className="text-[13px] text-white/85 font-medium">
                  {r.value}
                </dd>
              </div>
            </div>
          ))}
          {member.strengths && (
            <div className="rounded-xl border border-accent/20 bg-accent/[0.05] px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-accent font-bold mb-1">
                {lang === "vn" ? "Thế mạnh" : "Strengths"}
              </p>
              <p className="text-[13px] text-white/85 leading-relaxed">
                {member.strengths}
              </p>
            </div>
          )}
        </dl>

        {member.website && (
          <a
            href={member.website}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-cyan-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {member.website.replace(/^https?:\/\//, "")}
            <ArrowUpRight className="w-3 h-3" />
          </a>
        )}

        <div>
          <h4 className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.18em] flex items-center gap-2 mb-3">
            <Newspaper className="w-3.5 h-3.5" />
            {lang === "vn" ? "Bài viết của hội viên" : "Member posts"}
          </h4>
          {posts === null ? (
            <p className="text-xs text-white/40">
              {lang === "vn" ? "Đang tải…" : "Loading…"}
            </p>
          ) : posts.length === 0 ? (
            <p className="text-xs text-white/40 rounded-xl border border-dashed border-white/10 p-4 text-center">
              {lang === "vn"
                ? "Hội viên chưa có bài viết nào được đăng."
                : "No published posts yet."}
            </p>
          ) : (
            <ul className="space-y-2">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/news/article/$slug"
                    params={{ slug: p.slug }}
                    className="block rounded-xl border border-white/8 bg-white/[0.02] hover:border-accent/40 px-4 py-3 transition-colors"
                  >
                    <span className="text-[13px] font-bold text-white/90 leading-snug block">
                      {p.title}
                    </span>
                    <span className="text-[11px] text-white/40 font-mono mt-1 block">
                      {p.categoryName}
                      {p.date ? ` · ${p.date}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
