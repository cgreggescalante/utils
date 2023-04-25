import {Link} from "react-router-dom";

const Home = () => {
    return (
        <>
            <Link to={"/multi-stopwatch"}>
                <button>
                    MultiStopwatch
                </button>
            </Link>
        </>
    )
}

export default Home

