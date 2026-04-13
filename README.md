# CellStrength

App mobile construida con Expo + React Native para seguir el sistema de `Convict Conditioning` usando una base local SQLite, progresión por pasos, registro de sesiones y una biblioteca visual de ejercicios.

## Objetivo

La app está pensada para cubrir el flujo completo del método:

- onboarding inicial
- elección de programa
- definición del paso actual por movimiento
- rutina del día
- registro real de sesiones y series
- progresión manual y automática
- biblioteca de los 60 pasos con videos e imágenes locales

No busca ser una app fitness genérica. La dirección visual está inspirada en la portada del libro y en el diseño explorado en Stitch: editorial, sobria, áspera y utilitaria.

## Stack

- `Expo 54`
- `React 19`
- `React Native 0.81`
- `TypeScript`
- `React Navigation`
- `expo-sqlite`
- `expo-asset`
- `expo-file-system`
- `@expo-google-fonts/newsreader`
- `@expo-google-fonts/public-sans`

## Scripts

```bash
npm install
npm run start
npm run android
npm run ios
npm run web
```

Verificación de tipos:

```bash
npx tsc --noEmit
```

## Estructura

```text
app/
├─ App.tsx
├─ assets/
│  └─ images/
│     ├─ bridge/
│     ├─ handstand-pushup/
│     ├─ leg-raise/
│     ├─ pullup/
│     ├─ pushup/
│     └─ squat/
├─ data/
│  ├─ Convict.webp
│  └─ cellstrength_db/
│     ├─ cellstrength.sqlite
│     ├─ schema.sql
│     ├─ seed-data.json
│     ├─ seed-step-media.sql
│     └─ seed-local-images.sql
└─ src/
   ├─ assets/
   ├─ components/
   ├─ db/
   ├─ navigation/
   ├─ screens/
   └─ theme/
```

## Navegación

La navegación actual usa:

- `Root Stack`
- `Bottom Tabs`
- `Stacks` anidados por tab

Flujo principal:

1. `Onboarding`
2. `ChooseProgram`
3. `SetInitialLevels`
4. `MainTabs`

Tabs principales:

- `Hoy`
- `Progreso`
- `Biblioteca`

Pantallas fuera de tabs:

- `Profile`
- `CurrentProgram`
- `Settings`

## Diseño

La paleta nace de `data/Convict.webp`.

Dirección visual:

- fondo carbón y superficies tipo papel gastado
- acentos khaki, piedra y tinta
- tipografía editorial
- sensación de manual técnico, no de dashboard fitness brillante

Fuentes cargadas en runtime:

- `Newsreader`
- `Public Sans`

## Base de datos

La app usa una SQLite preconstruida:

- [`data/cellstrength_db/cellstrength.sqlite`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/data/cellstrength_db/cellstrength.sqlite)

La DB modela:

- `movement`
- `step`
- `step_target`
- `program`
- `program_day`
- `day_exercise`
- `user_movement_level`
- `session`
- `session_exercise`
- `set_log`
- `progression_event`
- `step_media`

### Estado actual del catálogo

- `6` movimientos
- `60` pasos
- `180` objetivos
- `5` programas base
- `54` videos guía
- `6` referencias externas de imagen
- `126` imágenes locales registradas en `step_media`

## Inicialización de DB

La app copia y abre la base preconstruida usando:

- [`data/cellstrength_db/ts/initDb.ts`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/data/cellstrength_db/ts/initDb.ts)

`metro.config.js` incluye soporte para empaquetar `.sqlite` como asset.

## Imágenes de ejercicios

Las imágenes finales viven en:

- `assets/images/bridge`
- `assets/images/handstand-pushup`
- `assets/images/leg-raise`
- `assets/images/pullup`
- `assets/images/pushup`
- `assets/images/squat`

Convención de nombres:

- `step-01-1.png`
- `step-01-2.png`
- `step-07-3.png`

Esto significa:

- `step-XX` = número de paso
- último número = variante o lámina adicional del mismo paso

La app resuelve estas imágenes con:

- [`src/assets/exerciseImages.ts`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/assets/exerciseImages.ts)

Además, la SQLite registra esas imágenes como `local_image` dentro de `step_media` usando URIs del tipo:

```text
asset://images/pushup/step-01-1.png
asset://images/leg-raise/step-04-3.png
asset://images/handstand-pushup/step-08-2.png
```

## Módulos principales

### `src/db/user.ts`

Gestiona:

- programa activo
- niveles actuales del usuario por movimiento
- guardado del onboarding inicial

### `src/db/today.ts`

Resuelve:

- programa actual
- día del programa según calendario
- bloques de entrenamiento del día
- fallback al paso actual del usuario por movimiento

### `src/db/session.ts`

Gestiona el tracking real:

- crea o recupera la sesión activa
- genera `session_exercise`
- registra series en `set_log`
- cierra la sesión
- devuelve resumen de sesión

### `src/db/progression.ts`

Gestiona progresión:

- avance manual
- retroceso manual
- avance automático por consistencia
- registro de `progression_event`

Regla automática actual:

- un movimiento avanza solo si completa el objetivo del mismo paso en `2` sesiones cerradas

### `src/db/progress.ts`

Construye la vista de progreso:

- estado actual por movimiento
- siguiente objetivo
- último evento de progresión
- contador de sesiones válidas hacia el próximo avance automático
- historial reciente global y por movimiento

### `src/db/library.ts`

Alimenta la biblioteca:

- lista de movimientos
- escalera de 10 pasos
- detalle del paso
- objetivos por esquema
- medios asociados

## Pantallas principales

### Onboarding

- presentación del sistema
- selección de programa
- selección del paso actual de cada movimiento

### Hoy

- muestra la rutina del día
- permite iniciar la sesión activa
- abre perfil desde el header

### Sesión activa

- muestra bloques del día
- registra series reales
- cierra sesión

### Resumen de sesión

- series registradas
- bloques trabajados
- estado de cierre
- progresión automática generada, si aplica

### Progreso

- vista general por movimiento
- expediente detallado
- historial reciente
- avance/retroceso manual del paso actual
- indicador `x/2 sesiones válidas`

### Biblioteca

- Los Seis Grandes
- los 10 pasos por movimiento
- detalle técnico del paso
- visor multimedia con imágenes locales y referencias externas

## Flujo funcional actual

1. El usuario entra por onboarding.
2. Elige programa.
3. Define su paso actual en cada movimiento.
4. La app calcula el bloque del día desde la DB.
5. Al iniciar sesión, crea `session` y `session_exercise`.
6. Cada serie registrada se guarda en `set_log`.
7. Al cerrar, la app evalúa progresión automática.
8. `Progreso` se actualiza con historial, eventos y contador de sesiones válidas.

## Decisiones importantes del proyecto

- La app usa DB local como fuente principal de verdad.
- Las imágenes finales no viven dentro de `data/`, sino en `assets/images`.
- La DB mantiene referencia a esas imágenes mediante `local_image`.
- `step_media` puede mezclar:
  - `local_image`
  - `video_guide`
  - `reference_image`
- La progresión automática es conservadora para evitar ascensos demasiado fáciles.

## Archivos clave

- [`App.tsx`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/App.tsx)
- [`src/navigation/RootNavigator.tsx`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/navigation/RootNavigator.tsx)
- [`src/navigation/TabsNavigator.tsx`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/navigation/TabsNavigator.tsx)
- [`src/db/user.ts`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/db/user.ts)
- [`src/db/today.ts`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/db/today.ts)
- [`src/db/session.ts`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/db/session.ts)
- [`src/db/progression.ts`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/db/progression.ts)
- [`src/db/progress.ts`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/db/progress.ts)
- [`src/db/library.ts`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/db/library.ts)
- [`src/assets/exerciseImages.ts`](C:/Users/pc/Documents/proyectos/Convict%20Conditioning/app/src/assets/exerciseImages.ts)

## Limitaciones actuales

- No hay autenticación ni sync remoto.
- No hay exportación/importación de datos todavía.
- La lógica de progresión automática se basa en sesiones válidas por series, no en validación humana de técnica.
- Aún no hay editor de notas de sesión ni cues enriquecidos en toda la biblioteca.
- Todavía no hay tests automáticos.

## Próximos pasos sugeridos

- añadir tests a la lógica de progresión y sesiones
- enriquecer `cue` y notas técnicas en la DB
- exportación de historial
- estadísticas más profundas por movimiento
- soporte de backup o sync futuro

## Desarrollo

Checklist rápida:

```bash
npm install
npx tsc --noEmit
npm run start
```

Si cambias assets o DB:

- revisa `src/assets/exerciseImages.ts`
- revisa `data/cellstrength_db/seed-local-images.sql`
- si actualizas la SQLite, verifica que la app siga resolviendo `local_image`

## Estado

La app ya está en un punto funcional:

- navega
- lee la DB real
- muestra biblioteca real
- usa imágenes locales reales
- registra sesiones
- calcula progreso
- aplica progresión manual y automática

Todavía queda trabajo de pulido, pero la columna vertebral del producto ya está implementada.
