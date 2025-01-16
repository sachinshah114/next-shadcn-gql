import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { getSession } from 'next-auth/react'; // For NextAuth session

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql', // Replace with your GraphQL endpoint
});

const authLink = new ApolloLink(async (operation, forward) => {
    // Get the current session to retrieve the token
    const session = await getSession();
    console.log(`[session is] ::: `, session.user);
    const token = session?.user?.access_token;
    console.log(`[New token is] ::: `, token);
    // Add the token to the headers
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    }));

    return forward(operation);
});

const authClient = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
});

export default authClient;