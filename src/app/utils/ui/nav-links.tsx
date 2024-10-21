import {Button} from "@nextui-org/button";
import {GrContactInfo, GrFavorite, GrHomeRounded, GrTooltip, GrTrophy} from "react-icons/gr";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getLoggedInUserData} from "@/app/utils/lib/routes";
import {User} from "@/app/utils/lib/definitions";

export default function NavLinks() {
    const router = useRouter();
    const [userData, setUserData] = useState<User | null>(null);

    function handleRoutes(route: string) {
        router.push(route);
    }

    useEffect(() => {
        async function fetchUserData() {
            const data = await getLoggedInUserData();
            setUserData(data);
        }

        fetchUserData();
    }, []);

    return (
        <>
            <Button onPress={() => handleRoutes('/home')}
                  className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <GrHomeRounded/>
                Inicio
            </Button>
            <Button onPress={() => handleRoutes('/home/helpPublications')}
                    className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <GrFavorite/>
                Publicaciones de ayuda
            </Button>
            <Button onPress={() => handleRoutes('/home/ranking')}
                    className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <GrTrophy/>
                Clasificación
            </Button>
            <Button onPress={() => handleRoutes('/home/chat')}
                    className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <GrTooltip/>
                Chats
            </Button>
            <Button onPress={() => handleRoutes(`/home/profile/${userData?.username}`)}
                    className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <GrContactInfo/>
                Perfil
            </Button>
        </>
    );
}
