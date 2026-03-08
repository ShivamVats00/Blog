import { isAuthenticated } from "@/lib/auth";
import { getPosts } from "@/actions/posts";
import LoginForm from "@/components/admin/LoginForm";
import Dashboard from "@/components/admin/Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const authed = await isAuthenticated();

    if (!authed) {
        return (
            <div className="min-h-screen bg-[#09090b] text-neutral-200 antialiased flex items-center justify-center p-6 selection:bg-neutral-800">
                <LoginForm />
            </div>
        );
    }

    const posts = await getPosts();
    const serializedPosts = posts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
    }));

    return (
        <div className="min-h-screen bg-[#09090b] text-neutral-200 antialiased selection:bg-neutral-800">
            <div className="relative z-10 p-4 md:p-8">
                <Dashboard posts={serializedPosts} />
            </div>
        </div>
    );
}
