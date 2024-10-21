'use client'

import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {useParams, useRouter} from "next/navigation";
import {FormEvent, useEffect, useRef, useState} from "react";
import {getChat, getLoggedInUserData, getUserData, sendMessage} from "@/app/utils/lib/routes";
import {router} from "next/client";
import {Message, User} from "@/app/utils/lib/definitions";
import {Button} from "@nextui-org/button";
import {GrSend} from "react-icons/gr";
import Link from "next/link";

export default function Chat() {
    const router = useRouter();
    const {username} = useParams();
    const [loggedInUserData, setLoggedInUserData] = useState<User | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [chat, setChat] = useState<Message[] | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [text, setText] = useState("");

    function handleOnEnter(text: any) {
        console.log("enter", text);
    }


    function formatDate(isoString: string): string {
        const date = new Date(isoString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-ES', options);
    }

    async function fetchChat() {
        const data = await getChat(username as string);
        setChat(data);
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo(
                {
                    top: chatContainerRef.current.scrollHeight,
                    behavior: 'smooth'
                }
            );
        }
    }

    async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const message = data.get('message') as string;

        const response = await sendMessage(username as string, message as string);

        if (response) {
            await fetchChat();
            if (textareaRef.current) textareaRef.current.value = '';

            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({ type: `message`, message}));
            }
        } else window.alert('Error al enviar el mensaje');

    }

    useEffect(() => {
        async function fetchLoggedInUserData() {
            const data = await getLoggedInUserData();
            setLoggedInUserData(data);
        }

        async function fetchUserData() {
            const data = await getUserData(username as string);
            if (!data) {
                router.back();
            }
            setUserData(data);
        }

        fetchUserData()
        fetchLoggedInUserData();
        fetchChat();

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
                            fetchChat()
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
                        fetchChat();
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
                <Link href={`/home/profile/${username}`}>
                    <p className="font-extrabold text-5xl mt-4 mb-4 hover:text-sky-400 hover:underline">@{username}</p>
                </Link>
            </CardHeader>
            <CardBody className="flex flex-col items-center overflow-y-auto">
                {chat && chat.length > 0 && chat.map((message, index) => (
                    <div key={index} ref={chatContainerRef}
                         className={`flex flex-col items-${message.senderUsername === loggedInUserData?.username ? 'end ml-20' : 'start mr-20'} w-3/4 p-4 my-4 border-gray-400 border-1 rounded-2xl`}>
                        <p className="text-lg">{message.message}</p>
                        <div className="text-sm mt-2">
                            <p>{formatDate(message.date!!)}</p>
                        </div>
                    </div>
                ))}
            </CardBody>
            <CardFooter className="min-h-[150px]">
                <form className="flex flex-row w-full items-center justify-center" onSubmit={handleSendMessage}>
                    <div className="flex flex-row w-full items-center justify-center">
                        <textarea placeholder="Escribe un mensaje..." name="message" ref={textareaRef}
                                  className="w-1/2 p-4 my-4 border-gray-400 border-1 bg-gray-200 h-[64px] max-h-[124px] min-h-[64px]"/>
                        <Button className="bg-blue-500 text-white p-4 my-4 border-gray-400 border-1 rounded-2xl ml-6" type="submit">
                            <GrSend/> Enviar</Button>
                    </div>
                </form>
            </CardFooter>
        </Card>
    )
}