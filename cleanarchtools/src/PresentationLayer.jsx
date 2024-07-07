import { useState, useEffect } from 'react';
import { Box, Text, Divider, AbsoluteCenter } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import pluralize from 'pluralize';
import * as changeCase from 'change-case';
import ModelViewer from "./ModelViewer";
import AstParser from "./AstParser";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button, Stack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
function PresentationLayer({ design }) {
    const [editorContent, setEditorContent] = useState('');


    const toast = useToast();

    useEffect(() => {

        let ast = AstParser.parse(design.json);
        let maps = ``;
        maps = ast.filter(x => x.name != 'id').map((node) => {
            return `                    request.${changeCase.pascalCase(node.name)}`;
        }).join(',\n');

        let mapsWithId = ``;
        mapsWithId = ast.map((node) => {
            return `                    request.${changeCase.pascalCase(node.name)}`;
        }).join(',\n');

        const content = `public sealed class ${changeCase.pascalCase(pluralize(design.entity))}Module : CarterModule
{
    public ${changeCase.pascalCase(pluralize(design.entity))}Module() : base("${changeCase.kebabCase(pluralize(design.entity))}")
    {
        WithTags("${changeCase.pascalCase(pluralize(design.entity))}");
    }

    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        //GET
            app.MapGet("/", async (IMediator mediator) =>
            {
                var result = await mediator.Send(new Get${changeCase.pascalCase(pluralize(design.entity))}Query());
                return result.Match(
                    s => Results.Ok(s),
                    f => f switch
                    {
                        ValidationException validationException => Results.BadRequest(validationException.ToStandardResponse()),
                        DataException anotherException => Results.NotFound(anotherException.ToStandardResponse()),
                        _ => Results.UnprocessableEntity(f.Message)
                    });
            });


            //GET
            app.MapGet("/{id}", async ([FromRoute] string id, IMediator mediator) =>
            {
                var result = await mediator.Send(new Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query(id));
                return result.Match(
                    s => Results.Ok(s),
                    f => f switch
                    {
                        ValidationException validationException => Results.BadRequest(validationException.ToStandardResponse()),
                        DataException anotherException => Results.NotFound(anotherException.ToStandardResponse()),
                        _ => Results.UnprocessableEntity(f.Message)
                    });
            });


            //POST
            app.MapPost("/", async (Create${changeCase.pascalCase(pluralize.singular(design.entity))}Request request, IMediator mediator) =>
            {
                var result = await mediator.Send(new Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command(
${maps}
                ));

                return result.Match(
                        s => Results.Ok(s),
                        f => f switch
                        {
                            ValidationException validationException => Results.BadRequest(validationException.ToStandardResponse()),
                            DataException anotherException => Results.NotFound(anotherException.ToStandardResponse()),
                            _ => Results.UnprocessableEntity(f.Message)
                        });
            });

            //PUT
            app.MapPut("/{id}", async ([FromRoute] string id, Update${changeCase.pascalCase(pluralize.singular(design.entity))}Request request, IMediator mediator) =>
            {
                var result = await mediator.Send(new Update${changeCase.pascalCase(pluralize.singular(design.entity))}Command(
                    id,
${maps}
                ));

                return result.Match(
                        s => Results.Ok(s),
                        f => f switch
                        {
                            ValidationException validationException => Results.BadRequest(validationException.ToStandardResponse()),
                            DataException anotherException => Results.NotFound(anotherException.ToStandardResponse()),
                            _ => Results.UnprocessableEntity(f.Message)
                        });
            });


            //DELETE
            app.MapDelete("/{id}", async ([FromRoute] string id, IMediator mediator) =>
            {
                var result = await mediator.Send(new Delete${changeCase.pascalCase(pluralize.singular(design.entity))}Command(id));

                return result.Match(
                        s => Results.Ok(s),
                        f => f switch
                        {
                            ValidationException validationException => Results.BadRequest(validationException.ToStandardResponse()),
                            DataException anotherException => Results.NotFound(anotherException.ToStandardResponse()),
                            _ => Results.UnprocessableEntity(f.Message)
                        });
            });
    }
}`;

        setEditorContent(content);
    }, [design.entity, design.json]);

    return (
        <>

            <Tabs>
                <TabList>
                    <Tab>Carter Module + Minimal API</Tab>
                    <Tab>Request Models</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`${changeCase.pascalCase(pluralize(design.entity))}Module.cs`}</Text>
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
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Request.cs`}</Text>

                            <ModelViewer
                                name={`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Request`}
                                json={design.json}
                                isRecord={true}
                                excludeId={true}
                                hasStringGuids={true}
                            />

                        </Box>

                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Update${changeCase.pascalCase(pluralize.singular(design.entity))}Request.cs`}</Text>

                            <ModelViewer
                                name={`Update${changeCase.pascalCase(pluralize.singular(design.entity))}Request`}
                                json={design.json}
                                isRecord={true}
                                excludeId={false}
                                hasStringGuids={true}
                            />

                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </>
    );
}

export default PresentationLayer;
