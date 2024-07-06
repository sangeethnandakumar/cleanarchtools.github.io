import { useEffect, useState } from "react";
import { ModelMaker } from "./ModelMaker";
import Editor from '@monaco-editor/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';


function ModelViewer({ name, json, isRecord }) {

    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        if (isRecord) {
            let model = ModelMaker.makeRecord(name, json);
            setEditorContent(model);
        }
        else {
            let model = ModelMaker.makeClass(name, json);
            setEditorContent(model);
        }
    }, [name, json, isRecord]);

    return (
        <SyntaxHighlighter language="csharp" style={solarizedlight}>
            {editorContent}
        </SyntaxHighlighter>
    );
}

export default ModelViewer;