import { axiosInstance } from "../../axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ADD_USER_TO_ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT, BASE_URL } from "../../sharedValues";

export function SharedPage() {
    const { addressbookID } = useParams();
    useEffect(() => {
        axiosInstance.post(BASE_ENDPOINT + ADD_USER_TO_ADDRESSBOOK_ENDPOINT, {
            'user_id': sessionStorage.getItem('id'),
            'address_book_id': addressbookID,
        }).then(response => {
            console.log(response.data);
            window.location.href = BASE_URL;
        }).catch(err => {
            console.log(err);
        })
    }, []);

    return (
        <>
            <h1>Hinzufügen zu Addressbuch...</h1>
        </>
    )
}