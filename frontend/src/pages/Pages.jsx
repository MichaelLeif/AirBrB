import React from 'react'
import Landing from './Landing.jsx'
import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'

function Pages () {
  const nav = useNavigate();
  React.useEffect(() => {
    nav('/landing')
  }, []);

  return (
    <>
      <Routes>
        <Route path="landing" element={<Landing />} />
      </Routes>
    </>
  )
}

export default Pages
