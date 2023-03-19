import { Avatar, List } from "antd";
import { ReactElement } from "react";
import { Contact } from "../../sharedTypes";



type ContactListProps = {
    contacts: Contact[],
    editContactCallback: any
}

export default function ContactList(props: ContactListProps): ReactElement {
    const { contacts, editContactCallback } = props;
    function desc(contact: Contact): string {
        let result = ""
        if (contact.email) {
            result += "Email: " + contact.email
        }
        if (contact.phone_numbers) {
            result += " | Nummer: "
            contact.phone_numbers.map(number => result += number + ", ")
        }
        result = result.substring(0, result.length - 2);
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
            result += " | " + new Date(contact.birthday);
        }
        return result;
    }

    function editContact(key: number) {
        const searchedContact: Contact | undefined = contacts.find((contact) => contact.id === key)
        if (searchedContact) {
            editContactCallback(searchedContact);
        }
    }

    return (
        <List
            itemLayout="horizontal"
            dataSource={contacts}
            renderItem={(contact, index) => (
                <List.Item
                    actions={[<p onClick={() => editContact(contact.id)} style={{ cursor: 'pointer', padding: '10px' }}>edit</p>]}
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