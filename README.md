### make-joiful-errors

Return errors as objects for better readability.

Designed for use against large schemas in conjunction with the `{ abortEarly: false }` `joi.validate` option, but can be used by anyone wanting to format joi errors differently.

> Tested with joi@14.3.1

Examples:

## joiErrorFormatter { showErrorIndexes: false }
```javascript
// De-duplicates the same type of validation error
Error: {
    "myObj.myKey.mySubKey is not allowed": {
        "currentValue": true,
        "currentType": "boolean"
    },
    "myObj.myKey2 is not allowed": {
        "currentValue": 5,
        "currentType": "number"
    },
}
```

## joiErrorFormatter { showErrorIndexes: true }
```javascript
// Will show the same type of validation error multiple times
Error: {
    "myObj.[0].myKey.mySubKey is not allowed": {
        "currentValue": true,
        "currentType": "boolean"
    },
    "myObj.[0].myKey2 is not allowed": {
        "currentValue": 5,
        "currentType": "number"
    },
    "myObj.[1].myKey.mySubKey is not allowed": {
        "currentValue": true,
        "currentType": "boolean"
    },
    "myObj.[1].myKey2 is not allowed": {
        "currentValue": 5,
        "currentType": "number"
    },

```

Also exports an optional wrapper for `joi.validate`

```javascript

/**
 * Options that can be passed to joiErrorFormatter
 */
interface ErrorOptions {
  showErrorIndexes?: boolean;
}

// ---- EXAMPLE USAGE

/**
 * Use the error formatter directly when there is an error
 */
const res = joi.validate(data, schema, validationOptions);

if (res.error) {
  joiErrorFormatter(res.error, { showErrorIndexes: false });
}

// ---- OPTIONAL WRAPPER

/**
 * Call the wrapper as you would joi.validate with an extra argument for the error formatter
 */
joiValidateWrapper(data, joiSchema, joiValidateOptions, { showErrorIndexes: true })
```
