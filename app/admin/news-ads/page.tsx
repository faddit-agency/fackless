import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AdminDeleteForm } from "@/components/admin/admin-delete-form";
import { deleteNewsAd, updateNewsAd } from "./actions";
import { NewsAdCreateForm } from "./news-ad-create-form";
import { NewsAdEditForm } from "./news-ad-edit-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "뉴스 광고 관리" };

type NewsAdRow = {
  id: string;
  title: string;
  subtitle: string | null;
  link_url: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export default async function AdminNewsAdsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("news_ads")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const ads = (data ?? []) as NewsAdRow[];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">뉴스 광고 관리</h1>
        <p className="text-sm text-muted-foreground">
          뉴스 우측 광고 슬롯을 관리합니다. 최대 5개까지 등록 가능합니다.
        </p>
      </header>

      <NewsAdCreateForm />

      <section className="space-y-3">
        <p className="text-sm font-semibold">등록된 광고 ({ads.length}/5)</p>
        {ads.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground text-center">
            아직 등록된 광고가 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="rounded-xl border bg-card p-4">
                <div className="grid gap-4 md:grid-cols-[220px,1fr]">
                  <div className="aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <NewsAdEditForm ad={ad} />
                    <div className="flex flex-wrap items-center gap-2">
                      <form action={updateNewsAd}>
                        <input type="hidden" name="id" value={ad.id} />
                        <input type="hidden" name="title" value={ad.title} />
                        <input type="hidden" name="subtitle" value={ad.subtitle ?? ""} />
                        <input type="hidden" name="link_url" value={ad.link_url} />
                        <input type="hidden" name="image_url" value={ad.image_url} />
                        <input type="hidden" name="sort_order" value={String(ad.sort_order)} />
                        <input
                          type="hidden"
                          name="is_active"
                          value={ad.is_active ? "false" : "true"}
                        />
                        <Button type="submit" variant="accent">
                          {ad.is_active ? "비활성화" : "활성화"}
                        </Button>
                      </form>

                      <AdminDeleteForm
                        action={deleteNewsAd}
                        id={ad.id}
                        confirmMessage={`"${ad.title}" 광고를 삭제할까요?`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
