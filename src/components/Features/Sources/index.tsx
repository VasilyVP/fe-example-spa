import { useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { Box, useTheme } from "@mui/material";
import RainbowButton from "components/Buttons/RainbowButton";
import VioletButton from "components/Buttons/VioletButton";
import Paper from "components/Paper";
import { useAppDispatch } from "store";
import { setView, ViewState } from "store/slicers/commonSlice";
import { noScrollBar } from "utils/styles";
import useNotifications from 'hooks/useNotifications';
import AddOrEditSource from 'views/AddOrEditSource';
import useSource, { Source } from 'hooks/useSource';
import SourceElement from './Source';
import useQueue from 'hooks/useQueue';


export default () => {
    const [selected, setSelected] = useImmer<Source[]>([]);
    const [deleting, setDeleting] = useState(false);

    const theme = useTheme();
    const dispatch = useAppDispatch();

    const selectedIds = selected.map(source => source.id);

    const { refresh: queueRefresh } = useQueue();
    const { sources, /* error: sourceError, */ refresh: refreshSource, deleteSource, switchStatus } = useSource();

    const { errorMsg, successMsg } = useNotifications();

    const onClick = (clickedSource: Source) => {
        setSelected(state => {
            if (selectedIds.includes(clickedSource.id)) {
                return state.filter(source => source.id !== clickedSource.id);
            }
            state.push(clickedSource);
        })
    }

    const onSwitchActive = async (source: Source) => {
        const status = source.status === 'active' ? 'paused' : 'active';
        try {
            await switchStatus({ source, status });
            queueRefresh();
        } catch (err) {
            errorMsg((err as Error).message);
        }
    }

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteSource({ source: selected[0] });
            setSelected([]);
            refreshSource();
            queueRefresh();
            successMsg('Source was deleted');
        } catch (err) {
            errorMsg((err as Error).message);
        } finally {
            setDeleting(false);
        }
    }

    const sourcesList = useMemo(() => (
        sources?.map(source => (
            <SourceElement
                key={source.id}
                source={source}
                selected={selectedIds.includes(source.id)}
                onClick={onClick}
                onSwitchActive={onSwitchActive}
            />
        ))), [sources, selected]); //eslint-disable-line

    return (
        <>
            <AddOrEditSource
                selectedSources={selected}
            />
            <Paper width='658px'>
                <Box padding='9px 17px'>
                    <Box display='flex' justifyContent='space-between'>
                        <Box fontWeight={600} fontSize='20px' lineHeight='24px' color={theme.palette.common.black}>
                            Your Sources
                        </Box>
                        <RainbowButton
                            disabled={sourcesList === undefined || sourcesList.length !== 0}
                            onClick={() => dispatch(setView(ViewState.addSource))} sx={{ ml: '8px' }}
                        >
                            Add source
                        </RainbowButton>
                    </Box>
                    {sources?.length ?
                        (
                            <Box mt='24px'>
                                <Box
                                    //mt='12px'
                                    borderRadius='12px'
                                    overflow='auto'
                                    maxHeight='312px'
                                    sx={{
                                        ...noScrollBar(),
                                    }}
                                >
                                    {sourcesList}
                                </Box>
                                <Box
                                    mt='24px'
                                    fontWeight={600} fontSize={16} lineHeight='160%'
                                    color={theme.palette.common.black}
                                >
                                    {selected.length} Sources Selected
                                </Box>
                                <Box mt='24px'>
                                    <VioletButton
                                        disabled={selected.length !== 1}
                                        onClick={() => dispatch(setView(ViewState.editSource))}
                                    >
                                        Change Rate
                                    </VioletButton>
                                    <VioletButton
                                        color='#8D00D0'
                                        bgcolor="rgba(141, 0, 208, 0.1)"
                                        disabled={selected.length !== 1}
                                        loading={deleting}
                                        onClick={handleDelete}
                                        sx={{ ml: '8px' }}
                                    >
                                        Delete
                                    </VioletButton>
                                </Box>
                            </Box>
                        ) : null
                    }
                </Box>
            </Paper>
        </>
    )
}
