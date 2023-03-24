import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
    return (
        <>
            {sessionStorage.getItem('id')
                ? <Outlet />
                : <Navigate to="/login" />
            }
        </>

    );
}
export default RequireAuth;
