import assert from 'assert';
import sinon from 'sinon';

// Import the modules to be tested
import controller from '../src/api/v1/components/top-movies/top-movies.controller';
import topMovieService from '../src/api/v1/components/top-movies/top-movies.service';
import topMovieRepository from '../src/api/v1/components/top-movies/top-movies.repository';

// Mock the necessary dependencies
const req:any = {
  body: {},
  params: {},
  authUser: { id: 'user123' }
};
const res:any = {
  status: sinon.stub().returnsThis(),
  json: sinon.stub()
};
const next = sinon.stub();

// Start writing tests
describe('Controller', () => {
  describe('addMovie', () => {
    it('should add a movie successfully', async () => {
      // Mock the required data
      req.body = { rank: 1 };
      req.params.tmdbMovieId = '123';

      // Stub the service method
      const addMovieStub = sinon.stub(topMovieService, 'addMovie').resolves({ status: 201, message: 'Movie added successfully', success: true });

      // Call the controller method
      await controller.addMovie(req, res, next);

      // Assert the response
      sinon.assert.calledWith(addMovieStub, { body: { rank: 1, userId: 'user123' }, params: { tmdbMovieId: 123 } });
      sinon.assert.calledWith(res.status, 201);
      sinon.assert.calledWith(res.json, { status: 201, message: 'Movie added successfully' });
      sinon.assert.notCalled(next);

      // Restore the stub
      addMovieStub.restore();
    });

    it('should handle errors and pass them to the error handling middleware', async () => {
      // Mock the required data
      req.body = { rank: 1 };
      req.params.tmdbMovieId = '123';

      // Stub the service method to throw an error
      const error = new Error('Some error');
      const addMovieStub = sinon.stub(topMovieService, 'addMovie').throws(error);

      // Call the controller method
      await controller.addMovie(req, res, next);

      // Assert the response
      sinon.assert.calledWith(addMovieStub, { body: { rank: 1, userId: 'user123' }, params: { tmdbMovieId: 123 } });
      sinon.assert.notCalled(res.status);
      sinon.assert.notCalled(res.json);
      sinon.assert.calledWith(next, error);

      // Restore the stub
      addMovieStub.restore();
    });
  });

  describe('getTopMovies', () => {
    it('should get the top movies successfully', async () => {
      // Mock the required data
      req.query = { currentPage: 1, limit: 10 };

      // Stub the service method
      const getTopMoviesStub = sinon.stub(topMovieService, 'getTopMovies').resolves({
        message: "successful",
        success: true,
        status: 201
      });

      // Call the controller method
      await controller.getTopMovies(req, res, next);

      // Assert the response
      sinon.assert.calledWith(getTopMoviesStub, { currentPage: 1, limit: 10, userId: 'user123' });
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, {
        status: 200,
        data: {
          topMovies: [{ title: 'Movie 1' }, { title: 'Movie 2' }],
          totalTopMovies: 2,
          currentPage: 1,
          totalPages: 1
        }
      });
      sinon.assert.notCalled(next);

      // Restore the stub
      getTopMoviesStub.restore();
    });

    it('should handle errors and pass them to the error handling middleware', async () => {
      // Mock the required data
      req.query = { currentPage: 1, limit: 10 };

      // Stub the service method to throw an error
      const error = new Error('Some error');
      const getTopMoviesStub = sinon.stub(topMovieService, 'getTopMovies').throws(error);

      // Call the controller method
      await controller.getTopMovies(req, res, next);

      // Assert the response
      sinon.assert.calledWith(getTopMoviesStub, { currentPage: 1, limit: 10, userId: 'user123' });
      sinon.assert.notCalled(res.status);
      sinon.assert.notCalled(res.json);
      sinon.assert.calledWith(next, error);

      // Restore the stub
      getTopMoviesStub.restore();
    });
  });

  describe('loadTopMovie', () => {
    it('should load the top movie successfully', async () => {
      // Mock the required data
      req.params.movieId = 'movie123';

      // Stub the service method
      const getTopMovieStub = sinon.stub(topMovieService, 'getTopMovie').resolves();

      // Call the controller method
      await controller.loadTopMovie(req, res, next, 'movie123');

      // Assert the topMovie property in the request object
      assert.deepStrictEqual(req.topMovie, { title: 'Movie' });
      sinon.assert.notCalled(res.status);
      sinon.assert.notCalled(res.json);
      sinon.assert.calledOnce(next);

      // Restore the stub
      getTopMovieStub.restore();
    });

    it('should handle errors and pass them to the error handling middleware', async () => {
      // Mock the required data
      req.params.movieId = 'movie123';

      // Stub the service method to throw an error
      const error = new Error('Some error');
      const getTopMovieStub = sinon.stub(topMovieService, 'getTopMovie').throws(error);

      // Call the controller method
      await controller.loadTopMovie(req, res, next, 'movie123');

      // Assert the response
      sinon.assert.notCalled(req.topMovie);
      sinon.assert.notCalled(res.status);
      sinon.assert.notCalled(res.json);
      sinon.assert.calledWith(next, error);

      // Restore the stub
      getTopMovieStub.restore();
    });
  });

});



