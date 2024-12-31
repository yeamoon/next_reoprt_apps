/* `vite.test.ts` contains unit tests that make sure the utility functions used
by the application work as they should. */

import { getDeviceChartData                  } from '@/components/ProductionReport'
import { parseDateString, tryParseDateString } from '@/lib/utils'
import { describe, expect, it                } from 'vitest'

/* This test feeds the same date (October 27, 2024) in a number of commonly
used formats into the `tryParseDateString()` function, as well as an invalid
string, to make sure it can correctly differentiate between valid and invalid
dates. */
describe("tryParseDateString", () => {
   it("should correctly parse dates in the five listed formats", () => {
		const ans = tryParseDateString("2024-10-27")?.toISOString();
      expect(tryParseDateString("2024-10-27")?.toISOString()).toBe(ans);
      expect(tryParseDateString("10/27/2024")?.toISOString()).toBe(ans);
      expect(tryParseDateString("10-27-2024")?.toISOString()).toBe(ans);
   });
	/* Additional options include ambiguously worded dates (e.g., "5-1-2024",
	May 1st, or January 5th?). */
   it("should return null for invalid strings", () => {
      expect(tryParseDateString("invalid")).toBeNull();
   });
});

/* This test feeds the same date (October 27, 2024) in a number of commonly
used formats into the `parseDateString()` function, as well as an invalid
string, to make sure it can correctly differentiate between valid and invalid
dates. In fact, this utility function only makes a call to
`tryParseDateString()` above, and its main use is to handle errors resulting
from invalid date strings. */
describe("parseDateString", () => {
	it("should correctly parse date strings by calling tryParseDateString()", () => {
		const ans = parseDateString("2024-10-27")?.toISOString();
      expect(parseDateString("2024-10-27")?.toISOString()).toBe(ans);
      expect(parseDateString("10/27/2024")?.toISOString()).toBe(ans);
      expect(parseDateString("10-27-2024")?.toISOString()).toBe(ans);
  	});
   it("should throw an error for invalid strings", () => {
      expect(() => parseDateString("invalid")).toThrowError("Invalid date string: invalid");
   });
});

/* This test creates an example data record and feeds it to
`getDeviceChartData()`, which is responsible for converting records into a
format acceptable for table and chart generation. */
describe("getDeviceChartData", () => {
	it("should transform a given data record into chart format for the page", () => {
		const summary = {
			"active": {good: 100, reject: 200, duration: 10800 },
			"inactive": { good: 50, reject: 150, duration: 7200 }
		};
		const ans = getDeviceChartData(summary);
		expect(ans).toEqual([
			{ state: 'active', good: 100, reject: 200, duration: 3.0 },
			{ state: 'inactive', good: 50, reject: 150, duration: 2.0 }
		]);
	});
});
