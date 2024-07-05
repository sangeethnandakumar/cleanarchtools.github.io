import { useEffect, useState } from "react";
import { ModelMaker } from "./ModelMaker";
import Editor from '@monaco-editor/react';

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
        <Editor
            theme="vs-dark"
            height="150px"
            defaultLanguage="csharp"
            value={editorContent}
            options={{ readOnly: true }}
        />
    );
}

export default ModelViewer;