'use client';

import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1">
        <Container fluid className="px-3 px-md-4">
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

