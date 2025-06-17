import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/auths/user`, {
      params: { teamId: `${process.env.NEXT_PUBLIC_TEAM_ID}` },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    const err = error as AxiosError;
    return new NextResponse(JSON.stringify({ error: err?.response?.data }), {
      status: 500,
    });
  }
}