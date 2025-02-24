import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import logo from '../assets/logo.png'; 
import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: open ? `calc(100% - ${drawerWidth}px)` : '100%',  // Adjust width for AppBar
  marginLeft: open ? `${drawerWidth}px` : '0',  // Adjust marginLeft when drawer is open
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export default function Navigation() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
    const navigate = useNavigate();
    const context = useContext(AppContext);
    if (!context) {
        // Handle the case where the context is undefined
        return <div>Loading...</div>;
    }
    const { token, setToken, user, setUser } = context;

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () =>{


    const res = await fetch('/api/logout', {
        method: 'post',
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });

    const data = await res.json();
    console.log(data);

    if(res.ok){
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        navigate('/');
    }
}

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: '#FB7F3B' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, flexDirection: "row" ,   display: 'flex', alignItems: 'center'}}>
            <img
              src={logo}
              style={{ height: 40, width: 40, objectFit: 'contain' , marginRight: 10}} // added objectFit to prevent distortion
              alt="Logo"
            />
            <Typography variant="h6" noWrap component="div" 
            sx={{
              fontFamily:  "Madimi One",
              color: 'white', 
            }}>
              BIG BITES
            </Typography>
          </Box>
          


          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
  
              <MenuItem onClick={handleCloseUserMenu}>
              <LogoutRoundedIcon sx={{ color: 'lightgrey' }} />
                <Typography sx={{ marginLeft :1, textAlign: 'center' }}>Logout</Typography>
              </MenuItem>

            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
      <DrawerHeader sx={{ backgroundColor: '#C1272D'}}>
          


        
      
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon sx={{ color: 'white' }} />
          ) : (
            <ChevronRightIcon sx={{ color: 'white' }} />
          )}
        </IconButton>
      </DrawerHeader>

        <Divider />
        <List>
            <Link to= "/">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SpaceDashboardIcon />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItemButton>
            </ListItem>
            </Link>
           
            <Link to= "/orders">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <LibraryBooksRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={"Orders"} />
              </ListItemButton>
            </ListItem>
            </Link>
            
            <Link to= "/menu">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <RestaurantMenuRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={"Menu"} />
              </ListItemButton>
            </ListItem>
            </Link>
            
            <Link to= "/promos">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <StarRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={"Promos & Feature"} />
              </ListItemButton>
            </ListItem>
            </Link>
           
            <Link to= "/branches">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <LocationOnRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={"Branches"} />
              </ListItemButton>
            </ListItem>
            </Link>
            
        </List>

        <Divider />

        <List>

        <Link to= "/admin">
        <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <AdminPanelSettingsRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={"Manage Admin"} />
              </ListItemButton>
            </ListItem>
        </Link>
           
        <Link to= "/usersettings">
        <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ManageAccountsRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={"User Settings"} />
              </ListItemButton>
            </ListItem>
        </Link>
           


        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>

    </Box>
  );
}
