import TopMovies, { ITopMovies } from "./top-movies.model";

export = {
   /**
   * @description get a movie by filtered object
   * @param {Object} filter - what to filter the DB query with
   * @returns {Promise<ITopMovies>}
   */
  findOneMovie: async ({filter}:{filter:any}): Promise<ITopMovies | null> => TopMovies.findOne(filter),

  /**
   * @description creates new movie object
   * @param {Object} topMovieData - data of the movie to be added
   * @returns {Promise<ITopMovies>}
   */
  addMovie: async ({topMovieData}:{topMovieData:any}): Promise<ITopMovies> => {
    const existingMovieWithRank = await TopMovies.findOne({rank: topMovieData.rank, userId: topMovieData.userId});
    if (existingMovieWithRank) throw new Error(`movie with the rank ${topMovieData.rank} exist, please choose another`);
    return await TopMovies.create(topMovieData);
  },

  /**
   * @description get an array of ITopMovies
   * @param {Number} limit - the number of items to return, if not provided, defaults to `10`, and `200` is max limit.
   * @param {Number} currentPage - the number of items to skip before starting to collect the result set, if not provided, defaults to `1`
   * @returns {Promise<[ITopMovies[], number]>} An array of ITopMovies and a number representing the count of all documents
   */
  getTopMovies: async ({limit, currentPage, filter}:{limit:number, currentPage:number, filter:any}): Promise<[ITopMovies[], number]> => {
    return Promise.all([
      TopMovies.find(filter).sort('-rank').skip((currentPage - 1) * limit).limit(limit), TopMovies.countDocuments(filter)
    ])
  },

  /**
   * @description get a movie by id
   * @param {String} movieId - movie's objectId
   * @returns {Promise<ITopMovies>}
   */
  async get({movieId}:{movieId:string}): Promise<ITopMovies> {
    const movie = await TopMovies.findById(movieId);
    if (!movie) throw new Error('no such movie');
    return movie.toObject({getters: true});
  },

  /**
   * @description updates topMovie
   * @param {String} movieId - movie's objectId
   * @param {Object} movieData - movie's object data to be updated
   * @returns {Promise<ITopMovies | null>}
   */
  async update({movieId, movieData}:{movieData:ITopMovies, movieId:string}): Promise<ITopMovies | null> {
    return TopMovies.findByIdAndUpdate(movieId, movieData, {omitUndefined: true, new: true});
  },

  delete: async ({movieId}:{movieId:string}): Promise<null> => await TopMovies.findByIdAndDelete(movieId),
};


