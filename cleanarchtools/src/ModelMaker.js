import AstParser from "./AstParser";
import * as changeCase from 'change-case';

export const ModelMaker = (function () {
    return {
        makeClass: function (name, json, excludeId, isCqrs, hasStringGuids) {
            let ast = AstParser.parse(json);

            if (excludeId) {
                ast = ast.filter(x => x.name != 'id');
            }

            let props = ``;
            ast.forEach((node, index) => {
                if (node.kind === 'DateTime') {
                    node.kind = 'string';
                }
                if (hasStringGuids && node.kind === 'Guid') {
                    node.kind = 'string';
                }
                props += `      public ${node.kind} ${changeCase.pascalCase(node.name)} { get; set; }`;
                if (index !== ast.length - 1) {
                    props += `\n`;
                }
            });

            let cqrs = ``;
            if (isCqrs) {
                cqrs = ` : IRequest<Result<Guid>>`
            }

            const content = `public sealed class ${name}
{
${props}${cqrs}`;
            return content;
        },
        makeRecord: function (name, json, excludeId, isCqrs, hasStringGuids) {
            let ast = AstParser.parse(json);

            if (excludeId) {
                ast = ast.filter(x => x.name != 'id');
            }

            let props = ``;
            ast.forEach((node, index) => {
                if (node.kind === 'DateTime') {
                    node.kind = 'string';
                }
                if (hasStringGuids && node.kind === 'Guid') {
                    node.kind = 'string';
                }
                props += `      ${node.kind} ${changeCase.pascalCase(node.name)}`;
                if (index !== ast.length - 1) {
                    props += `,`;
                }
                props += `\n`;
            });

            let cqrs = ``;
            if (isCqrs) {
                cqrs = ` : IRequest<Result<Guid>>`
            }

            const content = `public sealed record ${name}(
${props})${cqrs};`;
            return content;
        }
    };
})();

export default ModelMaker;
