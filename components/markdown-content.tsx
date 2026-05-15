import { cn } from "@/lib/utils";

interface Props {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: Props) {
  const html = renderMarkdown(content ?? "");
  return (
    <div
      className={cn("prose-packless", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string) {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );
}

function renderMarkdown(content: string): string {
  const lines = escapeHtml(content).split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  let inOrdered = false;

  const closeLists = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
    if (inOrdered) {
      out.push("</ol>");
      inOrdered = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line) {
      closeLists();
      continue;
    }
    if (line.startsWith("### ")) {
      closeLists();
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      closeLists();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      closeLists();
      out.push(`<h2>${inline(line.slice(2))}</h2>`);
    } else if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        closeLists();
        inList = true;
        out.push("<ul>");
      }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
    } else if (/^\d+\.\s+/.test(line)) {
      if (!inOrdered) {
        closeLists();
        inOrdered = true;
        out.push("<ol>");
      }
      out.push(`<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`);
    } else if (line.startsWith("> ")) {
      closeLists();
      out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
    } else {
      closeLists();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  closeLists();
  return out.join("\n");
}
