import { Modal } from "antd";
import { axiosInstance } from "../../axios";
import { CONTACT_ENDPOINT, CONTACT_URL } from "../../sharedValues";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmationDeleteModal({ deleteContact, setDeleteContact, updateContacts, openNotification }) {
    let navigate = useNavigate();

    const delContact = useCallback(() => {
        const contact = deleteContact;
        setDeleteContact(undefined);
        axiosInstance.delete(CONTACT_URL + contact?.address_book_id + CONTACT_ENDPOINT + "/" + contact?.id
        ).then(response => {
            openNotification(response.data.message, "success");
            updateContacts();
        }).catch(err => {
            openNotification(err.response.data.message, "error");
        })
        navigate(`/`)
    }, [deleteContact, navigate, openNotification, setDeleteContact, updateContacts]);

    const cancel = useCallback(() => {
        setDeleteContact(undefined);
    }, [setDeleteContact])

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