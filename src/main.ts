import { Spreadsheet } from "./db";
import { getPropertiesService } from "./utils";

const SPREADSHEET_ID = getPropertiesService("SPREADSHEET_ID");
const ss = new Spreadsheet().from(SPREADSHEET_ID);

export function doGet(e: GoogleAppsScript.Events.DoGet) {
  let url = e.pathInfo;
  if (!url) {
    url = "";
  }
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  switch (url) {
    case "":
      return (
        HtmlService.createTemplateFromFile("index")
          .evaluate()
          .addMetaTag("viewport", "width=device-width, initial-scale=1")
          // .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          // .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .setTitle("Stella Lite")
      );
    case "register":
      return (
        HtmlService.createTemplateFromFile("register")
          .evaluate()
          .addMetaTag("viewport", "width=device-width, initial-scale=1")
          // .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          // .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .setTitle("Register")
      );
    case "second":
      return (
        HtmlService.createTemplateFromFile("app")
          .evaluate()
          .addMetaTag("viewport", "width=device-width, initial-scale=1")
          // .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          // .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .setTitle("app")
      );
  }
}

export function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

export function getWorkRequestForms() {
  const formsSheet = ss.at("WorkRequestForm");
  const res = formsSheet.findAll();
  const serialized = res.map((f) => ({
    ...f,
    deadline:
      f.deadline instanceof Date ? f.deadline.toISOString() : f.deadline,
    createdAt:
      f.createdAt instanceof Date ? f.createdAt.toISOString() : f.createdAt,
  }));
  console.log("getWorkRequestForms", serialized);
  return serialized;
}

export function getClasses() {
  const classSheet = ss.at("Classes");
  const res = classSheet.findAll();
  console.log("getClasses", res);
  return res;
}

export function getWorkRequestAnswers(formId: string) {
  if (!formId) {
    throw new Error("formId is required");
  }
  const answersSheet = ss.at("WorkRequestAnswer");
  const answers = answersSheet.find({ formId }) as {
    formId: string;
    classId: string;
    class: string;
    doWork: boolean;
    startTime: Date;
    submittedAt: Date;
  }[];
  // classId ごとに最新の answer のみを残す
  const answerMap = new Map<string, (typeof answers)[0]>();
  for (const answer of answers) {
    const existing = answerMap.get(answer.classId);
    if (!existing || existing.submittedAt < answer.submittedAt) {
      answerMap.set(answer.classId, answer);
    }
  }
  const filteredAnswers = Array.from(answerMap.values());
  // Date型をISO文字列に変換
  const serialized = filteredAnswers.map((a) => ({
    ...a,
    startTime:
      a.startTime instanceof Date ? a.startTime.toISOString() : a.startTime,
    submittedAt:
      a.submittedAt instanceof Date
        ? a.submittedAt.toISOString()
        : a.submittedAt,
  }));
  console.log("getWorkRequestAnswers", serialized);
  return serialized;
}

export function answerRecord(data: {
  formId: string;
  classId: string;
  userId: string;
  doWork: boolean;
  startTime: string | null;
}) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const answersSheet = ss.at("WorkRequestAnswer");
    answersSheet.insert({
      requestId: Utilities.getUuid(),
      formId: data.formId,
      classId: data.classId,
      class: `=CONCATENATE(VLOOKUP("${data.classId}", Classes!A:C, 2, FALSE), "-", VLOOKUP("${data.classId}", Classes!A:C, 3, FALSE))`,
      userId: data.userId,
      doWork: data.doWork,
      startTime: data.startTime ? new Date(data.startTime) : null,
      submittedAt: new Date(),
    });
    console.log("answerRecord", data);
    return true;
  } finally {
    lock.releaseLock();
  }
}

export function checkStudentData(data: {
  studentId: string;
  lastNameKana: string;
  firstNameKana: string;
}) {
  const studentDataSheet = ss.at("StudentData");
  const { studentId, lastNameKana, firstNameKana } = data;

  const record = studentDataSheet.find({
    studentId: studentId,
  }) as {
    studentId: string;
    lastNameKana: string;
    firstNameKana: string;
  }[];
  console.log("checkStudentData", record);
  if (
    !record ||
    record[0].lastNameKana !== lastNameKana ||
    record[0].firstNameKana !== firstNameKana
  ) {
    return false;
  }
  return true;
}

export function createUser({
  studentId,
  name,
}: {
  studentId: string;
  name: string;
}) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const userSheet = ss.at("Users");
    const userId = Utilities.getUuid();
    userSheet.insert({
      userId: userId,
      createdAt: new Date(),
      studentId: studentId,
      name: name,
    });
    return {
      success: true,
      userId: userId,
    };
  } catch (e) {
    console.error("Lock acquisition failed or error in createUser", e);
    return {
      success: false,
      message: "ユーザーの作成に失敗しました。",
    };
  } finally {
    lock.releaseLock();
  }
}

export function getUserData(userId: string) {
  const userSheet = ss.at("Users");
  const user = userSheet.find({ userId: userId })[0];
  if (user) {
    console.log("getUserData called", user);
    return {
      userId: user.userId,
      createdAt:
        user.createdAt instanceof Date
          ? user.createdAt.toISOString()
          : user.createdAt,
      studentId: user.studentId,
      name: user.name,
    };
  }
  return null;
}
