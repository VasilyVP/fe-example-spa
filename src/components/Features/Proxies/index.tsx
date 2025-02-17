import { useMemo, useState, useEffect } from 'react';
import { Box, useTheme } from "@mui/material";
import Paper from "components/Paper";
import TextInput from "components/TextInput";
import Proxy from "./Proxy";
import { noScrollBar } from 'utils/styles';
import RainbowButton from 'components/Buttons/RainbowButton';
import { useDispatch } from 'react-redux';
import { setView, ViewState } from 'store/slicers/commonSlice';
import AddProxies from './AddProxies';
import useProxies, { Proxy as ProxyT } from 'hooks/useProxies';
import VioletButton from 'components/Buttons/VioletButton';
import { useImmer } from 'use-immer';
import { AxiosError } from 'axios';
import useNotifications, { standardMessages } from 'hooks/useNotifications';
import useStocks from 'hooks/useStocks';


export default () => {
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [selected, setSelected] = useImmer<ProxyT[]>([]);

    const theme = useTheme();
    const dispatch = useDispatch();
    const { proxies, refresh, error, deleteProxies } = useProxies();
    const { stocks } = useStocks();

    const selectedIds = selected.map(proxy => proxy.id!);

    const { errorMsg, infoMsg, warningMsg } = useNotifications();

    useEffect(() => {
        if (!error) return;
        errorMsg(standardMessages.error);
    }, [error]); //eslint-disable-line

    const onClick = (clickedProxy: ProxyT) => {
        setSelected(state => {
            if (selectedIds.includes(clickedProxy.id!)) {
                return state.filter(proxy => proxy.id !== clickedProxy.id);
            }
            state.push(clickedProxy);
        })
    }

    const handleSelectAll = () => proxies && setSelected(proxies);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const { count } = (await deleteProxies({
                ids: selected.map(proxy => proxy.id!),
            })).data;

            const rejected = selected.length - count;
            if (rejected) warningMsg(`${rejected} proxies can't be deleted`);

            infoMsg(`${count} proxies were deleted`);
            setSelected([]);
            refresh();
        } catch (err) {
            const error = err as AxiosError;
            console.error("Can't delete accounts: ", error.message);
            errorMsg(standardMessages.error);
        } finally {
            setDeleting(false);
        }
    }

    const proxyList = useMemo(() => (
        proxies
            ?.filter(proxy => proxy?.host?.includes(search) || proxy?.port.toString().includes(search))
            .map(proxy => (
                <Proxy
                    key={proxy.id}
                    proxy={proxy}
                    account={stocks?.find(account => account.proxy?.id === proxy.id)}
                    selected={selectedIds.includes(proxy.id!)}
                    onClick={onClick}
                />
            ))), [proxies, search, selected, stocks]); //eslint-disable-line

    return (
        <>
            <AddProxies
                refresh={refresh}
            />
            <Paper width='658px'>
                <Box padding='9px 17px'>
                    <Box display='flex' justifyContent='space-between'>
                        <Box fontWeight={600} fontSize='20px' lineHeight='24px' color={theme.palette.common.black}>
                            Your Proxies
                        </Box>
                        <RainbowButton onClick={() => dispatch(setView(ViewState.addProxies))}>
                            Add Proxies
                        </RainbowButton>
                    </Box>
                    {proxies?.length ?
                        (
                            <>
                                <Box mt='24px'>
                                    <TextInput
                                        fullWidth
                                        placeholder="Search for proxy..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value.trim())}
                                    />
                                </Box>
                                <Box mt='24px'>
                                    <VioletButton
                                        color='#8D00D0'
                                        bgcolor="rgba(141, 0, 208, 0.1)"
                                        onClick={handleSelectAll}
                                    >
                                        Select All
                                    </VioletButton>
                                </Box>
                                <Box
                                    mt='12px'
                                    borderRadius='12px'
                                    overflow='auto'
                                    maxHeight='223px'
                                    sx={{
                                        ...noScrollBar(),
                                    }}
                                >
                                    {proxyList}
                                </Box>
                                <Box
                                    mt='24px'
                                    fontWeight={600} fontSize={16} lineHeight='160%'
                                    color={theme.palette.common.black}
                                >
                                    {selected.length} Proxies Selected
                                </Box>
                                <Box mt='24px'>
                                    {/* <VioletButton
                                        //disabled={selected.length !== 1}
                                        //onClick={() => dispatch(setView(ViewState.editRate))}
                                    >
                                        Change Rate
                                    </VioletButton> */}
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
            </Paper>
        </>
    )
}
