import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useCallback } from "react";


export default function SearchBar({ setContacts, allContacts }) {

    const filterContacts = useCallback((inputString) => {
        if (inputString.length === 0) {
            setContacts(allContacts);
        }
        inputString = inputString.toLowerCase();
        const contacts = allContacts.filter((contact) =>
            contact.first_name.toLowerCase().includes(inputString) ||
            contact.last_name?.toLowerCase().includes(inputString) ||
            contact.first_name.toLowerCase().concat(' ' + contact.last_name?.toLowerCase()).includes(inputString) ||
            contact.phone_numbers?.find(number => number.includes(inputString))
        )
        setContacts(contacts);
    }, [allContacts, setContacts]);


    return (
        <Input
            onChange={(e) => filterContacts(e.target.value)}
            style={{ padding: "10px", width: "50%" }}
            prefix={<SearchOutlined />
            }
        />

    )
}