import CodePresentation from "@/components/code-presentation";

export default function Home() {
  const slides = [
    {
      id: 1,
      code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      Count: {count}\n    </div>\n  );\n}",
      description: "Adding state management",
    },
    {
      id: 2,
      code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      \n    </div>\n  );\n}",
      description: "Complete interactive component",
    },
    {
      id: 3,
      code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n    </div>\n  );\n}",
      description: "Complete interactive component",
    },
    {
      id: 4,
      code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}",
      description: "Complete interactive component",
    },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <CodePresentation slides={slides} />
    </main>
  );
}
