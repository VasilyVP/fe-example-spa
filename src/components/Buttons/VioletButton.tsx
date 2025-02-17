import { ButtonBase, ButtonBaseProps, ButtonBaseTypeMap, CircularProgress, ExtendButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";

const Btn = styled<ExtendButtonBase<ButtonBaseTypeMap<{ bgcolor?: string }>>>
    (ButtonBase)(({ theme, color = '#6F2CFF', bgcolor = 'rgba(111, 44, 255, 0.1)', disabled }) => ({
        borderRadius: '12px',
        padding: '8px 12px',
        height: '35px',
        background: bgcolor,
        color,
        opacity: disabled ? 0.5 : 1,
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '120%',
        fontFamily: 'Inter',
        whiteSpace: 'nowrap',
        zIndex: 1,
        '&:hover': {
            background: 'rgba(111, 44, 255, 0.2)',
        },
    }))

type VioletProps = {
    loading?: boolean;
    bgcolor?: string;
    fullWidth?: boolean;
    disabled?: boolean;
}
export default ({ loading = false, bgcolor, children, ...props }: ButtonBaseProps & VioletProps) => {
    return (
        <Btn {...props}>
            {loading ?
                <CircularProgress
                    size='21px'
                    sx={{ color: 'white' }}
                />
                : children
            }
        </Btn>
    )
}
