// Calculate ATS score based on parsed resume data
// Calculate ATS score based on parsed resume data
export function calculateATSScore(parsedData, resumeText, jobCategory) {
    let score = 0

    // 1. Contact Information (10 points)
    if (parsedData.email) score += 5
    if (parsedData.phone) score += 5

    // 2. Skills Match (30 points)
    const skillsCount = parsedData.skills.length
    const skillsScore = Math.min(skillsCount * 3, 30)
    score += skillsScore

    // 3. Experience (25 points)
    const experienceScore = calculateExperienceScore(parsedData.experience, resumeText)
    score += experienceScore

    // 4. Education (20 points)
    const educationScore = calculateEducationScore(parsedData.education)
    score += educationScore

    // 5. Resume Completeness (15 points)
    const completenessScore = calculateCompletenessScore(resumeText)
    score += completenessScore

    // Cap at 100
    return Math.min(Math.round(score), 100)
}

// Calculate experience score
function calculateExperienceScore(experience, resumeText) {
    const lowerText = resumeText.toLowerCase()

    // Try to extract years from experience string or resume
    const yearMatches = experience.match(/(\d+)\+?\s*(years?|yrs?)/) ||
        resumeText.match(/(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*(experience|exp)/i)

    if (yearMatches) {
        const years = parseInt(yearMatches[1])
        if (years >= 5) return 25
        if (years >= 3) return 20
        if (years >= 1) return 15
        return 10
    }

    // Check for job-related keywords
    const jobKeywords = ['worked', 'developed', 'managed', 'led', 'created', 'designed',
        'implemented', 'project', 'team', 'responsibility']
    let keywordCount = 0

    jobKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) keywordCount++
    })

    // Give points based on keyword presence
    return Math.min(keywordCount * 2, 15)
}

// Calculate education score
function calculateEducationScore(education) {
    if (!education || education === 'Education details in resume') {
        return 5 // Minimal score
    }

    const lowerEducation = education.toLowerCase()

    // Higher degrees get more points
    if (lowerEducation.includes('phd') || lowerEducation.includes('doctorate')) return 20
    if (lowerEducation.includes('master') || lowerEducation.includes('m.tech') ||
        lowerEducation.includes('m.sc') || lowerEducation.includes('mba') ||
        lowerEducation.includes('mca')) return 18
    if (lowerEducation.includes('bachelor') || lowerEducation.includes('b.tech') ||
        lowerEducation.includes('b.e.') || lowerEducation.includes('b.sc') ||
        lowerEducation.includes('bca')) return 15
    if (lowerEducation.includes('diploma')) return 12

    return 10
}

// Calculate completeness score
function calculateCompletenessScore(resumeText) {
    let score = 0

    // Word count (good resumes have 300-2000 words)
    const wordCount = resumeText.split(/\s+/).length
    if (wordCount >= 300 && wordCount <= 2000) {
        score += 5
    } else if (wordCount >= 200) {
        score += 3
    }

    // Check for common resume sections
    const lowerText = resumeText.toLowerCase()
    const sections = ['experience', 'education', 'skills', 'project']

    sections.forEach(section => {
        if (lowerText.includes(section)) score += 2.5
    })

    return Math.min(score, 15)
}
