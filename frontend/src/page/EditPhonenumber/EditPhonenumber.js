import { HomeOutlined, MailOutlined, NodeIndexOutlined, PhoneOutlined, PlusOutlined, ScanOutlined, UserOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, Space } from "antd";
import { axiosInstance } from "../../axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_ENDPOINT, CONTACT_ENDPOINT, CONTACT_URL } from "../../sharedValues";
import { useNavigate } from "react-router-dom";

export default function EditPhonenumber() {
    const { contacbookID, userID } = useParams();
    const [contactForm] = Form.useForm();
    const [editContact, setEditContact] = useState();
    let navigate = useNavigate();

    const updatePhonnumbers = () => {
        let phone_numbers = editContact?.phone_numbers?.map(((_, i) => contactForm.getFieldValue('phone_number' + i)));
        const valid_phoneNumbers = phone_numbers.filter(phone_number => phone_number !== '');
        //+1 for right time format -> 1 = JAN
        const birthday = contactForm.getFieldValue('birthday');
        const newBirthday = (birthday?.get('month') + 1) + "-" + birthday?.get('date') + "-" + birthday?.get('year');
        axiosInstance.put(BASE_ENDPOINT + CONTACT_URL + editContact?.address_book_id + CONTACT_ENDPOINT + "/" + editContact.id, {
            'first_name': contactForm.getFieldValue('first_name'),
            'last_name': contactForm.getFieldValue('last_name'),
            'street': contactForm.getFieldValue('street'),
            'city': contactForm.getFieldValue('city'),
            'zip_code': contactForm.getFieldValue('zip_code'),
            'email': contactForm.getFieldValue('email'),
            'birthday': birthday ? newBirthday : undefined,
            'phone_numbers': valid_phoneNumbers,
        }).then(response => {
            setEditContact(undefined);
            console.log(response);
            navigate(`/contactbook/${contacbookID}/contact/${editContact.id}/EDIT`);
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        axiosInstance.get(BASE_ENDPOINT + CONTACT_URL + contacbookID + CONTACT_ENDPOINT + "/" + userID
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
            onOk={() => { updatePhonnumbers() }}
            onCancel={() => {
                setEditContact(undefined);
                navigate(`/contactbook/${contacbookID}/contact/${editContact.id}/EDIT`);
            }}
        >
            <Space direction="vertical">
                <Form form={contactForm}>
                    <Space direction="vertical">
                        <Space direction="horizontal">
                            <Form.Item name="first_name" initialValue={editContact?.first_name} style={{ margin: "0px" }} >
                                <Input prefix={<UserOutlined />} disabled />
                            </Form.Item>
                            <Form.Item name="last_name" initialValue={editContact?.last_name} style={{ margin: "0px" }}>
                                <Input prefix={<UserOutlined />} disabled />
                            </Form.Item>
                        </Space>
                        {editContact?.phone_numbers?.map((phone_number, key) => {
                            return <Form.Item name={"phone_number" + key} initialValue={phone_number} style={{ margin: "0px" }} key={key}>
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
                                <Input prefix={<NodeIndexOutlined />} disabled />
                            </Form.Item>
                            <Form.Item name={"city"} initialValue={editContact?.city} style={{ margin: "0px" }}>
                                <Input prefix={<HomeOutlined />} disabled />
                            </Form.Item>
                            <Form.Item name={"zip_code"} initialValue={editContact?.zip_code} style={{ margin: "0px" }}>
                                <Input prefix={<ScanOutlined />} disabled />
                            </Form.Item>
                        </Space>
                        <Form.Item name={"email"} initialValue={editContact?.email} style={{ margin: "0px" }}>
                            <Input prefix={<MailOutlined />} disabled />
                        </Form.Item>
                        <Form.Item name={"birthday"} initialValue={editContact?.birthday ? moment(editContact?.birthday, 'YYYY-MM-DD') : undefined} style={{ margin: "0px" }}>
                            <DatePicker disabled />
                        </Form.Item>
                    </Space>
                </Form>
            </Space>
        </Modal>
    );
}