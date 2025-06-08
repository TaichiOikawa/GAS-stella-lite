export type formType = {
  formId: string;
  formType: string;
  targetDate: string;
  deadline: Date;
  createdAt: Date;
};

export type formTypeResponse = {
  formId: string;
  formType: string;
  targetDate: string;
  deadline: string;
  createdAt: string;
};

export type answerType = {
  requestId: string;
  formId: string;
  classId: string;
  class: string;
  submittedAt: Date;
  doWork: boolean;
  startTime: Date | null;
};

export type answerTypeResponse = {
  requestId: string;
  formId: string;
  classId: string;
  class: string;
  submittedAt: string;
  doWork: boolean;
  startTime: string | null;
};

export type ClassType = {
  classId: string;
  grade: string;
  number: string;
};
