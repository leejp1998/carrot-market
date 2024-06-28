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

    return NextResponse.json({ message: "Authentication successful" });
  } catch (error) {
    console.error("Error authenticating user:", error);
    return NextResponse.json(
      { error: "Error authenticating user" },
      { status: 500 }
    );
  }
}
