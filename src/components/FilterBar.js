'use client';

import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 200px;
`;

const SearchInput = styled.input`
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 4px;
  background: #1a1a1a;
  color: #b3b3b3;
  border: 1px solid #333;
  font-size: 0.9rem;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    border-color: #e50914;
  }

  &:focus {
    outline: none;
    border-color: #e50914;
    color: white;
  }

  &::placeholder {
    color: #666;
  }
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #e50914;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: #1a1a1a;
  color: #b3b3b3;
  border: 1px solid #333;
  cursor: pointer;
  font-size: 0.9rem;
  min-width: 150px;
  transition: all 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b3b3b3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  padding-right: 2.5rem;

  &:hover {
    color: white;
    border-color: #e50914;
  }

  &:focus {
    outline: none;
    border-color: #e50914;
    color: white;
  }
`;

const Option = styled.option`
  background: #1a1a1a;
  color: white;
  padding: 0.5rem;
`;

const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: #1a1a1a;
  color: #b3b3b3;
  border: 1px solid #333;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    border-color: #e50914;
  }
`;

export default function FilterBar({ 
  onSortChange, 
  onDirectorChange, 
  onGenreChange, 
  onClearFilters, 
  onSearchChange,
  searchValue,
  directors, 
  genres 
}) {
  return (
    <FilterContainer>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search movies..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchValue && (
          <ClearSearchButton onClick={() => onSearchChange('')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </ClearSearchButton>
        )}
      </SearchContainer>

      <Select 
        onChange={(e) => onSortChange(e.target.value)}
        defaultValue=""
      >
        <Option value="">Sort by...</Option>
        <Option value="year-desc">Year (Newest)</Option>
        <Option value="year-asc">Year (Oldest)</Option>
        <Option value="rating-desc">Rating (Highest)</Option>
        <Option value="rating-asc">Rating (Lowest)</Option>
        <Option value="title-asc">Title (A-Z)</Option>
        <Option value="title-desc">Title (Z-A)</Option>
      </Select>

      <Select 
        onChange={(e) => onDirectorChange(e.target.value)}
        defaultValue=""
      >
        <Option value="">All Directors</Option>
        {directors.map((director) => (
          <Option key={director} value={director}>
            {director}
          </Option>
        ))}
      </Select>

      <Select 
        onChange={(e) => onGenreChange(e.target.value)}
        defaultValue=""
      >
        <Option value="">All Genres</Option>
        {genres.map((genre) => (
          <Option key={genre} value={genre}>
            {genre}
          </Option>
        ))}
      </Select>

      <ClearButton onClick={onClearFilters}>
        Clear Filters
      </ClearButton>
    </FilterContainer>
  );
} 