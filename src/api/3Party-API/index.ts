import axios from "axios";
const { TMDB_API_KEY, TMDB_API_URL  } = process.env;

const tmdbMovieById = async ({tmdbMovieId}:{tmdbMovieId:number}) => {
  return axios.get(`${TMDB_API_URL}/movie/${tmdbMovieId}?api_key=${TMDB_API_KEY}`, {headers: {'Content-Type': 'application/json'}})
}

export {tmdbMovieById};
