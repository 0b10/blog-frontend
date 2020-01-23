import { Subscription } from 'rxjs';
import { IPost } from '../posts/posts.types';

export interface IPostDetailService {
  post: IPost;
  error: boolean;
  loading: boolean;

  getPostSub(id: IPost['id']): Subscription;
}
