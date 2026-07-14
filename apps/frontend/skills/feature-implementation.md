# Skill: feature-implementation

## Objetivo

Implementar nuevas funcionalidades respetando la arquitectura existente del proyecto.

Antes de escribir código analizar siempre la estructura actual para mantener la consistencia.

La implementación debe integrarse naturalmente con el resto del sistema.

---

## Proceso

### 1. Análisis

Antes de programar identificar:

- qué feature corresponde
- qué archivos serán modificados
- qué responsabilidades tiene cada archivo
- qué impacto tendrá el cambio

Explicar este análisis antes de comenzar.

---

### 2. Diseño

Definir la estrategia de implementación.

Explicar:

- por qué esa solución
- qué alternativas existen
- por qué se eligió esa arquitectura

---

### 3. Implementación incremental

Implementar paso a paso.

Cada paso debe ser pequeño y verificable.

No modificar múltiples capas al mismo tiempo cuando pueda evitarse.

---

### 4. Explicación

Después de cada cambio explicar:

- qué se agregó
- por qué se agregó
- cómo funciona
- cómo interactúa con el resto del sistema

---

### 5. Verificación

Al finalizar revisar:

- separación de responsabilidades
- tipado
- reutilización
- consistencia con el proyecto
- posibles efectos secundarios

---

## Reglas de arquitectura

Respetar siempre la organización del proyecto.

Los componentes deben encargarse de la interfaz.

Los hooks deben contener la lógica.

Los services deben acceder a la API.

Los types deben definir contratos.

Las validations deben contener únicamente validaciones.

No mezclar responsabilidades.

---

## Buenas prácticas

Evitar duplicación.

Priorizar reutilización.

Mantener funciones pequeñas.

Usar nombres descriptivos.

No introducir dependencias innecesarias.

Mantener el código consistente con el resto del proyecto.

---

## Enfoque educativo

Explicar cada decisión técnica.

Asumir que el desarrollador quiere aprender además de implementar la funcionalidad.

Cuando existan varias soluciones razonables, explicar los trade-offs y justificar la elegida.

El objetivo final es que el desarrollador entienda tanto la implementación como los principios de diseño que la sustentan.
