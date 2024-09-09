// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import useFetch from './hooks/useFetch';

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layout";

function App() {
  return (
    <div className="app">
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App
