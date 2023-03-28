import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SplashPage from './components/SplashPage';
import SignUpPage from './components/auth/SignupPage';
import LoginPage from './components/auth/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path={'/signup'}>
            <SignUpPage />
          </Route>
          <Route exact path={'/login'}>
            <LoginPage />
          </Route>
          <Route exact path={'/'}>
            <SplashPage />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
