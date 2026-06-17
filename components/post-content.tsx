import { cn } from "@/lib/utils";
import { MarkdownContent } from "@/components/markdown-content";

interface PostContentProps {
  content: string;
  contentFormat?: "html" | "markdown" | null;
  className?: string;
}

function isHtmlContent(content: string, contentFormat?: string | null) {
  if (contentFormat === "html") return true;
  if (contentFormat === "markdown") return false;
  const trimmed = content.trim();
  return trimmed.startsWith("<") && /<\/(p|h2|h3|ul|ol|blockquote|div)>/i.test(trimmed);
}

export function PostContent({ content, contentFormat, className }: PostContentProps) {
  if (isHtmlContent(content, contentFormat)) {
    return (
      <div
        className={cn("prose-fackless", className)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return <MarkdownContent content={content} className={className} />;
}
