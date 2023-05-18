import uniqueValidator from 'mongoose-unique-validator';
import { Document, Schema, model, Types} from 'mongoose';

export interface ITopMovies extends Document {
  tmdbMovieId: number;
  rank: number;
  title: string;
  releaseDate: string;
  overview?: string;
  userId: Types.ObjectId;
}

const topMoviesSchema = new Schema<ITopMovies>({
  tmdbMovieId: { type: Number, required: true },
  rank: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  releaseDate: { type: String, required: true },
  overview: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
}, { timestamps: true });

topMoviesSchema.plugin(uniqueValidator);
export default model<ITopMovies>('TopMovies', topMoviesSchema);


