import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options"; 
import dbConnect from "@/lib/mongoose";
import Template from '@/models/Template';
import { Types } from 'mongoose'; 

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;

  if (!user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    
    const newTemplate = new Template({
      ...body,
      userId: new Types.ObjectId(user.id), 
    });

    await newTemplate.save();
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error("TEMPLATE_POST_ERROR", error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;

  if (!user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    await dbConnect();
    const templates = await Template.find({ userId: new Types.ObjectId(user.id) });
    return NextResponse.json(templates);
  } catch (error) {
    console.error("TEMPLATE_GET_ERROR", error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}