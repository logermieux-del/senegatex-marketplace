'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ImmobilierListings } from '@/components/immobilier/ImmobilierListings';

export default function ImmobilierAchatPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCity={selectedCity}
        onSelectedCityChange={setSelectedCity}
      />
      <div className="min-h-screen bg-neutral-50">
        <ImmobilierListings
          transactionType="achat"
          title="Achat"
          description="Biens bâtis et terrains non bâtis à acheter au Sénégal"
          searchQuery={searchQuery}
          city={selectedCity}
        />
      </div>
    </>
  );
}
