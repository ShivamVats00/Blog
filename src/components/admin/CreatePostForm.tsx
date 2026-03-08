"use client";

import { useState } from "react";
import { createPost } from "@/actions/posts";
import { PlusCircle, Image, Video, Send, X } from "lucide-react";

export default function CreatePostForm({ onPostCreated }: { onPostCreated: () => void }) {
    const [content, setContent] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [mediaType, setMediaType] = useState<"image" | "video">("image");
    const [showMediaInput, setShowMediaInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.set("content", content);
        if (showMediaInput && mediaUrl.trim()) {
            formData.set("mediaUrl", mediaUrl.trim());
            formData.set("mediaType", mediaType);
        }

        const result = await createPost(formData);

        if (result.success) {
            setContent("");
            setMediaUrl("");
            setShowMediaInput(false);
            onPostCreated();
        } else {
            setError(result.error || "Failed to create post");
        }
        setLoading(false);
    };

    return (
        <div className="bg-[#0c0c0e] border border-neutral-800/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center">
                    <PlusCircle className="w-4 h-4 text-neutral-400" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-100">New Entry</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind..."
                    rows={4}
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 resize-none transition-all font-light"
                />

                {showMediaInput && (
                    <div className="space-y-3 bg-neutral-900/40 rounded-xl p-4 border border-neutral-800">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest">Media</span>
                            <button
                                type="button"
                                onClick={() => setShowMediaInput(false)}
                                className="ml-auto p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-500 hover:text-neutral-300"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <input
                            type="url"
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            placeholder="Enter media URL..."
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-all"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setMediaType("image")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mediaType === "image"
                                    ? "bg-white text-black border border-white"
                                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200"
                                    }`}
                            >
                                <Image className="w-3.5 h-3.5" />
                                Image
                            </button>
                            <button
                                type="button"
                                onClick={() => setMediaType("video")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mediaType === "video"
                                    ? "bg-white text-black border border-white"
                                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200"
                                    }`}
                            >
                                <Video className="w-3.5 h-3.5" />
                                Video
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-red-500/90 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">{error}</p>
                )}

                <div className="flex items-center justify-between">
                    {!showMediaInput && (
                        <button
                            type="button"
                            onClick={() => setShowMediaInput(true)}
                            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 text-sm font-medium transition-colors"
                        >
                            <Image className="w-4 h-4" />
                            Add media
                        </button>
                    )}
                    <div className="flex-1" />
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="bg-white hover:bg-neutral-200 text-black font-medium px-5 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Publish
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
