import { HomeOutlined, MailOutlined, NodeIndexOutlined, PhoneOutlined, PlusOutlined, ScanOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, DatePicker, Form, Input, Modal, Space } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT, CONTACT_ENDPOINT } from "../../sharedValues";
import { useNavigate } from "react-router-dom";

//evtl mit id -1 arbeiten
export default function EditContact() {
    const { contacbookID, userID, mode } = useParams();
    const [contactForm] = Form.useForm();
    const [editContact, setEditContact] = useState();
    const [errorMsg, setErrorMsg] = useState("");

    let navigate = useNavigate();

    useEffect(() => {
        if (errorMsg.length > 0) {
            setTimeout(() => setErrorMsg(""), 5000);
        }
    }, [errorMsg]);

    const createContact = () => {
        const contact = editContact;
        if (!contact.first_name) {
            setErrorMsg("Bitte gib einen Vornamen an");
            return;
        }
        let phone_numbers = contact.phone_numbers?.map(((_, i) => contactForm.getFieldValue('phone_number' + i)));
        if (contactForm.getFieldValue('first_name')) {
            setEditContact(undefined);
        } else {
            console.log("Bitte vergieb mindestens einen Vornamen um einen Kontakt zu erstellen.");
            return;
        }
        axios.post(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + contacbookID + CONTACT_ENDPOINT, {
            'first_name': contactForm.getFieldValue('first_name'),
            'last_name': contactForm.getFieldValue('last_name'),
            'phone_numbers': phone_numbers,
            'street': contactForm.getFieldValue('street'),
            'city': contactForm.getFieldValue('city'),
            'zip_code': contactForm.getFieldValue('zip_code'),
            'email': contactForm.getFieldValue('email'),
            'birthday': contactForm.getFieldValue('birthday')?.toISOString().split('T')[0],
        }).then(response => {
            console.log(response);
            navigate(`/#${contacbookID}"`);
        }).catch(err => {
            setErrorMsg(err);
            console.log(err);
        })
    }

    const sendUpdatedContact = () => {
        const contact = editContact;
        if (!contactForm.getFieldValue('first_name')) {
            setErrorMsg("Bitte gib einen Vornamen an");
            return;
        }
        setEditContact(undefined);
        let phone_numbers = editContact?.phone_numbers?.map(((_, i) => contactForm.getFieldValue('phone_number' + i)));
        const id = contact.id;
        axios.put(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + editContact?.address_book_id + CONTACT_ENDPOINT + "/" + id, {
            'first_name': contactForm.getFieldValue('first_name'),
            'last_name': contactForm.getFieldValue('last_name'),
            'phone_numbers': phone_numbers,
            'street': contactForm.getFieldValue('street'),
            'city': contactForm.getFieldValue('city'),
            'zip_code': contactForm.getFieldValue('zip_code'),
            'email': contactForm.getFieldValue('email'),
            'birthday': contactForm.getFieldValue('birthday')?.toISOString().split('T')[0],
        }).then(response => {
            console.log(response);
            navigate(`/#${contacbookID}`);
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + contacbookID + CONTACT_ENDPOINT + "/" + userID
        ).then(response => {
            console.log(response);
            setEditContact(response.data)
        }).catch(err => {
            console.log(err);
        })
    }, []);

    return (
        <Modal
            open={editContact ? true : false}
            onOk={() => {
                if (mode === 'EDIT') {
                    sendUpdatedContact();
                } else if (mode === 'CREATE') {
                    createContact();
                }
            }}
            onCancel={() => {
                setEditContact(undefined);
                navigate(`/#${contacbookID}`);
            }}
        >
            <Space direction="vertical">
                {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
                <Form form={contactForm}>
                    <Space direction="vertical">
                        <Space direction="horizontal">
                            <Form.Item name="first_name" initialValue={editContact?.first_name} style={{ margin: "0px" }}>
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item name="last_name" initialValue={editContact?.last_name} style={{ margin: "0px" }}>
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                        </Space>
                        {editContact?.phone_numbers?.map((phone_number, key) => {
                            return <Form.Item name={"phone_number" + key} initialValue={phone_number} style={{ margin: "0px" }}>
                                <Input prefix={<PhoneOutlined />} key={key} />
                            </Form.Item>
                        })}
                        <Button icon={<PlusOutlined />} onClick={() => {
                            let newContact = JSON.parse(JSON.stringify(editContact));
                            if (newContact && !newContact.phone_numbers) {
                                newContact.phone_numbers = []
                            }
                            newContact?.phone_numbers?.push("");
                            setEditContact(newContact);
                        }} />
                        <Space direction="horizontal">
                            <Form.Item name={"street"} initialValue={editContact?.street} style={{ margin: "0px" }}>
                                <Input prefix={<NodeIndexOutlined />} />
                            </Form.Item>
                            <Form.Item name={"city"} initialValue={editContact?.city} style={{ margin: "0px" }}>
                                <Input prefix={<HomeOutlined />} />
                            </Form.Item>
                            <Form.Item name={"zip_code"} initialValue={editContact?.zip_code} style={{ margin: "0px" }}>
                                <Input prefix={<ScanOutlined />} />
                            </Form.Item>
                        </Space>
                        <Form.Item name={"email"} initialValue={editContact?.email} style={{ margin: "0px" }}>
                            <Input prefix={<MailOutlined />} />
                        </Form.Item>
                        <Form.Item name={"birthday"} initialValue={editContact?.birthday ? moment(editContact?.birthday, 'YYYY-MM-DD') : undefined} style={{ margin: "0px" }}>
                            <DatePicker />
                        </Form.Item>
                    </Space>
                </Form>
            </Space>
        </Modal>
    );
}