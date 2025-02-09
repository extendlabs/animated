'use client'

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Card from "@/components/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getStatusRedirect, getErrorRedirect } from '@/lib/helpers';
import { deleteUserAccount } from '@/lib/stripe/server';

interface DeleteAccountFormProps {
    hasActiveSubscription: boolean;
}

export default function DeleteAccountForm({ hasActiveSubscription }: DeleteAccountFormProps) {
    const router = useRouter();
    const currentPath = usePathname();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);

        try {
            const result = await deleteUserAccount();
            let redirectPath;

            if (result.success) {
                redirectPath = getStatusRedirect('/', 'Success!', result.message);

            } else {
                redirectPath = getErrorRedirect(currentPath, 'Error', result.message);
            }

            return setTimeout(() => router.push(redirectPath), 1000);
        } catch (error) {
            const redirectPath = getErrorRedirect(
                currentPath,
                'Error',
                'An unexpected error occurred. Please try again.'
            );
            return setTimeout(() => router.push(redirectPath), 1000);
        }
    };

    return (
        <Card
            title="Delete Account"
            description="Permanently delete your account and all associated data."
            footer={
                <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                    <p className="pb-4 sm:pb-0 text-sm text-muted-foreground">
                        {hasActiveSubscription ?
                            "Please cancel your subscription before deleting your account." :
                            "This action cannot be undone and will permanently delete all your data."}
                    </p>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                disabled={hasActiveSubscription || isDeleting}
                                className="w-full sm:w-auto"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Account"
                                )}
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="mt-2">
                                    {hasActiveSubscription ? (
                                        <span className="font-medium">
                                            Please cancel your subscription before deleting your account.
                                        </span>
                                    ) : (
                                        <>
                                            This action <span className="font-medium">cannot be undone</span>.
                                            This will permanently delete your account and remove your
                                            data from our servers.
                                        </>
                                    )}
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                {!hasActiveSubscription && (
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete Account"
                                        )}
                                    </AlertDialogAction>
                                )}
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            }
        />
    );
}