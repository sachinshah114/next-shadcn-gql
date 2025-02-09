import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { LOGIN_MUTATION } from './utils/mutations';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { store } from './store/useStore';
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL API endpoint
  cache: new InMemoryCache(),
  headers: {
    'Content-Type': 'application/json',
  },
});
const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        try {

          // Perform the login mutation
          console.log(`Sending mutation with variables:`, {
            input: {
              email: credentials.email,
              password: credentials.password,
            },
          });
          const { data } = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
              input: {
                email: credentials.email,
                password: credentials.password,
              },
            },
          });

          console.log(`[Login response]:`, data);

          // Extract the user and token
          const response = data?.login;
          if (!response.access_token) {
            return null;
          }

          const user = {
            name: response.name, // Example logic for name
            email: response.email,
            access_token: response.access_token, // Pass the token to session or middleware
          };

          console.log(`[Login user]:`, user);
          store.setLoginResponse(data);

          return user;
        } catch (error: any) {
          console.error(`[Login Error]:`, error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add access_token to the token object   
        console.log(`In callbacks auth === `, user)
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add access_token to the session object 
      console.log(`In session auth === `, token);
      session.user.access_token = token?.access_token as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: '/' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
