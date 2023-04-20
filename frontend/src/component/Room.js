import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

const gameTimeline = [
    {
        phase: 1,
        name: 'Pick card'
    },
    {
        plase: 2,
        name: 'First night'
    }
]

const Room = () => {
    const user = localStorage.getItem("username")
    const [listUser, setListUser] = useState([])
    const [isAdmin, setIsAdmin] = useState(false);
    const socket = io('http://localhost:3000');
    const [currentPhase, setCurrentPhase] = useState();

    useEffect(() => {
        socket.on('user_in_room', users => {
            setListUser(users);
            setIsAdmin(users?.includes("admin") && user === "admin");
        })
        socket.on('update_game_phase', phase => {
            console.log(phase)
            setCurrentPhase(phase)
        })
    }, [])

    useEffect(() => {
        if(Object.keys(currentPhase || {}).length > 0) {
            document.querySelector('html').style.background = "#BA9B37"
        }
    }, [currentPhase])

    const handleStartGame = useCallback(() => {
        const phase = gameTimeline.find(timeline => timeline.phase == 1)
        // setCurrentPhase(phase);
        socket.emit('game_phase', phase)
    }, [currentPhase])

    const handleGiveCard = () => {

    }

    return <div className="text-white p-5 text-center flex flex-col gap-20">
        <h1 className="font-bold text-4xl">Welcome to SD room</h1>
        <ul className="flex gap-10 justify-center flex-wrap">
            {listUser.map(user => <li className="w-2/12 text-center flex flex-col items-center gap-5" key={user}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" id="user">
                    <g transform="translate(0 -1004.362)">
                        <circle cx="24" cy="1028.362" r="24" fill="#fff" fillRule="evenodd"></circle>
                        <g transform="translate(8 -9)">
                            <path fill="#406b95" fillRule="evenodd" d="M6 1048.346v-4.687c0-4.042 3.122-7.297 7-7.297h6c3.879 0 7 3.255 7 7.297v4.687z" color="#000" overflow="visible">
                            </path>
                            <ellipse cx="15.981" cy="1029.802" fill="#406b95" fillRule="evenodd" color="#000" overflow="visible" rx="4.98" ry="5"></ellipse>
                            <path fill="none" stroke="#0c5286" strokeLinejoin="round" d="M10 1043.824v4.538m12-4.538v4.538"></path>
                        </g>
                    </g>
                </svg>
                <span className="border border-white p-5 font-semibold w-full">
                    {user}
                </span>
            </li>)}
        </ul>
        {
            Object.keys(currentPhase || {}).length === 0 && isAdmin && <div>
                <button onClick={handleStartGame} className="p-4 px-5 bg-white rounded-xl text-black text-4xl font-bold">Start</button>
            </div>
        }
        {
            currentPhase?.phase === 1 ? isAdmin ? <div>
                <button onClick={handleGiveCard}>Pick card</button>
            </div> : <span>Admin is giving card, please wait</span> : ""
        }
    </div>
}

export default Room;