import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  FileText,
  Eye,
  FileClock,
  Users,
  PlusCircle,
  RotateCcw,
  Pencil,
} from "lucide-react";
import { mainTopics, categoryBySlug } from "@/newsData";
import {
  useAdminArticles,
  resetToMockData,
} from "@/compenents/admin/adminStore";
import { useAdminMembers } from "@/compenents/admin/memberStore";

/** Dashboard overview: headline stats, per-topic counts, recent articles. */
export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const articles = useAdminArticles();
  const members = useAdminMembers();

  const stats = useMemo(() => {
    const published = articles.filter((a) => a.status !== "draft");
    return {
      total: articles.length,
      drafts: articles.length - published.length,
      views: published.reduce((s, a) => s + a.views, 0),
      members: members.length,
      byTopic: mainTopics.map((t) => ({
        topic: t,
        count: articles.filter((a) => a.topic === t.slug).length,
      })),
      recent: [...articles].slice(-5).reverse(),
    };
  }, [articles, members]);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-black text-white mr-auto">Tổng quan</h1>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Xóa toàn bộ thay đổi trên trình duyệt này và trở về dữ liệu mẫu?",
              )
            ) {
              resetToMockData();
              toast.success("Đã khôi phục dữ liệu mẫu.");
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[11px] font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Khôi phục dữ liệu mẫu
        </button>
        <Link
          to="/admin/bai-viet/$id"
          params={{ id: "moi" }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-all"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Viết bài mới
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Tổng bài viết" value={stats.total} />
        <StatCard icon={FileClock} label="Bản nháp" value={stats.drafts} />
        <StatCard
          icon={Eye}
          label="Tổng lượt đọc"
          value={stats.views.toLocaleString("vi-VN")}
        />
        <StatCard icon={Users} label="Hội viên" value={stats.members} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Per-topic distribution */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-accent mb-4">
            Bài viết theo chủ đề
          </h2>
          <div className="space-y-3">
            {stats.byTopic.map(({ topic, count }) => (
              <div key={topic.slug}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-white/75 font-medium">
                    {topic.name}
                  </span>
                  <span className="text-white/45 font-mono">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${stats.total ? (count / stats.total) * 100 : 0}%`,
                      background: "var(--gradient-primary)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent articles */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-accent mb-4">
            Bài mới nhất trong kho
          </h2>
          <ul className="divide-y divide-white/5">
            {stats.recent.map((a) => (
              <li key={a.id} className="py-2.5 flex items-center gap-3">
                <img
                  src={a.image}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-12 h-8 rounded-md object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-white/85 truncate">
                    {a.title}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {categoryBySlug(a.topic, a.category)?.name ?? a.category} ·{" "}
                    {a.date}
                    {a.status === "draft" && (
                      <span className="ml-1.5 text-amber-300 font-bold">
                        NHÁP
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  to="/admin/bai-viet/$id"
                  params={{ id: a.id }}
                  className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors shrink-0"
                  title="Sửa bài"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <Icon className="w-4 h-4 text-accent mb-3" />
      <div className="text-2xl font-black text-white leading-none">{value}</div>
      <div className="mt-1.5 text-[10px] uppercase tracking-wider text-white/50 font-bold">
        {label}
      </div>
    </div>
  );
}
