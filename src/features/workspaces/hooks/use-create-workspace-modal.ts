// to control the modal is opened or not.

import { useQueryState, parseAsBoolean } from  "nuqs";
import { useState } from "react";

export const useCreateWorkspaceModal = () => {
      const [isOpen, setIsOpen] = useQueryState(
        "Create-Workspace",
        parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true})
      )

   const open = () => setIsOpen(true);
   const close = () => setIsOpen(false);

   return{
    isOpen,
    open,
    close,
    setIsOpen,
   };
};