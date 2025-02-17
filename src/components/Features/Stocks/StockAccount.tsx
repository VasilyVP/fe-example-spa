import { Avatar, Box, Grid, Typography } from "@mui/material";
import { OkIcon } from "assets/icons/icons";
import IOSSwitch from "components/IOSSwitch";
import { StockAccount } from "hooks/useStocks";
import theme from "theme";
import { ellipsed } from "utils/styles";

type StockAccountsProps = {
    stockAccount: StockAccount;
    selected: boolean;
    onClick: (account: StockAccount) => void;
    onSwitchActive: (account: StockAccount) => void;
}
export default ({ stockAccount, selected, onClick, onSwitchActive }: StockAccountsProps) => {
    const dateStr = new Intl.DateTimeFormat(navigator.language).format(new Date(stockAccount.createdAt));
    const leftStr = stockAccount.balance.left !== undefined
        ? new Intl.NumberFormat(navigator.language).format(stockAccount.balance.left)
        : '--//--';;
    const spentStr = stockAccount.balance.spent !== undefined
        ? new Intl.NumberFormat(navigator.language).format(stockAccount.balance.spent)
        : '--//--';

    const elementOpacity = stockAccount.securityCookie && !stockAccount.banned ? (selected ? 0.5 : 1) : 0.5;

    return (
        <Box
            mt='1px'
            position='relative'
            onClick={() => onClick(stockAccount)}
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
                container
                display='flex' justifyContent='space-between'
                //width='100%' //height='80px'
                bgcolor='#F2F4F5'
                sx={{
                    opacity: elementOpacity,
                    cursor: 'pointer',
                }}
                p='16px'
                position='relative'
            >
                {stockAccount.banned &&
                    <Box
                        width='100%'
                        position='absolute'
                        zIndex={100}
                        fontWeight={600} fontSize='30px' lineHeight='160%'
                        color='red'
                        textAlign='center'
                        sx={{
                            rotate: '-25deg',
                        }}
                    >
                        Banned
                    </Box>
                }
                <Grid
                    item
                    display='flex'
                    width={185}
                >
                    <Avatar
                        src={stockAccount.avatarUrl}
                        sizes='42px'
                    >
                        {stockAccount.name}
                    </Avatar>
                    <Box ml='16px'>
                        <Typography
                            fontWeight={400} fontSize='14px' lineHeight='160%'
                            color={theme.palette.common.gray}
                            maxWidth={120}
                            sx={{ ...ellipsed() }}
                        >
                            {stockAccount.name}
                        </Typography>
                        <Typography
                            fontWeight={600} fontSize='14px' lineHeight='160%'
                            width={120}
                            color={theme.palette.common.black}
                            sx={{ ...ellipsed() }}
                        >
                            {stockAccount.proxy ? `Proxy ${stockAccount.proxy?.host}:${stockAccount.proxy?.port}` : 'No proxy'}
                        </Typography>
                    </Box>
                </Grid>
                <Grid
                    item
                    width={120}
                >
                    <Typography
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.gray}
                    >
                        {`${stockAccount.rate} $/k`}
                    </Typography>
                    <Typography
                        fontWeight={600} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.black}
                    >
                        {`${leftStr} R$ left`}
                    </Typography>
                </Grid>
                <Grid
                    item
                    width={120}
                >
                    <Typography
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.gray}
                    >
                        {dateStr}
                    </Typography>
                    <Typography
                        fontWeight={600} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.black}
                    >
                        {`${spentStr} R$ spent`}
                    </Typography>
                </Grid>
                <Grid
                    item
                    width={50}
                    textAlign='right'
                    display='flex' alignItems='center'
                >
                    <IOSSwitch
                        onClick={(e) => {
                            e.stopPropagation();
                            onSwitchActive(stockAccount)
                        }}
                        checked={stockAccount.status === 'active'}
                        thumbcolor={!stockAccount.health ? (stockAccount.twoFactorAuthIssue ? 'orange' : 'red') : 'inherit'}
                        disabled={!stockAccount.health || !stockAccount.securityCookie}
                    />
                </Grid>
            </Grid>
        </Box >
    )
}
