import {Link} from "react-router-dom";

const Home = () => {
    return (
        <>
            <Link to={"/multi-stopwatch"}>
                <button>
                    MultiStopwatch
                </button>
            </Link>
            <Link to={"/calculator"}>
                <button>
                    Calculator
                </button>
            </Link>
            <Link to={"/pace-calculator"}>
                <button>
                    Pace Calculator
                </button>
            </Link>
        </>
    )
}

export default Home

