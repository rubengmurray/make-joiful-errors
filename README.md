### make-joiful-errors

Return errors as objects for better readability.

Designed for use against large schemas in conjunction with the `{ abortEarly: false }` `joi.validate` option, but can be used by anyone wanting to format joi errors differently.

> Tested with joi@14.3.1

## Install
```
npm i make-joiful-errors
```

## Usage

The module exports two functions, `joiErrorFormatter` & `joiValidateWrapper`.

Both take an `ErrorOptions` argument.

```javascript
/**
 * Options that can be passed to joiErrorFormatter
 */
interface ErrorOptions {
  showErrorIndexes?: boolean;
}
```

`showErrorIndexes` declares whether to return array indexes of each joi `ValidationError`. Setting `{ showErrorIndexes: false }` de-duplicates the exact same `ValidiationError` from being returned (see below).

```javascript
import { joiErrorFormatter, joiValidateWrapper } from 'make-joiful-errors'

/**
 * Use the error formatter directly when there is an error
 */

// ... all of your standard joi schemas configured above here

// Standard joi
const res = joi.validate(data, schema, validationOptions);

// If there's an error, pass in the error and whether you want to sho
if (res.error) {
  joiErrorFormatter(res.error, { showErrorIndexes: false });
}

// ---- OPTIONAL WRAPPER

/**
 * Call the wrapper as you would joi.validate with an extra argument for the error formatter
 */
const res = joiValidateWrapper(data, joiSchema, joiValidateOptions, { showErrorIndexes: true })
```


Response comparison:

## joi 14.3.1
```javascript
// joiOptions = { abortEarly: false }
ValidationError: child "myObj" fails because ["myObj" at position 0 fails because [child "myKey" fails because ["mySubKey" is not allowed], "myKey" is not allowed, "myKey" is not allowed], "myObj" at position 1 fails because [child "myKey" fails because ["mySubKey" is not allowed], "myKey" is not allowed, "myKey" is not allowed], "myObj" at position 2 fails because [child "myKey" fails because ["mySubKey" is not allowed], "myKey" is not allowed, "myKey" is not allowed], "myObj" at position 3 fails because [child "myKey" fails because ["mySubKey" is not allowed], "myKey" is not allowed, "myKey" is not allowed], "myObj" at position 4 fails because [child "myKey" fails because ["mySubKey" is not allowed], "myKey" is not allowed, "myKey" is not allowed], "myObj" at position 5 fails because [child "myKey" fails because ["mySubKey" is not allowed], "myKey" is not allowed, "myKey" is not allowed]]
```


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
    "myObj.myKey3 is not allowed": {
        "currentValue": null,
        "currentType": "object" // This is the node response for typeof null
    }
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
    "myObj.[0].myKey3 is not allowed": {
        "currentValue": null,
        "currentType": "object"
    },
    "myObj.[1].myKey.mySubKey is not allowed": {
        "currentValue": true,
        "currentType": "boolean"
    },
    "myObj.[1].myKey2 is not allowed": {
        "currentValue": 5,
        "currentType": "number"
    },
    "myObj.[1].myKey3 is not allowed": {
        "currentValue": null,
        "currentType": "object"
    },

```
