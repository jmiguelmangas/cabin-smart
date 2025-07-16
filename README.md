# CabinSmart - Gestión de Cabina de Avión

CabinSmart es una aplicación web en tiempo real para la gestión de asientos y baño en una cabina de avión. Permite a los pasajeros abrochar/desabrochar cinturones y unirse a la cola del baño, mientras que los miembros de la tripulación pueden monitorear el estado general de la cabina.

## Características

- **Interfaz en tiempo real** usando WebSockets
- **Vista de pasajero**:
  - Selección de asiento
  - Control de cinturón de seguridad
  - Sistema de cola para el baño
- **Vista de tripulación**:
  - Panel de control general
  - Monitoreo de cinturones desabrochados
  - Gestión de la cola del baño
  - Estado de ocupación de asientos
- **Diseño responsivo** que funciona en dispositivos móviles y de escritorio

## Tecnologías

- **Frontend**:
  - React 18
  - Vite
  - React Router
  - WebSocket para comunicación en tiempo real
  - Tailwind CSS para estilos
  - React Icons

- **Backend**:
  - Python 3.9+
  - FastAPI
  - WebSockets
  - Uvicorn
  - Pydantic para validación de datos

- **Despliegue**:
  - Docker
  - Docker Compose
  - Nginx como servidor web

## Requisitos Previos

- Docker y Docker Compose instalados
- Node.js 16+ (solo para desarrollo frontend)
- Python 3.9+ (solo para desarrollo backend)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/cabin-smart.git
   cd cabin-smart
   ```

2. Configura las variables de entorno (opcional):
   - Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`

3. Inicia los servicios con Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. La aplicación estará disponible en:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - Documentación de la API: http://localhost:8000/docs

## Desarrollo

### Configuración del entorno de desarrollo

#### Frontend

1. Navega al directorio del frontend:
   ```bash
   cd cabin_smart_frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

#### Backend

1. Navega al directorio del backend:
   ```bash
   cd cabin_smart_backend
   ```

2. Crea un entorno virtual (recomendado):
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Estructura del Proyecto

```
cabin-smart/
├── cabin_smart_frontend/     # Aplicación React
│   ├── public/              # Archivos estáticos
│   ├── src/                 # Código fuente del frontend
│   │   ├── components/      # Componentes de React
│   │   ├── context/         # Contextos de React
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── styles/          # Estilos CSS
│   │   ├── App.jsx          # Componente principal
│   │   └── main.jsx         # Punto de entrada
│   ├── .env                 # Variables de entorno del frontend
│   ├── package.json         # Dependencias y scripts
│   └── vite.config.js       # Configuración de Vite
│
├── cabin_smart_backend/      # API de FastAPI
│   ├── app/                 # Código fuente del backend
│   │   ├── api/             # Endpoints de la API
│   │   ├── core/            # Configuración y utilidades
│   │   ├── models/          # Modelos de datos
│   │   └── main.py          # Aplicación principal
│   ├── tests/               # Pruebas
│   ├── .env                 # Variables de entorno del backend
│   └── requirements.txt     # Dependencias de Python
│
├── docker-compose.yml       # Configuración de Docker Compose
└── README.md               # Este archivo
```

## Variables de Entorno

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### Backend (`.env`)

```env
DEBUG=True
SECRET_KEY=tu-clave-secreta-aqui
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Uso

1. **Como pasajero**:
   - Selecciona tu asiento
   - Abrocha/desabrocha tu cinturón
   - Únete a la cola del baño cuando lo necesites

2. **Como tripulación**:
   - Monitorea el estado de los cinturones
   - Gestiona la cola del baño
   - Verifica qué pasajeros no están en sus asientos

## Despliegue en Producción

1. Configura un servidor con Docker y Docker Compose
2. Configura las variables de entorno de producción
3. Ejecuta:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contribución

Las contribuciones son bienvenidas. Por favor, lee las pautas de contribución antes de enviar un pull request.

## Contacto

Para consultas o soporte, por favor abre un issue en el repositorio.
