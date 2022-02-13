import React from "react";
import {Route, Routes} from 'react-router-dom';
import Join from "./components/join/Join";
import Chat from "./components/public-chat/Chat";
import LiveVisitors from "./components/live-visitors";
import Homepage from "./components/Homepage/Homepage";
import Posts from "./components/posts";
import CreatePost from "./components/createPost/CreatePost";
import {Provider} from "react-redux";
import store from "./redux/store";

const App = () => {
    return (
        <>
            <Provider store={store}>
                <Routes>
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/join" element={<Join/>}/>
                    <Route path="/post" element={<Posts/>}/>
                    <Route path="/create-post" element={<CreatePost/>}/>
                    <Route path="/chat" element={<Chat/>}/>
                    <Route path="/live-visitor" element={<LiveVisitors/>}/>
                </Routes>
            </Provider>
        </>

    );
}

export default App;
