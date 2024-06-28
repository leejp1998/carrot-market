"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          contactInfo,
          username,
          password,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(
          errorData.error || "An error occurred while creating the post"
        );
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="title"
            className="block"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label
            htmlFor="contactInfo"
            className="block"
          >
            Contact Info
          </label>
          <input
            type="text"
            id="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </form>
    </main>
  );
}
