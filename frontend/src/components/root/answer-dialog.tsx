import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { userIdAtom } from "@/lib/atoms";
import { navigate } from "@/lib/utils";
import type { ClassType, formType } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AnswerDialogProps {
  isOpen: boolean;
  reloadFormAnswer: (formId: string) => void;
  setIsOpen: (v: boolean) => void;
  selectedForm: formType | null;
}

const formSchema = z.object({
  doWork: z.string(),
  name: z.string(),
  class: z.string().min(1, "クラスを選択してください"),
  startTime: z.string(),
});

export default function AnswerDialog({
  isOpen,
  reloadFormAnswer,
  setIsOpen,
  selectedForm,
}: AnswerDialogProps) {
  const [userId, setUserId] = useAtom(userIdAtom);
  const [classes, setClasses] = useState<{ id: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [canSelectClass, setCanSelectClass] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doWork: "false",
      name: "",
      class: "",
      startTime: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (!selectedForm || !isOpen || !userId) return;
      setIsLoading(true);
      await new Promise<void>((resolve, reject) => {
        console.log("Start fetching classes for form:", selectedForm.formId);
        window.google.script.run
          .withSuccessHandler((res: ClassType[]) => {
            setClasses(
              res.map((cls) => ({
                id: cls.classId,
                label: `${cls.grade}-${cls.number}`,
              })),
            );
            console.log("Classes fetched:", res);
            window.google.script.run
              .withSuccessHandler(
                (
                  result: {
                    userId: string;
                    createdAt: string;
                    studentId: string;
                    name: string;
                  } | null,
                ) => {
                  if (result) {
                    form.setValue("name", result.name);
                    console.log(classes);
                    const userClass =
                      res.find(
                        (cls) =>
                          cls.grade === result.studentId.slice(0, 1) &&
                          cls.number === result.studentId.slice(1, 2),
                      ) ?? null;

                    if (!userClass) {
                      toast.error(
                        "ユーザーのクラスが見つかりませんでした。クラスを選択してください。",
                      );
                      setCanSelectClass(true);
                      setIsLoading(false);
                      return;
                    }
                    console.log("UserClass:", userClass);
                    form.setValue("class", userClass.classId);
                    setIsLoading(false);
                    resolve();
                  } else {
                    localStorage.removeItem("user-id");
                    localStorage.removeItem("user-data");
                    setUserId(null);
                    setIsOpen(false);
                    toast.error("ユーザーデータが見つかりませんでした。");
                    setIsLoading(false);
                    return;
                  }
                },
              )
              .withFailureHandler((error: Error) => {
                console.error("Error fetching user data:", error);
                setIsLoading(false);
                reject(error);
              })
              .getUserData(userId.userId);
            resolve();
          })
          .withFailureHandler((error: Error) => {
            console.error("Error fetching classes:", error);
            setIsLoading(false);
            reject(error);
          })
          .getClasses();
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedForm, isOpen]);

  if (!selectedForm) return null;

  const now = new Date();
  const isClosed = now > selectedForm.deadline;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast.error("ログインしていません。");
      return;
    }
    const startTime = data.startTime.split(":");
    if (
      selectedForm.formType === "WORK_holiday" &&
      data.doWork === "true" &&
      !startTime[0]
    ) {
      form.setError("startTime", {
        type: "manual",
        message: "作業開始時間を入力してください。",
      });
      return;
    }

    console.log("Form submitted:", data);
    setSubmitting(true);

    const targetDate = selectedForm.targetDate.split("/");

    const req = {
      formId: selectedForm.formId,
      classId: data.class,
      userId: userId.userId,
      doWork: data.doWork === "true",
      startTime:
        selectedForm.formType === "WORK_holiday" &&
        data.doWork === "true" &&
        data.startTime
          ? new Date(
              targetDate[0] +
                "-" +
                targetDate[1].padStart(2, "0") +
                "-" +
                targetDate[2].padStart(2, "0") +
                "T" +
                startTime.join(":") +
                ":00",
            ).toISOString()
          : null,
    };

    window.google.script.run
      .withSuccessHandler(() => {
        setIsOpen(false);
        setSubmitting(false);
        form.reset();
        alert("申請が提出されました。");
        reloadFormAnswer(selectedForm.formId);
      })
      .withFailureHandler((error: Error) => {
        console.error("Error submitting form:", error);
        alert("申請の提出に失敗しました。");
      })
      .answerRecord(req);
  };

  return (
    <Dialog
      onOpenChange={() => {
        if (submitting) return;
        setIsOpen(false);
      }}
      open={isOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedForm.targetDate} 作業申請</DialogTitle>
          <DialogDescription>作業申請を提出・修正します</DialogDescription>
        </DialogHeader>
        {isClosed ? (
          <p className="my-4 text-red-500">この申請は締切を過ぎています。</p>
        ) : !userId ? (
          <>
            <p className="text-red-500">ログインしていません</p>
            <Button onClick={() => navigate("/register")}>新規登録</Button>
          </>
        ) : isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-30" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-30" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>クラス</FormLabel>
                    <FormControl>
                      <Select disabled={!canSelectClass} {...field}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="クラスを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FormLabel>申請者名</FormLabel>
                    <FormControl>
                      <Input disabled={true} type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doWork"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>作業の有無</FormLabel>
                    <FormControl>
                      <Select disabled={submitting} {...field}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">作業する</SelectItem>
                          <SelectItem value="false">作業しない</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedForm.formType === "WORK_holiday" &&
                form.watch("doWork") === "true" && (
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>作業開始時間</FormLabel>
                        <FormControl>
                          <Input
                            disabled={submitting}
                            onChange={(e) => field.onChange(e.target.value)}
                            type="time"
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>CAUTION</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc text-sm">
                    <li>間違いがないか必ず確認してください</li>
                    <li>既に提出したクラスのデータは上書きされます</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <div className="mr-0 ml-auto flex w-fit items-center gap-5">
                <Button className="px-6" disabled={submitting} type="submit">
                  {submitting ? (
                    <div className="flex flex-row justify-center gap-1">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-100 [animation-delay:-.5s]"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-100 [animation-delay:-.3s]"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-100"></div>
                    </div>
                  ) : (
                    "提出"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
