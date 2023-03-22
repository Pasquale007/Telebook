import { App } from "antd";
import { Route } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';
import { SharedPage } from "./page/SharePage/SharePage";


export default function Router() {
    return (
        <BrowserRouter>
            <Route path="/" element={<App />} />
            <Route path="/share" element={<SharedPage />} />
        </BrowserRouter>

    )
}