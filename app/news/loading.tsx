import { NewsPageSkeleton } from "@/components/news/news-page-skeleton";

export default function NewsLoading() {
  return (
    <div className="container py-8">
      <NewsPageSkeleton />
    </div>
  );
}
