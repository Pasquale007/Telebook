import { HomeOutlined, MailOutlined, NodeIndexOutlined, PhoneOutlined, ScanOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal, Space, DatePicker } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT, CONTACT_ENDPOINT } from "../../sharedValues";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

export default function EditContact() {
    const { contacbookID, userID, mode } = useParams();
    const [contactForm] = Form.useForm();
    const [editContact, setEditContact] = useState();
    const [errorMsg, setErrorMsg] = useState("");
    let navigate = useNavigate();
    let nextRoute = `/#${contacbookID}`;

    useEffect(() => {
        if (errorMsg.length > 0) {
            setTimeout(() => setErrorMsg(""), 5000);
        }
    }, [errorMsg]);

    const createContact = () => {
        if (!contactForm.getFieldValue('first_name')) {
            setErrorMsg("Bitte gib einen Vornamen an");
            return;
        }
        setEditContact(undefined);

        const birthday = contactForm.getFieldValue('birthday');
        const newBirthday = (birthday.get('month') + 1) + "-" + birthday.get('date') + "-" + birthday.get('year');
        let phone_numbers = editContact?.phone_numbers?.map(((_, i) => contactForm.getFieldValue('phone_number' + i)));
        axios.post(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + contacbookID + CONTACT_ENDPOINT, {
            'first_name': contactForm.getFieldValue('first_name'),
            'last_name': contactForm.getFieldValue('last_name'),
            'phone_numbers': phone_numbers,
            'street': contactForm.getFieldValue('street'),
            'city': contactForm.getFieldValue('city'),
            'zip_code': contactForm.getFieldValue('zip_code'),
            'email': contactForm.getFieldValue('email'),
            'birthday': newBirthday,
        }).then(response => {
            let contact_id = response.data.id;
            if (nextRoute.includes('-1')) {
                nextRoute = nextRoute.replace('-1', contact_id);
            }
            navigate(nextRoute);
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
        const id = contact.id;
        //+1 for right time format -> 1 = JAN
        const birthday = contactForm.getFieldValue('birthday');
        const newBirthday = (birthday.get('month') + 1) + "-" + birthday.get('date') + "-" + birthday.get('year');
        axios.put(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + editContact?.address_book_id + CONTACT_ENDPOINT + "/" + id, {
            'first_name': contactForm.getFieldValue('first_name'),
            'last_name': contactForm.getFieldValue('last_name'),
            'street': contactForm.getFieldValue('street'),
            'city': contactForm.getFieldValue('city'),
            'zip_code': contactForm.getFieldValue('zip_code'),
            'email': contactForm.getFieldValue('email'),
            'birthday': newBirthday,
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
                    navigate(`/#${contacbookID}`);
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
                                <Input prefix={<PhoneOutlined />} key={key} disabled />
                            </Form.Item>
                        })}
                        <Button icon={<PhoneOutlined />} onClick={() => {
                            if (mode === 'EDIT') {
                                navigate(`/contactbook/${contacbookID}/contact/${editContact.id}/${mode}/phonenumbers`);
                            } else if (mode === 'CREATE') {
                                createContact();
                                nextRoute = `/contactbook/${contacbookID}/contact/-1/${mode}/phonenumbers`;
                            }
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
                        <Form.Item name={"birthday"} initialValue={editContact?.birthday ? dayjs(editContact?.birthday) : null} style={{ margin: "0px" }}>
                            <DatePicker />
                        </Form.Item>
                    </Space>
                </Form>
            </Space>
        </Modal>
    );
}