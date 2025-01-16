import NextAuth from 'next-auth';

import {
  type DefaultSession,
  type DefaultUser,
} from "next-auth";


declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      access_token?: string;
    };
  }

  interface User extends DefaultUser {
    access_token?: string;
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}

// Extend JWT to include access_token
declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string; // Add optional access_token
  }
}
