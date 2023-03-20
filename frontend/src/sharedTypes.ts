// Types
export type Addressbook = {
    id: number,
    user_id: number,
    name: string
}

export type Contact = {
    id?: number
    address_book_id?: number,
    city?: string,
    email?: string,
    first_name: string,
    last_name?: string,
    phone_numbers?: string[],
    street?: string,
    zip_code?: string,
    birthday?: string
}
//Endpoints
export const BASE_ENDPOINT = process.env.REACT_APP_BASE_ENDPOINT || "";
export const ADDRESSBOOK_ENDPOINT = process.env.REACT_APP_ADDRESSBOOK_ENDPOINT || "";
export const CONTACT_ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT || "";
export const BASE_URL = process.env.REACT_APP_BASE_URL || "";
export const LOGIN_ENDPOINT = process.env.REACT_APP_LOGIN_ENDPOINT || "";
export const SIGNUP_ENDPOINT = process.env.REACT_APP_SIGNUP_ENDPOINT || "";
