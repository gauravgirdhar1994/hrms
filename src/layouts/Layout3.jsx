import React from 'react';
import { routes } from '../routes';
import { Switch, Route, withRouter } from 'react-router-dom';
import Background from '../assets/login-bg.jpg';

var styles = {
  backgroundImage: `url(${Background})`,
  marginTop: "-56px",
  backgroundSize: "cover" 
}

var watermarkStyles = {
  position:  "fixed",
  bottom : "10px",
  left: "40px"
}

const Layout = withRouter(({ location }) => (
  <main className="min-vh-100 d-flex flex-column">
        <Switch>
            {
                routes.map((rte,key) => {
                  if (rte.renderProps) {
                    // pass props from router
                    var Comp = rte.component;
                    

                    return (<Route exact path={rte.path} render={(props) => <Comp {...rte.renderProps } />} key={key} />);
                  } else {
                    // standard route to component
                    return (<Route exact path={rte.path} component={rte.component} key={key} />);
                  }
                })
            }
        </Switch>
  </main>
  )
);

export default Layout;