export interface PreRegistrationForm {
  id: string;
  title: string;
  notes: string;
  noticeTitle: string;
  noticeInformation: string;
  redirectLink: string;
  deadlineAt: string;
  selectable: boolean;
  selectableGroups: string[];
  job: {
    id: string;
    kind: string;
    photoDateFrom: string;
    photoDateTo: string | null;
  };
}

export interface PreRegistrationFormResponse {
  success: boolean;
  statusCode: number;
  message: string;
  traceId: string;
  data: PreRegistrationForm;
}

export interface PreRegistrationSubmitResponse {
  success: boolean;
  statusCode: number;
  message: string;
  traceId: string;
  data: {
    registration: {
      id: string;
      name: string;
      email: string;
      group: string;
    };
    accessCard: {
      id: string;
      password: string;
      name: string;
      group: string;
    };
    album: {
      id: string;
    };
    redirectLink: string;
  };
}

export interface PreRegistrationValidationIssue {
  code: string;
  path: string[];
  message: string;
}

export interface PreRegistrationFormError {
  statusCode: number;
  error: string;
  message: string;
  traceId: string;
  errors?: PreRegistrationValidationIssue[];
}

export interface PreRegistrationSuccessData {
  accessCardPassword: string;
  group: string;
  redirectLink: string;
}
