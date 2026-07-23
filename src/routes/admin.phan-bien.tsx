import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  XCircle,
  Trash2,
  ExternalLink,
  Plus,
  MessagesSquare,
} from "lucide-react";
import {
  forumStore,
  genId,
  SUBMISSION_STATUS_LABEL,
  type ForumSubmission,
} from "@/compenents/admin/opsData";
import { saveArticle, newArticleId } from "@/compenents/admin/adminStore";
import {
  Field,
  INPUT,
  StatusChip,
  PageHeader,
  PRIMARY_BTN,
  PRIMARY_STYLE,
  GHOST_BTN,
  ICON_BTN,
} from "@/compenents/admin/ui";

/**
 * Diễn đàn phản biện: hàng chờ duyệt bài do hội viên/người trong hội gửi —
 * chủ yếu qua link (website hội viên, Google Docs…). Duyệt một bài sẽ tạo
 * sẵn BẢN NHÁP trên kho bài viết (chuyên mục Tin trong ngành, link về
 * nguồn) để Ban Biên tập biên tập lại rồi xuất bản.
 */
export const Route = createFileRoute("/admin/phan-bien")({
  component: AdminForum,
});

type Tab = "pending" | "approved" | "rejected" | "all";

const TABS: { value: Tab; label: string }[] = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "all", label: "Tất cả" },
];

function AdminForum() {
  const submissions = forumStore.useItems();
  const [tab, setTab] = useState<Tab>("pending");
  const [showForm, setShowForm] = useState(false);

  const rows = useMemo(
    () =>
      tab === "all" ? submissions : submissions.filter((s) => s.status === tab),
    [submissions, tab],
  );
  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  const approve = (s: ForumSubmission) => {
    forumStore.save({ ...s, status: "approved" });
    // Pre-create the editorial draft so approval leads straight to editing.
    saveArticle({
      id: newArticleId(),
      title: s.title,
      summary: s.note ?? `Bài phản biện của ${s.memberName}.`,
      topic: "su-kien",
      category: "tin-trong-nganh",
      date: s.date,
      image: `https://picsum.photos/seed/${s.id}/800/450`,
      tags: ["Diễn đàn", "Phản biện"],
      views: 0,
      memberUrl: s.link,
      author: s.memberName,
      status: "draft",
      body: [
        s.note ?? "",
        `Xem toàn văn bài viết tại nguồn của tác giả theo liên kết bên dưới.`,
      ].filter(Boolean),
    });
    toast.success(
      "Đã duyệt — bản nháp đã tạo trong Quản lý bài viết, biên tập rồi xuất bản.",
    );
  };

  const reject = (s: ForumSubmission) => {
    forumStore.save({ ...s, status: "rejected" });
    toast.success(
      `Đã từ chối và gửi email phản hồi tới ${s.memberName} (mô phỏng).`,
    );
  };

  const remove = (s: ForumSubmission) => {
    if (!window.confirm(`Xóa bài gửi “${s.title}”?`)) return;
    forumStore.remove(s.id);
    toast.success("Đã xóa bài gửi.");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Diễn đàn phản biện"
        desc="Bài phản biện, góp ý, báo cáo do hội viên gửi về — chủ yếu qua link. Duyệt sẽ tạo bản nháp trong Quản lý bài viết; từ chối sẽ phản hồi qua email (mô phỏng)."
        actions={
          <button
            onClick={() => setShowForm((v) => !v)}
            className={PRIMARY_BTN}
            style={PRIMARY_STYLE}
          >
            <Plus className="w-3.5 h-3.5" />
            Ghi nhận bài gửi
          </button>
        }
      />

      {/* Status tabs */}
      <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-0.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              tab === t.value
                ? "bg-accent/15 text-accent"
                : "text-white/55 hover:text-white"
            }`}
          >
            {t.label}
            {t.value === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {showForm && (
        <SubmissionForm
          onSave={(s) => {
            forumStore.save(s);
            setShowForm(false);
            toast.success("Đã ghi nhận bài gửi vào hàng chờ duyệt.");
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Cards */}
      <div className="space-y-3">
        {rows.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
          >
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <StatusChip
                    tone={
                      s.status === "approved"
                        ? "green"
                        : s.status === "pending"
                          ? "amber"
                          : "red"
                    }
                  >
                    {SUBMISSION_STATUS_LABEL[s.status]}
                  </StatusChip>
                  <span className="text-[10px] text-white/40 font-mono">
                    {s.date}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white/90 leading-snug">
                  {s.title}
                </h3>
                <div className="mt-1 text-[11px] text-white/55">
                  Gửi bởi{" "}
                  <span className="font-bold text-white/75">
                    {s.memberName}
                  </span>
                </div>
                {s.note && (
                  <p className="mt-1.5 text-[11px] text-white/50 leading-relaxed line-clamp-2">
                    {s.note}
                  </p>
                )}
                <a
                  href={s.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-accent hover:text-cyan-300 transition-colors break-all"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  {s.link}
                </a>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {s.status === "pending" && (
                  <>
                    <button
                      onClick={() => approve(s)}
                      title="Duyệt — tạo bản nháp bài viết"
                      className={`${ICON_BTN} hover:text-emerald-300`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => reject(s)}
                      title="Từ chối (gửi email phản hồi)"
                      className={`${ICON_BTN} hover:text-amber-300`}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => remove(s)}
                  title="Xóa"
                  className={`${ICON_BTN} hover:text-red-300`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-xs text-white/45">
            <MessagesSquare className="w-6 h-6 mx-auto mb-3 text-white/25" />
            Không có bài gửi nào ở trạng thái này.
          </div>
        )}
      </div>
    </div>
  );
}

function SubmissionForm({
  onSave,
  onCancel,
}: {
  onSave: (s: ForumSubmission) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [memberName, setMemberName] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");

  const submit = () => {
    if (!title.trim() || !memberName.trim() || !link.trim()) {
      toast.error("Cần nhập Tiêu đề, Người gửi và Link bài viết.");
      return;
    }
    const d = new Date();
    const p = (x: number) => String(x).padStart(2, "0");
    onSave({
      id: genId("sub"),
      title: title.trim(),
      memberName: memberName.trim(),
      link: link.trim(),
      note: note.trim() || undefined,
      date: `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`,
      status: "pending",
    });
  };

  return (
    <div className="rounded-2xl border border-accent/30 bg-white/[0.02] p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Tiêu đề bài *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="Người / đơn vị gửi *">
          <input
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className={INPUT}
          />
        </Field>
      </div>
      <Field label="Link bài viết *">
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://…"
          className={INPUT}
        />
      </Field>
      <Field label="Ghi chú / tóm tắt">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className={`${INPUT} resize-none`}
        />
      </Field>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className={GHOST_BTN}>
          Hủy
        </button>
        <button onClick={submit} className={PRIMARY_BTN} style={PRIMARY_STYLE}>
          <Plus className="w-3.5 h-3.5" />
          Ghi nhận
        </button>
      </div>
    </div>
  );
}
