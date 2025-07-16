import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import Comercio from './components/Comercio';
import ComercioDetalle from './components/ComercioDetalle'; // crearás esto

const client = new ApolloClient({
  uri: 'https://clientes.estudioresortera.cl/graphql',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>

        <div className="min-h-screen bg-gray-50 text-gray-800">
          <header className="bg-gray-900 text-white py-8 shadow-md">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Guía de Comercios
              </h1>
              <p className="text-gray-300 mt-2">
                Descubre negocios cerca de ti 🌍
              </p>
            </div>
          </header>

          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
            <Routes>
              <Route path="/" element={<Comercio />} />
              <Route path="/comercio/:slug" element={<ComercioDetalle />} />
            </Routes>
          </main>

          <footer className="text-center text-xs text-gray-400 py-4">
            © {new Date().getFullYear()} Estudio Resortera
          </footer>
        </div>

    </ApolloProvider>
  );
}
