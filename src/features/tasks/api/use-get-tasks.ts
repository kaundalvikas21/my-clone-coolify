import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { TaskStatus } from "../types";

interface useGetTasksProps{
    workspaceId: string;
    projectId?: string | null;
    status?: TaskStatus | null;
    search?: string | null;
    assigneeId?: string | null;
    dueDate?: string | null;
};

// Custom hook to fetch the "current" user's data or session.
export const useGetTasks = ({
    workspaceId,
    projectId,
    status,
    search,
    assigneeId,
    dueDate
}: useGetTasksProps) => {
    const query = useQuery({   // useQuery hook to fetch data for the "current" query.
        queryKey: [
            "tasks",
             workspaceId,
             projectId,
             status,
             search,
             assigneeId,
             dueDate,   
            ], 
        queryFn: async () => { 
            const response = await client.api.tasks.$get({ 
                query: { 
                    workspaceId,
                    projectId: projectId ?? undefined, 
                    status: status ?? undefined, 
                    search: search ?? undefined, 
                    assigneeId: assigneeId ?? undefined, 
                    dueDate: dueDate ?? undefined, 
                },
        });   
   
             // If the response is not OK (error or unauthorized), return null.
            if(!response.ok){
                throw new Error("Failed to fetch tasks");
            }

            const {data} = await response.json();

            return data;
             // Note: No return value specified for a successful response.
        },
    });

    return query;
};