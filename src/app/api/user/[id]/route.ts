// Item endpoint for User: GET (one), PATCH (update), DELETE
import { NextRequest, NextResponse } from 'next/server';

// TODO: Import handler utilities and User schemas

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // TODO: Validate id, fetch user
  return NextResponse.json({
    message: `Get user ${params.id} - to be implemented`,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // TODO: Validate id and body, update user
  return NextResponse.json({
    message: `Update user ${params.id} - to be implemented`,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // TODO: Validate id, delete user
  return NextResponse.json({
    message: `Delete user ${params.id} - to be implemented`,
  });
}
