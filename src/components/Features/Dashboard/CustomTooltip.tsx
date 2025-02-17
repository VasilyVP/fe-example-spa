import { Box, Typography, useTheme } from '@mui/material';

export default ({ payload, /* label, */ active }: any) => {
    const theme = useTheme();

    if (!active) return null;

    const value = Intl.NumberFormat(navigator.language).format(Math.floor(payload[0].value / 1000));

    return (
        <Box
            width='95px' height='68px'
            bgcolor='white'
            borderRadius='14px'
            p='8px 16px'
        >
            <Typography
                fontWeight={600} fontSize='14px' lineHeight='160%'
                color={theme.palette.common.black}
            >
                {`${value}k R$`}
            </Typography>
            <Typography
                mt='8px'
                fontWeight={400} fontSize='14px' lineHeight='160%'
                color={theme.palette.common.gray}
            >
                {payload[0].payload.name}
            </Typography>
        </Box>
    )
}
