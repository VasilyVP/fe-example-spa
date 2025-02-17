import { useState, useMemo, useEffect } from 'react';
import { Box, MenuItem, Modal, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "store"
import { setView, ViewState } from "store/slicers/commonSlice"
import useNotifications from 'hooks/useNotifications';
import useStocks from 'hooks/useStocks';
import PaperBlockContainer from 'components/Paper/PaperBlockContainer';
import { CloseIcon } from 'assets/icons/icons';
import PaperBlock from 'components/Paper/PaperBlock';
import TextInput from 'components/TextInput';
import VioletButton from 'components/Buttons/VioletButton';
import useRates from 'hooks/useRates';
import SelectInput from 'components/SelectInput';
import RainbowButton from 'components/Buttons/RainbowButton';
import useQueue from 'hooks/useQueue';
import useSource, { Source } from 'hooks/useSource';


type AddOrEditSourceProps = {
    selectedSources: Source[];
}
export default ({ selectedSources, /* setSelectedAccounts, refresh */ }: AddOrEditSourceProps) => {
    const [sourceUrl, setSourceUrl] = useState<string>('');
    const [rate, setRate] = useState<string>('');
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);

    const theme = useTheme();
    const view = useAppSelector(state => state.common.viewState);
    const dispatch = useAppDispatch();

    const { addSource, editSource, refresh: sourceRefresh } = useSource();
    const { refresh: stocksRefresh } = useStocks();
    const { refresh: queueRefresh } = useQueue();

    const { errorMsg, successMsg } = useNotifications();

    const { rates, minRate } = useRates();
    const ratesList = useMemo(() => rates?.map(rate => (
        <MenuItem key={rate} value={String(rate)}>
            {rate}
        </MenuItem>
    )), [rates]);

    const lowestRate = rates ? minRate || Math.min(...rates) : 0;

    useEffect(() => {
        if (selectedSources.length) {
            const source = selectedSources[0];

            setSourceUrl(source.sourceUrl);
            setRate(String(source.rate));
        }
    }, [view]); // eslint-disable-line

    const handleAddSource = async () => {
        if (!/^https?:\/\/.+\.[a-z]{2,6}.*$/.test(sourceUrl)) {
            errorMsg('Wrong source url format');
            return;
        }

        setAdding(true);
        try {
            await addSource({ rate, sourceUrl });
            successMsg('Source was added');
            stocksRefresh();
            queueRefresh();
            sourceRefresh();
        } catch (err) {
            errorMsg((err as Error).message);
        } finally {
            setAdding(false);
            handleClose();
        }
    }

    const handleEditRate = async () => {
        try {
            setUpdating(true);
            await editSource({
                rate,
                source: selectedSources[0],
            });
            stocksRefresh();
            queueRefresh();
            sourceRefresh();
            successMsg('Source rate was updated');
        } catch (err) {
            errorMsg((err as Error).message);
        } finally {
            setUpdating(false);
            handleClose();
        }
    }

    const handleClose = () => {
        setSourceUrl('');
        setRate('');
        dispatch(setView(ViewState.main));
    }

    return (
        <Modal
            open={view === ViewState.addSource || view === ViewState.editSource}
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
                                {view === ViewState.addSource ? 'Add source' : 'Change rate'}
                                <CloseIcon onClick={handleClose} />
                            </Box>
                            <Box
                                mt='16px'
                                fontWeight={600} fontSize='14px' lineHeight='160%'
                                color={theme.palette.common.black}
                            >
                                Source URL
                            </Box>
                            <Box mt='8px'>
                                <TextInput
                                    value={sourceUrl}
                                    onChange={e => setSourceUrl(e.target.value)}
                                    disabled={view !== ViewState.addSource}
                                    placeholder="https://"
                                />
                            </Box>
                            <Box
                                mt='16px'
                                fontWeight={600} fontSize='14px' lineHeight='160%'
                                color={theme.palette.common.black}
                            >
                                Rate
                            </Box>
                            <Box mt='8px'>
                                <SelectInput
                                    value={rate}
                                    onChange={(e) => setRate(String(e.target.value))}
                                    fullWidth
                                    placeholder='Rate $/k'
                                >
                                    {ratesList}
                                </SelectInput>
                            </Box>
                            {lowestRate ?
                                (
                                    <Box mt='8px'>
                                        <VioletButton
                                            color='#8D00D0'
                                            bgcolor="rgba(141, 0, 208, 0.1)"
                                            onClick={() => setRate(String(lowestRate))}
                                            disabled={!rates?.includes(lowestRate)}
                                        >
                                            Lowest {lowestRate}$/k
                                        </VioletButton>
                                    </Box>
                                ) : null
                            }
                            <Box mt='16px'>
                                <RainbowButton
                                    fullWidth
                                    onClick={view === ViewState.addSource ? handleAddSource : handleEditRate}
                                    disabled={!(rate && sourceUrl) || updating}
                                    loading={adding || updating}
                                >
                                    {selectedSources.length ? 'Set' : 'Add'}
                                </RainbowButton>
                            </Box>
                        </PaperBlock>
                    </PaperBlockContainer>
                </Box>
            </Box>
        </Modal>
    )
}
