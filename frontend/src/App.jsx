import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import Main from "./Main";
import Login from "./page/Login/Login";
import Register from "./page/Register/Register";
import { SharedPage } from "./page/SharePage/SharePage";
import EditContact from "./page/EditContact/EditContact";
import EditPhonenumber from "./page/EditPhonenumber/EditPhonenumber";

export default function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<Main />} />
                    <Route path="/share/:addressbookID" element={<SharedPage />} />
                    <Route path="/contactbook/:contacbookID/contact/:userID/:mode" element={<EditContact />} />
                    <Route path="/contactbook/:contacbookID/contact/:userID/:mode/phonenumbers" element={<EditPhonenumber />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}