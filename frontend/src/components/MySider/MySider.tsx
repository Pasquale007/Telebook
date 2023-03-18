import axios from "axios";
import { ReactElement, useEffect } from "react";

const BASE_ENDPOINT = process.env.REACT_APP_BASE_ENDPOINT || "";
const ADDRESSBOOK_ENDPOINT = process.env.REACT_APP_ADDRESSBOOK_ENDPOINT || "";

export default function MySider(): ReactElement{

    useEffect(() => {
        console.log(ADDRESSBOOK_ENDPOINT);
        axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + sessionStorage.getItem('id') + "/get"
        ).then(response => {
            const addressbooks = response.data;
            console.log(addressbooks)
        }).catch(err => {
            console.log(err);
        })
    }, []);

    return(
        <></>
    );
}