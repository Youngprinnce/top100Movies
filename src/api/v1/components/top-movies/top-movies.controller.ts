import topMovieService from "./top-movies.service";
import { Request, Response, NextFunction } from 'express';

export = {
  async addMovie(req:Request, res:Response, next:NextFunction) {
    const {body, authUser: {id: userId}} = req;
    body.userId = userId;
    const tmdbMovieId: number = parseInt(req.params.tmdbMovieId as string)
    try {
      const {status, ...rest} = await topMovieService.addMovie({body, params:{tmdbMovieId}});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async getTopMovies(req:Request, res:Response, next:NextFunction) {
    let {query: {currentPage, limit}, authUser: {id: userId}} = req;
    try {
      const {status, ...rest} = await topMovieService.getTopMovies({currentPage, limit, userId});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async loadTopMovie(req:Request, res:Response, next:NextFunction, movieId:string) {
    try {
      req.topMovie = await topMovieService.getTopMovie({movieId});
    } catch (err) {
      return next(err);
    }
    return next();
  },

  async getTopMovie(req:Request, res:Response, next:NextFunction) {
    try {
      const topMovie = req.topMovie;
      return res.status(200).json({message: 'data fetched', success: true, topMovie})
    } catch (err) {
      return next(err);
    }
  },


  async updateTopMovie(req:Request,res:Response, next:NextFunction) {
    const {id: movieId} = req.topMovie;
    const {body} = req;
    try {
      const {status, ...rest} = await topMovieService.update({movieId, body});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async deleteTopMovie(req:Request,res:Response, next:NextFunction) {
    const {id: movieId} = req.topMovie;
    try {
      const {status, ...rest} = await topMovieService.delete({movieId});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },
}