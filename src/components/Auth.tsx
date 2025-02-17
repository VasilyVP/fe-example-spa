import { useRef, useState, useEffect } from 'react';
import { Avatar, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import useAuth from 'hooks/useAuth';
import useNotifications, { standardMessages } from "hooks/useNotifications";
import exitIcon from 'assets/icons/exit_icon.svg';
import config from 'config';


export default () => {
    const [showMenu, setShowMenu] = useState(false);
    const { user, requestDiscordCode, loginWithDiscord, logout, error } = useAuth();

    const ref = useRef<HTMLButtonElement>(null);
    const theme = useTheme();

    const { errorMsg } = useNotifications();

    useEffect(() => {
        const search = new URLSearchParams(window.location.search);
        const state = search.get('state');
        const code = search.get('code');

        if (code) window.history.replaceState(null, '', config.hostPostfix || '/');

        const storedState = sessionStorage.getItem('discord-auth-state');

        if (!(storedState && state && code)) return;
        if (storedState !== state) return;

        loginWithDiscord(code)
    }, []); // eslint-disable-line

    useEffect(() => {
        if (!error) return;
        errorMsg(standardMessages.error);
        console.error(error.message);
    }, [error]); //eslint-disable-line

    const handleClickAvatar = () => {
        if (!user) requestDiscordCode();
        else setShowMenu(true);
    }

    const handleLogout = () => {
        logout();
        setShowMenu(false);
    }

    return (
        <>
            <IconButton
                ref={ref}
                disabled={!user}
                onClick={handleClickAvatar}
            >
                <Avatar
                    src={user ? user.avatarUrl : ''}
                    sx={{ cursor: 'pointer' }}
                >
                    {user ? user.username[0] : null}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={ref.current}
                open={showMenu}
                onClose={() => setShowMenu(false)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        bgcolor: '#EAEEF0',
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <img src={exitIcon} alt='' />
                    </ListItemIcon>
                    <ListItemText>
                        <Typography fontWeight={600} fontSize='14px' lineHeight='160%' color={theme.palette.common.gray}>
                            Logout
                        </Typography>
                    </ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}
