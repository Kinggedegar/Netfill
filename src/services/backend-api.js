const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

const request = async (endpoint, options = {}) => {
  const url = `${BACKEND_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export const AuthAPI = {
  async signup(username, email, password) {
    return request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  async signin(email, password) {
    return request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getProfile() {
    return request('/auth/profile');
  },

  async updateSettings(settings) {
    return request('/auth/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

export const MovieAPI = {
  async getMovies(page = 1, limit = 20) {
    return request(`/movies?page=${page}&limit=${limit}`);
  },

  async getTrending() {
    return request('/movies/trending');
  },

  async getMovieById(id) {
    return request(`/movies/${id}`);
  },

  async searchMovies(query) {
    return request(`/movies/search/${query}`);
  },

  async addToWatchlist(movieId) {
    return request(`/movies/watchlist/${movieId}`, {
      method: 'POST',
    });
  },

  async getWatchlist() {
    return request('/movies/watchlist');
  },

  async removeFromWatchlist(movieId) {
    return request(`/movies/watchlist/${movieId}`, {
      method: 'DELETE',
    });
  },

  async saveContinueWatching(movieId, watchDuration, totalDuration) {
    return request(`/movies/continue-watching/${movieId}`, {
      method: 'POST',
      body: JSON.stringify({ watch_duration: watchDuration, total_duration: totalDuration }),
    });
  },

  async getContinueWatching() {
    return request('/movies/continue-watching');
  },

  async rateMovie(movieId, rating) {
    return request(`/movies/rate/${movieId}`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  },
};

// Keep old TMDB API for fallback if needed
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const buildTmdbUrl = (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', 'en-US');
  url.searchParams.append('include_adult', 'false');

  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

export const TMDBAPI = {
  async _request(endpoint, params = {}) {
    try {
      const url = buildTmdbUrl(endpoint, params);
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`TMDB API Error [${response.status}]`);
        throw new Error(`TMDB API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TMDB Request Failed:', error);
      return { results: [] };
    }
  },

  async fetchTrending() {
    return await this._request('/trending/all/week');
  },

  async getPopularMovies() {
    return await this._request('/movie/popular');
  },

  async getTopRatedMovies() {
    return await this._request('/movie/top_rated');
  },

  async getMovieDetails(id) {
    return await this._request(`/movie/${id}`);
  },

  async getMovieCredits(id) {
    return await this._request(`/movie/${id}/credits`);
  },

  async getMovieVideos(id) {
    return await this._request(`/movie/${id}/videos`);
  },

  async getMovieSimilar(id) {
    return await this._request(`/movie/${id}/similar`);
  },

  async searchMovies(query, page = 1) {
    return await this._request('/search/movie', { query, page });
  },

  async getMoviesByGenre(genreId, page = 1) {
    return await this._request('/discover/movie', { with_genres: genreId, page });
  },

  async getGenreList() {
    return await this._request('/genre/movie/list');
  },

  async getTVTrending() {
    return await this._request('/trending/tv/week');
  },

  async getPopularTV() {
    return await this._request('/tv/popular');
  },

  async getTVDetails(id) {
    return await this._request(`/tv/${id}`);
  },

  async getTVCredits(id) {
    return await this._request(`/tv/${id}/credits`);
  },

  async getTVSimilar(id) {
    return await this._request(`/tv/${id}/similar`);
  },

  async searchTV(query, page = 1) {
    return await this._request('/search/tv', { query, page });
  },

  async getTopRatedTV() {
    return await this._request('/tv/top_rated');
  },
};
