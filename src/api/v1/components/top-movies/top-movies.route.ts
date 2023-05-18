// noinspection JSCheckFunctionSignatures

import router from '../../../config/router.config';
import { validate } from "../../../../utils/helpers";
import topMoviesValidator from './top-movies.validator';
import topMoviesController from "./top-movies.controller";
import { authorize } from '../../../middlewares/auth';

router.post('/create/:tmdbMovieId', authorize(), validate(topMoviesValidator.addMovie), topMoviesController.addMovie);
router.get('/', authorize(), topMoviesController.getTopMovies);
router.get('/:movieId', authorize(), topMoviesController.getTopMovie);
router.patch('/:movieId', authorize(), validate(topMoviesValidator.updateMovie), topMoviesController.updateTopMovie);
router.delete('/:movieId', authorize(), topMoviesController.deleteTopMovie);
 
// Load topMovie when API with movieId route parameter is hit on the :mobieId params
router.param('movieId', topMoviesController.loadTopMovie);

export {router};
