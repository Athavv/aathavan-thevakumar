import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import IntroSunrise from "./components/IntroSunrise"
import StarField from "./components/StarField"
import Home from "./pages/Home"
import ProjectDetail from "./pages/ProjectDetail"

function App() {
  const [doneIntro, setDoneIntro] = useState(false)

  return (
    <Router>
      <div>
        <StarField />
        {!doneIntro && <IntroSunrise onFinish={() => setDoneIntro(true)} />}
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