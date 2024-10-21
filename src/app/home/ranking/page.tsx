'use client'

import {Card, CardBody, CardHeader} from "@nextui-org/card";
import React, {useEffect, useState} from "react";
import {User} from "@/app/utils/lib/definitions";
import {getUserRanking} from "@/app/utils/lib/routes";
import * as dateFns from "date-fns";
import {useRouter} from "next/navigation";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button} from "@nextui-org/react";
import Link from "next/link";

export default function Ranking() {
    const router = useRouter();
    const [date, setDate] = useState(() => dateFns.subDays(new Date(), 1));
    const [userList, setUserList] = useState<User[] | null>([]);
    const [selectedKeys, setSelectedKeys] = useState(new Set(["últimas 24h"]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    useEffect(() => {
        async function fetchUsers() {
            const userList = await getUserRanking(date);
            if (userList) setUserList(userList);
            else {
                alert("Ha habido un error al cargar la clasificación de usuarios. Inténtelo más tarde.");
                router.back()
            }
        }

        fetchUsers();
    }, [date]);

    return (
        <Card className="flex flex-col h-screen items-center max-w-full max-h-full overflow-auto">
            <CardHeader className="flex flex-col justify-center items-center w-full">
                <p className="font-extrabold text-5xl mt-4 mb-4">Clasificación de usuarios</p>
                <p className="text-2xl">Aquí se mostrará una clasificación acerca de qué usuarios contribuyen más a
                    su comunidad.</p>
                <p className="text-2xl mb-4">Si no apareces en la clasificación... ¡anímate a ayudar!</p>
                <div className="flex flex-row text-lg">
                    <p className="flex items-center mr-2">Seleccione el tipo de clasificación: </p>
                    <Dropdown className="flex w-full">
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                className="capitalize"
                            >
                                {selectedValue}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Single selection example"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedKeys}
                            // @ts-ignore
                            onSelectionChange={setSelectedKeys}
                        >
                            <DropdownItem key="últimas 24h" className="p-2"
                                          onPress={() => setDate(dateFns.subDays(new Date(), 1))}>Últimas
                                24h</DropdownItem>
                            <DropdownItem key="semanal" className="p-2"
                                          onPress={() => setDate(dateFns.subWeeks(new Date(), 1))}>Semanal</DropdownItem>
                            <DropdownItem key="mensual" className="p-2"
                                          onPress={() => setDate(dateFns.subMonths(new Date(), 1))}>Mensual</DropdownItem>
                            <DropdownItem key="anual" className="p-2"
                                          onPress={() => setDate(dateFns.subYears(new Date(), 1))}>Anual</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col h-full">
                <hr className="border-gray-300 mb-6"></hr>
                <table className="w-full">
                    <thead>
                    <tr className="flex flex-row items-center justify-between w-full font-bold text-2xl">
                        <th className="underline">Posición</th>
                        <th className="underline ml-2">Usuario</th>
                        <th className="underline">Ayudas completadas</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(userList?.length!! > 0) ? (
                        userList?.map((user, index) => {
                            const aidsAfterDate = user.aidsCompleted?.filter(aid => new Date(aid) > date).length;

                            return (
                                <tr key={index}
                                    className="mt-1 flex flex-row items-center justify-between w-full text-xl">
                                    <td className="ml-8">{index + 1}</td>
                                    <Link className="mr-20" href={`/home/profile/${user.username}`}>
                                        <td className="text-sky-400 underline">@{user.username}</td>
                                    </Link>
                                    <td className="mr-20">{aidsAfterDate}</td>
                                </tr>);
                        })
                    ) : (
                        <p className="flex items-center justify-center text-xl">Aún no hay usuarios con publicaciones de ayuda completadas...</p>
                    )}
                    </tbody>
                </table>
            </CardBody>
        </Card>
    )
}