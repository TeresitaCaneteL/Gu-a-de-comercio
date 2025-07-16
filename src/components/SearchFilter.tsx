import { useState } from 'react';

type Props = {
  categories: string[];
  onFilter: (search: string, selected: string[]) => void;
};

export default function SearchFilter({ categories, onFilter }: Props) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    onFilter(val, selected);
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cat = e.target.id;
    const newSel = e.target.checked
      ? [...selected, cat]
      : selected.filter(c => c !== cat);
    setSelected(newSel);
    onFilter(search, newSel);
  };

  return (
    <div className="mb-6 space-y-4">
      <input
        type="text"
        placeholder="Buscar comercio..."
        value={search}
        onChange={handleSearch}
        className="w-full p-2 border rounded-md bg-gray-50"
      />

      <div className="flex flex-wrap gap-4">
        {categories.map((cat: string) => {
          const label = cat.replace(/^.*?:\s*/, ''); // quita todo antes de ": "
          return (
            <label key={cat} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={cat}
                checked={selected.includes(cat)}
                onChange={handleCheckbox}
                className="h-4 w-4 text-indigo-600"
              />
              <span className="text-gray-700">{label}</span>
            </label>
          );
        })}
      </div>

    </div>
  );
}
