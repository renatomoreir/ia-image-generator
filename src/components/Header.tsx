'use client';

import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import Link from 'next/link';
import { Sparkles, Heart, User, Home } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const Header: React.FC = () => {
  const { state } = useApp();

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold text-primary d-flex align-items-center">
          <Sparkles className="me-2" size={24} />
          Gerador de Imagens IA
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/" className="d-flex align-items-center">
              <Home size={18} className="me-1" />
              Início
            </Nav.Link>
            <Nav.Link as={Link} href="/gallery" className="d-flex align-items-center">
              <Sparkles size={18} className="me-1" />
              Galeria
              {state.images.length > 0 && (
                <Badge bg="primary" className="ms-1">{state.images.length}</Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} href="/favorites" className="d-flex align-items-center">
              <Heart size={18} className="me-1" />
              Favoritos
              {state.favorites.length > 0 && (
                <Badge bg="danger" className="ms-1">{state.favorites.length}</Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} href={`/profile/${state.user.username}`} className="d-flex align-items-center">
              <User size={18} className="me-1" />
              Perfil
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Item className="d-flex align-items-center">
              <span className="credits-badge me-3">
                <Sparkles size={16} className="me-1" />
                {state.user.credits} créditos
              </span>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

