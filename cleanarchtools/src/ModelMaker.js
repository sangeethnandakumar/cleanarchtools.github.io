import AstParser from "./AstParser";
import * as changeCase from 'change-case';
export const ModelMaker = (function () {

    return {
        makeClass: function (name, json) {
            let ast = AstParser.parse(json);

            let props = ``;
            ast.forEach((node) => {
                props += `      public ${node.kind} ${changeCase.pascalCase(node.name) } {get; set;}\n`;
            });

            const content = `public sealed class ${name}
{
${props}}
`;
            return content;
        },
        makeRecord: function (name, json) {
            let ast = AstParser.parse(json);

            let props = ``;
            ast.forEach((node) => {
                props += `      ${node.kind} ${changeCase.pascalCase(node.name) },\n`;
            });

            const content = `public sealed record ${name}(
${props});
`;
            return content
        }
    };
})();

export default ModelMaker;
