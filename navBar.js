import React from "react";
import { NavLink, outlet, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


const drawerWidth = 240;
// const navItems = [{ name: "Home", NavLink: "/Home" }];

function NavBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {
          <ListItem
            disablePadding
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText />
              <NavLink to="/">Home</NavLink>
            </ListItemButton>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText />
              <NavLink to="/todoApp">TodoApp</NavLink>
            </ListItemButton>
          </ListItem>
        }
      </List>
    </Box>
  );

  const navigate = useNavigate()

  const navigation = (value) =>{
    navigate(`/${value}`)
  }
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              My App
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              
                <Button variant="contained" onClick={()=>navigation("")}> HOME </Button>
    
                <Button variant="contained" onClick={()=>navigation("todoApp")}>TODO APP</Button>
                <Button variant="contained" onClick={()=>navigation("calender")}>CALENDER</Button>
              
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            container=""
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth
              }
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
    </>
  );
}

export default NavBar;
