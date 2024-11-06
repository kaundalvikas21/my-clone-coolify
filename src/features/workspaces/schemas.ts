import {z}from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    image: z.union([ // This defines a field named 'imageUrl' in your schema. (union ([...])- means the imageUrl can be one of multiple types (like saying "this field can be either Type A OR Type B"))
        z.instanceof(File), //It can be a File object (like when you upload a file in a web browser)
        z.string().transform((value) => value === "" ? undefined : value), //Or it can be a text string.  If the string is empty (""), it converts it to undefined, Otherwise, it keeps the original value
    ])
    .optional(),
});


export const updateWorkspaceSchema = z.object({
    name: z.string().trim().min(1, "Must be 1 or more characters") .optional(),
    image: z.union([ // This defines a field named 'imageUrl' in your schema. (union ([...])- means the imageUrl can be one of multiple types (like saying "this field can be either Type A OR Type B"))
        z.instanceof(File), //It can be a File object (like when you upload a file in a web browser)
        z.string().transform((value) => value === "" ? undefined : value), //Or it can be a text string.  If the string is empty (""), it converts it to undefined, Otherwise, it keeps the original value
    ])
    .optional(),
});