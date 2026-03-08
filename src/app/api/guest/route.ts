import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { guestId } = await request.json();

        if (!guestId || typeof guestId !== "string" || guestId.length < 10) {
            return NextResponse.json({ error: "Invalid guest ID" }, { status: 400 });
        }

        await prisma.guest.upsert({
            where: { id: guestId },
            update: {},
            create: { id: guestId },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { guestId, username } = await request.json();

        if (!guestId || typeof guestId !== "string") {
            return NextResponse.json({ error: "Invalid guest ID" }, { status: 400 });
        }

        const existingGuest = await prisma.guest.findUnique({
            where: { id: guestId },
        });

        if (!existingGuest) {
            return NextResponse.json({ error: "Guest not found" }, { status: 404 });
        }

        if (existingGuest.username && existingGuest.username.trim().length > 0) {
            return NextResponse.json({ error: "Username can only be set once" }, { status: 403 });
        }

        await prisma.guest.update({
            where: { id: guestId },
            data: { username: username || null },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
