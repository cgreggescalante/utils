// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { MultiStopwatch } from "@utils/multi-stopwatch";
import {Route, Routes} from "react-router-dom";
import Home from "./home";

export function App() {
  return (
    <>
        <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/multi-stopwatch"} element={<MultiStopwatch />} />
        </Routes>
    </>
  );
}

export default App;
