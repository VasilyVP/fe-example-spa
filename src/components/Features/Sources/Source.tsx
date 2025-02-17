import { Box, Grid, Typography } from "@mui/material";
import { CopyIcon, OkIcon } from "assets/icons/icons";
import IOSSwitch from "components/IOSSwitch";
import useNotifications from "hooks/useNotifications";
import { Source } from "hooks/useSource";
import theme from "theme";
import { ellipsed } from "utils/styles";

type SourceProps = {
    source: Source;
    selected: boolean;
    onClick: (source: Source) => void;
    onSwitchActive: (source: Source) => void;
}
export default ({ source, selected, onClick, onSwitchActive }: SourceProps) => {
    const { successMsg } = useNotifications();

    const dateStr = new Intl.DateTimeFormat(navigator.language).format(new Date(source.createdAt));
    const leftStr = source.balance !== undefined
        ? new Intl.NumberFormat(navigator.language).format(source.balance)
        : '--//--';
    const spentStr = source.spent !== undefined
        ? new Intl.NumberFormat(navigator.language).format(source.spent)
        : '--//--';

    return (
        <Box
            mt='1px'
            position='relative'
            onClick={() => onClick(source)}
        >
            {selected &&
                <Box
                    position='absolute' top='9px' left='9px' zIndex={10}
                    display='flex'
                >
                    <OkIcon color='#6F2CFF' />
                </Box>
            }
            <Grid
                container
                display='flex' justifyContent='space-between'
                //width='100%' //height='80px'
                bgcolor='#F2F4F5'
                sx={{
                    opacity: selected ? 0.5 : 1,
                    cursor: 'pointer',
                }}
                p='16px'
            >
                <Grid
                    item
                    width={185}
                >
                    <Typography
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        maxWidth={170}
                        {...ellipsed()}
                        color={theme.palette.common.gray}
                    >
                        {source.sourceUrl}
                    </Typography>
                    <Box display='flex' alignItems='center'>
                        <Typography
                            fontWeight={600} fontSize='14px' lineHeight='160%'
                            color={theme.palette.common.black}
                            width={170}
                            {...ellipsed()}
                        >
                            {source.id}
                        </Typography>
                        <CopyIcon
                            //color='#6F2CFF'
                            color='#8D00D0'
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(source.id);
                                successMsg('Copied');
                            }}
                            style={{
                                marginLeft: '9px'
                            }}
                        />
                    </Box>
                </Grid>
                <Grid
                    item
                    width={120}
                >
                    <Typography
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.gray}
                    >
                        {`${source.rate} $/k`}
                    </Typography>
                    <Typography
                        fontWeight={600} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.black}
                    >
                        {`${leftStr} R$ left`}
                    </Typography>
                </Grid>
                <Grid
                    item
                    width={120}
                >
                    <Typography
                        fontWeight={400} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.gray}
                    >
                        {dateStr}
                    </Typography>
                    <Typography
                        fontWeight={600} fontSize='14px' lineHeight='160%'
                        color={theme.palette.common.black}
                    >
                        {`${spentStr} R$ spent`}
                    </Typography>
                </Grid>
                <Grid
                    item
                    width={50}
                    textAlign='right'
                    display='flex' alignItems='center'
                >
                    <IOSSwitch
                        onClick={(e) => {
                            e.stopPropagation();
                            onSwitchActive(source)
                        }}
                        checked={source.status === 'active'}
                        thumbcolor='inherit'//{!stockAccount.health ? 'red' : 'inherit'}
                    //disabled={!stockAccount.health}
                    />
                </Grid>
            </Grid>
        </Box >
    )
}
