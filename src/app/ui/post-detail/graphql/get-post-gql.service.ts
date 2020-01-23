import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';
import { IGQLPostResponse } from './graphql.types';

@Injectable({
  providedIn: 'root',
})
export class GetPostGqlService extends Query<IGQLPostResponse> {
  // TODO: use fragment
  // TODO: create aria-role field
  document = gql`
    query getPost($id: ID!) {
      post(id: $id) {
        __typename
        id
        title
        tldr
        subtitle
        headerImage
        body
        createdAt
        author {
          __typename
          id
          alias
        }
      }
    }
  `;
}
