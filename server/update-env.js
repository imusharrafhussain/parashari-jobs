import fs from 'fs'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Generate secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex')

// Generate admin password hash
const password = 'admin'
const hash = bcrypt.hashSync(password, 10)

const envContent = `

# Security Configuration - Added by Auto-Upgrade
JWT_SECRET=${jwtSecret}
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=${hash}
# Default Admin Password: admin
`

try {
    fs.appendFileSync('.env', envContent)
    console.log('✅ Updated .env with security configuration')
    console.log(`   Admin Username: admin`)
    console.log(`   Admin Password: admin`)
    console.log(`   JWT Secret generated`)
} catch (error) {
    console.error('❌ Failed to update .env:', error)
    process.exit(1)
}
