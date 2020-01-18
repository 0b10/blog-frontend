import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';
import { IGQLPostsResponse } from '../posts.types';

@Injectable({
  providedIn: 'root',
})
export class GetPostsGqlService extends Query<IGQLPostsResponse> {
  document = gql`
    {
      posts(orderBy: "latest", quantity: 10) {
        id
        title
        body
        createdAt
        author {
          id
          alias
        }
      }
    }
  `;
}
