import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SplashPage from './components/SplashPage';
import SignUpForm from './components/SignupTest';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path={'/sign-up'}>
            <SignUpForm />
          </Route>
          <Route exact path={'/login'}>
            <LoginForm />
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
