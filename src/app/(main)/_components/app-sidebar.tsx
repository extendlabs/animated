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
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { getUserSubscriptionStatus } from "@/lib/supabase/queries";
import { useAuthStore } from "@/zustand/useAuthStore";
import useSubscriptionLimitations from "@/hooks/use-subscription-limitation";
import { stat } from "fs";

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const {
    slides,
    currentSlide,
    setCurrentSlide,
    addSlide,
    deleteSlide,
    isRecordingMode,
  } = useUIStore();

  const supabase = createClient();
  const { subscriptionStatus, setSubscription, setPurchase } = useAuthStore();
  const limitations = useSubscriptionLimitations(subscriptionStatus);

  // Free users get 2 slides, pro users get unlimited
  const MAX_FREE_SLIDES = 2;

  const handleAddSlide = () => {
    if (!limitations.proUser && slides.length >= MAX_FREE_SLIDES) {
      console.error("Upgrade to Pro to add more slides");
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
    const fetchSubscriptionStatus = async () => {
      console.log(supabase)
      const status = await getUserSubscriptionStatus(supabase);
      if (status) {
        setSubscription(status.subscription);
        setPurchase(status.lifetimePurchase);
      }
      console.log(status);
    };

    fetchSubscriptionStatus();

  }, [supabase, setSubscription, setPurchase]);




  const isAddDisabled = () => {
    if (isRecordingMode) return true;
    if (limitations.proUser) return false;
    return slides.length >= MAX_FREE_SLIDES;
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
                    // disabled={isRecordingMode}
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
