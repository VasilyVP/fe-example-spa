import { useEffect, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { Box, Grid, Typography, useTheme } from "@mui/material";
import RainbowButton from "components/Buttons/RainbowButton";
import VioletButton from "components/Buttons/VioletButton";
import Paper from "components/Paper";
import TextInput from "components/TextInput";
import useStocks, { StockAccount } from "hooks/useStocks";
import { useAppDispatch } from "store";
import { setView, ViewState } from "store/slicers/commonSlice";
import { noScrollBar } from "utils/styles";
import StockAccountElement from "./StockAccount";
import useNotifications, { standardMessages } from 'hooks/useNotifications';
import AddOrEditAccount from "views/AddOrEditAccount"
import axios, { AxiosError } from 'axios';
import config from 'config';
import { ErrorData } from 'utils/http';
import useQueue from 'hooks/useQueue';
import useProxies from 'hooks/useProxies';


export default () => {
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useImmer<StockAccount[]>([]);

    const theme = useTheme();
    const dispatch = useAppDispatch();

    const { stocks, error, /* loading, */ switchActivity, refresh } = useStocks();
    const { refresh: queueRefresh } = useQueue();
    const { refresh: proxiesRefresh } = useProxies();

    const { errorMsg } = useNotifications();

    useEffect(() => {
        const requireRefresh = stocks?.find(acc => !acc.securityCookie);
        if (requireRefresh) setTimeout(() => refresh(), 60 * 1000);
    }, [stocks]); // eslint-disable-line

    useEffect(() => {
        if (!error) return;
        errorMsg(standardMessages.error);
    }, [error]); //eslint-disable-line

    const selectedIds = selected.map(acc => acc.name);

    const onClick = (clickedAccount: StockAccount) => {
        setSelected(state => {
            if (selectedIds.includes(clickedAccount.name)) {
                return state.filter(account => account.robloxId !== clickedAccount.robloxId);
            }
            state.push(clickedAccount);
        })
    }

    const onSwitchActive = async (switchedAccount: StockAccount) => {
        const newStatus = switchedAccount.status === 'active' ? 'paused' : 'active';
        try {
            await switchActivity(switchedAccount, newStatus);
            queueRefresh();
        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status === 400) {
                errorMsg((error.response.data as ErrorData).error);
            } else errorMsg(standardMessages.error);
        }
    }

    const handleSelectAll = () => stocks && setSelected(stocks);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await axios.put(config.backEnd + '/reseller/delete-accounts',
                {
                    //robloxIds: selectedIds,
                    names: selectedIds,
                },
                {
                    withCredentials: true,
                },
            )
            setSelected([]);
            refresh();
            queueRefresh();
            proxiesRefresh();
        } catch (err) {
            const error = err as AxiosError;
            console.error("Can't delete accounts: ", error.message);
            errorMsg(standardMessages.error);
        } finally {
            setDeleting(false);
        }
    }

    const accountsList = useMemo(() => (
        stocks
            ?.filter(account => account.name.includes(search))
            .map(stockAccount => (
                <StockAccountElement
                    key={stockAccount.name}
                    stockAccount={stockAccount}
                    selected={selectedIds.includes(stockAccount.name)}
                    onClick={onClick}
                    onSwitchActive={onSwitchActive}
                />
            ))), [stocks, selected, search]); //eslint-disable-line

    const totalLeft = useMemo(() => stocks?.reduce((acc, account) => account.balance.left + acc, 0), [stocks]);
    const totalLeftStr = totalLeft !== undefined && Number.isInteger(totalLeft) ? Intl.NumberFormat(navigator.language).format(totalLeft) : '--//--';
    const totalSpent = useMemo(() => stocks?.reduce((acc, account) => account.balance.spent + acc, 0), [stocks]);
    const totalSpentStr = totalSpent !== undefined && Number.isInteger(totalSpent) ? Intl.NumberFormat(navigator.language).format(totalSpent) : '--//--';
    const activeCount = useMemo(() => stocks?.reduce((acc, account) => acc + (account.status === 'active' ? 1 : 0), 0), [stocks]);

    return (
        <>
            <AddOrEditAccount
                selectedAccounts={selected}
                setSelectedAccounts={setSelected}
                refresh={refresh}
            />

            <Paper width='658px'>
                <Box padding='9px 17px'>
                    <Box display='flex' justifyContent='space-between'                >
                        <Box fontWeight={600} fontSize='20px' lineHeight='24px' color={theme.palette.common.black}>
                            Your Stock
                        </Box>
                        <RainbowButton onClick={() => dispatch(setView(ViewState.addAccount))}>
                            Add Account
                        </RainbowButton>
                    </Box>
                    {stocks?.length
                        ? (
                            <>
                                <Box mt='24px'>
                                    <TextInput
                                        fullWidth
                                        placeholder="Search for the account..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value.trim())}
                                    />
                                </Box>
                                <Grid
                                    mt='24px'
                                    container
                                    display='flex' justifyContent='space-between' alignItems='center'
                                >
                                    <Grid
                                        item
                                        width={200}
                                    >
                                        <VioletButton
                                            color='#8D00D0'
                                            bgcolor="rgba(141, 0, 208, 0.1)"
                                            onClick={handleSelectAll}
                                        >
                                            Select All
                                        </VioletButton>
                                    </Grid>
                                    <Grid
                                        item
                                        width={120}
                                    >
                                        <Typography
                                            fontWeight={600} fontSize={14} lineHeight='160%'
                                            color={theme.palette.common.gray}
                                        >
                                            {totalLeftStr} R$ Left
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        width={120}
                                    >
                                        <Typography
                                            fontWeight={600} fontSize={14} lineHeight='160%'
                                            color={theme.palette.common.gray}
                                        >
                                            {totalSpentStr} R$ Spent
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        width={67}
                                        textAlign='right'
                                    >
                                        <Typography
                                            fontWeight={600} fontSize={14} lineHeight='160%'
                                            color={theme.palette.common.gray}
                                        >
                                            {activeCount} Active
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Box
                                    mt='12px'
                                    borderRadius='12px'
                                    overflow='auto'
                                    maxHeight='312px'
                                    sx={{
                                        ...noScrollBar(),
                                    }}
                                >
                                    {accountsList}
                                </Box>
                                <Box
                                    mt='24px'
                                    fontWeight={600} fontSize={16} lineHeight='160%'
                                    color={theme.palette.common.black}
                                >
                                    {selected.length} Accounts Selected
                                </Box>
                                <Box mt='24px'>
                                    <VioletButton
                                        disabled={selected.length !== 1}
                                        onClick={() => dispatch(setView(ViewState.editAccount))}
                                    >
                                        Change Rate
                                    </VioletButton>
                                    <VioletButton
                                        color='#8D00D0'
                                        bgcolor="rgba(141, 0, 208, 0.1)"
                                        disabled={!Boolean(selected.length) || deleting}
                                        loading={deleting}
                                        onClick={handleDelete}
                                        sx={{ ml: '8px' }}
                                    >
                                        Delete
                                    </VioletButton>
                                </Box>
                            </>
                        ) : null
                    }
                </Box>
            </Paper >
        </>
    )
}
