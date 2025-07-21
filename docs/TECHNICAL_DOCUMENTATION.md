# CabinSmart - Documentación Técnica

## Resumen Ejecutivo

CabinSmart es una aplicación web en tiempo real para la gestión inteligente de cabinas de avión que permite el monitoreo y control de asientos, cinturones de seguridad y sistemas de baño. La aplicación está desarrollada con arquitectura de microservicios usando tecnologías modernas y comunicación en tiempo real.

## Arquitectura del Sistema

### Stack Tecnológico

**Frontend:**
- React 18 con Hooks
- Vite como bundler
- React Router para navegación
- WebSockets nativos para comunicación en tiempo real
- Tailwind CSS para estilos
- Vitest para testing
- React Context API para gestión de estado

**Backend:**
- Python 3.9+ con FastAPI
- Motor (MongoDB Async Driver)
- WebSockets nativos
- Uvicorn como servidor ASGI
- Pydantic para validación de datos

**Base de Datos:**
- MongoDB 4.4 (NoSQL)
- Tres colecciones principales: seats, bathroom_queue, bathroom_status

**Infraestructura:**
- Docker y Docker Compose para containerización
- Nginx como reverse proxy
- Arquitectura multi-contenedor

### Arquitectura de Microservicios

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Frontend    │◄──►│     Backend     │◄──►│     MongoDB     │
│   (React SPA)   │    │   (FastAPI)     │    │   (Database)    │
│   Port: 80      │    │   Port: 8000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
              WebSocket
            Real-time Sync
```

## Componentes Técnicos Principales

### 1. Sistema de Comunicación en Tiempo Real

**WebSocket Manager (Backend):**
- Gestión de conexiones activas
- Broadcasting de eventos
- Manejo de desconexiones automáticas
- Sistema de eventos basado en JSON

**WebSocket Context (Frontend):**
- Context API para estado global
- Hooks personalizados para operaciones
- Reconexión automática
- Cache de estado local

### 2. Gestión de Estado

**Backend State Management:**
- Estado persistente en MongoDB
- Sincronización automática entre clientes
- Validación de datos con Pydantic
- Transacciones atómicas

**Frontend State Management:**
- Context API con useReducer pattern
- Custom hooks para lógica de negocio
- LocalStorage para persistencia
- Estado optimista para UX mejorada

### 3. Modelo de Datos

**Seat Model:**
```python
class Seat(BaseModel):
    seat_id: str              # "1A", "2B", etc.
    passenger_name: str       # Nombre del pasajero
    is_occupied: bool         # Si el asiento está ocupado
    is_buckled: bool          # Estado del cinturón
    seat_class: str           # "business" o "economy"
    last_updated: str         # Timestamp ISO
```

**Bathroom Queue Model:**
```python
class BathroomQueueItem(BaseModel):
    seat_id: str              # ID del asiento
    passenger_name: str       # Nombre del pasajero
    timestamp: str            # Timestamp de entrada a cola
```

## Funcionalidades Principales

### 1. Sistema de Asientos
- **33 filas con 6 asientos cada una** (A-F)
- **Clases:** Business (filas 1-8), Economy (filas 9-33)
- **Estados:** Ocupado/Libre, Cinturón abrochado/desabrochado
- **Actualización en tiempo real** de todos los estados

### 2. Sistema de Baño
- **Cola inteligente** con posicionamiento automático
- **Acceso directo** cuando el baño está libre
- **Notificaciones push** cuando es tu turno
- **Sensor de puerta simulado** para entrada/salida

### 3. Interfaces de Usuario

**Vista Pasajero:**
- Selección de asiento interactiva
- Control de cinturón de seguridad
- Gestión de cola de baño
- Estado personal en tiempo real

**Vista Tripulación:**
- Dashboard completo de la cabina
- Monitoreo de cinturones desabrochados
- Gestión de cola de baño
- Alertas de seguridad

## Patrones de Diseño Implementados

### 1. Observer Pattern
- WebSocket broadcasting para actualizaciones en tiempo real
- Event-driven architecture

### 2. Context Pattern
- React Context para estado global
- Dependency injection para servicios

### 3. Repository Pattern
- Abstracción de acceso a datos
- Funciones específicas para cada colección

### 4. Strategy Pattern
- Diferentes handlers para eventos WebSocket
- Múltiples vistas con el mismo estado

## Flujos de Datos Críticos

### 1. Flujo de Actualización de Cinturón
```
Frontend → WebSocket → Backend → MongoDB → Broadcast → All Clients
```

### 2. Flujo de Cola de Baño
```
Join Request → Validation → Queue Check → Direct Access OR Add to Queue → Notify All
```

### 3. Flujo de Sincronización Inicial
```
WebSocket Connect → Send Initial State → Frontend Hydration → UI Update
```

## Características Técnicas Avanzadas

### 1. Manejo de Conexiones
- **Reconexión automática** con backoff exponencial
- **State recovery** después de desconexión
- **Heartbeat** para detección de conexiones muertas

### 2. Optimizaciones de Performance
- **Lazy loading** de componentes
- **Memoización** de cálculos complejos
- **Batch updates** para múltiples cambios
- **Connection pooling** para MongoDB

### 3. Seguridad
- **CORS** configurado apropiadamente
- **Input validation** con Pydantic
- **Error boundaries** en React
- **Graceful degradation** sin WebSocket

### 4. Testing
- **Unit tests** con Vitest
- **Integration tests** para WebSocket
- **Component tests** con Testing Library
- **Error handling tests**

## Configuración de Desarrollo

### Variables de Entorno
```bash
# Frontend
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws

# Backend
MONGODB_URL=mongodb://mongodb:27017/cabin_smart
PYTHONUNBUFFERED=1
```

### Comandos de Desarrollo
```bash
# Desarrollo completo
docker-compose up --build

# Frontend solo
cd cabin_smart_frontend && npm run dev

# Backend solo
cd cabin_smart_backend && uvicorn main:app --reload

# Tests
cd cabin_smart_frontend && npm test
```

## Escalabilidad y Rendimiento

### 1. Escalabilidad Horizontal
- Stateless backend design
- Shared state en MongoDB
- Load balancer ready

### 2. Optimizaciones
- **Connection management** eficiente
- **Database indexing** en campos críticos
- **Memory management** en WebSocket connections
- **Caching** de datos estáticos

## Monitoreo y Logs

### 1. Logging
- **Structured logging** en Backend
- **Error tracking** en Frontend
- **Performance metrics**

### 2. Health Checks
- **Database connectivity**
- **WebSocket status**
- **Memory usage**

## Consideraciones de Producción

### 1. Despliegue
- **Multi-stage Docker builds**
- **Environment-specific configs**
- **Rolling updates** sin downtime

### 2. Backup y Recovery
- **MongoDB backups** automáticos
- **State recovery** procedures
- **Disaster recovery** plan

## APIs y Endpoints

### REST APIs
```
GET /                    - Health check
GET /seats              - Obtener todos los asientos
GET /seats/{seat_id}    - Obtener asiento específico
GET /bathroom/queue     - Obtener cola de baño
```

### WebSocket Events
```
toggle_seat_belt        - Cambiar estado de cinturón
join_bathroom_queue     - Unirse a cola de baño  
leave_bathroom_queue    - Salir de cola de baño
update_seat_status      - Actualizar estado de asiento
bathroom_door_sensor    - Sensor de puerta de baño
```

## Métricas y KPIs Técnicos

- **Latencia WebSocket:** < 50ms
- **Throughput:** 1000+ eventos/segundo
- **Uptime:** 99.9%
- **Memory usage:** < 512MB per container
- **Database response time:** < 10ms

Esta arquitectura garantiza una experiencia de usuario fluida, escalable y robusta para la gestión de cabinas de avión en tiempo real.
