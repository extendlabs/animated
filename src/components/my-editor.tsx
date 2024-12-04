import { Editor } from "@monaco-editor/react";

export const MyEditor = ({ value, handleUpdateSlide }: any) => {
  const customTheme = {
    base: "vs-dark",
    inherit: true,
    rules: [
      //   { token: 'comment', foreground: '#5c6370', fontStyle: 'italic' },
      //   { token: 'keyword', foreground: '#569cd6' },
      //   { token: 'string', foreground: '#98c379' },
      //   { token: 'number', foreground: '#b5cea8' },
      //   { token: 'identifier', foreground: '#DCDCAA' },
      //   { token: 'operator', foreground: '#56b6c2' },
      //   { token: 'punctuation', foreground: '#abb2bf' },
      //   { token: 'function', foreground: '#61afef' },
      //   { token: 'method', foreground: '#61afef' },
      //   { token: 'class', foreground: '#9cdcfe' },
      //   { token: 'interface', foreground: '#9cdcfe' },
      //   { token: 'enum', foreground: '#9cdcfe' },
      //   { token: 'enumMember', foreground: '#b5cea8' },
      //   { token: 'property', foreground: '#56b6c2' },
      //   { token: 'constant', foreground: '#b5cea8' },
      //   { token: 'tag', foreground: '#e06c75' },
      //   { token: 'attr', foreground: '#b5cea8' },
      //   { token: 'attribute', foreground: '#98c379' },
      //   { token: 'parameter', foreground: '#abb2bf' },
      //   { token: 'variable.constant', foreground: '#ffffff' },
      //   { token: 'namespace', foreground: '#61afef' },
      //   { token: 'module', foreground: '#61afef' },
      //   { token: 'type', foreground: '#9cdcfe' },
    ],
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
        formatOnPaste: true,
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
