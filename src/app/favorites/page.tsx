'use client';

import React from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Heart, Image as ImageIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ImageCard from '@/components/ImageCard';

export default function Favorites() {
  const { state } = useApp();
  const favoriteImages = state.images.filter(image => image.isFavorite);

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <Heart size={32} className="text-danger me-3" />
            <div>
              <h1 className="fw-bold mb-0">Imagens Favoritas</h1>
              <p className="text-muted mb-0">
                {favoriteImages.length} {favoriteImages.length === 1 ? 'imagem favorita' : 'imagens favoritas'}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Info Alert */}
      <Row className="mb-4">
        <Col>
          <Alert variant="info" className="d-flex align-items-center">
            <Heart size={20} className="me-2" />
            <div>
              <strong>Sobre os Favoritos:</strong> Suas imagens favoritas são salvas localmente no seu navegador. 
              Clique no ícone de coração em qualquer imagem para adicioná-la ou removê-la dos favoritos.
            </div>
          </Alert>
        </Col>
      </Row>

      {/* Favorite Images */}
      {favoriteImages.length > 0 ? (
        <Row>
          <Col>
            <div className="gallery-grid">
              {favoriteImages.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          </Col>
        </Row>
      ) : (
        /* Empty State */
        <Row className="justify-content-center">
          <Col lg={6} className="text-center py-5">
            <Heart size={64} className="text-muted mb-3" />
            <h4 className="text-muted">Nenhuma imagem favorita ainda</h4>
            <p className="text-muted">
              Explore a galeria e marque suas imagens preferidas como favoritas clicando no ícone de coração.
            </p>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Button variant="primary" href="/gallery">
                <ImageIcon size={16} className="me-2" />
                Ver Galeria
              </Button>
              <Button variant="outline-primary" href="/">
                Criar Nova Imagem
              </Button>
            </div>
          </Col>
        </Row>
      )}

      {/* Quick Actions */}
      {favoriteImages.length > 0 && (
        <Row className="mt-5">
          <Col className="text-center">
            <div className="border-top pt-4">
              <h5 className="mb-3">Ações Rápidas</h5>
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="outline-primary" href="/gallery">
                  <ImageIcon size={16} className="me-2" />
                  Ver Todas as Imagens
                </Button>
                <Button variant="primary" href="/">
                  Criar Nova Imagem
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

