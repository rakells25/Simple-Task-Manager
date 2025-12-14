# 📌 Task Manager

Aplicación web para gestionar tareas con **.NET 7 + Entity Framework Core** en el backend y **Angular 17 + TailwindCSS** en el frontend. Permite crear, actualizar, eliminar, filtrar, ordenar y marcar tareas como completadas.

---

## 🛠 Tecnologías

- **Backend**: .NET 7, ASP.NET Core Web API, Entity Framework Core, SQL Server / SQLite  
- **Frontend**: Angular 17, TypeScript, TailwindCSS  
- **Otras**: RxJS, BehaviorSubject para estado reactivo, Angular Forms, Observables  

---

## ⚡ Características

- CRUD completo de tareas  
- Validaciones de campos (`title`, `status`, `priority`, `dueDate`)  
- Filtrado por estado y prioridad  
- Ordenamiento por fecha de creación o fecha de vencimiento  
- Toggle rápido de estado (`toDo` ↔ `done`)  
- Modal para creación y edición de tareas  
- Contadores de tareas por estado  
- Estilos dinámicos según prioridad (alto, medio, bajo)  
- Confirmación de eliminación de tareas  

---

## 🎨 Frontend

**DashboardComponent**: Vista principal con filtros, contadores y listado de tareas  
**TaskFormComponent**: Modal para creación y edición de tareas  
**TaskItemComponent**: Componente de cada tarea con toggle, edición y eliminación  

**Servicios**:  
- **TaskService**: Maneja el estado global de tareas, comunicación con la API y operaciones CRUD  

**Flujo de datos**:  
- Dashboard se suscribe a `TaskService.tasks$`  
- TaskItem emite eventos (`toggle`, `edit`, `delete`)  
- TaskForm emite `save` y `close` al Dashboard  

---

## ⚙️ Estilos y UI

- TailwindCSS para estilos rápidos y responsive  
- Clases dinámicas según `priority` y `status`  
- Scroll personalizado en listado de tareas  
- Botones con feedback visual al pasar el mouse  
- Modal centrado con fondo semitransparente  

---

## 🚀 Instalación

1. Clonar el repositorio y entrar en el proyecto:

```bash
-- Backend --
cd TaskManager.Api
dotnet restore
dotnet run

-- Frontend --
cd frotend
npm install
ng serve
