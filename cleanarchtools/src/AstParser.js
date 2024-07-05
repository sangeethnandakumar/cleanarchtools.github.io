
const AstParser = (function () {
    function parseValue(value) {
        if (typeof value === 'string') {
            // Check for specific types like Guid or DateTime
            if (value.match(/^\{?[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\}?$/i)) {
                return { kind: 'Guid', value };
            } else if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/i)) {
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
        } else if (Array.isArray(value)) {
            return parseArray(value);
        } else if (typeof value === 'object' && value !== null) {
            return parseObject(value);
        } else {
            throw new Error('Unsupported value type');
        }
    }

    function parseArray(arr) {
        return arr.map(item => parseValue(item));
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