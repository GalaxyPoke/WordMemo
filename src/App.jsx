import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WordStudyApp } from './features/wordStudy'
import './index.css'
import './styles/wordStudy.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WordStudyApp />} />
        <Route path="*" element={<WordStudyApp />} />
      </Routes>
    </Router>
  )
}

export default App
