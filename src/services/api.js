const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const MovieAPI = {
  // Generic Fetch Helper
  async _fetch(endpoint, params = '') {
    try {
      // Ensure params start with & if not empty
      const cleanParams = params && !params.startsWith('&') ? `&${params}` : params;
      const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}${cleanParams}`);
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      
      // Return results if available (lists), otherwise return data (details/credits)
      return data.results || data; 
    } catch (error) {
      console.error(`MovieAPI Failure [${endpoint}]:`, error);
      return []; // Return empty array to prevent app crash
    }
  },

  // ==========================================
  // 1. HOME & GENERAL
  // ==========================================
  async fetchTrending() {
    return await this._fetch('/trending/movie/week');
  },
  async getPopular() {
    return await this._fetch('/movie/popular');
  },
  async getTopRated() {
    return await this._fetch('/movie/top_rated');
  },
  async getUpcoming() {
    return await this._fetch('/movie/upcoming');
  },

  // ==========================================
  // 2. CATEGORY PAGES (Fixes Blank Screens)
  // ==========================================
  // "TV Shows" Page calls this
  async getTVShows() {
    return await this._fetch('/tv/popular');
  },
  async fetchTrendingTV() {
    return await this._fetch('/trending/tv/week');
  },

  // "Movies" Page calls this
  async getMovies() {
    return await this._fetch('/discover/movie', '&sort_by=popularity.desc&include_adult=false&include_video=false');
  },
  async fetchDiscoverMovies() {
    return await this._fetch('/discover/movie', '&sort_by=popularity.desc');
  },
  
  // "New & Popular" Page calls this
  async fetchNowPlaying() {
    return await this._fetch('/movie/now_playing');
  },

  // ==========================================
  // 3. SEARCH
  // ==========================================
  async searchMovies(query) {
    if (!query) return [];
    const safeQuery = encodeURIComponent(query.trim());
    // Using multi-search to find movies and people
    return await this._fetch('/search/multi', `&query=${safeQuery}&include_adult=false`);
  },

  // ==========================================
  // 4. MODAL DATA (Fixes Video & Cast)
  // ==========================================
  
  // FIXED: Returns the array so the Component can decide which video to play
  async getMovieVideos(movieId) {
    if (!movieId) return [];
    return await this._fetch(`/movie/${movieId}/videos`);
  },

  // NEW: Returns Cast & Crew (Fixes "Include Cast")
  async getCredits(movieId) {
    if (!movieId) return { cast: [], crew: [] };
    // Credits endpoint returns { id:..., cast: [...], crew: [...] }
    // Our _fetch helper returns 'data' if 'results' doesn't exist, which is perfect here.
    return await this._fetch(`/movie/${movieId}/credits`);
  }
};