"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginForm() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await login(password);

        if (result.success) {
            window.location.reload();
        } else {
            setError(result.error || "Login failed.");
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-sm">
            <div className="bg-[#0c0c0e] border border-neutral-800/60 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-center w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl mx-auto mb-6">
                    <Lock className="w-5 h-5 text-neutral-400" />
                </div>

                <h1 className="text-xl font-bold tracking-tight text-neutral-100 text-center mb-1.5">
                    Admin Access
                </h1>
                <p className="text-sm font-medium text-neutral-500 text-center mb-8">
                    Enter your password to continue
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:bg-neutral-900 transition-all font-medium"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500/90 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !password}
                        className="w-full bg-white hover:bg-neutral-200 text-black font-medium py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
