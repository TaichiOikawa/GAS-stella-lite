export {};

declare global {
	interface GoogleAppsScriptRun {
		// Google Apps Script default methods
		withSuccessHandler: <T = unknown>(
			callback: (result: T) => void,
		) => GoogleAppsScriptRun;
		withFailureHandler: (
			callback: (error: Error) => void,
		) => GoogleAppsScriptRun;

		// Custom methods
		// If you add a new method to the main.ts file, add it here
		pingPong: () => string;
	}

	interface Window {
		google: {
			script: {
				run: GoogleAppsScriptRun;
			};
		};
	}
}
