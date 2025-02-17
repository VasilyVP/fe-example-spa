import { useEffect, useState, useMemo } from 'react';
import { Box, Grid, Typography, useTheme } from "@mui/material"
import RainbowButton from "components/Buttons/RainbowButton";
import VioletButton from "components/Buttons/VioletButton";
import Paper from "components/Paper";
import { ClockIcon } from 'assets/icons/icons';
import useBalance from "hooks/useBalance";
import useNotifications, { standardMessages } from 'hooks/useNotifications';
import Cashout from 'views/Cashout';
import { useAppDispatch } from 'store';
import { setView, ViewState } from 'store/slicers/commonSlice';
import CashoutHistory from '../CashoutHistory';
import Navigation from 'components/Navigation';
import NavButton from 'components/Navigation/NavButton';
import useSales, { Period } from 'hooks/useSales';
import useQueue from 'hooks/useQueue';
import { BarChart, Bar, Tooltip } from 'recharts';
import { format } from 'date-fns';
import CustomTooltip from './CustomTooltip';


export default () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [period, setPeriod] = useState(Period.today);
    const { balance, error: balanceError } = useBalance();
    const { sales, error: salesError } = useSales({ period });
    const { rate, queue, error: queueError } = useQueue();

    const formatStr = useMemo(() => {
        if (period === Period.today) return 'h:mm a';
        if (period === Period.allTime) return 'MMM yy';
        return 'd MMM'
    }, [period]);

    const chartData = useMemo(() => (
        sales?.values.map(sale => ({
            name: format(new Date(sale.hourdaymonth), formatStr),
            value: sale.sold,
            //pv: 2400, amt: 2400,
        })) || []
    ), [sales/* , formatStr */]); //eslint-disable-line

    const robuxSold = useMemo(() => (
        sales?.values.reduce((acc, value) => acc + value.sold, 0)
    ), [sales]);

    const valueEarned = useMemo(() => (
        sales?.values.reduce((acc, value) => acc + value.earned, 0)
    ), [sales]);

    const balanceStr = balance !== undefined ? new Intl.NumberFormat(/* navigator.language */'en-US', { maximumFractionDigits: 2 }).format(balance) : '--//--';
    const amountWithMinRate = Math.floor((rate?.amountWithMinRate || 0) / 1000);

    const { errorMsg, infoMsg } = useNotifications();

    useEffect(() => {
        if (!(balanceError || queueError || salesError)) return;
        if (balanceError?.response?.status === 403) {
            errorMsg('Authorization error');
            return;
        }

        errorMsg(standardMessages.error);
    }, [balanceError, salesError, queueError]); // eslint-disable-line

    const handleCashout = () => {
        if (!balance || balance < 25) {
            infoMsg('Minimum amount is $25');
            return;
        }

        dispatch(setView(ViewState.cashout));
    }

    return (
        <>
            <Cashout />
            <CashoutHistory />
            <Paper width='658px'>
                <Box padding='9px 17px'>
                    <Box fontWeight={600} fontSize='20px' lineHeight='24px' color={theme.palette.common.black}>
                        Dashboard
                    </Box>
                    <Box
                        mt='24px'
                        display='flex' justifyContent='space-between'
                    >
                        <Box>
                            <Typography
                                fontWeight={400} fontSize='14px' lineHeight='160%'
                                color={theme.palette.common.gray}
                            >
                                Available to cashout
                            </Typography>
                            <Typography
                                mt='8px'
                                fontWeight={600} fontSize='20px' lineHeight='120%'
                                color={theme.palette.common.black}
                            >
                                {balanceStr} $
                            </Typography>
                            <Box mt='16px'>
                                <VioletButton onClick={() => dispatch(setView(ViewState.cashoutHistory))}>
                                    <ClockIcon color='#6F2CFF' />
                                    <Box ml='9px'>History</Box>
                                </VioletButton>
                            </Box>
                        </Box>
                        <Box>
                            <RainbowButton
                                onClick={handleCashout}
                            >
                                Cashout
                            </RainbowButton>
                        </Box>
                    </Box>
                    <Box mt='24px'>
                        <Navigation>
                            <NavButton
                                buttonText='Today'
                                btnId={Period.today}
                                current={period}
                                onClick={() => setPeriod(Period.today)}
                            />
                            <NavButton
                                buttonText='This Week'
                                btnId={Period.thisWeek}
                                current={period}
                                onClick={() => setPeriod(Period.thisWeek)}
                            />
                            <NavButton
                                buttonText='Last Month'
                                btnId={Period.lastMonth}
                                current={period}
                                onClick={() => setPeriod(Period.lastMonth)}
                            />
                            <NavButton
                                buttonText='All-Time'
                                btnId={Period.allTime}
                                current={period}
                                onClick={() => setPeriod(Period.allTime)}
                            />
                        </Navigation>
                    </Box>
                    <Grid
                        mt='24px'
                        container
                        justifyContent='space-between'
                    >
                        <Grid
                            borderRadius='12px'
                            overflow='hidden'
                        >
                            <Box
                                width='283px' height='227px'
                                bgcolor='#F2F4F5'
                                p='16px'
                            >
                                <Box display='flex' justifyContent='space-between'>
                                    <Typography
                                        fontWeight={400} fontSize='14px' lineHeight='160%'
                                        color={theme.palette.common.gray}
                                    >
                                        Robux Sold
                                    </Typography>
                                    <Typography
                                        fontWeight={600} fontSize='20px' lineHeight='120%'
                                        color={theme.palette.common.black}
                                    >
                                        {robuxSold !== undefined ?
                                            Intl.NumberFormat(navigator.language).format(Math.floor(robuxSold / 1000))
                                            : '--//--'
                                        }k R$
                                    </Typography>
                                </Box>
                                {sales?.values.length ?
                                    (
                                        <Box mt='16px'>
                                            <BarChart width={251} height={142} data={chartData}>
                                                <Bar
                                                    dataKey="value"
                                                    //barSize={Math.floor(251 / (sales.values.length * 2))}
                                                    fill="#8D00D0"
                                                />
                                                <Tooltip
                                                    cursor={false}
                                                    wrapperStyle={{
                                                        outline: 'none',
                                                    }}
                                                    content={<CustomTooltip />}
                                                />
                                            </BarChart>
                                        </Box>
                                    ) : null
                                }
                            </Box>
                            <Box
                                mt='1px'
                                width='283px' height='54px'
                                bgcolor='#F2F4F5'
                                p='16px'
                                display='flex' justifyContent='space-between'
                            >
                                <Typography
                                    fontWeight={400} fontSize='14px' lineHeight='160%'
                                    color={theme.palette.common.gray}
                                >
                                    Value Earned
                                </Typography>
                                <Typography
                                    fontWeight={600} fontSize='16px' lineHeight='120%'
                                    color={theme.palette.common.black}
                                >
                                    {valueEarned !== undefined ? Intl.NumberFormat(navigator.language, { maximumFractionDigits: 2 }).format(valueEarned) : '--//--'} $
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid>
                            <Box
                                width='283px'
                                bgcolor='#F2F4F5'
                                borderRadius='12px'
                                p='16px'
                            >
                                <Typography
                                    fontWeight={400} fontSize='14px' lineHeight='160%'
                                    color={theme.palette.common.gray}
                                >
                                    Your Queue
                                </Typography>
                                <Typography
                                    mt='8px'
                                    fontWeight={600} fontSize='20px' lineHeight='120%'
                                    color={theme.palette.common.black}
                                >
                                    {queue?.usersInGlobalQueue ? `${queue?.queuePlace}/${queue?.usersInGlobalQueue}` : '--//--'}
                                </Typography>
                            </Box>
                            <Box
                                mt='12px'
                                width='283px'
                                display='flex' justifyContent='space-between'
                            >
                                <Box
                                    width='136px'
                                    bgcolor='#F2F4F5'
                                    borderRadius='12px'
                                    p='16px'
                                >
                                    <Typography
                                        fontWeight={400} fontSize='14px' lineHeight='160%'
                                        color={theme.palette.common.gray}
                                    >
                                        Lowest Rate
                                    </Typography>
                                    <Typography
                                        mt='8px'
                                        fontWeight={600} fontSize='20px' lineHeight='120%'
                                        color={theme.palette.common.black}
                                    >
                                        {rate?.minRate || '--//--'} $/k
                                    </Typography>
                                </Box>
                                <Box
                                    width='136px'
                                    bgcolor='#F2F4F5'
                                    borderRadius='12px'
                                    p='16px'
                                >
                                    <Typography
                                        fontWeight={400} fontSize='14px' lineHeight='160%'
                                        color={theme.palette.common.gray}
                                    >
                                        At this rate
                                    </Typography>
                                    <Typography
                                        mt='8px'
                                        fontWeight={600} fontSize='20px' lineHeight='120%'
                                        color={theme.palette.common.black}
                                    >
                                        {amountWithMinRate ? `${amountWithMinRate}k R$` : '< 1k R$'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                mt='12px'
                                width='283px'
                                bgcolor='#F2F4F5'
                                borderRadius='12px'
                                p='16px'
                            >
                                <Typography
                                    fontWeight={400} fontSize='14px' lineHeight='160%'
                                    color={theme.palette.common.gray}
                                >
                                    Total Robux in Queue
                                </Typography>
                                <Typography
                                    mt='8px'
                                    fontWeight={600} fontSize='20px' lineHeight='120%'
                                    color={theme.palette.common.black}
                                >
                                    {Intl.NumberFormat(navigator.language).format(queue?.robuxesInQueue || 0)} R$
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    )
}
