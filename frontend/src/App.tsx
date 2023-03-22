import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Main";
import { SharedPage } from "./page/SharePage/SharePage";


export default function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/share:addressbookID" element={<SharedPage />} />
            </Routes>
        </BrowserRouter>
    )
}