import { Editor } from "@monaco-editor/react";
import { CardHeader } from "./code-presentation/_components/card-header";

type Props = {
  value: string;
  handleUpdateSlide: (value: string | undefined) => void;
};
export const MyEditor = ({ value, handleUpdateSlide }: Props) => {
  const customTheme = {
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

  const handleEditorWillMount = (monacoInstance: any) => {
    monacoInstance.editor.defineTheme("customTheme", customTheme);
    monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
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
        onChange={handleUpdateSlide}
        beforeMount={handleEditorWillMount}
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
