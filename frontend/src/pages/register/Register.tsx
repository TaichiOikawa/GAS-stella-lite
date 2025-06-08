import StellaIcon from "@/assets/stella.svg";
import RegisterConfirm from "@/components/register/register-confirm";
import { SignUpForm } from "@/components/register/signup-form";
import { Button } from "@/components/ui/button";
import { useGetWindowSize } from "@/hooks/use-getWindowSize";
import { navigate } from "@/lib/utils";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

export default function SignUpPage() {
  const [page, setPage] = useState<number>(0);
  const [initial, setInitial] = useState<boolean>(true);
  const [isNext, setIsNext] = useState<boolean>(true);
  const [userData, setUserData] = useState<{
    studentId: string;
    name: string;
    lastNameKana: string;
    firstNameKana: string;
  }>({
    studentId: "",
    name: "",
    lastNameKana: "",
    firstNameKana: "",
  });

  // TODO localStorageにuser-idがある場合、ユーザー検索→falseなら実行、trueならトップへ

  const { width } = useGetWindowSize();
  if (width === 0) return;

  const pageNext = () => {
    setIsNext(true);
    setPage(page + 1);
    setInitial(false);
  };

  const pageBack = () => {
    setIsNext(false);
    setPage(page - 1);
    setInitial(false);
  };

  const variants = {
    enter: (isNext: boolean) => {
      return {
        x: isNext ? 100 : -100,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (isNext: boolean) => {
      return {
        x: isNext ? -100 : 100,
        opacity: 0,
      };
    },
  };

  const animationOptions = {
    initial: width < 400 && initial === true ? "center" : "enter",
    animate: "center",
    exit: "exit",
    variants: variants,
    custom: isNext,
    transition: {
      opacity: { duration: 0.2 },
      x: { type: "spring", damping: 30, stiffness: 100 },
    },
  };

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="bg-gradient flex h-screen flex-col justify-center"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
    >
      <div
        className={clsx(
          "mx-auto mb-5 w-full max-w-md overflow-hidden border bg-white p-11 shadow-md min-[440px]:rounded-sm sm:w-[28rem] sm:max-w-none",
          {
            "max-[400px]:px-4": page === 0 || page === 1,
            "max-[400px]:px-6": page === 2,
          },
        )}
      >
        <div className="flex">
          <img className="w-27" src={StellaIcon} />
          <span className="mt-auto mb-0 ml-2 rounded-md bg-yellow-400 px-2 py-0.5 text-sm font-bold text-white">
            Lite
          </span>
        </div>
        <AnimatePresence custom={isNext} mode="popLayout">
          <motion.div className="py-3" key={page} {...animationOptions}>
            {page === 0 ? (
              <SignUpForm
                pageNext={pageNext}
                setUserData={setUserData}
                userData={userData}
              />
            ) : page === 1 ? (
              <RegisterConfirm
                pageBack={pageBack}
                pageNext={pageNext}
                userData={userData}
              />
            ) : page === 2 ? (
              <div className="text-center">
                <CheckIcon className="mx-auto size-20 text-green-600" />
                <p className="font-bold">登録が完了しました！</p>
                <Button className="mt-5 px-8" onClick={() => navigate("")}>
                  ホームに戻る
                </Button>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
