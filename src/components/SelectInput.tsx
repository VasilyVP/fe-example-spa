import { InputBase, /* InputBaseProps, */ Box, Typography, Select, SelectProps, InputProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledInput = styled(InputBase)(({ theme }) => ({
    height: '56px',
    background: '#F2F4F5',
    color: theme.palette.common.black, //'#c7caca',
    borderRadius: '12px',
    padding: '16px',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '120%',
    textAlign: 'left',
    '& .MuiInputAdornment-root .MuiTypography-root': {
        color: '#95A0A7',
        fontWeight: 600,
        fontSize: '20px',
        lineHeight: '120%',
    }
}));

type SelectInputProps = {
    error?: boolean;
    errorMessage?: string;
    inputProps?: InputProps;
    placeholder: string;
    showSelected?: string | number;
    children: SelectProps['children'];
} & SelectProps<number | string>;
export default ({ error, errorMessage, showSelected, children, placeholder, inputProps, ...props }: SelectInputProps) => {
    return (
        <Box textAlign='right'>
            <Select
                {...props}
                displayEmpty
                input={<StyledInput />}
                inputProps={inputProps}
                renderValue={(selected: number | string) => {
                    if (selected !== 0 && !selected) return (
                        <Box
                            fontWeight={600} fontSize='20px' lineHeight='120%'
                            color='#95A0A7'
                            textAlign='left'
                        >
                            {placeholder}
                        </Box>
                    )
                    return showSelected || selected;
                }}
            >
                {children}
            </Select>
            {error &&
                <Typography
                    color='red'
                    fontWeight={300} fontSize='12px'
                >
                    {errorMessage}
                </Typography>
            }
        </Box>
    )
}
