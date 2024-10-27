import {test, expect, chromium} from '@playwright/test';


module.exports = async config => {
    const page = await browser.newPage()

    await page.goto("https://qa.superadmin.radiusxr.com/")
    await this.page.type("//input[@name='email']",'admin@radiusxr.com')
    await this.page.type("//input[@name='password']",'Password.123')
    //Wait for capcha.
    await this.page.click("//button[contains(text(),'Login')]")
    await page.context().storageState({path: "user.json"})

}