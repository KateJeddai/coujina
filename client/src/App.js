import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import AppRouter from './routers/AppRouter';
import './App.scss';

const App = () => (
  <Provider store={store}>
      <AppRouter />
  </Provider>    
)

export default App;
