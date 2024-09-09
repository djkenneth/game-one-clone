// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import useFetch from './hooks/useFetch';

import { Route, Routes } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Layout from "@/Layout";
import { Home } from "@/pages/Home";
import { Products } from "@/pages/Products";

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} />
          </Routes>
        </Layout>
        {/* The rest of your application */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}

export default App
