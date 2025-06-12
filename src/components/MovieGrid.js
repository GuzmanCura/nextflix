'use client';

import styled from 'styled-components';
import MovieCard from './MovieCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  position: relative;
  z-index: 1;
`;

export default function MovieGrid({ movies, onMovieClick }) {
  return (
    <Grid>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onMovieClick(movie)}
        />
      ))}
    </Grid>
  );
} 