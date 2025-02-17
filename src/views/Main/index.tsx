import { Container } from "@mui/material"
import { Box } from "@mui/system"
import Dashboard from "components/Features/Dashboard"
import Proxies from "components/Features/Proxies"
import Sources from "components/Features/Sources"
import Stocks from "components/Features/Stocks"
import useAuth from 'hooks/useAuth';

export default () => {
    const { user } = useAuth();

    return (
        <Container>
            <Box
                mt='24px'
                display='flex' justifyContent='center'
            >
                <Dashboard />
            </Box>
            <Box
                mt='24px'
                display='flex' justifyContent='center'
            >
                <Stocks />
            </Box>
            {user?.role === 'reseller_plus' ?
                (
                    <Box
                        mt='24px'
                        display='flex' justifyContent='center'
                    >
                        <Sources />
                    </Box>
                ) : null
            }
            <Box
                mt='24px' mb='24px'
                display='flex' justifyContent='center'
            >
                <Proxies />
            </Box>
        </Container>
    )
}
