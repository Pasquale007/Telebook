import { Avatar, List } from "antd";
import { Contact } from "../../sharedTypes";


export default function ContactList({ contacts, editContactCallback, deleteContactCallback }) {

    const desc = (contact) => {
        let information = []
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

    const editContact = (key) => {
        const searchedContact = contacts.find((contact) => contact.id === key)
        if (searchedContact) {
            editContactCallback(searchedContact);
        }
    }

    const deleteContact = (key) => {
        const searchedContact = contacts.find((contact) => contact.id === key);
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
                        avatar={<Avatar src={`https://api.dicebear.com/5.x/avataaars/svg/seed=${contact.first_name + contact.last_name}`} />}
                        title={<h3>{contact.first_name} {contact.last_name}</h3>}
                        description={desc(contact)}
                    />
                </List.Item>
            )}
        />
    );
}