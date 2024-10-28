import "server-only";

import {
    Account,
    Client,
    Databases,
    Models,
    Storage,
    type Account as AccountType,
    type Databases as DatabasesType,
    type Storage as StorageType,
    type Users as UsersType,
}from "node-appwrite";

import { getCookie } from "hono/cookie";
import {createMiddleware} from "hono/factory";  

import { AUTH_COOKIE } from "@/features/auth/constants";


type AdditionalContext = {
    Variables: {
        account: AccountType; 
        databases: DatabasesType;
        storage: StorageType;
        users: UsersType;
        user: Models.User<Models.Preferences>;
    };
};


export  const sessionMiddleware = createMiddleware<AdditionalContext>(
    async (c, next) => {
        const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

        const session = getCookie (c, AUTH_COOKIE);
        // in-case that cookie missing, we are simply going to return context.json.
        if(!session){
            return c.json({ error: "Unauthorized"}, 401);
        }

        // we are going to append the session to the client, so client set session and pass our session here, so setSession will serve as set key which we have inside our client.

        client.setSession(session);


        const account = new Account(client);
        const databases = new Databases(client);
        const storage = new Storage(client);
     
        const user = await account.get(); // Fetch user session info
 
         // Store objects in context
        c.set("account", account);
        c.set("databases", databases);
        c.set("storage", storage);
        c.set("user", user);

        await next();// Proceed to next middleware
   
    },
);

