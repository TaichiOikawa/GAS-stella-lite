import { useState } from "react";

const buttonStyle = "border rounded-full w-12 h-12 p-3 text-center";

export default function Login() {
  const [pin, setPin] = useState<string>("");
  return (
    <div className="mx-auto w-fit">
      <div>{pin}</div>
      <div className="grid w-fit grid-cols-3 grid-rows-4 gap-4">
        <button
          className={buttonStyle}
          onClick={() => setPin((prev) => prev + "1")}
        >
          1
        </button>
        <button
          className={buttonStyle}
          onClick={() => setPin((prev) => prev + "2")}
        >
          2
        </button>
        <button
          className={buttonStyle}
          onClick={() => setPin((prev) => prev + "3")}
        >
          3
        </button>
        <button
          className={buttonStyle}
          onClick={() => setPin((prev) => prev + "4")}
        >
          4
        </button>
        <button
          className={buttonStyle}
          onClick={() => setPin((prev) => prev + "5")}
        >
          5
        </button>
        <button
          className={buttonStyle}
          onClick={() => setPin((prev) => prev + "6")}
        >
          6
        </button>
        <button
          className={buttonStyle}
          onClick={() => setPin((prev) => prev + "7")}
        >
          7
        </button>
        <button
          className={buttonStyle}
          onClick={() => setPin((prev) => prev + "8")}
        >
          8
        </button>
        <button
          className={buttonStyle}
          onClick={() => setPin((prev) => prev + "9")}
        >
          9
        </button>
        <button
          className={`${buttonStyle} col-span-3 mx-auto`}
          onClick={() => setPin((prev) => prev + "0")}
        >
          0
        </button>
      </div>
    </div>
  );
}
