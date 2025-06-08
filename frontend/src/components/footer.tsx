import StellaIcon from "@/assets/stella.svg";
import { HomeIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Footer() {
  return (
    <footer>
      <div className="bg-gray-100">
        <div className="container mx-auto flex flex-col flex-wrap px-5 py-4 sm:flex-row">
          <div className="text-center font-sans text-sm text-gray-500 sm:text-left">
            <div className="my-3 flex justify-center sm:justify-start">
              <img className="w-27" src={StellaIcon} />
              <span className="mt-auto mb-0 ml-2 rounded-md bg-yellow-400 px-2 py-0.5 text-sm font-bold text-white">
                Lite
              </span>
            </div>
            <p>
              Copyright © 2025 Taichi Oikawa
              <br />
              Hokkaido Kitami Hokuto High School
            </p>
            <p className="pt-3 text-gray-600">
              このサイトは北見北斗高校 生徒会執行部が運営しています
            </p>
          </div>
          <div className="mt-2 flex flex-col sm:mt-0 sm:ml-auto">
            <div className="inline-flex justify-center gap-2 sm:justify-end">
              <a
                className="text-gray-500"
                href="http://www.kitamihokuto.hokkaido-c.ed.jp/"
                target="_blank"
              >
                <HomeIcon className="size-6" style={{ marginTop: "1px" }} />
              </a>
              <a
                className="text-gray-500"
                href="https://www.instagram.com/kitami_hokuto.hs/"
                target="_blank"
              >
                <InstagramLogoIcon className="size-6" />
              </a>
            </div>

            <div className="flex flex-col items-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="mx-auto w-fit font-normal sm:mx-0 sm:p-0"
                    size="sm"
                    variant="link"
                  >
                    LICENSE
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>LICENSE</DialogTitle>
                  </DialogHeader>
                  <div className="rounded bg-gray-100 p-4 text-sm whitespace-pre-wrap text-gray-800">
                    MIT License
                    <br />
                    <br />
                    Copyright (c) 2025 Taichi Oikawa
                    <br />
                    <br />
                    Permission is hereby granted, free of charge, to any person
                    obtaining a copy of this software and associated
                    documentation files (the "Software"), to deal in the
                    Software without restriction, including without limitation
                    the rights to use, copy, modify, merge, publish, distribute,
                    sublicense, and/or sell copies of the Software, and to
                    permit persons to whom the Software is furnished to do so,
                    subject to the following conditions:
                    <br />
                    <br />
                    The above copyright notice and this permission notice shall
                    be included in all copies or substantial portions of the
                    Software.
                    <br />
                    <br />
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
                    KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
                    WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                    PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
                    OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
                    OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                  </div>
                  <DialogClose asChild>
                    <Button className="w-fit" variant="secondary">
                      閉じる
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
              <Button
                asChild
                className="mx-auto w-fit font-normal sm:mx-0 sm:p-0"
                size="sm"
                variant="link"
              >
                <a
                  href="https://github.com/TaichiOikawa/GAS-stella-lite"
                  target="_blank"
                >
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
