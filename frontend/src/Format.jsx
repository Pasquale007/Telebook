import { Content } from "antd/es/layout/layout";
import { Input, Layout, Menu, Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContactsOutlined, PlusOutlined } from "@ant-design/icons";
import { ADDRESSBOOK_ENDPOINT } from "./sharedValues";
import { useLocation } from 'react-router-dom';
import { axiosInstance } from "./axios";

export default function Format({ addressbooks, children, callback, updateAddressBooks, openNotification }) {
    const [items, setItems] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState(undefined);
    const [nameAddressbook, setNameAddressbook] = useState(false);
    const inputName = useRef(null);
    const location = useLocation();

    const getItem = useCallback((
        label,
        key,
        icon,
        children,
    ) => {
        return { key, icon, children, label, };
    }, []);

    useEffect(() => {
        const books = addressbooks.map(address => getItem(address.name, address.id, <ContactsOutlined />));
        setItems(books);
    }, [addressbooks, getItem]);

    const setAddressbook = useCallback(() => {
        let element = parseInt(location.hash.split('#')[1]);
        if (!element) {
            return [];
        }
        const searchedAddressbook = addressbooks.find(addressbook => addressbook.id === element);
        const item = items.find(item => item.label === searchedAddressbook?.name);
        callback(searchedAddressbook);
        setSelectedKey(`${item?.key}`)
    }, [addressbooks, callback, items, location.hash]);

    useEffect(() => {
        setAddressbook();
    }, [items, setAddressbook]);


    const createAddressbook = useCallback(() => {
        setNameAddressbook(true);
    }, []);

    const sendNewAddressbook = useCallback(() => {
        let addressBookName = "";
        if (inputName.current) {
            addressBookName = inputName.current['input']['value'];
        }
        setNameAddressbook(false);
        //send Axios post request
        axiosInstance.post(ADDRESSBOOK_ENDPOINT, {
            'user_id': [sessionStorage.getItem('id')],
            'name': addressBookName
        }).then(response => {
            openNotification(response.data.message, "success");
            updateAddressBooks([]);
        }).catch(err => {
            console.log(err)
            openNotification(err.response.statusText, "error");
        });
    }, [openNotification, updateAddressBooks]);

    const clickMenu = useCallback((menuItem) => {
        const searchedAddressbook = addressbooks.find(
            (addressbook) => {
                return addressbook.id + '' === menuItem?.key
            })
        setSelectedKey(menuItem?.key);
        if (searchedAddressbook) {
            callback(searchedAddressbook);
        }
    }, [addressbooks, callback]);

    return (
        <Layout style={{ height: '100%', width: '100%' }}>
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
                    mode="inline"
                    items={items}
                    selectedKeys={[selectedKey]}
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
