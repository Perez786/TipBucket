import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import Template from '@/models/Template';
import dbConnect from '@/lib/mongoose';

export async function GET(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const template = await Template.findById(params.templateId);

    if (!template) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    // Ensure the user owns the template
    if (template.userId.toString() !== (session.user as any)?.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();
    const { templateId } = params;

    const template = await Template.findById(templateId);

    if (!template) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    if (template.userId.toString() !== (session.user as any)?.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedTemplate = await Template.findByIdAndUpdate(templateId, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedTemplate, { status: 200 });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { templateId } = params;

  if (!templateId) {
    return NextResponse.json(
      { message: 'Template ID is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const template = await Template.findById(templateId);

    if (!template) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    // Ensure the user owns the template
    if (template.userId.toString() !== (session.user as any)?.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await Template.findByIdAndDelete(templateId);

    return NextResponse.json(
      { message: 'Template deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
