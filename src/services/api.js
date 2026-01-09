const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// DEBUGGING: Check if key exists immediately
if (!API_KEY) {
  console.error("⛔ FATAL ERROR: VITE_TMDB_API_KEY is missing! Please create a .env file.");
} else {
  console.log("✅ API Service Initialized. Key found.");
}

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');
  url.searchParams.append('include_adult', 'false');
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

export const MovieAPI = {
  async _request(endpoint, params = {}) {
    try {
      const url = buildUrl(endpoint, params);
      
      const response = await fetch(url);

      if (!response.ok) {
        // Log detailed error for debugging
        console.error(`❌ API Error [${response.status}] for ${endpoint}`);
        throw new Error(`TMDB API Error: ${response.status}`);
      }

      const data = await response.json();
      return data; 
    } catch (error) {
      console.error(`⚠️ Request Failed: ${endpoint}`, error);
      return { results: [] }; 
    }
  },

  // --- HOME & TRENDING ---
  async fetchTrending() { return await this._request('/trending/all/week'); },
  async getPopularMovies() { return await this._request('/movie/popular'); },
  async getTopRatedMovies() { return await this._request('/movie/top_rated'); },
  
  // --- TV SERIES ---
  async getTVShows() { return await this._request('/tv/popular'); },
  async getTVDetails(id) { return await this._request(`/tv/${id}`); },
  
  // --- DISCOVERY ---
  async getMovieGenres() { return await this._request('/genre/movie/list'); },
  async getTVGenres() { return await this._request('/genre/tv/list'); },
  
  async getMoviesByGenre(genreId) { 
    return await this._request('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc' }); 
  },
  
  async getTVByGenre(genreId) { 
    return await this._request('/discover/tv', { with_genres: genreId, sort_by: 'popularity.desc' }); 
  },

  // --- DETAILS ---
  async getMovieDetails(id) { return await this._request(`/movie/${id}`); },
  async getCredits(id) { return await this._request(`/movie/${id}/credits`); },
  async getSimilarMovies(id) { return await this._request(`/movie/${id}/similar`); },
  
  async getMovieVideos(id) { 
    const data = await this._request(`/movie/${id}/videos`);
    return data.results || [];
  },

  // --- SEARCH ---
  async searchContent(query) {
    return await this._request('/search/multi', { query });
  }
};

export const GENRES = {
  ACTION: 28, COMEDY: 35, DRAMA: 18, SCI_FI: 878, HORROR: 27
};

export default MovieAPI;