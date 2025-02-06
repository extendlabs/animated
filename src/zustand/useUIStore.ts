import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Slide = {
  id: number;
  code: string;
  description?: string;
  file_name?: string;
};

type EngineSettingsSlidesState = {
  id: string | null;
  fileName: string;
  name: string;
  description: string;
  slides: Slide[];
  currentSlide: number;
  isEditing: boolean;
  isAutoPlaying: boolean;
  isRecordingMode: boolean;
};

type UIStore = {
  setFileName: (fileName: string) => void;
  setAnimationDetails: (id: string, name: string, description: string) => void;
  setCurrentSlide: (currentSlide: number) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsAutoPlaying: (isAutoPlaying: boolean) => void;
  addSlide: (newSlide: Slide) => void;
  deleteSlide: (id: number) => void;
  updateSlide: (id: number, updatedSlide: Partial<Slide>) => void;
  resetSlides: (slides: Slide[]) => void;
  setIsRecordingMode: (isRecordingMode: boolean) => void;
};

export const useUIStore = create(
  immer<EngineSettingsSlidesState & UIStore>((set) => ({
    id: null,
    name: "",
    description: "",
    fileName: "Undefined-1.tsx",
    isRecordingMode: false,
    slides: [
      {
        id: 0,
        code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      Count: {count}\n    </div>\n  );\n}",
        file_name: "",
        description: "",
      },
      {
        id: 1,
        code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n    </div>\n  );\n}",
        file_name: "",
        description: "",
      },
    ],
    currentSlide: 0,
    isEditing: false,
    isAutoPlaying: false,
    setFileName: (fileName) =>
      set((state) => {
        state.fileName = fileName;
      }),

    setAnimationDetails: (id, name, description) =>
      set((state) => {
        state.id = id;
        state.name = name;
        state.description = description;
      }),
    setIsRecordingMode: (isRecordingMode) => set({ isRecordingMode }),

    setCurrentSlide: (currentSlide) =>
      set((state) => {
        state.currentSlide = currentSlide;
      }),

    setIsEditing: (isEditing) =>
      set((state) => {
        state.isEditing = isEditing;
      }),

    setIsAutoPlaying: (isAutoPlaying) =>
      set((state) => {
        state.isAutoPlaying = isAutoPlaying;
      }),

    addSlide: (newSlide) =>
      set((state) => {
        state.slides.push(newSlide);
      }),

    deleteSlide: (id) =>
      set((state) => {
        state.slides = state.slides
          .filter((slide) => slide.id !== id)
          .map((slide, index) => ({ ...slide, id: index }));
        if (state.currentSlide >= state.slides.length) {
          state.currentSlide = Math.max(state.slides.length - 1, 0);
        }
      }),

    updateSlide: (id, updatedSlide) =>
      set((state: any) => {
        const slideIndex = state.slides.findIndex(
          (slide: any) => slide.id === id,
        );
        if (slideIndex !== -1) {
          state.slides[slideIndex] = {
            ...state.slides[slideIndex],
            ...updatedSlide,
          };
        }
      }),

    resetSlides: (slides) =>
      set((state) => {
        state.slides = slides.map((slide, index) => ({ ...slide, id: index }));
      }),
  })),
);
