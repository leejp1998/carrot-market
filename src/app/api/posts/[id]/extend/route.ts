import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { username, password } = await request.json();

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.user.username !== username) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, post.user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error extending post:", error);
    return NextResponse.json(
      { error: "Error extending post" },
      { status: 500 }
    );
  }
}
