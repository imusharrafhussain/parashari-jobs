import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

// Extract text from PDF or DOCX
export async function parseResume(buffer, mimeType) {
    let text = ''

    try {
        if (mimeType === 'application/pdf') {
            const data = await pdfParse(buffer)
            text = data.text
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer })
            text = result.value
        }

        // Parse the extracted text
        const parsedData = {
            email: extractEmail(text),
            phone: extractPhone(text),
            skills: extractSkills(text),
            experience: extractExperience(text),
            education: extractEducation(text)
        }

        return { text, parsedData }
    } catch (error) {
        console.error('Resume parsing error:', error)
        throw new Error('Failed to parse resume')
    }
}

// Extract email using regex
function extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const matches = text.match(emailRegex)
    return matches ? matches[0] : ''
}

// Extract phone number (Indian format)
function extractPhone(text) {
    const phoneRegex = /(?:\+91|0)?[6-9]\d{9}/g
    const matches = text.match(phoneRegex)
    return matches ? matches[0] : ''
}

// Extract skills from common keywords
function extractSkills(text) {
    const skillKeywords = [
        // Programming Languages
        'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin',
        'TypeScript', 'Perl', 'Scala', 'R', 'MATLAB', 'SQL',

        // Web Technologies
        'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
        'ASP.NET', 'Laravel', 'Next.js', 'Nuxt.js', 'Svelte', 'Bootstrap', 'Tailwind',

        // Mobile
        'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin',

        // Databases
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite', 'DynamoDB', 'Cassandra',

        // Cloud & DevOps
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD',
        'Terraform', 'Ansible',

        // AI/ML
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP',
        'Computer Vision', 'Data Science', 'AI',

        // Data
        'Data Analysis', 'Excel', 'Power BI', 'Tableau', 'Pandas', 'NumPy',

        // Business Skills
        'Project Management', 'Agile', 'Scrum', 'JIRA', 'Leadership', 'Communication',
        'Problem Solving', 'Team Management', 'Strategic Planning',

        // Astrology/Spiritual (specific to AstroBharatAI)
        'Astrology', 'Vedic Astrology', 'Numerology', 'Kundli', 'Horoscope', 'Tarot',
        'Spiritual Guidance', 'Vastu', 'Palmistry'
    ]

    const foundSkills = []
    const lowerText = text.toLowerCase()

    skillKeywords.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            foundSkills.push(skill)
        }
    })

    return [...new Set(foundSkills)] // Remove duplicates
}

// Extract experience information
function extractExperience(text) {
    // Look for years of experience
    const expRegex = /(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*(experience|exp)/gi
    const matches = text.match(expRegex)

    if (matches) {
        return matches[0]
    }

    // Look for company names (common patterns)
    const companies = []
    const lines = text.split('\n')

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        // Simple heuristic: lines with dates might be job experiences
        if (/\d{4}\s*-\s*(\d{4}|present|current)/i.test(line)) {
            if (lines[i - 1]) companies.push(lines[i - 1].trim())
        }
    }

    return companies.length > 0 ? companies.join(', ') : 'Experience details in resume'
}

// Extract education information
function extractEducation(text) {
    const degrees = ['B.Tech', 'M.Tech', 'B.E.', 'M.E.', 'B.Sc', 'M.Sc', 'BCA', 'MCA',
        'MBA', 'PhD', 'Bachelor', 'Master', 'Diploma']

    const foundDegrees = []
    const lowerText = text.toLowerCase()

    degrees.forEach(degree => {
        if (lowerText.includes(degree.toLowerCase())) {
            foundDegrees.push(degree)
        }
    })

    return foundDegrees.length > 0 ? foundDegrees.join(', ') : 'Education details in resume'
}
