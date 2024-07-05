import { useState, useEffect } from 'react';
import { Box, Text, Divider, AbsoluteCenter } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import pluralize from 'pluralize';
import * as changeCase from 'change-case';
import ModelViewer from "./ModelViewer";

function PresentationLayer({ design }) {
    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        const content = `public sealed class ${changeCase.pascalCase(pluralize(design.entity))}Module : CarterModule
        {
            public ${changeCase.pascalCase(pluralize(design.entity))}Module() : base("${changeCase.kebabCase(pluralize(design.entity))}")
            {
                WithTags("${changeCase.pascalCase(pluralize(design.entity))}");
            }
        
            public override void AddRoutes(IEndpointRouteBuilder app)
            {
                //GET
                app.MapGet("/", async ([FromQuery] string id, IMediator mediator) =>
                {
                    var result = await mediator.Send(new Get${changeCase.pascalCase(pluralize(design.entity))}Query(id));
                    return result.Match(s => Results.Ok(s), f => Results.BadRequest(f.Message));
                });
        
                //POST
                app.MapPost("/", async (Create${changeCase.pascalCase(pluralize.singular(design.entity))}Request request, IMediator mediator) =>
                {
                    var result = await mediator.Send(new Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command(
                        request.Amount,
                        request.Note,
                        request.CatageoryId,
                        request.Kind,
                        request.AccountId
                    ));
                    return result.Match(s => Results.Ok(s), f => Results.BadRequest(f.Message));
                });
            }
        }`;

        setEditorContent(content);
    }, [design.entity, design.json]);

    return (
        <>
           

            <Box position='relative' padding='10'>
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    <Text fontSize='3xl'>🎭Presentation Layer</Text>
                </AbsoluteCenter>
            </Box>

            <Box w='100%' p={4} color='black'>
                <Text fontSize='2xl'>{`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Request.cs`}</Text>

                <ModelViewer
                    name={`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Request`}
                    json={design.json}
                    isRecord={true }/>
            </Box>

            <Box w='100%' p={4} color='black'>
                <Text fontSize='2xl'>{`${changeCase.pascalCase(pluralize(design.entity))}Module.cs | Carter Module`}</Text>
                <h4/>
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

export default PresentationLayer;
