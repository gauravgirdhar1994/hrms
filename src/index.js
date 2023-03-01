import React from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, withRouter  } from 'react-router-dom';
import bootstrap from 'bootstrap'; // eslint-disable-line no-unused-vars
import App from './App';
import './css/styles.css';
import './css/slider.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 

const hist = createBrowserHistory({ basename: process.env.PUBLIC_URL });
hist.listen(location => {
  window.scrollTo(0,0);
});

const AppWithRouter = withRouter(props => <App {...props}/>);

render(
  ( <Router history={hist}>
    <AppWithRouter />
  </Router >
), document.getElementById('root'));