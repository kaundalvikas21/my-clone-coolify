import { Query } from "node-appwrite";

import { createSessionClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";


export const getWorkspaces = async () =>{
    const { databases, account } = await createSessionClient();
   
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
} ;



