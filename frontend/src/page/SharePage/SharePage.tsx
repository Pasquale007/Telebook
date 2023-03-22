import { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";


export function SharedPage(): ReactElement {
    const { addressbookID } = useParams();

    useEffect(() => {
        console.log(addressbookID)
    }, []);

    return (
        <>
            <h1>Test</h1>
        </>
    )
}