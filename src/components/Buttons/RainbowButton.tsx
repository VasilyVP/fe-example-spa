import { ButtonBase, ButtonBaseProps, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const Btn = styled(ButtonBase)<{ fullWidth?: boolean }>(({ theme, disabled, fullWidth }) => ({
    background: 'linear-gradient(89.08deg, #4095D2 0.84%, #AA39D2 37.68%, #C0537D 61.71%, #D38C39 97.89%)',
    borderRadius: '32px',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '160%',
    fontFamily: 'Inter',
    whiteSpace: 'nowrap',
    color: theme.palette.primary.contrastText,
    padding: '13px 24px',
    width: fullWidth ? '100%' : 'fit-content',
    opacity: disabled ? 0.5 : 1,
    '&:hover': {
        //border: '1px solid pink',
    },
}))

export default ({ loading = false, children, ...props }: ButtonBaseProps & { loading?: boolean, fullWidth?: boolean }) => {
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
