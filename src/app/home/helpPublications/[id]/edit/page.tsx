'use client'

import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {GrFormEdit} from "react-icons/gr";
import {useParams, useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import {getHelpPublication, updateHelpPublication} from "@/app/utils/lib/routes";
import {HelpPublication} from "@/app/utils/lib/definitions";

export default function EditHelpPublication() {
    const router = useRouter();
    const {id} = useParams();
    const [helpPublicationData, setHelpPublicationData] = useState<HelpPublication | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const maxDescriptionLength = 1024;

    useEffect(() => {
        async function fetchHelpPublicationData() {
            const data = await getHelpPublication(id as string);
            if (data) {
                setHelpPublicationData(data);
                setTitle(data.title);
                setDescription(data.description);
                setTags(data.tags.join(", "));
            } else {
                router.back();
            }
        }

        fetchHelpPublicationData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "title") setTitle(value);
        if (name === "description") setDescription(value);
        if (name === "tags") setTags(value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= maxDescriptionLength) setDescription(e.target.value);
    };

    async function handleUpdateHelpPublication(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newErrors: { [key: string]: string } = {};

        if (!title) newErrors.title = 'El título es obligatorio';
        else if (title.length < 2) newErrors.title = 'El título es demasiado corto';
        else if (title.length > 64) newErrors.title = 'El título es demasiado largo';

        if (!description) newErrors.description = 'La descripción es obligatoria';
        else if (description.length < 16) newErrors.description = 'La descripción es demasiado corta';

        if (!tags) newErrors.tags = 'Los tags son obligatorios';
        else if (tags.split(',').length < 3) newErrors.tags = 'Debes añadir al menos tres tags';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const response = await updateHelpPublication(helpPublicationData?.id, title, description, tags.split(',').map(tag => tag.trim()));

        if (response) {
            alert('Publicación de ayuda actualizada con éxito');
            router.push(`/home/helpPublications/${response.id}`);
        } else {
            setErrors({ publication: 'Ha ocurrido un error al actualizar la publicación de ayuda. Inténtelo de nuevo.' });
            router.refresh();
        }
    }

    return (
        helpPublicationData && (
            <Card className="flex flex-col h-screen items-center max-w-full max-h-full">
                <CardHeader className="flex flex-col items-center">
                    <h1 className="font-extrabold text-3xl">Editar publicación de ayuda</h1>
                </CardHeader>
                <CardBody className="flex justify-center w-full">
                    <form onSubmit={handleUpdateHelpPublication} className="flex flex-col w-86">
                        <h2 className="text-2xl">Título</h2>
                        <Input className="py-2 mb-2" value={title} type="text" name="title" placeholder="Título de la publicación de ayuda." onChange={handleInputChange} />
                        {errors.title && <p className="text-red-500">{errors.title}</p>}

                        <h2 className="text-2xl">Descripción</h2>
                        <textarea className="flex py-2 bg-gray-100 rounded-2xl min-h-64 mb-2" name="description" placeholder="Descripción" value={description} onChange={handleDescriptionChange} />
                        <p className="text-right text-gray-400">{description.length}/{maxDescriptionLength}</p>
                        {errors.description && <p className="text-red-500">{errors.description}</p>}

                        <h2 className="text-2xl">Tags (separadas por comas)</h2>
                        <Input className="py-2 mb-2" value={tags} type="text" name="tags" placeholder="tag1, tag2, tag3..." onChange={handleInputChange} />
                        {errors.tags && <p className="text-red-500">{errors.tags}</p>}

                        <CardFooter className="flex flex-col items-center">
                            {errors.publication && <p className="text-red-500">{errors.publication}</p>}
                            <Button className="bg-emerald-400 text-black font-bold" type="submit">
                                <GrFormEdit size={24} />
                                Guardar cambios
                            </Button>
                        </CardFooter>
                    </form>
                </CardBody>
            </Card>
        )
    );
}