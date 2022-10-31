import React from "react";
import NavBar from "./navBar";
import { Link } from "react-router-dom";
import { UserAuth } from "./authContext";
import { Button } from "@mui/material";
import Iframe from 'react-iframe'
import { useNavigate } from "react-router-dom";


function Home() {
  const {user,logout}=UserAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <>
     <h1>{user?.email}</h1>
     {/* <Iframe url="https://www.sdrive.app/embed/1ptBQD"
        width="640px"
        height="320px"
        id=""
        className=""
        display="block"
        position="relative"/> */}

      <Button  sx={{
                  my: 2,
                  color: "white",
                  backgroundColor:"blue",
                  display: "block",
                  textDecoration: "none"
                }} onClick={handleLogout}></Button>
    </>

  );
}

export default Home;
