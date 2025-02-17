import { ReactNode } from 'react';
import { Box, Grid, GridProps, BoxProps } from '@mui/material';
import { TlCorner, TrCorner, BlCorner, BrCorner } from './corners';


type PaperBlockProps = {
    children?: ReactNode | ReactNode[];
    width?: string | number;
    height?: string | number;
    ctl?: boolean;
    ctr?: boolean;
    cbr?: boolean;
    cbl?: boolean;
    bgcolor?: string;
    gridProps?: GridProps;
    boxProps? : BoxProps;
}
export default ({
    children,
    width = 'auto', height = 'auto',
    ctl = false, ctr = false, cbr = false, cbl = false,
    bgcolor = 'white',
    gridProps,
    boxProps,
}: PaperBlockProps) => {

    let cornersAlignmentTop = 'flex-start';
    let cornersAlignmentBottom = 'flex-start';
    if (ctr) cornersAlignmentTop = 'flex-end';
    if (ctl && ctr) cornersAlignmentTop = 'space-between';
    if (cbr) cornersAlignmentBottom = 'flex-end';
    if (cbl && cbr) cornersAlignmentBottom = 'space-between';

    return (
        <Grid
            item
            width={width} height={height}
            {...gridProps}
        >
            <Box
                padding='7px'
                width='100%' height='100%'
                display='flex' flexDirection='column' justifyContent='space-between'
                bgcolor={bgcolor}
            >
                <Box display='flex' justifyContent={cornersAlignmentTop}>
                    {ctl && <TlCorner />}
                    {ctr && <TrCorner />}
                </Box>
                <Box
                    marginX='17px'
                    flexGrow={1}
                    pt={ctl || ctr ? 0 : '17px'}
                    pb={cbl || cbr ? 0 : '17px'}
                    {...boxProps}
                >
                    {children}
                </Box>
                <Box display='flex' justifyContent={cornersAlignmentBottom}>
                    {cbl && <BlCorner />}
                    {cbr && <BrCorner />}
                </Box>
            </Box>
        </Grid>
    )
}
