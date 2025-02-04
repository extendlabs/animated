'use client'

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsTab } from './_components/settings-tab';
import { ThemeTab } from './_components/theme-tabs';
import { toast } from '@/hooks/use-toast';
import { useUIStore } from '@/zustand/useUIStore';
import { useAnimations } from '@/hooks/use-animations';


import { SettingsHeader } from './_components/settings-header';
import { useThemes } from '@/hooks/use-themes';


export default function AnimationsPage() {
    const { animations, loading, error, deleteAnimation } = useAnimations();
    const { themes, loading: themesLoading, deleteTheme } = useThemes();



    const handleSetSlides = (animation: any) => {
        const { setAnimationDetails, resetSlides } = useUIStore.getState();
        setAnimationDetails(animation.id, animation.name, animation.description);

        const formattedSlides = animation.slides.map((slide: any, index: number) => ({
            id: index,
            code: slide.code,
            file_name: slide.file_name || "",
            description: slide.description || "",
        }));

        resetSlides(formattedSlides);
        toast({
            title: "Animation Loaded",
            description: `${animation.name} slides are ready for editing.`,
        });
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAnimation(id);
            toast({
                title: "Animation deleted",
                description: "The animation has been successfully deleted.",
            });
        } catch (_err) {
            toast({
                title: "Error",
                description: "Failed to delete animation.",
                variant: "destructive",
            });
        }
    }

    const handleDeleteTheme = async (id: string) => {
        try {
            await deleteTheme(id);
            toast({
                title: "Theme deleted",
                description: "Theme has been successfully deleted.",
            });
        } catch (_err) {
            toast({
                title: "Error",
                description: "Failed to delete theme.",
                variant: "destructive",
            });
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-dvh">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <section id="animations" className="space-y-4">
            <div className="min-h-dvh">
                <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 px-8 py-[6dvh]">
                    <SettingsHeader />
                    <Tabs defaultValue="animations" className="w-full max-w-4xl">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="animations">Slides</TabsTrigger>
                            <TabsTrigger value="themes">Themes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="animations">
                            <SettingsTab
                                animations={animations}
                                loading={loading}
                                onSelectSlides={handleSetSlides}
                                onDelete={handleDelete}
                            />
                        </TabsContent>
                        <TabsContent value="themes">
                            <ThemeTab
                                themes={themes}
                                loading={themesLoading}
                                onDelete={handleDeleteTheme}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    )
};