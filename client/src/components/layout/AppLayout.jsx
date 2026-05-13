import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AskAIButton from '../ui/AskAIButton';

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Topbar />
      <main className="md:ml-72 min-h-screen">
        <Outlet />
      </main>
      <AskAIButton />
    </div>
  );
}
