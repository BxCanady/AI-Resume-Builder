import react, { usestate } from 'react';
import { browserrouter, routes, route } from 'react-router-dom';

import home from "./components/home";


const app: react.fc = () => {
  const [result, setresult] = usestate<any>({});

  return (
    <div>
      <browserrouter>
        <routes>
          <route path="/" element={<home setresult={setresult} />} />

        </routes>
      </browserrouter>
    </div>
  );
};

export default app;
