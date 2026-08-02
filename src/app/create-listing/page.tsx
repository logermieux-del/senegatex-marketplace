'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Textarea, Select, Alert, Card, CardBody } from '@/components/common';

const CATEGORIES = [
  { value: '', label: 'Select a category' },
  { value: 'Electronics', label: '📱 Electronics' },
  { value: 'Fashion', label: '👗 Fashion & Clothing' },
  { value: 'Furniture', label: '🛋️ Furniture' },
  { value: 'Sports', label: '⚽ Sports & Outdoors' },
  { value: 'Books', label: '📚 Books & Media' },
  { value: 'Other', label: '📦 Other' },
];

const CITIES = [
  { value: '', label: 'Select a city' },
  { value: 'Dakar', label: '🏙️ Dakar' },
  { value: 'Thiès', label: '🏘️ Thiès' },
  { value: 'Kaolack', label: '🏘️ Kaolack' },
  { value: 'Saint-Louis', label: '🏘️ Saint-Louis' },
  { value: 'Tambacounda', label: '🏘️ Tambacounda' },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    city: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (parseInt(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.city) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price) * 1000, // Convert to lowest unit
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create listing');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating listing');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Yombal
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-700 hover:text-orange-500">
              Login
            </Link>
            <Link href="/signup" className="bg-orange-500 text-white px-4 py-2 rounded">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-orange-500 hover:underline mb-6 inline-block">
          ← Back
        </Link>

        <Card>
          <CardBody>
            <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
            <p className="text-gray-600 mb-6">Share what you&apos;re selling with the Yombal community</p>

            {error && (
              <div className="mb-6">
                <Alert
                  type="error"
                  title="Error"
                  message={error}
                  onClose={() => setError(null)}
                />
              </div>
            )}

            {success && (
              <div className="mb-6">
                <Alert
                  type="success"
                  title="Success!"
                  message="Your listing has been published. Redirecting..."
                  dismissible={false}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <Input
                label="Listing Title"
                name="title"
                placeholder="e.g., iPhone 13 Pro, Used Bicycle"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                hint="Be specific and descriptive"
              />

              {/* Description */}
              <Textarea
                label="Description"
                name="description"
                placeholder="Describe the item, condition, features..."
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                hint="Minimum 10 characters"
                rows={6}
              />

              {/* Category & City */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Category"
                  name="category"
                  options={CATEGORIES}
                  value={formData.category}
                  onChange={handleChange}
                  error={errors.category}
                />

                <Select
                  label="City"
                  name="city"
                  options={CITIES}
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                />
              </div>

              {/* Price */}
              <Input
                label="Price (XOF)"
                name="price"
                type="number"
                placeholder="e.g., 500"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                hint="Enter in thousands (e.g., 500 = 500k XOF)"
              />

              {/* Submit */}
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading || success}
                className="w-full"
              >
                {success ? '✓ Published!' : 'Publish Listing'}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: '📸', title: 'Good Photos', desc: 'Add clear, well-lit photos' },
            { icon: '📝', title: 'Details Matter', desc: 'Be honest about condition' },
            { icon: '💰', title: 'Fair Price', desc: 'Check similar listings' },
          ].map((tip, i) => (
            <Card key={i} className="text-center">
              <div className="text-3xl mb-2">{tip.icon}</div>
              <h3 className="font-bold mb-1">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
