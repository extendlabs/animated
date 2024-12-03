const slides_01 = [
  {
    id: 1,
    code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      Count: {count}\n    </div>\n  );\n}",
    description: "Adding state management",
  },
  {
    id: 2,
    code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}",
    description: "Complete interactive component",
  },
];

const slides_02 = [
  {
    id: 1,
    code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      Count: {count}\n    </div>\n  );\n}",
    description: "Adding state management",
  },
  {
    id: 2,
    code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n    </div>\n  );\n}",
    description: "Complete interactive component",
  },
  {
    id: 3,
    code: "function counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}",
    description: "Complete interactive component",
  },
];

export { slides_01, slides_02 };
