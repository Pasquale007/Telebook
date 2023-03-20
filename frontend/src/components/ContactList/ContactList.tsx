import { Avatar, List } from "antd";
import { ReactElement } from "react";
import { Contact } from "../../sharedTypes";



type ContactListProps = {
    contacts: Contact[],
    editContactCallback: any,
    deleteContactCallback: any
}

export default function ContactList(props: ContactListProps): ReactElement {
    const { contacts, editContactCallback, deleteContactCallback } = props;
    function desc(contact: Contact): string {
        let result = ""
        if (contact.email) {
            result += "Email: " + contact.email
        }
        if (contact.phone_numbers.length > 0) {
            result += " | Nummer: "
            contact.phone_numbers.map(number => result += number + ", ")
        }
        result = result.substring(0, result.length - 1);
        if (contact.zip_code) {
            result += " | Wohnort: " + contact.zip_code;
        }
        if (contact.city) {
            result += ", " + contact.city;
        }
        if (contact.street) {
            result += ", " + contact.street;
        }
        if (contact.birthday) {
            result += " | " + new Date(contact.birthday).toISOString().split('T')[0];
        }
        return result;
    }

    function editContact(key: number) {
        const searchedContact: Contact | undefined = contacts.find((contact) => contact.id === key)
        if (searchedContact) {
            editContactCallback(searchedContact);
        }
    }

    function deleteContact(key: number) {
        const searchedContact: Contact | undefined = contacts.find((contact) => contact.id === key);
        if (searchedContact) {
            deleteContactCallback(searchedContact);
        }
    }

    return (
        <List
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
                        avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
                        title={<h3>{contact.first_name + ' ' + contact.last_name}</h3>}
                        description={desc(contact)}
                    />
                </List.Item>
            )}
        />
    );
}