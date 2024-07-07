import { Box, Text, FormControl, AbsoluteCenter, FormLabel, Input } from '@chakra-ui/react'
import { useState } from 'react'
import Editor from '@monaco-editor/react';
import PresentationLayer from './PresentationLayer';
import ApplicationLayer from './ApplicationLayer';
import DomainLayer from './DomainLayer';
import { Highlight, Heading } from '@chakra-ui/react'

import { Divider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


function App() {

    const [design, setDesign] = useState({
        namespace: "ExpenceTracker.Presentation",
        entity: "catageory",
        json: `{
            "id": "b50808cb-0d3b-4159-b313-617e95ac5d8d",
	        "title": "Turf Cafe",
	        "text": "My favorite barista and coffees",
	        "sub": "[CATAGEORY ID]",
	        "image":"[IMAGE ID]",
	        "icon":"[ICON ID]"
        }`
    });

    return (
        <>
            <Box position='relative' padding='10'>
                <FormControl isRequired>
                    <FormLabel>Namespace</FormLabel>
                    <Input placeholder='Example: ExpenceTracker.Presentation' value={design.namespace} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Entity Name</FormLabel>
                    <Input
                        placeholder='Example: Catageory'
                        value={design.entity}
                        onChange={(e) => setDesign({ ...design, entity: e.target.value })} />
                </FormControl>
            </Box>

            <Box w='100%' p={4} color='blue'>
                <Editor
                    theme="vs-dark"
                    height="200px"
                    defaultLanguage="csharp"
                    defaultValue={design.json}
                    onChange={(value, event) => setDesign({ ...design, json: value })} />
            </Box>

            <Tabs>
                <TabList>
                    <Tab>💙 Domain Layer</Tab>
                    <Tab>🎯 Application Layer</Tab>
                    <Tab>🎭 Presentation Layer</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Box position='relative' padding='10'>
                            <Divider />
                            <Heading lineHeight='tall'>
                                <Highlight
                                    query={['Entities', 'ValueObjects', 'Domain Events']}
                                    styles={{ px: '2', py: '1', rounded: 'full', bg: 'blue.100' }}
                                >
                                    💙 Domain Layer With Entities, ValueObjects & Domain Events
                                </Highlight>
                            </Heading>
                        </Box>
                        <DomainLayer design={design} />
                    </TabPanel>

                    <TabPanel>
                        <Box position='relative' padding='10'>
                            <Divider />
                            <Heading lineHeight='tall'>
                                <Highlight
                                    query={['MediatR', 'EFCore', 'Fluent Validator', 'Result Pattern']}
                                    styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}
                                >
                                    🎯 Application Layer Using MediatR, EFCore & Fluent Validator With Result Pattern
                                </Highlight>
                            </Heading>
                        </Box>
                        <ApplicationLayer design={design} />
                    </TabPanel>

                    <TabPanel>
                        <Box position='relative' padding='10'>
                            <Divider />
                            <Heading lineHeight='tall'>
                                <Highlight
                                    query={['Carter Modules', 'Minimal API']}
                                    styles={{ px: '2', py: '1', rounded: 'full', bg: 'yellow.100' }}
                                >
                                    🎭 Presentation Layer Using Carter Modules & Minimal API
                                </Highlight>
                            </Heading>
                        </Box>
                        <PresentationLayer design={design} />
                    </TabPanel>

                </TabPanels>
            </Tabs>
        </>
    )
}

export default App
