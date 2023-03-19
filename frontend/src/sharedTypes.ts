export type Addressbook = {
    id: number,
    user_id: number,
    name: string
}

export type Contact = {
    id: number
    address_book_id: number,
    city: string,
    email: string,
    first_name: string,
    last_name: string,
    phone_numbers: string[],
    street: string,
    zip_code: string,
    birthday: string
}