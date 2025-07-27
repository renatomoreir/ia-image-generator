'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { 
  User, 
  Image as ImageIcon, 
  Heart, 
  Share2, 
  Settings,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import ImageCard from '@/components/ImageCard';

export default function UserProfile() {
  const params = useParams();
  const { state, resetCredits } = useApp();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPublicImages, setShowPublicImages] = useState(true);

  const username = params.username as string;
  const isOwnProfile = username === state.user.username;

  const userImages = state.images.filter(image => image.username === username);
  const publicImages = userImages.filter(image => image.isPublic);
  const favoriteImages = userImages.filter(image => image.isFavorite);
  
  const displayImages = isOwnProfile 
    ? (showPublicImages ? publicImages : userImages)
    : publicImages;

  const handleResetCredits = () => {
    resetCredits();
    setShowSettingsModal(false);
  };

  const toggleImageVisibility = (imageId: string) => {
    console.log('Toggle visibility for image:', imageId);
  };

  return (
    <>
      <Container className="py-4">
        {/* Profile Header */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: '60px', height: '60px' }}>
                        <User size={30} className="text-white" />
                      </div>
                      <div>
                        <h2 className="fw-bold mb-1">{username}</h2>
                        <p className="text-muted mb-0">
                          {userImages.length} {userImages.length === 1 ? 'imagem criada' : 'imagens criadas'}
                          {isOwnProfile && (
                            <>
                              {' • '}
                              {favoriteImages.length} {favoriteImages.length === 1 ? 'favorito' : 'favoritos'}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </Col>
                  
                  {isOwnProfile && (
                    <Col md={4} className="text-md-end">
                      <div className="mb-2">
                        <span className="credits-badge">
                          <Sparkles size={16} className="me-1" />
                          {state.user.credits} créditos
                        </span>
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowSettingsModal(true)}
                      >
                        <Settings size={16} className="me-2" />
                        Configurações
                      </Button>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Profile Stats */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body>
                <ImageIcon size={32} className="text-primary mb-2" />
                <h4 className="fw-bold">{userImages.length}</h4>
                <p className="text-muted mb-0">Imagens Criadas</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body>
                <Eye size={32} className="text-success mb-2" />
                <h4 className="fw-bold">{publicImages.length}</h4>
                <p className="text-muted mb-0">Imagens Públicas</p>
              </Card.Body>
            </Card>
          </Col>
          
          {isOwnProfile && (
            <Col md={4}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body>
                  <Heart size={32} className="text-danger mb-2" />
                  <h4 className="fw-bold">{favoriteImages.length}</h4>
                  <p className="text-muted mb-0">Favoritos</p>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {/* Image Filter (for own profile) */}
        {isOwnProfile && (
          <Row className="mb-3">
            <Col>
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant={showPublicImages ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setShowPublicImages(true)}
                >
                  <Eye size={16} className="me-1" />
                  Públicas ({publicImages.length})
                </Button>
                <Button
                  variant={!showPublicImages ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setShowPublicImages(false)}
                >
                  <EyeOff size={16} className="me-1" />
                  Todas ({userImages.length})
                </Button>
              </div>
            </Col>
          </Row>
        )}

        {/* Images Grid */}
        {displayImages.length > 0 ? (
          <Row>
            <Col>
              <div className="gallery-grid">
                {displayImages.map((image) => (
                  <div key={image.id} className="position-relative">
                    <ImageCard image={image} />
                    {isOwnProfile && (
                      <div className="position-absolute top-0 start-0 p-2">
                        <Badge bg={image.isPublic ? 'success' : 'secondary'}>
                          {image.isPublic ? 'Público' : 'Privado'}
                        </Badge>
                      </div>
                    )}
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
                {isOwnProfile 
                  ? (showPublicImages ? 'Nenhuma imagem pública' : 'Nenhuma imagem criada')
                  : 'Nenhuma imagem pública'
                }
              </h4>
              <p className="text-muted">
                {isOwnProfile 
                  ? 'Crie suas primeiras imagens e compartilhe com o mundo!'
                  : 'Este usuário ainda não compartilhou nenhuma imagem publicamente.'
                }
              </p>
              {isOwnProfile && (
                <Button variant="primary" href="/" className="mt-3">
                  Criar Primeira Imagem
                </Button>
              )}
            </Col>
          </Row>
        )}
      </Container>

      {/* Settings Modal */}
      <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Configurações do Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h6>Informações da Conta</h6>
            <p className="text-muted mb-2">
              <strong>Usuário:</strong> {state.user.username}
            </p>
            <p className="text-muted mb-2">
              <strong>Créditos:</strong> {state.user.credits}
            </p>
            <p className="text-muted">
              <strong>Imagens criadas:</strong> {userImages.length}
            </p>
          </div>

          <div className="mb-4">
            <h6>Ações</h6>
            <Alert variant="warning" className="small">
              <strong>Atenção:</strong> Esta ação irá resetar seus créditos para 10. 
              Use apenas para fins de demonstração.
            </Alert>
            <Button
              variant="outline-warning"
              onClick={handleResetCredits}
              className="d-flex align-items-center"
            >
              <RefreshCw size={16} className="me-2" />
              Resetar Créditos
            </Button>
          </div>

          <div>
            <h6>Sobre</h6>
            <p className="text-muted small">
              Este é um projeto de demonstração criado para o desafio técnico. 
              Os dados são armazenados localmente no seu navegador.
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

