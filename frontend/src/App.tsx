import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Calendar from './pages/Calendar'
import Circuits from './pages/Circuits'
import Drivers from './pages/Drivers'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Statistics from './pages/Statistics'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="circuits" element={<Circuits />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
