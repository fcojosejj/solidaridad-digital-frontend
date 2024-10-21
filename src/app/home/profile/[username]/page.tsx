'use client'

import React from "react";
import {FormEvent, useEffect, useState} from "react";
import {User} from "@/app/utils/lib/definitions";
import {
    deleteRating,
    getLoggedInUserData,
    getUserData, rateUser,
} from "@/app/utils/lib/routes";
import {useParams, useRouter} from "next/navigation";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import {
    GrCalendar,
    GrTroubleshoot,
    GrMailOption,
    GrPhone,
    GrLike,
    GrFormTrash,
    GrMail,
    GrUserSettings
} from "react-icons/gr";
import Link from "next/link";

// @ts-ignore
import ReactStars from 'react-stars';

export default function Profile() {
    const router = useRouter();
    const {username} = useParams();
    const [userData, setUserData] = useState<User | null>(null);
    const [loggedInUserData, setLoggedInUserData] = useState<User | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [showButtons, setShowButtons] = useState(false);
    const [showRateButton, setShowRateButton] = useState(false);
    const maxMessageLength = 128;

    async function handleRateUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const description = formData.get('message') as string

        const response = await rateUser(userData?.username!!, rating, description);

        if (response) {
            setUserData(response);
        } else alert('Error al valorar al usuario. Recuerde seleccionar una puntuación e inténtelo de nuevo.');


    }

    async function handleDeleteRating(ratingId: number, username: string) {
        if (confirm('¿Estás seguro de que deseas eliminar esta valoración? Esta acción no se puede deshacer.')) {
            const response = await deleteRating(ratingId, username);

            if (response) {
                window.location.reload();
            } else alert('Error al eliminar la valoración. Inténtelo de nuevo.');
        }
    }

    useEffect(() => {
        async function fetchUserData() {
            const data = await getUserData(username as string);
            if (data) setUserData(data);
            else {
                router.back();
            }
        }

        async function fecthLoggedInUserData() {
            const data = await getLoggedInUserData();
            setLoggedInUserData(data);
        }

        fetchUserData();
        fecthLoggedInUserData();
    }, [username]);

    useEffect(() => {
        if (userData && loggedInUserData && userData.username === loggedInUserData.username) {
            setShowButtons(true);
        } else if (!userData && loggedInUserData) {
            setShowButtons(false);
        }

        if (userData?.username && loggedInUserData?.username && userData.username !== loggedInUserData.username && userData.ratings?.filter(rating => rating.ratedByUsername === loggedInUserData.username).length === 0) {
            setShowRateButton(true);
        } else setShowRateButton(false);

    }, [userData, loggedInUserData]);

    useEffect(() => {
        if (userData?.ratings?.length!! > 0) {
            let sum = 0;
            userData?.ratings?.forEach(rating => {
                sum += rating.rating!!;
            });
            setAverageRating(sum / userData?.ratings?.length!!);
        }
    }, [userData]);

    return (
        userData && (
            <Card className="flex flex-col h-screen items-center max-w-full max-h-full overflow-y-auto">
                <p className="font-extrabold text-5xl mt-4 mb-4">Perfil</p>
                <div className="flex flex-row justify-center items-center h-full w-full">
                    <Card
                        className="flex flex-col justify-center items-center h-3/4 w-1/2 p-6 mx-8 my-16 overflow-auto">
                        {userData && (
                            <div className="text-left flex flex-col">
                                <p className="font-bold text-4xl underline mb-2">{userData.name} {userData.surname}</p>
                                <p className="font-bold text-2xl">@{userData.username}</p>
                                <p className="flex flex-row items-center font-bold text-xl mt-6">
                                    <GrMailOption className="mr-5"/> {userData.email}</p>
                                <p className="flex flex-row items-center font-bold text-xl">
                                    <GrPhone className="mr-5"/> {userData.phone}</p>
                                <p className="flex flex-row items-center font-bold text-xl">
                                    <GrCalendar className="mr-5"/> {new Date(userData.birthdate!!).toLocaleDateString()}
                                </p>
                                <p className="flex flex-row items-center font-bold text-xl">
                                    <GrLike className="mr-5"/> {userData.aidsCompleted?.length} ayuda(s) completadas.
                                </p>

                                <div className="flex flex-row justify-center items-center h-full w-1/2 mt-6">
                                    {showButtons && userData ? (
                                        <>
                                            <Link href={`/home/profile/${userData.username}/edit`}>
                                                <Button className="bg-amber-300 text-black font-bold">
                                                    <GrUserSettings size={20}/>
                                                    Editar información personal
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Link href={`/home/chat/${userData.username}`}>
                                            <Button className="bg-sky-400 text-black font-bold">
                                                <GrMail size={24}/>
                                                Ir al chat
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>
                    <Card
                        className="flex flex-col justify-center items-center h-3/4 w-1/2 mr-8 p-4 overflow-y-auto">
                        <CardHeader className="flex flex-col">
                            <p className="font-bold text-2xl underline mb-2">Valoraciones</p>
                            <div className="flex flex-row w-full items-center justify-center">
                                <p>Valoración media: {averageRating.toFixed(1)}</p>
                                <ReactStars className="mx-4"
                                            count={5}
                                            size={36}
                                            half={true}
                                            edit={false}
                                            value={averageRating}
                                />
                                <p className="ml-6">{userData.ratings?.length} valoracion(es)</p>

                            </div>
                            <hr className="flex border-gray-200 w-full my-4"></hr>
                        </CardHeader>
                        <CardBody className="max-h-96 min-h-64 w-full overflow-y-auto">
                            {showRateButton && userData && loggedInUserData && (
                                <form onSubmit={handleRateUser}
                                      className="flex flex-col h-auto items-center justify-center w-full">
                                    <p className="flex underline mb-4">Añade una valoración</p>
                                    <textarea name="message"
                                              className="flex bg-gray-100 border-black border-1 w-full mx-2 p-2"
                                              placeholder="Escribe un comentario... máx 128 caracteres"
                                              maxLength={maxMessageLength}
                                    />
                                    <div className="flex flex-row items-center mt-2">
                                        <ReactStars name="stars" className="mx-4"
                                                    count={5}
                                                    size={36}
                                                    half={false}
                                                    onChange={(value: number) => setRating(value)}
                                                    value={rating}
                                        />
                                        <Button type="submit" className="ml-8 bg-amber-300 text-black font-bold">
                                            Valorar
                                        </Button>
                                    </div>

                                    <hr className="flex flex-col border-gray-200 w-full my-4"></hr>
                                </form>
                            )}
                            {userData && userData.ratings?.map((rating, index) => (
                                <div key={index}
                                     className="flex flex-col w-full my-2 p-4 my-4border-gray-400 border-1 rounded-2xl">
                                    <div className="flex flex-row">
                                        <Link href={`/home/profile/${rating.ratedByUsername}`}
                                              className="text-sky-400 underline">@{rating.ratedByUsername}</Link>
                                        {loggedInUserData?.username && rating.ratedByUsername!! && (loggedInUserData?.username === rating.ratedByUsername!!) && (
                                            <Button className="bg-red-700 text-white ml-auto"
                                                    onPress={() => handleDeleteRating(rating.id!!, userData?.username!!)}>
                                                <GrFormTrash size={20}/>
                                            </Button>
                                        )}
                                    </div>

                                    <ReactStars
                                        count={5}
                                        size={28}
                                        half={true}
                                        edit={false}
                                        value={rating.rating}
                                    />

                                    <p className="underline my-2">Comentario:</p>
                                    <p>{rating.message}</p>
                                </div>
                            ))}
                        </CardBody>
                    </Card>

                </div>
            </Card>
        )
    )
}