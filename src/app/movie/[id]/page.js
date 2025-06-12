'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import MovieDetail from '../../../components/MovieDetail';

const Container = styled.div`
  min-height: 100vh;
  background: #141414;
  color: white;
  overflow-x: hidden;
  position: relative;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  left: 1rem;
  top: 1rem;
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const Loading = styled.p`
  color: #b3b3b3;
  text-align: center;
  margin: 2rem 0;
  font-size: 1.2rem;
`;

const Error = styled.p`
  color: #e50914;
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(229, 9, 20, 0.1);
  border-radius: 4px;
`;

export default function MoviePage({ params }) {
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovie = () => {
      try {
        const movies = JSON.parse(localStorage.getItem('movies') || '[]');
        console.log('Looking for movie with slug:', params.id); // Debug log
        console.log('Available movies:', movies.map(m => ({ title: m.title, slug: m.movieSlug }))); // Debug log
        
        const foundMovie = movies.find(m => m.movieSlug === params.id);
        if (foundMovie) {
          console.log('Found movie:', foundMovie); // Debug log
          
          // Find related movies based on director, genres, and cast
          const relatedMovies = movies
            .filter(m => 
              m.movieSlug !== params.id && // Exclude current movie
              (
                m.director === foundMovie.director || // Same director
                m.genres.some(genre => foundMovie.genres.includes(genre)) || // Shared genres
                m.cast?.some(actor => foundMovie.cast?.some(foundActor => 
                  foundActor.name === actor.name
                )) // Shared cast members
              )
            )
            .sort((a, b) => {
              // Prioritize movies with same director
              if (a.director === foundMovie.director && b.director !== foundMovie.director) return -1;
              if (b.director === foundMovie.director && a.director !== foundMovie.director) return 1;
              
              // Then prioritize by number of shared cast members
              const aSharedCast = a.cast?.filter(actor => 
                foundMovie.cast?.some(foundActor => foundActor.name === actor.name)
              ).length || 0;
              const bSharedCast = b.cast?.filter(actor => 
                foundMovie.cast?.some(foundActor => foundActor.name === actor.name)
              ).length || 0;
              if (aSharedCast !== bSharedCast) return bSharedCast - aSharedCast;
              
              // Finally sort by number of shared genres
              const aSharedGenres = a.genres.filter(g => foundMovie.genres.includes(g)).length;
              const bSharedGenres = b.genres.filter(g => foundMovie.genres.includes(g)).length;
              return bSharedGenres - aSharedGenres;
            })
            .slice(0, 6); // Limit to 6 related movies
          
          console.log('Found related movies:', {
            count: relatedMovies.length,
            movies: relatedMovies.map(m => ({ 
              title: m.title, 
              director: m.director,
              sharedCast: m.cast?.filter(actor => 
                foundMovie.cast?.some(foundActor => foundActor.name === actor.name)
              ).map(actor => actor.name) || []
            }))
          });
          
          const movieWithRelated = { ...foundMovie, relatedMovies };
          console.log('Setting movie with related:', {
            title: movieWithRelated.title,
            hasRelatedMovies: !!movieWithRelated.relatedMovies,
            relatedMoviesCount: movieWithRelated.relatedMovies?.length
          });
          
          setMovie(movieWithRelated);
        } else {
          console.error('Movie not found with slug:', params.id); // Debug log
          setError('Movie not found');
        }
      } catch (err) {
        console.error('Error loading movie:', err); // Debug log
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <Loading>Loading movie details...</Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <BackButton onClick={handleBack}>← Back</BackButton>
        <Error>{error}</Error>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={handleBack}>← Back</BackButton>
      {movie && <MovieDetail movie={movie} />}
    </Container>
  );
} 