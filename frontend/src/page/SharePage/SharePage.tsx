import axios from "axios";
import { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ADD_USER_TO_ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT } from "../../sharedTypes";


export function SharedPage(): ReactElement {
    const { addressbookID } = useParams();

    useEffect(() => {
        axios.post(BASE_ENDPOINT + ADD_USER_TO_ADDRESSBOOK_ENDPOINT, {
            'user_id': sessionStorage.getItem('id'),
            'address_book_id': addressbookID,
        }).then(response => {
            console.log(response.data);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    return (
        <>
            <h1>Test</h1>
        </>
    )
}