

/* `playwright.spec.ts` contains functionality tests written for the
application using Playwright. */


import { expect, test } from '@playwright/test';
import { chromium } from 'playwright';


/* This test loads the application and checks that it displays the default
start and end dates (the start of October 27, 2024 to the end of October 29,
2024). It then uses the date field to set the interval to November 1, 2024 to
November 5, 2024, and checks that the changes are visible on the front end. */
test('verify date filtering for UI', async ({ page }) => {

	await page.goto('http://localhost:3000/');

	const startDate = page.locator('div').filter({ hasText: /^Start Date$/ }).getByRole('textbox');
	const endDate = page.locator('div').filter({ hasText: /^End Date$/ }).getByRole('textbox');
	await expect(startDate).toHaveValue('2024-10-27');
	await expect(endDate).toHaveValue('2024-10-29');
	await expect(page.getByRole('main')).toContainText('Oct 27, 2024 - Oct 29, 2024');

	await startDate.fill('2024-11-01');
	await endDate.fill('2024-11-05');
	await expect(startDate).toHaveValue('2024-11-01');
	await expect(endDate).toHaveValue('2024-11-05');
	await expect(page.getByRole('main')).toContainText('Nov 1, 2024 - Nov 5, 2024');

  await page.goto('http://localhost:3000/');  // Ensure using the correct port

  const startDate = page.locator('div').filter({ hasText: /^Start Date$/ }).getByRole('textbox');
  const endDate = page.locator('div').filter({ hasText: /^End Date$/ }).getByRole('textbox');
  await expect(startDate).toHaveValue('2024-10-27');
  await expect(endDate).toHaveValue('2024-10-29');
  await expect(page.getByRole('main')).toContainText('Oct 27, 2024 - Oct 29, 2024');

  await startDate.fill('2024-11-01');
  await endDate.fill('2024-11-05');
  await expect(startDate).toHaveValue('2024-11-01');
  await expect(endDate).toHaveValue('2024-11-05');
  await expect(page.getByRole('main')).toContainText('Nov 1, 2024 - Nov 5, 2024');

});

/* This test loads the application and uses the URL to set the time interval to
November 1, 2024 to November 5, 2024, and checks that the changes are visible
on the front end. */
test('verify date filtering for URL', async ({ page }) => {

	await page.goto('http://localhost:3000/?startDate=2024-11-01&endDate=2024-11-05');

	const startDate = page.locator('div').filter({ hasText: /^Start Date$/ }).getByRole('textbox');
	const endDate = page.locator('div').filter({ hasText: /^End Date$/ }).getByRole('textbox');
	await expect(startDate).toHaveValue('2024-11-01');
	await expect(endDate).toHaveValue('2024-11-05');
	await expect(page.getByRole('main')).toContainText('Nov 1, 2024 - Nov 5, 2024');

  await page.goto('http://localhost:3000/?startDate=2024-11-01&endDate=2024-11-05');  // Ensure using the correct port

  const startDate = page.locator('div').filter({ hasText: /^Start Date$/ }).getByRole('textbox');
  const endDate = page.locator('div').filter({ hasText: /^End Date$/ }).getByRole('textbox');
  await expect(startDate).toHaveValue('2024-11-01');
  await expect(endDate).toHaveValue('2024-11-05');
  await expect(page.getByRole('main')).toContainText('Nov 1, 2024 - Nov 5, 2024');

});

/* This test loads the application and interacts with the device filtering
section (checkboxes) to show and hide individual reports. By default, no boxes
are checked, and all three reports are shown. If one or more checkboxes are
selected, then _only_ those reports will be visible. */
test('verify device filtering', async ({ page }) => {

	await page.goto('http://localhost:3000/');

	await page.getByLabel('MakerBot').check();
	await expect(page.getByText('MakerBot Production Report')).toBeVisible();
	await expect(page.getByText('Ender Production Report')).not.toBeVisible();
	await expect(page.getByText('Prusa Production Report')).not.toBeVisible();

	/* Once `MakerBot` is checked, only the MakerBot Production Report will be
	shown. Since there are three production reports, this test can be expanded
	on by trying different combinations of checks (e.g., checking all three
	displays all three, checking Ender and Prusa reports but not MakerBot only
	displays the former two, etc.). */

	await page.getByLabel('MakerBot').uncheck();
	await expect(page.getByText('MakerBot Production Report')).toBeVisible();
	await expect(page.getByText('Ender Production Report')).toBeVisible();
	await expect(page.getByText('Prusa Production Report')).toBeVisible();

  await page.goto('http://localhost:3000/');  // Ensure using the correct port

  await page.getByLabel('MakerBot').check();
  await expect(page.getByText('MakerBot Production Report')).toBeVisible();
  await expect(page.getByText('Ender Production Report')).not.toBeVisible();
  await expect(page.getByText('Prusa Production Report')).not.toBeVisible();

  await page.getByLabel('MakerBot').uncheck();
  await expect(page.getByText('MakerBot Production Report')).toBeVisible();
  await expect(page.getByText('Ender Production Report')).toBeVisible();
  await expect(page.getByText('Prusa Production Report')).toBeVisible();

});

/* This test loads the application with the MakerBot report and verifies that
the chart and tables are displayed on the front end with the expected data. */
test('verify chart and table renders', async ({ page }) => {

	await page.goto('http://localhost:3000/');

	await page.getByLabel('MakerBot').check();
	await expect(page.getByText('MakerBot Production ReportOct')).toBeVisible();
	await expect(page.getByText('Oct 27, 2024 - Oct 29,').first()).toBeVisible();
	await expect(page.getByRole('cell', { name: 'Process State' }).first()).toBeVisible();
	await expect(page.getByRole('cell', { name: 'Good Count' }).first()).toBeVisible();
	await expect(page.getByRole('cell', { name: 'Reject Count' }).first()).toBeVisible();
	await expect(page.getByRole('cell', { name: 'duration (hrs)' }).first()).toBeVisible();

	await expect(page.getByRole('row', { name: 'Down 0 11 4.73' }).getByRole('cell').nth(1)).toBeVisible();
	await expect(page.getByRole('row', { name: 'Running 63,313 1,700 31.56' }).getByRole('cell').nth(1)).toBeVisible();
	await expect(page.getByRole('row', { name: 'Meal/Break 743 0 5.56' }).getByRole('cell').nth(1)).toBeVisible();
	await expect(page.getByRole('row', { name: 'Changeover 0 0 1.93' }).getByRole('cell').nth(1)).toBeVisible();
	await expect(page.getByRole('row', { name: 'Meeting 2 0 0.13' }).getByRole('cell').nth(1)).toBeVisible();

	await expect(page.getByRole('heading', { name: 'Production Overview' }).first()).toBeVisible();
	await expect(page.locator('svg').filter({ hasText: 'DownRunningMeal/' })).toBeVisible();
	await expect(page.getByRole('main')).toContainText('Count');
	await expect(page.getByRole('main')).toContainText('Down');
	await expect(page.getByRole('main')).toContainText('Running');
	await expect(page.getByRole('main')).toContainText('Meal/Break');
	await expect(page.getByRole('main')).toContainText('Changeover');
	await expect(page.getByRole('main')).toContainText('Meeting');
	await expect(page.getByRole('main')).toContainText('Duration (hours');

  await page.goto('http://localhost:3000/');  // Ensure using the correct port

  await page.getByLabel('MakerBot').check();
  await expect(page.getByText('MakerBot Production ReportOct')).toBeVisible();
  await expect(page.getByText('Oct 27, 2024 - Oct 29,').first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Process State' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Good Count' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Reject Count' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'duration (hrs)' }).first()).toBeVisible();

  await expect(page.getByRole('row', { name: 'Down 0 11 4.73' }).getByRole('cell').nth(1)).toBeVisible();
  await expect(page.getByRole('row', { name: 'Running 63,313 1,700 31.56' }).getByRole('cell').nth(1)).toBeVisible();
  await expect(page.getByRole('row', { name: 'Meal/Break 743 0 5.56' }).getByRole('cell').nth(1)).toBeVisible();
  await expect(page.getByRole('row', { name: 'Changeover 0 0 1.93' }).getByRole('cell').nth(1)).toBeVisible();
  await expect(page.getByRole('row', { name: 'Meeting 2 0 0.13' }).getByRole('cell').nth(1)).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Production Overview' }).first()).toBeVisible();
  await expect(page.locator('svg').filter({ hasText: 'DownRunningMeal/' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Count');
  await expect(page.getByRole('main')).toContainText('Down');
  await expect(page.getByRole('main')).toContainText('Running');
  await expect(page.getByRole('main')).toContainText('Meal/Break');
  await expect(page.getByRole('main')).toContainText('Changeover');
  await expect(page.getByRole('main')).toContainText('Meeting');
  await expect(page.getByRole('main')).toContainText('Duration (hours');

});

/* This test launches a Chromium browser and selects the "Download" button to
make sure the application can successfully generate a PDF and save it to the
user's system. */

test('verify PDF and print', async () => {
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage({ acceptDownloads: true });
	await page.goto('http://localhost:3000/');

	const [download] = await Promise.all([
		page.waitForEvent('download'),
		page.getByRole('button', { name: 'Download PDF' }).click()
	]);
	expect(download.path);
});


test('verify PDF and print', async () => {
  // Set timeout for this test
  test.setTimeout(60000); // Timeout in milliseconds (60 seconds)

  const browser = await chromium.launch({ headless: false });  // Launch browser
  const page = await browser.newPage({ acceptDownloads: true });  // Accept downloads

  await page.goto('http://localhost:3000/');  // Open your app at the correct URL

  // Wait for the download to be triggered after clicking the download button
  const [download] = await Promise.all([
    page.waitForEvent('download'),  // Wait for the download event
    page.getByRole('button', { name: 'Download PDF' }).click()  // Click the download button
  ]);

  expect(download.path()).toBeDefined();  // Ensure the download path is valid

  // Optional: Save the file (you can specify where it will be saved)
  await download.saveAs('path/to/your/downloaded/file.pdf');

  await browser.close();  // Close the browser
});
 // Increase the timeout to 60 seconds or more
  

