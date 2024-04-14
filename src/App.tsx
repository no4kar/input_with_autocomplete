import React from 'react';
import './App.css';
import HybridInput from './components/HybridInput/HybridInput';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {

  return (
    <div className="App">
      <header className="App-header">
      </header>

      <main>
        <QueryClientProvider client={queryClient}>
          <HybridInput />
        </QueryClientProvider>
      </main>
    </div>
  );
}

export default App;
