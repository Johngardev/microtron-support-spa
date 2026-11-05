# Configuración para Producción

## Variables de Entorno Producción

Crear archivo `.env.production`:

```env
# Database
COSMOS_MONGO_CONN=mongodb://your-production-connection-string
DATABASE_NAME=support

# JWT Security
JWT_SECRET=your-very-secure-random-secret-key-min-32-chars
JWT_EXPIRES_IN=24h

# Calendly API
CALENDLY_TOKEN=your-production-calendly-token

# Node Environment
NODE_ENV=production

# API Port
API_PORT=3000

# Frontend URL (para CORS)
FRONTEND_URL=https://your-production-domain.com
```

## CORS Actualizado para Producción

Actualizar `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Support API')
    .setDescription('API de gestión de sesiones de soporte técnico')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS configuration
  const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:4200';
  const isDevelopment = process.env.NODE_ENV !== 'production';

  app.enableCors({
    origin: isDevelopment ? /localhost/ : corsOrigin,
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 horas
  });

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

bootstrap();
```

## Docker Configuration

Crear `Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Build
RUN npm run build

# Final stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

Crear `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: ./support-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      COSMOS_MONGO_CONN: ${COSMOS_MONGO_CONN}
      DATABASE_NAME: ${DATABASE_NAME}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
      CALENDLY_TOKEN: ${CALENDLY_TOKEN}
      FRONTEND_URL: ${FRONTEND_URL}
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  web:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./support-web/dist/support-web:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge
```

Crear `.dockerignore`:

```
node_modules
npm-debug.log
dist
coverage
.git
.gitignore
.env
.env.production
README.md
.DS_Store
```

## Nginx Configuration

Crear `nginx.conf`:

```nginx
events {
  worker_connections 1024;
}

http {
  upstream api {
    server api:3000;
  }

  server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_vary on;
    gzip_min_length 1000;

    # Frontend
    root /usr/share/nginx/html;

    location / {
      try_files $uri $uri/ /index.html;
      index index.html;
    }

    # API proxy
    location /api/ {
      proxy_pass http://api/;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
      proxy_connect_timeout 60s;
      proxy_send_timeout 60s;
      proxy_read_timeout 60s;
    }

    # Static assets cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # Deny access to sensitive files
    location ~ /\. {
      deny all;
      access_log off;
      log_not_found off;
    }
  }

  # HTTPS configuration (opcional)
  # server {
  #   listen 443 ssl http2;
  #   server_name your-domain.com;
  #
  #   ssl_certificate /etc/nginx/ssl/cert.pem;
  #   ssl_certificate_key /etc/nginx/ssl/key.pem;
  #
  #   # ... resto de configuración igual que arriba
  # }
  #
  # # Redirect HTTP to HTTPS
  # server {
  #   listen 80;
  #   server_name your-domain.com;
  #   return 301 https://$server_name$request_uri;
  # }
}
```

## Environment Variables Checklist

### Backend (.env)
- [ ] COSMOS_MONGO_CONN - Cadena de conexión MongoDB
- [ ] DATABASE_NAME - Nombre de base de datos
- [ ] JWT_SECRET - Clave secreta (mínimo 32 caracteres)
- [ ] JWT_EXPIRES_IN - Duración de tokens
- [ ] CALENDLY_TOKEN - Token API Calendly
- [ ] NODE_ENV - Ambiente (development/production)
- [ ] API_PORT - Puerto API (3000)
- [ ] FRONTEND_URL - URL frontend para CORS

### Frontend (.env)
- [ ] API_URL - URL del backend

## Build y Deploy

### Local Build
```bash
# Backend
cd support-api
npm run build

# Frontend
cd support-web
npm run build
```

### Docker Build
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Deployment Checklist

- [ ] Variables de entorno configuradas
- [ ] Base de datos en producción lista
- [ ] Token Calendly válido
- [ ] JWT_SECRET seguro y único
- [ ] CORS configurado para dominio de producción
- [ ] SSL/HTTPS habilitado
- [ ] Backups de BD configurados
- [ ] Logging configurado
- [ ] Monitoring en lugar (opcional)
- [ ] Health checks funcionando

## Monitoreo

### Verificar salud de la aplicación
```bash
curl https://your-api-domain.com/health

# Response esperada:
{
  "status": "ok",
  "timestamp": "2025-11-25T10:00:00Z"
}
```

### Logs
```bash
# Docker logs
docker-compose logs api -f

# Archivo logs (si está configurado)
tail -f /var/log/app/api.log
```

## Seguridad en Producción

✅ Variables de entorno seguradas
✅ HTTPS/SSL habilitado
✅ CORS restringido a dominio específico
✅ Headers de seguridad configurados
✅ Rate limiting habilitado
✅ Validación de entrada
✅ SQL injection protection (Mongoose)
✅ XSS protection headers
✅ CSRF protection (si es necesario)
✅ JWT con secreto fuerte

## Performance

✅ Gzip compression habilitado
✅ Cache de assets estáticos (1 año)
✅ Minificación de código
✅ Database indexes creados
✅ Connection pooling (MongoDB)
✅ Load balancing (si es necesario)

---

Para más información, ver:
- [SESSIONS_API_DOCUMENTATION.md](../SESSIONS_API_DOCUMENTATION.md)
- [README.md](../README.md)
