import useAuth from "hooks/useAuth";
import { ReactNode } from "react"


type WithAuthProps = {
    children: ReactNode | ReactNode[];
    splashScreen?: ReactNode;
}
export default ({ children, splashScreen }: WithAuthProps) => {
    const { user, loading } = useAuth();

    return (
        <>
            {user ? children : (!loading && splashScreen) || null}
        </>
    )
}
