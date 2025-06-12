'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import MovieGrid from '../components/MovieGrid';
import RandomButton from '../components/RandomButton';
import FilterBar from '../components/FilterBar';

const Main = styled.main`
  min-height: 100vh;
  background: #141414;
  color: white;
  padding: 2rem 1rem;
  overflow: hidden;
  display: block;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: block;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #e50914;
  letter-spacing: -0.5px;
  
  @media (min-width: 768px) {
    font-size: 3.5rem;
    margin-bottom: 0.75rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 2.5rem;
  color: #b3b3b3;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto 2.5rem;
  width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
  color: white;
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #e50914;
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
  }

  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #e50914;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  width: 100%;
  
  @media (min-width: 768px) {
    width: auto;
  }

  &:hover {
    background: #f40612;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Error = styled.p`
  color: #e50914;
  text-align: center;
  margin: 1rem auto;
  padding: 1rem;
  background: rgba(229, 9, 20, 0.1);
  border-radius: 8px;
  max-width: 600px;
`;

const Loading = styled.p`
  color: #b3b3b3;
  text-align: center;
  margin: 1rem auto;
  font-size: 1.2rem;
  max-width: 600px;
`;

export default function Home() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUrl, setLastUrl] = useState('');
  const [directors, setDirectors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [filteredDirectors, setFilteredDirectors] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);

  // Load last used URL and movies on initial render
  useEffect(() => {
    const savedUrl = localStorage.getItem('lastLetterboxdUrl');
    const savedMovies = localStorage.getItem('movies');
    
    if (savedUrl) {
      setLastUrl(savedUrl);
      const input = document.querySelector('input');
      if (input) {
        input.value = savedUrl;
      }
    }
    
    if (savedMovies) {
      const parsedMovies = JSON.parse(savedMovies);
      console.log('Loaded movies from localStorage:', parsedMovies[0]);
      setMovies(parsedMovies);
      setFilteredMovies(parsedMovies);
      updateFilterOptions(parsedMovies);
    }
  }, []);

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Update filter options whenever movies change
  useEffect(() => {
    updateFilterOptions();
  }, [movies]);

  // Update filtered options whenever search or filters change
  useEffect(() => {
    updateFilteredOptions();
  }, [movies, debouncedSearchValue, selectedDirector, selectedGenre]);

  // Apply filters and sorting whenever relevant states change
  useEffect(() => {
    applyFilters();
  }, [movies, selectedDirector, selectedGenre, sortValue, debouncedSearchValue]);

  const updateFilterOptions = () => {
    const uniqueDirectors = [...new Set(movies.map(movie => movie.director))].sort();
    const uniqueGenres = [...new Set(movies.flatMap(movie => movie.genres))].sort();
    setDirectors(uniqueDirectors);
    setGenres(uniqueGenres);
    setFilteredDirectors(uniqueDirectors);
    setFilteredGenres(uniqueGenres);
  };

  const updateFilteredOptions = () => {
    // Start with all movies
    let filtered = movies;

    // Apply search filter
    if (debouncedSearchValue) {
      const searchLower = debouncedSearchValue.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchLower) ||
        movie.director.toLowerCase().includes(searchLower) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchLower))
      );
    }

    // Update director options based on current filter
    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genres.includes(selectedGenre));
    }
    const availableDirectors = [...new Set(filtered.map(movie => movie.director))].sort();
    setFilteredDirectors(availableDirectors);

    // Reset filtered movies to apply search
    filtered = movies;
    if (debouncedSearchValue) {
      const searchLower = debouncedSearchValue.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchLower) ||
        movie.director.toLowerCase().includes(searchLower) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchLower))
      );
    }

    // Update genre options based on current filter
    if (selectedDirector) {
      filtered = filtered.filter(movie => movie.director === selectedDirector);
    }
    const availableGenres = [...new Set(filtered.flatMap(movie => movie.genres))].sort();
    setFilteredGenres(availableGenres);
  };

  const applyFilters = () => {
    // Start with all movies
    let filtered = movies;

    // Apply search filter first (most restrictive)
    if (debouncedSearchValue) {
      const searchLower = debouncedSearchValue.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchLower) ||
        movie.director.toLowerCase().includes(searchLower) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchLower))
      );
    }

    // Then apply director filter
    if (selectedDirector) {
      filtered = filtered.filter(movie => movie.director === selectedDirector);
    }

    // Then apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genres.includes(selectedGenre));
    }

    // Finally apply sorting
    if (sortValue) {
      const [field, order] = sortValue.split('-');
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;
        if (field === 'year') {
          comparison = a.year - b.year;
        } else if (field === 'rating') {
          comparison = a.rating - b.rating;
        } else if (field === 'title') {
          comparison = a.title.localeCompare(b.title);
        }
        return order === 'desc' ? -comparison : comparison;
      });
    }

    setFilteredMovies(filtered);
  };

  const handleSort = (value) => {
    setSortValue(value);
  };

  const handleDirectorChange = (value) => {
    setSelectedDirector(value);
    setSelectedGenre(''); // Reset genre when director changes
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
    setSelectedDirector(''); // Reset director when genre changes
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleLoadMovies = async (listUrl) => {
    if (!listUrl) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/movies?url=${encodeURIComponent(listUrl)}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load movies');
      }
      const data = await response.json();
      console.log('API response first movie:', JSON.stringify(data[0], null, 2));
      setMovies(data);
      setFilteredMovies(data);
      updateFilterOptions(data);
      // Reset filters
      setSelectedDirector('');
      setSelectedGenre('');
      setSortValue('');
      setSearchValue('');
      // Save movies and URL to localStorage
      localStorage.setItem('movies', JSON.stringify(data));
      localStorage.setItem('lastLetterboxdUrl', listUrl);
      setLastUrl(listUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomSelect = () => {
    if (movies.length === 0) return;
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    console.log('Random movie selected:', JSON.stringify(randomMovie, null, 2)); // Debug log with full structure
    if (!randomMovie.movieSlug) {
      console.error('No movieSlug found in movie data:', randomMovie);
      return;
    }
    router.push(`/movie/${randomMovie.movieSlug}`);
  };

  const handleMovieClick = (movie) => {
    console.log('Main page: Movie clicked:', JSON.stringify(movie, null, 2)); // Debug log with full structure
    if (!movie.movieSlug) {
      console.error('No movieSlug found in movie data:', movie);
      return;
    }
    console.log('Navigating to:', `/movie/${movie.movieSlug}`); // Debug log
    router.push(`/movie/${movie.movieSlug}`);
  };

  const handleClearFilters = () => {
    setSelectedDirector('');
    setSelectedGenre('');
    setSortValue('');
    setSearchValue('');
    // Reset select elements to their default values
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      select.value = '';
    });
  };

  return (
    <Main>
      <Container>
        <Title>Nextflix</Title>
        <Description>
          Load your Letterboxd list and get a random movie suggestion
        </Description>

        <InputContainer>
          <Input
            type="text"
            placeholder="Paste your Letterboxd list URL here"
            defaultValue={lastUrl}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLoadMovies(e.target.value);
              }
            }}
          />
          <Button
            onClick={() => {
              const input = document.querySelector('input');
              handleLoadMovies(input.value);
            }}
          >
            Load Movies
          </Button>
        </InputContainer>

        {error && <Error>{error}</Error>}
        
        {loading && <Loading>Loading movies...</Loading>}

        {movies.length > 0 && (
          <>
            <FilterBar 
              onSortChange={handleSort}
              onDirectorChange={handleDirectorChange}
              onGenreChange={handleGenreChange}
              onClearFilters={handleClearFilters}
              onSearchChange={handleSearchChange}
              searchValue={searchValue}
              directors={filteredDirectors}
              genres={filteredGenres}
            />
            <RandomButton onSelect={handleRandomSelect} />
            <MovieGrid 
              movies={filteredMovies} 
              onMovieClick={handleMovieClick}
            />
          </>
        )}
      </Container>
    </Main>
  );
} 