import ApolloProvider from './ApolloProvider';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <ApolloProvider>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
