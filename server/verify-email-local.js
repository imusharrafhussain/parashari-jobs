import 'dotenv/config'
import { verifyEmailConnection, sendOTPEmail } from './services/emailService.js'

async function runTest() {
    console.log('🧪 Starting Local Email Verification...')
    console.log('----------------------------------------')
    console.log(`User: ${process.env.EMAIL_USER}`)
    console.log(`HR Email: ${process.env.HR_EMAIL}`)
    console.log('----------------------------------------')

    try {
        // 1. Test Connection
        console.log('Step 1: Testing SMTP Connection...')
        await verifyEmailConnection()
        console.log('✅ Connection Verified!')

        // 2. Test Sending
        console.log('\nStep 2: Sending Test Email (OTP)...')
        // Sending to self for safety
        const testRecipient = process.env.HR_EMAIL || process.env.EMAIL_USER
        console.log(`Sending to: ${testRecipient}`)

        const info = await sendOTPEmail(testRecipient, '123456')

        console.log('✅ Email Sent Successfully!')
        console.log('Message ID:', info.messageId)
        console.log('Response:', info.response)

        console.log('\n----------------------------------------')
        console.log('🎉 VERIFICATION SUCCESSFUL')
        console.log('The email system is receiving and sending correctly.')
        process.exit(0)

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED')
        console.error('----------------------------------------')
        console.error('Error Name:', error.name)
        console.error('Error Message:', error.message)
        if (error.response) {
            console.error('SMTP Response:', error.response)
        }
        console.error('Full Stack:', error.stack)
        process.exit(1)
    }
}

runTest()
