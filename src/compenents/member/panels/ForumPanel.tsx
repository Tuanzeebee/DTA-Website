import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";
import type { Lang } from "@/types";

interface Feedback {
  id: number;
  author: string;
  date: string;
  text: string;
  category: string;
  status: string;
}

const SEED: Feedback[] = [];

const LABEL =
  "block text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5";

/** "Gửi yêu cầu & Góp ý" — hội viên gửi yêu cầu hỗ trợ, góp ý và lời mời hợp tác tới Văn phòng Hiệp hội. */
export function ForumPanel({ lang }: { lang: Lang }) {
  const [feedbackText, setFeedbackText] = useState("");
  const [category, setCategory] = useState("request");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(SEED);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const newPost: Feedback = {
      id: Date.now(),
      author: lang === "vn" ? "Bạn (Hội viên)" : "You (Member)",
      date: lang === "vn" ? "Hôm nay" : "Today",
      text: feedbackText,
      category:
        category === "coop"
          ? lang === "vn"
            ? "Mời hợp tác, liên danh-liên kết"
            : "Cooperation invite"
          : lang === "vn"
            ? "Yêu cầu & Góp ý"
            : "Request & Feedback",
      status:
        lang === "vn"
          ? "Văn phòng Hiệp hội đang chờ tiếp nhận"
          : "Pending DTA office review",
    };

    setFeedbacks([newPost, ...feedbacks]);
    setFeedbackText("");
    toast.success(
      lang === "vn"
        ? "Đã gửi yêu cầu / góp ý tới Văn phòng Hiệp hội!"
        : "Request sent to the DTA office!",
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/8">
        <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-cyan-300" />
        </span>
        <div>
          <h4 className="display text-base font-black text-white">
            {lang === "vn" ? "Gửi yêu cầu & Góp ý" : "Requests & Feedback"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "vn"
              ? "Gửi yêu cầu hỗ trợ, góp ý và lời mời hợp tác, liên danh-liên kết tới Văn phòng Hiệp hội."
              : "Send support requests, feedback and cooperation invites to the DTA office."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handlePost}
        className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5"
      >
        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Loại yêu cầu" : "Request Type"}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400/50 cursor-pointer"
          >
            <option value="request">
              {lang === "vn"
                ? "Yêu cầu hỗ trợ / Góp ý"
                : "Support request / Feedback"}
            </option>
            <option value="coop">
              {lang === "vn"
                ? "Mời hợp tác / Liên danh-liên kết"
                : "Cooperation / Joint venture invite"}
            </option>
          </select>
        </div>

        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Nội dung yêu cầu / Lời mời hợp tác" : "Details"}
          </label>
          <textarea
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={
              lang === "vn"
                ? "Mô tả yêu cầu của đơn vị bạn, hoặc lời mời hợp tác, liên danh-liên kết tới các hội viên..."
                : "Describe your request, or your invitation for cooperation and joint ventures..."
            }
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 h-11 rounded-xl font-bold text-sm text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Send className="w-4 h-4" />
            {lang === "vn" ? "Gửi yêu cầu" : "Send Request"}
          </button>
        </div>
      </form>

      {/* Request feed */}
      <div className="space-y-3">
        <h5 className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.18em]">
          {lang === "vn" ? "Yêu cầu đang được xử lý" : "Requests in Progress"}
        </h5>

        {feedbacks.map((f) => (
          <article
            key={f.id}
            className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <span className="text-sm font-extrabold text-white">
                  {f.author}
                </span>
                <span className="ml-2.5 px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded-md uppercase tracking-wider align-middle">
                  {f.category}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                {f.date}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
              {f.text}
            </p>
            <div className="mt-4 pt-3 border-t border-white/6 flex items-center gap-2 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="font-bold text-amber-400">{f.status}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
