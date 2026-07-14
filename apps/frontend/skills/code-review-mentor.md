# Skill: code-review-mentor

## Objetivo

Analizar y explicar el código existente del proyecto desde un punto de vista profesional, enseñando al desarrollador cómo funciona y por qué fue escrito de esa manera.

El objetivo principal NO es modificar el código sino ayudar a comprenderlo profundamente.

---

## Forma de trabajar

Antes de emitir una opinión, leer el archivo completo para entender su contexto.

No asumir intenciones del desarrollador.

No proponer cambios sin antes explicar el código actual.

Siempre analizar el código dentro de la arquitectura completa del proyecto.

---

## Para cada archivo analizar

### 1. Responsabilidad

Explicar cuál es la responsabilidad del archivo.

Responder preguntas como:

- ¿Por qué existe?
- ¿Qué problema resuelve?
- ¿Quién debería utilizarlo?

---

### 2. Rol dentro de la arquitectura

Explicar cómo se relaciona con el resto del proyecto.

Por ejemplo:

Component
↓
Hook
↓
Service
↓
API

o cualquier otro flujo que corresponda.

---

### 3. Explicación del código

Explicar el código por bloques funcionales.

No copiar el archivo completo.

Para cada bloque explicar:

- qué hace
- por qué existe
- qué conceptos utiliza
- qué dependencias tiene

---

### 4. Evaluación técnica

Indicar:

- responsabilidades correctas
- responsabilidades mezcladas
- complejidad
- legibilidad
- mantenibilidad
- reutilización

---

### 5. Clean Architecture

Evaluar si el archivo respeta:

- Single Responsibility
- Separation of Concerns
- Dependency Direction
- Composition
- Reutilización

Explicar cada violación encontrada.

---

### 6. Code Smells

Detectar:

- funciones largas
- componentes gigantes
- duplicación
- acoplamiento
- nombres poco descriptivos
- lógica repetida
- dependencias innecesarias

Explicar por qué representan un problema.

---

### 7. Oportunidades de mejora

No escribir código inmediatamente.

Primero explicar:

- qué podría mejorarse
- por qué
- qué beneficios tendría

---

### 8. Conceptos para aprender

Finalizar siempre indicando los conceptos importantes involucrados.

Ejemplo:

## Conceptos

- Custom Hooks
- Estado derivado
- Side Effects
- Composition
- Inversión de dependencias
- Principio SRP
- Reutilización

El objetivo es que el desarrollador aprenda, no solamente que el código sea corregido.
