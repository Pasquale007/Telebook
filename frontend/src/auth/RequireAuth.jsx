import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
    let prevRoute = JSON.parse(sessionStorage.getItem('prevRoute'));
    if(!prevRoute){
        prevRoute = [window.location.pathname];
    }else{
        prevRoute.push(window.location.pathname);
    }
    sessionStorage.setItem('prevRoute', JSON.stringify(prevRoute));
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
