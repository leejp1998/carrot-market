import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { title, items, contactInfo, username, password } =
    await request.json();

  try {
    // Check if the user already exists
    let user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      // If user doesn't exist, create a new one
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
    } else {
      // If user exists, verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid password. Try another username or password." },
          { status: 401 }
        );
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        contactInfo,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        userId: user.id,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            image: item.image,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
