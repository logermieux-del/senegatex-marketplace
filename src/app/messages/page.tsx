'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';
import { IconBadge } from '@/components/icons/IconBadge';
import { EmptyBoxIcon } from '@/components/icons/CategoryIcons';

interface MessageItem {
  id: string;
  body: string;
  fromUser: { id: string; name: string; avatar?: string };
  toUser: { id: string; name: string };
  listing?: { id: string; title: string };
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const { status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/messages');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data.data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-10 h-10 rounded-full border-4 border-accent-200 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCity={selectedCity}
        onSelectedCityChange={setSelectedCity}
      />
      <div className="min-h-screen bg-neutral-50">
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary-500 font-display">Vos messages</h1>
            <p className="text-accent-600 mt-2 font-sans">Vos échanges avec les acheteurs et vendeurs</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 rounded-full border-4 border-accent-200 border-t-primary-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <IconBadge size={72} className="mb-4">
                <EmptyBoxIcon className="w-9 h-9" />
              </IconBadge>
              <p className="text-xl text-accent-600 font-medium font-sans">Aucun message</p>
              <p className="text-accent-500 mt-2 font-sans">
                Vos échanges avec acheteurs et vendeurs apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white rounded-xl border border-accent-200 p-5 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          msg.isRead ? 'bg-accent-300' : 'bg-success-500'
                        }`}
                      />
                      <p className="font-semibold text-neutral-900 font-sans">De : {msg.fromUser.name}</p>
                    </div>
                    <span className="text-xs text-accent-500 font-sans flex-shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString('fr-SN')}
                    </span>
                  </div>
                  {msg.listing && (
                    <p className="text-sm text-accent-600 mb-2 font-sans">
                      À propos de : {msg.listing.title}
                    </p>
                  )}
                  <p className="text-neutral-700 font-sans">{msg.body}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
