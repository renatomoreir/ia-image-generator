'use client';

import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Heart, Share2, Eye, Calendar } from 'lucide-react';
import { GeneratedImage } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface ImageCardProps {
  image: GeneratedImage;
  showActions?: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, showActions = true }) => {
  const { toggleFavorite } = useApp();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(image.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: 'Imagem gerada com IA',
        text: `Confira esta imagem criada com IA: "${image.prompt}"`,
        url: `/image/${image.id}`,
      });
    } else {
      const shareUrl = `${window.location.origin}/image/${image.id}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copiado para a área de transferência!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="image-card h-100 border-0 shadow-sm position-relative">
      {showActions && (
        <div className="position-absolute top-0 end-0 p-2" style={{ zIndex: 10 }}>
          <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="light"
            size="sm"
            className={`favorite-btn me-2 ${image.isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            title={image.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart 
              size={16} 
              fill={image.isFavorite ? 'currentColor' : 'none'} 
            />
          </Button>
          
          <Button
            variant="light"
            size="sm"
            className="favorite-btn"
            onClick={handleShareClick}
            title="Compartilhar imagem"
          >
            <Share2 size={16} />
          </Button>
          </div>
        </div>
      )}

      <div className="position-relative overflow-hidden">
        <Card.Img
          variant="top"
          src={image.url}
          alt={image.prompt}
          style={{ 
            height: '250px', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          className="hover-zoom"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/512x512/e9ecef/6c757d?text=Imagem+Indisponível`;
          }}
        />
        
        {image.isPublic && (
          <Badge 
            bg="success" 
            className="position-absolute top-0 start-0 m-2"
          >
            Público
          </Badge>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Text className="text-muted small mb-2 flex-grow-1">
          <strong>Prompt:</strong> {image.prompt}
        </Card.Text>
        
        <div className="d-flex align-items-center justify-content-between text-muted small mb-3">
          <span className="d-flex align-items-center">
            <Calendar size={14} className="me-1" />
            {formatDate(image.createdAt)}
          </span>
          
          {image.username && (
            <span>
              Por: <strong>{image.username}</strong>
            </span>
          )}
        </div>

        <div className="d-grid">
          <Button
            href={`/image/${image.id}`}
            variant="outline-primary"
            size="sm"
            className="d-flex align-items-center justify-content-center"
          >
            <Eye size={16} className="me-2" />
            Ver Detalhes
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ImageCard;

