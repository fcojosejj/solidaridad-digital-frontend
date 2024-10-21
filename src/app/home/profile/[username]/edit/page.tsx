'use client'

import {FormEvent, useEffect, useState} from "react";
import {User} from "@/app/utils/lib/definitions";
import {
    deleteUser,
    getLoggedInUserData,
    getUserData, updatePassword,
    updateUser
} from "@/app/utils/lib/routes";
import {useParams, useRouter} from "next/navigation";
import {Card, CardBody} from "@nextui-org/card";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {GrFormEdit, GrFormLock, GrFormTrash, GrTrash} from "react-icons/gr";

export default function Profile() {
    const router = useRouter();
    const {username} = useParams();
    const [userData, setUserData] = useState<User | null>(null);
    const [loggedInUserData, setLoggedInUserData] = useState<User | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    async function handleUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const dni = userData?.dni
        const name = formData.get('name') as string
        const surname = formData.get('surname') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string
        const birthdate = formData.get('birthdate') as string

        const newErrors: { [key: string]: string } = {}

        const phoneRegex = /(\+34|0034|34)?[6789]\d{8}$/

        if (!name) newErrors.name = 'El nombre es obligatorio'
        else if (name.length < 2) newErrors.name = 'El nombre es demasiado corto'
        else if (name.length > 20) newErrors.name = 'El nombre es demasiado largo'

        if (!surname) newErrors.surname = 'Los apellidos son obligatorios'
        else if (surname.length < 2) newErrors.surname = 'Los apellidos son demasiado cortos'
        else if (surname.length > 65) newErrors.surname = 'Los apellidos son demasiado largos'

        if (!username) newErrors.username = 'El nombre de usuario es obligatorio'
        else if (username.length < 2) newErrors.username = 'El nombre de usuario es demasiado corto'
        else if (username.length > 10) newErrors.username = 'El nombre de usuario es demasiado largo'

        if (!email) newErrors.email = 'El email es obligatorio'
        else if (!email.includes('@')) newErrors.email = 'El email no es válido'

        if (!phone) newErrors.phone = 'El teléfono es obligatorio'
        else if (!phoneRegex.test(phone)) newErrors.phone = 'El teléfono no es válido'

        if (!birthdate) newErrors.birthdate = 'La fecha de nacimiento es obligatoria'
        else if (new Date().getFullYear() - new Date(birthdate).getFullYear() < 18) newErrors.birthdate = 'Debes ser mayor de 18 años'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const response = await updateUser(dni as string, name as string, surname as string, email as string, phone as string, birthdate as string)

        if (response) {
            alert('Cambios realizados correctamente')
            localStorage.setItem('token', response.token)
            setUserData(response.user)
            router.push(`/home/profile/${response.user.username}`)
        } else {
            setErrors({update: 'El correo electrónico ya está en uso'})
            router.refresh()
        }
    }

    async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const dni = userData?.dni
        const password = formData.get('password') as string
        const newPassword = formData.get('newPassword') as string

        const newErrors: { [key: string]: string } = {}

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

        if (!password) newErrors.oldpw = 'La contraseña actual es obligatoria'

        if (!newPassword) newErrors.newpw = 'La nueva contraseña es obligatoria'
        else if (!passwordRegex.test(newPassword)) newErrors.newpw = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'

        if (password === newPassword && password && newPassword) newErrors.pw = 'La nueva contraseña no puede ser igual a la actual'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const response = await updatePassword(dni as string, password as string, newPassword as string)

        if (response) {
            alert('Cambios realizados correctamente')
            localStorage.setItem('token', response.token)
            setUserData(response.user)
            router.push(`/home/profile/${response.user.username}`)
        } else {
            setErrors({updatepw: 'Ha habido un error al actualizar la contraseña, inténtalo de nuevo'})
            router.refresh()
        }

    }

    async function handleDelete() {
        if(confirm('¿Estás seguro de que quieres eliminar tu cuenta?')){
            const response = await deleteUser();
            if (response) {
                alert('Usuario eliminado con éxito');
                localStorage.removeItem('token');
                router.push('/');
            } else {
                return null;
            }
        }
    }

    useEffect(() => {
        async function fetchUserData() {
            const data = await getUserData(username as string);
            setUserData(data);
        }

        async function fecthLoggedInUserData() {
            const data = await getLoggedInUserData();
            setLoggedInUserData(data);
        }
        fetchUserData();
        fecthLoggedInUserData();
    }, [username]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    if (loggedInUserData && userData && loggedInUserData.username !== userData.username) {
        router.back();
        return null;
    }

    return (
        <>
            <Card className="flex flex-col h-screen max-w-full max-h-full">
                <p className="flex font-extrabold text-5xl mt-4 mb-4 justify-center">Editar información personal</p>
                <CardBody className="flex flex-row">
                    <Card className="flex flex-col justify-center items-center h-3/4 w-1/2 mr-1 rounded-3xl mx-4 overflow-auto">
                        <label className="font-bold text-2xl">Información personal</label>
                        <form className="w-2/4 h-3/4 max-w-2/4 max-h-3/4" onSubmit={handleUpdate}>
                            <div className="flex items-center font-bold">
                                Nombre
                                <Input value={userData ? userData.name : ''} className="py-2 ml-4" type="text"
                                       name="name"
                                       placeholder="Nombre" onChange={handleChange}/>
                            </div>
                            {errors.name && <p className="text-red-500 mb-4">{errors.name}</p>}

                            <div className="flex items-center font-bold">
                                Apellidos
                                <Input value={userData ? userData.surname : ''} className="py-2 ml-4" type="text"
                                       name="surname" placeholder="Apellidos" onChange={handleChange}/>
                            </div>
                            {errors.surname && <p className="text-red-500 mb-4">{errors.surname}</p>}

                            <div className="flex items-center font-bold">
                                Correo electrónico
                                <Input value={userData ? userData.email : ''} className="py-2 ml-4" type="email"
                                       name="email" placeholder="Correo electrónico" onChange={handleChange}/>
                            </div>
                            {errors.email && <p className="text-red-500 mb-4">{errors.email}</p>}

                            <div className="flex items-center font-bold">
                                Teléfono
                                <Input value={userData ? userData.phone : ''} className="py-2 ml-4" type="text"
                                       name="phone"
                                       placeholder="Teléfono" onChange={handleChange}/>
                            </div>
                            {errors.phone && <p className="text-red-500 mb-4">{errors.phone}</p>}

                            <div className="flex items-center font-bold">
                                Fecha de nacimiento
                                <Input value={userData ? userData.birthdate : ''} className="py-2 ml-4" type="date"
                                       name="birthdate" placeholder="Fecha de nacimiento" onChange={handleChange}/>
                            </div>
                            {errors.birthdate && <p className="text-red-500 mb-4">{errors.birthdate}</p>}

                            <div className="flex flex-col justify-center items-center mt-4">
                                {errors.update && <p className="text-red-500 mb-4">{errors.update}</p>}
                                <Button className="bg-emerald-400 text-black font-bold" type="submit">
                                    <GrFormEdit size={24}/>
                                    Guardar cambios
                                </Button>
                            </div>
                        </form>
                    </Card>
                    <Card className="flex flex-col justify-center items-center h-3/4 w-1/2 rounded-3xl mx-4 overflow-auto">
                        <label className="font-bold text-2xl">Cambiar contraseña</label>
                        <form className="w-2/4 h-3/4 max-w-2/4 max-h-3/4" onSubmit={handlePasswordUpdate}>
                            <div className="flex items-center font-bold">
                                Contraseña actual
                                <Input className="py-2 ml-4" type="password" name="password" onChange={handleChange}/>
                            </div>
                            {errors.oldpw && <p className="text-red-500 mb-4">{errors.oldpw}</p>}

                            <div className="flex items-center font-bold">
                                Nueva contraseña
                                <Input className="py-2 ml-4" type="password"
                                       name="newPassword" onChange={handleChange}/>
                            </div>
                            {errors.newpw && <p className="text-red-500 mb-4">{errors.newpw}</p>}
                            {errors.pw && <p className="flex text-red-500 mb-4 justify-center">{errors.pw}</p>}

                            <div className="flex flex-col justify-center items-center mt-4">
                                {errors.updatepw && <p className="text-red-500 mb-4">{errors.updatepw}</p>}
                                <Button className="bg-emerald-400 text-black font-bold" type="submit">
                                    <GrFormLock size={24}/>
                                    Actualizar contraseña
                                </Button>
                                <Button className="mt-14 bg-red-700 text-white font-bold min-w-[155px]" onPress={handleDelete}>
                                    <GrTrash size={20}/>
                                    Eliminar cuenta
                                </Button>
                            </div>
                        </form>
                    </Card>
                </CardBody>
            </Card>
        </>
    )
}