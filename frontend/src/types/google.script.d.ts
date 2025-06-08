import type {
  answerTypeResponse,
  ClassType,
  formTypeResponse,
} from "@/type/type";

export {};

declare global {
  interface GoogleAppsScriptRun {
    // Google Apps Script default methods
    withSuccessHandler: <T = unknown>(
      callback: (result: T) => void,
    ) => GoogleAppsScriptRun;
    withFailureHandler: (
      callback: (error: Error) => void,
    ) => GoogleAppsScriptRun;

    // Custom methods
    // If you add a new method to the main.ts file, add it here
    getAppUrl: () => string;
    getWorkRequestForms: () => formTypeResponse[];
    getClasses: () => Promise<ClassType[]>;
    getWorkRequestAnswers: (formId: string) => answerTypeResponse[];
    answerRecord: (data: {
      formId: string;
      classId: string;
      userId: string;
      doWork: boolean;
      startTime: string | null;
    }) => void;
    checkStudentData: (data: {
      studentId: string;
      lastNameKana: string;
      firstNameKana: string;
    }) => boolean;
    createUser: (data: {
      studentId: string;
      name: string;
    }) => Promise<
      { success: true; userId: string } | { success: false; message?: string }
    >;
    getUserData: (userId: string) => Promise<{
      userId: string;
      createdAt: string;
      studentId: string;
      name: string;
    } | null>;
  }

  interface Window {
    google: {
      script: {
        run: GoogleAppsScriptRun;
      };
    };
  }
}
