import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { ArticleTable } from "@/compenents/admin/ArticleTable";

/** Article management list. */
export const Route = createFileRoute("/admin/bai-viet/")({
  component: AdminArticles,
});

function AdminArticles() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-black text-white mr-auto">
          Quản lý bài viết
        </h1>
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
      <ArticleTable />
    </div>
  );
}
