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
            setErrorMsg(err.response?.data?.detail || "Ein Fehler ist aufgetreten")
        })
    }

    function sendSignUp() {
        const username = loginForm.getFieldValue('name');
        const email = loginForm.getFieldValue('email');
        const password = loginForm.getFieldValue('password');
        const passwordTest = loginForm.getFieldValue('passwordTest');

        loginForm.resetFields(['password', 'passwordTest']);

        if (!username || !email || !password || !passwordTest) {
            setErrorMsg("Alle Felder müssen gefüllt sein");
            return;
        }

        if (password !== passwordTest) {
            setErrorMsg("Deine Passwörter unterschieden sich. Bitte überprüfe die Passwörter");
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
                    forceRender
                    open
                    title="Sign Up"
                    centered
                    cancelText={'Log In'}
                    okText={'Sign Up'}
                    onOk={sendSignUp}
                    onCancel={() => setSignUp(!signUp)}
                >
                    {errorMsg && <Alert message={errorMsg} type="warning" showIcon />}
                    <hr />
                    <Form form={loginForm} >
                        <Form.Item name="name" label="Username:" required>
                            <Input placeholder="Benutzername" />
                        </Form.Item>
                        <Form.Item name="email" label="Email:" required>
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="password" label="Passwort:" required>
                            <Input placeholder="Passwort" type="password" />
                        </Form.Item>
                        <Form.Item name="passwordTest" label="Passwort:" required>
                            <Input placeholder="Passwort" type="password" />
                        </Form.Item>
                    </Form>

                </Modal>
                :
                <Modal
                    forceRender
                    getContainer={false}
                    open
                    title="Login"
                    centered
                    cancelText={'Sign Up'}
                    okText={'Log In'}
                    onOk={sendLogIn}
                    onCancel={() => setSignUp(!signUp)}
                >
                    {errorMsg && <Alert message={errorMsg} type="warning" showIcon />}
                    <hr />
                    <Form form={loginForm} >
                        <Form.Item name="name" label="Email oder Benutzername:" required>
                            <Input placeholder="Name/ Email" />
                        </Form.Item>
                        <Form.Item name="password" label="Passwort:" required>
                            <Input placeholder="Passwort" type="password" />
                        </Form.Item>
                    </Form>

                </Modal>
            }
        </>
    )

}