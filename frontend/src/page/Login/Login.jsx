import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Alert, Form, Input, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_ENDPOINT, LOGIN_ENDPOINT } from "../../sharedValues";

export default function Login() {
    const [errorMsg, setErrorMsg] = useState("");
    const [loginForm] = Form.useForm();
    let navigate = useNavigate();

    useEffect(() => {
        if (errorMsg.length > 0) {
            setTimeout(() => setErrorMsg(""), 5000);
        }
    }, [errorMsg]);

    const sendLogIn = () => {
        const name = loginForm.getFieldValue('name');
        const password = loginForm.getFieldValue('password');
        loginForm.resetFields(['password']);

        if (!password || !name) {
            setErrorMsg("Alle Felder müssen gefüllt sein")
            return;
        }
        axios.post(BASE_ENDPOINT + LOGIN_ENDPOINT,
            {
                "username_or_email": name,
                "password": password
            }
        ).then(response => {
            sessionStorage.setItem('email', response.data.email);
            sessionStorage.setItem('id', response.data.id);
            sessionStorage.setItem('name', response.data.name);
            sessionStorage.setItem('loggedIn', 'true');
            //blöd für share page.. idee?
            navigate("/");
        }).catch(err => {
            setErrorMsg(err.response?.data?.detail || "Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut")
        })
    }

    return (
        <Modal
            open
            title={<h3>Login</h3>}
            centered
            cancelText={'Sign Up'}
            okText={'Log In'}
            onOk={sendLogIn}
            onCancel={() => { navigate("/register") }}
            maskClosable={false}
        >
            {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
            <hr />
            <Form form={loginForm} >
                <Form.Item name="name">
                    <Input
                        placeholder="Name/ Email"
                        prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item name="password" required>
                    <Input
                        placeholder="Passwort"
                        type="password"
                        prefix={<LockOutlined />}
                        onPressEnter={(e) => {
                            sendLogIn();
                        }} />
                </Form.Item>
            </Form>

        </Modal>
    );
}