import Image from 'next/image';
import styled from 'styled-components';
import ReactParallaxTilt from 'react-parallax-tilt';

const CardContainer = styled.div`
  position: relative;
  aspect-ratio: 2/3;
  width: 100%;
  height: 0;
  padding-bottom: 150%;
`;

const Card = styled.div`
  background: #1a1a1a;
  border-radius: 0.8rem;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;

  &:hover {
    transform: scale(1.05);
  }
  
  &:hover > * {
    opacity: 1;
  }
`;

const Poster = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0.8rem;
  overflow: hidden;
`;

const GlowWrapper = styled.div`
  position: absolute;
  inset: -100px;
  z-index: 1;
  width: calc(100% + 200px);
  height: calc(100% + 200px);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;

  ${CardContainer}:hover & {
    opacity: .5;
  }
`;

const GlowImage = styled(Image)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: blur(60px) brightness(1.2) saturate(1.2);
  object-fit: cover;
  transform: scale(1.5);
  mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
`;

const Info = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.9) 80%, rgba(0, 0, 0, 0.95) 100%);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  color: white;
  z-index: 3;
  border-bottom-left-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
  transition: all 0.3s ease-in-out;

  ${Card}:hover & {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
  }
`;

const MovieYear = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  opacity: 0;
  height: 0;
  transition: all 0.2s ease-in-out;
  transform: translateY(-10px);

  ${Card}:hover & {
    opacity: 1;
    height: 1.5rem;
    transform: translateY(0);
  }
`;

const MovieRating = styled.span`
  font-size: 0.875rem;
  opacity: 0;
  transition: all 0.2s ease-in-out;
  transform: translateY(-10px);
  margin-left: 0.5rem;
  color: #ffd700;

  ${Card}:hover & {
    opacity: 1;
    height: 1.5rem;
    transform: translateY(0);
  }
`;

const YearRatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.25rem 0 0;
  height: 0;
  opacity: 0;
  transition: all 0.2s ease-in-out;
  transform: translateY(-10px);

  ${Card}:hover & {
    opacity: 1;
    height: 1rem;
    transform: translateY(0);
  }
`;

export default function MovieCard({ movie, onClick }) {
  return (
    <CardContainer>
      <GlowWrapper>
        <GlowImage
          src={movie.posterUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          style={{ objectFit: 'cover' }}
        />
      </GlowWrapper>
      
      <Card 
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
      >
        <Poster>
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        </Poster>
        
        <Info>
          <h3>{movie.title}</h3>
          <YearRatingContainer>
            <MovieYear>{movie.year}</MovieYear>
            <MovieRating>★ {(movie.rating / 2).toFixed(1)}</MovieRating>
          </YearRatingContainer>
          <p>Directed by {movie.director}</p>
        </Info>

      </Card>
    </CardContainer>
  );
} 