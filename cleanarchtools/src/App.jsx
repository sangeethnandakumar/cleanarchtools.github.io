import { Box, Text, FormControl, AbsoluteCenter, FormLabel, Input } from '@chakra-ui/react'
import { useState } from 'react'
import Editor from '@monaco-editor/react';
import PresentationLayer from './PresentationLayer';
import ApplicationLayer from './ApplicationLayer';

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
                    onChange={(value, event) => setDesign({ ...design, json: value })}/>
            </Box>

            <ApplicationLayer design={design} />
            <PresentationLayer design={design} />

        </>
    )
}

export default App
