/**
*An array of routes that are accessible to the public 
*these routes do not require authentication
*@type {string[]}
*/
export const publicRoutes = [
 "/",
];

/**
*An array of routes that are used for authentication
*these routes will redirect logged in users to /settings
*@type {string[]}
*/
export const authRoutes = [
      "/auth/login",
    "/auth/register",
];

/**
* the prefix for api authentication routes
* routes that start with this prefix are used for api
*@type {string}
*/
export const apiAuthPrefix = "/api/auth";

/**
*the default redirect path after logging in 
*@type {string}
*/
export const DEFAULT_LOGIN_REDIRECT = "/settings";