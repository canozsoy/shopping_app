import { ValidationError } from 'joi';

const formatString = (val:string):string => val.replace(/"/g, '');

const firstCaseUpper = (val:string):string => val.charAt(0).toUpperCase() + val.slice(1);

const formatErrorMessage = (error:ValidationError) => error.details.map((x) => firstCaseUpper(formatString(x.message)));

export default formatErrorMessage;
