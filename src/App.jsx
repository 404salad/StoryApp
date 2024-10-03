import Dabba from './components/Dabba';
import Header from './components/Header';
import Poly from './components/Poly';

function App() {
  return (
    <div class='bg-sky h-screen'>
      <Header />
      <Dabba yellow={true} />
      <Dabba yellow={false} />
      <Poly />
      <button>moo</button>
    </div>
  );
}

export default App;
