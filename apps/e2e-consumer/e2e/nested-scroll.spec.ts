import { expect, type Locator, type Page, test } from '@playwright/test';

const INNER_SCROLL_PX = 120;
const FOLLOW_TOLERANCE_PX = 12;

async function waitForOverlayPaint(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

async function openOverlayPane(page: Page, trigger: Locator): Promise<Locator> {
  await trigger.click();
  const pane = page.locator('.cdk-overlay-container .cdk-overlay-pane').last();
  await expect(pane).toBeVisible();
  return pane;
}

function closestEdgeGap(
  trigger: { y: number; height: number },
  panel: { y: number; height: number },
): number {
  const below = panel.y - (trigger.y + trigger.height);
  const above = trigger.y - (panel.y + panel.height);
  return Math.min(Math.abs(below), Math.abs(above));
}

async function expectOverlayFollowsTrigger(
  page: Page,
  trigger: Locator,
  panel: Locator,
  scroller: Locator,
): Promise<void> {
  const startScroll = await scroller.evaluate((el) => (el as HTMLElement).scrollTop);
  const beforeTrigger = await trigger.boundingBox();
  const beforePanel = await panel.boundingBox();
  expect(beforeTrigger, 'trigger box before scroll').toBeTruthy();
  expect(beforePanel, 'panel box before scroll').toBeTruthy();

  await scroller.evaluate((el, top) => {
    (el as HTMLElement).scrollTop = top;
  }, startScroll + INNER_SCROLL_PX);
  await waitForOverlayPaint(page);

  const afterTrigger = await trigger.boundingBox();
  const afterPanel = await panel.boundingBox();
  expect(afterTrigger, 'trigger box after scroll').toBeTruthy();
  expect(afterPanel, 'panel box after scroll').toBeTruthy();

  expect(afterTrigger!.y, 'inner scroll must move the trigger').toBeLessThan(beforeTrigger!.y - 40);
  expect(
    closestEdgeGap(afterTrigger!, afterPanel!),
    'panel must stay glued to the trigger after nested overflow scroll',
  ).toBeLessThan(FOLLOW_TOLERANCE_PX);
}

async function expectOverlayClosesOnScroll(
  page: Page,
  panel: Locator,
  scroller: Locator,
): Promise<void> {
  const startScroll = await scroller.evaluate((el) => (el as HTMLElement).scrollTop);
  await expect(panel).toBeVisible();

  await scroller.evaluate((el, top) => {
    (el as HTMLElement).scrollTop = top;
  }, startScroll + INNER_SCROLL_PX);
  await waitForOverlayPaint(page);

  await expect(panel).toBeHidden();
}

test.describe('nested overflow overlays', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const scroller = page.getByTestId('nested-scroll-container');
    await scroller.scrollIntoViewIfNeeded();
    await scroller.evaluate((el) => {
      (el as HTMLElement).scrollTop = 0;
    });
  });

  test('select panel closes when the overflow container scrolls', async ({ page }) => {
    const scroller = page.getByTestId('nested-scroll-container');
    const trigger = page.getByTestId('nested-select').locator('button').first();
    const pane = await openOverlayPane(page, trigger);
    await expect(pane.getByRole('listbox')).toBeVisible();
    await expectOverlayClosesOnScroll(page, pane, scroller);
  });

  test('datepicker calendar follows the trigger when the overflow container scrolls', async ({
    page,
  }) => {
    const scroller = page.getByTestId('nested-scroll-container');
    const trigger = page.getByTestId('nested-datepicker').locator('button[aria-haspopup="dialog"]');
    const pane = await openOverlayPane(page, trigger);
    await expect(page.getByRole('grid')).toBeVisible();
    await expectOverlayFollowsTrigger(page, trigger, pane, scroller);
  });

  test('menu closes when the overflow container scrolls', async ({ page }) => {
    const scroller = page.getByTestId('nested-scroll-container');
    const trigger = page.getByTestId('nested-menu-trigger');
    const pane = await openOverlayPane(page, trigger);
    await expect(pane.getByRole('menu')).toBeVisible();
    await expectOverlayClosesOnScroll(page, pane, scroller);
  });

  test('table column filter closes when the overflow container scrolls', async ({ page }) => {
    const scroller = page.getByTestId('nested-scroll-container');
    const trigger = page
      .getByTestId('nested-table')
      .getByRole('combobox', { name: 'Filtrar Estado' });
    await trigger.scrollIntoViewIfNeeded();
    const pane = await openOverlayPane(page, trigger);
    await expect(pane.getByRole('listbox')).toBeVisible();
    await expectOverlayClosesOnScroll(page, pane, scroller);
  });
});
