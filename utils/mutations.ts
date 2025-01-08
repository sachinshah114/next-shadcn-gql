import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInputDTO!) {
        createUser(createUserInput: $input) {
            id
            name
            email
            password
            isVerified
            verificationCode
            phone
            isBlocked
            role
            createdAt
            updatedAt
        }
    }
`;