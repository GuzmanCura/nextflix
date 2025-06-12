'use client';

import { useState } from 'react';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { useRouter } from 'next/navigation';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const PageContainer = styled.div`
  position: relative;
  color: white;
`;

const BackdropContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
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
  gap: 4rem;
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
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.05);
  }
`;

const RelatedMovieImage = styled(Image)`
  width: 100%;
  height: auto;
  position: relative;
  object-fit: cover;
  border-radius: 8px;
`;

const RelatedMovieTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: white;
`;

const RelatedMovieYear = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

const RelatedMovieInfo = styled.div`
  padding: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ReviewsSection = styled.div`
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

const ReviewsHeader = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

const ReviewCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ReadReviewLink = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem 0;
  margin-top: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: underline;
  text-underline-offset: 4px;

  &:hover {
    color: #e0e0e0;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ReviewerImage = styled(Image)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const ReviewerImagePlaceholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e50914;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ReviewerInfo = styled.div`
  flex: 1;
`;

const ReviewerName = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const ReviewDate = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #b3b3b3;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
  font-weight: 600;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: #181818;
  border-radius: 8px;
  padding: 2.5rem;
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  animation: ${slideUp} 0.3s ease-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FullReviewContent = styled.div`
  color: #b3b3b3;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  padding: 0 0.5rem;

  strong, b {
    color: white;
    font-weight: 600;
  }

  em, i {
    font-style: italic;
    color: #e0e0e0;
  }

  a {
    color: #e50914;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #ff0f1a;
      text-decoration: underline;
    }
  }

  blockquote {
    border-left: 3px solid #e50914;
    margin: 1.5rem 0;
    padding: 0.75rem 0 0.75rem 1.5rem;
    color: #e0e0e0;
    font-style: italic;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0 4px 4px 0;
  }

  p {
    margin: 1rem 0;
  }
`;

const ModalReviewHeader = styled(ReviewHeader)`
  padding: 0 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
`;

const ModalReviewerImagePlaceholder = styled(ReviewerImagePlaceholder)`
  width: 56px;
  height: 56px;
  font-size: 1.4rem;
`;

const ModalReviewerInfo = styled(ReviewerInfo)`
  gap: 0.5rem;
`;

const ModalReviewerName = styled(ReviewerName)`
  font-size: 1.2rem;
`;

const ModalReviewDate = styled(ReviewDate)`
  font-size: 0.9rem;
`;

const ModalReviewRating = styled(ReviewRating)`
  font-size: 1.1rem;
`;

const ViewMoreReviewsButton = styled.button`
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

const NoRelatedMovies = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin: 1rem 0;
`;

export default function MovieDetail({ movie }) {
  const [showAllCast, setShowAllCast] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showMoreRelated, setShowMoreRelated] = useState(false);
  const visibleCast = showAllCast ? movie.cast : movie.cast.slice(0, 8);
  const visibleReviews = showAllReviews ? movie.reviews : movie.reviews?.slice(0, 3);
  const visibleRelatedMovies = showMoreRelated ? movie.relatedMovies.slice(0, 8) : movie.relatedMovies.slice(0, 4);
  const router = useRouter();

  console.log('MovieDetail - Full movie object:', {
    title: movie.title,
    hasReviews: !!movie.reviews,
    reviewsCount: movie.reviews?.length,
    reviews: movie.reviews,
    visibleReviewsCount: visibleReviews?.length,
    movieSlug: movie.movieSlug
  });

  const handleRelatedMovieClick = (movieSlug) => {
    router.push(`/movie/${movieSlug}?from=${movie.movieSlug}&fromTitle=${encodeURIComponent(movie.title)}`);
  };

  const handleReviewClick = (review) => {
    setSelectedReview(review);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  const processReviewContent = (content) => {
    if (!content) return '';
    
    // Process bold text (**text** or __text__)
    content = content.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
    
    // Process italic text (*text* or _text_)
    content = content.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
    
    // Process links [text](url)
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Process blockquotes (> text)
    content = content.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');
    
    // Convert line breaks to paragraphs
    content = content.split('\n\n').map(paragraph => 
      paragraph.trim() ? `<p>${paragraph}</p>` : ''
    ).join('');
    
    return content;
  };

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
            {movie.relatedMovies && movie.relatedMovies.length > 0 ? (
              visibleRelatedMovies.map((relatedMovie) => (
                <RelatedMovieCard
                  key={relatedMovie.movieSlug}
                  onClick={() => handleRelatedMovieClick(relatedMovie.movieSlug)}
                >
                  <RelatedMovieImage
                    src={relatedMovie.posterUrl}
                    alt={relatedMovie.title}
                    width={200}
                    height={300}
                  />
                  <RelatedMovieInfo>
                    <RelatedMovieTitle>{relatedMovie.title}</RelatedMovieTitle>
                    <RelatedMovieYear>{relatedMovie.year}</RelatedMovieYear>
                  </RelatedMovieInfo>
                </RelatedMovieCard>
              ))
            ) : (
              <NoRelatedMovies>
                No related movies found
              </NoRelatedMovies>
            )}
          </RelatedMoviesGrid>
          {movie.relatedMovies && movie.relatedMovies.length > 4 && (
            <ViewMoreReviewsButton onClick={() => setShowMoreRelated(!showMoreRelated)}>
              {showMoreRelated ? 'Show Less' : 'Show More'}
            </ViewMoreReviewsButton>
          )}
        </RelatedMoviesSection>
      )}

      <ReviewsSection>
        <ReviewsHeader>Top Reviews</ReviewsHeader>
        {!movie.reviews ? (
          <p style={{ color: '#b3b3b3', textAlign: 'center', padding: '2rem' }}>
            Loading reviews...
          </p>
        ) : movie.reviews.length > 0 ? (
          <>
            <ReviewsGrid>
              {visibleReviews.map((review, index) => {
                console.log('Rendering review:', {
                  index,
                  reviewer: review.reviewer,
                  hasContent: !!review.content,
                  contentLength: review.content?.length,
                  rating: review.rating,
                  date: review.date,
                  id: review.id
                });
                return (
                  <ReviewCard key={review.id || index}>
                    <ReviewHeader>
                      <ReviewerImagePlaceholder>
                        {review.reviewer.charAt(0)}
                      </ReviewerImagePlaceholder>
                      <ReviewerInfo>
                        <ReviewerName>{review.reviewer}</ReviewerName>
                        <ReviewDate>{new Date(review.date).toLocaleDateString()}</ReviewDate>
                      </ReviewerInfo>
                      {review.rating > 0 && (
                        <ReviewRating>
                          <StarIcon>★</StarIcon>
                          {review.rating.toFixed(1)}
                        </ReviewRating>
                      )}
                    </ReviewHeader>
                    <ReadReviewLink onClick={() => handleReviewClick(review)}>
                      Read Review
                    </ReadReviewLink>
                  </ReviewCard>
                );
              })}
            </ReviewsGrid>
            {movie.reviews.length > 3 && (
              <ViewMoreReviewsButton onClick={() => setShowAllReviews(!showAllReviews)}>
                {showAllReviews ? 'Show Less Reviews' : 'View More Reviews'}
              </ViewMoreReviewsButton>
            )}
          </>
        ) : (
          <p style={{ color: '#b3b3b3', textAlign: 'center', padding: '2rem' }}>
            No reviews available for this movie.
          </p>
        )}
      </ReviewsSection>

      {selectedReview && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
            <ModalReviewHeader>
              <ModalReviewerImagePlaceholder>
                {selectedReview.reviewer.charAt(0)}
              </ModalReviewerImagePlaceholder>
              <ModalReviewerInfo>
                <ModalReviewerName>{selectedReview.reviewer}</ModalReviewerName>
                <ModalReviewDate>{new Date(selectedReview.date).toLocaleDateString()}</ModalReviewDate>
              </ModalReviewerInfo>
              {selectedReview.rating > 0 && (
                <ModalReviewRating>
                  <StarIcon>★</StarIcon>
                  {selectedReview.rating.toFixed(1)}
                </ModalReviewRating>
              )}
            </ModalReviewHeader>
            <FullReviewContent 
              dangerouslySetInnerHTML={{ 
                __html: processReviewContent(selectedReview.content) 
              }} 
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
} 