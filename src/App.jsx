import Dabba from './components/Dabba';
import Header from './components/Header';
import Poly from './components/Poly';

/* The Moon River Adventure (Story content stays the same) */

function App() {
  return (
    <div class="bg-sky h-screen flex flex-col items-center justify-center">
      <Header />
      <div class="flex flex-col gap-6">
        <Poly center={true} />
      </div>
    </div>
  );
}

export default App;
