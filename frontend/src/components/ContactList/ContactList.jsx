import { Avatar, List } from "antd";
import { useCallback } from "react";

export default function ContactList({ contacts, editContactCallback, deleteContactCallback }) {

    const phone_numbers = useCallback((contact) => {
        if (contact.phone_numbers && contact.phone_numbers.length > 0) {
            let addresses = contact.phone_numbers.map(number => " | " + number)
            return addresses;
        } else {
            return ""
        }
    }, []);

    const desc = useCallback((contact) => {
        let information = []
        if (contact.email) {
            information.push(" Email: " + contact.email)
        }

        if (contact.zip_code && contact.city && contact.street) {
            information.push(" Wohnort: " + contact.zip_code + ", " + contact.city + ", " + contact.street);
        }
        if (contact.birthday) {
            information.push(" Geburtstag: " + contact.birthday.split("-")[1] + "." + contact.birthday.split("-")[0] + "." + contact.birthday.split("-")[2]);
        }
        return information.join(" | ");
    }, []);

    const editContact = useCallback((key) => {
        const searchedContact = contacts.find((contact) => contact.id === key)
        if (searchedContact) {
            editContactCallback(searchedContact);
        }
    }, [contacts, editContactCallback]);

    const deleteContact = useCallback((key) => {
        const searchedContact = contacts.find((contact) => contact.id === key);
        if (searchedContact) {
            deleteContactCallback(searchedContact);
        }
    }, [contacts, deleteContactCallback]);

    return (
        <List
            style={{ height: "calc(100vh - 70px)", overflow: "scroll" }}
            itemLayout="horizontal"
            dataSource={contacts}
            renderItem={(contact, index) => (
                <List.Item
                    actions={[<p onClick={() => editContact(contact.id)} style={{ cursor: 'pointer', padding: '10px' }}>bearbeiten</p>,
                    <p onClick={() => deleteContact(contact.id)} style={{ cursor: 'pointer', padding: '10px' }}>löschen</p>]}
                    style={{ marginRight: "20px" }}
                    key={contact.id}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={`https://api.dicebear.com/5.x/avataaars/svg/seed=${contact.first_name + contact.last_name}`} />}
                        title={<div><h3>{contact.first_name} {contact.last_name} {phone_numbers(contact)}</h3></div>}
                        description={desc(contact)}
                    />
                </List.Item>
            )}
        />
    );
}