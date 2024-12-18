'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import OauthSignIn from './OauthSignIn/OauthSignIn';
import { useState } from 'react';

function AuthDialog({ isDialogOpen, setIsDialogOpen }: any) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login / Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{'Login'}</DialogTitle>
        </DialogHeader>
        <OauthSignIn />
      </DialogContent>
    </Dialog>
  );
}

export default function OauthSignInButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} variant="outline">
        Open OAuth Dialog
      </Button>
      <AuthDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
}
