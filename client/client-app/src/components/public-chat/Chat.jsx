import React, {useEffect, useState} from 'react';
import './Chat.css'
import queryString from 'query-string';
import {useLocation} from "react-router";
import {io} from "socket.io-client";
import {styled} from '@mui/material/styles';
import {tableCellClasses} from '@mui/material/TableCell';
import {
    Grid,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TableCell,
    Paper,
    Box
} from "@mui/material";
import Header from "../header/Header";
import InfoBar from "../infobar/Infobar";
import Input from "../input/Input";
import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";

let socket;
const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(name, calories, fat, carbs, protein) {
    return {name, calories, fat, carbs, protein};
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
];
const Chat = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState('');
    const [connectedVisitors, setConnectedVisitors] = useState([]);
    const ENDPOINT = 'http://localhost:5000';
    const location = useLocation();
    useEffect(() => {
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT);

        socket.emit('new_visitor', {name});

        socket.on('visitors', (visitors) => {
            console.log("visitors", visitors);
            setConnectedVisitors(visitors);

        });
        setRoom(String(room));
        setName(String(name));
        console.log("socket", socket);

        socket.emit('join', {name, room}, (error) => {
            if (error) {
                // alert(error);
            }
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
        /*    return socket.emit('disconnect')*/
    }, [ENDPOINT, location])

    useEffect(() => {
        socket.on('message', (message) => {
            console.log("message 111", message);
            setMessages([...messages, message]);
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [messages,users]);

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }

    }
    console.log('message: ', message);
    console.log('messages: ', messages);
    return (

        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Header/>

            </Grid>
            {/*<Grid item xs={12}>
                <h4>online Visitors({connectedVisitors.length ? connectedVisitors.length : <></>})</h4>
                {connectedVisitors && connectedVisitors.length ? connectedVisitors.map((visitor, index) => {
                    return (<React.Fragment key={index}>
                        <Typography>
                            {visitor?.name}
                        </Typography>
                    </React.Fragment>);
                }) : <></>}

            </Grid>*/}
            <Grid item xs={12}>
                <div className='outerContainer'>
                    <div className={'container'}>
                        <InfoBar room={room}/>
                        <Messages messages={messages} name={name}/>
                        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                    </div>
                    <TextContainer users={users}/>
                </div>
                {/* <Box sx={{textAlign: 'center', margin: 'auto'}}>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 700}} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell align="center">Ip</StyledTableCell>
                                    <StyledTableCell align="center">Country</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <StyledTableRow key={row.name}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.calories}</StyledTableCell>
                                        <StyledTableCell align="center">{row.fat}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>*/}
            </Grid>


        </Grid>
    );
};

export default Chat;
