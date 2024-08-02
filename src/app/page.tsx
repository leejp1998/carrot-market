"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Post {
  id: string;
  title: string;
  items: Item[];
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <Link
        href="/new-post"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Create New Post
      </Link>
      <div className="space-y-4 mt-4">
        {posts.map((post) => (
          <Link
            href={`/posts/${post.id}`}
            key={post.id}
            className="block border p-4 rounded hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mr-4 flex-shrink-0 w-1/4">
              {post.title}
            </h2>
            <div className="flex overflow-x-auto space-x-2 flex-grow">
              {post.items.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-24 h-24 relative"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
