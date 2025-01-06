import { gql } from '@apollo/client';

export const GET_TEST_DATA = gql`
  query {
    testQueryData(testQueryData:{
        name:"Sachin"
    })
  }
`;