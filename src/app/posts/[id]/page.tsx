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
  contactInfo: string;
  items: Item[];
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/posts/${params.id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
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

      <Link
        href="/"
        className="text-blue-500 hover:underline"
      >
        Back to all posts
      </Link>
    </main>
  );
}
