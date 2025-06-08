import type {
  answerTypeResponse,
  ClassType,
  formTypeResponse,
} from "@/types/type";

type SuccessHandler<T = unknown> = (result: T) => void;

type MockFunctions = {
  getWorkRequestForms: (callback: SuccessHandler<formTypeResponse[]>) => void;
  getClasses: (callback: SuccessHandler<ClassType[]>) => void;
  getWorkRequestAnswers: (
    formId: string,
    callback: SuccessHandler<answerTypeResponse[]>,
  ) => void;
  answerRecord: (
    data: {
      formId: string;
      classId: string;
      userId: string;
      doWork: boolean;
      startTime: string | null;
    },
    callback: SuccessHandler<boolean>,
  ) => void;
  checkStudentData: (
    data: {
      studentId: string;
      classId: string;
      doWork: boolean;
      startTime: string | null;
    },
    callback: SuccessHandler<boolean>,
  ) => void;
  createUser: (
    data: {
      studentId: string;
      name: string;
    },
    callback: SuccessHandler<
      { success: true; userId: string } | { success: false; message?: string }
    >,
  ) => void;
  getUserData: (
    userId: string,
    callback: SuccessHandler<{
      userId: string;
      createdAt: string;
      studentId: string;
      name: string;
    } | null>,
  ) => void;
};

const mockFunctions: MockFunctions = {
  getWorkRequestForms: (callback) => {
    const forms: formTypeResponse[] = [
      {
        formId: "1",
        formType: "WORK_weekday",
        targetDate: "2025-06-05",
        deadline: new Date("2025-06-05T16:00:00").toISOString(),
        createdAt: new Date("2025-05-01T12:00:00").toISOString(),
      },
      {
        formId: "2",
        formType: "WORK_weekend",
        targetDate: "2025-06-06",
        deadline: new Date("2025-06-06T16:00:00").toISOString(),
        createdAt: new Date("2025-05-01T12:00:00").toISOString(),
      },
      {
        formId: "3",
        formType: "WORK_holiday",
        targetDate: "2025-06-07",
        deadline: new Date("2025-06-09T16:00:00").toISOString(),
        createdAt: new Date("2025-05-01T12:00:00").toISOString(),
      },
    ];
    setTimeout(() => callback(forms), 300);
  },
  getClasses: (callback) => {
    const classes: ClassType[] = [
      { classId: "1", grade: "1", number: "1" },
      { classId: "2", grade: "1", number: "2" },
      { classId: "3", grade: "1", number: "3" },
      { classId: "4", grade: "1", number: "4" },
      { classId: "5", grade: "1", number: "5" },
      { classId: "6", grade: "1", number: "6" },
      { classId: "7", grade: "2", number: "1" },
      { classId: "8", grade: "2", number: "2" },
      { classId: "9", grade: "2", number: "3" },
      { classId: "10", grade: "2", number: "4" },
      { classId: "11", grade: "2", number: "5" },
      { classId: "12", grade: "2", number: "6" },
      { classId: "13", grade: "3", number: "1" },
      { classId: "14", grade: "3", number: "2" },
      { classId: "15", grade: "3", number: "3" },
      { classId: "16", grade: "3", number: "4" },
      { classId: "17", grade: "3", number: "5" },
      { classId: "18", grade: "3", number: "6" },
    ];
    setTimeout(() => callback(classes), 300);
  },
  getWorkRequestAnswers: (_formId, callback) => {
    const answers: answerTypeResponse[] = [];
    setTimeout(() => callback(answers), 300);
  },
  answerRecord: (data, callback) => {
    console.log("Mock answerRecord:", data);
    setTimeout(() => callback(true), 300);
  },
  checkStudentData: (data, callback) => {
    console.log("Mock checkStudentData:", data);
    setTimeout(() => callback(true), 300);
  },
  createUser: (data, callback) => {
    console.log("Mock createUser:", data);
    setTimeout(() => callback({ success: true, userId: "mock-user" }), 3000);
  },
  getUserData: (userId, callback) => {
    console.log("Mock getUserData:", userId);
    setTimeout(() => {
      if (userId === "mock-user") {
        callback({
          userId: "mock-user",
          createdAt: new Date().toISOString(),
          studentId: "1101",
          name: "Mock User",
        });
      } else {
        callback(null);
      }
    }, 300);
  },
};

// mock window.google.script
export function setupMockGoogleScript(): void {
  if (!window.google)
    window.google = { script: { run: {} as GoogleAppsScriptRun } };
  if (!window.google.script)
    window.google.script = { run: {} as GoogleAppsScriptRun };
  window.google.script.run = (() => {
    let successHandler: ((result: unknown) => void) | null = null;
    let failureHandler: ((error: Error) => void) | null = null;
    const handler: ProxyHandler<object> = {
      get(_target: object, prop: string) {
        if (prop === "withSuccessHandler") {
          return (fn: (result: unknown) => void) => {
            successHandler = fn;
            return new Proxy({}, handler) as GoogleAppsScriptRun;
          };
        }
        if (prop === "withFailureHandler") {
          return (fn: (error: Error) => void) => {
            failureHandler = fn;
            return new Proxy({}, handler) as GoogleAppsScriptRun;
          };
        }
        if (
          typeof (mockFunctions as Record<string, unknown>)[prop] === "function"
        ) {
          return (...args: unknown[]) => {
            try {
              (mockFunctions as Record<string, (...args: unknown[]) => void>)[
                prop
              ]?.(...args, (result: unknown) => {
                if (successHandler) successHandler(result);
              });
            } catch (e) {
              if (failureHandler) failureHandler(e as Error);
            }
            return new Proxy({}, handler) as GoogleAppsScriptRun;
          };
        }
        return undefined;
      },
    };
    return new Proxy({}, handler) as GoogleAppsScriptRun;
  })();
}
