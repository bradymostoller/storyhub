import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";


interface OpenAIImageResponse {
  data: { url: string }[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: text,
      n: 1,
      size: "1024x1024", 
      quality: "standard", 
      style: "vivid", 
      response_format: "url"
    }) as unknown as OpenAIImageResponse;

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL returned" }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });

  } catch (error: any) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { error: error.message || "Image generation failed" },
      { status: 500 }
    );
  }
}