import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {client} from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$patch"], 200>; 
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$patch"]>;

export const useUpdateWorkspace = () => {
   const queryClient = useQueryClient();

   return useMutation<ResponseType, Error, RequestType>({
       mutationFn: async (data) => {
           const response = await client.api.workspaces[":workspaceId"]["$patch"](data);
           if (!response.ok) throw new Error("Failed to update workspace");
           return response.json();
       },
       onSuccess: ({ data }) => {
           toast.success("Workspace Updated");
           queryClient.invalidateQueries({ queryKey: ["workspaces"] });
           queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
       },
       onError: () => {
           toast.error("Failed to update workspace");
       },
   });
};