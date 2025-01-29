type Severity = "error" | "warning" | "info" | "success";

export interface ErrorHandlerProps {
  message: string;
  severity: Severity;
}