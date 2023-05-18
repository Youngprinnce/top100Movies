import { check } from "express-validator";

const addMovie = [
  check('tmdbMovieId').isInt().withMessage('tmdbMovieId must be an integer'),
  check('rank').isInt().toInt().isInt({ min: 1, max: 100 }).withMessage('rank must be an integer'),
];

const updateMovie = [
  check('rank').isInt().toInt().isInt({ min: 1, max: 100 }).withMessage('rank must be an integer'),
];

export = {addMovie, updateMovie}