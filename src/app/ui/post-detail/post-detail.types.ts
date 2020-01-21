import { Observable } from 'rxjs';
import { IPost } from '../posts/posts.types';

export interface IPostDetailService {
  post: Observable<IPost>;
  observePost(id: IPost['id']): void;
}
