import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useTagStore } from '../../store/tag.store';

import './HybridInput.css';

function fetchData() {
  return fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete')
    .then(response => response.json());
};

type TyData = {
  category: string;
  id: string;
  name: string;
  value: number;
}

const HybridInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isLoading,
    isError,
    data = [],
    error,
  } = useQuery<TyData[], Error>({
    queryKey: ['data'],
    queryFn: fetchData,
    initialData: [],
  });

  const tags = useTagStore((state) => state.tags);
  const suggestions = data.slice(0, 30); // in array 2 same elements (number 31 and 34)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setInputValue(currentValue);

    if (!currentValue.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions.filter(
      suggestion => suggestion.name.toLowerCase().includes(currentValue.toLowerCase())
    );

    setFilteredSuggestions(filtered.map(suggestion => suggestion.name));
  };

  const handleSelectSuggestion = (suggestion: string) => {
    useTagStore.getState().addTag(suggestion);
    setFilteredSuggestions([]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        const currentValue = inputValue.trim();
        if (currentValue) {
          useTagStore.getState().addTag(currentValue);
          setInputValue('');
          setFilteredSuggestions([]);
        }
        break;

      case 'Backspace':
        if (inputValue === '') {
          // Delete last tag
          useTagStore.getState().setTags(tags.slice(0, -1));
        }
        break;

      default:
        break;
    }
  };

  const handleTagClick = (index: number) => {
    // Edit tag at index
    const editedTag = prompt('Edit Tag:', tags[index]);
    if (editedTag !== null) {
      useTagStore.getState().updatedTag(editedTag, index);
    }
  };

  const handleDeleteTag = (index: number) => {
    // Delete tag at index
    useTagStore.getState().deleteTag(index);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className='tags__list'>
        {tags.map((tag, i) => (
          <div key={i} className='tags'>
            <div className="tag" onClick={() => handleTagClick(i)}>
              {tag}
            </div>

            {/^[/*\-+=!@#$%^&*()]{1}$/.test(tag) === false && (
              <button className="delete" onClick={() => handleDeleteTag(i)}>×</button>
            )}
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          className="HybridInput__input"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Type here..."
        />
      </div>

      {!!filteredSuggestions.length && (
        <div className='suggestions__list'>
          {filteredSuggestions.map((item) => (
            <button
              key={item}
              onClick={() => handleSelectSuggestion(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HybridInput;

