'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ImmobilierListings } from '@/components/immobilier/ImmobilierListings';

export default function ImmobilierVentePage() {
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
          transactionType="vente"
          title="Vente"
          description="Vendez vos biens bâtis ou vos terrains non bâtis"
          searchQuery={searchQuery}
          city={selectedCity}
        />
      </div>
    </>
  );
}
