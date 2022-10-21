import { Route, Routes } from "react-router-dom";
import { Home,TodoApp} from ".";

export default function Router() {
    return(
        <>
        <Routes>
          <Route index path="/" element={<Home />}></Route>
          <Route path="/todoApp" element={<TodoApp />}></Route>
        </Routes>
        </>
    )
}
 