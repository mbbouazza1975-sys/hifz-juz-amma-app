import { analyzeAyahTajwid } from "../tajwid/analyze";

const CATEGORY_CLASS: Record<string, string> = {
  ghunnah: "tajwid-ghunnah",
  qalqalah: "tajwid-qalqalah",
  madd: "tajwid-madd",
};

export default function TajwidText({
  text,
  colors,
}: {
  text: string;
  colors: boolean;
}) {
  if (!colors) {
    return <span className="arabic-text">{text}</span>;
  }
  const clusters = analyzeAyahTajwid(text);
  return (
    <span className="arabic-text">
      {clusters.map((c, idx) =>
        c.category ? (
          <span key={idx} className={CATEGORY_CLASS[c.category]}>
            {c.text}
          </span>
        ) : (
          <span key={idx}>{c.text}</span>
        ),
      )}
    </span>
  );
}
