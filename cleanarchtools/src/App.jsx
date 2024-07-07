import { Box, Text, FormControl, AbsoluteCenter, FormLabel, Input } from '@chakra-ui/react'
import { useState } from 'react'
import Editor from '@monaco-editor/react';
import PresentationLayer from './PresentationLayer';
import ApplicationLayer from './ApplicationLayer';
import DomainLayer from './DomainLayer';
import { Highlight, Heading } from '@chakra-ui/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Divider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import PersistanceLayer from './PersistanceLayer';


function App() {

    const [design, setDesign] = useState({
        entity: "Employee",
        json: `{
    "id": "b50808cb-0d3b-4159-b313-617e95ac5d8d",
	"name": "Sangeeth",
	"isDeveloper": true,
	"age": 27,
	"dob": "1996-10-28T11:12:00.000Z"
}`
    });

    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>🌍 Clean Architecture Tools</Tab>
                    <Tab>🏅 Layer References</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Tabs>
                            <TabList>
                                <Tab>⚒️ Design</Tab>
                                <Tab>💙 Domain Layer</Tab>
                                <Tab>🎯 Application Layer</Tab>
                                <Tab>🎭 Presentation Layer</Tab>
                                <Tab>📂 Persistance Layer</Tab>
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
                                                ⚒️ Design An Entity
                                            </Highlight>
                                        </Heading>
                                        <Box position='relative' padding='10'>

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
                                                theme="vs-light"
                                                height="25vh"
                                                defaultLanguage="csharp"
                                                defaultValue={design.json}
                                                onChange={(value, event) => setDesign({ ...design, json: value })} />
                                        </Box>
                                    </Box>
                                </TabPanel>

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

                                <TabPanel>
                                    <Box position='relative' padding='10'>
                                        <Divider />
                                        <Heading lineHeight='tall'>
                                            <Highlight
                                                query={['EFCore']}
                                                styles={{ px: '2', py: '1', rounded: 'full', bg: 'green.100' }}
                                            >
                                                📂 Persistance Layer with EFCore
                                            </Highlight>
                                        </Heading>
                                    </Box>
                                    <PersistanceLayer design={design} />
                                </TabPanel>

                            </TabPanels>
                        </Tabs>
                    </TabPanel>
                    <TabPanel>
                        <Box position='relative' padding='10'>
                            <Heading lineHeight='tall'>
                                <Highlight
                                    query={['Entities', 'ValueObjects', 'Domain Events']}
                                    styles={{ px: '2', py: '1', rounded: 'full', bg: 'blue.100' }}
                                >
                                    💫 Reference Extensions
                                </Highlight>
                            </Heading>
                            <Box w='100%' p={4} color='black'>
                                <Tabs>
                                    <TabList>
                                        <Tab>API Layer</Tab>
                                        <Tab>Domain Layer</Tab>
                                        <Tab>Application Layer</Tab>
                                        <Tab>Presentation Layer</Tab>
                                        <Tab>Persistance Layer</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel>
                                            <Tabs>
                                                <TabList>
                                                    <Tab>Program.cs</Tab>
                                                    <Tab>ApiServiceInstaller</Tab>
                                                    <Tab>ApplicationServiceInstaller</Tab>
                                                    <Tab>PersistanceServiceInstaller</Tab>
                                                    <Tab>PresentationServiceInstaller</Tab>
                                                </TabList>
                                                <TabPanels>
                                                    <TabPanel>
                                                        <Box w='100%' p={4} color='black'>
                                                            <Text fontSize='2xl'>{`Program.cs`}</Text>
                                                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                                                {`var builder = WebApplication.CreateBuilder(args);

//Install all dependencies
DiscoverAndInstallDependencies(builder.Host, builder.Services, builder.Configuration, Assembly.GetExecutingAssembly());

var app = builder.Build();

// ... ... ...
// ... ... ...
// ... ... ...

app.MapCarter();

// ... ... ...
// ... ... ...
// ... ... ...

static void DiscoverAndInstallDependencies(IHostBuilder host, IServiceCollection services, IConfiguration configuration, Assembly assembly)
{
    var installers = assembly.GetTypes()
        .Where(t => typeof(IServiceInstaller).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract)
        .Select(Activator.CreateInstance)
        .Cast<IServiceInstaller>()
        .ToList();

    installers.ForEach(installer => installer.InstallService(host, services, configuration));
}
`}
                                                            </SyntaxHighlighter>
                                                        </Box>
                                                    </TabPanel>

                                                    <TabPanel>
                                                        <Box w='100%' p={4} color='black'>
                                                            <Text fontSize='2xl'>{`ApiServiceInstaller.cs`}</Text>
                                                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                                                {`//ApiServiceInstaller\npublic sealed class ApiServiceInstaller : IServiceInstaller
{
    public void InstallService(IHostBuilder host, IServiceCollection services, IConfiguration configuration)
    {
        var seqApiKey = configuration.GetConnectionString("Seq");

        //Serilog + Seq
        host.UseSerilog((context, services, configuration) =>
        {
            configuration
                .MinimumLevel.Information()
                .Enrich.FromLogContext()
                .Filter.ByExcluding(Matching.FromSource("Microsoft.AspNetCore"))
                .Filter.ByExcluding(Matching.FromSource("Microsoft.Hosting"))
                .Filter.ByExcluding(Matching.FromSource("Microsoft.AspNetCore.Mvc"))
                .WriteTo.Console(outputTemplate: "{Timestamp:dd/MM/yy hh:mm:ss tt} [{Level:u3}] {Message}{NewLine}{Exception}")
                .WriteTo.Async(x => x.Seq("https://seq.twileloop.com", apiKey: seqApiKey));
        });
    }
}`}
                                                            </SyntaxHighlighter>
                                                        </Box>
                                                    </TabPanel>

                                                    <TabPanel>
                                                        <Box w='100%' p={4} color='black'>
                                                            <Text fontSize='2xl'>{`ApplicationServiceInstaller.cs`}</Text>
                                                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                                                {`//ApplicationServiceInstaller
public sealed class ApplicationServiceInstaller : IServiceInstaller
{
    public void InstallService(IHostBuilder host, IServiceCollection services, IConfiguration configuration)
    {
        //MediatR
        services.AddMediatR(c => c.RegisterServicesFromAssemblyContaining<IAppDBContext>());

        //Automapper
        services.AddAutoMapper(typeof(MappingProfile));

        //Fluent Validator
        services.AddValidatorsFromAssemblyContaining<IAppDBContext>(ServiceLifetime.Singleton);
    }
}`}
                                                            </SyntaxHighlighter>
                                                        </Box>
                                                    </TabPanel>

                                                    <TabPanel>
                                                        <Box w='100%' p={4} color='black'>
                                                            <Text fontSize='2xl'>{`PersistanceServiceInstaller.cs`}</Text>
                                                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                                                {`//PersistanceServiceInstaller
public sealed class PersistanceServiceInstaller : IServiceInstaller
{
    public void InstallService(IHostBuilder host, IServiceCollection services, IConfiguration configuration)
    {
        //EF Core
        var connectionString = configuration.GetConnectionString("TrackerDB");
        var dbName = "TrackerDB";
        services.AddDbContext<AppDBContext>(options => options.UseMongoDB(connectionString, dbName));
        services.AddScoped<IAppDBContext, AppDBContext>();
    }
}`}
                                                            </SyntaxHighlighter>
                                                        </Box>
                                                    </TabPanel>

                                                    <TabPanel>
                                                        <Box w='100%' p={4} color='black'>
                                                            <Text fontSize='2xl'>{`PresentationServiceInstaller.cs`}</Text>
                                                            <SyntaxHighlighter language="csharp" style={solarizedlight}>
                                                                {`//PresentationServiceInstaller
public sealed class PresentationServiceInstaller : IServiceInstaller
{
    public void InstallService(IHostBuilder host, IServiceCollection services, IConfiguration configuration)
    {
        //Carter
        services.AddCarter();

        //Redis Cache
        var redisConnectionString = configuration.GetConnectionString("Redis");
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisConnectionString;
            options.InstanceName = "TrackerCache";
        });
    }
}`}
                                                            </SyntaxHighlighter>
                                                        </Box>
                                                    </TabPanel>
                                                </TabPanels>
                                            </Tabs>
                                        </TabPanel>

                                        <TabPanel>
                                        </TabPanel>

                                        <TabPanel>
                                        </TabPanel>

                                        <TabPanel>
                                        </TabPanel>

                                        <TabPanel>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Box>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default App
