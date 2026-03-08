"use server";

import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
    const authed = await isAuthenticated();
    if (!authed) {
        return { success: false, error: "Unauthorized" };
    }

    const content = formData.get("content") as string;
    const mediaUrl = formData.get("mediaUrl") as string | null;
    const mediaType = formData.get("mediaType") as string | null;

    if (!content || content.trim().length === 0) {
        return { success: false, error: "Content is required." };
    }

    await prisma.post.create({
        data: {
            content: content.trim(),
            mediaUrl: mediaUrl && mediaUrl.trim().length > 0 ? mediaUrl.trim() : null,
            mediaType: mediaType && mediaType.trim().length > 0 ? mediaType.trim() : null,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
}

export async function getPosts() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: {
                    views: true,
                    likes: true,
                },
            },
        },
    });
    return posts;
}

export async function getPostWithInteractions(postId: string) {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            views: {
                include: { guest: true },
                orderBy: { viewedAt: "desc" },
            },
            likes: {
                include: { guest: true },
                orderBy: { likedAt: "desc" },
            },
            _count: {
                select: { views: true, likes: true },
            },
        },
    });
    return post;
}

export async function deletePost(postId: string) {
    const authed = await isAuthenticated();
    if (!authed) {
        return { success: false, error: "Unauthorized" };
    }

    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
}
