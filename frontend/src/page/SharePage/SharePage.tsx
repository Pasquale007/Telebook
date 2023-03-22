import { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";


export function SharedPage(): ReactElement {
    const { addressbookId } = useParams();

    useEffect(() => {
        console.log(addressbookId)
    }, []);
    
    return (
        <>
            <h1>Test</h1>
        </>
    )
}