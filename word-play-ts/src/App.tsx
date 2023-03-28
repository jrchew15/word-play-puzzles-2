import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SplashPage from './components/SplashPage';
import SignUpForm from './components/auth/SignupTest';
import LoginPage from './components/auth/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path={'/signup'}>
            <SignUpForm />
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
