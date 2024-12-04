import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Slide = {
  id: number;
  code: string;
  description?: string;
};

type EngineSettingsSlidesState = {
  slides: Slide[];
  currentSlide: number;
};

type EngineSettingsSlidesActions = {
  setCurrentSlide: (currentSlide: number) => void;
  addSlide: (newSlide: Slide) => void;
  deleteSlide: (id: number) => void;
  updateSlide: (id: number, updatedSlide: Partial<Slide>) => void;
};

export const useEngineSettingsSlidesStore = create(
  immer<EngineSettingsSlidesState & EngineSettingsSlidesActions>((set) => ({
    slides: [
      {
        id: 0,
        code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      Count: {count}\n    </div>\n  );\n}",
        description: "Adding state management",
      },
      {
        id: 1,
        code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n    </div>\n  );\n}",
        description: "Complete interactive component",
      },
    ],
    currentSlide: 0,

    setCurrentSlide: (currentSlide) =>
      set((state) => {
        state.currentSlide = currentSlide;
      }),

    addSlide: (newSlide) =>
      set((state) => {
        state.slides.push(newSlide);
      }),

    deleteSlide: (id) =>
      set((state) => {
        state.slides = state.slides.filter(
          (slide: { id: number }) => slide.id !== id,
        );
      }),

    updateSlide: (id, updatedSlide) =>
      set((state) => {
        const slideIndex = state.slides.findIndex(
          (slide: { id: number }) => slide.id === id,
        );
        if (slideIndex !== -1) {
          state.slides[slideIndex] = {
            ...state.slides[slideIndex],
            ...updatedSlide,
          };
        }
      }),
  })),
);

export const { setCurrentSlide, addSlide, deleteSlide, updateSlide } =
  useEngineSettingsSlidesStore.getState();
