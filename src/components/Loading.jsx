import React from 'react';

class Loading extends React.Component{

    render(){
        return (
            <p className="lead text-center">...<span role="img" aria-label="loading">🚀</span>...</p>
        );
    }
}

export default Loading;