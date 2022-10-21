import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = "https://dummyjson.com/products";
function CardData(props) {
  const { setApiData } = props;

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setApiData(response.data.products);
    });
  }, []);

  return <></>;
}

export default CardData;
