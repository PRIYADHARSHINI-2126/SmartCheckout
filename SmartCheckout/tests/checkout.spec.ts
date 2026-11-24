import { expect, test } from '@playwright/test';

test.describe('Alder & Clay Single-Page Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Pour-Over Hardware & Checkout' }),
    ).toBeVisible();
    await expect(page.getByTestId('empty-cart-state')).toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('₹0.00');
  });

  test('1. Successful checkout produces a single confirmation with reference', async ({
    page,
  }) => {
    await page.getByTestId('add-to-cart-pour-over-kettle').click();

    await expect(page.getByTestId('header-cart-count')).toHaveText('(1)');
    await expect(page.getByTestId('line-total-pour-over-kettle')).toHaveText('₹600.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹600.00');

    const nameInput = page.getByLabel(/Full Name/i);
    await nameInput.fill('Maya Lin');
    await expect(nameInput).toHaveValue('Maya Lin');

    await page.getByRole('button', { name: 'Place Order' }).click();

    const confirmations = page.getByTestId('order-confirmation');
    await expect(confirmations).toHaveCount(1);
    await expect(confirmations).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Order Confirmed' })).toBeVisible();
    await expect(confirmations).toContainText('Maya Lin');
    await expect(page.getByTestId('order-reference')).toHaveText(/^AC-\d{6}$/);
    await expect(page.getByTestId('confirmed-total')).toHaveText('₹600.00');
    await expect(page.getByTestId('place-order-button')).toBeDisabled();
    await expect(page.getByTestId('place-order-button')).toHaveText('Order Placed');
  });

  test('2. Missing required name field blocks checkout and preserves cart state', async ({
    page,
  }) => {
    await page.getByTestId('add-to-cart-ceramic-dripper').click();
    await expect(page.getByTestId('cart-item-ceramic-dripper')).toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('₹300.00');

    await page.getByRole('button', { name: 'Place Order' }).click();

    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('Full Name is required to complete your order.');
    await expect(page.getByTestId('name-error')).toHaveText(
      'Full Name is required to complete your order.',
    );

    await expect(page.getByTestId('order-confirmation')).toHaveCount(0);
    await expect(page.getByTestId('cart-item-ceramic-dripper')).toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('₹300.00');
  });

  test('3. Quantity changes update line totals and exact order total', async ({
    page,
  }) => {
    await page.getByTestId('add-to-cart-pour-over-kettle').click();
    await expect(page.getByTestId('line-total-pour-over-kettle')).toHaveText('₹600.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹600.00');

    await page.getByTestId('cart-increase-pour-over-kettle').click();
    await expect(page.getByTestId('cart-qty-input-pour-over-kettle')).toHaveValue('2');
    await expect(page.getByTestId('line-total-pour-over-kettle')).toHaveText('₹1,200.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹1,200.00');

    await page.getByTestId('add-to-cart-ceramic-dripper').click();
    await page.getByTestId('cart-increase-ceramic-dripper').click();
    await page.getByTestId('cart-increase-ceramic-dripper').click();
    await expect(page.getByTestId('cart-qty-input-ceramic-dripper')).toHaveValue('3');
    await expect(page.getByTestId('line-total-ceramic-dripper')).toHaveText('₹900.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹2,100.00');
    await expect(page.getByTestId('header-cart-count')).toHaveText('(5)');

    await page.getByTestId('cart-decrease-pour-over-kettle').click();
    await expect(page.getByTestId('cart-qty-input-pour-over-kettle')).toHaveValue('1');
    await expect(page.getByTestId('line-total-pour-over-kettle')).toHaveText('₹600.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹1,500.00');
    await expect(page.getByTestId('header-cart-count')).toHaveText('(4)');
  });
});
