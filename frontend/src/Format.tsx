import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { ReactElement } from "react";
import MySider from "./components/MySider/MySider";

type FormProps = {
    children: ReactElement
}

export default function Format(props: FormProps): ReactElement {
    const { children } = props;

    return (
        <Layout style={{ height: '100vh', width: '100%' }}>
            <Sider><MySider /></Sider>
            <Layout>
                <Content>{children}</Content>
            </Layout>
        </Layout>
    )
}
