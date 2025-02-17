import { useState, useEffect } from 'react';
import { Updater } from 'use-immer';
import { Box, Modal } from "@mui/material"
import { useAppDispatch, useAppSelector } from "store"
import { setView, ViewState } from "store/slicers/commonSlice"
import LoginAndRate from "./LoginAndRate"
import axios, { AxiosError } from 'axios';
import config from 'config';
import useNotifications, { standardMessages } from 'hooks/useNotifications';
import { StockAccount } from 'hooks/useStocks';
import { ErrorData } from 'utils/http';
import useQueue from 'hooks/useQueue';
import useProxies from 'hooks/useProxies';


export type ProxyInput = {
    host: string;
    port: string;
    username: string;
    password: string;
}

type AddAccountsProps = {
    selectedAccounts: StockAccount[];
    setSelectedAccounts: Updater<StockAccount[]>;
    refresh: () => void;
}
export default ({ selectedAccounts, setSelectedAccounts, refresh }: AddAccountsProps) => {
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [rate, setRate] = useState('');
    const [cookie, setCookie] = useState('');
    const [proxyId, setProxyId] = useState<number | null>(null);
    const view = useAppSelector(state => state.common.viewState);
    const dispatch = useAppDispatch();

    const { errorMsg, successMsg } = useNotifications();

    const { refresh: queueRefresh } = useQueue();
    const { refresh: proxiesRefresh } = useProxies();

    useEffect(() => {
        if (view !== ViewState.editAccount) return;

        setRate(String(selectedAccounts[0].rate));
        setCookie(selectedAccounts[0].securityCookie);
        setProxyId(selectedAccounts[0].proxy.id || null);
    }, [view]); //eslint-disable-line

    const handleClose = () => {
        setRate('');
        setCookie('');
        setProxyId(null);
        dispatch(setView(ViewState.main));
    }

    const handleAddAccount = async ({ supplierId }: { supplierId?: string }) => {
        setAdding(true);
        try {
            await axios.post(config.backEnd + '/reseller/add-account',
                {
                    rate: Number(rate),
                    securityCookie: cookie,
                    proxyId,
                    supplierId,
                },
                {
                    withCredentials: true,
                },
            );
            successMsg('Account was added');
            refresh();
            queueRefresh();
            proxiesRefresh();
        } catch (err) {
            const error = err as AxiosError<{ message: string | string[] }>;
            console.error("Can't add account: ", (error).message);
            if (error.response && [400, 401, 403].includes(error.response.status)) {
                if (Array.isArray(error.response.data.message)) errorMsg('Wrong proxy data');
                else errorMsg(error.response.data.message);
                return;
            }
            errorMsg(standardMessages.error);
        } finally {
            setAdding(false);
            handleClose();
        }
    }

    const handleAddAccounts = async ({ accountsStr, supplierId }: { accountsStr: string; supplierId?: string; }) => {
        setAdding(true);

        const accountsCredentials = accountsStr.split('\n');
        try {
            const result = await axios.post<{ added: number; }>(config.backEnd + '/reseller/add-accounts',
                { accountsCredentials, supplierId },
                { withCredentials: true },
            );

            successMsg(`Accounts added ${result.data.added}/${accountsCredentials.length} `,);
            refresh();
            /* queueRefresh();
            proxiesRefresh(); */
        } catch (err) {
            const error = err as AxiosError<{ message: string | string[] }>;
            console.error("Can't add accounts: ", error.message);
            if (error.response && [400].includes(error.response.status)) {
                if (Array.isArray(error.response.data.message)) errorMsg('Wrong credentials format');
                else errorMsg(error.response.data.message);
                return;
            }
            errorMsg(standardMessages.error);
        } finally {
            setAdding(false);
            handleClose();
        }
    }

    const handleEditRate = async () => {
        try {
            setUpdating(true);
            await axios.put(config.backEnd + '/reseller/set-rate',
                {
                    robloxId: selectedAccounts[0].robloxId,
                    rate: Number(rate),
                },
                {
                    withCredentials: true,
                }
            );
            refresh();
            queueRefresh();
            setSelectedAccounts([]);
        } catch (err) {
            const error = err as AxiosError;
            console.error("Can't update rate: ", error.message);

            if (error.response?.status === 400) {
                errorMsg((error.response.data as ErrorData).error);
            } else errorMsg(standardMessages.error);
        } finally {
            setUpdating(false);
            handleClose();
        }
    }

    return (
        <Modal
            open={view === ViewState.addAccount || view === ViewState.editAccount /* || view === ViewState.addProxy */}
            onClose={handleClose}
        >
            <Box
                width='100%' height='100%'
                display='flex' justifyContent='center' alignItems='center'
                sx={{ pointerEvents: 'none' }}
            >
                <Box>
                    {(view === ViewState.addAccount || view === ViewState.editAccount) &&
                        <LoginAndRate
                            rate={rate}
                            setRate={setRate}
                            cookie={cookie}
                            setCookie={setCookie}
                            proxyId={proxyId}
                            setProxyId={setProxyId}
                            handleAddAccount={handleAddAccount}
                            handleAddAccounts={handleAddAccounts}
                            handleEditRate={handleEditRate}
                            handleClose={handleClose}
                            adding={adding}
                            updating={updating}
                        />}
                </Box>
            </Box>
        </Modal>
    )
}
