"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  contactInfo: string;
  items: Item[];
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
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

  const nextItem = () => {
    if (post) {
      setCurrentItemIndex((prevIndex) => (prevIndex + 1) % post.items.length);
    }
  };

  const prevItem = () => {
    if (post) {
      setCurrentItemIndex(
        (prevIndex) => (prevIndex - 1 + post.items.length) % post.items.length
      );
    }
  };

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
      <p className="mb-4">Contact: {post.contactInfo}</p>

      <div className="mb-4">
        <div className="relative w-full h-64 bg-gray-200">
          <Image
            src={post.items[currentItemIndex].image}
            alt={post.items[currentItemIndex].name}
            layout="fill"
            objectFit="contain"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            <p>{post.items[currentItemIndex].name}</p>
            <p>${post.items[currentItemIndex].price}</p>
          </div>
          <button
            onClick={prevItem}
            className="absolute left-0 top-1/2 bg-black bg-opacity-50 text-white p-2"
          >
            &lt;
          </button>
          <button
            onClick={nextItem}
            className="absolute right-0 top-1/2 bg-black bg-opacity-50 text-white p-2"
          >
            &gt;
          </button>
        </div>
      </div>

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
        className="text-blue-500 hover:underline"
      >
        Back to all posts
      </Link>
    </main>
  );
}
