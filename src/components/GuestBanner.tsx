"use client";

import { useState } from "react";
import { User, Check, X } from "lucide-react";

interface GuestBannerProps {
    username: string | null;
    updateUsername: (name: string) => Promise<void>;
}

export default function GuestBanner({ username, updateUsername }: GuestBannerProps) {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(username || "");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await updateUsername(inputValue);
        setSaving(false);
        setEditing(false);
    };

    if (editing) {
        return (
            <div className="fixed bottom-6 right-6 z-50 glass-card rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your name..."
                    maxLength={30}
                    className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 w-44 font-body"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="p-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
                >
                    <Check className="w-4 h-4 text-primary" />
                </button>
                <button
                    onClick={() => setEditing(false)}
                    className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors border border-border"
                >
                    <X className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>
        );
    }

    if (username) {
        return (
            <div className="fixed bottom-6 right-6 z-50 glass-card rounded-full px-5 py-3 shadow-2xl shadow-black/30 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground font-body">
                    Hello, {username}
                </span>
            </div>
        );
    }

    return (
        <button
            onClick={() => {
                setInputValue(username || "");
                setEditing(true);
            }}
            className="fixed bottom-6 right-6 z-50 glass-card rounded-full px-4 py-2.5 shadow-2xl shadow-black/30 flex items-center gap-2 hover:bg-secondary/50 transition-all duration-300 group"
        >
            <User className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-body">
                Set your name
            </span>
        </button>
    );
}
