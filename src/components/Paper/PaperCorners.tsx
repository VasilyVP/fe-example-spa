import { Box } from '@mui/material';
import { TlCorner, TrCorner, BlCorner, BrCorner } from './corners';

export default () => {

    return (
        <Box
            position='absolute'
            top={0} left={0}
            padding='7px'
            width='100%' height='100%'
            display='flex' flexDirection='column' justifyContent='space-between'
            sx={{
                pointerEvents: 'none',
            }}
        >
            <Box display='flex' justifyContent='space-between'>
                <TlCorner />
                <TrCorner />
            </Box>
            <Box display='flex' justifyContent='space-between'>
                <BlCorner />
                <BrCorner />
            </Box>
        </Box>
    )
}
