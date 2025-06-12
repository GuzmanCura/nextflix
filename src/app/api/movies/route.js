import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

async function fetchAllPages(listUrl) {
  const allMovies = [];
  let currentPage = 1;
  let hasNextPage = true;
  let retryCount = 0;
  const maxRetries = 2;
  const delayBetweenPages = 2000;
  const delayBetweenRetries = 3000;

  // Check if it's a watchlist URL
  const isWatchlist = listUrl.includes('/watchlist');
  
  while (hasNextPage) {
    // Handle pagination URL format differently for watchlists
    const pageUrl = currentPage === 1 
      ? listUrl 
      : isWatchlist 
        ? `${listUrl.replace(/\/$/, '')}/page/${currentPage}/`
        : `${listUrl}page/${currentPage}/`;
    
    console.log('Fetching page:', pageUrl);
    
    try {
      if (currentPage > 1) {
        console.log(`Waiting ${delayBetweenPages}ms before fetching next page...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenPages));
      }

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
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying page ${currentPage} (attempt ${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delayBetweenRetries));
          continue;
        }
        console.log('Max retries reached, continuing with available movies');
        break;
      }

      retryCount = 0;
      const html = await response.text();
      const dom = new JSDOM(html);
      const doc = dom.window.document;

      // Try different selectors for movie elements
      const movieElements = doc.querySelectorAll('.poster-container, .film-poster');
      console.log(`Found ${movieElements.length} movies on page ${currentPage}`);

      if (movieElements.length === 0) {
        console.log('No movies found on page, breaking loop');
        break;
      }

      // Check if there's a next page by looking at the pagination
      const pagination = doc.querySelector('.paginate-pages, .pagination');
      console.log('Pagination element found:', !!pagination);
      
      if (pagination) {
        const lastPageLink = pagination.querySelector('li:last-child a, .paginate-last a');
        const totalPages = lastPageLink ? parseInt(lastPageLink.textContent) : 1;
        console.log(`Total pages found: ${totalPages}`);
        hasNextPage = currentPage < totalPages;
      } else {
        // If no pagination found, check for next button
        const nextButton = doc.querySelector('.paginate-next, .next');
        console.log('Next button found:', !!nextButton);
        hasNextPage = !!nextButton;
      }
      
      // Add all movies from this page
      allMovies.push(...Array.from(movieElements));
      console.log(`Total movies collected so far: ${allMovies.length}`);
      
      if (hasNextPage) {
        console.log(`Moving to page ${currentPage + 1}`);
        currentPage++;
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying page ${currentPage} (attempt ${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenRetries));
        continue;
      }
      console.log('Max retries reached, continuing with available movies');
      break;
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
    
    const movieElements = await fetchAllPages(listUrl);
    console.log('Total movie elements found across all pages:', movieElements.length);

    if (movieElements.length === 0) {
      return NextResponse.json(
        { error: 'No movies found in the list. Please make sure the list is public and accessible.' },
        { status: 404 }
      );
    }

    const movies = await Promise.all(movieElements.map(async (element, index) => {
      const movieLink = element.querySelector('div[data-target-link]');
      const movieSlug = movieLink?.getAttribute('data-target-link')?.split('/')[2] || '';
      
      if (!movieSlug) {
        console.log('No movie slug found for element:', element.outerHTML);
        return null;
      }

      console.log('Processing movie with slug:', movieSlug);

      try {
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

        const titleElement = movieDoc.querySelector('h1.headline-1');
        const title = titleElement?.textContent?.trim() || movieSlug.replace(/-/g, ' ');

        const tmdbLink = movieDoc.querySelector('a[href*="themoviedb.org"]');
        const tmdbId = tmdbLink?.href?.match(/movie\/(\d+)/)?.[1];

        console.log('Movie processing:', {
          title,
          tmdbId,
          hasTmdbLink: !!tmdbLink,
          tmdbLinkHref: tmdbLink?.href
        });

        const letterboxdApiUrl = `https://letterboxd.com/film/${movieSlug}/`;
        console.log('Fetching reviews from:', letterboxdApiUrl);
        
        let reviews = [];
        try {
          const reviewsResponse = await fetch(letterboxdApiUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Cache-Control': 'max-age=0'
            }
          });

          console.log('Reviews response status:', reviewsResponse.status);
          console.log('Reviews response ok:', reviewsResponse.ok);

          if (reviewsResponse.ok) {
            const reviewsHtml = await reviewsResponse.text();
            const reviewsDom = new JSDOM(reviewsHtml);
            const reviewsDoc = reviewsDom.window.document;

            // Find the Popular Reviews section and get its AJAX URL
            const popularReviewsSection = reviewsDoc.querySelector('.js-popular-reviews');
            console.log('Popular reviews section found:', !!popularReviewsSection);
            
            if (popularReviewsSection) {
              const reviewsUrl = popularReviewsSection.getAttribute('data-url');
              console.log('Found reviews URL:', reviewsUrl);

              if (reviewsUrl) {
                // Fetch the reviews from the AJAX endpoint
                const ajaxReviewsResponse = await fetch(`https://letterboxd.com${reviewsUrl}`, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Connection': 'keep-alive',
                    'X-Requested-With': 'XMLHttpRequest'
                  }
                });

                if (ajaxReviewsResponse.ok) {
                  const ajaxReviewsHtml = await ajaxReviewsResponse.text();
                  const ajaxReviewsDom = new JSDOM(ajaxReviewsHtml);
                  const ajaxReviewsDoc = ajaxReviewsDom.window.document;

                  const reviewContainers = ajaxReviewsDoc.querySelectorAll('.js-listitem');
                  console.log('Found review containers:', reviewContainers.length);

                  if (reviewContainers.length > 0) {
                    reviews = Array.from(reviewContainers)
                      .map(container => {
                        const reviewText = container.querySelector('.js-review-body')?.textContent?.trim() || '';
                        const reviewerName = container.querySelector('.displayname')?.textContent?.trim() || 'Anonymous';
                        const ratingElement = container.querySelector('.rating');
                        const rating = ratingElement ? 
                          (ratingElement.textContent.includes('★') ? 
                            ratingElement.textContent.split('★').length - 1 : 0) : 0;
                        const dateElement = container.querySelector('time');
                        const date = dateElement?.getAttribute('datetime') || new Date().toISOString();
                        const avatarElement = container.querySelector('.avatar img');
                        const avatarUrl = avatarElement?.src || null;

                        console.log('Processing review:', {
                          reviewer: reviewerName,
                          hasContent: !!reviewText,
                          contentLength: reviewText.length,
                          rating,
                          date,
                          hasAvatar: !!avatarUrl
                        });

                        return {
                          id: container?.querySelector('.js-production-viewing')?.getAttribute('data-viewing-id') || Math.random().toString(36).substr(2, 9),
                          reviewer: reviewerName,
                          rating,
                          date,
                          content: reviewText,
                          profilePath: avatarUrl
                        };
                      })
                      .filter(review => review.content.length > 0);

                    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                    reviews = reviews.slice(0, 6);
                    console.log('Final processed reviews:', reviews.length);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }

        let movieData = {
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
          movieSlug,
          reviews: reviews || []
        };

        if (tmdbId) {
          console.log('Fetching data for movie with TMDB ID:', tmdbId);
          
          const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=2dca580c2a14b55200e784d157207b4d&append_to_response=credits`;
          console.log('Fetching movie details from:', tmdbUrl);
          
          const tmdbResponse = await fetch(tmdbUrl, {
            headers: {
              'Accept': 'application/json'
            }
          });

          if (tmdbResponse.ok) {
            const tmdbData = await tmdbResponse.json();
            console.log('TMDB movie data received:', {
              title: tmdbData.title,
              hasCredits: !!tmdbData.credits,
              responseKeys: Object.keys(tmdbData)
            });

            const year = tmdbData.release_date?.split('-')[0] || '';
            
            const directorData = tmdbData.credits?.crew?.find(person => person.job === 'Director');
            const director = directorData?.name || 'Unknown Director';
            const directorProfilePath = directorData?.profile_path 
              ? `https://image.tmdb.org/t/p/w185${directorData.profile_path}`
              : null;

            const cast = tmdbData.credits?.cast
              ?.map(actor => ({
                name: actor.name,
                character: actor.character,
                profilePath: actor.profile_path 
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : null,
                order: actor.order
              }))
              .sort((a, b) => a.order - b.order) || [];

            let description = 'No description available';
            if (tmdbData.overview) {
              description = tmdbData.overview;
            } else {
              const letterboxdDescription = movieDoc.querySelector('.text-sluglist + p, .text-sluglist + div p');
              if (letterboxdDescription) {
                description = letterboxdDescription.textContent.trim();
              }
            }

            const rating = tmdbData.vote_average 
              ? Math.round(tmdbData.vote_average * 10) / 10 
              : null;

            const genres = tmdbData.genres?.map(genre => genre.name) || [];

            const posterUrl = tmdbData.poster_path 
              ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
              : 'https://s.ltrbxd.com/static/img/empty-poster-1000-D9cprv0m.png';

            const backdropUrl = tmdbData.backdrop_path
              ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
              : null;

            movieData = {
              ...movieData,
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
              tmdbId
            };
          }
        }

        console.log('Final movie data:', movieData);
        return movieData;
      } catch (error) {
        console.error('Error processing movie:', movieSlug, error);
        return {
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
          movieSlug,
          reviews: []
        };
      }
    }));

    const validMovies = movies.filter(movie => movie !== null);
    const uniqueMovies = Array.from(new Map(validMovies.map(movie => [movie.title, movie])).values());

    console.log('Final movies array:', uniqueMovies.map(m => ({ title: m.title, slug: m.movieSlug })));
    return NextResponse.json(uniqueMovies);

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 