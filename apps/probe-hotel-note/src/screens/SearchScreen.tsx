import React, { useState, useEffect, useRef } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { searchCars } from '../fixtures/cars';
import type { Car } from '../types';

export default function SearchScreen(): React.JSX.Element {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Car[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{ text: string }>>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    try {
      const stored = localStorage.getItem('recentSearches');
      if (stored) setRecentSearches(JSON.parse(stored) as string[]);
    } catch {
      // no recent searches
    }
  }, []);

  function handleQueryChange(value: string): void {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSuggestions([]);
      setResults([]);
      setHasSearched(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchCars(value);
        setSuggestions(data.suggestions);
        setResults(data.results);
        setHasSearched(true);
      } catch {
        // search failed
      }
    }, 300);
  }

  function handleSubmitSearch(): void {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    try { localStorage.setItem('recentSearches', JSON.stringify(updated)); } catch { /* */ }
  }

  function removeRecentSearch(q: string): void {
    const updated = recentSearches.filter(s => s !== q);
    setRecentSearches(updated);
    try { localStorage.setItem('recentSearches', JSON.stringify(updated)); } catch { /* */ }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('home')} aria-label={t('search.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => handleQueryChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmitSearch(); }}
          placeholder={t('search.placeholder')}
          aria-label={t('search.aria')}
          data-testid="search-input"
          className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </header>

      {!query && recentSearches.length > 0 && (
        <section className="p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2">{t('search.recent')}</h3>
          {recentSearches.map(rs => (
            <div key={rs} className="flex items-center gap-3 py-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <button type="button" onClick={() => { setQuery(rs); handleQueryChange(rs); }} className="flex-1 text-left text-sm">{rs}</button>
              <button type="button" onClick={() => removeRecentSearch(rs)} aria-label={`${t('search.removeRecent')} ${rs}`} className="text-gray-400 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </section>
      )}

      {query && suggestions.length > 0 && !hasSearched && (
        <div className="px-4">
          {suggestions.map(s => (
            <button key={s.text} type="button" onClick={() => { setQuery(s.text); handleQueryChange(s.text); }} className="flex items-center gap-3 py-3 w-full text-left">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="text-sm">{s.text}</span>
            </button>
          ))}
        </div>
      )}

      {hasSearched && results.length > 0 && (
        <div className="p-4 space-y-3">
          {results.map(car => (
            <button key={car.id} type="button" onClick={() => navigate('car-detail', { currentCarId: car.id })} aria-label={car.name} data-testid="search-result-card" className="w-full flex bg-white rounded-xl shadow-sm overflow-hidden text-left hover:shadow-md transition-shadow">
              <img src={car.thumbnailUrl} alt={car.name} className="w-24 aspect-[4/3] object-cover" />
              <div className="p-3 flex-1 flex flex-col gap-1">
                <span className="text-sm font-bold">{car.name}</span>
                <span className="text-sm font-bold text-blue-600">{car.formattedPrice}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${car.condition === 'M\u1edbi' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{car.condition}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p className="text-center text-gray-700">{t('search.noResults')}</p>
          <h3 className="text-sm font-bold">{t('search.popular')}</h3>
        </div>
      )}
    </div>
  );
}
