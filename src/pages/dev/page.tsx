import { useDevAuth } from '@/hooks/useDevAuth';
import DevLogin from './components/DevLogin';
import DevDashboard from './components/DevDashboard';

const DevPage = () => {
  const auth = useDevAuth();
  return auth.isAuthenticated
    ? <DevDashboard logout={auth.logout} />
    : (
      <DevLogin
        login={auth.login}
        error={auth.error}
        clearError={auth.clearError}
        lockoutRemaining={auth.lockoutRemaining}
      />
    );
};

export default DevPage;
