import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Backdrop } from "@mui/material";
// import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card2Component from "../../components/card/card2";

export default function Product(props) {
  const { productID } = useParams();
  const location = useLocation();

  //   let [open, setOpen] = useState(true);

  //location is used to access data sent through useNavigate using state as second parameter
  //sent from cards2 line no. 83 {i.e navigate(`/product/${productID}`, { state: { cardData } }); }

  console.log(location.state);

  return (
    <>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      ></Backdrop> */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 128,
            height: 128
          }
        }}
      >
        <Card2Component
          id={location.state.cardData.id}
          image={location.state.cardData.image}
          title={location.state.cardData.title}
          price={location.state.cardData.price}
          description={location.state.cardData.description}
        ></Card2Component>
      </Box>
    </>
  );
}
