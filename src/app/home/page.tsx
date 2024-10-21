import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Input} from "@nextui-org/input";

export default function Page() {
    return (
        <>
            <Card className="flex flex-col h-screen items-center max-w-full max-h-full">
                <CardHeader className="flex flex-col items-center">
                    <p className="font-extrabold text-5xl mt-4 mb-4">Bienvenid@ a SolidaridadDigital</p>
                </CardHeader>
                <CardBody className="flex flex-col items-center">
                    <p className="text-3xl">SolidaridadDigital es una plataforma que conecta a personas que necesitan ayuda con personas que quieren ayudar.</p>
                    <div className="flex flex-col text-2xl h-full justify-center">
                        <p className="my-4">En el apartado Publicaciones de ayuda podrás crear una nueva publicación de ayuda o buscar publicaciones de otros usuarios.</p>
                        <p className="my-4">En el apartado Clasificación podrás comprobar cuáles son los usuarios que más ayudas han resuelto.</p>
                        <p className="my-4">En el apartado Chats podrás ver un listado de los chats que tienes abiertos con otros usuarios.</p>
                        <p className="my-4">En el apartado Perfil podrás ver tu perfil de usuario, ver las valoraciones que has recibido y modificar tus datos.</p>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}