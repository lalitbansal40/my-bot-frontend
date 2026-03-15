import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// third-party
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// scroll bar
import 'simplebar/dist/simplebar.css';

// apex-chart
import 'assets/third-party/apex-chart.css';
import 'assets/third-party/react-table.css';

// project import
import App from './App';
import { store } from 'store';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container!);

// React Query Client
const queryClient = new QueryClient();

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

root.render(
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </ReduxProvider>
);

reportWebVitals();