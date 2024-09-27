import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    // Ensure the API key is defined
    const UNSPLASH_ACESS_KEY = process.env.UNSPLASH_ACESS_KEY;
    const randomNum = Math.floor(Math.random() * 10000);

    // Fetch data from Unsplash
    const response = await fetch(`https://api.unsplash.com/photos/random?count=9&orientation=landscape&client_id=${UNSPLASH_ACESS_KEY}&random=${randomNum}`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Unsplash API error');
    }

    const data = await response.json();

    // Return the fetched data as JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from Unsplash:', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
