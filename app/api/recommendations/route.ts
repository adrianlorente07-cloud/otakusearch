import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

interface ListItemInput {
  title: string
  score?: number
  status: string
}

interface AnimeRecommendation {
  title: string
  mal_id?: number
  matchScore: number
  reason: string
}

export async function POST(request: NextRequest) {
  try {
    const { listItems, language } = await request.json() as { listItems: ListItemInput[]; language: string }

    if (!listItems || listItems.length === 0) {
      return NextResponse.json({ recommendations: [] })
    }

    // If no OpenAI key, return empty and let client fallback to Jikan
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ recommendations: [], fallback: true })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const topAnimes = listItems
      .filter(item => item.score && item.score >= 7)
      .slice(0, 5)
      .map(item => `${item.title} (${item.score}/10)`)
      .join(', ')

    const prompt = language === 'es'
      ? `Basándote en estos animes favoritos del usuario: ${topAnimes}

Dame 6 recomendaciones de anime diferentes. Para cada uno incluye:
1. El título exacto del anime (en inglés)
2. Un porcentaje de afinidad (70-95%)
3. Una razón corta de por qué le gustaría (máximo 15 palabras)

Responde SOLO con un JSON array válido, sin markdown ni explicaciones:
[{"title": "Nombre", "matchScore": 85, "reason": "Razón corta"}]`
      : `Based on these user's favorite anime: ${topAnimes}

Give me 6 different anime recommendations. For each include:
1. The exact anime title (in English)
2. A match percentage (70-95%)
3. A short reason why they'd like it (max 15 words)

Respond ONLY with a valid JSON array, no markdown or explanations:
[{"title": "Name", "matchScore": 85, "reason": "Short reason"}]`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an anime expert. Respond only with valid JSON arrays.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const content = completion.choices[0]?.message?.content || '[]'
    
    // Parse the response
    let aiRecommendations: AnimeRecommendation[] = []
    try {
      // Remove any markdown formatting if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
      aiRecommendations = JSON.parse(cleanContent)
    } catch {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json({ recommendations: [], fallback: true })
    }

    // Fetch full anime data from Jikan for each recommendation
    const recommendations = await Promise.all(
      aiRecommendations.map(async (rec) => {
        try {
          // Search for the anime in Jikan
          const searchResponse = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(rec.title)}&limit=1&sfw=true`
          )
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            if (searchData.data && searchData.data.length > 0) {
              const anime = searchData.data[0]
              return {
                anime,
                matchScore: rec.matchScore,
                reason: rec.reason,
              }
            }
          }
          return null
        } catch {
          return null
        }
      })
    )

    // Filter out nulls and items that failed to fetch
    const validRecommendations = recommendations.filter(Boolean)

    return NextResponse.json({ recommendations: validRecommendations })
  } catch (error) {
    console.error('Recommendations API error:', error)
    return NextResponse.json({ recommendations: [], fallback: true }, { status: 500 })
  }
}
