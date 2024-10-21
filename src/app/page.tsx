'use client'

import Image from "next/image";
import Link from "next/link";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import {Input} from '@nextui-org/react';
import HeaderInitPage from "@/app/utils/ui/header-init-page";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {login} from "@/app/utils/lib/routes";
import {GrLogin} from "react-icons/gr";

export default function Home() {
    const router = useRouter()
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [hasErrors, setHasErrors] = useState(false)

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const newErrors: { [key: string]: string } = {}

        if (!email) newErrors.email = 'Introduzca un correo electrónico válido'

        if (!password) newErrors.password = 'Introduzca la contraseña'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setHasErrors(true)
            return
        }

        const response = await login(email, password)

        if (response) {
            localStorage.setItem('token', response.token)
            localStorage.removeItem('helpPublicationList')
            router.push('/home')
        } else {
            setErrors({login: 'Correo electrónico o contraseña incorrectos'})
            router.push('/')
        }

    }


    return (
        <div className="flex flex-col min-h-screen text-white bg-gradient-to-b from-teal-800 to-teal-200">
            <HeaderInitPage/>
            <main className="flex flex-col md:flex-row">
                <div className="w-1/2 flex flex-col h-screen justify-center items-center">
                    <Image src={"/authpage.jpg"}
                           alt="Imagen de inicio. Recuperada de https://iconscout.com/illustration/happy-people-8687317"
                           width={900} height={900}/>
                </div>
                <div
                    className="w-1/2 py-24 px-6 md:px-12 flex flex-col text-primary-foreground h-screen justify-center items-center">
                    <h1 className="text-6xl font-bold mb-4">Únete a la comunidad</h1>
                    <p className="mb-10 text-3xl flex flex-col text-center font-bold">Marca la diferencia en tu
                        comunidad local de mediante el
                        voluntariado comunitario</p>
                    <Card className={`w-3/4 ${hasErrors ? 'h-2/3' : 'h-4/4'} max-w-3/4 max-h-2/4 space-y-6 border-black border-1`}>
                        <CardHeader className="flex flex-col items-center mt-8">
                            <h1 className="font-extrabold text-4xl">Inicia sesión</h1>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handleLogin}>
                                <div>
                                    <h2 className="text-lg">Correo electrónico</h2>
                                    <Input type="email" name="email" placeholder="Email" className="focus:outline-none border-transparent focus:border-transparent focus:ring-0"/>
                                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <h2 className="text-lg mt-5">Contraseña</h2>
                                    <Input placeholder="Contraseña" type="password" name="password" unselectable="on" className="mt-4 bg-gray-100 rounded-2xl focus:outline-none border-transparent focus:border-transparent focus:ring-0"/>
                                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                                </div>

                                <CardFooter className="flex flex-col items-center">
                                    {errors.login && <p className="text-red-500">{errors.login}</p>}
                                    <Button className="text-black bg-white antialiased mt-4" type="submit">
                                        <GrLogin size={18}/>
                                        Inicia sesión</Button>
                                </CardFooter>
                            </form>
                        </CardBody>
                        <CardFooter className="flex flex-col justify-center">
                            <Link className="mb-4" href="/register">
                                <Button className="text-black bg-white antialiased right-1">¿No tienes cuenta?
                                    <u>Regístrate</u></Button>
                            </Link>
                        </CardFooter>
                    </Card>

                </div>
            </main>
        </div>
    );
}