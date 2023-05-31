import { DeleteOutlined, EditOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Popover } from "antd";
import { axiosInstance } from "../../axios";
import { useCallback, useMemo, useState } from "react";
import { ADDRESSBOOK_ENDPOINT, BASE_URL } from "../../sharedValues";

export default function AddressbookModal({ addressbook, setEditAddressbook, updateAddressbooks, deleteCurrentAddressbook, openNotification }) {
    const [form] = Form.useForm();
    const [isDeleting, setIsDelete] = useState(false);
    const [isShareing, setIsShare] = useState(false);
    const [open, setOpen] = useState(false);

    const SHARE_LINK = useMemo(() => { return BASE_URL + "/share/" + addressbook.id }, [addressbook.id]);;

    const cancel = useCallback(() => {
        setEditAddressbook(undefined);
    }, [setEditAddressbook]);

    const showPopover = useCallback(() => {
        setOpen(true);
        setTimeout(() => { setOpen(false) }, 1000);
    }, []);

    const shareAddressbook = useCallback(() => {
        const name = form.getFieldValue('name');
        axiosInstance.put(ADDRESSBOOK_ENDPOINT + addressbook.id, {
            'user_id': [sessionStorage.getItem('id')],
            'name': name
        }).then(response => {
            openNotification(response.data.message, "success");
            updateAddressbooks();
            cancel();

        }).catch(err => {
            openNotification(err.data.message, "error");
        });
    }, [addressbook.id, cancel, form, openNotification, updateAddressbooks]);

    const deleteAddressbook = useCallback(() => {
        axiosInstance.delete(ADDRESSBOOK_ENDPOINT + addressbook.id + "/get/" + sessionStorage.getItem('id')
        ).then(response => {
            openNotification(response.data.message, "success");
            updateAddressbooks();
            deleteCurrentAddressbook();
        }).catch(err => {
            openNotification(err.data.message, "error");
        });
        setEditAddressbook(undefined);
    }, [addressbook.id, deleteCurrentAddressbook, openNotification, setEditAddressbook, updateAddressbooks]);

    const initDeleteModal = useCallback(() => {
        setIsShare(false);
        setIsDelete(!isDeleting);
    }, [isDeleting]);

    const iniShare = useCallback(() => {
        setIsDelete(false);
        setIsShare(!isShareing);
    }, [isShareing]);

    return (
        <Modal
            open
            onOk={() => { isDeleting ? deleteAddressbook() : (isShareing ? cancel() : shareAddressbook()) }}
            onCancel={() => cancel()}
        >
            <Form form={form}>
                <Form.Item name="name" initialValue={addressbook.name} style={{ marginTop: "30px" }}>
                    <Input prefix={<EditOutlined />} disabled={isShareing || isDeleting} />
                </Form.Item>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    <Button
                        type={isShareing ? 'primary' : 'default'}
                        onClick={iniShare}
                        icon={<ShareAltOutlined />}
                    />
                    <Button
                        type={isDeleting ? 'primary' : 'default'}
                        danger
                        onClick={initDeleteModal}
                        icon={<DeleteOutlined />}
                    />
                </div>
                {isShareing &&
                    <>
                        <p>
                            Kopiere einfach folgenden Link und schicke ihn deinen Freunden:
                            <br />
                        </p>
                        <Popover
                            content="In Zwischenablage kopiert"
                            placement={"topLeft"}
                            trigger="click"
                            open={open}
                            onOpenChange={showPopover}
                        >
                            <p style={{ color: 'blue', cursor: 'pointer' }}
                                onClick={() => { navigator.clipboard.writeText(SHARE_LINK) }}>
                                {SHARE_LINK}
                            </p>
                        </Popover>
                    </>
                }
            </Form>
            {isDeleting &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p>Bist du sicher, dass das das Addressbuch mit allem Kontaken löschen möchtest?</p>
                </div>
            }

        </Modal>
    );

}