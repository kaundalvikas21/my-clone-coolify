import "server-only";
import{
Client,
Account,
Storage,
Users,
Databases,
}
from "node-appwrite";
import { client } from "./rpc";

export async function CreateAdminClient(){
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // '!' exclamation  used at the end to overwrite safety.
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!) 
    .setKey(process.env.NEXT_APPWRITE_KEY!);

    return {
        get account(){
            return new Account(client);
        },
    };
};