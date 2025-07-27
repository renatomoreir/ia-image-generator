'use client';

import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { Grid, List, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ImageCard from '@/components/ImageCard';
import { SortOrder } from '@/types';

export default function Gallery() {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAndSortedImages = useMemo(() => {
    let filtered = state.images;

    if (searchTerm.trim()) {
      filtered = filtered.filter(image =>
        image.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(image => image.isFavorite);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'favorites':
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [state.images, searchTerm, sortOrder, showFavoritesOnly]);

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <ImageIcon size={32} className="text-primary me-3" />
            <div>
              <h1 className="fw-bold mb-0">Galeria de Imagens</h1>
              <p className="text-muted mb-0">
                {state.images.length} {state.images.length === 1 ? 'imagem' : 'imagens'} geradas
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters and Controls */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3 mb-lg-0">
          <Form.Group>
            <div className="position-relative">
              <Search 
                size={20} 
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
              />
              <Form.Control
                type="text"
                placeholder="Buscar por prompt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-5"
              />
            </div>
          </Form.Group>
        </Col>
        
        <Col lg={6}>
          <Row>
            <Col sm={6} className="mb-2 mb-sm-0">
              <Form.Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigas</option>
                <option value="favorites">Favoritos primeiro</option>
              </Form.Select>
            </Col>
            
            <Col sm={6}>
              <div className="d-flex gap-2">
                <Button
                  variant={showFavoritesOnly ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className="flex-grow-1"
                >
                  <Filter size={16} className="me-1" />
                  {showFavoritesOnly ? 'Todos' : 'Favoritos'}
                </Button>
                
                <ButtonGroup size="sm">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </Button>
                </ButtonGroup>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Results Info */}
      {(searchTerm || showFavoritesOnly) && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info" className="py-2 mb-0">
              {filteredAndSortedImages.length === 0 ? (
                'Nenhuma imagem encontrada com os filtros aplicados.'
              ) : (
                `Mostrando ${filteredAndSortedImages.length} de ${state.images.length} imagens.`
              )}
              {(searchTerm || showFavoritesOnly) && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 ms-2"
                  onClick={() => {
                    setSearchTerm('');
                    setShowFavoritesOnly(false);
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Images Grid/List */}
      {filteredAndSortedImages.length > 0 ? (
        <Row>
          <Col>
            <div className={viewMode === 'grid' ? 'gallery-grid' : ''}>
              {filteredAndSortedImages.map((image) => (
                <div key={image.id} className={viewMode === 'list' ? 'mb-3' : ''}>
                  <ImageCard image={image} />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      ) : (
        /* Empty State */
        <Row className="justify-content-center">
          <Col lg={6} className="text-center py-5">
            <ImageIcon size={64} className="text-muted mb-3" />
            <h4 className="text-muted">
              {state.images.length === 0 
                ? 'Nenhuma imagem gerada ainda'
                : 'Nenhuma imagem encontrada'
              }
            </h4>
            <p className="text-muted">
              {state.images.length === 0 
                ? 'Vá para a página inicial e crie sua primeira imagem!'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
            {state.images.length === 0 && (
              <Button variant="primary" href="/" className="mt-3">
                Criar Primeira Imagem
              </Button>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}

