import { Editor } from "@monaco-editor/react";

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
      tsx: "react",
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  };

  return (
    <Editor
      width="100%"
      theme="customTheme"
      height="400px"
      value={value}
      onChange={handleUpdateSlide}
      defaultLanguage="typescript"
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
  );
};
