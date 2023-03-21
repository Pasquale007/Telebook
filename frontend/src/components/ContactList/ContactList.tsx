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
        let information: string[] = []
        if (contact.email) {
            information.push(" Email: " + contact.email)
        }
        if (contact.phone_numbers && contact.phone_numbers.length > 0) {
            let address = " Nummer(n): " + contact.phone_numbers.map(number => " " + number)
            information.push(address.substring(0, address.length - 2))
        }
        if (contact.zip_code && contact.city && contact.street) {
            information.push(" Wohnort: " + contact.zip_code + ", " + contact.city + ", " + contact.street);
        }
        if (contact.birthday) {
            information.push(" Geburtstag: " + new Date(contact.birthday).toISOString().split('T')[0]);
        }
        return information.join(" | ");
    }

    function editContact(key: number | undefined) {
        const searchedContact: Contact | undefined = contacts.find((contact) => contact.id === key)
        if (searchedContact) {
            editContactCallback(searchedContact);
        }
    }

    function deleteContact(key: number | undefined) {
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
                        title={<h3>{contact.first_name} {contact.last_name}</h3>}
                        description={desc(contact)}
                    />
                </List.Item>
            )}
        />
    );
}