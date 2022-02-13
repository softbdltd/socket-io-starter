import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import styles from './Homepage.module.css';
import {useDispatch, useSelector} from "react-redux";
import {io} from "socket.io-client";
import Posts from "../posts";
import CreatePost from "../createPost/CreatePost";

const Homepage = () => {

    const [socket, setSocket] = useState(null)
    const [user, setUser] = useState('')
    const [posts, setPosts] = useState([])
    const [newPost, setNewPost] = useState(false)

    const userStore = useSelector((state) => state.user)
    console.log('userStore=>', userStore);
    const dispatch = useDispatch()

    useEffect(() => {
        setSocket(io('http://localhost:5000'));
    }, [])

    useEffect(() => {
        socket?.emit('newUser', user)
        dispatch({type: 'user', users: user})
    }, [socket, user])

    useEffect(() => {
        socket?.on('getPost', (postData) => {
            setPosts([...posts, postData])
        })
    }, [socket, posts])

    const onClickNewPost = () => {
        setNewPost(true)
    }

    const {register, handleSubmit, reset, formState: {errors}} = useForm();

    const onSubmit = (data) => {
        setUser(data.userName)
        reset();
    };

    return (
        <div className={styles.container}>
            {userStore ? (
                    <>
                        <div className={styles.user}>User: <span className={styles.user_span}>{user}</span>
                            <div>
                                <a className={styles.join_room} href={'/join'}>Join a room</a>
                            </div>
                        </div>
                        {posts?.map((post, i) => (
                            <Posts key={i} post={post}/>
                        ))}
                    </>
                ) :
                (
                <div className={styles.login}>
                <div className={styles.form}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.register_form}>
                <input type='text' placeholder='username' {...register('userName')}/>
                <button type='submit'>Login</button>
                </form>
                </div>
                </div>
                )}
            {user === 'admin' && !newPost && (
                <button onClick={onClickNewPost} className={styles.add_post_btn}>Create Post</button>
            )}
            {user === 'admin' && newPost && (
                <CreatePost socket={socket} setNewPost={setNewPost}/>
            )}
        </div>
    );
};

export default Homepage;


// <div>
//     <div>Homepage</div>
//     <div>
//         <a href={'/join'}>Join a room</a>
//     </div>
// </div>
