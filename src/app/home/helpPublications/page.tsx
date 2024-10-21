'use client'

import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/react";
import {GrFormEdit, GrFormTrash, GrMultiple, GrNewWindow, GrSearch} from "react-icons/gr";
import Link from "next/link";
import {HelpPublication, User} from "@/app/utils/lib/definitions";
import {FormEvent, useEffect, useState} from "react";
import {getHelpPublicationBySearchFilter, getLoggedInUserData, getUserData} from "@/app/utils/lib/routes";

export default function HelpPublications() {
    const [loggedInUserData, setLoggedInUserData] = useState<User | null>(null);
    const [helpPublicationList, setHelpPublicationList] = useState<HelpPublication[] | null>(null);

    async function getHelpPublicationListBySearchFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget);
        let username = formData.get('username') as string;
        let title = formData.get('title') as string;
        let tags = formData.get('tags') as string;
        let initialDate = formData.get('initialDate') as string;
        let finalDate = formData.get('finalDate') as string;

        if(title === '' && tags === '' && initialDate === '' && finalDate === '' && username === '') alert('Debe rellenar al menos un campo para realizar la búsqueda');
        else {
            const response = await getHelpPublicationBySearchFilter(username, title, tags, initialDate, finalDate);

            if (response) {
                setHelpPublicationList(response);
            } else {
                alert('Ha habido un error al buscar las publicaciones de ayuda, inténtelo de nuevo');
                setHelpPublicationList(null);
            }
        }
    }

    async function getLoggedInUserHelpPublications(){
        const response = await getHelpPublicationBySearchFilter(loggedInUserData?.username as string, '', '', '', '');

        if (response) {
            setHelpPublicationList(response);
        } else {
            alert('Ha habido un error al buscar las publicaciones de ayuda, inténtelo de nuevo');
            setHelpPublicationList(null);
        }
    }

    useEffect(() => {
        async function fetchLoggedInUserData() {
            const data = await getLoggedInUserData();
            setLoggedInUserData(data);
        }

        fetchLoggedInUserData();
    }, []);

    return (
        <Card className="flex flex-col h-screen items-center max-w-full max-h-full overflow-auto">
            <CardHeader className="flex flex-col items-center">
                <h1 className="font-extrabold text-3xl">Publicaciones de ayuda</h1>
            </CardHeader>
            <CardBody className="flex flex-row">
                <div className="flex flex-col w-full mr-6">
                    {(helpPublicationList?.length!! > 0) && helpPublicationList?.map((helpPublication, index) => (
                        <div key={index} className="flex flex-col border-2 border-gray-200 rounded-lg p-2 my-2">
                            <div className="flex flex-row">
                                <Link className="w-full" href={`/home/helpPublications/${helpPublication.id}`}>
                                    <div className="flex flex-row w-full">
                                        {helpPublication?.helperUsername && (
                                            <h1 className="text-xl font-bold mb-4 mr-2 text-emerald-500">[CERRADO]</h1>
                                        )}
                                        <p className="text-xl font-bold mb-4">{helpPublication.title}</p>
                                    </div>
                                    <p className="flex flex-row ml-auto">
                                        Publicada por @{helpPublication.userUsername}
                                    </p>
                                    <p className="flex flex-row ml-auto">
                                        Fecha: {new Date(helpPublication?.publicationDate as string).toLocaleString()}
                                    </p>
                                    <p className="flex flex-row ml-auto">
                                        Tags: {helpPublication.tags?.toString().split(',').join(' - ')}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    ))}
                    {(helpPublicationList?.length!! <= 0) && <p className="flex flex-row items-center justify-center mt-6 text-lg">No se han encontrado publicaciones de ayuda. Pruebe con otros parámetros de búsqueda</p>}
                    {(helpPublicationList === null) && <div className="flex flex-row items-center justify-center mt-6 text-lg">Bienvenido al apartado de Publicaciones de ayuda. Realice una
                        <p className="flex mx-1 font-bold">búsqueda</p> para encontrar publicaciones o <p className="flex mx-1 font-bold">crea una nueva.</p></div>}
                </div>
                <div className="flex h-full px-3 flex-col w-80 ml-auto">
                    <div className="flex flex-row justify-between md:flex-col">
                        <div className="mr-auto border-l-2 border-gray-500 h-full"></div>
                        <Link className="flex justify-center" href="/home/helpPublications/new">
                            <Button
                                className="flex bg-emerald-600 text-xl font-bold text-white border-black border-2 p-10">
                                Crear publicación de ayuda
                            </Button>
                        </Link>
                        <Button
                            className="flex bg-blue-400 text-lg font-bold text-white border-black border-2 p-8 mt-4"
                            onPress={getLoggedInUserHelpPublications}>
                            <GrMultiple/>
                            Ver tus publicaciones de ayuda
                        </Button>
                        <form onSubmit={getHelpPublicationListBySearchFilters}>
                            <label className="flex justify-center underline font-bold text-2xl mt-10">Filtros de
                                búsqueda</label>
                            <div className="mt-4">
                                Nombre de usuario <Input placeholder="Nombre de usuario" name="username" type="text"/>
                            </div>
                            <div className="mt-4">
                                Título <Input placeholder="Título" name="title" type="text"/>
                            </div>

                            <div className="mt-4">
                                Tags <Input placeholder="tag1, tag2, tag3..." name="tags" type="text"/>
                            </div>

                            <div className="mt-4">
                                Fecha de inicio <Input placeholder="Fecha" name="initialDate" type="date"/>
                            </div>

                            <div className="mt-4">
                                Fecha de fin <Input placeholder="Fecha" name="finalDate" type="date"/>
                            </div>

                            <div className="flex flex-col items-center justify-center mt-6">
                                <Button type="submit"
                                        className="flex bg-blue-600 text-white text-lg font-bold border-black border-2 w-36">
                                    <GrSearch/>
                                    Buscar
                                </Button>
                            </div>
                        </form>

                    </div>
                </div>
            </CardBody>
        </Card>
    )
}