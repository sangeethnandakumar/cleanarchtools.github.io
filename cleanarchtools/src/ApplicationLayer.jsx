import AstParser from "./AstParser";
import { useState, useEffect } from 'react';
import { Box, Text, Divider, AbsoluteCenter } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import pluralize from 'pluralize';
import * as changeCase from 'change-case';
import ModelViewer from "./ModelViewer";

function ApplicationLayer({ design }) {

    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {

        let ast = AstParser.parse(design.json);
        let maps = ``;
        ast.forEach((node) => {
            maps += `                           request.${node.name},\n`;
        });

        const content = ``;

        setEditorContent(content);
    }, [design.entity, design.json]);

    return (
        <>
            <Box position='relative' padding='10'>
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    <Text fontSize='3xl'>🎯Application Layer</Text>
                </AbsoluteCenter>
            </Box>

            <Box w='100%' p={4} color='black'>
                <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query.cs`}</Text>

                <ModelViewer
                    name={`Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query`}
                    json={design.json}
                    isRecord={true} />
            </Box>

            <Box w='100%' p={4} color='black'>
                <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize(design.entity))}Query.cs`}</Text>

                <ModelViewer
                    name={`Get${changeCase.pascalCase(pluralize(design.entity))}Query`}
                    json={`{}`}
                    isRecord={true} />
            </Box>

            <Box w='100%' p={4} color='black'>
                <Text fontSize='2xl'>{`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command.cs`}</Text>

                <ModelViewer
                    name={`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command`}
                    json={design.json}
                    isRecord={true} />
            </Box>


            <Box w='100%' p={4} color='black'>
                <Text fontSize='2xl'>{`${changeCase.pascalCase(pluralize(design.entity))}Module.cs | Carter Module`}</Text>
                <h4 />
                <Editor
                    theme="vs-light"
                    height="500px"
                    defaultLanguage="csharp"
                    value={editorContent}
                    options={{ readOnly: true }}
                />
            </Box>
        </>
    );

}

export default ApplicationLayer;