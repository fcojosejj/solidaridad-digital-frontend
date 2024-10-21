'use client'

import SideNav from '@/app/utils/ui/sidenav';
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getLoggedInUserData} from "@/app/utils/lib/routes";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const userData = await getLoggedInUserData();
            if (!userData) {
                router.push('/');
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuth();
    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-teal-800 to-teal-300 h-screen">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}