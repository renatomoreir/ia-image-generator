# Gerador de Imagens IA

Uma aplicação web moderna para geração de imagens usando inteligência artificial, desenvolvida com Next.js, React, TypeScript e Bootstrap.

## 🚀 Demonstração

A aplicação permite aos usuários gerar imagens únicas através de prompts de texto, utilizando APIs de IA para criar arte digital personalizada.

### Funcionalidades Principais

- **Geração de Imagens com IA**: Digite um prompt e gere imagens únicas
- **Galeria Responsiva**: Visualize todas as imagens em uma galeria adaptada para desktop e mobile
- **Sistema de Favoritos**: Marque e organize suas imagens preferidas
- **Páginas de Detalhes**: Cada imagem possui uma página dedicada com informações completas
- **Sistema de Créditos**: Sistema fictício de créditos para controlar o uso
- **Compartilhamento**: Compartilhe suas criações com outros usuários
- **Perfil de Usuário**: Gerencie suas imagens e configurações

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15.4.4** - Framework React com renderização server-side
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática

### APIs de IA Suportadas
- **Hugging Face Inference API** - Stable Diffusion e outros modelos
- **DeepAI Text-to-Image** - API alternativa para geração de imagens
- **Replicate** - Plataforma para modelos de machine learning
- **Mock API** - Sistema de demonstração com imagens placeholder

## 📋 Pré-requisitos

- Node.js 20.x ou superior
- npm ou yarn
- Docker (opcional, para containerização)

## 🔧 Instalação e Execução

### Instalação Local

1. **Clone o repositório**
   ```bash
   git clone git@github.com:renatomoreir/ia-image-generator.git
   cd ai-image-generator
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.local
   ```
   
   Edite o arquivo `.env.local` e configure suas chaves de API:
   ```env
   # Hugging Face API (Recomendado)
   NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   NEXT_PUBLIC_HUGGINGFACE_MODEL=stabilityai/stable-diffusion-xl-base-1.0
   
   # DeepAI API (Alternativa)
   NEXT_PUBLIC_DEEPAI_API_KEY=your_deepai_api_key_here
   
   # Replicate API (Alternativa)
   NEXT_PUBLIC_REPLICATE_API_KEY=your_replicate_api_key_here
   
   # Para demonstração (usa imagens mock)
   NEXT_PUBLIC_USE_MOCK_API=false
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Execução com Docker

1. **Build da imagem Docker**
   ```bash
   docker build -t ai-image-generator .
   ```

2. **Execute o container**
   ```bash
   docker run -p 3000:3000 ai-image-generator
   ```

3. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Docker Compose (Recomendado)

1. **Crie um arquivo docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     ai-image-generator:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - NEXT_PUBLIC_USE_MOCK_API=true
       restart: unless-stopped
   ```

2. **Execute com Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
src/
├── app/                    # App Router do Next.js
│   ├── favorites/         # Página de favoritos
│   ├── gallery/           # Página da galeria
│   ├── image/[id]/        # Página de detalhes da imagem
│   ├── profile/[username]/ # Página de perfil do usuário
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React reutilizáveis
│   ├── Footer.tsx         # Rodapé da aplicação
│   ├── Header.tsx         # Cabeçalho com navegação
│   ├── ImageCard.tsx      # Card para exibir imagens
│   └── Layout.tsx         # Layout wrapper
├── contexts/              # Contextos React
│   └── AppContext.tsx     # Estado global da aplicação
├── services/              # Serviços e integrações
│   └── imageGeneration.ts # Integração com APIs de IA
├── types/                 # Definições TypeScript
│   └── index.ts           # Tipos e interfaces
```

