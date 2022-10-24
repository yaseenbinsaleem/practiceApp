import { Route, Routes } from "react-router-dom";
import { Home, TodoApp, CardData, Product, PageNotFound } from ".";

export default function Router() {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Home />}></Route>
        <Route path="/todoApp" element={<TodoApp />}></Route>
        <Route path="/cardData" element={<CardData />}></Route>
        <Route path="/product/:productID" element={<Product />}></Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </>
  );
}
