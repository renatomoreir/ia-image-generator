'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { 
  Heart, 
  Share2, 
  Download, 
  Calendar, 
  User, 
  ArrowLeft, 
  Copy,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

export default function ImageDetails() {
  const params = useParams();
  const router = useRouter();
  const { state, toggleFavorite } = useApp();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const imageId = params.id as string;
  const image = state.images.find(img => img.id === imageId);

  if (!image) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={6} className="text-center">
            <Alert variant="warning">
              <h4>Imagem não encontrada</h4>
              <p>A imagem que você está procurando não existe ou foi removida.</p>
              <Button variant="primary" onClick={() => router.back()}>
                Voltar
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  const handleFavoriteClick = () => {
    toggleFavorite(image.id);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/image/${image.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Imagem gerada com IA',
        text: `Confira esta imagem criada com IA: "${image.prompt}"`,
        url: `/image/${image.id}`,
      });
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `ai-image-${image.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Container className="py-4">
        {/* Back Button */}
        <Row className="mb-3">
          <Col>
            <Button 
              variant="outline-secondary" 
              onClick={() => router.back()}
              className="d-flex align-items-center"
            >
              <ArrowLeft size={16} className="me-2" />
              Voltar
            </Button>
          </Col>
        </Row>

        <Row>
          {/* Image */}
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-lg">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={image.url}
                  alt={image.prompt}
                  style={{ 
                    maxHeight: '600px', 
                    objectFit: 'contain',
                    width: '100%'
                  }}
                  className="rounded"
                />
                
                {image.isPublic && (
                  <Badge 
                    bg="success" 
                    className="position-absolute top-0 start-0 m-3"
                  >
                    Público
                  </Badge>
                )}
              </div>
            </Card>
          </Col>

          {/* Details */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h3 className="fw-bold mb-3">Detalhes da Imagem</h3>

                {/* Prompt */}
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Prompt Original:</h6>
                  <p className="bg-light p-3 rounded">{image.prompt}</p>
                </div>

                {/* Metadata */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Informações:</h6>
                  
                  <div className="d-flex align-items-center mb-2">
                    <Calendar size={16} className="text-muted me-2" />
                    <small>{formatDate(image.createdAt)}</small>
                  </div>
                  
                  {image.username && (
                    <div className="d-flex align-items-center mb-2">
                      <User size={16} className="text-muted me-2" />
                      <small>Criado por: <strong>{image.username}</strong></small>
                    </div>
                  )}

                  <div className="d-flex align-items-center">
                    <Eye size={16} className="text-muted me-2" />
                    <small>ID: {image.id}</small>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-grid gap-2">
                  <Button
                    variant={image.isFavorite ? 'danger' : 'outline-danger'}
                    onClick={handleFavoriteClick}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Heart 
                      size={16} 
                      className="me-2" 
                      fill={image.isFavorite ? 'currentColor' : 'none'} 
                    />
                    {image.isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                  </Button>

                  <Button
                    variant="outline-primary"
                    onClick={handleShare}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Share2 size={16} className="me-2" />
                    Compartilhar
                  </Button>

                  <Button
                    variant="outline-success"
                    onClick={handleDownload}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Download size={16} className="me-2" />
                    Baixar Imagem
                  </Button>
                </div>

                {/* Related Actions */}
                <hr className="my-4" />
                
                <div className="d-grid gap-2">
                  <Button
                    href="/gallery"
                    variant="outline-secondary"
                    size="sm"
                  >
                    Ver Todas as Imagens
                  </Button>
                  
                  <Button
                    href="/"
                    variant="primary"
                    size="sm"
                  >
                    Criar Nova Imagem
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Share Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Compartilhar Imagem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Link da imagem:</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={`${window.location.origin}/image/${image.id}`}
                readOnly
              />
              <Button
                variant="outline-secondary"
                onClick={handleCopyLink}
              >
                <Copy size={16} />
              </Button>
            </div>
            {copySuccess && (
              <small className="text-success">Link copiado!</small>
            )}
          </div>

          {typeof window !== 'undefined' && 'share' in navigator && (
            <Button
              variant="primary"
              onClick={handleNativeShare}
              className="w-100 mb-2"
            >
              <ExternalLink size={16} className="me-2" />
              Compartilhar via Sistema
            </Button>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

