import assert from 'assert';
import sinon from 'sinon';

// Import the modules to be tested
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

describe('Service', () => {
  describe('addMovie', () => {
    it('should add a movie successfully', async () => {
      // Mock the required data
      const body = { rank: 1, userId: 'user123' };
      const params = { tmdbMovieId: 123 };

      // Stub the repository method
      const findOneMovieStub = sinon.stub(topMovieRepository, 'findOneMovie').resolves(null);
      const tmdbMovieByIdStub = sinon.stub().resolves({
        data: { id: 'movieId', release_date: '2023-01-01', title: 'Movie', overview: 'Movie overview' }
      });
      const addMovieStub = sinon.stub(topMovieRepository, 'addMovie');

      // Call the service method
      const result = await topMovieService.addMovie({ body, params });

      // Assert the result
      sinon.assert.calledWith(findOneMovieStub, { filter: { tmdbMovieId: 123, userId: 'user123' } });
      sinon.assert.calledWith(tmdbMovieByIdStub, { tmdbMovieId: 123 });
      sinon.assert.calledWith(addMovieStub, {
        topMovieData: { rank: 1, tmdbMovieId: 'movieId', releaseDate: '2023-01-01', title: 'Movie', overview: 'Movie overview', userId: 'user123' }
      });
      assert.deepStrictEqual(result, { status: 201, message: 'Movie added successfully' });

      // Restore the stubs
      findOneMovieStub.restore();
      topMovieRepository.findOneMovie = tmdbMovieByIdStub;
      addMovieStub.restore();
    });

    it('should handle errors and throw BadRequestError', async () => {
      // Mock the required data
      const body = { rank: 1, userId: 'user123' };
      const params = { tmdbMovieId: 123 };

      // Stub the repository method to return an existing movie
      const existingMovie = { _id: 'existingMovieId', rank: 1, userId: 'user123' };
      const findOneMovieStub = sinon.stub(topMovieRepository, 'findOneMovie').resolves();

      // Call the service method and assert it throws BadRequestError
      await assert.rejects(() => topMovieService.addMovie({ body, params }), { name: 'BadRequestError' });

      // Assert the repository method was called correctly
      sinon.assert.calledWith(findOneMovieStub, { filter: { tmdbMovieId: 123, userId: 'user123' } });

      // Restore the stub
      findOneMovieStub.restore();
    });

  });
});

// Run the tests
