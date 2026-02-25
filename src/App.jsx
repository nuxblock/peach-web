import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import PeachAuth from './screens/peach-auth.jsx'
import PeachHome from './screens/peach-home.jsx'
import PeachMarket from './screens/peach-market-view.jsx'
import OfferCreation from './screens/peach-offer-creation.jsx'
import TradesDashboard from './screens/peach-trades-dashboard.jsx'
import TradeExecution from './screens/peach-trade-execution.jsx'
import SettingsScreen from './screens/peach-settings.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PeachAuth />} />
        <Route path="/home" element={<PeachHome />} />
        <Route path="/market" element={<PeachMarket />} />
        <Route path="/offer/new" element={<OfferCreation />} />
        <Route path="/trades" element={<TradesDashboard />} />
        <Route path="/trade/:id" element={<TradeExecution />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
