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
    const [validator, setValidator] = useState('');
    const [singleQueryValidator, setSingleQueryValidator] = useState('');
    const [allQueryValidator, setAllQueryValidator] = useState('');

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
        private readonly IValidator<Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query> validator;


        public Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryHandler(ILogger<Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryHandler> logger, IAppDBContext dbContext, IMapper mapper, IValidator<Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query> validator)
        {
            this.logger = logger;
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.validator = validator;
        }

        public async Task<Result<${changeCase.pascalCase(design.entity)}Dto>> Handle(Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query request, CancellationToken cancellationToken)
        {
            //Validate
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                // Handle validation failures
                foreach (var error in validationResult.Errors)
                {
                    logger.LogError(error.ErrorMessage);
                }
                return new Result<Guid>(new ValidationException(validationResult.Errors));
            }

            //Proceed
            var queryResult = await dbContext.${changeCase.pascalCase(pluralize(design.entity))}.FirstOrDefaultAsync(x => x.Id == request.Id);
            var result = mapper.Map<${changeCase.pascalCase(design.entity)}Dto>(queryResult);
            
            //Complete
            return result;
        }
    }`;
        setQueryHandlerId(queryHandlerCode);

        const queryHandlerCodeAll = `public sealed class Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler : IRequestHandler<Get${changeCase.pascalCase(pluralize(design.entity))}Query, Result<IEnumerable<${changeCase.pascalCase(design.entity)}Dto>>>
    {
        private readonly ILogger<Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler> logger;
        private readonly IAppDBContext dbContext;
        private readonly IMapper mapper;
        private readonly IValidator<Get${changeCase.pascalCase(pluralize(design.entity))}Query> validator;


        public Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler(ILogger<Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler> logger, IAppDBContext dbContext, IMapper mapper, IValidator<Get${changeCase.pascalCase(pluralize(design.entity))}Query> validator)
        {
            this.logger = logger;
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.validator = validator;
        }

        public async Task<Result<IEnumerable<${changeCase.pascalCase(design.entity)}Dto>>> Handle(Get${changeCase.pascalCase(pluralize(design.entity))}Query request, CancellationToken cancellationToken)
        {
            //Validate
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                // Handle validation failures
                foreach (var error in validationResult.Errors)
                {
                    logger.LogError(error.ErrorMessage);
                }
                return new Result<Guid>(new ValidationException(validationResult.Errors));
            }

            //Proceed
            var queryResult = await dbContext.${changeCase.pascalCase(pluralize(design.entity))}.ToListAsync();
            var result = mapper.Map<IEnumerable<${changeCase.pascalCase(design.entity)}Dto>>(queryResult);
            
            //Complete
            return result;
        }
    }`;
        setQueryHandlerAll(queryHandlerCodeAll);

        const commandCreateHandler = `public sealed class Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler : IRequestHandler<Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command, Result<Guid>>
    {
        private readonly ILogger<Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler> logger;
        private readonly IAppDBContext dbContext;
        private readonly IValidator<Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command> validator;

        public Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler(ILogger<Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler> logger, IAppDBContext dbContext, IValidator<Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command> validator)
        {
            this.logger = logger;
            this.dbContext = dbContext;
            this.validator = validator;
        }

        public async Task<Result<Guid>> Handle(Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command request, CancellationToken cancellationToken)
        {
            //Validate
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                // Handle validation failures
                foreach (var error in validationResult.Errors)
                {
                    logger.LogError(error.ErrorMessage);
                }
                return new Result<Guid>(new ValidationException(validationResult.Errors));
            }

            //Create
            var result = await dbContext.${changeCase.pascalCase(pluralize(design.entity))}.AddAsync(new ${changeCase.pascalCase(design.entity) }(
${maps}
            ));
            await dbContext.SaveChangesAsync(cancellationToken);

            //Complete
            return result.Entity.Id;;
        }
    }`;
        setCommandCreateHandler(commandCreateHandler);

        // Generate rules
        let rules = ast.map(node => {
            switch (node.kind) {
                case 'string':
                    return `            RuleFor(x => x.${changeCase.pascalCase(pluralize.singular(node.name))})\n                   .NotEmpty().WithMessage("Is required.");`;
                case 'int':
                case 'float':
                case 'decimal':
                    return `            RuleFor(x => x.${changeCase.pascalCase(pluralize.singular(node.name))})\n                   .NotEmpty().WithMessage("Is required.").GreaterThan(0).WithMessage("Should be greater than 0.");`;
                case 'DateTime':
                    return `            RuleFor(x => x.${changeCase.pascalCase(pluralize.singular(node.name))})\n                   .NotEmpty().WithMessage("Is required.").Must(date => date !== null && date !== undefined && !isNaN(date.getTime())).WithMessage("Must be a valid date.");`;
                case 'Guid':
                    return `            RuleFor(x => x.${changeCase.pascalCase(pluralize.singular(node.name))})\n                   .NotEmpty().WithMessage("Is required.")\n                   .Must(guid => guid !== null && guid !== undefined && guid.match(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i)).WithMessage("Must be a valid GUID.");`;
                default:
                    return `// Handle unsupported kind '${node.kind}' for '${node.name}'.`;
            }
        }).join('\n');

        const validatorCode = `public sealed class Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandValidator : AbstractValidator<Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command>
    {
        public Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandValidator()
        {
${rules}
        }
    }`;
        setValidator(validatorCode);


        const singleValidator = `public sealed class Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryValidator : AbstractValidator<Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query>
    {
        public Get${changeCase.pascalCase(pluralize.singular(design.entity))}CommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Is required.")
                .Must(guid => guid !== null && guid !== undefined && guid.match(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i)).WithMessage("Must be a valid GUID.");
        }
    }`;
        setSingleQueryValidator(singleValidator);

        const allValidator = `public sealed class Get${changeCase.pascalCase(pluralize(design.entity))}QueryValidator : AbstractValidator<Get${changeCase.pascalCase(pluralize(design.entity))}Query>
    {
        public Get${changeCase.pascalCase(pluralize(design.entity))}CommandValidator()
        {
        }
    }`;
        setAllQueryValidator(allValidator);


    }, [design.entity, design.json]);

    return (
        <>

            <Tabs>
                <TabList>
                    <Tab>DTOs</Tab>
                    <Tab>Mapping Profile</Tab>
                    <Tab>CQRS Queries</Tab>
                    <Tab>CQRS Commands</Tab>
                    <Tab>FluentValidator</Tab>
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
                            <Text fontSize='2xl'>{`MappingProfile.cs`}</Text>
                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                {`//${changeCase.pascalCase(pluralize.singular(design.entity))} → ${changeCase.pascalCase(pluralize.singular(design.entity))}Dto\nCreateMap<${changeCase.pascalCase(pluralize.singular(design.entity))}, ${changeCase.pascalCase(pluralize.singular(design.entity))}Dto>();`}
                            </SyntaxHighlighter>                        </Box>
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
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryValidator.cs`}</Text>
                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                {singleQueryValidator}
                            </SyntaxHighlighter>
                        </Box>

                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize(design.entity))}QueryValidator.cs`}</Text>
                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                {allQueryValidator}
                            </SyntaxHighlighter>
                        </Box>

                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandValidator.cs`}</Text>
                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                {validator}
                            </SyntaxHighlighter>
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