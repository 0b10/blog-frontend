import { Subject, Subscription } from 'rxjs';
import { IPost } from '../post-detail/post-detail.types';
import { TQueryStatus } from './graphql/graphql.types';

export type TOrderBy = 'latest' | 'oldest';
export type TQuantity = number;
export type TPostListStatus =
  | 'init'
  | 'initError'
  | 'loadingMore'
  | 'loadingMoreError'
  | 'noPosts'
  | TQueryStatus;

export interface IPostListApolloResponse {
  posts: IPost[];
}

export interface IPostListService {
  posts$: Subject<IPost[]>;
  queryStatus: TQueryStatus;

  getPostListSubscription(orderBy: TOrderBy, quantity: TQuantity): Subscription;
}
