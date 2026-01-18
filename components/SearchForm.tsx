
import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (jobTitle: string, location: string) => void;
  disabled: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, disabled }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobTitle && location) {
      onSearch(jobTitle, location);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Role (e.g. Senior Financial Analyst)"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={disabled}
              required
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Location (e.g. New York, NY)"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={disabled}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={disabled || !jobTitle || !location}
          className="w-full py-4 accent-gradient rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-2xl shadow-indigo-500/10"
        >
          Initialize 2026 Market Analysis
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
