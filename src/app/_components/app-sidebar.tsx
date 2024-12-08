"use client";

import { Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { useUIStore } from "@/zustand/useUIStore";
import { SidebarCard } from "./sidebar-card";

export function AppSidebar() {
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="flex-1 space-y-2 p-2">
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
                  variant="outline"
                  className="w-full"
                  onClick={handleAddSlide}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slide
                </Button>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
