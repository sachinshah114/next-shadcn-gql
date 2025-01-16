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

export const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!){
        login(login: $input){
            access_token,
            name,
            email
        }
    }
`;


export const CREATE_PRODUCT = gql`
    mutation CreateProduct($input: CreateProductDTO!) {
        createProduct(createProduct: $input) {
            id
            name
            description
            price
            userId
            isActive        
            createdAt
            updatedAt
            reviewsCount
        }
    }
`;