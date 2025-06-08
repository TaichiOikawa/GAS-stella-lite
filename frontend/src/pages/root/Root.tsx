import Footer from "@/components/footer";
import Header from "@/components/header";
import AnswerDialog from "@/components/root/answer-dialog";
import AnswerTable from "@/components/root/answer-table";
import FormList from "@/components/root/form-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  answerType,
  answerTypeResponse,
  formType,
  formTypeResponse,
} from "@/types/type";
import { useEffect, useMemo, useState } from "react";

function Root() {
  const [forms, setForms] = useState<(formType & { answers?: answerType[] })[]>(
    [],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [order, setOrder] = useState<
    {
      col: "class" | "doWork" | "submittedAt" | "startTime";
      type: "asc" | "desc";
    }[]
  >([]);
  const [sortedAnswer, setSortedAnswer] = useState<answerType[]>([]);
  const selectedForm = useMemo(
    () =>
      Array.isArray(forms)
        ? forms.find((f) => f.formId === selectedFormId) || null
        : null,
    [forms, selectedFormId],
  );
  const answer = useMemo(() => selectedForm?.answers || [], [selectedForm]);

  useEffect(() => {
    setFormLoading(true);
    window.google.script.run
      .withSuccessHandler((data: formTypeResponse[]) => {
        setForms(
          Array.isArray(data)
            ? data.map((f) => ({
                ...f,
                deadline: new Date(f.deadline ?? 0),
                createdAt: new Date(f.createdAt ?? 0),
              }))
            : [],
        );
        setFormLoading(false);
      })
      .withFailureHandler((error: Error) => {
        console.error("Error fetching work request forms:", error);
      })
      .getWorkRequestForms();
  }, []);

  const reloadFormAnswer = (formId: string) => {
    setAnswerLoading(true);
    window.google.script.run
      .withSuccessHandler((data: answerTypeResponse[]) => {
        setForms((prevForms) =>
          prevForms.map((f) =>
            f.formId === formId
              ? {
                  ...f,
                  answers: data.map((a) => ({
                    ...a,
                    startTime: a.startTime ? new Date(a.startTime ?? 0) : null,
                    submittedAt: new Date(a.submittedAt ?? 0),
                  })),
                }
              : f,
          ),
        );
        setAnswerLoading(false);
      })
      .withFailureHandler((error: Error) => {
        console.error("Error fetching work request answers:", error);
      })
      .getWorkRequestAnswers(formId);
  };

  const handleFormSelect = (form: formType) => {
    if (answerLoading) return;
    setSelectedFormId(form.formId);
    reloadFormAnswer(form.formId);
  };

  useEffect(() => {
    if (order.length === 0) {
      setSortedAnswer(answer);
      return;
    }
    const sorted = [...answer].sort((a, b) => {
      for (const o of order) {
        if (o.col === "submittedAt" || o.col === "startTime") {
          const aVal = a[o.col];
          const bVal = b[o.col];
          const aTime =
            typeof aVal === "string"
              ? new Date(aVal).getTime()
              : (aVal as Date).getTime();
          const bTime =
            typeof bVal === "string"
              ? new Date(bVal).getTime()
              : (bVal as Date).getTime();
          if (aTime !== bTime)
            return o.type === "asc" ? aTime - bTime : bTime - aTime;
        } else if (o.col === "class") {
          const aStr = a[o.col] as string;
          const bStr = b[o.col] as string;
          if (aStr !== bStr)
            return o.type === "asc"
              ? aStr.localeCompare(bStr)
              : bStr.localeCompare(aStr);
        } else if (o.col === "doWork") {
          const aBool = a[o.col] as boolean;
          const bBool = b[o.col] as boolean;
          if (aBool !== bBool)
            return o.type === "asc" ? (aBool ? -1 : 1) : aBool ? 1 : -1;
        }
      }
      return 0;
    });
    setSortedAnswer(sorted);
  }, [order, answer]);

  const handleOrderChange = (
    col: "class" | "doWork" | "submittedAt" | "startTime",
  ) => {
    setOrder((prevOrder) => {
      const existingOrder = prevOrder.find((o) => o.col === col);
      if (existingOrder) {
        if (existingOrder.type === "asc") {
          return prevOrder.map((o) =>
            o.col === col ? { ...o, type: "desc" } : o,
          );
        } else {
          return prevOrder.filter((o) => o.col !== col);
        }
      }
      return [...prevOrder, { col, type: "asc" }];
    });
  };

  return (
    <>
      <Header />
      <main className="container mx-auto min-h-dvh space-y-6 p-4 sm:p-7">
        <FormList
          formLoading={formLoading}
          forms={forms}
          onFormSelect={handleFormSelect}
          selectedForm={selectedForm}
        />
        {answerLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div>
            <p className="text-lg font-bold">
              {selectedForm?.targetDate} 作業申請
            </p>
            {selectedForm ? (
              <>
                <p className="ml-2">{selectedForm?.answers?.length}件提出済</p>
                {selectedForm?.answers?.length &&
                selectedForm?.answers.length > 0 ? (
                  <div className="max-h-96 overflow-scroll">
                    <AnswerTable
                      displayStartTime={
                        selectedForm.formType === "WORK_holiday"
                      }
                      handleOrderChange={handleOrderChange}
                      order={order}
                      sortedAnswer={sortedAnswer}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground my-2 text-center">
                    回答はありません
                  </p>
                )}
                <div className="mt-2 mr-0 ml-auto w-fit">
                  <Button
                    disabled={
                      selectedForm && selectedForm.deadline < new Date()
                    }
                    onClick={() => setIsOpen(true)}
                  >
                    提出する
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground my-2 text-center">
                作業申請が選択されていません
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />

      <AnswerDialog
        isOpen={isOpen}
        reloadFormAnswer={reloadFormAnswer}
        selectedForm={selectedForm}
        setIsOpen={setIsOpen}
      />
    </>
  );
}

export default Root;
