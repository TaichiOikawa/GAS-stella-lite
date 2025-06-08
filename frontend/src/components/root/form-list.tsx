import type { answerType, formType } from "@/types/type";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { format } from "date-fns-tz";

interface FormListProps {
  forms: (formType & { answers?: answerType[] })[];
  formLoading: boolean;
  onFormSelect: (form: formType) => void;
  selectedForm: formType | null;
}

export default function FormList({
  forms,
  formLoading,
  onFormSelect,
  selectedForm,
}: FormListProps) {
  return (
    <div>
      <h3 className="mb-2 text-2xl font-bold">作業申請</h3>
      {formLoading ? (
        <>
          <div className="my-3 h-8 w-full animate-pulse rounded bg-gray-200" />
          <div className="my-3 h-8 w-full animate-pulse rounded bg-gray-200" />
          <div className="my-3 h-8 w-full animate-pulse rounded bg-gray-200" />
        </>
      ) : forms.length > 0 ? (
        <>
          <div className="flex flex-col gap-1 rounded-lg border p-3">
            {forms.map((form) => {
              const now = new Date();
              const isClosed = now > form.deadline;
              return (
                <button
                  className={clsx(
                    "flex cursor-pointer flex-wrap items-end justify-between rounded-lg p-2",
                    selectedForm?.formId === form.formId
                      ? "bg-gray-100 text-blue-600"
                      : "hover:bg-gray-50 hover:text-gray-800",
                  )}
                  key={form.formId}
                  onClick={() => onFormSelect(form)}
                >
                  <div className="mr-3 flex">
                    <div
                      className={clsx(
                        "mr-2 w-1.5 rounded-full",
                        selectedForm?.formId === form.formId
                          ? "bg-blue-500"
                          : "bg-gray-500",
                      )}
                    />
                    <div className="w-full">
                      <div className="flex flex-wrap items-center">
                        <p className="pr-3 text-lg">
                          {form.targetDate} 作業申請
                        </p>
                        <p className="text-muted-foreground pr-3 text-sm">
                          (
                          {format(form.createdAt, "yyyy/MM/dd HH:mm", {
                            timeZone: "Asia/Tokyo",
                          })}{" "}
                          公開)
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-2">
                        <div>
                          <p className="pl-2">
                            提出締切：
                            {format(form.deadline, "MM/dd HH:mm", {
                              timeZone: "Asia/Tokyo",
                            })}
                          </p>
                        </div>
                      </div>
                      {isClosed && (
                        <p className="text-constructive mt-1 flex items-center gap-1">
                          <CheckCircledIcon className="size-5 shrink-0" />
                          締め切りました
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            <p className="ml-auto w-fit text-xs text-gray-500">
              クリックして詳細を表示
            </p>
          </div>
        </>
      ) : (
        <p>作業申請はありません。</p>
      )}
    </div>
  );
}
