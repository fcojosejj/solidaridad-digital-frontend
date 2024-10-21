'use client'

import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {GrNewWindow} from "react-icons/gr";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {createHelpPublication} from "@/app/utils/lib/routes";

export default function CreateHelpPublication(){
    const router = useRouter();
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const maxDescriptionLength = 1024;
    const maxFileSize = 15 * 1024 * 1024;

    async function handleSubmitHelpPublication(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const title = formData.get('title') as string
        const media = (formData.getAll('media') as File[]).filter(file => file.size <= maxFileSize);
        const tags = formData.get('tags') as string

        const newErrors: { [key: string]: string } = {}

        if (!title) newErrors.title = 'El título es obligatorio'
        else if (title.length < 2) newErrors.title = 'El título es demasiado corto, debe tener al menos 2 caracteres'
        else if (title.length > 64) newErrors.title = 'El título es demasiado largo, debe tener como máximo 64 caracteres'

        if (!description) newErrors.description = 'La descripción es obligatoria'
        else if (description.length < 16) newErrors.description = 'La descripción es demasiado corta, debe tener al menos 16 caracteres'

        const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf']
        if (media[0].size > 0){
            if(media.some(file => !allowedTypes.includes(file.type))) newErrors.media = 'El formato de archivo no es válido'
            const totalMediaSize = media.reduce((acc, file) => acc + file.size, 0)
            if(media.some(file => file.size >= maxFileSize)) newErrors.media = 'El archivo es demasiado grande (máx. 15MB)'
            else if (totalMediaSize > maxFileSize) newErrors.media = 'El tamaño total de los archivos supera el límite (máx. 15MB)'
        }

        if (!tags) newErrors.tags = 'Los tags son obligatorios'
        else if (tags.split(',').length < 3) newErrors.tags = 'Debes añadir al menos tres tags'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const response = await createHelpPublication(title, description, media, tags);

        if (response) {
            alert('Publicación de ayuda creada con éxito')
            router.push(`/home/helpPublications/${response.id}`);
        } else {
            setErrors({publication: 'Ha ocurrido un error al crear la publicación de ayuda. Inténtelo de nuevo.'})
            window.location.reload()
        }
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>){
        if (e.target.value.length <= maxDescriptionLength) setDescription(e.target.value);
    }

    return(
        <Card className="flex flex-col h-screen items-center max-w-full max-h-full">
            <CardHeader className="flex flex-col items-center">
                <h1 className="font-extrabold text-3xl">Nueva publicación de ayuda</h1>
            </CardHeader>
            <CardBody className="flex justify-center w-full">
                <form onSubmit={handleSubmitHelpPublication} className="flex flex-col w-86">
                    <h2 className="text-2xl">Título</h2>
                    <Input className="py-2 mb-2" type="text" name="title" placeholder="Título de la publicación de ayuda."/>
                    {errors.title && <p className="text-red-500">{errors.title}</p>}

                    <h2 className="text-2xl">Descripción</h2>
                    <textarea className="flex py-2 bg-gray-100 rounded-2xl min-h-64 mb-2 p-2" name="description" placeholder="  Descripción"
                    value={description} onChange={handleDescriptionChange}/>
                    <p className="text-right text-gray-400">{description.length}/{maxDescriptionLength}</p>
                    {errors.description && <p className="text-red-500">{errors.description}</p>}

                    <h2 className="text-2xl">Adjuntar multimedia (tamaño máx. 15MB)</h2>
                    <Input className="py-2 mb-2" type="file" name="media" accept=".jpg, .jpeg, .png, .mp4, .pdf" multiple/>
                    {errors.media && <p className="text-red-500">{errors.media}</p>}

                    <h2 className="text-2xl">Tags (separadas por comas)</h2>
                    <Input className="py-2 mb-2" type="text" name="tags" placeholder="tag1, tag2, tag3... mínimo 3 tags"/>
                    {errors.tags && <p className="text-red-500">{errors.tags}</p>}

                    <CardFooter className="flex flex-col items-center">
                        {errors.publication && <p className="text-red-500">{errors.publication}</p>}
                        <Button className="bg-white text-black text-lg border-black border-1.5 mt-4"
                                type="submit">
                            <GrNewWindow/>
                            Crear publicación de ayuda</Button>
                    </CardFooter>
                </form>
            </CardBody>
        </Card>
    )
}