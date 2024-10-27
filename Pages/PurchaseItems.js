import {test, chromium, expect} from '@playwright/test'
const assert = require('assert')
const fs = require('fs');
const path = require('path');

const sharedState = {
    a: null,
    b: null,
}

export class TestCasesOunass1{

    constructor(page){
        //div[@class='z-10 relative w-full max-w-2xl']/child::*[1]
        this.page = page
        this.ounass = "//a[@aria-label='Ounass Logo']"
        this.manProducts = "//div[text()='تسوق الآن' or text()='SHOP MEN']"
        this.firstProduct = "//body/div[@id='root-desktop']/main[1]/section[2]/ul[1]/li[1]/a[1]/span[1]/img[1]"
        this.firstProductText = "h1[class='PDPDesktop-name'] span"
        this.addToBag = "//button[@class=' Button  PDPDesktop-addToBagButton primary']"
        this.winterSale = "(//a[@href='/men/clothing'])[1]"
        this.sizeMenu = "//button[@id='size-code-select-input']"
        this.mediumOption = "//div[@id='size-code-select-option-1']"
        this.largeOption = "//div[@id='size-code-select-option-2']"
        this.casualShirtsPg = "//span[contains(text(), 'Casual Shirts') or contains(text(), 'قمصان كاجوال')]"
        this.designerTag = "//span[contains(text(),'Amiri') or contains(text(), 'آيس كريم')]"
        this.blueFilter = "//span[contains(text(),'Blue') or contains(text(), 'أزرق')]"
        this.largeSize = "//span[(text()='L')]"
        this.bagItems = "//span[contains(text(),'Bag')or contains(text(), 'الحقيبة')]"
        this.verifyFirstP = "(//h4[@class='CartItem-name'])[1]"
        this.verifySecondP = "(//h4[@class='CartItem-name'])[2]"
        this.secureCheckOut = "//span[contains(text(),'Secure Checkout') or contains(text(), 'الدفع الآمن')]"
        this.totalAmount = "(//span[@class='money CartTotal-segmentAmount'])[1]                         "
        this.enterAddress = "//button[contains(text(),'ENTER ADDRESS MANUALLY') or contains(text(), 'إدخال الموقع يدوياً')]"
        this.area = "//input[@id='city']"
        this.deliveryAddress = "//input[@id='street']"
        this.room = "//input[@id='additionalInformation']"
        this.bagLoader = "//button[@class='Button  PDPDesktop-addToBagButton primary is-loading']"
        this.firstName = "//input[@id='firstName']"
        this.LastName = "//input[@id='lastName']"
        this.email = "//input[@id='email']"
        this.phoneNo = "//input[@id='mobileNumber']"
        this.continue = "//button[contains(text(),'Continue') or contains(text(),'متابعة')]"
        this.creditCardPage = "//h2[contains(text(),'Select Payment Method') or contains(text(),'اختيار طريقة الدفع')]"
        this.deliveryPage = "//h2[contains(text(),'Where You Want Us To Deliver?') or contains(text(),'اختر عنوان التوصيل')]"
        this.productPrices = "//div[@class='CartItem-currentPrice']"
        this.subtTotalAmount = "//span[@class='money CartTotal-segmentAmount']"

        const randomNumber = Math.floor(Math.random() * 1000) + 1
        this.generateRandomName = `Practice TEST${randomNumber}`
        this.generateRandomEmaill = `testing_email${randomNumber}@gmail.com`
    }

    async addProducts(){
        await this.page.click(this.ounass)
        // await this.page.click("//button[@id='wzrk-confirm']")
        await this.page.waitForTimeout(2000)
        await this.page.click(this.manProducts)
        await this.page.click(this.winterSale)
        await this.page.click(this.firstProduct)
        await this.page.waitForTimeout(2000)
        sharedState.a = await this.page.locator(this.firstProductText).textContent()
        console.log(sharedState.a)

        await this.page.click(this.sizeMenu)
        await this.page.click(this.mediumOption)
        await this.page.click(this.addToBag)
        await this.page.waitForSelector(this.bagLoader , { state: 'detached' });

        // await this.page.waitForTimeout(4000)

        await this.page.click(this.winterSale)
        await this.page.click(this.designerTag)
        await this.page.click(this.blueFilter)
        await this.page.click(this.largeSize)
        await this.page.click(this.firstProduct)

        await this.page.waitForTimeout(2000)
        sharedState.b = await this.page.locator(this.firstProductText).textContent()
        console.log(sharedState.b)

        await this.page.click(this.sizeMenu)
        await this.page.click(this.largeSize)
        await this.page.click(this.addToBag)
        await this.page.waitForTimeout(4000)

    }

    async verifyBagItems(){
        await this.page.click(this.bagItems)
        await this.page.waitForTimeout(3000)

        let c = await this.page.locator(this.verifyFirstP).textContent()
        console.log(c)
        let d = await this.page.locator(this.verifySecondP).textContent()
        console.log(d)

        console.log(sharedState.a)
        console.log(sharedState.b)

        expect.soft(sharedState.a).toBe(c)
        expect.soft(sharedState.b).toBe(d)
    }

    async verifysubtotal(){
        const prices = await this.page.$$eval(this.productPrices, elements => {
            // Convert text to numbers
            return elements.map(el => parseFloat(el.textContent.replace(/[^\d.]/g, '')))
          });

          const total = prices.reduce((acc, price) => acc + price, 0)

          console.log('Total sum of prices:', total)

         const subtotalText = await this.page.$eval(this.subtTotalAmount, el => el.textContent)

         const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, ''))
         console.log('Subtotal value:', subtotal)

         assert.strictEqual(total, subtotal, `Total (${total}) does not match the Subtotal (${subtotal})`)

    }


    async verifyCheckout(){
        await this.page.waitForTimeout(2000)
        await this.page.click(this.secureCheckOut)
        await this.page.waitForTimeout(4000)
        await expect.soft(this.page.locator(this.deliveryPage)).toHaveText(/Where You Want Us To Deliver\?|اختر عنوان التوصيل/)
    }


    async fillAddressForm(){
        await this.page.click(this.enterAddress)
        await this.page.waitForTimeout(4000)
        await this.page.type(this.area , 'Businesss Bay Area')
        await this.page.waitForTimeout(1000)
        await this.page.type(this.deliveryAddress, 'Street 3 Lock Virsa, Dubai' )
        await this.page.type(this.room, 'Apartment 2105')

        await this.page.type(this.firstName, 'Test')
        await this.page.type(this.LastName, 'User')
        // await this.page.type(this.email, 'TestUser@gmail.com')
        await this.page.type(this.phoneNo, '501234567')
    }

    async confirmPayment(){
        await this.page.click(this.continue)
        await this.page.waitForTimeout(4000)
        await expect.soft(this.page.locator(this.creditCardPage)).toHaveText(/Select Payment Method|اختيار طريقة الدفع/)
    }

}


