'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { Sparkles, Wand2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ImageCard from '@/components/ImageCard';
import { ImageGenerationService } from '@/services/imageGeneration';

export default function Home() {
  const { state, addImage, canGenerateImage } = useApp();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Por favor, digite um prompt para gerar a imagem.');
      return;
    }

    if (!canGenerateImage()) {
      setError('Você não tem créditos suficientes para gerar uma imagem.');
      return;
    }

    const validation = ImageGenerationService.validatePrompt(prompt);
    if (!validation.isValid) {
      setError(validation.error || 'Prompt inválido');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await ImageGenerationService.generateImage({
        prompt: prompt.trim(),
        userId: state.user.username,
      });

      if (response.success && response.imageUrl) {
        addImage({
          url: response.imageUrl,
          prompt: prompt.trim(),
          username: state.user.username,
        });

        setPrompt('');
      } else {
        setError(response.error || 'Erro ao gerar imagem. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao gerar imagem. Tente novamente.');
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const recentImages = state.images.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                <Sparkles className="me-3" size={48} />
                Crie Imagens Incríveis com IA
              </h1>
              <p className="lead mb-5">
                Transforme suas ideias em arte digital usando o poder da inteligência artificial. 
                Digite um prompt e veja sua imaginação ganhar vida!
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {/* Image Generation Form */}
        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <Wand2 size={32} className="text-primary mb-2" />
                  <h3 className="fw-bold">Gerador de Imagens</h3>
                  <p className="text-muted">
                    Você tem <strong>{state.user.credits} créditos</strong> disponíveis
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <AlertCircle size={20} className="me-2" />
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Descreva a imagem que você quer criar:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Ex: Uma casa moderna com fachada de madeira e vidro, jardim bem cuidado, céu azul ao fundo..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="prompt-input"
                      disabled={isGenerating}
                      maxLength={500}
                    />
                    <Form.Text className="text-muted">
                      {prompt.length}/500 caracteres
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={!canGenerateImage() || isGenerating || !prompt.trim()}
                      className="generate-btn"
                    >
                      {isGenerating ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Gerando imagem...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} className="me-2" />
                          Gerar Imagem por (5 créditos)
                        </>
                      )}
                    </Button>
                  </div>

                  {!canGenerateImage() && (
                    <Alert variant="warning" className="mt-3 mb-0">
                      <AlertCircle size={20} className="me-2" />
                      Você não tem créditos suficientes. Cada geração custa 5 créditos.
                    </Alert>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Images */}
        {recentImages.length > 0 && (
          <Row>
            <Col>
              <div className="d-flex align-items-center mb-4">
                <ImageIcon size={24} className="text-primary me-2" />
                <h3 className="fw-bold mb-0">Suas Criações Recentes</h3>
              </div>
              
              <div className="gallery-grid">
                {recentImages.map((image) => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>

              {state.images.length > 6 && (
                <div className="text-center mt-4">
                  <Button variant="outline-primary" href="/gallery">
                    Ver Todas as Imagens ({state.images.length})
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        )}

        {/* Empty State */}
        {state.images.length === 0 && !isGenerating && (
          <Row className="justify-content-center">
            <Col lg={6} className="text-center">
              <div className="py-5">
                <ImageIcon size={64} className="text-muted mb-3" />
                <h4 className="text-muted">Nenhuma imagem gerada ainda</h4>
                <p className="text-muted">
                  Digite um prompt acima para criar sua primeira imagem com IA!
                </p>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

