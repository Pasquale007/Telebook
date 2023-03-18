import { Content } from "antd/es/layout/layout";
import { Button, Layout, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { ReactElement, useEffect, useState } from "react";
import { ContactsOutlined, PlusOutlined } from "@ant-design/icons";
import { Addressbook } from "./sharedTypes";

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


    function clickMenu(menuItem: MenuItem) {
        const searchedAddressbook: Addressbook | undefined = addressbooks.find(
            (addressbook) => {
                return addressbook.id + '' === menuItem?.key
            })
            if(searchedAddressbook){
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
                <Button
                    type="default"
                    style={{ margin: "5px", marginTop: "10px" }}
                > <PlusOutlined /> Neues Addressbuch</Button>
                <Menu
                    onClick={clickMenu}
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout>
                <Content>{children}</Content>
            </Layout>
        </Layout>
    )
}
