import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { MemberRole } from "@/features/members/type";
import { GetMember } from "@/features/members/utils"; 

import { generateInviteCode } from "@/lib/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";


const app = new Hono()
.get("/",sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    //Querying Database for User Documents
    const members = await databases.listDocuments( // retrieves documents from a database. It takes three parameters:
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("userId", user.$id)] //creates an equality comparison, checking if the "userId" field equals the user.$id value
    );


    //Handling Empty API Responses
    if(members.total === 0) {
        return c.json ({data: {documents: [], total: 0 }});
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

    return c.json({data: workspaces});
})
.post(
    "/",
zValidator("form", createWorkspaceSchema),
sessionMiddleware,
async (c) =>{
const databases = c.get("databases");
const storage = c.get("storage");
const user = c.get("user");


const {name, image} = c.req.valid("form");

let uploadedImageUrl: string | undefined;
 
if (image instanceof File) {
    const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image,
    );

    const arrayBuffer = await storage.getFilePreview(
        IMAGES_BUCKET_ID,
        file.$id,
    );

    uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
}



const workspace = await databases.createDocument(
DATABASE_ID,
WORKSPACES_ID,
ID.unique(),
{
    name,
    userid: user.$id,
    imageUrl: uploadedImageUrl,
    inviteCode: generateInviteCode(6),
},
);

// creating a new document/record in a database.
 await databases.createDocument(
    DATABASE_ID,
    MEMBERS_ID, 
    ID.unique(),
    {
        userId: user.$id, // References the user's ID
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
    },
);

return c.json({data:workspace});
}
)

.patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        const { workspaceId } = c.req.param();
        const { name, image } = c.req.valid("form");

        const member = await GetMember({
            databases,
            workspaceId,
            userId: user.$id,
        });

        if (!member || member.role !== MemberRole.ADMIN){
            return c.json({error: "unauthorized"}, 401);
        }

        let uploadedImageUrl: string | undefined;
 
if (image instanceof File) {
    const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image,
    );

    const arrayBuffer = await storage.getFilePreview(
        IMAGES_BUCKET_ID,
        file.$id,
    );

    uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    }  else {
           uploadedImageUrl = image;
    } 
    
   const workspace = await databases.updateDocument (
    DATABASE_ID,
    WORKSPACES_ID,
    workspaceId,
    {
       name,
       imageUrl: uploadedImageUrl
    }
   );

   return c.json({ data: workspace });

    }
);

export default app;
