import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SplashPage from './components/SplashPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path={'/'}>
            <SplashPage />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
