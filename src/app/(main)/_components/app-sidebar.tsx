"use client";

import { Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/zustand/useUIStore";
import { SidebarCard } from "./sidebar-card";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { getSubscription } from "@/lib/supabase/queries";
import { useAuthStore } from "@/zustand/useAuthStore";

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { slides, currentSlide, setCurrentSlide, addSlide, deleteSlide } =
    useUIStore();
  const supabase = createClient();
  const { subscription, setSubscription } = useAuthStore();
  const { isRecordingMode } = useUIStore();

  const getMaxSlides = () => {
    switch (subscription) {
      case null:
        return 2;
      case 'Hobby':
        return 5;
      case 'Premium':
        return Infinity;
      default:
        return 0;
    }
  };

  const handleAddSlide = () => {
    const maxSlides = getMaxSlides();
    if (slides.length >= maxSlides) {
      return;
    }

    const newSlide = {
      id: slides.length,
      code: "function newSlide() {}",
      file_name: "",
      description: "",
    };
    addSlide(newSlide);
    setCurrentSlide(newSlide.id);
  };

  const handleDeleteSlide = (id: number) => {
    deleteSlide(id);
    setCurrentSlide(0);
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      const subscription = await getSubscription(supabase);
      setSubscription(subscription?.prices?.products?.name || null);
    };

    fetchSubscription();
  }, []);

  const isAddDisabled = () => {
    return slides.length >= getMaxSlides();
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
                    disabled={isAddDisabled()}
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