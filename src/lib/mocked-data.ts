import { type PrismTheme, themes } from "prism-react-renderer"
import type { CardTheme } from "types/code-presentation.type"

export type Slide = {
  id: number
  code: string
  description?: string
}

export type Animation = {
  id: number
  name: string
  description: string
  slides: Slide[]
}

export type Theme = {
  id: number
  name: string
  background: string
  cardTheme: CardTheme
  codeTheme: PrismTheme
  padding: number
  radius: number
  language: string
  withLineIndex: boolean
}

export const mockedAnimations: Animation[] = [
  {
    id: 1,
    name: "Counter Evolution",
    description: "Shows the evolution of a counter component",
    slides: [
      {
        id: 0,
        code: "function Counter() {\n  const [count, setCount] = useState(0);\n  return <div>Count: {count}</div>;\n}",
        description: "Basic counter component",
      },
      {
        id: 1,
        code: "function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}",
        description: "Interactive counter component",
      },
    ],
  },
  {
    id: 2,
    name: "Todo List",
    description: "Demonstrates building a simple todo list",
    slides: [
      {
        id: 0,
        code: "function TodoList() {\n  const [todos, setTodos] = useState([]);\n  return (\n    <ul>\n      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}\n    </ul>\n  );\n}",
        description: "Basic todo list component",
      },
      {
        id: 1,
        code: "function TodoList() {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState('');\n\n  const addTodo = () => {\n    setTodos([...todos, { id: Date.now(), text: input }]);\n    setInput('');\n  };\n\n  return (\n    <div>\n      <input value={input} onChange={e => setInput(e.target.value)} />\n      <button onClick={addTodo}>Add Todo</button>\n      <ul>\n        {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}\n      </ul>\n    </div>\n  );\n}",
        description: "Interactive todo list with add functionality",
      },
    ],
  },
]

export const mockedThemes: Theme[] = [
  {
    id: 1,
    name: "Default",
    background: "linear-gradient(to right, #3b82f6, #9333ea, #ec4899)",
    cardTheme: "default",
    codeTheme: themes.vsDark,
    padding: 50,
    radius: 10,
    language: "tsx",
    withLineIndex: true,
  },
  {
    id: 2,
    name: "Monokai",
    background: "linear-gradient(to right, #272822, #3e3d32)",
    cardTheme: "default",
    codeTheme: themes.duotoneDark,
    padding: 40,
    radius: 8,
    language: "javascript",
    withLineIndex: false,
  },
  {
    id: 3,
    name: "Solarized",
    background: "linear-gradient(to right, #002b36, #073642)",
    cardTheme: "default",
    codeTheme: themes.shadesOfPurple,
    padding: 60,
    radius: 12,
    language: "python",
    withLineIndex: true,
  },
]
