import bcrypt from 'bcryptjs'

/**
 * Generate bcrypt hash for admin password
 * Usage: node generate-admin-hash.js YOUR_PASSWORD_HERE
 */

const password = process.argv[2]

if (!password) {
    console.error('❌ Error: Please provide a password as an argument')
    console.log('Usage: node generate-admin-hash.js YOUR_PASSWORD_HERE')
    process.exit(1)
}

if (password.length < 8) {
    console.warn('⚠️  Warning: Password should be at least 8 characters long')
}

// Generate hash with 10 salt rounds
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('❌ Error generating hash:', err)
        process.exit(1)
    }

    console.log('\n✅ Password hash generated successfully!\n')
    console.log('Add this to your .env file:\n')
    console.log(`ADMIN_PASSWORD_HASH=${hash}\n`)
    console.log('⚠️  IMPORTANT: Keep this hash secure and never commit it to Git!\n')
})
