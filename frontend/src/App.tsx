import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";

function App() {
	const [count, setCount] = useState(0);
	const [message, setMessage] = useState<string | null>(null);

	const handleClick = () => {
		setMessage("Sending message to GAS...");
		window.google.script.run
			.withSuccessHandler((response: string) => {
				setMessage(response);
			})
			.withFailureHandler((error) => {
				setMessage(`Error: ${error.message}`);
			})
			.pingPong();
	};

	return (
		<div className="mx-auto flex min-h-screen max-w-[1280px] flex-col items-center justify-center bg-white p-8 text-center font-sans text-[#213547]">
			<div className="flex items-center justify-center gap-8">
				<a href="https://vite.dev" rel="noopener noreferrer" target="_blank">
					<img
						alt="Vite logo"
						className="transition-filter h-32 p-3 duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
						src={viteLogo}
					/>
				</a>
				<a href="https://react.dev" rel="noopener noreferrer" target="_blank">
					<img
						alt="React logo"
						className="transition-filter animate-spin-slow h-32 p-3 duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa]"
						src={reactLogo}
					/>
				</a>
			</div>
			<h1 className="mt-8 mb-4 text-[3.2em] leading-[1.1] font-bold">
				Vite + React
			</h1>
			<div className="card mb-4 rounded-lg bg-transparent p-8">
				<div className="flex flex-col items-center justify-center gap-4">
					<button
						className="cursor-pointer rounded-lg border border-transparent bg-[#f9f9f9c2] px-5 py-2 text-base font-medium text-black transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-blue-400"
						onClick={() => setCount((count) => count + 1)}
					>
						count is {count}
					</button>
					<button
						className="cursor-pointer rounded-lg border border-transparent bg-[#f9f9f9c2] px-5 py-2 text-base font-medium text-black transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-blue-400"
						onClick={handleClick}
					>
						Send Message To GAS
					</button>
				</div>
				<p className="mt-4">
					Edit <code className="font-mono">src/App.tsx</code> and save to test
					HMR
				</p>
			</div>
			<p className="text-[#888]">
				Click on the Vite and React logos to learn more
			</p>
			{message && (
				<div className="mt-4">
					<p className="text-lg font-semibold">{message}</p>
				</div>
			)}
		</div>
	);
}

export default App;
