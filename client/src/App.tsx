import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';

import Home from "./components/Home";

const App: React.FC = () => {
  const [result, setResult] = useState<any>({});

  return (
    <NextUIProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home setResult={setResult} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </NextUIProvider>
  );
};

export default App;
