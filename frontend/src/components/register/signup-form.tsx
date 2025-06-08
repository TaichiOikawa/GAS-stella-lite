import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const hiraganaRegex = /^[ぁ-んー]*$/;

const UserNameFormSchema = z.object({
  studentId: z
    .string()
    .min(4, "クラス・出席番号を入力してください")
    .max(4, "クラス・出席番号を入力してください")
    .regex(/^[0-9]*$/, { message: "半角数字で入力してください" }),
  name: z
    .string()
    .min(1, { message: "入力項目が足りません" })
    .regex(/^[^\s]+ [^\s]+$/, {
      message: "姓と名の間に半角スペースを入れてください",
    }),
  lastNameKana: z
    .string()
    .min(1, { message: "入力項目が足りません" })
    .regex(hiraganaRegex, { message: "ひらがなで入力してください" }),
  firstNameKana: z
    .string()
    .min(1, { message: "入力項目が足りません" })
    .regex(hiraganaRegex, { message: "ひらがなで入力してください" }),
});

export function SignUpForm({
  pageNext,
  userData,
  setUserData,
}: {
  pageNext: () => void;
  userData: {
    studentId: string;
    name: string;
    lastNameKana: string;
    firstNameKana: string;
  };
  setUserData: (data: {
    studentId: string;
    name: string;
    lastNameKana: string;
    firstNameKana: string;
  }) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof UserNameFormSchema>>({
    resolver: zodResolver(UserNameFormSchema),
    defaultValues: {
      studentId: userData.studentId ?? "",
      name: userData.name ?? "",
      lastNameKana: userData.lastNameKana ?? "",
      firstNameKana: userData.firstNameKana ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof UserNameFormSchema>) => {
    setIsSubmitting(true);

    window.google.script.run
      .withSuccessHandler((result: boolean) => {
        if (!result) {
          setErrorMessage("生徒番号とふりがなが一致しません。");
          setIsSubmitting(false);
          return;
        } else {
          setUserData(data);
          pageNext();
          setIsSubmitting(false);
        }
      })
      .withFailureHandler((error: Error) => {
        setErrorMessage(`エラーが発生しました: ${error.message}`);
      })
      .checkStudentData({
        studentId: data.studentId,
        lastNameKana: data.lastNameKana,
        firstNameKana: data.firstNameKana,
      });
  };

  return (
    <>
      <h3 className="mb-3 text-xl font-bold">登録</h3>
      <Form {...form}>
        <form
          className="space-y-5"
          onChange={() => {
            setErrorMessage(null);
            setIsSubmitting(false);
          }}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>生徒番号</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="none"
                    className="no-number-spin"
                    maxLength={4}
                    placeholder="例) 1203"
                    type="text"
                    variant="underline"
                    {...field}
                    onChange={(e) => {
                      if (!/^\d*$/.test(e.target.value)) {
                        return;
                      }
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="none"
                    className="no-number-spin"
                    placeholder="名前"
                    type="text"
                    variant="underline"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <div className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="lastNameKana"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ふりがな</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="none"
                        placeholder="せい"
                        type="text"
                        variant="underline"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstNameKana"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoComplete="none"
                        placeholder="めい"
                        type="text"
                        variant="underline"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors.lastNameKana ? (
              <p className="text-destructive pt-2 text-[0.8rem] font-medium">
                {form.formState.errors.lastNameKana.message}
              </p>
            ) : form.formState.errors.firstNameKana ? (
              <p className="text-destructive pt-2 text-[0.8rem] font-medium">
                {form.formState.errors.firstNameKana.message}
              </p>
            ) : null}
            <p className="text-muted-foreground mt-2 text-sm">
              ※生徒番号: 1年2組3番 → 1203
            </p>
          </div>

          <div className="ml-auto w-fit">
            <Button
              className="rounded-sm px-6"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <div className="flex flex-row justify-center gap-1">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-100 [animation-delay:-.5s]"></div>
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-100 [animation-delay:-.3s]"></div>
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-100"></div>
                </div>
              ) : (
                "次へ"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {errorMessage && (
        <Alert className="mt-4" variant="destructive">
          <ExclamationTriangleIcon className="size-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
