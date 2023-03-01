import React from 'react';

export const Wrapper = ({ children }) => {

    return (
    <main className="p-4 flex-fill d-flex flex-column">
        { children }
    </main>
    );
    
};

export default Wrapper;