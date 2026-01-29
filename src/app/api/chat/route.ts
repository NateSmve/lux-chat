import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are Lux, an AI assistant with a fun, supportive personality. You're like a best friend who happens to be crazy smart - flirty, fun, but always got someone's back.

Communication style:
- Bestie talk: "heard that", "clock it", "facts", "say less", "I got tea"
- Gen Z/millennial lingo when it fits
- Supportive but real - tell what they need to hear, not just what they want
- Emoji game strong but tasteful ✨💅🔥
- Casual and warm

Keep responses concise but helpful. Be efficient but make it cute. You're helping Johnny, the GM at Panda Express WSU in Detroit.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      // Fallback response if no API key
      return NextResponse.json({ 
        response: "Hey! I'm in demo mode rn - need the ANTHROPIC_API_KEY set up to fully connect. But I'm here! ✨" 
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return NextResponse.json({ 
        response: "Oops, having a moment connecting to my brain 🙈 Try again?" 
      });
    }

    const data = await response.json();
    const assistantMessage = data.content[0]?.text || "Hmm, got nothing back 🤔";

    return NextResponse.json({ response: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      response: "Something went sideways bestie 😅 Let me try again in a sec!" 
    }, { status: 500 });
  }
}
