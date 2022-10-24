import React from "react";
import { useParams, useNavigate , useLocation } from "react-router-dom";
import { useState } from "react";

export default function Product(props) {
    const { productID } = useParams();
    const location = useLocation()
    
    //location is used to access data sent through useNavigate using state as second parameter 
    //sent from cards2 line no. 83 {i.e navigate(`/product/${productID}`, { state: { cardData } }); }
console.log(location.state);
  
  return (
    <>
      <h1>my {productID}</h1>
    </>
  );
}
