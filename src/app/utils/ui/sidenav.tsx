'use client'

import {GrLogout} from 'react-icons/gr'
import NavLinks from '@/app/utils/ui/nav-links';
import {getLoggedInUserData, logout} from "@/app/utils/lib/routes";
import {useRouter} from "next/navigation";
import {User} from "@/app/utils/lib/definitions";
import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";

export default function SideNav() {
    const router = useRouter();
    const [userData, setUserData] = useState<User | null>(null);

    async function handleLogout() {
        const response = await logout();

        if (response) {
            router.push('/');
        } else {
            return null;
        }
    }

    useEffect(() => {
        async function fetchUserData() {
            const data = await getLoggedInUserData();
            setUserData(data);
        }

        fetchUserData();
    }, []);

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <p className="text-xl font-bold text-white mb-2 flex items-end justify-start rounded-md bg-teal-900 p-4 border-black border-3">Bienvenid@, {userData ? userData.username : ''}</p>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks/>
                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
                <Button onClick={handleLogout}
                        className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-50 hover:text-teal-400 md:flex-none md:justify-start md:p-2 md:px-3">
                    <GrLogout/>
                    Cerrar sesión
                </Button>
            </div>
        </div>
    );
}
