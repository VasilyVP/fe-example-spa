import { Box, Grid, Typography } from "@mui/material";
import { OkIcon } from "assets/icons/icons";
import { Proxy } from "hooks/useProxies";
import { StockAccount } from "hooks/useStocks";
import theme from "theme";
import { ellipsed } from "utils/styles";

type ProxyProps = {
    proxy: Proxy;
    account?: StockAccount;
    selected: boolean;
    onClick: (clickedProxy: Proxy) => void;
}
export default ({ proxy, account, selected, onClick }: ProxyProps) => {
    const { schema, host, port, username, password, healthy } = proxy;

    return (
        <Box
            mt='1px'
            position='relative'
            onClick={() => onClick(proxy)}
        >
            {selected &&
                <Box
                    position='absolute' top='9px' left='9px' zIndex={10}
                    display='flex'
                >
                    <OkIcon color='#6F2CFF' />
                </Box>
            }
            <Grid
                mt='1px'
                container
                display='flex' justifyContent='space-between'
                //width='100%' //height='80px'
                bgcolor='#F2F4F5'
                p='16px'
                columnSpacing={1}
                sx={{
                    opacity: selected ? 0.5 : 1,
                    cursor: 'pointer',
                }}
            >
                <Grid
                    item
                    sm={1}
                >
                    <Typography
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={healthy ? theme.palette.common.gray : 'red'}
                    >
                        {schema}
                    </Typography>
                </Grid>
                <Grid
                    item
                    sm={3}
                >
                    <Typography
                        fontWeight={600} fontSize='14px' lineHeight='160%'
                        color={healthy ? theme.palette.common.black : 'red'}
                        sx={{ ...ellipsed() }}
                    >
                        {`${host}:${port}`}
                    </Typography>
                </Grid>
                <Grid
                    item
                    sm={3}
                >
                    <Typography
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={healthy ? theme.palette.common.gray : 'red'}
                        sx={{ ...ellipsed() }}
                    >
                        {username}
                    </Typography>
                </Grid>
                <Grid
                    item
                    sm={2}
                >
                    <Typography
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={healthy ? theme.palette.common.gray : 'red'}
                        sx={{ ...ellipsed() }}
                    >
                        {password}
                    </Typography>
                </Grid>
                <Grid
                    item
                    sm={2}
                >
                    <Typography
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={healthy ? theme.palette.common.gray : 'red'}
                        sx={{ ...ellipsed() }}
                    >
                        {account?.name}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}
