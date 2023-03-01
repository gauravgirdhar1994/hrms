import React from 'react';
import { routes } from '../routes';
import { Switch, Route, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Header, Sidebar, ModalLogout, ModalAbout } from '../components';

const Layout = withRouter(({ location }) => (
  
    <div className="d-flex flex-column layout min-vh-100">
      <Header />

    <div className="container-fluid">
      <div className="row collapse show no-gutters d-flex flex-grow-1 position-relative sidebar-collapse flex-nowrap">
        <div className="col-3 h-100 w-sidebar navbar-collapse collapse d-none d-lg-flex sidebar-collapse sidebar">
          <Sidebar />
        </div>
        <div className="col d-flex flex-column">
          <TransitionGroup className="d-flex flex-column flex-grow-1">
            <CSSTransition timeout={{ enter: 700, exit: 10 }} classNames="p-2 page-fade" key={location.key}>
              <Switch location={location}>
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
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
</div>

      <ModalLogout />
      <ModalAbout />
    </div>
  )
);

export default Layout;
