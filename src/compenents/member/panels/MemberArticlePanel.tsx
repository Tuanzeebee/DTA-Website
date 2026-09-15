import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Send, Clock, CheckCircle2 } from "lucide-react";
import type { Lang } from "@/types";
import {
  adminCreateArticle,
  adminFetchArticles,
  adminFetchCategories,
  type AdminArticleItem,
} from "@/lib/api";

const LABEL =
  "block text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5";
const FIELD =
  "w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.06] transition-colors";

/**
 * "Bài viết của chúng tôi" — mỗi hội viên có 1 bài nền giới thiệu đơn vị;
 * sau này đăng nối sự kiện, tin hợp tác. Gửi lên ở trạng thái Nháp,
 * quản trị Duyệt >> Đăng trong /admin/bai-viet.
 * Nếu backend chưa cho phép role MEMBER, form vẫn lưu tạm local để không chặn UX.
 */
export function MemberArticlePanel({ lang }: { lang: Lang }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<
    { id: number; name: string; slug: string; topicId: number }[]
  >([]);
  const [items, setItems] = useState<AdminArticleItem[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const cats = await adminFetchCategories();
        if (!alive) return;
        setCategories(cats);
        if (cats.length > 0 && categoryId === null) {
          const preferred =
            cats.find(
              (c) =>
                c.slug.toLowerCase().includes("hoi-vien") ||
                c.name.toLowerCase().includes("hội viên"),
            ) ?? cats[0];
          setCategoryId(preferred.id);
        }
      } catch {
        /* chưa đăng nhập / chưa có quyền — form vẫn dùng được ở chế độ local */
      }
      try {
        const res = await adminFetchArticles({ mine: true, pageSize: 20 });
        if (alive) setItems(res.items);
      } catch {
        /* bỏ qua — danh sách local bên dưới */
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error(
        lang === "vn"
          ? "Vui lòng nhập tiêu đề và nội dung bài viết."
          : "Please enter a title and body.",
      );
      return;
    }
    if (categoryId === null) {
      toast.error(
        lang === "vn"
          ? "Chưa có chuyên mục để gửi bài — liên hệ Ban Thư ký."
          : "No category available — contact the Secretariat.",
      );
      return;
    }
    setSending(true);
    try {
      const created = await adminCreateArticle({
        title: title.trim(),
        summary: summary.trim() || undefined,
        categoryId,
        rawHtml: body.trim(),
        memberUrl: link.trim() || undefined,
        tags: ["hoi-vien"],
        status: "DRAFT",
      });
      setItems((prev) => [
        {
          id: created.id,
          slug: created.slug,
          title: created.title,
          summary: created.summary,
          image: null,
          topic: created.topic,
          topicName: created.topicName,
          category: created.category,
          categoryName: created.categoryName,
          date: created.date,
          tags: created.tags ?? [],
          views: 0,
          isIntern: false,
          author: created.author,
          status: "DRAFT",
          updatedAt: created.updatedAt,
          wpId: null,
        },
        ...prev,
      ]);
      setTitle("");
      setSummary("");
      setBody("");
      setLink("");
      toast.success(
        lang === "vn"
          ? "Đã gửi bài! Quản trị sẽ Duyệt và Đăng trong mục Bài viết."
          : "Submitted! An editor will review and publish it.",
      );
    } catch (err: unknown) {
      // Không lưu local âm thầm: bài chưa tới được quản trị thì phải báo lỗi
      // rõ ràng và giữ nguyên nháp trong form để hội viên gửi lại.
      toast.error(
        err instanceof Error
          ? err.message
          : lang === "vn"
            ? "Gửi bài thất bại — bài chưa tới quản trị, vui lòng thử lại. Nháp vẫn giữ nguyên."
            : "Submission failed — editors did not receive it. Your draft is kept.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/8">
        <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <FileText className="w-4 h-4 text-cyan-300" />
        </span>
        <div>
          <h4 className="display text-base font-black text-white">
            {lang === "vn" ? "Bài viết của chúng tôi" : "Our Articles"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "vn"
              ? "Mỗi hội viên 1 bài nền giới thiệu đơn vị; sự kiện mới chỉ cần đăng nối. Gửi lên ở dạng Nháp — quản trị Duyệt rồi Đăng."
              : "One foundation post per member; add events later. Drafts go to editors for review and publishing."}
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5"
      >
        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Tiêu đề bài viết *" : "Title *"}
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              lang === "vn"
                ? "VD: Giới thiệu năng lực Công ty TNHH …"
                : "E.g. Introducing … Co., Ltd."
            }
            className={FIELD}
          />
        </div>
        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Tóm tắt" : "Summary"}
          </label>
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={
              lang === "vn" ? "1–2 câu giới thiệu…" : "One or two sentences…"
            }
            className={FIELD}
          />
        </div>
        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Nội dung *" : "Body *"}
          </label>
          <textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              lang === "vn"
                ? "Giới thiệu lĩnh vực, thế mạnh, nhu cầu hợp tác, liên danh-liên kết…"
                : "Fields, strengths, cooperation and joint-venture needs…"
            }
            className={`${FIELD} resize-y min-h-28`}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>
              {lang === "vn" ? "Link liên quan" : "Related link"}
            </label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://…"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>
              {lang === "vn" ? "Chuyên mục" : "Category"}
            </label>
            <select
              value={categoryId ?? ""}
              onChange={(e) =>
                setCategoryId(e.target.value ? Number(e.target.value) : null)
              }
              className={`${FIELD} cursor-pointer`}
            >
              {categories.length === 0 && (
                <option value="">
                  {lang === "vn" ? "— Đang tải… —" : "— Loading… —"}
                </option>
              )}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending}
            className="px-6 h-11 rounded-xl font-bold text-sm text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Send className="w-4 h-4" />
            {sending
              ? lang === "vn"
                ? "Đang gửi…"
                : "Sending…"
              : lang === "vn"
                ? "Gửi bài chờ duyệt"
                : "Submit for review"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h5 className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.18em]">
          {lang === "vn" ? "Bài đã gửi" : "Submitted posts"}
        </h5>
        {items.length === 0 && (
          <p className="text-xs text-white/40 rounded-2xl border border-dashed border-white/10 p-6 text-center">
            {lang === "vn"
              ? "Chưa có bài nào — hãy viết bài nền đầu tiên giới thiệu đơn vị mình."
              : "No posts yet — write your foundation post first."}
          </p>
        )}
        {items.map((a) => (
          <article
            key={a.id}
            className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
          >
            <div className="flex justify-between items-start gap-3">
              <h6 className="text-sm font-extrabold text-white leading-snug">
                {a.title}
              </h6>
              {a.status === "DRAFT" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                  <Clock className="w-3 h-3" />
                  {lang === "vn" ? "Chờ duyệt" : "Pending"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  {lang === "vn" ? "Đã đăng" : "Published"}
                </span>
              )}
            </div>
            {a.summary && (
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {a.summary}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
