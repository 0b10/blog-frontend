import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';
import { IPostListApolloResponse } from '../post-list.types';

@Injectable({
  providedIn: 'root',
})
export class GetPostListApolloService extends Query<IPostListApolloResponse> {
  document = gql`
    {
      posts(orderBy: "latest", quantity: 10) {
        id
        title
        subtitle
        headerImage
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
