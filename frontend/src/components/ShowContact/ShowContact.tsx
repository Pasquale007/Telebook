import { ReactElement, useEffect } from "react";
import { Contact } from "../../sharedTypes";

type showContactProps = {
    contact: Contact
}

export default function ShowContact(props: showContactProps): ReactElement {
    const { contact } = props;

    useEffect(() => {
        console.log(contact)
    }, []);

    return (
        <div>
            {contact.first_name + " " + contact.last_name}
        </div>
    );
}