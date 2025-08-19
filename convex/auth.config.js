export default {
  providers: [
    {
      type: 'customJwt',
      applicationID: process.env.GOOGLE_APPLICATION_ID,
      issuer: 'https://accounts.google.com',
      jwks: 'https://www.googleapis.com/oauth2/v3/certs',
      algorithm: 'RS256',
    },
  ],
};
