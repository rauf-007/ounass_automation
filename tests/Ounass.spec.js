require('dotenv').config()
import { test, expect, chromium } from '@playwright/test'
import { TestCasesOunass } from '../Pages/RegistrationTestCases'
import { TestCasesOunass1 } from '../Pages/PurchaseItems'


import MailosaurClient from "mailosaur";

const mailosaur = new MailosaurClient("YOUR_API_KEY_HERE")


let page

// let testResults = []

// const secretKey = "rauf123$"; // Use the same key used for encryption

// function decrypt(text) {
//   const bytes = CryptoJS.AES.decrypt(text, secretKey);
//   return bytes.toString(CryptoJS.enc.Utf8);
// }

test.beforeAll(async ({browser})=>{

  page=await browser.newPage()
  test.setTimeout(300000)
  await page.goto(process.env.URL)
})

test('Verify Account Registration Process and verify it is the same email with which you registered the account', async () => {
    const sm = new TestCasesOunass(page)
    await sm.verifyRegistration()
  })

test('Verify after logging into the account the “Email-Address” field is un-editable', async () => {
    const sm = new TestCasesOunass(page)
    await sm.verifyEmailEditable()
  })


test('Verifying Adding different kinds of items into the bags', async () => {
  const sm = new TestCasesOunass1(page)
  await sm.addProducts()
})

test('Verify that exactly same items are added into the “Bag”.', async () => {
  const sm = new TestCasesOunass1(page)
  await sm.verifyBagItems()
})

test('Verify Subtotal amount is correct after calculating prices of all products in bag', async () => {
  const sm = new TestCasesOunass1(page)
  await sm.verifysubtotal()
})

test('Verify customer lands to delivery address page on clicking secure checkout button', async () => {
  const sm = new TestCasesOunass1(page)
  await sm.verifyCheckout()
})

test('Verify delivery address information is entered successfully', async () => {
  const sm = new TestCasesOunass1(page)
  await sm.fillAddressForm()
})

test('Verify customer lands to credit card page after entering delivery address information', async () => {
  const sm = new TestCasesOunass1(page)
  await sm.confirmPayment()
})



