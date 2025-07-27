'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light border-top mt-5">
      <Container>
        <Row className="py-4">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0 text-muted">
              © 2025 Gerador de Imagens IA. Todos os direitos reservados.
              <Heart size={16} className="text-danger mx-1" />
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center">
              <span className="text-muted me-3">Desenvolvido por Renato Moreira</span>
              <Github size={20} className="text-muted" />
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

