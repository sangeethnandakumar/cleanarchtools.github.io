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

function ApplicationLayer({ design }) {
    
    const [queryHandlerId, setQueryHandlerId] = useState('');
    const [queryHandlerAll, setQueryHandlerAll] = useState('');
    const [commandCreateHandler, setCommandCreateHandler] = useState('');

    useEffect(() => {

        let ast = AstParser.parse(design.json);
        let maps = ``;
        ast.forEach((node) => {
            maps += `                           request.${changeCase.pascalCase(node.name)},\n`;
        });

        const queryHandlerCode = `public sealed class Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryHandler : IRequestHandler<Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query, Result<${changeCase.pascalCase(design.entity)}Dto>>
    {
        private readonly ILogger<Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryHandler> logger;
        private readonly IAppDBContext dbContext;
        private readonly IMapper mapper;

        public Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryHandler(ILogger<Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryHandler> logger, IAppDBContext dbContext, IMapper mapper)
        {
            this.logger = logger;
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<Result<${changeCase.pascalCase(design.entity)}Dto>> Handle(Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query request, CancellationToken cancellationToken)
        {
            var queryResult = await dbContext.${changeCase.pascalCase(pluralize(design.entity))}.FirstOrDefaultAsync(x => x.Id == request.Id);
            var result = mapper.Map<${changeCase.pascalCase(design.entity)}Dto>(queryResult);
            return result;
        }
    }`;
        setQueryHandlerId(queryHandlerCode);

        const queryHandlerCodeAll = `public sealed class Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler : IRequestHandler<Get${changeCase.pascalCase(pluralize(design.entity))}Query, Result<IEnumerable<${changeCase.pascalCase(design.entity)}Dto>>>
    {
        private readonly ILogger<Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler> logger;
        private readonly IAppDBContext dbContext;
        private readonly IMapper mapper;

        public Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler(ILogger<Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler> logger, IAppDBContext dbContext, IMapper mapper)
        {
            this.logger = logger;
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<Result<IEnumerable<${changeCase.pascalCase(design.entity)}Dto>>> Handle(Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query request, CancellationToken cancellationToken)
        {
            var queryResult = await dbContext.${changeCase.pascalCase(pluralize(design.entity))}.ToListAsync();
            var result = mapper.Map<IEnumerable<${changeCase.pascalCase(design.entity)}Dto>>(queryResult);
            return result;
        }
    }`;
        setQueryHandlerAll(queryHandlerCodeAll);

        const commandCreateHandler = `public sealed class Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler : IRequestHandler<Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command, Result<Guid>>
    {
        private readonly ILogger<Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler> logger;
        private readonly IAppDBContext dbContext;

        public Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler(ILogger<Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler> logger, IAppDBContext dbContext)
        {
            this.logger = logger;
            this.dbContext = dbContext;
        }

        public async Task<Result<Guid>> Handle(Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command request, CancellationToken cancellationToken)
        {
            var result = await dbContext.${changeCase.pascalCase(pluralize(design.entity))}.AddAsync(new ${changeCase.pascalCase(design.entity) }(
${maps}
            ));

            await dbContext.SaveChangesAsync(cancellationToken);

            return result.Entity.Id;;
        }
    }`;
        setCommandCreateHandler(commandCreateHandler);

    }, [design.entity, design.json]);

    return (
        <>

            <Tabs>
                <TabList>
                    <Tab>DTOs</Tab>
                    <Tab>Mapping Profile</Tab>
                    <Tab>CQRS Queries</Tab>
                    <Tab>CQRS Commands</Tab>
                    <Tab>CQRS Query Handlers</Tab>
                    <Tab>CQRS Command Handlers</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`${changeCase.pascalCase(pluralize.singular(design.entity))}Dto.cs`}</Text>
                            <ModelViewer
                                name={`${changeCase.pascalCase(pluralize.singular(design.entity))}Dto`}
                                json={design.json}
                                isRecord={true} />
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query.cs`}</Text>
                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                {`public sealed record Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query(int Id);`}
                            </SyntaxHighlighter>
                        </Box>

                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize(design.entity))}Query.cs`}</Text>
                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                {`public sealed record Get${changeCase.pascalCase(pluralize(design.entity))}Query();`}
                            </SyntaxHighlighter>
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command.cs`}</Text>
                            <ModelViewer
                                name={`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command`}
                                json={design.json}
                                isRecord={true} />
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryHandler.cs`}</Text>
                            <h4 />
                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                {queryHandlerId}
                            </SyntaxHighlighter>
                        </Box>

                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler.cs`}</Text>
                            <h4 />
                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                {queryHandlerAll}
                            </SyntaxHighlighter>
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler.cs`}</Text>
                            <h4 />
                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                {commandCreateHandler}
                            </SyntaxHighlighter>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </>
    );

}

export default ApplicationLayer;