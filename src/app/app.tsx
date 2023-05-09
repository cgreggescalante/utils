// eslint-disable-next-line @typescript-eslint/no-unused-vars

import {Route, Routes} from "react-router-dom";
import Home from "./home";
import {Calculator} from "@utils/calculator";
import {PaceCalculator} from "@utils/pace-calculator";
import {StopwatchSession} from "@utils/multi-stopwatch";

export function App() {
  return (
    <>
        <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/multi-stopwatch"} element={<StopwatchSession />} />
            <Route path={"/calculator"} element={<Calculator />} />
            <Route path={"/pace-calculator"} element={<PaceCalculator />} />
        </Routes>
    </>
  );
}

export default App;
