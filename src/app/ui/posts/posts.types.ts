import { PartialObserver } from 'rxjs';

export type TOrderBy = 'latest' | 'oldest';
export type TQuantity = number;
export interface IAuthor {
  id: number;
  alias: string;
}
export interface IPost {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  author: IAuthor;
  createdAt: Date;
}

export interface IGQLPostsResponse {
  posts: IPost[];
}

/**
 * An adapter for fetching backend data.
 */
export interface IPostsAdapter {
  /**
   * Get posts from a backend
   * @param orderBy  - the order of the results - latest, oldest etc.
   * @param quantity - the number of posts to return
   * @param observer - an RxJS observer object, whose next() function accepts the resulting
   *  IPosts[] as a param.
   */
  subscribeToPosts(
    orderBy: TOrderBy,
    quantity: TQuantity,
    observer: PartialObserver<IPost[]>
  ): void;
}
