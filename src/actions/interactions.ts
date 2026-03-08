"use server";

import { prisma } from "@/lib/prisma";

export async function recordView(postId: string, guestId: string) {
    if (!postId || !guestId) return { success: false };

    try {
        await prisma.view.upsert({
            where: {
                postId_guestId: { postId, guestId },
            },
            update: {},
            create: { postId, guestId },
        });
        return { success: true };
    } catch {
        return { success: false };
    }
}

export async function toggleLike(postId: string, guestId: string) {
    if (!postId || !guestId) return { liked: false, count: 0 };

    try {
        const existing = await prisma.like.findUnique({
            where: {
                postId_guestId: { postId, guestId },
            },
        });

        if (existing) {
            await prisma.like.delete({ where: { id: existing.id } });
        } else {
            await prisma.like.create({
                data: { postId, guestId },
            });
        }

        const count = await prisma.like.count({ where: { postId } });
        return { liked: !existing, count };
    } catch {
        return { liked: false, count: 0 };
    }
}

export async function getGuestLikes(guestId: string, postIds: string[]) {
    if (!guestId || postIds.length === 0) return [];

    const likes = await prisma.like.findMany({
        where: {
            guestId,
            postId: { in: postIds },
        },
        select: { postId: true },
    });

    return likes.map((l: { postId: string }) => l.postId);
}
