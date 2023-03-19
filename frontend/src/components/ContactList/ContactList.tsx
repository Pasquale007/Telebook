import { Avatar, List } from "antd";
import { ReactElement } from "react";
import { Contact } from "../../sharedTypes";



type ContactListProps = {
    contacts: Contact[]
}
export default function ContactList(props: ContactListProps): ReactElement {
    const { contacts } = props;

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

    return (
        <List
            itemLayout="horizontal"
            dataSource={contacts.sort((a, b) => a.first_name < b.first_name ? 1 : ((a.last_name < b.last_name) ? -1 : 0))}
            renderItem={(contact, index) => (
                <List.Item
                    onClick={(e) => {
                        console.log(e)
                    }}
                    actions={[<p key="list-loadmore-edit">edit</p>]}
                    style={{ marginRight: "20px" }}
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