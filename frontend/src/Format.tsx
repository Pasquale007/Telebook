import { Content } from "antd/es/layout/layout";
import { Input, Layout, Menu, MenuProps, Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import { ReactElement, useEffect, useRef, useState } from "react";
import { ContactsOutlined, PlusOutlined } from "@ant-design/icons";
import { Addressbook, ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT } from "./sharedTypes";
import MenuItem from "antd/es/menu/MenuItem";
import axios from "axios";

type FormProps = {
    children: ReactElement
    addressbooks: Addressbook[]
    callback: any
};

export type MenuItem = Required<MenuProps>['items'][number];

export default function Format(props: FormProps): ReactElement {
    const { addressbooks, children, callback } = props;
    const [items, setItems] = useState<any[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const [nameAddressbook, setNameAddressbook] = useState(false);
    const inputName = useRef(null);

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[],
    ): MenuItem {
        return { key, icon, children, label, } as MenuItem;
    }

    useEffect(() => {
        const books: MenuItem[] = addressbooks.map(address => getItem(address.name, address.id, <ContactsOutlined />));
        setItems(books);
    }, [addressbooks]);

    function createAddressbook() {
        setNameAddressbook(true);
    }
    function sendNewAddressbook() {
        let addressBookName: string = "";
        if (inputName.current) {
            addressBookName = inputName.current['input']['value'];
        }
        setNameAddressbook(false);
        //send Axios post request
        axios.post(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT, {
            'user_id': sessionStorage.getItem('id'),
            'name': addressBookName
        }).then(response => {
            console.log(response.data);

        }).catch(err => {
            console.log(err)
        });
    }

    function clickMenu(menuItem: MenuItem) {
        const searchedAddressbook: Addressbook | undefined = addressbooks.find(
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
                    <Modal
                        open={nameAddressbook}
                        title="Neues Addressbuch"
                        onOk={() => sendNewAddressbook()}
                        onCancel={() => setNameAddressbook(false)}
                    >
                        <Input ref={inputName} placeholder="Addressbuch Name" />
                    </Modal>
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}
