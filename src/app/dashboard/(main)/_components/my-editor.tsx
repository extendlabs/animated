import { Editor } from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";
import { CardHeader } from "./code-presentation/_components/card-header";
import { useToast } from "@/hooks/use-toast";

type Props = {
  value: string;
  handleUpdateSlide: (value: string | undefined) => void;
};
export const MyEditor = ({ value, handleUpdateSlide }: Props) => {
  const { toast } = useToast();
  const MAX_LINES = 25;

  const customTheme: MonacoEditor.editor.IStandaloneThemeData = {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.foreground": "#abb2bf",
      "editor.background": "#1e1e1e",
      "editorCursor.foreground": "#528bff",
      "editorLineNumber.foreground": "#4b5263",
      "editorLineNumber.activeForeground": "#abb2bf",
      "editor.selectionBackground": "#3e4451",
      "editor.selectionHighlightBackground": "#2c313a",
      "editor.wordHighlightBackground": "#2c313a",
      "editor.wordHighlightStrongBackground": "#3e4451",
    },
  };

  const handleEditorWillMount = (monacoInstance: Monaco) => {
    monacoInstance.editor.defineTheme("customTheme", customTheme);
    monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  };

  const handleEditorMount = (
    editor: MonacoEditor.editor.IStandaloneCodeEditor,
    monacoInstance: Monaco,
  ) => {
    editor.onKeyDown((e: MonacoEditor.IKeyboardEvent) => {
      const isEnter =
        e.code === "Enter" ||
        e.code === "NumpadEnter" ||
        e.keyCode === monacoInstance.KeyCode.Enter;
      if (!isEnter) return;

      const model = editor.getModel();
      if (!model) return;

      const currentLines = model.getLineCount();
      if (currentLines >= MAX_LINES) {
        e.preventDefault();
        e.stopPropagation();
        toast({
          title: "Line limit reached",
          description: `You can enter up to ${MAX_LINES} lines.`,
        });
      }
    });

    editor.onDidPaste(() => {
      const model = editor.getModel();
      if (!model) return;
      const text = model.getValue();
      const lines = text.split("\n");
      if (lines.length > MAX_LINES) {
        const truncated = lines.slice(0, MAX_LINES).join("\n");
        editor.executeEdits("truncate-lines", [
          { range: model.getFullModelRange(), text: truncated },
        ]);
        toast({
          title: "Line limit reached",
          description: `Pasted content was trimmed to ${MAX_LINES} lines.`,
        });
      }
    });
  };

  const handleEditorChange = (nextValue: string | undefined) => {
    const safeValue = nextValue ?? "";
    const lines = safeValue.split("\n");
    if (lines.length > MAX_LINES) {
      toast({
        title: "Line limit reached",
        description: `You can enter up to ${MAX_LINES} lines. Extra lines were removed.`,
      });
      const truncated = lines.slice(0, MAX_LINES).join("\n");
      handleUpdateSlide(truncated);
      return;
    }
    handleUpdateSlide(nextValue);
  };

  return (
    <div
      className="m-2 mx-auto my-10 max-w-[700px] p-1 shadow-xl transition-[height] duration-500 ease-in-out will-change-[height]"
      style={{
        background: "hsl(0deg 0% 11.76%)",
        borderRadius: 10,
      }}
    >
      <CardHeader
        cardTheme={"defaultColorLess"}
        themeBorder={"hsl(0deg 0% 11.76%)"}
        themeText={"#f0f0f0"}
      />
      <div className="transition-[height] duration-500 ease-in-out will-change-[height]"></div>
      <Editor
        width="100%"
        theme="customTheme"
        height="400px"
        value={value}
        onChange={handleEditorChange}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          lineHeight: 20,
          fontFamily: "JetBrains Mono",
          fontLigatures: true,
          wordWrap: "on",
          glyphMargin: true,
          lineNumbersMinChars: 1,
          minimap: {
            enabled: false,
          },
          lineNumbers: (lineNumber: number) => {
            return lineNumber < 10 ? ` 0${lineNumber}` : ` ${lineNumber}`;
          },
          padding: {
            top: 16,
            bottom: 12,
          },
          bracketPairColorization: {
            enabled: true,
          },
          suggest: {
            showFields: false,
            showFunctions: false,
          },
          scrollBeyondLastLine: false,
          wordWrapColumn: 80,
        }}
      />
    </div>
  );
};
