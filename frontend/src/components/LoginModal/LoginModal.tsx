import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Form, Input, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const BASE_ENDPOINT = process.env.REACT_APP_BASE_ENDPOINT || "";
const LOGIN_ENDPOINT = process.env.REACT_APP_LOGIN_ENDPOINT || "";
const SIGNUP_ENDPOINT = process.env.REACT_APP_SIGNUP_ENDPOINT || "";
const BASE_URL = process.env.REACT_APP_BASE_URL || "";

export default function Login() {
    const [signUp, setSignUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loginForm] = Form.useForm();


    useEffect(() => {
        if (errorMsg.length > 0) {
            setTimeout(() => setErrorMsg(""), 5000)
        }
    }, [errorMsg]);

    function sendLogIn() {
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
            window.location.href = BASE_URL;
        }).catch(err => {
            setErrorMsg(err.response?.data?.detail || "Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut")
        })
    }

    function sendSignUp() {
        const username = loginForm.getFieldValue('name');
        const email = loginForm.getFieldValue('email');
        const password = loginForm.getFieldValue('password');
        const passwordTest = loginForm.getFieldValue('passwordTest');

        loginForm.resetFields(['password', 'passwordTest']);

        if (!username || !email || !password || !passwordTest) {
            setErrorMsg("Alle Felder müssen gefüllt sein.");
            return;
        }

        if (password !== passwordTest) {
            setErrorMsg("Deine Passwörter unterschieden sich. Bitte überprüfe die Passwörter.");
            return;
        }

        axios.post(BASE_ENDPOINT + SIGNUP_ENDPOINT,
            {
                "name": username,
                "email": email,
                "password": password
            }
        ).then(response => {
            sessionStorage.setItem('email', response.data.email);
            sessionStorage.setItem('id', response.data.id);
            sessionStorage.setItem('name', response.data.name);
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = BASE_URL;
        }).catch(err => {
            setErrorMsg(err.response.data.detail)
        })
    }

    return (
        <>
            {signUp ?
                <Modal
                    open
                    title="Sign Up"
                    centered
                    cancelText={'Log In'}
                    okText={'Sign Up'}
                    onOk={sendSignUp}
                    onCancel={() => setSignUp(!signUp)}
                >
                    {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
                    <hr />
                    <Form form={loginForm}>
                        <Form.Item name="name">
                            <Input
                                placeholder="Benutzername"
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="email">
                            <Input
                                placeholder="Email"
                                prefix={<MailOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="password">
                            <Input
                                placeholder="Passwort"
                                type="password"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="passwordTest">
                            <Input
                                placeholder="Passwort"
                                type="password"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                :
                <Modal
                    open
                    title="Login"
                    centered
                    cancelText={'Sign Up'}
                    okText={'Log In'}
                    onOk={sendLogIn}
                    onCancel={() => setSignUp(!signUp)}
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
                            <Input placeholder="Passwort" type="password" prefix={<LockOutlined />} />
                        </Form.Item>
                    </Form>

                </Modal>
            }
        </>
    )

}