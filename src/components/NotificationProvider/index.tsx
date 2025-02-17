import { ReactNode } from "react"
import { SnackbarProvider } from "notistack";
import './styles.css';


type InitProps = {
    children: ReactNode | ReactNode[];
}
export default (props: InitProps) => {

    return (
        <SnackbarProvider
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            maxSnack={3}
            preventDuplicate
            autoHideDuration={3000}
        >
            {props.children}
        </SnackbarProvider>
    )
}
