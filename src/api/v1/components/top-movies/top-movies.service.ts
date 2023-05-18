// noinspection ExceptionCaughtLocallyJS

import * as utils from "../../../../utils/helpers";
import { tmdbMovieById } from "../../../3Party-API";
import topMovieRepository from "./top-movies.repository";
import { BadRequestError } from "../../../../utils/api-errors";
import { AxiosError } from "axios";

export = {
  async addMovie({ body: {rank, userId}, params: {tmdbMovieId} }: { body: {rank: number, userId:string}, params: {tmdbMovieId: number} }) {
    try {
      const tmdbMovieExist = await topMovieRepository.findOneMovie({filter: {tmdbMovieId, userId}})
      if (tmdbMovieExist) throw new BadRequestError(`movie with tmdbMovieId ${tmdbMovieId} exist in your list`);
      const {data: {id, release_date, title, overview}} = await tmdbMovieById({tmdbMovieId})
      await topMovieRepository.addMovie({topMovieData: {rank, tmdbMovieId:id, releaseDate:release_date, title, overview, userId }})
      return utils.responseData({status: 201, message: "Movie added successfully"});
    } catch (err: any) {
      console.log({ err });
      if (err instanceof AxiosError ) throw new BadRequestError(`${err.response?.statusText}, invalid tmdbMovieId`);
      throw new BadRequestError(err.message);
    }
  },

  async getTopMovies({currentPage = 1, limit = 50, userId = null}: {currentPage?:any, limit?: any, userId?:any}) {
    currentPage = +currentPage;
    limit = +limit > 200 ? 200 : +limit;
    const filter: any = {};
    if(userId) filter.userId = userId
    try {
      const [topMovies, totalTopMovies] = await topMovieRepository.getTopMovies({limit, currentPage, filter});
      return utils.responseData({
        data: {
          topMovies: topMovies.map(topMovie => topMovie.toObject({getters: true})),
          totalTopMovies, currentPage, totalPages: Math.ceil(totalTopMovies / limit),
        }
      });
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async getTopMovie({movieId}:{movieId:string}) {
    try {
      return await topMovieRepository.get({movieId});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async delete({movieId}:{movieId: string}) {
    try {
      await topMovieRepository.delete({movieId});
      return utils.responseData({message: 'Movie successfully deleted.'});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async update({movieId, body}:{movieId: string, body:any}) {
    try {
      const movieWithRank = await topMovieRepository.findOneMovie({filter:{rank:body.rank}})
      if (movieWithRank) throw new BadRequestError(`movie with rank ${body.rank} exist`);
      await topMovieRepository.update({movieId, movieData: body});
      return utils.responseData({message: 'movie successfully updated.'});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },
};
