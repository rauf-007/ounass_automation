import {test, chromium, expect} from '@playwright/test'
const assert = require('assert')
const fs = require('fs');
const path = require('path');


export class TestCasesOunass{

    constructor(page){
                                   //div[@class='z-10 relative w-full max-w-2xl']/child::*[1]
        this.page = page
        this.createAccount = "//span[contains(text(),'Account') or contains(text(), 'الحساب')]"
        this.firstName = "//input[@name='firstName']"
        this.lastname = "input[name='lastName']"
        this.email = "input[class='Profile-email is-invalid']"
        this.password = "input[class='Profile-email is-invalid']"
        this.signUp = "//button[@class = 'Sign me Up!']"
        this.accountSetup = "//button[contains(text(),'Create Account') or contains(text(), 'إنشاء حساب')]"
        this.editInfo = "//a[text()='Edit' or text()= 'تعديل']"
        this.createAccountBtn = "//a[@class=' Button SignInForm-createAccountLink secondary']"
        this.emailField = "//input[@type='email']"
        this.pswrdField = "//input[@type='password']"
        this.newsCheckBox = "#NewsletterField-subscribe"
        this.personIcon = "use[href='/static-v2/icons/sprite.svg#Person']"
        this.emailLocator = "//span[@class='MyAccountPage-value']"
        this.profileEmail = "//input[@class='Profile-email']"

        const randomNumber = Math.floor(Math.random() * 1000) + 1
        this.generateRandomName = `Practice TEST${randomNumber}`
        this.generateRandomEmaill = `testing_email${randomNumber}${randomNumber}@gmail.com`

    }


    async verifyRegistration(){
      await this.page.click(this.signUp)
      await this.page.click(this.createAccount)
      await this.page.click(this.createAccountBtn)
      await this.page.waitForTimeout(2000)
      await this.page.type(this.lastname , "User")
      await this.page.type(this.firstName , "Testing")

      let generateRandomEmail = this.generateRandomEmaill
      await this.page.locator(this.emailField).nth(1).type(`${generateRandomEmail}`)
      await this.page.keyboard.press('Control+A')
      await this.page.keyboard.press('Control+C')

      await this.page.locator(this.pswrdField).nth(1).type("Asdf@1234")
      await this.page.click(this.newsCheckBox)
      await this.page.click(this.accountSetup)
      await this.page.waitForTimeout(2000)
      await this.page.click(this.personIcon)
      await this.page.waitForTimeout(2000)

      let emailLocator = await this.page.locator(this.emailLocator).nth(1)
      await expect.soft(emailLocator).toHaveText(`${generateRandomEmail}`)
      await this.page.click(this.editInfo)
      await this.page.waitForTimeout(2000)

    }

    async verifyEmailEditable(){
      let emailLocator1 = await this.page.locator(this.profileEmail)

      const isDisabled = await emailLocator1.evaluate(el => el.disabled);
      expect.soft(isDisabled).toBe(true);
    }


  }


