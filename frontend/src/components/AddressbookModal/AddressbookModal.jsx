import { DeleteOutlined, EditOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import {  useState } from "react";
import {  ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT } from "../../sharedTypes";


export default function AddressbookModal({ addressbook, setEditAddressbook, updateAddressbooks, deleteAddressbook }) {

    const [form] = Form.useForm();
    const [del, setDelete] = useState(false);
    const [share, setShare] = useState(false);

    const action = () => {
        if (del) {
            axios.delete(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + addressbook.id + "/get/" + sessionStorage.getItem('id')
            ).then(response => {
                updateAddressbooks();
                deleteAddressbook();
                console.log(response);
            }).catch(err => {
                console.log(err);
            });
        } else if (!share) {
            const name = form.getFieldValue('name');
            console.log(name);
            axios.put(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + addressbook.id, {
                'user_id': [sessionStorage.getItem('id')],
                'name': name
            }).then(response => {
                console.log(response);
                updateAddressbooks();
            }).catch(err => {
                console.log(err);
            });
        }
        setEditAddressbook(undefined);
    }

    const cancel = () => {
        setEditAddressbook(undefined);
    }

    const initDeleteModal = () => {
        setShare(false);
        setDelete(true);
    }

    const iniShare = () => {
        setDelete(false);
        setShare(true);

    }

    return (
        <Modal
            open
            onOk={() => action()}
            onCancel={() => cancel()}
        >
            <Form form={form}>
                <Form.Item name="name" initialValue={addressbook.name} style={{ marginTop: "30px" }}>
                    <Input prefix={<EditOutlined />} disabled={share || del} />
                </Form.Item>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    <Button
                        onClick={initDeleteModal}
                        icon={<DeleteOutlined />}
                    />
                    <Button
                        onClick={iniShare}
                        icon={<ShareAltOutlined />}
                    />
                </div>

                {share &&
                    <p>
                        Kopiere einfach folgenden Link und schicke ihn deinen Freunden:
                        <br />
                        <p style={{ color: 'blue', cursor: 'pointer' }}
                            onClick={() => { navigator.clipboard.writeText(window.location.href + "share/" + addressbook.id) }}>
                            {window.location.href + "share/" + addressbook.id}
                        </p>
                    </p>
                }
            </Form>
            {del &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p>Bist du sicher, dass das das Addressbuch mit allem Kontaken löschen möchtest?</p>
                </div>
            }

        </Modal>
    );

}