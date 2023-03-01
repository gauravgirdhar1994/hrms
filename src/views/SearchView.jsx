import React from 'react';
import { Wrapper, Footer, Search } from '../components';

class SearchView extends React.Component{
    render(){
        return (
            <Wrapper>
                <Search />
                <Footer />
            </Wrapper>
        );
    }
}

export default SearchView;
