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
    return (
        <Tabs>
            <TabList>
                <Tab>Domain</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <Box w='100%' p={4} color='black'>
                        <Text fontSize='2xl'>{`${changeCase.pascalCase(pluralize.singular(design.entity))}.cs`}</Text>
                        <ModelViewer
                            name={`${changeCase.pascalCase(pluralize.singular(design.entity))}`}
                            json={design.json}
                            isRecord={false} />
                    </Box>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

export default DomainLayer;