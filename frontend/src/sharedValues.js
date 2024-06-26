//Endpoints
export const BASE_ENDPOINT = process.env.REACT_APP_BASE_ENDPOINT || "";
export const ADDRESSBOOK_ENDPOINT = process.env.REACT_APP_ADDRESSBOOK_ENDPOINT || "";
export const CONTACT_ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT || "";
export const CONTACT_URL = process.env.REACT_APP_CONTACT_ENDPOINT + "s/" || "";
export const BASE_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
export const LOGIN_ENDPOINT = process.env.REACT_APP_LOGIN_ENDPOINT || "";
export const SIGNUP_ENDPOINT = process.env.REACT_APP_SIGNUP_ENDPOINT || "";
export const ADD_USER_TO_ADDRESSBOOK_ENDPOINT = process.env.REACT_APP_ADD_USER_TO_ADDRESSBOOK_ENDPOINT || "";
export const LOGOUT_ENDPOINT = process.env.REACT_APP_LOGOUT_ENDPOINT || "";
