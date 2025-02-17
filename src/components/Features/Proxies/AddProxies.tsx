import { useState, ChangeEvent } from 'react';
import { Box, Modal, useTheme } from '@mui/material';
import useNotifications, { standardMessages } from 'hooks/useNotifications';
import { parseProxyStr } from 'utils/transform_validate';
import axios, { AxiosError } from 'axios';
import config from 'config';
import { Proxy } from 'hooks/useProxies';
import { useAppDispatch, useAppSelector } from 'store';
import { setView, ViewState } from 'store/slicers/commonSlice';
import PaperBlockContainer from 'components/Paper/PaperBlockContainer';
import PaperBlock from 'components/Paper/PaperBlock';
import { CloseIcon } from 'assets/icons/icons';
import RainbowButton from 'components/Buttons/RainbowButton';
import TextInput from 'components/TextInput';


type AddProxiesProps = {
    refresh: () => void;
}
export default ({ refresh }: AddProxiesProps) => {
    const [proxiesStr, setProxiesStr] = useState('');
    const [processing, setProcessing] = useState(false);

    const view = useAppSelector(state => state.common.viewState);
    const dispatch = useAppDispatch();

    const theme = useTheme();
    const { errorMsg, successMsg, warningMsg } = useNotifications();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const strArr = e.target.value
            .split('\n')
            .map(el => el.trim())
            .filter(el => el)
            .map(el => /^https?/.test(el) ? el : 'http:' + el);

        setProxiesStr(strArr.join('\n'));
    }

    const handleClose = () => {
        setProxiesStr('');
        dispatch(setView(ViewState.main));
    }

    const handleAdd = async () => {
        const strArr = proxiesStr.split('\n');

        const proxies: Proxy[] = [];
        for (let i = 0; i < strArr.length; i++) {
            const proxyStr = strArr[i];
            const check = /^https?:.+:[0-9]{2,5}:.+:.+$/.test(proxyStr);

            if (!check) {
                errorMsg(`Wrong proxy format at line: ${i + 1}`);
                return;
            }

            try {
                proxies.push(parseProxyStr(proxyStr));
            } catch (err) {
                errorMsg((err as Error).message);
                return;
            }
        }

        try {
            setProcessing(true);
            const { data: { successCount, filteredCount } } = await axios.post<{
                successCount: number; filteredCount: number;
            }>(config.backEnd + '/reseller/proxies', { proxies }, { withCredentials: true });

            if (filteredCount) warningMsg(`${filteredCount} proxies are bad`);
            if (successCount) successMsg(`${successCount}/${proxies.length} proxies added or updated`);
            refresh();
            handleClose();
        } catch (err) {
            console.error("Can't post proxies: ", (err as AxiosError).message);
            errorMsg((err as AxiosError<{ message: string }>).response?.data.message || standardMessages.error);
        } finally {
            setProcessing(false);
        }
    }

    return (
        <Modal
            open={view === ViewState.addProxies}
            onClose={handleClose}
        >
            <Box
                width='100%' height='100%'
                display='flex' justifyContent='center' alignItems='center'
                sx={{ pointerEvents: 'none' }}
            >
                <Box>
                    <PaperBlockContainer sx={{ pointerEvents: 'auto' }} >
                        <PaperBlock
                            //width='340px'
                            width='600px'
                        /* height='473px' */
                        >
                            <Box
                                display='flex' justifyContent='space-between' alignItems='center'
                                fontWeight={600} fontSize='20px' lineHeight='120%'
                                color={theme.palette.common.black}
                            >
                                Add proxies (list)
                                <CloseIcon onClick={handleClose} />
                            </Box>
                            <Box mt='16px'>
                                <TextInput
                                    multiline
                                    fullWidth
                                    maxRows={15}
                                    placeholder='http(s):host:port:username:password'
                                    autoFocus
                                    value={proxiesStr}
                                    onChange={handleChange}
                                /* sx={{
                                    '& .MuiInputBase-inputMultiline': {
                                        //whiteSpace: 'nowrap',
                                    },
                                }} */
                                />
                            </Box>
                            <Box mt='16px'>
                                <RainbowButton
                                    fullWidth
                                    loading={processing}
                                    onClick={handleAdd}
                                >
                                    Add
                                </RainbowButton>

                                {/* <Button
                                variant='outlined'
                                onClick={() => setProxiesStr('')}
                            >
                                Clear
                            </Button> */}
                            </Box>
                        </PaperBlock>
                    </PaperBlockContainer>
                </Box>
            </Box>
        </Modal>
    )
}
