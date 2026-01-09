
"use client";

import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button3D } from "@/components/ui/Button3D";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
    id: number;
    role: "user" | "model";
    text: string;
}

export default function AIPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: "model", text: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now(), role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input }),
            });

            const data = await res.json();

            if (data.text) {
                const botMsg: Message = { id: Date.now() + 1, role: "model", text: data.text };
                setMessages(prev => [...prev, botMsg]);
            } else {
                console.error("No text in response", data);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg: Message = { id: Date.now() + 1, role: "model", text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold font-heading mb-8 text-center mt-12 text-gray-900 dark:text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-accent" />
                AI Agent
            </h1>

            <GlassCard className="w-full max-w-4xl h-[600px] flex flex-col p-0 overflow-hidden border border-black/10 dark:border-white/20">
                {/* Header */}
                <div className="p-4 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-bold text-gray-900 dark:text-white">Gemini Pro</span>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`flex items-end gap-2 max-w-[80%]`}>
                                {msg.role === "model" && (
                                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent ring-1 ring-black/10 dark:ring-white/10 shrink-0">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                )}
                                <div className={`p-4 rounded-2xl whitespace-pre-wrap ${msg.role === "user"
                                        ? "bg-primary-start text-white rounded-br-none"
                                        : "bg-black/5 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-bl-none"
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-primary-start/10 flex items-center justify-center text-primary-start ring-1 ring-primary-start/20 shrink-0">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent ring-1 ring-black/10 dark:ring-white/10">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-black/5 dark:bg-white/10 p-4 rounded-2xl rounded-bl-none">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0" />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-black/5 dark:bg-black/20 border-t border-black/10 dark:border-white/10 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask the AI anything..."
                        className="flex-1 bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary-start placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        disabled={isLoading}
                    />
                    <Button3D variant="primary" className="px-6" disabled={isLoading}>
                        <Send className="w-4 h-4" />
                    </Button3D>
                </form>
            </GlassCard>
        </main>
    );
}
