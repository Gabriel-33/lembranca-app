import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Routes
} from 'react-router-dom';
import {NovaLembranca} from "./components/NovaLembranca.js";
import {Lembrancas} from "./components/lembrancas";
import "./css/style.css";

const App  = () =>{

  return (
    <div className="App">
      <Router>
        <div className='containerStyle'> 
          <div className='menuStyle'>
            <div className="linkLista">
              <NavLink to="/" className='linkStyle' style={({ isActive }) => ({ 
                color: isActive ? 'greenyellow' : '' })}>ADICIONAR LEMBRANÇA
              </NavLink>
              <NavLink to="/lembrancas" className='linkStyle' style={({ isActive }) => ({ 
                color: isActive ? 'greenyellow' : '' })}>VER LEMBRANÇAS
              </NavLink>
            </div>
          </div>
          <div className='conteudo'>
            <Routes>
              <Route exact path="/" element={<NovaLembranca/>}/>
              <Route path="/lembrancas" element={<Lembrancas/>} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}
export default App;
