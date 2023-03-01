import React from 'react';
import { routes } from '../routes';
import { Switch, Route, withRouter } from 'react-router-dom';
import Background from '../assets/login-bg.jpg';

var styles = {
  // backgroundImage: `url(${Background})`,
  backgroundImage: `url("https://source.unsplash.com/1600x900/?office,team")`,
  marginTop: "0px",
  backgroundSize: "cover"
}

var watermarkStyles = {
  position: "fixed",
  bottom: "10px",
  left: "40px"
}

const Layout = withRouter(({ location }) => (
  <main className="min-vh-100 d-flex flex-column" style={styles}>
    <div className="container-fluid flex-grow-1 px-1 py-3" style={{ background: "rgba(0, 0, 0, 0.6)" }}>
      <div className="hrms-watermark" style={watermarkStyles}><h2 className="text-uppercase text-white" style={{ fontSize: "110px", opacity: "0.6" }}>HRMS</h2></div>
      <Switch>
        {
          routes.map((rte, key) => {
            if (rte.renderProps) {
              // pass props from router
              var Comp = rte.component;


              return (<Route exact path={rte.path} render={(props) => <Comp {...rte.renderProps} />} key={key} />);
            } else {
              // standard route to component
              return (<Route exact path={rte.path} component={rte.component} key={key} />);
            }
          })
        }
      </Switch>
    </div>
  </main>
)
);

export default Layout;