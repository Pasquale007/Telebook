import { HomeOutlined, MailOutlined, NodeIndexOutlined, PhoneOutlined, PlusOutlined, ScanOutlined, UserOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, Space } from "antd";
import { axiosInstance } from "../../axios";
import moment from "moment";
import { CONTACT_ENDPOINT, CONTACT_URL } from "../../sharedValues";
import { useCallback } from "react";


export default function ContactModal({ editContact, setEditContact, updateContacts, mode, openNotification }) {
    const [contactForm] = Form.useForm();

    const createContact = useCallback(() => {
        const values = contactForm.getFieldsValue();
        const contact = editContact;
        let phone_numbers = contact.phone_numbers?.map(((_, i) => contactForm.getFieldValue('phone_number' + i)));
        if (values.first_name) {
            setEditContact(undefined);
        } else {
            console.log("Bitte vergieb mindestens einen Vornamen um einen Kontakt zu erstellen.");
            return;
        }
        const payload = { ...values, 'phone_numbers': phone_numbers, 'birthday': contactForm.getFieldValue('birthday')?.toISOString().split('T')[0] }
        axiosInstance.post(CONTACT_URL + contact.address_book_id + CONTACT_ENDPOINT, payload)
            .then(response => {
                openNotification(response.data.message, "success");
                updateContacts();
            }).catch(err => {
                openNotification(err.data.message, "error");
                updateContacts();
            })
    }, [contactForm, editContact, openNotification, setEditContact, updateContacts]);

    const sendUpdatedContact = useCallback(() => {
        const values = contactForm.getFieldsValue();
        const contact = editContact;
        if (values.first_name) {
            setEditContact(undefined);
        } else {
            console.log("Bitte vergieb mindestens einen Vornamen um einen Kontakt zu erstellen.");
            return;
        }
        let phone_numbers = editContact?.phone_numbers?.map(((_, i) => contactForm.getFieldValue('phone_number' + i)));
        const payload = { ...values, 'phone_numbers': phone_numbers, 'birthday': contactForm.getFieldValue('birthday')?.toISOString().split('T')[0], }
        const id = contact.id;
        axiosInstance.put(CONTACT_URL + editContact?.address_book_id + CONTACT_ENDPOINT + "/" + id, payload).then(response => {
            openNotification(response.data.message, "success");
            updateContacts();
        }).catch(err => {
            openNotification(err.data.message, "error");
            updateContacts();
        })
    }, [contactForm, editContact, openNotification, setEditContact, updateContacts])

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
            onCancel={() => setEditContact(undefined)}
        >
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
        </Modal>
    );
}