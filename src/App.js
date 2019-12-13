import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
      <UserProvider>
        <SocketProvider>
          <Router>
            <Switch>
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route exact path="/" component={MainPage} />
            </Switch>
          </Router> 
        </SocketProvider>
    </UserProvider>
  );
}

export default App;
