import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetProjectAnalyticsProps{
    projectId: string;
};

export type ProjectAnalyticsResponseType = InferResponseType<typeof client.api.projects[":projectId"]["analytics"]["$get"], 200>;

// Custom hook to fetch the "current" user's data or session.
export const useGetProjectAnalytics = ({
    projectId,
}: useGetProjectAnalyticsProps) => {
    const query = useQuery({   // Using the useQuery hook to fetch data for the "current" query.
        queryKey: ["project-analytics", projectId], // Unique key for the query to allow caching and refetching
        queryFn: async () => {  // Query function that fetches data asynchronously.
            const response = await client.api.projects[":projectId"]["analytics"].$get({ 
                param: { projectId },
        });   // Sends a request to the auth API to get the current user/session.
   
             // If the response is not OK (error or unauthorized), return null.
            if(!response.ok){
                throw new Error("Failed to fetch project analytics");
            }

            const {data} = await response.json();

            return data;
             // Note: No return value specified for a successful response.
        },
    });

    return query;
};