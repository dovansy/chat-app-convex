const APPLICATION_ID = "74g4jh7uuqfi473hgpsesgtijo";
const ISSUER = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_f1jbqRSoH";

export default {
  providers: [
    {
      type: "customJwt",
      applicationID: APPLICATION_ID,
      issuer: ISSUER,
      jwks: ISSUER + "/.well-known/jwks.json",
      algorithm: "RS256"
    },
  ],
};