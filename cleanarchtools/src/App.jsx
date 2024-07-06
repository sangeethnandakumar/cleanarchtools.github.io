import { Box, Text, FormControl, AbsoluteCenter, FormLabel, Input } from '@chakra-ui/react'
import { useState } from 'react'
import Editor from '@monaco-editor/react';
import PresentationLayer from './PresentationLayer';
import ApplicationLayer from './ApplicationLayer';

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
                    <Tab>🎭 Presentation Layer</Tab>
                    <Tab>🎯 Application Layer</Tab>
                    <Tab>❤️ Domain Layer</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Box position='relative' padding='10'>
                            <Divider />
                            <AbsoluteCenter bg='white' px='4'>
                                <Text fontSize='3xl'>🎭 Presentation Layer</Text>
                            </AbsoluteCenter>
                        </Box>
                        <PresentationLayer design={design} />
                    </TabPanel>

                    <TabPanel>
                        <Box position='relative' padding='10'>
                            <Divider />
                            <AbsoluteCenter bg='white' px='4'>
                                <Text fontSize='3xl'>🎯Application Layer</Text>
                            </AbsoluteCenter>
                        </Box>
                        <ApplicationLayer design={design} />
                    </TabPanel>

                    <TabPanel>
                        <Box position='relative' padding='10'>
                            <Divider />
                            <AbsoluteCenter bg='white' px='4'>
                                <Text fontSize='3xl'>❤️Domain Layer</Text>
                            </AbsoluteCenter>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default App
