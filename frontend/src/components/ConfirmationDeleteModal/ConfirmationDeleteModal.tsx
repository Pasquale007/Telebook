import { Modal } from "antd";
import axios from "axios";
import { ReactElement } from "react";
import { ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT, Contact, CONTACT_ENDPOINT } from "../../sharedTypes";


type DelteConfirmationDeleteModal = {
    deleteContact: Contact | undefined,
    setDeleteContact: any,
    updateContacts: any
}

export default function ConfirmationDeleteModal(props: DelteConfirmationDeleteModal): ReactElement {
    const { deleteContact, setDeleteContact, updateContacts} = props;

    function delContact() {
        const contact: Contact | undefined = deleteContact;
        setDeleteContact(undefined);
        axios.delete(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + contact?.address_book_id + CONTACT_ENDPOINT + "/" + contact?.id
        ).then(response => {
            console.log(response.data.message);
            updateContacts();
        }).catch(err => {
            console.log(err);
        })
    }
    function cancel() {
        setDeleteContact(undefined);
    }
    return (
        <>
            {deleteContact && <Modal
                open
                title={"Sind sie sich sicher, dass sie " + deleteContact.first_name + " " +
                    deleteContact.last_name + " löschen wollen?"}
                onOk={() => delContact()}
                onCancel={() => cancel()}
                okText={"Löschen"}
                cancelText={"Abbrechen"}
            >
            </Modal>}
        </>
    );
}