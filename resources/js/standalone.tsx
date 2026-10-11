import React from 'react';
import ReactDOM from 'react-dom/client';
import Welcome from './Pages/Welcome';
import '../css/app.css';

const container = document.getElementById('app');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <Welcome />
        </React.StrictMode>
    );
}
