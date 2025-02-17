import { useState } from 'react'
import { Box, Modal, useTheme } from "@mui/material"
import { CloseIcon } from "assets/icons/icons"
import CashoutMethodCard, { CashoutMethod } from "components/CashoutMethodCard"
import PaperBlock from "components/Paper/PaperBlock"
import PaperBlockContainer from "components/Paper/PaperBlockContainer"
import TextInput from 'components/TextInput'
import useBalance from 'hooks/useBalance'
import VioletButton from 'components/Buttons/VioletButton'
import RainbowButton from 'components/Buttons/RainbowButton'
import { useAppDispatch, useAppSelector } from 'store'
import { setView, ViewState } from 'store/slicers/commonSlice'
import useNotifications, { standardMessages } from 'hooks/useNotifications'
import axios, { AxiosError } from 'axios'
import config from 'config'
import { ErrorData } from 'utils/http'
import { isCorrectWallet } from 'utils/transform_validate'

const methodMsg = {
    [CashoutMethod.bitcoin]: 'Bitcoin',
    [CashoutMethod.ethereum]: 'Ethereum',
    [CashoutMethod.usdtErc]: 'USDT',
}

export default () => {
    const [method, setMethod] = useState<CashoutMethod | null>(null);
    const [wallet, setWallet] = useState('');
    const [value, setValue] = useState(0);
    const [processing, setProcessing] = useState(false);

    const view = useAppSelector(state => state.common.viewState);
    const dispatch = useAppDispatch();

    const theme = useTheme();
    const { errorMsg, successMsg, infoMsg } = useNotifications();

    const { balance, refresh } = useBalance();
    const balanceStr = balance ? Intl.NumberFormat(navigator.language).format(balance) : '--//--';

    const handleClose = () => {
        setMethod(null);
        setWallet('');
        setValue(0);
        dispatch(setView(ViewState.main));
    }

    const handleSelectMethod = (method: CashoutMethod) => setMethod(method);

    const handleCashout = async () => {
        if (!method) return;
        if (value < 25) {
            infoMsg('Minimum amount is $25');
            return;
        }
        if (!isCorrectWallet(wallet, method)) {
            errorMsg(`Provided wallet is not valid ${methodMsg[method]} address`);
            return;
        }

        setProcessing(true);
        try {
            await axios.post(config.backEnd + '/reseller/cashout',
                {
                    method,
                    wallet,
                    value,
                },
                {
                    withCredentials: true,
                },
            );
            refresh();
            successMsg('Cashout request successfully placed')
        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status === 400) {
                errorMsg((error.response.data as ErrorData).error);
            } else errorMsg(standardMessages.error);
        } finally {
            setProcessing(false);
            handleClose();
        }
    }

    return (
        <Modal
            open={view === ViewState.cashout}
            onClose={handleClose}
        >
            <Box
                width='100%' height='100%'
                display='flex' justifyContent='center' alignItems='center'
                sx={{ pointerEvents: 'none' }}
            >
                <Box>
                    <PaperBlockContainer sx={{ pointerEvents: 'auto' }} >
                        <PaperBlock width='340px' /* height='333px' */>
                            <Box
                                display='flex' justifyContent='space-between' alignItems='center'
                                fontWeight={600} fontSize='20px' lineHeight='120%'
                                color={theme.palette.common.black}
                            >
                                Cashout
                                <CloseIcon onClick={handleClose} />
                            </Box>
                            <Box
                                mt='16px'
                                width='fit-content' height='fit-content'
                                maxHeight='100%'
                                display='flex' flexWrap='wrap'
                                borderRadius='16px'
                                overflow='auto'
                                sx={{
                                    scrollbarWidth: 'none',
                                    '&::-webkit-scrollbar': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <CashoutMethodCard
                                    width='146px'
                                    selected={method}
                                    method={CashoutMethod.ethereum}
                                    onClick={handleSelectMethod}
                                />
                                <CashoutMethodCard
                                    width='146px'
                                    selected={method}
                                    method={CashoutMethod.usdtErc}
                                    onClick={handleSelectMethod}
                                />
                                <CashoutMethodCard
                                    width='292px'
                                    selected={method}
                                    method={CashoutMethod.bitcoin}
                                    onClick={handleSelectMethod}
                                />
                            </Box>
                            <Box
                                mt='16px'
                                fontWeight={600}
                                fontSize='14px'
                                lineHeight='160%'
                            >
                                Your wallet
                            </Box>
                            <Box mt='8px'>
                                <TextInput
                                    placeholder='Wallet'
                                    disabled={!method}
                                    value={wallet}
                                    onChange={e => setWallet(e.target.value.trim())}
                                />
                            </Box>
                            <Box
                                mt='16px'
                                display='flex' justifyContent='space-between'
                            >
                                <Box fontWeight={600} fontSize='14px' lineHeight='160%'>
                                    Value
                                </Box>
                                <Box
                                    fontWeight={400} fontSize='14px' lineHeight='160%'
                                    color={theme.palette.common.gray}
                                >
                                    {balanceStr} $ available
                                </Box>
                            </Box>
                            <Box mt='8px'>
                                <TextInput
                                    placeholder='Value'
                                    value={value}
                                    onChange={e => {
                                        if (!balance) return;

                                        const value = Number(e.target.value.trim());
                                        if (Number.isNaN(value)) return;
                                        if (value > balance) return;

                                        setValue(value);
                                    }}
                                />
                            </Box>
                            <Box mt='8px'>
                                <VioletButton
                                    color='#8D00D0'
                                    bgcolor="rgba(141, 0, 208, 0.1)"
                                    onClick={() => balance && setValue(balance)}
                                >
                                    Max {balanceStr} $
                                </VioletButton>
                            </Box>
                            <Box
                                mt='16px'
                                display='flex' justifyContent='space-between'
                                fontWeight={400} fontSize='14px' lineHeight='160%'
                                color={theme.palette.common.gray}
                            >
                                <Box>Network fee</Box>
                                <Box>$2</Box>
                            </Box>
                            <Box
                                mt='20px'
                                borderTop='2px solid #F2F4F5'
                            />
                            <Box
                                mt='20px'
                                display='flex' justifyContent='space-between'
                            >
                                <Box
                                    fontWeight={400} fontSize='14px' lineHeight='160%'
                                    color={theme.palette.common.gray}
                                >
                                    You receive
                                </Box>
                                <Box
                                    fontWeight={600} fontSize='20px' lineHeight='120%'
                                    color={theme.palette.common.black}
                                >
                                    {Intl.NumberFormat(navigator.language).format(value >= 2 ? value - 2 : 0)}
                                </Box>
                            </Box>
                            <Box mt='16px'>
                                <RainbowButton
                                    fullWidth
                                    disabled={!(method && wallet && value)}
                                    loading={processing}
                                    onClick={handleCashout}
                                >
                                    Cashout
                                </RainbowButton>
                            </Box>
                        </PaperBlock>
                    </PaperBlockContainer>
                </Box>
            </Box>
        </Modal>
    )
}
