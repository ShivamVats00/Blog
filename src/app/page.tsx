import { getPosts } from "@/actions/posts";
import PostFeed from "@/components/PostFeed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let serializedPosts: any[] = [];
  let likedPostIds: string[] = [];
  let dbError = false;

  try {
    const posts = await getPosts();
    serializedPosts = posts.map((p: any) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    }));
  } catch {
    dbError = true;
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary-foreground">
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
                my journal
              </h1>
              <p className="text-[12px] text-muted-foreground mt-1 font-medium tracking-wide uppercase font-body">
                thoughts &amp; moments
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Live</span>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-10 md:py-16">
          {dbError ? (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center border border-border shadow-sm">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-muted-foreground text-lg font-display">Connecting to the universe...</p>
              <p className="text-muted-foreground/60 text-sm mt-2 font-body">Please try refreshing in a moment.</p>
            </div>
          ) : (
            <PostFeed posts={serializedPosts} likedPostIds={likedPostIds} />
          )}
        </main>

        <footer className="py-8 border-t border-border text-center px-6">
          <p className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} Shivam Vats
          </p>
        </footer>
      </div>
    </div>
  );
}
