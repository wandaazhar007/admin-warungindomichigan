import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx'; // Import the provider
import './styles/globals.scss'; // I just added this line to import global styles
import { NavbarProvider } from './context/NavbarContext.tsx';
import { SidebarProvider } from './context/SidebarContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <NavbarProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </NavbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
);