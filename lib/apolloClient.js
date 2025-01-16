"use client";
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
    // headers: {
    //     Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.getItem('token')}`
    // }
});

export default client;