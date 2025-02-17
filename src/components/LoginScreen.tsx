import { Box } from "@mui/material"
import useAuth from "hooks/useAuth"
import RainbowButton from "./Buttons/RainbowButton";
import { DiscordIcon } from "assets/icons/icons"


export default () => {
    const { requestDiscordCode } = useAuth();

    return (
        <Box
            position='absolute' top={0} left={0}
            width='100%' height='100%'
            display='flex' alignItems='center' justifyContent='center'
            zIndex={-1}
        >

            <Box
                width='250px'
            >
                <RainbowButton
                    fullWidth
                    onClick={requestDiscordCode}
                >
                    <DiscordIcon color='white' width={20} height={16} />
                    <Box ml='8px'
                        fontWeight={600} fontSize='18px' lineHeight='160%'
                    >Login with Discord</Box>
                </RainbowButton>
            </Box>
        </Box >
    )
}
