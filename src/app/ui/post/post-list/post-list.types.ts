import { IPost } from '../post-detail/post-detail.types';

export type TOrderBy = 'latest' | 'oldest';
export type TQuantity = number;

export interface IPostListApolloResponse {
  posts: IPost[];
}
