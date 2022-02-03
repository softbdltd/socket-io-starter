import React from "react";
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Join from "./components/join/Join";
import Chat from "./components/public-chat/Chat";
import LiveVisitors from "./components/live-visitors";
import Homepage from "./components/Homepage/Homepage";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/join" element={<Join/>}/>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/live-visitor" element={<LiveVisitors/>}/>
            </Routes>

        </>

    );
}

export default App;
