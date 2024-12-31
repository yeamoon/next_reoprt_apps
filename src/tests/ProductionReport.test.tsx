/* This unit test was placed here after much difficulty with import statements.
This was by far the most cumbersome of the Vitest unit tests. */

import React 								from "react";
import { ProductionReport         } from "@/components/ProductionReport"
import { render, screen           } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* This test was originally meant to test the way the application handles
parameters present in the URL (similar to another test already in the
Playwright suite), but it hilariously does not work (hangs forever in the
terminal). It currently is not included in the workflow for that reason.
Suspected cause: faulty mocking and rendering. */
describe("Handle URL Parameters", () => {
	vi.clearAllMocks();
	vi.mock("next/navigation", () => ({
		useSearchParams: () => ({
			get: (key: string) => {
				switch (key) {
					case "devices":
						return "device1,device2";
					  case "startDate":
						 return "2024-10-01";
					  case "endDate":
						 return "2024-10-31";
					  default:
						 return null;
				}
			},
		}),
	}));
	it("should load the page with parameters from URL", async () => {
		render(<ProductionReport />);
		expect (
			(screen.getByLabelText('device1') as HTMLInputElement).checked
		).toBe(true);
		expect (
			(screen.getByLabelText('device2') as HTMLInputElement).checked
		).toBe(true);
		expect (
			(screen.getByLabelText('Start Date') as HTMLInputElement).value
		).toBe('2024-10-01');
		expect (
			(screen.getByLabelText('End Date') as HTMLInputElement).value
		).toBe('2024-10-31');
	});
	vi.clearAllMocks();
});
	