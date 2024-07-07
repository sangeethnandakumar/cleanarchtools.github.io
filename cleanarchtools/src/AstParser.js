const AstParser = (function () {
    function parseValue(value) {
        if (typeof value === 'string') {
            // Check for specific types like Guid or DateTime
            if (value.match(/^\{?[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\}?$/i)) {
                return { kind: 'Guid', value };
            } else if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/i) || value.match(/^\d{2}-\d{2}-\d{4}\s\d{2}:\d{2}\s(?:AM|PM)$/i)) {
                return { kind: 'DateTime', value };
            } else {
                return { kind: 'string', value };
            }
        } else if (typeof value === 'number') {
            if (Number.isInteger(value)) {
                return { kind: 'int', value };
            } else if (Number.isFinite(value)) {
                return { kind: 'float', value };
            } else {
                return { kind: 'decimal', value };
            }
        } else if (typeof value === 'boolean') {
            return { kind: 'bool', value };
        } else if (value === null) {
            return { kind: 'null', value };
        } else if (Array.isArray(value)) {
            return parseArray(value);
        } else if (typeof value === 'object') {
            if (Object.keys(value).length === 0) {
                return { kind: 'object', value };
            } else {
                return { kind: 'object', value: parseObject(value) };
            }
        } else {
            throw new Error('Unsupported value type');
        }
    }

    function parseArray(arr) {
        if (arr.length === 0) {
            return { kind: 'List<object>', value: [] };
        }
        const firstType = parseValue(arr[0]).kind;
        const isHomogeneous = arr.every(item => parseValue(item).kind === firstType);

        if (isHomogeneous) {
            return { kind: `List<${firstType}>`, value: arr.map(item => parseValue(item)) };
        } else {
            return { kind: 'List<object>', value: arr.map(item => parseValue(item)) };
        }
    }

    function parseObject(obj) {
        const result = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const parsedValue = parseValue(value);
                result.push({ name: key, ...parsedValue });
            }
        }
        return result;
    }

    return {
        parse: function (jsonString) {
            try {
                const parsedObject = JSON.parse(jsonString);
                if (typeof parsedObject === 'object' && parsedObject !== null) {
                    return parseObject(parsedObject);
                } else {
                    throw new Error('Invalid JSON format');
                }
            } catch (e) {
                return [];
            }
        }
    };
})();

export default AstParser;