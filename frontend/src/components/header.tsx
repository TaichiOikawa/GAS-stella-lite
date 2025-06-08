import StellaIcon from "@/assets/stella.svg";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { userIdAtom } from "@/lib/atoms";
import { navigate } from "@/lib/utils";
import { useAtom } from "jotai";
import { MenuIcon, UserIcon } from "lucide-react";
import { useEffect } from "react";

export default function Header() {
  const [userId, setUserId] = useAtom(userIdAtom);

  useEffect(() => {
    const userId = localStorage.getItem("user-id");
    const studentId = localStorage.getItem("student-id");
    if (userId && studentId) {
      setUserId({ userId, studentId });
    } else {
      setUserId(null);
    }
  }, [setUserId]);

  return (
    <header className="text-grey-600 shadow-under sticky top-0 z-1 flex bg-white/80 backdrop-blur-md backdrop-saturate-150">
      <div className="container mx-auto flex items-center gap-y-1 px-4 py-3">
        <img className="w-27" src={StellaIcon} />
        <span className="mt-auto mb-0 ml-2 rounded-md bg-yellow-400 px-2 py-0.5 text-sm font-bold text-white">
          Lite
        </span>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="ml-auto size-10" size="icon" variant="outline">
              <MenuIcon />
            </Button>
            Menu
          </SheetTrigger>
          <SheetContent className="flex w-72 flex-col justify-between px-8 py-16">
            <div className="flex flex-col gap-y-4">
              <SheetTitle>メニュー</SheetTitle>
              {userId ? (
                <>
                  <p className="text-muted-foreground">
                    ログイン中: 生徒{userId.studentId}
                  </p>
                </>
              ) : (
                <div className="flex flex-col gap-y-3">
                  <Button onClick={() => navigate("/register")}>
                    <UserIcon />
                    新規登録
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
