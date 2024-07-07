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
import { Button, Stack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
function ApplicationLayer({ design }) {
    
    const [queryHandlerId, setQueryHandlerId] = useState('');
    const [queryHandlerAll, setQueryHandlerAll] = useState('');
    const [commandCreateHandler, setCommandCreateHandler] = useState('');
    const [validator, setValidator] = useState('');
    const [singleQueryValidator, setSingleQueryValidator] = useState('');
    const [allQueryValidator, setAllQueryValidator] = useState('');
    const [mappingProfile, setMappingProfile] = useState('');


    const toast = useToast();

    useEffect(() => {

        let ast = AstParser.parse(design.json);
        let maps = ast.filter(x => x.name != 'id')
            .map(node => {
                if (node.kind == 'DateTime') {
                    return `              DateTime.ParseExact(request.${changeCase.pascalCase(node.name)}, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture, DateTimeStyles.None)`;
                }
                if (node.kind == 'Guid') {
                    return `              Guid.Parse(request.${changeCase.pascalCase(node.name)})`;
                }
                return `              request.${changeCase.pascalCase(node.name)}`;
    })
            .join(',\n');

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
            logger.LogInformation("Validation errors: {@ValidationErrors}", validationResult.ToStandardDictionary());
            return new Result<${changeCase.pascalCase(design.entity)}Dto>(new ValidationException(validationResult.Errors));
        }


        //Proceed
        var queryResult = await dbContext.${changeCase.pascalCase(pluralize(design.entity))}.FirstOrDefaultAsync(x => x.Id == Guid.Parse(request.Id));
        if(queryResult is null)
        {
            logger.LogInformation("No data found for id: {@Id}", request.Id);
            return new Result<TrackDto>(new DataException($"No data found for id: {request.Id}"));
        }
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
            logger.LogInformation("Validation errors: {@ValidationErrors}", validationResult.ToStandardDictionary());
            return new Result<IEnumerable<${changeCase.pascalCase(design.entity)}Dto>>(new ValidationException(validationResult.Errors));
        }


        //Proceed
        var queryResult = await dbContext.${changeCase.pascalCase(pluralize(design.entity))}.ToListAsync();
        if(queryResult is null)
        {
            logger.LogInformation("No data found for id: {@Id}", request.Id);
            return new Result<TrackDto>(new DataException($"No data found for id: {request.Id}"));
        }
        var result = mapper.Map<IEnumerable<${changeCase.pascalCase(design.entity)}Dto>>(queryResult);
        
        //Complete
        return new Result<IEnumerable<${changeCase.pascalCase(design.entity)}Dto>>(result);
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
            logger.LogInformation("Validation errors: {@ValidationErrors}", validationResult.ToStandardDictionary());
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
        let rules = ast.filter(f => f.name != 'id').map(node => {
            switch (node.kind) {
                case 'string':
                    return `        RuleFor(x => x.${changeCase.pascalCase(node.name)})\n                .NotEmpty().WithMessage("Is required.");`;
                case 'bool':
                    return `        RuleFor(x => x.${changeCase.pascalCase(node.name)})\n                .Equal(true).WithMessage("Is required.");`;
                case 'int':
                case 'float':
                case 'decimal':
                    return `        RuleFor(x => x.${changeCase.pascalCase(node.name)})\n                .InclusiveBetween(0, 1000).WithMessage("Should be between 0-1000.");`;
                case 'DateTime':
                    return `        RuleFor(x => x.${changeCase.pascalCase(node.name)})\n                .NotEmpty().WithMessage("Is required.")\n                .Must(date => DateTime.TryParseExact(date.ToString(), "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))\n                .WithMessage("Must be a valid date in ISO 8601 (yyyy-MM-ddTHH:mm:ss.fffZ) UTC format.");`;
                case 'Guid':
                    return `        RuleFor(x => x.${changeCase.pascalCase(node.name)})\n                .NotEmpty().WithMessage("Is required.")\n                .Must(id => Guid.TryParse(id, out _)).WithMessage("Must be a valid GUID.");`;
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
    public Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Is required.")
            .Must(id => Guid.TryParse(id, out _)).WithMessage("Must be a valid GUID.");
    }
}`;
        setSingleQueryValidator(singleValidator);

        const allValidator = `public sealed class Get${changeCase.pascalCase(pluralize(design.entity))}QueryValidator : AbstractValidator<Get${changeCase.pascalCase(pluralize(design.entity))}Query>
{
    public Get${changeCase.pascalCase(pluralize(design.entity))}QueryValidator()
    {
    }
}`;
        setAllQueryValidator(allValidator);

        let members = ast.filter(x=>x.kind == 'DateTime').map(node =>
            `       .ForMember(dest => dest.${changeCase.pascalCase(node.name)}, opt => opt.MapFrom(src => src.${changeCase.pascalCase(node.name)}.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")))`
        ).join('\n');
        members += ";"

        const mapProfile = `//${changeCase.pascalCase(pluralize.singular(design.entity))} → ${changeCase.pascalCase(pluralize.singular(design.entity))}Dto
CreateMap<${changeCase.pascalCase(pluralize.singular(design.entity))}, ${changeCase.pascalCase(pluralize.singular(design.entity))}Dto>()
${members}
`;
        setMappingProfile(mapProfile);

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
                                isRecord={true}/>
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`MappingProfile.cs`}</Text>
                            <Stack direction='row' spacing={0} align='center' m={6}>
                                <Button colorScheme='teal' variant='outline' onClick={() => {
                                    navigator.clipboard.writeText(mappingProfile);
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
                                {mappingProfile}
                            </SyntaxHighlighter>
                        </Box>
                    </TabPanel>

                    

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query.cs`}</Text>
                            <Stack direction='row' spacing={0} align='center' m={6}>
                                <Button colorScheme='teal' variant='outline' onClick={() => {
                                    navigator.clipboard.writeText(`public sealed record Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query(string Id) : IRequest<Result<${changeCase.pascalCase(pluralize.singular(design.entity))}Dto>>;`);
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
                                {`public sealed record Get${changeCase.pascalCase(pluralize.singular(design.entity))}Query(string Id) : IRequest<Result<${changeCase.pascalCase(pluralize.singular(design.entity))}Dto>>;`}
                            </SyntaxHighlighter>
                        </Box>

                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize(design.entity))}Query.cs`}</Text>
                            <Stack direction='row' spacing={0} align='center' m={6}>
                                <Button colorScheme='teal' variant='outline' onClick={() => {
                                    navigator.clipboard.writeText(`public sealed record Get${changeCase.pascalCase(pluralize(design.entity))}Query() : IRequest<Result<IEnumerable<${changeCase.pascalCase(pluralize.singular(design.entity))}Dto>>>;`);
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
                                {`public sealed record Get${changeCase.pascalCase(pluralize(design.entity))}Query() : IRequest<Result<IEnumerable<${changeCase.pascalCase(pluralize.singular(design.entity))}Dto>>>;`}
                            </SyntaxHighlighter>
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command.cs`}</Text>
                            <ModelViewer
                                name={`Create${changeCase.pascalCase(pluralize.singular(design.entity))}Command`}
                                json={design.json}
                                isRecord={true}
                                excludeId={true}
                                isCqrs={true}
                                hasStringGuids={true}
                            />
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryValidator.cs`}</Text>
                            <Stack direction='row' spacing={0} align='center' m={6}>
                                <Button colorScheme='teal' variant='outline' onClick={() => {
                                    navigator.clipboard.writeText(singleQueryValidator);
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
                                {singleQueryValidator}
                            </SyntaxHighlighter>
                        </Box>

                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize(design.entity))}QueryValidator.cs`}</Text>
                            <Stack direction='row' spacing={0} align='center' m={6}>
                                <Button colorScheme='teal' variant='outline' onClick={() => {
                                    navigator.clipboard.writeText(allQueryValidator);
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
                                {allQueryValidator}
                            </SyntaxHighlighter>
                        </Box>

                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandValidator.cs`}</Text>
                            <Stack direction='row' spacing={0} align='center' m={6}>
                                <Button colorScheme='teal' variant='outline' onClick={() => {
                                    navigator.clipboard.writeText(validator);
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
                                {validator}
                            </SyntaxHighlighter>
                        </Box>

                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize.singular(design.entity))}QueryHandler.cs`}</Text>
                            <Stack direction='row' spacing={0} align='center' m={6}>
                                <Button colorScheme='teal' variant='outline' onClick={() => {
                                    navigator.clipboard.writeText(queryHandlerId);
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
                                {queryHandlerId}
                            </SyntaxHighlighter>
                        </Box>

                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Get${changeCase.pascalCase(pluralize(design.entity))}QueryHandler.cs`}</Text>
                            <Stack direction='row' spacing={0} align='center' m={6}>
                                <Button colorScheme='teal' variant='outline' onClick={() => {
                                    navigator.clipboard.writeText(queryHandlerAll);
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
                                {queryHandlerAll}
                            </SyntaxHighlighter>
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Box w='100%' p={4} color='black'>
                            <Text fontSize='2xl'>{`Create${changeCase.pascalCase(pluralize.singular(design.entity))}CommandHandler.cs`}</Text>
                            <Stack direction='row' spacing={0} align='center' m={6}>
                                <Button colorScheme='teal' variant='outline' onClick={() => {
                                    navigator.clipboard.writeText(commandCreateHandler);
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