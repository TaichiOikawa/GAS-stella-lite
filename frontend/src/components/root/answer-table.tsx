import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { answerType } from "@/types/type";
import { format } from "date-fns-tz";
import { OrderIcon } from "@/components/ui/OrderIcon";

interface AnswerTableProps {
  sortedAnswer: answerType[];
  order: {
    col: "class" | "doWork" | "submittedAt" | "startTime";
    type: "asc" | "desc";
  }[];
  handleOrderChange: (
    col: "class" | "doWork" | "submittedAt" | "startTime",
  ) => void;
  displayStartTime: boolean;
}

export default function AnswerTable({
  sortedAnswer,
  order,
  handleOrderChange,
  displayStartTime,
}: AnswerTableProps) {
  return (
    <Table className="min-w-full text-nowrap">
      <TableHeader>
        <TableRow>
          <TableHead
            className="w-20 cursor-pointer"
            onClick={() => handleOrderChange("class")}
          >
            <div className="flex justify-between">
              クラス
              <OrderIcon
                order={
                  order?.find((orderItem) => orderItem.col === "class")?.type
                }
              />
            </div>
          </TableHead>
          <TableHead
            className="w-20 cursor-pointer"
            onClick={() => handleOrderChange("doWork")}
          >
            <div className="flex justify-between">
              作業
              <OrderIcon
                order={
                  order?.find((orderItem) => orderItem.col === "doWork")?.type
                }
              />
            </div>
          </TableHead>
          {displayStartTime && (
            <TableHead
              className="cursor-pointer"
              onClick={() => handleOrderChange("startTime")}
            >
              <div className="flex justify-between">
                作業開始
                <OrderIcon
                  order={
                    order?.find((orderItem) => orderItem.col === "startTime")
                      ?.type
                  }
                />
              </div>
            </TableHead>
          )}
          <TableHead
            className="cursor-pointer"
            onClick={() => handleOrderChange("submittedAt")}
          >
            <div className="flex justify-between">
              提出日時
              <OrderIcon
                order={
                  order?.find((orderItem) => orderItem.col === "submittedAt")
                    ?.type
                }
              />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAnswer.map((ans) => (
          <TableRow key={ans.requestId}>
            <TableCell>{ans.class}</TableCell>
            <TableCell>{ans.doWork ? <>はい</> : <>いいえ</>}</TableCell>
            {displayStartTime && (
              <TableCell>
                {ans.startTime && format(ans.startTime, "HH:mm")}
              </TableCell>
            )}
            <TableCell>{format(ans.submittedAt, "MM/dd HH:mm")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
