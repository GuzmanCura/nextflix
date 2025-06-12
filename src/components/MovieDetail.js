'use client';

import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const PageContainer = styled.div`
  position: relative;
  color: white;
`;

const BackdropContainer = styled.div`
  position: relative;
  width: 100%;
  height: 560px;
  overflow: hidden;
`;

const BackdropImage = styled(Image)`
  object-fit: cover;
  object-position: center;
`;

const BackdropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(20, 20, 20, 0.4), #141414);
`;

const Content = styled.div`
  position: relative;
  margin-top: -200px;
  padding: 0 3rem 2rem;
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  overflow: visible;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: -100px;
  }
`;

const PosterContainer = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 450px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const Poster = styled(Image)`
  object-fit: cover;
`;

const Details = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem;
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const Year = styled.span`
  font-size: 1.5rem;
  color: #b3b3b3;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: #b3b3b3;
  font-weight: 600;
`;

const Rating = styled(InfoItem)`
  color: #ffd700;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StarIcon = styled.span`
  color: #ffd700;
  font-size: 1rem;
`;

const Description = styled.div`
  margin-bottom: 2rem;
  line-height: 1.6;
  color: #b3b3b3;
`;

const DirectorSection = styled.div`
  margin-bottom: 2rem;
`;

const DirectorHeader = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 1rem;
`;

const DirectorList = styled.div`
  display: flex;
  gap: 1rem;
`;

const DirectorMember = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1.5rem 0.5rem 0.5rem;
  border: solid 2px rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  width: fit-content;
`;

const DirectorImage = styled(Image)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const DirectorImagePlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e50914;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
`;

const DirectorInfo = styled.div`
  flex: 1;
`;

const DirectorName = styled.h4`
  margin: 0;
  font-size: 1rem;
`;

const DirectorRole = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: #b3b3b3;
`;

const CastSection = styled.div`
  margin-top: 2rem;
`;

const CastHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CastTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const CastList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  position: relative;
`;

const ShowAllCastButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  margin: 2rem auto;
  display: block;
  width: fit-content;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CastMember = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CastImage = styled(Image)`
  width: 8rem;
  height: 8rem;
  object-fit: cover;
  object-position: top;
  border-radius: 100px;
  margin: 0 auto;
`;

const CastImagePlaceholder = styled.div`
  width: 8rem;
  height: 8rem;
  background: #e50914;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  border-radius: 100px;
  margin: 0 auto;
`;

const CastInfo = styled.div`
  padding: 0.5rem;
  text-align: center;
`;

const CastName = styled.h4`
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
`;

const CastCharacter = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #b3b3b3;
`;

const RelatedMoviesSection = styled.div`
  margin-top: 3rem;
  padding: 3rem;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
  background: #141414;
`;

const RelatedMoviesHeader = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
`;

const RelatedMoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

const RelatedMovieCard = styled.div`
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const RelatedMovieImage = styled(Image)`
  width: 100%;
  height: auto;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 8px;
`;

const RelatedMovieTitle = styled.h4`
  margin: 0.5rem 0 0;
  font-size: 1rem;
`;

const RelatedMovieYear = styled.span`
  color: #b3b3b3;
  font-size: 0.9rem;
`;

export default function MovieDetail({ movie }) {
  const [showAllCast, setShowAllCast] = useState(false);
  const visibleCast = showAllCast ? movie.cast : movie.cast.slice(0, 8);
  const router = useRouter();

  const handleRelatedMovieClick = (movieSlug) => {
    router.push(`/movie/${movieSlug}`);
  };

  console.log('MovieDetail - Full movie object:', movie);
  console.log('MovieDetail - Related Movies:', movie.relatedMovies);

  return (
    <PageContainer>
      {movie.backdropUrl && (
        <BackdropContainer>
          <BackdropImage
            src={movie.backdropUrl}
            alt={movie.title}
            fill
            priority
          />
          <BackdropOverlay />
        </BackdropContainer>
      )}

      <Content>
        <PosterContainer>
          <Poster
            src={movie.posterUrl}
            alt={movie.title}
            fill
            priority
          />
        </PosterContainer>

        <Details>
          <Title>
            {movie.title}
            <Year>({movie.year})</Year>
          </Title>

          <MetaInfo>
            {movie.rating && (
              <Rating>
                <Label>Rating:</Label>
                <StarIcon>★</StarIcon>
                {(movie.rating / 2).toFixed(1)}
              </Rating>
            )}
            {movie.genres && (
              <InfoItem>
                <Label>Genres:</Label>
                {movie.genres.join(', ')}
              </InfoItem>
            )}
            {movie.runtime && (
              <InfoItem>
                <Label>Runtime:</Label>
                {movie.runtime} min
              </InfoItem>
            )}
          </MetaInfo>

          {movie.description && (
            <Description>
              <h3>Overview</h3>
              <p>{movie.description}</p>
            </Description>
          )}

          {movie.director && (
            <DirectorSection>
              <DirectorHeader>Director</DirectorHeader>
              <DirectorList>
                <DirectorMember>
                  {movie.directorProfilePath ? (
                    <DirectorImage
                      src={movie.directorProfilePath}
                      alt={movie.director}
                      width={60}
                      height={60}
                    />
                  ) : (
                    <DirectorImagePlaceholder>
                      {movie.director.charAt(0)}
                    </DirectorImagePlaceholder>
                  )}
                  <DirectorInfo>
                    <DirectorName>{movie.director}</DirectorName>
                    <DirectorRole>Director</DirectorRole>
                  </DirectorInfo>
                </DirectorMember>
              </DirectorList>
            </DirectorSection>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <CastSection>
              <CastHeader>
                <CastTitle>Cast</CastTitle>
              </CastHeader>
              <CastList>
                {visibleCast.map((actor, index) => (
                  <CastMember key={index}>
                    {actor.profilePath ? (
                      <CastImage
                        src={actor.profilePath}
                        alt={actor.name}
                        width={150}
                        height={225}
                      />
                    ) : (
                      <CastImagePlaceholder>
                        {actor.name.charAt(0)}
                      </CastImagePlaceholder>
                    )}
                    <CastInfo>
                      <CastName>{actor.name}</CastName>
                      <CastCharacter>{actor.character}</CastCharacter>
                    </CastInfo>
                  </CastMember>
                ))}
              </CastList>
              {movie.cast.length > 8 && (
                <ShowAllCastButton onClick={() => setShowAllCast(!showAllCast)}>
                  {showAllCast ? 'Show Less' : 'Show All Cast'}
                </ShowAllCastButton>
              )}
            </CastSection>
          )}
        </Details>
      </Content>

      {movie.relatedMovies && movie.relatedMovies.length > 0 && (
        <RelatedMoviesSection>
          <RelatedMoviesHeader>More Like This</RelatedMoviesHeader>
          <RelatedMoviesGrid>
            {movie.relatedMovies.map((relatedMovie, index) => (
              <RelatedMovieCard 
                key={index}
                onClick={() => handleRelatedMovieClick(relatedMovie.movieSlug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleRelatedMovieClick(relatedMovie.movieSlug);
                  }
                }}
              >
                <RelatedMovieImage
                  src={relatedMovie.posterUrl}
                  alt={relatedMovie.title}
                  width={200}
                  height={300}
                />
                <RelatedMovieTitle>{relatedMovie.title}</RelatedMovieTitle>
                <RelatedMovieYear>({relatedMovie.year})</RelatedMovieYear>
              </RelatedMovieCard>
            ))}
          </RelatedMoviesGrid>
        </RelatedMoviesSection>
      )}
    </PageContainer>
  );
} 