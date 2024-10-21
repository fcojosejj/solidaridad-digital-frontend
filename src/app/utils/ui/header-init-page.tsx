import Link from "next/link";

export default function HeaderInitPage() {
    return (
        <header
            className="text-xl text-primary-foreground py-4 px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
                <span className="font-bold bg-origin-border rounded-2xl px-4 py-2">SolidaridadDigital</span>
            </Link>
        </header>
    )
}