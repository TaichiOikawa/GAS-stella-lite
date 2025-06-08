import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { userIdAtom } from "@/lib/atoms";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterConfirm({
  pageBack,
  pageNext,
  userData,
}: {
  pageBack: () => void;
  pageNext: () => void;
  userData: {
    studentId: string;
    name: string;
    lastNameKana: string;
    firstNameKana: string;
  };
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setUserId = useSetAtom(userIdAtom);

  const onSubmit = () => {
    setIsSubmitting(true);
    const promise = new Promise((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler(
          (
            result:
              | { success: true; userId: string }
              | { success: false; message?: string },
          ) => {
            if (result.success) {
              localStorage.setItem("user-id", result.userId);
              localStorage.setItem("student-id", userData.studentId);
              setUserId({
                userId: result.userId,
                studentId: userData.studentId,
              });
              pageNext();
              resolve(result.userId);
              setIsSubmitting(false);
            } else {
              setErrorMessage(result.message || "ユーザー登録に失敗しました。");
              reject(
                new Error(result.message || "ユーザー登録に失敗しました。"),
              );
            }
          },
        )
        .withFailureHandler((error) => {
          setErrorMessage(error.message || "ユーザー登録に失敗しました。");
          reject(error.message);
        })
        .createUser({
          studentId: userData.studentId,
          name: userData.name,
        });
    });
    toast.promise(promise, {
      loading: "登録中...",
      success: "登録が完了しました！",
      error: (error) => error.message || "ユーザー登録に失敗しました",
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="mb-3 text-xl font-bold">登録確認</h3>
      <p>
        以下の内容で登録します。
        <br />
        <span className="text-red-500">
          登録後は変更できませんので、内容をよく確認してください。
        </span>
      </p>
      <ul className="flex flex-col gap-2">
        <li>
          <span className="font-bold">生徒番号</span>
          <div className="text-2xl">{userData.studentId}</div>
        </li>
        <li>
          <span className="font-bold">名前</span>
          <div className="text-2xl">{userData.name}</div>
        </li>
      </ul>
      <div className="flex justify-between">
        <Button
          className="rounded-sm px-6"
          disabled={isSubmitting}
          onClick={pageBack}
          variant="outline"
        >
          戻る
        </Button>
        <Button
          className="rounded-sm px-6"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <div className="flex flex-row justify-center gap-1">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-100 [animation-delay:-.5s]"></div>
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-100 [animation-delay:-.3s]"></div>
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-100"></div>
            </div>
          ) : (
            "登録"
          )}
        </Button>
      </div>
      {errorMessage && (
        <Alert className="mt-4" variant="destructive">
          <ExclamationTriangleIcon className="size-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
