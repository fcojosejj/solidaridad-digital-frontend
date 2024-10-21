'use client'

import {useParams, useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import {HelpPublication, User} from "@/app/utils/lib/definitions";
import {
    confirmAid,
    createComment,
    deleteComment,
    deleteHelpPublication,
    getHelpPublication,
    getLoggedInUserData,
    updateComment
} from "@/app/utils/lib/routes";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import Link from "next/link";
import Image from "next/image";
import {
    GrEdit,
    GrFormCheckmark,
    GrFormEdit,
    GrFormTrash,
    GrRevert,
    GrTrash, GrValidate
} from "react-icons/gr";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/react";

export default function HelpPublicationPage() {
    const router = useRouter();
    const {id} = useParams();
    const [helpPublicationData, setHelpPublicationData] = useState<HelpPublication | null>(null);
    const [loggedInUserData, setLoggedInUserData] = useState<User | null>(null);
    const [showButtons, setShowButtons] = useState(false);
    const [showEditCommentButton, setShowEditCommentButton] = useState(true);
    const [formatedDate, setFormatedDate] = useState("");
    const [formatedEditDate, setFormatedEditDate] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [newComment, setNewComment] = useState<string>("");
    const [newCommentId, setNewCommentId] = useState<number | null>(null);

    async function handleDelete() {
        if (confirm('¿Estás seguro de que quieres eliminar esta publicación de ayuda?')) {
            const response = await deleteHelpPublication(helpPublicationData?.id as number);

            if (response) {
                alert('Publicación de ayuda eliminada con éxito');
                router.push('/home/helpPublications');
            } else {
                return null;
            }
        }
    }

    async function handleComment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const text = formData.get('text') as string;

        const newErrors: { [key: string]: string } = {}

        if (!text) newErrors.text = 'El comentario no puede estar vacío';
        else if (text.length < 4) newErrors.text = 'El comentario es demasiado corto, debe tener al menos 4 caracteres';
        else if (text.length > 512) newErrors.text = 'El comentario es demasiado largo, debe tener como máximo 512 caracteres';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const response = await createComment(text as string, helpPublicationData?.id as number);

        if (response) {
            alert('Comentario añadido con éxito');
            window.location.reload()
        } else {
            setErrors({comment: 'Ha ocurrido un error al añadir el comentario. Inténtelo de nuevo.'})
            window.location.reload()
        }
    }

    async function handleDeleteComment(commentId: number) {
        if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            const response = await deleteComment(commentId, helpPublicationData?.id as number);

            if (response) {
                alert('Comentario eliminado con éxito');
                window.location.reload()
            } else {
                return null;
            }
        }
    }

    async function handleEditComment(event: FormEvent<HTMLFormElement>, commentId: number) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const newText = newComment;

        const newErrors: { [key: string]: string } = {}
        if (!newText) newErrors.newText = 'El comentario no puede estar vacío';
        else if (newText.length < 4) newErrors.newText = 'El comentario es demasiado corto, debe tener al menos 4 caracteres';
        else if (newText.length > 512) newErrors.text = 'El comentario es demasiado largo, debe tener como máximo 512 caracteres';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const response = await updateComment(commentId as number, newText as string, helpPublicationData?.id as number);

        if (response) {
            alert('Comentario editado con éxito');
            setShowEditCommentButton(!showEditCommentButton)
            window.location.reload()
        } else {
            setShowEditCommentButton(!showEditCommentButton)
            return null;
        }
    }

    async function  handleConfirmAid(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const username = formData.get('username') as string

        confirm('¿Estás seguro de que quieres confirmar la ayuda de este usuario? La publicación se cerrará y no se podrá volver a editar.')
        const response = await confirmAid(username, helpPublicationData?.id!! as unknown as string)

        if(response){
            alert('Ayuda confirmada con éxito')
            window.location.reload()
        } else {
            alert('Ha habido un error. Recuerde introducir un nombre de usuario válido')
            return null
        }
    }

    useEffect(() => {
        async function fetchHelpPublicationData() {
            const data = await getHelpPublication(id as string);
            if (data) setHelpPublicationData(data);
            else {
                router.back();
            }
        }

        async function fetchLoggedInUserData() {
            const data = await getLoggedInUserData();
            setLoggedInUserData(data);
        }

        fetchHelpPublicationData();
        fetchLoggedInUserData();

    }, []);

    useEffect(() => {
        if (helpPublicationData && loggedInUserData && helpPublicationData.userUsername === loggedInUserData.username) {
            setShowButtons(true);
        } else if (!helpPublicationData && loggedInUserData) {
            setShowButtons(false);
        }
    }, [helpPublicationData, loggedInUserData]);

    useEffect(() => {
        setFormatedDate(new Date(helpPublicationData?.publicationDate as string).toLocaleString());
        if (helpPublicationData?.editDate) setFormatedEditDate(new Date(helpPublicationData?.editDate as string).toLocaleString());
    }, [helpPublicationData]);


    return (
        helpPublicationData && (
            <Card className="flex flex-col h-auto items-center">
                <CardHeader className="flex flex-row">
                    {helpPublicationData?.helperUsername && (
                        <h1 className="font-bold text-3xl text-emerald-500">[CERRADO]</h1>
                    )}
                    <h1 className="font-bold text-3xl ml-4">{helpPublicationData?.title}</h1>
                    <div className="ml-auto flex">
                        {(helpPublicationData.userUsername === loggedInUserData?.username) && (helpPublicationData.helperUsername === null) &&(
                            <form className="flex flex-row mr-8" onSubmit={handleConfirmAid}>
                                <p className="flex flex-row w-[240px] items-center font-bold">Confirmar ayuda:</p>
                                <Input className="flex w-full" name="username"
                                       placeholder="Nombre de usuario..."></Input>
                                <Button className="bg-sky-400 min-w-[15px] mx-2" type="submit" onPress={() => handleConfirmAid}>
                                    <GrValidate size={30}/>
                                </Button>
                            </form>
                        )}
                        {showButtons && (
                            <>
                                <Link href={`/home/helpPublications/${helpPublicationData?.id}/edit`}>
                                    <Button className="bg-amber-300 min-w-[15px] mx-2">
                                        <GrEdit size={20}/>
                                    </Button>
                                </Link>
                                <Button className="bg-red-700 min-w-[15px] text-white" onPress={handleDelete}>
                                    <GrTrash size={20}/>
                                </Button>
                            </>
                        )}
                    </div>
                </CardHeader>
                <CardBody>
                {helpPublicationData && (
                    <div className="flex flex-col w-auto h-auto mx-4">
                        <p className="flex flex-row mt-2">
                            Creada por
                            <Link href={`/home/profile/${helpPublicationData.userUsername}`}>
                                <p className="text-sky-400 underline ml-1">@{helpPublicationData.userUsername}</p>
                            </Link>
                        </p>
                        {helpPublicationData.helperUsername && (
                            <p className="flex flex-row mt-2">
                                Publicación de ayuda resuelta por
                                <Link href={`/home/profile/${helpPublicationData.helperUsername}`}>
                                    <p className="text-sky-400 underline ml-1">@{helpPublicationData.helperUsername}</p>
                                </Link>
                            </p>
                        )}
                        <div className="flex flex-row mt-2">
                            <p>Publicado el {formatedDate}</p>
                            {formatedEditDate && (<p className="mx-6">Editado el {formatedEditDate}</p>)}
                        </div>
                        <p className="my-2">Tags: {helpPublicationData.tags?.toString().split(',').join(', ')}</p>
                        <p className="text-lg my-4 underline">Descripción:</p>
                        <p className="mb-4 mx-2"
                           dangerouslySetInnerHTML={{__html: helpPublicationData?.description!!.replace(/\r\n/g, '<br />')}}/>
                        <div className="flex flex-col items-center justify-center w-full">
                            {helpPublicationData.media && helpPublicationData.media.map((mediaItem, index) => (
                                mediaItem[0] === '/' || mediaItem[0] === 'i' ? (
                                    <Image className="my-2" key={index} width={720} height={720}
                                           src={`data:image/jpeg;base64,${mediaItem}`} alt="Help Publication Image"/>
                                ) : mediaItem[0] === 'A' ? (
                                    <video key="index" controls>
                                        <source src={`data:video/mp4;base64,${mediaItem}`} type="video/mp4"/>
                                        Este navegador no soporta el tipo de archivo indicado.
                                    </video>
                                ) : mediaItem[0] === 'J' ? (
                                    <embed key={index} src={`data:application/pdf;base64,${mediaItem}`} width="720"
                                           height="1024" type="application/pdf"/>
                                ) : null
                            ))}
                            <hr className="border-gray-200 w-full my-2"/>
                        </div>
                    </div>
                )}
                </CardBody>
                {(helpPublicationData.helperUsername === null) && (
                    <form className="mt-6 w-full" onSubmit={handleComment}>
                        <div className="flex flex-col mx-4">
                            <h3 className="font-bold">Añade un comentario</h3>
                            <textarea className="w-full h-24 border-2 border-gray-200 rounded-lg p-2" name="text"
                                      placeholder="Escribe un comentario..."/>
                            {errors.text && <p className="text-red-500">{errors.text}</p>}
                            {errors.comment && <p className="text-red-500">{errors.comment}</p>}
                            <Button className="bg-sky-400 text-white mx-auto my-2 w-[124px]" type="submit">
                                Comentar
                            </Button>
                        </div>
                    </form>
                )}
                <CardFooter>
                    <div className="flex flex-col py-6 mx-4 w-full">
                        <h1 className="font-bold text-2xl">Comentarios - {helpPublicationData.comments?.length}</h1>
                        {helpPublicationData.comments && helpPublicationData.comments.map((comment, index) => (
                            <div key={index} className="flex flex-col border-2 border-gray-200 rounded-lg p-2 my-2">
                                <div className="flex flex-row">
                                    <Link href={`/home/profile/${comment.userUsername}`}>
                                        <p className="text-sky-400 underline">@{comment.userUsername}</p>
                                    </Link>
                                    <div className="flex flex-row ml-auto">
                                        {(loggedInUserData?.username === comment.userUsername) && (
                                            <>
                                                {showEditCommentButton && (
                                                    <Button className="flex bg-amber-300 mx-2"
                                                            onPress={() => {
                                                                setShowEditCommentButton(false)
                                                                setNewComment(comment.text!!)
                                                                setNewCommentId(comment.id!!)
                                                            }
                                                            }>
                                                        <GrFormEdit size={20}/>
                                                    </Button>
                                                )}
                                                <Button className="bg-red-700 text-white"
                                                        onPress={(e) => handleDeleteComment(comment.id!!)}>
                                                    <GrFormTrash size={20}/>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <p className="mb-4">{new Date(comment.publicationDate!!).toLocaleString()}</p>
                                    {comment.editDateTime && (<p className="mx-6">Editado
                                        el {new Date(comment.editDateTime).toLocaleString()}</p>)}
                                </div>

                                {newCommentId === comment.id ? (
                                    <form onSubmit={(e) => handleEditComment(e, comment.id!!)}>
                                        <input name="newText" className="flex border-gray-400 border-1 w-full"
                                               disabled={showEditCommentButton}
                                               value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                                        {errors.newText && <p className="text-red-500">{errors.newText}</p>}

                                        {!showEditCommentButton && (loggedInUserData?.username === comment.userUsername) && (
                                            <>
                                                <p className="flex"></p>
                                                <div className="flex ml-auto mt-4">
                                                    <Button className="flex flex-row bg-emerald-500 mx-2" type="submit">
                                                        <GrFormCheckmark size={20}/>
                                                    </Button>
                                                    <Button className="flex flex-row bg-gray-300 mx-2"
                                                            onPress={() => {
                                                                setShowEditCommentButton(true)
                                                                window.location.reload()
                                                            }
                                                    }>
                                                        <GrRevert size={20}/>
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </form>
                                ) : (
                                    <p>{comment.text}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </CardFooter>
            </Card>
        )
    )
}