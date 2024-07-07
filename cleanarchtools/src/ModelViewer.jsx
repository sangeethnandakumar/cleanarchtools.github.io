import { useEffect, useState } from "react";
import { ModelMaker } from "./ModelMaker";
import Editor from '@monaco-editor/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button, Stack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'


function ModelViewer({ name, json, isRecord, excludeId, isCqrs }) {

    const [editorContent, setEditorContent] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (isRecord) {
            let model = ModelMaker.makeRecord(name, json, excludeId, isCqrs);
            setEditorContent(model);
        }
        else {
            let model = ModelMaker.makeClass(name, json, excludeId, isCqrs);
            setEditorContent(model);
        }
    }, [name, json, isRecord]);

    return (
        <>
            <Stack direction='row' spacing={0} align='center' m={6}>
                <Button colorScheme='teal' variant='outline' onClick={() => {
                    navigator.clipboard.writeText(editorContent);
                    toast({
                        title: 'Code Copied',
                        status: 'success',
                        duration: 500,
                        isClosable: false,
                    })
                }}>
                    📑 Copy To Clipboard
                </Button>
            </Stack>
            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                {editorContent}
            </SyntaxHighlighter>
        </>
    );
}

export default ModelViewer;