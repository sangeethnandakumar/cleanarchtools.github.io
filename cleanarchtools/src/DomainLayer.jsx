import AstParser from "./AstParser";
import { useState, useEffect } from 'react';
import { Box, Text, Divider, AbsoluteCenter } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import pluralize from 'pluralize';
import * as changeCase from 'change-case';
import ModelViewer from "./ModelViewer";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DomainLayer({ design }) {

    const [queryHandlerId, setQueryHandlerId] = useState('');

    useEffect(() => {

        let ast = AstParser.parse(design.json);

        // Generate properties
        let props = ast.map(node =>
            `        public ${node.kind} ${changeCase.pascalCase(node.name)} { get; private set; }`
        ).join('\n');

        // Generate constructor body
        let constructor = ast.map(node =>
            `            ${changeCase.pascalCase(node.name)} = ${node.name};`
        ).join('\n');

        // Generate constructor parameters
        let attrs = ast.map(node =>
            `${node.kind} ${node.name}`
        ).join(', ');

        const queryHandlerCode = `public sealed class ${changeCase.pascalCase(design.entity)} : Entity
    {
        //Private Contructor for EFCore
        private ${changeCase.pascalCase(design.entity)}() { }

        //Contructor
        public ${changeCase.pascalCase(design.entity)}(${attrs}) : base(Guid.NewGuid())
        {
${constructor}
        }

        //Immutable Props
${props}
    }`;
        setQueryHandlerId(queryHandlerCode);

    }, [design.entity, design.json]);

    return (
        <Tabs>
            <TabList>
                <Tab>Domain</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <Box w='100%' p={4} color='black'>
                        <Text fontSize='2xl'>{`${changeCase.pascalCase(design.entity)}.cs`}</Text>
                        <h4 />
                        <SyntaxHighlighter language="csharp" style={solarizedlight}>
                            {queryHandlerId}
                        </SyntaxHighlighter>
                    </Box>

                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

export default DomainLayer;