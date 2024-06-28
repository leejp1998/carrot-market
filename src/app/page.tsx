"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  price: number;
  contactInfo: string;
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
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create New Post
      </Link>
      <div className="mt-4">
        {posts.map((post) => (
          <Link
            href={`/posts/${post.id}`}
            key={post.id}
          >
            <div className="border p-4 mb-4 rounded">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>Price: ${post.price}</p>
              <p>Contact or KakaoId: {post.contactInfo}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
