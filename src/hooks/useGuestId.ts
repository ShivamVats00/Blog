"use client";

import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const GUEST_ID_KEY = "guest_id";
const GUEST_USERNAME_KEY = "guest_username";

export function useGuestId() {
    const [guestId, setGuestId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        let id = localStorage.getItem(GUEST_ID_KEY);
        const storedName = localStorage.getItem(GUEST_USERNAME_KEY);

        if (!id) {
            id = uuidv4();
            localStorage.setItem(GUEST_ID_KEY, id);
            fetch("/api/guest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ guestId: id }),
            }).catch(() => { });
        }

        setGuestId(id);
        setUsername(storedName);
    }, []);

    const updateUsername = useCallback(
        async (newUsername: string) => {
            if (!guestId) return;
            const trimmed = newUsername.trim();
            localStorage.setItem(GUEST_USERNAME_KEY, trimmed);
            setUsername(trimmed);

            try {
                await fetch("/api/guest", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ guestId, username: trimmed }),
                });
            } catch {
            }
        },
        [guestId]
    );

    return { guestId, username, updateUsername };
}
