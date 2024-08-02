"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

interface Item {
  name: string;
  price: number;
  image: string; // This will be a data URL
}

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAddItem = (newItem: Item) => {
    setItems([...items, newItem]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (items.length === 0) {
      setError("Please add at least one item to your post.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          items,
          contactInfo,
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      setSuccess("Post created successfully!");
      // redirect to the new post
      router.push(`/posts/${data.id}`);
    } catch (err) {
      setError("An error occurred while creating the post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextItem = () => {
    setCurrentItemIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevItem = () => {
    setCurrentItemIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
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

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Item
        </button>

        {items.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Added Items:</h2>
            <div className="relative w-full h-64 bg-gray-200">
              <Image
                src={items[currentItemIndex].image}
                alt={items[currentItemIndex].name}
                layout="fill"
                objectFit="contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <p>{items[currentItemIndex].name}</p>
                <p>${items[currentItemIndex].price}</p>
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
        )}

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
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </form>

      {showModal && (
        <AddItemModal
          onAddItem={handleAddItem}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}

function AddItemModal({
  onAddItem,
  onClose,
}: {
  onAddItem: (item: Item) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent, addMore: boolean = false) => {
    e.preventDefault();
    if (name && price && image) {
      onAddItem({ name, price: parseFloat(price), image });
      if (addMore) {
        resetForm();
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Item</h2>
        <form
          onSubmit={(e) => handleSubmit(e, false)}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block"
            >
              Item Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              htmlFor="image"
              className="block"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              required
              className="w-full border p-2 rounded"
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-2 max-w-full h-32 object-contain"
              />
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add New Item
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
