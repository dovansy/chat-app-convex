import { defineAuthConfig } from '@convex-dev/auth/server';

export default defineAuthConfig({
  providers: [
    {
      domain: 'https://accounts.google.com',
      applicationID: process.env.GOOGLE_CLIENT_ID,
    },
  ],
});
