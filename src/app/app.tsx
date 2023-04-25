// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { MultiStopwatch } from "@utils/multi-stopwatch";
import {Route, Routes} from "react-router-dom";
import Home from "./home";
import {Calculator} from "@utils/calculator";

export function App() {
  return (
    <>
        <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/multi-stopwatch"} element={<MultiStopwatch />} />
            <Route path={"/calculator"} element={<Calculator />} />
        </Routes>
    </>
  );
}

export default App;
