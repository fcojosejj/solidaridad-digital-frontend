'use client'

import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {useEffect, useRef, useState} from "react";
import {User} from "@/app/utils/lib/definitions";
import {getChatList, getLoggedInUserData, getUserData} from "@/app/utils/lib/routes";
import Link from "next/link";

export default function ChatList() {
    const [loggedInUserData, setLoggedInUserData] = useState<User | null>(null);
    const[chats, setChats] = useState<string[] | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    async function fetchChats() {
        const data = await getChatList();
        setChats(data);
    }

    useEffect(() => {
        async function fecthLoggedInUserData() {
            const data = await getLoggedInUserData();
            setLoggedInUserData(data);
        }

        fecthLoggedInUserData();
        fetchChats()

        const socket = new WebSocket('ws://localhost:3001');
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('WebSocket Connected');
        }

        socket.onmessage = (event) => {
            if (event.data instanceof Blob) {
                const reader = new FileReader();

                reader.onload = () => {
                    try {
                        const data = JSON.parse(reader.result as string);

                        if (data.type === 'message') {
                            fetchChats()
                        }
                    } catch (error) {
                        console.error('Error parsing data:', error);
                    }
                };

                reader.readAsText(event.data);
            } else {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'message') {
                        fetchChats();
                    }
                } catch (error) {
                    console.error('Error parsing data:', error);
                }
            }
        }

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        }

        socket.onclose = () => {
            console.log('WebSocket Disconnected');
        }

        return () => {
            if (socketRef.current) socketRef.current.close();
        }
    }, []);

    return (
        <Card className="flex flex-col h-screen items-center max-w-full max-h-full overflow-y-auto">
            <CardHeader className="flex items-center justify-center">
                <p className="font-extrabold text-5xl mt-4 mb-4">Listado de chats</p>
            </CardHeader>
            <CardBody className="flex flex-col items-center overflow-y-auto">
                {chats && chats.length > 0 ? (
                    chats.map((username, index) => (
                        <Link key={index} href={`/home/chat/${username}`} className="flex items-center justify-center flex-col w-1/2 p-4 my-4 border-gray-400 border-1 rounded-2xl">
                            <div className="flex flex-col items-center justify-center">
                                Chat con <p className="font-bold text-xl">{username}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="flex items-center justify-center">
                        <p className="text-2xl">Actualmente no tienes ningún chat abierto... ¡busca publicaciones de ayuda y conoce a tu comunidad!</p>
                    </div>
                )}
            </CardBody>
        </Card>
    )
}