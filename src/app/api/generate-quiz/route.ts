import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { material, questionCount } = await req.json();

    console.log('Key being used:', process.env.GROQ_API_KEY?.slice(0, 10));

    const prompt = `You are a quiz generator for students. Based on the study material below, generate exactly ${questionCount} multiple choice questions.

Return ONLY a JSON array, no markdown, no explanation, no backticks.
Format:
[
  {
    "id": 1,
    "question": "question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "brief explanation of why this is correct"
  }
]

The "correct" field is the index (0-3) of the correct option in the options array.
Make questions clear, relevant, and varying in difficulty.

Study Material:
${material.slice(0, 4000)}`;

    const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            })
        }
    );

    const data = await response.json();

    console.log('Groq status:', response.status);
    console.log('Groq response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to generate quiz', details: data }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content ?? '';

    try {
        const clean = text.replace(/```json|```/g, '').trim();
        const questions = JSON.parse(clean);
        return NextResponse.json({ questions });
    } catch (e) {
        console.error('Parse error:', e, 'Raw text:', text);
        return NextResponse.json({ error: 'Failed to parse questions', raw: text }, { status: 500 });
    }
}