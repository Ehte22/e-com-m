import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../redux/store'
import { ReactNode } from 'react';

const Protected = ({ roles, compo }: { roles: string[], compo: ReactNode }) => {

    const token = localStorage.getItem("token")
    const { user } = useSelector<RootState, any>(state => state.auth)

    if (!token) {
        return <Navigate to="/sign-in" replace />
    }

    return roles.includes(user.role) ? <>{compo}</> : <Navigate to="/unauthorized" replace />;

}

export default Protected

