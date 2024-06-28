"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  price: number;
  contactInfo: string;
  expiresAt: string;
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/posts/${params.id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => setError("Error fetching post"));
  }, [params.id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/posts/${params.id}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      router.push(`/posts/${params.id}/edit`);
    } else {
      setError("Invalid credentials");
    }
  };

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/posts/${params.id}/extend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      setPost(updatedPost);
      setIsExtending(false);
      setUsername("");
      setPassword("");
      setError("");
    } else {
      setError("Invalid credentials.");
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p>Price: ${post.price}</p>
      <p>Contact or KakaoId: {post.contactInfo}</p>
      <p>Expires at: {new Date(post.expiresAt).toLocaleString()}</p>

      <div className="mt-4 space-x-4">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500"
        >
          Edit
        </button>
        <button
          onClick={() => setIsExtending(true)}
          className="text-green-500"
        >
          Extend the post
        </button>
      </div>

      {(isEditing || isExtending) && (
        <form
          onSubmit={isEditing ? handleEdit : handleExtend}
          className="mt-4 space-y-4"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isEditing ? "Authenticate to Edit" : "Extend Post"}
          </button>
        </form>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <Link
        href="/"
        className="block mt-4 text-blue-500"
      >
        Back to all posts
      </Link>
    </main>
  );
}
