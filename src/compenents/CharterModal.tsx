import { motion } from "motion/react";
import { Download, FileText } from "lucide-react";
import type { Lang } from "@/types";

interface CharterModalProps {
  lang: Lang;
  onClose: () => void;
}

const PDF_URL = "/dieu-le-hiep-hoi-cong-nghe-so-da-nang.pdf";

function H({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="font-black text-white text-xs uppercase tracking-wider">
      {children}
    </h5>
  );
}

function Item({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <p>
      <strong className="text-white/90">{title}</strong>
      <br />
      {children}
    </p>
  );
}

export function CharterModal({ lang, onClose }: CharterModalProps) {
  const vn = lang === "vn";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Dialog body */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-4xl max-h-[85dvh] overflow-hidden glass rounded-3xl border border-white/15 flex flex-col shadow-2xl z-10"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase text-accent tracking-widest">
              {vn ? "Văn bản minh bạch công khai" : "Transparent Official Bill"}
            </span>
            <h3 className="text-lg font-black text-white uppercase tracking-wide mt-1">
              {vn
                ? "Điều lệ Hiệp hội (Chính thức)"
                : "DTA Official Association Charter"}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              {vn
                ? "Kèm theo QĐ số 3189/QĐ-UBND ngày 20/7/2026 của Chủ tịch UBND TP Đà Nẵng · Thông qua 28/03/2026 · 08 chương, 29 điều"
                : "Attached to Decision 3189/QD-UBND dated 20/07/2026 · Adopted 28/03/2026 · 08 chapters, 29 articles"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 active:scale-90 transition-all cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-muted-foreground leading-relaxed font-sans max-h-[60dvh]">
          <div className="text-center pb-4 border-b border-white/5">
            <h4 className="text-white font-extrabold text-base uppercase leading-tight">
              {vn
                ? "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"
                : "SOCIALIST REPUBLIC OF VIETNAM"}
            </h4>
            <p className="text-white font-bold text-xs mt-1">
              {vn ? "Độc lập - Tự do - Hạnh phúc" : "Independence - Freedom - Happiness"}
            </p>
            <p className="text-white font-extrabold text-sm mt-3 uppercase">
              {vn
                ? "Điều lệ Hiệp hội Công nghệ số thành phố Đà Nẵng"
                : "Charter of Danang Digital Technology Association"}
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-2 leading-relaxed">
              {vn
                ? "Được Đại hội Đại biểu bất thường Hiệp hội Doanh nghiệp phần mềm TP Đà Nẵng NK 2023–2028 thông qua ngày 28/03/2026; thay thế Điều lệ kèm QĐ 5245/QĐ-UBND ngày 13/07/2010."
                : "Adopted 28/03/2026 by the Extraordinary Congress (2023–2028); replacing the charter attached to Decision 5245/QD-UBND dated 13/07/2010."}
            </p>
          </div>

          {/* Chương I */}
          <div className="space-y-2">
            <H>
              {vn ? "Chương I: Quy định chung" : "Chapter I: General provisions"}
            </H>
            <Item title={vn ? "Điều 1. Tên gọi, biểu tượng" : "Art. 1. Names"}>
              {vn ? (
                <>
                  - Tên tiếng Việt: Hiệp hội Công nghệ số thành phố Đà Nẵng.
                  <br />- Tên tiếng Anh: Danang Digital Technology Association.
                  <br />- Viết tắt tiếng Anh: DTA.
                </>
              ) : (
                <>
                  - Vietnamese: Hiệp hội Công nghệ số thành phố Đà Nẵng.
                  <br />- English: Danang Digital Technology Association.
                  <br />- Abbreviation: DTA.
                </>
              )}
            </Item>
            <Item title={vn ? "Điều 2. Tôn chỉ, mục đích" : "Art. 2. Mission & objectives"}>
              {vn ? (
                <>
                  Hiệp hội là tổ chức xã hội – nghề nghiệp, tự nguyện, tập hợp doanh nghiệp, tổ chức, đơn vị, cá nhân trong 5 nhóm:
                  a) AI, Big Data, Blockchain, Cloud, VR/AR, hệ thống nhúng–số, in 3D, Robot–tự động hóa, vi mạch–bán dẫn, mỹ thuật CN–đồ họa;
                  b) điện tử–viễn thông, hạ tầng số, IoT, an ninh mạng–an toàn thông tin;
                  c) cơ sở đào tạo (nghề–đại học–sau đại học), trung tâm–viện nghiên cứu công nghệ số;
                  d) phần mềm & CNTT–TT, giải pháp quy trình doanh nghiệp;
                  đ) khởi nghiệp ĐMST, DN KH&CN, DN công nghệ số thử nghiệm sandbox.
                  <br />
                  Mục đích: a) tập hợp, kết nối, bảo vệ quyền/lợi ích hợp pháp hội viên, nâng thương hiệu & năng lực cạnh tranh;
                  b) góp ý–phản biện chính sách, thúc đẩy CĐS, đô thị thông minh, ĐMST;
                  c) quảng bá cộng đồng CĐS Đà Nẵng, lan tỏa Miền Trung–Tây Nguyên, mở rộng hợp tác trong/ngoài nước.
                </>
              ) : (
                <>
                  A voluntary social-professional body covering 5 groups:
                  (a) AI, Big Data, Blockchain, Cloud, VR/AR, embedded systems, 3D printing, robotics, semiconductors, industrial graphics;
                  (b) electronics–telecom, digital infrastructure, IoT, cybersecurity;
                  (c) training institutions & digital R&D institutes;
                  (d) software, ICT & business-process solutions;
                  (e) innovative startups & sandbox-tested digital firms.
                  <br />
                  Objectives: (a) unite, connect & protect members, uplift brands & competitiveness;
                  (b) policy feedback, digital transformation, smart city & innovation;
                  (c) promote Danang digital community across Central–Highlands & beyond.
                </>
              )}
            </Item>
            <Item title={vn ? "Điều 3. Tư cách pháp lý, trụ sở" : "Art. 3. Legal status, HQ"}>
              {vn
                ? "Có tư cách pháp nhân, con dấu, tài khoản riêng; hoạt động theo pháp luật và Điều lệ được phê duyệt. Văn phòng: Tầng 2, số 15 Quang Trung, Khu Công viên Phần mềm, phường Hải Châu, TP Đà Nẵng."
                : "Juridical person with seal & bank accounts; operating under law and the approved Charter. Office: Floor 2, No. 15 Quang Trung, Software Park, Hai Chau Ward, Danang City."}
            </Item>
            <Item title={vn ? "Điều 4. Phạm vi, lĩnh vực" : "Art. 4. Scope"}>
              {vn
                ? "Hoạt động trên phạm vi TP Đà Nẵng trong các lĩnh vực tại Điều 2. Chịu sự quản lý nhà nước của UBND TP Đà Nẵng, Sở Nội vụ, Sở Khoa học và Công nghệ cùng cơ quan chuyên môn liên quan."
                : "Operating within Danang City in Art. 2 fields. Supervised by the Danang People's Committee, Departments of Home Affairs and of Science & Technology."}
            </Item>
            <Item title={vn ? "Điều 5. Nguyên tắc tổ chức, hoạt động" : "Art. 5. Principles"}>
              {vn
                ? "1) Tự nguyện, tự quản; 2) Dân chủ, bình đẳng, công khai, minh bạch; 3) Tự bảo đảm kinh phí; 4) Không vì lợi nhuận; 5) Tuân thủ Hiến pháp, pháp luật và Điều lệ."
                : "1) Voluntary, self-governing; 2) Democratic, equal, open, transparent; 3) Self-financed; 4) Non-profit; 5) Compliant with Constitution, laws & Charter."}
            </Item>
          </div>

          {/* Chương II */}
          <div className="space-y-2">
            <H>
              {vn ? "Chương II: Quyền, nghĩa vụ của Hiệp hội" : "Chapter II: Rights & duties"}
            </H>
            <Item title={vn ? "Điều 6. Quyền (16 khoản)" : "Art. 6. Rights (16 clauses)"}>
              {vn
                ? "Hoạt động theo Điều lệ được duyệt; tuyên truyền tôn chỉ; đại diện hội viên đối nội–đối ngoại; bảo vệ quyền lợi hợp pháp; phối hợp hội viên; phổ biến–huấn luyện kiến thức; cầu nối thông tin–thị trường, hỗ trợ sản xuất–kinh doanh–quảng bá thương hiệu–đào tạo nhân lực; hợp tác trong/ngoài nước; góp ý văn bản QPPL và kiến nghị cơ quan nhà nước; bảo trợ–làm đầu mối hợp đồng/dự án, hỗ trợ DN mới & khởi nghiệp; tạo diễn đàn phản biện, đánh giá công trình/dự án; gây quỹ từ hội phí & hoạt động hợp pháp; nhận tài trợ hợp pháp & hỗ trợ NSNN cho nhiệm vụ được giao; khen thưởng–kỷ luật; hòa giải tranh chấp, giải quyết kiến nghị–khiếu nại–tố cáo."
                : "Operate under the approved Charter; propagate mission; represent members; protect lawful rights; coordinate members; train & inform; bridge information–markets, support business, branding & workforce; cooperate domestically & abroad; comment on legislation & petition authorities; sponsor contracts/projects, support new & startup firms; host forums & expert reviews; raise funds from fees & lawful services; receive lawful sponsorship & state support; reward/discipline; mediate disputes & handle petitions."}
            </Item>
            <Item title={vn ? "Điều 7. Nghĩa vụ, trách nhiệm (21 khoản)" : "Art. 7. Obligations (21 clauses)"}>
              {vn
                ? "Chấp hành pháp luật & Điều lệ; không lợi dụng Hiệp hội gây phương hại an ninh, trật tự, đạo đức, văn hóa; không vinh danh trái luật; phát triển hội viên đúng tôn chỉ; tuyên truyền chủ trương–chính sách; đề xuất sửa Điều lệ, ban hành quy chế nội bộ; quản lý viện trợ nước ngoài; báo cáo đại hội, nhân sự, trụ sở, tổ chức trực thuộc; báo cáo năm trước 31/12 (Mẫu 16 NĐ 126/2024); báo cáo giải quyết tranh chấp–khiếu nại; chịu kiểm tra–thanh tra; lưu danh sách hội viên, sổ sách, biên bản; kinh phí không chia cho hội viên; công khai–minh bạch tài chính, nộp thuế, kế toán–kiểm toán; ban hành quy chế BCH/BTV/Ban Kiểm tra, khen thưởng–kỷ luật, con dấu; ban hành quy tắc đạo đức; cập nhật cơ sở dữ liệu hội; phòng chống tham nhũng–rửa tiền–tài trợ khủng bố."
                : "Comply with laws & Charter; no abuse harming security, order, ethics or culture; no unlawful titles; grow membership per mission; disseminate Party/State policies; propose charter amendments & internal rules; manage foreign aid; report congresses, personnel, HQ & affiliates; annual report before Dec 31 (Form 16, Decree 126/2024); report dispute resolution; submit to inspections; keep member lists, books & minutes; funds never distributed to members; transparent finance, tax, accounting & audit; issue rules on governance, rewards, seals; adopt ethics code; update association database; anti-corruption & anti-money-laundering compliance."}
            </Item>
          </div>

          {/* Chương III */}
          <div className="space-y-2">
            <H>
              {vn ? "Chương III: Hội viên" : "Chapter III: Membership"}
            </H>
            <Item title={vn ? "Điều 8. Loại & tiêu chuẩn" : "Art. 8. Types & criteria"}>
              {vn
                ? "Gồm hội viên chính thức (tổ chức, công dân VN tán thành Điều lệ, tự nguyện gia nhập) và hội viên danh dự (có đóng góp tiêu biểu, uy tín, do BCH công nhận bằng văn bản). Tiêu chuẩn: tán thành Điều lệ; có đơn đăng ký; thực hiện nghĩa vụ tài chính; được BTV/BCH chấp thuận. Hội viên danh dự hưởng quyền như chính thức, trừ biểu quyết và ứng cử–đề cử–bầu cử BCH/Ban Kiểm tra."
                : "Official members (Vietnamese organisations/citizens endorsing the Charter) and honorary members (distinguished contributors recognised in writing by the Executive Board). Criteria: endorse Charter; written application; fulfil financial duties; approved by Standing Committee/Board. Honorary members share official rights except voting and standing for Board/Inspection elections."}
            </Item>
            <Item title={vn ? "Điều 9. Quyền hội viên" : "Art. 9. Member rights"}>
              {vn
                ? "Được bảo vệ quyền–lợi ích hợp pháp; được cung cấp thông tin & tham gia hoạt động; thảo luận–quyết định chủ trương, kiến nghị cơ quan có thẩm quyền; dự Đại hội, ứng cử–đề cử–bầu cử; giới thiệu hội viên mới; khen thưởng; cấp thẻ (nếu có); được ra khỏi Hiệp hội."
                : "Lawful protection; information & activities; deliberation & proposals to authorities; congress attendance, nomination & election; introducing new members; rewards; membership card (if any); voluntary withdrawal."}
            </Item>
            <Item title={vn ? "Điều 10. Nghĩa vụ hội viên" : "Art. 10. Member duties"}>
              {vn
                ? "Chấp hành chủ trương–pháp luật, Điều lệ–quy định Hiệp hội; tham gia sinh hoạt, đoàn kết xây dựng Hiệp hội; bảo vệ uy tín, không nhân danh Hiệp hội khi chưa được phân công bằng văn bản; thực hiện chế độ thông tin–báo cáo; đóng hội phí đầy đủ, đúng hạn."
                : "Obey policies, laws & Charter; join activities & build solidarity; protect reputation, never act in the Association's name without written assignment; report as required; pay dues fully and on time."}
            </Item>
            <Item title={vn ? "Điều 11. Kết nạp & chấm dứt" : "Art. 11. Admission & termination"}>
              {vn
                ? "Hồ sơ: đơn gia nhập (mẫu BCH) + bản sao GCN ĐKDN/giấy tờ pháp lý. Trong 30 ngày kể từ đủ hồ sơ hợp lệ, BCH (hoặc BTV được ủy quyền) quyết định kết nạp; BCH công nhận hội viên danh dự; cấp giấy chứng nhận. Chấm dứt khi: tổ chức giải thể/phá sản/mất tư cách pháp nhân; cá nhân chết/mất năng lực hành vi; tự nguyện xin ra (BTV trả lời trong 30 ngày, quá hạn mặc nhiên chấm dứt); bị khai trừ theo QĐ BCH."
                : "Dossier: application (Board form) + copy of business certificate/legal papers. Within 30 days of a complete dossier, the Board (or authorised Standing Committee) admits members; honorary members recognised by the Board; certificates issued. Termination: dissolution/bankruptcy/loss of legal status; death/incapacity; voluntary exit (Standing Committee replies in 30 days, silence means termination); expulsion by the Board."}
            </Item>
          </div>

          {/* Chương IV */}
          <div className="space-y-2">
            <H>
              {vn ? "Chương IV: Tổ chức, hoạt động" : "Chapter IV: Organisation"}
            </H>
            <Item title={vn ? "Điều 12. Cơ cấu" : "Art. 12. Structure"}>
              {vn
                ? "1) Đại hội; 2) Ban Chấp hành; 3) Ban Thường vụ; 4) Ban Kiểm tra; 5) Văn phòng, ban chuyên môn, tổ chức thuộc/trực thuộc."
                : "1) Congress; 2) Executive Board; 3) Standing Committee; 4) Inspection Board; 5) Office, professional boards & affiliates."}
            </Item>
            <Item title={vn ? "Điều 13. Đại hội" : "Art. 13. Congress"}>
              {vn
                ? "Cơ quan lãnh đạo cao nhất; nhiệm kỳ 05 năm; bất thường khi ≥2/3 BCH hoặc ≥1/2 hội viên chính thức đề nghị. Họp lệ khi >1/2 hội viên/đại biểu triệu tập có mặt; quyết định khi >1/2 tán thành. Nhiệm vụ: thẩm tra tư cách, thông qua chương trình–quy chế, báo cáo tổng kết–tài chính–kiểm điểm, Điều lệ, chia/tách/sáp nhập, nhân sự BCH/Ban Kiểm tra, nghị quyết."
                : "Supreme body; 5-year term; extraordinary session at ≥2/3 Board or ≥1/2 official members' request. Quorum >1/2 convened; decisions by >1/2 approval. Mandate: credentials, agenda, activity/finance reports, Charter, split/merger, Board & Inspection personnel, resolutions."}
            </Item>
            <Item title={vn ? "Điều 14–15. BCH & BTV" : "Art. 14–15. Boards"}>
              {vn
                ? "BCH do Đại hội bầu, lãnh đạo giữa 2 kỳ Đại hội, mỗi năm họp 02 lần (trực tiếp/trực tuyến), hợp lệ khi >1/2 dự, quyết định khi >1/2 tán thành (ngang phiếu theo Chủ tịch); được lấy ý kiến bằng văn bản; bầu/bổ sung (≤1/3), miễn nhiệm–bãi nhiệm nhân sự. BTV do BCH bầu (Chủ tịch, các Phó, ủy viên), mỗi năm họp 04 lần, giúp BCH điều hành giữa 2 kỳ họp, chuẩn bị họp BCH, quyết định tổ chức thuộc Hiệp hội."
                : "Executive Board elected by Congress, leading between congresses, meeting twice yearly (on/offline), quorum >1/2, decisions >1/2 (Chair breaks ties); written consultation allowed; by-elections ≤1/3. Standing Committee (Chair, Vice-Chairs, members) meets 4× yearly, executing Board resolutions & managing affiliates."}
            </Item>
            <Item title={vn ? "Điều 16–17. Chủ tịch, Phó CT, Tổng thư ký" : "Art. 16–17. Chair & Secretary"}>
              {vn
                ? "Chủ tịch là đại diện pháp luật, do BCH bầu trong BTV; tiêu chuẩn: chấp hành Đảng–pháp luật, phẩm chất–uy tín, quốc tịch VN, năng lực dân sự đầy đủ, không án tích; không giữ quá 02 chức Chủ tịch hội; không là cán bộ công chức quản lý trực tiếp lĩnh vực (trừ được cấp thẩm quyền đồng ý). Phó CT: tối đa 02 chuyên trách + 06 không chuyên trách, giúp Chủ tịch theo phân công. Miễn nhiệm/bãi nhiệm/đình chỉ theo Điều lệ & kết luận cấp có thẩm quyền. Tổng thư ký do BCH bầu trong BTV, chuyên trách, điều hành công việc hằng ngày & Văn phòng, quản lý tài chính–tài sản theo quy chế."
                : "Chair is the legal representative, elected from the Standing Committee; must uphold laws, hold merit & prestige, Vietnamese nationality, full capacity, clean record; max 02 chair posts; no concurrent regulatory civil-service post without approval. Vice-Chairs: max 02 full-time + 06 part-time. Dismissal/suspension per Charter & authority rulings. Secretary-General (full-time) runs daily work, the Office & finances per rules."}
            </Item>
            <Item title={vn ? "Điều 18–20. Kiểm tra, Văn phòng, ban chuyên môn" : "Art. 18–20. Inspection, Office"}>
              {vn
                ? "Ban Kiểm tra do Đại hội bầu (Trưởng, Phó, ủy viên), giám sát Điều lệ–nghị quyết, xử lý đơn–kiến nghị–khiếu nại–tố cáo. Văn phòng theo quy chế BTV: phục vụ BCH/BTV, thu thập thông tin cho hội viên, thu–chi minh bạch, hành chính–lưu trữ; nhân sự theo Bộ luật Lao động. Ban chuyên môn/tổ chức trực thuộc do Chủ tịch thành lập theo NQ BCH, hoạt động theo quy chế BCH phê duyệt."
                : "Inspection Board elected by Congress supervises Charter compliance & handles petitions/complaints. Office per Standing Committee rules serves governance, feeds members information, keeps transparent accounts & admin under Labour Code. Professional boards/affiliates established by the Chair per Board resolutions."}
            </Item>
          </div>

          {/* Chương V-VI */}
          <div className="space-y-2">
            <H>
              {vn ? "Chương V: Đổi tên, chia–tách–sáp nhập, giải thể" : "Chapter V: Renaming, split & dissolution"}
            </H>
            <Item title={vn ? "Điều 21–22" : "Art. 21–22"}>
              {vn
                ? "Thực hiện theo Bộ luật Dân sự, pháp luật về hội, nghị quyết Đại hội. Thu hồi con dấu khi đổi tên/chia/sáp nhập/hợp nhất/đình chỉ/giải thể theo pháp luật về con dấu."
                : "Per Civil Code, association laws & congress resolutions. Seals revoked on renaming/split/merger/suspension/dissolution per seal regulations."}
            </Item>
            <H>
              {vn ? "Chương VI: Tài chính, tài sản" : "Chapter VI: Finance & assets"}
            </H>
            <Item title={vn ? "Điều 23–25" : "Art. 23–25"}>
              {vn
                ? "Nguồn thu: phí gia nhập, hội phí, hoạt động hợp pháp, tài trợ trong/ngoài nước, NSNN hỗ trợ nhiệm vụ được giao. Chi: nhiệm vụ Hiệp hội & Nhà nước giao, trụ sở–phương tiện, chế độ người làm việc, khen thưởng. Tài sản chỉ dùng cho hoạt động; quản lý công khai–minh bạch–tiết kiệm; kế toán–thống kê–kiểm toán theo luật; báo cáo quyết toán hằng năm. Khi chia/tách/sáp nhập/giải thể: kiểm kê–phân loại; tài sản công xử lý theo luật tài sản công; tài sản tự có theo dân sự & Điều lệ; không phân chia tài sản khi giải thể; thanh toán theo thứ tự: chi phí giải thể → lương–BHXH → thuế–nợ; số còn lại nộp ngân sách cấp cho phép thành lập."
                : "Income: joining fees, dues, lawful operations, sponsorships, state support for assigned tasks. Spending: missions, HQ, staffing, rewards. Assets serve missions only; open, thrifty management; statutory accounting & audit; annual final reports. On split/merger/dissolution: inventory & classify; public assets per public-asset law; self-owned per civil law & Charter; no distribution on dissolution; payout order: dissolution costs → wages/social insurance → tax/debts; remainder to the licensing budget level."}
            </Item>
          </div>

          {/* Chương VII-VIII */}
          <div className="space-y-2">
            <H>
              {vn ? "Chương VII: Khen thưởng, kỷ luật" : "Chapter VII: Rewards & discipline"}
            </H>
            <Item title={vn ? "Điều 26–27" : "Art. 26–27"}>
              {vn
                ? "Tổ chức, hội viên xuất sắc được Hiệp hội khen thưởng hoặc đề nghị cấp có thẩm quyền khen thưởng. Vi phạm pháp luật/Điều lệ/quy chế bị khiển trách, cảnh cáo, khai trừ; gây thiệt hại phải bồi thường. BCH quy định thẩm quyền–thủ tục."
                : "Outstanding units/members are rewarded or nominated for higher awards. Violations face reprimand, warning or expulsion; damages compensated. Board details authority & procedures."}
            </Item>
            <H>
              {vn ? "Chương VIII: Điều khoản thi hành" : "Chapter VIII: Implementation"}
            </H>
            <Item title={vn ? "Điều 28–29" : "Art. 28–29"}>
              {vn
                ? "Sửa đổi–bổ sung Điều lệ phải được ≥2/3 đại biểu chính thức tán thành và cơ quan cho phép thành lập phê duyệt. Điều lệ gồm 08 chương, 29 điều, có hiệu lực theo QĐ phê duyệt của Chủ tịch UBND TP; thay thế Điều lệ kèm QĐ 5245/QĐ-UBND 13/07/2010; BCH hướng dẫn–tổ chức thực hiện."
                : "Amendments need ≥2/3 official delegates' approval plus licensing authority approval. 08 chapters, 29 articles, effective per City People's Committee Chair's decision; replacing the 13/07/2010 charter; the Board guides implementation."}
            </Item>
          </div>

          <p className="text-[11px] leading-relaxed border-t border-white/5 pt-4 flex items-start gap-2">
            <FileText className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span>
              {vn
                ? "Tóm lược đầy đủ 29 điều để tra cứu nhanh. Văn bản scan gốc (PDF) là căn cứ pháp lý cuối cùng — vui lòng tải về đối chiếu."
                : "A complete 29-article summary for quick reference. The scanned PDF remains the final legal source — please download it to verify."}
            </span>
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex flex-wrap gap-3 justify-end shrink-0">
          <a
            href={PDF_URL}
            download
            className="px-5 py-2 rounded-xl text-xs font-bold bg-accent text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {vn ? "Tải Điều lệ chính thức (PDF)" : "Download Official Charter"}
            </span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 text-white active:scale-95 transition-all cursor-pointer"
          >
            {vn ? "Đóng lại" : "Close"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
