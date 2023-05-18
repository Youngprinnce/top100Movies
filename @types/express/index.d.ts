import { ITopMovies } from "../../src/api/v1/components/top-movies/top-movies.model";
import { IUser } from "../../src/api/v1/components/users/users.model";

export {};

declare global {
    namespace Express {
        interface Request {
            topMovie: ITopMovies
            authUser: IUser
        }
    }
}