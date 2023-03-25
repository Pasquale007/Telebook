import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Form, Input, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_ENDPOINT, BASE_URL, SIGNUP_ENDPOINT } from "../../sharedTypes";
import { Navigate, useNavigate } from "react-router-dom";

export default function Register() {
    const [errorMsg, setErrorMsg] = useState("");
    const [loginForm] = Form.useForm()
    let navigate = useNavigate();

    useEffect(() => {
        if (errorMsg.length > 0) {
            setTimeout(() => setErrorMsg(""), 5000);
        }
    }, [errorMsg]);

    const sendSignUp = () => {
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
            console.log(err)
            if(err.response.data.errors){
                const errString = err.response.data.errors.map(err => { return err.msg})
                setErrorMsg(errString)

            } else{
                setErrorMsg(err.response.data.message || "Ein unbekannter Fehler ist aufgetreten.")
            }
        })
    }

    return (
        <Modal
            open
            title={<h3>Register</h3>}
            centered
            cancelText={'Login'}
            okText={'Register'}
            onOk={sendSignUp}
            onCancel={() => { navigate("/login") }}
        >
            {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
            <hr />
            <Form
                form={loginForm}
            >
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
                        prefix={<LockOutlined />
                        }
                        onPressEnter={(e) => {
                            <Navigate to="/login" replace />
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}