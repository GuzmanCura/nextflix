import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

async function fetchAllPages(listUrl) {
  const allMovies = [];
  let currentPage = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const pageUrl = currentPage === 1 ? listUrl : `${listUrl}page/${currentPage}/`;
    console.log('Fetching page:', pageUrl);
    
    const response = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch page:', pageUrl, response.status);
      break;
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const movieElements = doc.querySelectorAll('.poster-container');
    console.log(`Found ${movieElements.length} movies on page ${currentPage}`);

    if (movieElements.length === 0) {
      break;
    }

    // Check if there's a next page by looking at the pagination
    const pagination = doc.querySelector('.paginate-pages');
    if (pagination) {
      const lastPageLink = pagination.querySelector('li:last-child a');
      const totalPages = lastPageLink ? parseInt(lastPageLink.textContent) : 1;
      console.log(`Total pages found: ${totalPages}`);
      hasNextPage = currentPage < totalPages;
    } else {
      // If no pagination found, check for next button
      const nextButton = doc.querySelector('.paginate-next');
      hasNextPage = !!nextButton;
    }
    
    // Add all movies from this page
    allMovies.push(...Array.from(movieElements));
    
    if (hasNextPage) {
      console.log(`Moving to page ${currentPage + 1}`);
      currentPage++;
    }
  }

  console.log(`Finished fetching all pages. Total movies found: ${allMovies.length}`);
  return allMovies;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listUrl = searchParams.get('url');

    if (!listUrl) {
      return NextResponse.json(
        { error: 'Please provide a Letterboxd list URL' },
        { status: 400 }
      );
    }

    console.log('Fetching list:', listUrl);
    
    // Fetch all pages of movies
    const movieElements = await fetchAllPages(listUrl);
    console.log('Total movie elements found across all pages:', movieElements.length);

    if (movieElements.length === 0) {
      return NextResponse.json(
        { error: 'No movies found in the list. Please make sure the list is public and accessible.' },
        { status: 404 }
      );
    }

    // Process movies
    const movies = await Promise.all(movieElements.map(async (element, index) => {
      // Get the movie link which contains the title
      const movieLink = element.querySelector('div[data-target-link]');
      const movieSlug = movieLink?.getAttribute('data-target-link')?.split('/')[2] || '';
      
      if (!movieSlug) {
        console.log('No movie slug found for element:', element.outerHTML);
        return null;
      }

      console.log('Processing movie with slug:', movieSlug); // Debug log

      try {
        // First get the movie's TMDB ID from the film page
        const movieUrl = `https://letterboxd.com/film/${movieSlug}/`;
        console.log('Fetching movie:', movieUrl);
        
        const movieResponse = await fetch(movieUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
          }
        });

        if (!movieResponse.ok) {
          console.error('Failed to fetch movie:', movieUrl, movieResponse.status);
          return null;
        }

        const movieHtml = await movieResponse.text();
        const movieDom = new JSDOM(movieHtml);
        const movieDoc = movieDom.window.document;

        // Get title
        const titleElement = movieDoc.querySelector('h1.headline-1');
        const title = titleElement?.textContent?.trim() || movieSlug.replace(/-/g, ' ');

        // Get TMDB ID from the page
        const tmdbLink = movieDoc.querySelector('a[href*="themoviedb.org"]');
        const tmdbId = tmdbLink?.href?.match(/movie\/(\d+)/)?.[1];

        if (tmdbId) {
          // Use TMDB API to get movie details
          const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=2dca580c2a14b55200e784d157207b4d&append_to_response=credits`,
            {
              headers: {
                'Accept': 'application/json'
              }
            }
          );

          if (tmdbResponse.ok) {
            const tmdbData = await tmdbResponse.json();
            
            // Debug log the TMDB response
            console.log('TMDB Response for', title, ':', {
              overview: tmdbData.overview,
              hasOverview: !!tmdbData.overview,
              responseKeys: Object.keys(tmdbData)
            });
            
            // Get year from release date
            const year = tmdbData.release_date?.split('-')[0] || '';
            
            // Get director from credits
            const directorData = tmdbData.credits?.crew?.find(person => person.job === 'Director');
            const director = directorData?.name || 'Unknown Director';
            const directorProfilePath = directorData?.profile_path 
              ? `https://image.tmdb.org/t/p/w185${directorData.profile_path}`
              : null;

            // Get all cast members
            const cast = tmdbData.credits?.cast
              ?.map(actor => ({
                name: actor.name,
                character: actor.character,
                profilePath: actor.profile_path 
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : null,
                order: actor.order // Keep track of the original order
              }))
              .sort((a, b) => a.order - b.order) || []; // Sort by order to maintain TMDB's importance ranking

            // Get movie description - try multiple sources
            let description = 'No description available';
            if (tmdbData.overview) {
              description = tmdbData.overview;
            } else {
              // Try to get description from Letterboxd page
              const letterboxdDescription = movieDoc.querySelector('.text-sluglist + p, .text-sluglist + div p');
              if (letterboxdDescription) {
                description = letterboxdDescription.textContent.trim();
              }
            }

            // Get rating
            const rating = tmdbData.vote_average 
              ? Math.round(tmdbData.vote_average * 10) / 10 
              : null;

            // Get genres
            const genres = tmdbData.genres?.map(genre => genre.name) || [];

            // Get poster from TMDB
            const posterUrl = tmdbData.poster_path 
              ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
              : 'https://s.ltrbxd.com/static/img/empty-poster-1000-D9cprv0m.png';

            // Get backdrop image
            const backdropUrl = tmdbData.backdrop_path
              ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
              : null;

            const movieData = {
              id: index + 1,
              title: title.charAt(0).toUpperCase() + title.slice(1),
              year: parseInt(year) || null,
              director,
              directorProfilePath,
              posterUrl,
              description,
              rating,
              genres,
              cast,
              backdropUrl,
              runtime: tmdbData.runtime,
              releaseDate: tmdbData.release_date,
              tmdbId,
              movieSlug
            };

            console.log('Final movie data:', movieData); // Debug log
            return movieData;
          }
        }

        // Fallback to basic data if TMDB API fails
        const fallbackData = {
          id: index + 1,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          year: null,
          director: 'Unknown Director',
          directorProfilePath: null,
          posterUrl: 'https://s.ltrbxd.com/static/img/empty-poster-1000-D9cprv0m.png',
          description: 'No description available',
          rating: null,
          genres: [],
          cast: [],
          backdropUrl: null,
          runtime: null,
          releaseDate: null,
          tmdbId: null,
          movieSlug
        };

        console.log('Fallback movie data:', fallbackData); // Debug log
        return fallbackData;

      } catch (error) {
        console.error('Error processing movie:', movieSlug, error);
        return null;
      }
    }));

    // Remove null values and duplicates
    const validMovies = movies.filter(movie => movie !== null);
    const uniqueMovies = Array.from(new Map(validMovies.map(movie => [movie.title, movie])).values());

    console.log('Final movies array:', uniqueMovies.map(m => ({ title: m.title, slug: m.movieSlug }))); // Debug log
    return NextResponse.json(uniqueMovies);

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 