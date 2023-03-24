import { Content } from "antd/es/layout/layout";
import { Input, Layout, Menu, Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useRef, useState } from "react";
import { ContactsOutlined, PlusOutlined } from "@ant-design/icons";
import { ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT } from "./sharedTypes";
import axios from "axios";


export default function Format({ addressbooks, children, callback, updateAddressBooks }) {
    const [items, setItems] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [nameAddressbook, setNameAddressbook] = useState(false);
    const inputName = useRef(null);

    function getItem(
        label,
        key,
        icon,
        children,
    ) {
        return { key, icon, children, label, };
    }

    useEffect(() => {
        const books = addressbooks.map(address => getItem(address.name, address.id, <ContactsOutlined />));
        setItems(books);
    }, [addressbooks]);

    const createAddressbook = () => {
        setNameAddressbook(true);
    }

    const sendNewAddressbook = () => {
        let addressBookName = "";
        if (inputName.current) {
            addressBookName = inputName.current['input']['value'];
        }
        setNameAddressbook(false);
        //send Axios post request
        axios.post(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT, {
            'user_id': [sessionStorage.getItem('id')],
            'name': addressBookName
        }).then(response => {
            updateAddressBooks([]);
            console.log(response.data);

        }).catch(err => {
            console.log(err);
        });
    }

    const clickMenu = (menuItem) => {
        const searchedAddressbook = addressbooks.find(
            (addressbook) => {
                return addressbook.id + '' === menuItem?.key
            })
        if (searchedAddressbook) {
            callback(searchedAddressbook);
        }
    }

    return (
        <Layout style={{ height: '100vh', width: '100%' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Menu
                    onClick={createAddressbook}
                    items={[getItem("Neues Addressbuch", 1, <PlusOutlined />)]}
                    defaultSelectedKeys={['1']}
                />
                <Menu
                    onClick={clickMenu}
                    theme="dark"
                    //defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout>
                <Content>
                    {nameAddressbook && <Modal
                        open
                        title="Neues Addressbuch"
                        onOk={() => sendNewAddressbook()}
                        onCancel={() => setNameAddressbook(false)}
                    >
                        <Input ref={inputName} placeholder="Addressbuch Name" />
                    </Modal>}
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}
