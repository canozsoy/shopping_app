import { ValidationError } from 'joi';

const formatString = (val:string):string => val.replace(/"/g, '');

const firstCaseUpper = (val:string):string => val.charAt(0).toUpperCase() + val.slice(1);

function formatErrorValidationMessage(error:ValidationError) {
  return error.details.map((x) => ({
    message: firstCaseUpper(formatString(x.message)),
    key: x?.context?.key,
  }));
}

function formatErrorDBMessage(error:any) {
  return error.errors.map((x:any) => ({
    message: firstCaseUpper(x.message),
    key: x.path,
    value: x.value,
  }));
}

export {
  formatErrorValidationMessage,
  formatErrorDBMessage,
};
