import { WebhookProvider } from './context/WebhookContext';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <WebhookProvider>
      <Dashboard />
    </WebhookProvider>
  );
}
