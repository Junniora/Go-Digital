# 🚀 Go Digital – Portal de Solicitudes

Aplicación fullstack para gestión de solicitudes digitales.  
**Backend:** ASP.NET Core (C#) + PostgreSQL  
**Frontend:** Vue 3 + Quasar Framework + TypeScript

---

## 📋 Requisitos previos

Asegúrate de tener instalado lo siguiente antes de empezar:

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0+ | https://dotnet.microsoft.com/download |
| [PostgreSQL](https://www.postgresql.org/download/) | 14+ | https://www.postgresql.org/download |
| [Node.js](https://nodejs.org/) | 18+ | https://nodejs.org |
| [npm](https://www.npmjs.com/) | 9+ | Viene incluido con Node.js |

---

## ⚙️ Configuración paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/Junniora/Go-Digital.git
cd Go-Digital
```

---

### 2. Configurar el Backend (ASP.NET Core)

#### 2.1 Crear el archivo de credenciales locales

El archivo `appsettings.json` **no contiene credenciales reales** (por seguridad).  
Debes crear manualmente el archivo `appsettings.Development.json` dentro de `GoDigital.API/`:

```bash
# Desde la raíz del proyecto
cd GoDigital.API
```

Crea el archivo `appsettings.Development.json` con el siguiente contenido:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=GoDigitalDb;Username=TU_USUARIO;Password=TU_CONTRASEÑA"
  }
}
```

> ⚠️ Reemplaza `TU_USUARIO` y `TU_CONTRASEÑA` con las credenciales de tu PostgreSQL local.  
> Por defecto PostgreSQL usa `Username=postgres;Password=postgres`.

#### 2.2 Crear la base de datos y aplicar migraciones

Asegúrate de que PostgreSQL esté corriendo, luego ejecuta:

```bash
dotnet ef database update
```

> Si no tienes instalada la herramienta `dotnet-ef`, instálala con:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

#### 2.3 Ejecutar el backend

```bash
dotnet run
```

El API estará disponible en: `http://localhost:5000` (o el puerto que aparezca en la consola).

---

### 3. Configurar el Frontend (Quasar / Vue 3)

```bash
# Desde la raíz del proyecto
cd go-digital-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:9000`

---

## 🖥️ Ejecutar el proyecto completo

Necesitas tener **dos terminales abiertas**:

| Terminal | Directorio | Comando |
|---|---|---|
| 1 – Backend | `GoDigital.API/` | `dotnet run` |
| 2 – Frontend | `go-digital-frontend/` | `npm run dev` |

O simplemente ejecuta el archivo **`Start Digital.bat`** incluido en la raíz del proyecto.

---

## 🗄️ Estructura del proyecto

```
Go-Digital/
├── GoDigital.API/          # Backend ASP.NET Core
│   ├── Controllers/        # Endpoints de la API
│   ├── Models/             # Modelos de datos
│   ├── Data/               # DbContext (Entity Framework)
│   ├── Services/           # Lógica de negocio
│   ├── Migrations/         # Migraciones de base de datos
│   └── appsettings.json    # Configuración (sin credenciales)
│
├── go-digital-frontend/    # Frontend Vue 3 + Quasar
│   ├── src/
│   │   ├── pages/          # Páginas principales
│   │   ├── components/     # Componentes reutilizables
│   │   ├── services/       # Llamadas a la API
│   │   └── stores/         # Estado global (Pinia)
│   └── quasar.config.ts
│
├── Start Digital.bat       # Script para iniciar todo
└── README.md
```
