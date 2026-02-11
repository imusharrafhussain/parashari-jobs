import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import LandingPage from './pages/LandingPage'
import ApplicationPage from './pages/ApplicationPage'
import SuccessPage from './pages/SuccessPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/apply" element={<ApplicationPage />} />
                <Route path="/success" element={<SuccessPage />} />
            </Routes>
            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}

export default App
