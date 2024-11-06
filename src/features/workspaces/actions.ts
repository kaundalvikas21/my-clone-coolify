
import { cookies } from "next/headers";
import { Databases, Client, Query, Account } from "node-appwrite";

import { GetMember } from "../members/utils";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

import { Workspace } from "./types";


export const getWorkspaces = async () =>{
    try{ 
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies().get(AUTH_COOKIE);

    if(!session) return {documents: [], total: 0 };

    client.setSession(session.value);
    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    //Querying Database for User Documents
    const members = await databases.listDocuments( // retrieves documents from a database. It takes three parameters:
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("userId", user.$id)] //creates an equality comparison, checking if the "userId" field equals the user.$id value
    );


    //Handling Empty API Responses
    if(members.total === 0) {
        return {documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    //Fetching Workspace Documents from Database
    const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID,
        [
            Query.orderDesc("$createdAt"), //sorts the results in descending order based on the creation date.
            Query.contains("$id", workspaceIds) //filters the results to only include documents whose IDs are present in the workspaceIds array.
        ],
    );

  return workspaces;
} catch{
  return {documents: [], total: 0 };
}
};


interface GetWorkspaceProps {
    workspaceId: string;
};


export const getWorkspace = async ({workspaceId}: GetWorkspaceProps) =>{
    try{ 
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies().get(AUTH_COOKIE);

    if(!session) return null;

    client.setSession(session.value);
    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const member = await GetMember({
        databases,
        userId: user.$id,
        workspaceId,
    });

    if(!member){
        return null;
    }

  
    //Fetching Workspace Documents from Database
    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
    );

  return workspace;
} catch{
  return null;
}   
};