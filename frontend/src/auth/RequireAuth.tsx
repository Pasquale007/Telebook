import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = (): any => {
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
