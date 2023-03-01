import React from 'react';
import { routes } from './routes';
import Layouts from './layouts';

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducer/rootReducers";

const store = createStore(rootReducer, applyMiddleware(thunk));

const defaultLayoutKey = 'Layout1';

class App extends React.Component{
    
    constructor(props) {
        super(props);
        
        this.state = {
            // set desired global layout here in ComponentToRender
            ComponentToRender: Layouts[defaultLayoutKey],
            user: {}
        };
       // console.log(24, defaultLayoutKey);
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
       // console.log('29 routes', routes, nextProps.history.location.pathname);
        if(nextProps.history.location.pathname.includes('uploadDocument')){
            var filterRoutes = routes.filter(rte => rte.path.includes('uploadDocument'));
        }
        else{
            var filterRoutes = routes.filter(rte => rte.path === nextProps.history.location.pathname);
        }

        if(nextProps.history.location.pathname.includes('reset-password')){
            var filterRoutes = routes.filter(rte => rte.path.includes('reset-password'));
        }
        
        //console.log(29, filterRoutes, nextProps.history.location.pathname);
        if (filterRoutes && filterRoutes.length === 1 && filterRoutes[0].layout) {
            //console.log(30, filterRoutes[0].layout);
            return { ComponentToRender: Layouts[filterRoutes[0].layout] };
        }
        else return null;
    }
    
    render() {
        var { ComponentToRender } = this.state;
        // console.log('39 render component', ComponentToRender)
        return (
            <Provider store={store}> <ComponentToRender /> </Provider>
        );
    }
}

export default App;
