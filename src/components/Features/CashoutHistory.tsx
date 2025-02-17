import { useEffect, useMemo } from 'react';
import { Modal, Box, useTheme, CircularProgress /* , Autocomplete, TextField */ } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store';
import { formatDistanceToNow } from 'date-fns';
import PaperBlockContainer from "components/Paper/PaperBlockContainer";
import PaperBlock from "components/Paper/PaperBlock";
import { setView, ViewState } from 'store/slicers/commonSlice';
import { CloseIcon, ErrorIcon, OkIcon } from "assets/icons/icons";
import useCashoutHistory from 'hooks/useCashoutHistory';
import { getMethodSymbol } from 'utils/transform_validate';
import useNotifications, { standardMessages } from 'hooks/useNotifications';


export default () => {
    const theme = useTheme();
    const view = useAppSelector(state => state.common.viewState);
    const dispatch = useAppDispatch();

    const { errorMsg } = useNotifications();

    const handleClose = () => {
        dispatch(setView(ViewState.main));
    }

    const { cashouts, error, /* loading, */ refresh } = useCashoutHistory();

    useEffect(() => {
        refresh();
    }, [view]); // eslint-disable-line

    useEffect(() => {
        if (error) errorMsg(standardMessages.error);
    }, [error]); //eslint-disable-line

    const cashoutsList = useMemo(() => cashouts?.map(cashout => {
        let Icon = () => <OkIcon color='#6F2CFF' />;
        if (cashout.status === 'requested') {
            Icon = () => <CircularProgress size='14px' sx={{ color: '#8C9BB0' }} />;
        }
        if (cashout.status === 'rejected') Icon = () => <ErrorIcon />;

        return (
            <Box
                key={cashout.publicId}
                width='100%'
                bgcolor='#f2f4f5'
                border='1px solid white'
                py='19px' px='16px'
            >
                <Box display='flex' alignItems='center'>
                    <Box mr='9px' display='flex'>
                        <Icon />
                    </Box>
                    <Box fontWeight={600} fontSize='14px' lineHeight='22px'>
                        ${cashout.value} • {getMethodSymbol(cashout.method)}
                    </Box>
                </Box>
                <Box
                    mt='4px'
                    display='flex' justifyContent='space-between'
                >
                    <Box
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.gray}
                    >
                        {formatDistanceToNow(new Date(cashout.createdAt))} ago
                    </Box>
                    <Box
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.gray}
                    >
                        #{cashout.publicId}
                    </Box>
                </Box>
            </Box>
        )
    }), [cashouts]); //eslint-disable-line


    return (
        <Modal
            open={view === ViewState.cashoutHistory}
            onClose={handleClose}
        >
            <Box
                width='100%' height='100%'
                display='flex' justifyContent='center' alignItems='center'
                sx={{ pointerEvents: 'none' }}
            >
                <Box>
                    <PaperBlockContainer sx={{ pointerEvents: 'auto' }} >
                        <PaperBlock width='340px' /* height='473px' */>
                            <Box
                                display='flex' justifyContent='space-between' alignItems='center'
                                fontWeight={600} fontSize='20px' lineHeight='120%'
                                color={theme.palette.common.black}
                            >
                                <Box display='flex' alignItems='center'>
                                    <Box ml='16px'>Your cashouts</Box>
                                </Box>
                                <CloseIcon onClick={handleClose} />
                            </Box>
                            <Box
                                mt='16px'
                                maxHeight='266px'
                                overflow='auto'
                                borderRadius='16px'
                                sx={{
                                    scrollbarWidth: 'none',
                                    '&::-webkit-scrollbar': {
                                        display: 'none',
                                    },
                                }}
                            >
                                {cashoutsList}
                            </Box>
                        </PaperBlock>
                    </PaperBlockContainer>
                </Box>
            </Box>
        </Modal>
    )
}
