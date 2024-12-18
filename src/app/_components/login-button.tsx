"use client";

import { useState } from "react";
import { AuthDialog } from "./auth-dialog";

export const LoginButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <AuthDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
};
