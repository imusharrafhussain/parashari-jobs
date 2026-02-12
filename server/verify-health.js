// verify health endpoint
async function check() {
    console.log('Checking: https://parashari-jobs-portal-backend.onrender.com/api/health');
    try {
        const res = await fetch('https://parashari-jobs-portal-backend.onrender.com/api/health', { signal: AbortSignal.timeout(5000) });
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}
check();
