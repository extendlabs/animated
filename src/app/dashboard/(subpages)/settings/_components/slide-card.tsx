import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { useUIStore } from "@/zustand/useUIStore";

type Props = {
  animation: any;
  onSelectSlides: (animation: any) => void;
};
export const SlideCard = ({ animation, onSelectSlides }: Props) => {
  const animationId = useUIStore((state) => state.id);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{animation.name}</CardTitle>
        <CardDescription>{animation.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {animation.slides.map((slide: any) => (
          <div key={slide.id} className="mb-4 last:mb-0">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">
                {slide.file_name}
              </h3>
            </div>
            <pre className="mt-2 overflow-x-auto rounded p-2 text-sm">
              <code className="text-sm text-muted-foreground">{slide.code}</code>
            </pre>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <div className="w-full text-right">
          <Button onClick={() => onSelectSlides(animation)}>
            {animationId === animation.id ? "Selected" : "Select"} Code
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
