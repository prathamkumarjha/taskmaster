import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
// import { NextResponse } from 'next/server';

export  async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Ensure the API key is defined
   
const UNSPLASH_ACESS_KEY = process.env.UNSPLASH_ACESS_KEY
console.log(UNSPLASH_ACESS_KEY);
    const response = await axios.get(`https://api.unsplash.com/photos/random?count=9&orientation=landscape&client_id=${UNSPLASH_ACESS_KEY}`);

    if (!response) {
      throw new Error('Failed to fetch data');
    }
        console.log(typeof response)
    return  NextResponse.json(response.data); 
  } catch (error) {
    console.error('Error fetching data from Unsplash:', error);
    return new NextResponse("Internal error", { status: 500 }); 
  }
}
