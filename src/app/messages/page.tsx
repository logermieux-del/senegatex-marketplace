'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  body: string;
  fromUser: { name: string };
  toUser: { name: string };
  listing?: { title: string };
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch('/api/messages');
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data.data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading messages...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Yombal
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-700">Login</Link>
            <Link href="/signup" className="bg-orange-500 text-white px-4 py-2 rounded">Sign Up</Link>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Messages</h1>

        {messages.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No messages yet</p>
            <Link href="/" className="text-orange-500 hover:underline">
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white p-4 rounded-lg border hover:border-orange-300">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">
                      {msg.isRead ? '✓' : '●'} From: {msg.fromUser.name}
                    </p>
                    {msg.listing && (
                      <p className="text-sm text-gray-600">About: {msg.listing.title}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{msg.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
