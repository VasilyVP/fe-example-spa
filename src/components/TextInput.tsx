import { InputBase, InputBaseProps, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledInput = styled(InputBase)(({ theme, ...props }) => ({
    height: props.multiline ? undefined : '56px',
    background: '#F2F4F5',
    color: theme.palette.common.black, //'#c7caca',
    borderRadius: '12px',
    padding: '16px',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '120%',
    '& .MuiInputAdornment-root .MuiTypography-root': {
        color: '#95A0A7',
        fontWeight: 600,
        fontSize: '20px',
        lineHeight: '120%',
    }
}));

export default ({ error, errorMessage, ...props }: InputBaseProps & { errorMessage?: string }) => {

    return (
        <Box textAlign='right'>
            <StyledInput {...props} />
            {error &&
                <Typography
                    color='red'
                    fontWeight={300} fontSize='12px'
                >
                    {errorMessage}
                </Typography>
            }
        </Box >
    )
}
