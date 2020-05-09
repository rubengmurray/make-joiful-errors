
import joi from 'joi';

/**
 * The returned error interface
 */
interface ErrorResponse {
  [key: string]: {
    currentValue: string;
    currentType: string;
  }
}

/**
 * Options that can be passed to the joiErrorFormatter
 */
interface ErrorOptions {
  showErrorIndexes?: boolean;
}

/**
 * Custom error formatter for joi
 */
export function joiErrorFormatter(
  { details }: joi.ValidationError,
  { showErrorIndexes }: ErrorOptions = {}
): void {

  const errorResponseObj: ErrorResponse = {};

  // Loop through each error
  details.forEach(e => {
    let path: string;

    // Optionally choose whether to show the exact index where a validation error occured
    // Not showing array indexes de-duplicates cases where same validation error is occurring multiple times in an array
    if (showErrorIndexes) {
      path = `${e.path.map(p => (typeof p === 'number' ? `[${p}]` : p)).join('.')}`;
    } else {
      path = `${e.path.filter(p => typeof p !== 'number').join('.')}`;
    }

    const currentValue = e.context ? e.context.value : undefined;

    // Replace the escaped key character in the error message with our formatted one
    const errorMessage = `${e.message.replace(/\".*\"/g, path)}`;

    const errorDetails = {
      currentValue: currentValue !== undefined ? currentValue : 'unable to determine current value',
      currentType: currentValue !== undefined ? typeof currentValue : 'unable to determine current value type'
    };

    errorResponseObj[errorMessage] = errorDetails;
  });

  throw Error(JSON.stringify(errorResponseObj, null, 4));
}

/**
 * Optional wrapper for joi validate
 */
export function joiValidateWrapper<T>(
  data: T,
  schema: joi.SchemaLike,
  validationOptions: joi.ValidationOptions,
  errorOptions?: ErrorOptions
): joi.ValidationResult<T> {

  const res = joi.validate(data, schema, validationOptions);

  if (res.error) {
    joiErrorFormatter(res.error, errorOptions);
  }

  return res;
}