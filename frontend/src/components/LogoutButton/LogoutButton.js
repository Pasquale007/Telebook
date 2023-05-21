import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { axiosInstance } from "../../axios";
import { BASE_URL, LOGOUT_ENDPOINT } from "../../sharedValues";


export default function LogoutButton({ setAllContacts }) {


    const logout = () => {
        sessionStorage.clear();
        axiosInstance.post(LOGOUT_ENDPOINT
        ).then(response => {
            let sortedData = response.data.sort((a, b) => {
                return (a.first_name.localeCompare(b.first_name) !== 0) ? a.first_name.localeCompare(b.first_name) : a.last_name?.localeCompare(b.last_name || "");
            });
            setAllContacts(sortedData);
        }).catch(err => {
            console.log(err);
        })
        window.location.href = BASE_URL;
    }

    return (
        <Button
            icon={<LogoutOutlined />}
            onClick={logout}
        ></Button>
    )
}