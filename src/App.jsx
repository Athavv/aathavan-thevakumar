import { useState, useCallback } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import IntroSunrise from "./components/IntroSunrise"
import StarField from "./components/StarField"
import Home from "./pages/Home"
import ProjectDetail from "./pages/ProjectDetail"

function App() {
  const [doneIntro, setDoneIntro] = useState(false)

  const handleIntroFinish = useCallback(() => {
    setDoneIntro(true)
  }, [])

  return (
    <Router>
      <div>
        <StarField />
        {!doneIntro && <IntroSunrise onFinish={handleIntroFinish} />}
        {doneIntro && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App