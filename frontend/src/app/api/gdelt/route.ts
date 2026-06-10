import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch("https://api.gdeltproject.org/api/v2/doc/doc?query=(crisis OR conflict OR blockade OR military OR strike)&mode=artlist&format=json&maxrecords=50&sort=datedesc", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VanguardSCRI/1.0'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!res.ok) {
      throw new Error(`GDELT responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GDELT Proxy Error:", error);
    // Fallback data if GDELT fails
    return NextResponse.json({
      articles: [
        { title: "[FALLBACK] Houthi attacks continue near Bab el-Mandeb; routing premiums up 14%.", domain: "internal.vanguard" },
        { title: "[FALLBACK] Drought restrictions limiting daily transits to 24 vessels in Panama.", domain: "internal.vanguard" }
      ]
    });
  }
}
