"use client";

import { Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/zustand/useUIStore";
import { SidebarCard } from "./sidebar-card";

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { slides, currentSlide, setCurrentSlide, addSlide, deleteSlide } =
    useUIStore();

  const handleAddSlide = () => {
    const newSlide = {
      id: slides.length,
      code: "function newSlide() {}",
      description: "New slide description",
    };
    addSlide(newSlide);
    setCurrentSlide(newSlide.id);
  };

  const handleDeleteSlide = (id: number) => {
    deleteSlide(id);
    setCurrentSlide(0);
  };

  return (
    <Sidebar className={className} {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="z-50 flex h-full flex-col">
                <div className="space-y-2 p-2">
                  {slides.map((slide, index) => (
                    <SidebarCard
                      key={slide.id}
                      slide={slide}
                      index={index}
                      currentSlide={currentSlide}
                      setCurrentSlide={setCurrentSlide}
                      handleDeleteSlide={handleDeleteSlide}
                    />
                  ))}
                </div>
                <div className="border-t border-border p-2">
                  <Button
                    variant="ghost"
                    className="h-[120px] w-full rounded-md bg-slate-600/20 p-2 hover:bg-slate-600/50"
                    onClick={handleAddSlide}
                  >
                    <Plus className="text-slate-200" />
                  </Button>
                </div>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
