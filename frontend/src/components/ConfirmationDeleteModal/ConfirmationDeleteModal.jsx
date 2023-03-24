import { Modal } from "antd";
import axios from "axios";
import { ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT, CONTACT_ENDPOINT } from "../../sharedTypes";

export default function ConfirmationDeleteModal({ deleteContact, setDeleteContact, updateContacts }) {

    const delContact = () => {
        const contact = deleteContact;
        setDeleteContact(undefined);
        axios.delete(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + contact?.address_book_id + CONTACT_ENDPOINT + "/" + contact?.id
        ).then(response => {
            console.log(response.data.message);
            updateContacts();
        }).catch(err => {
            console.log(err);
        })
    }
    const cancel = () => {
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