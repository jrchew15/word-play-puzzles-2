import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignupPage';
// import UserSettings from './components/UserSettings';
import NavBar from './components/Navbar';
// import ProtectedRoute from './components/auth/ProtectedRoute';
import SplashPage from './components/SplashPage';
// import Puzzle from './components/WordGon/Puzzle';
// import Homepage from './Homepage';
// import User from './components/User';
// import BadRoute from './components/BadRoute';
import { authenticate } from './store/user';
import { thunkLoadWordgonSessions } from './store/wordgon';
import { thunkLoadWordleSessions } from './store/wordle';
import { appUseSelector, totalState } from "./store";
import { user } from './classes/userTypes';
// import UnregisteredPuzzle from './components/WordGon/UnregisteredPuzzle';
// import SignUpPrompt from './components/auth/SignUpPrompt';
import WordleTodayRedirect from './components/Wordle/WordleTodayRedirect';
import WordlePuzzle from './components/Wordle/WordlePuzzle';
// import WordleWonModalContent from './components/Wordle/WordleWonModalContent';

import './index.css'
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserSettings from './components/UserSettings';

function App() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false)
  const [showDeveloperDropdown, setShowDeveloperDropdown] = useState<boolean>(false)
  const [triggerReload, setTriggerReload] = useState<boolean>(false)

  const currentUser: user = appUseSelector((state: totalState) => state.user)

  useEffect(() => {
    (async () => {
      const data = await authenticate()(dispatch);
      setLoaded(true);
    })();
    if (triggerReload) setTriggerReload(false)
  }, [dispatch, triggerReload]);

  useEffect(() => {
    (async () => {
      if (currentUser && currentUser.id) {
        thunkLoadWordgonSessions()(dispatch, () => appUseSelector(state => state), null)
        thunkLoadWordleSessions()(dispatch, () => appUseSelector(state => state), null)
      }
    })()
  }, [currentUser, dispatch])

  if (!loaded) {
    return null;
  }
  return (
    <BrowserRouter>
      <NavBar showUserDropdown={showUserDropdown} setShowUserDropdown={setShowUserDropdown} showDeveloperDropdown={showDeveloperDropdown} setShowDeveloperDropdown={setShowDeveloperDropdown} setTriggerReload={setTriggerReload} />
      <div id='nav-spacer' />
      {!triggerReload && <div id='omni-container' onClick={() => { setShowUserDropdown(false); setShowDeveloperDropdown(false) }}>
        <Switch>
          <Route exact path={'/signup'}>
            <SignUpPage />
          </Route>
          <Route exact path={'/login'}>
            <LoginPage />
          </Route>
          <ProtectedRoute exact path={'/settings'}>
            <UserSettings />
          </ProtectedRoute>
          <Route path='/wordles/today' exact>
            <WordleTodayRedirect />
          </Route>
          <ProtectedRoute path='/wordles/:wordleId' exact>
            <WordlePuzzle />
          </ProtectedRoute>
          <Route exact path={'/'}>
            <SplashPage />
          </Route>
        </Switch>
      </div>}
    </BrowserRouter>
  );
}

export default App;
