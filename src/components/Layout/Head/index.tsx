import { Box, Grid, Typography, useTheme } from '@mui/material';
import { DiscordIcon } from 'assets/icons/icons';
import RobuyIcon from 'assets/icons/robuy_icon.svg';
import Auth from 'components/Auth';
import { useMobile } from 'utils/styles';

export default () => {
    const { isMobile } = useMobile();
    const theme = useTheme();

    return (
        <>
            <Grid
                container
                width='100%' height='42px'
                marginTop={isMobile ? '12px' : '16px'}
                paddingX={isMobile ? '16px' : '32px'}
                display='flex' alignItems='center' justifyContent='space-between'
            >
                <Grid
                    item sm={2}
                    display='flex' alignItems='center'
                >
                    <Box
                        display='flex'
                        marginRight='8px'
                    >
                        <img src={RobuyIcon} alt='robuy' />
                    </Box>
                    <Typography fontWeight={600} fontSize='16px' lineHeight='120%'>
                        Rosell
                    </Typography>
                </Grid>
                <Grid
                    item sm={2}
                    display='flex' alignItems='center' justifyContent='flex-end'
                >
                    <DiscordIcon
                        //width={48} height={36}
                        color='#95A0A7'
                        hoverColor='#424242'
                        onClick={() => window.open('https://discord.gg/robuygg')}
                        style={{ cursor: 'pointer' }}
                    />
                    <Box
                        ml='17px'
                        fontWeight={600} fontSize='16px' lineHeight='160%'
                        color={theme.palette.common.gray}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                color: '#424242',
                            },
                        }}
                    >
                        ?
                    </Box>
                    <Box ml='25px'>
                        <Auth />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}
