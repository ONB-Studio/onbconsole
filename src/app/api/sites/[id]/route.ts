// src/app/api/sites/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import pool from '@/lib/pg';

type DeleteContext = {
  params: {
    id: string;
  };
};

export async function DELETE(
  req: Request,
  context: DeleteContext
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;

  try {
    const result = await pool.query(
      'DELETE FROM next_auth.sites WHERE id = $1 AND user_id = $2',
      [id, session.user.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Site not found or user not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Site deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
