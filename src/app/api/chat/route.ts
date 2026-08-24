import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { messages, systemPrompt } = await req.json();

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
        return NextResponse.json({ reply });

    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json({ reply: "Something went wrong. Please try again." }, { status: 500 });
    }
}