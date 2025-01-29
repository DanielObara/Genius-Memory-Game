import Alert from '@mui/material/Alert';
import { ErrorHandlerProps } from './ErrorHandlerTypes';

const ErrorHandler = ({ message, severity }:ErrorHandlerProps) => {
  return (
    <Alert severity={severity}>{message}</Alert>
  )
}

export default ErrorHandler