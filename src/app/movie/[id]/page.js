'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import MovieDetail from '../../../components/MovieDetail';

const Container = styled.div`
  min-height: 100vh;
  background: #141414;
  position: relative;
`;

const LoadingContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavigationContainer = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 100;
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

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

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem;
  padding-right: 1rem;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  & svg {
    width: 16px;
    height: 16px;
  }
`;

const BackIcon = styled.span`
  margin-right: 0.5rem;
`;

const HomeButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  & svg {
    width: 16px;
    height: 16px;
  }
`;

const HomeIcon = styled.span`
  margin-right: 0.5rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #e50914;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.p`
  color: #e50914;
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(229, 9, 20, 0.1);
  border-radius: 4px;
`;

export default function MoviePage({ params }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const [fromTitle, setFromTitle] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isMounted = true;

    const loadMovie = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check if we came from a related movie
        const searchParams = new URLSearchParams(window.location.search);
        const from = searchParams.get('from');
        const title = searchParams.get('fromTitle');
        setShowBackButton(!!from);
        setFromTitle(title || '');

        const movies = JSON.parse(localStorage.getItem('movies') || '[]');
        const foundMovie = movies.find(m => m.movieSlug === params.id);
        
        if (foundMovie && isMounted) {
          // Find related movies based on director and top 3 actors
          const topActors = foundMovie.cast?.slice(0, 3) || [];

          const relatedMovies = movies
            .filter(m => 
              m.movieSlug !== params.id && // Exclude current movie
              (
                m.director === foundMovie.director || // Same director
                topActors.some(actor => 
                  m.cast?.some(movieActor => movieActor.name === actor.name)
                ) // Has at least one of the top 3 actors
              )
            )
            .sort((a, b) => {
              // First priority: Same director
              if (a.director === foundMovie.director && b.director !== foundMovie.director) return -1;
              if (b.director === foundMovie.director && a.director !== foundMovie.director) return 1;
              
              // Second priority: Number of shared top actors
              const aSharedActors = topActors.filter(actor => 
                a.cast?.some(movieActor => movieActor.name === actor.name)
              ).length;
              const bSharedActors = topActors.filter(actor => 
                b.cast?.some(movieActor => movieActor.name === actor.name)
              ).length;
              
              if (aSharedActors !== bSharedActors) {
                return bSharedActors - aSharedActors;
              }
              
              // Third priority: Year (newer movies first)
              return b.year - a.year;
            });
          
          const movieWithRelated = { ...foundMovie, relatedMovies };
          if (isMounted) {
            setMovie(movieWithRelated);
          }
        } else if (isMounted) {
          setError('Movie not found');
        }
      } catch (err) {
        console.error('Error loading movie:', err);
        if (isMounted) {
          setError('Failed to load movie');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMovie();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  const handleBack = () => {
    if (showBackButton) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleRelatedMovieClick = (movieSlug) => {
    router.push(`/movie/${movieSlug}?from=${params.id}&fromTitle=${encodeURIComponent(movie.title)}`);
  };

  return (
    <Container>
      <NavigationContainer>
        {showBackButton && (
          <HomeButton onClick={handleHome}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </HomeButton>
        )}
        <BackButton onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {showBackButton ? `${fromTitle}` : 'Back to Home'}
        </BackButton>
      </NavigationContainer>
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : movie ? (
        <MovieDetail movie={movie} />
      ) : null}
    </Container>
  );
} 