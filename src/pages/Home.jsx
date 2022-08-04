import React from "react";
import UserSearch from "../component/users/UserSearch";
import UserResults from "../component/users/UserResults";

const Home = () => {
    return (
        <div>
            {/* <h1 className='text-6xl'>Welcome</h1> */}
            <UserSearch />
            <UserResults />
        </div>
    );
};

export default Home;
