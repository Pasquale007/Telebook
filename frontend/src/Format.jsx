import { Content } from "antd/es/layout/layout";
import { Input, Layout, Menu, Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useRef, useState } from "react";
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

    // Der linter wird hier disables, da das rendern unabhängig von allen anderen Variablen ist. Es soll nur auf die items geachtet werden
    useEffect(() => {
        setAddressbook();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    const setAddressbook = () => {
        let element = parseInt(location.hash.split('#')[1]);
        if (!element) {
            return [];
        }
        const searchedAddressbook = addressbooks.find(addressbook => addressbook.id === element);
        const item = items.find(item => item.label === searchedAddressbook?.name);
        callback(searchedAddressbook);
        setSelectedKey(`${item?.key}`)
    }

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
    }

    const clickMenu = (menuItem) => {
        const searchedAddressbook = addressbooks.find(
            (addressbook) => {
                return addressbook.id + '' === menuItem?.key
            })
        setSelectedKey(menuItem?.key);
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
