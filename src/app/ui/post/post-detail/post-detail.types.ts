import { Subscription } from 'rxjs';

export interface IPostDetailService {
  post: IPost;
  error: boolean;
  loading: boolean;

  getPostSub(id: IPost['id']): Subscription;
}

export interface IAuthor {
  id: number;
  alias: string;
}

export interface IPost {
  id: number;
  title: string;
  subtitle: string;
  tldr: string;
  headerImage: string;
  body: string;
  author: IAuthor;
  createdAt: Date;
}
