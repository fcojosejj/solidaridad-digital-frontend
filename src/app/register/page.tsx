'use client'

import {FormEvent, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Input} from '@nextui-org/input';
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import HeaderInitPage from "@/app/utils/ui/header-init-page";
import {Button} from "@nextui-org/button";
import {register} from "@/app/utils/lib/routes";
import {GrUserAdd} from "react-icons/gr";

export default function RegisterPage() {
    const router = useRouter()
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    async function handleRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const dni = formData.get('dni') as string
        const name = formData.get('name') as string
        const surname = formData.get('surname') as string
        const username = formData.get('username') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string
        const birthdate = formData.get('birthdate') as string
        const password = formData.get('password') as string

        const newErrors: { [key: string]: string } = {}

        const dniRegex = /\d{8}[A-HJ-NP-TV-Z]/
        const phoneRegex = /(\+34|0034|34)?[6789]\d{8}$/
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

        if (!dni) newErrors.dni = 'El DNI/NIE es obligatorio'
        else if (!dniRegex.test(dni)) newErrors.dni = 'El DNI/NIE no es válido'

        if (!name) newErrors.name = 'El nombre es obligatorio'
        else if (name.length < 2) newErrors.name = 'El nombre es demasiado corto, debe tener al menos 2 caracteres'
        else if (name.length > 20) newErrors.name = 'El nombre es demasiado largo, debe tener como máximo 20 caracteres'

        if (!surname) newErrors.surname = 'Los apellidos son obligatorios'
        else if (surname.length < 2) newErrors.surname = 'Los apellidos son demasiado cortos, debe tener al menos 2 caracteres'
        else if (surname.length > 64) newErrors.surname = 'Los apellidos son demasiado largos, debe tener como máximo 64 caracteres'

        if (!username) newErrors.username = 'El nombre de usuario es obligatorio'
        else if (username.length < 2) newErrors.username = 'El nombre de usuario es demasiado corto, debe tener al menos 2 caracteres'
        else if (username.length > 10) newErrors.username = 'El nombre de usuario es demasiado largo, debe tener como máximo 10 caracteres'

        if (!email) newErrors.email = 'El email es obligatorio'
        else if (!email.includes('@')) newErrors.email = 'El email no es válido'

        if (!phone) newErrors.phone = 'El teléfono es obligatorio'
        else if (!phoneRegex.test(phone)) newErrors.phone = 'El teléfono no es válido'

        if (!birthdate) newErrors.birthdate = 'La fecha de nacimiento es obligatoria'
        else if (new Date().getFullYear() - new Date(birthdate).getFullYear() < 18) newErrors.birthdate = 'Debes ser mayor de 18 años'

        if (!password) newErrors.password = 'La contraseña es obligatoria'
        else if (!passwordRegex.test(password)) newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const response = await register(dni, name, surname, username, email, phone, birthdate, password)

        if (response) {
            alert('Usuario registrado correctamente')
            localStorage.setItem('token', response.token)
            localStorage.removeItem('helpPublicationList')
            router.push('/home')
        } else {
            setErrors({register: 'Ha habido un error al crear la cuenta. Recuerde que el DNI, correo electrónico y nombre de usuario deben ser únicos'})
            router.push('/register')
        }
    }

    return (
        <div className="flex flex-col bg-gradient-to-b from-teal-800 to-teal-200 min-h-screen">
            <HeaderInitPage/>
            <div className="flex flex-col justify-center items-center py-6">
                <Card className="w-2/4 max-w-2/4 min-h-full space-y-6 border-black border-1">
                    <CardHeader className="flex flex-col items-center">
                        <h1 className="font-extrabold text-3xl">Regístrate</h1>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleRegister}>
                            <h2 className="text-lg">DNI/NIE</h2>
                            <Input className="py-2 focus:outline-none focus:border-transparent focus:ring-0" type="text"
                                   name="dni" placeholder="DNI/NIE"/>
                            {errors.dni && <p className="text-red-500">{errors.dni}</p>}

                            <h2 className="text-lg">Nombre</h2>
                            <Input className="py-2" type="text" name="name" placeholder="Nombre"/>
                            {errors.name && <p className="text-red-500">{errors.name}</p>}

                            <h2 className="text-lg">Apellidos</h2>
                            <Input className="py-2" type="text" name="surname" placeholder="Apellidos"/>
                            {errors.surname && <p className="text-red-500">{errors.surname}</p>}

                            <h2 className="text-lg">Nombre de usuario (máx. 10 caracteres)</h2>
                            <Input className="py-2" type="text" name="username" placeholder="Nombre de usuario"/>
                            {errors.username && <p className="text-red-500">{errors.username}</p>}

                            <h2 className="text-lg">Correo electrónico</h2>
                            <Input className="py-2" type="email" name="email" placeholder="Correo electrónico"/>
                            {errors.email && <p className="text-red-500">{errors.email}</p>}

                            <h2 className="text-lg">Teléfono</h2>
                            <Input className="py-2" type="text" name="phone" placeholder="Teléfono"/>
                            {errors.phone && <p className="text-red-500">{errors.phone}</p>}

                            <h2 className="text-lg">Fecha de nacimiento</h2>
                            <Input className="py-2" type="date" name="birthdate" placeholder="Fecha de nacimiento"/>
                            {errors.birthdate && <p className="text-red-500">{errors.birthdate}</p>}

                            <h2 className="text-lg">Contraseña</h2>
                            <Input className="py-2" type="password" name="password" placeholder="Contraseña"/>
                            {errors.password && <p className="text-red-500">{errors.password}</p>}

                            <CardFooter className="flex flex-col items-center">
                                {errors.register && <p className="text-red-500">{errors.register}</p>}
                                <Button className="bg-white text-black text-lg border-black border-1.5 mt-4"
                                        type="submit">
                                    <GrUserAdd/>
                                    Crear cuenta</Button>
                            </CardFooter>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}