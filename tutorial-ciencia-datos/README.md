# 🎓 Tutorial Interactivo de Ciencia de Datos

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> Un tutorial web moderno, altamente animado e interactivo para aprender ciencia de datos desde cero hasta nivel avanzado.

![Tutorial Preview](public/images/preview.png)

## ✨ Características

- 🎨 **Altamente Visual**: Animaciones suaves y modernas con Framer Motion
- 🎮 **Interactivo**: Simuladores, quizzes y componentes interactivos en tiempo real
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- ⚡ **Performance**: Optimizado con Next.js 14 y App Router
- 🎯 **12 Módulos Completos**: Desde fundamentos hasta proyectos profesionales
- 🧪 **Simuladores en Vivo**: Descenso del gradiente, probabilidades, ML y más
- 📊 **Visualizaciones Dinámicas**: Gráficos y diagramas interactivos
- 🏆 **Gamificación**: Sistema de progreso, quizzes y badges
- 🌙 **Modo Oscuro** (próximamente)
- 🌐 **Multilenguaje** (próximamente)

## 📚 Módulos del Tutorial

1. **Introducción a la Ciencia de Datos** ✅
   - ¿Qué es la ciencia de datos?
   - Roles profesionales (Data Analyst, Engineer, Scientist, ML Engineer)
   - Ciclo de vida de un proyecto
   - Herramientas principales

2. **Fundamentos Matemáticos**
   - Álgebra Lineal (matrices, vectores, transformaciones)
   - Cálculo (derivadas, gradientes, optimización)
   - Probabilidad (distribuciones, teorema de Bayes)

3. **Estadística Fundamental**
   - Estadística descriptiva e inferencial
   - Pruebas de hipótesis
   - Intervalos de confianza

4. **Programación para Ciencia de Datos**
   - Python (NumPy, Pandas, Matplotlib)
   - SQL (consultas, joins, agregaciones)
   - Git y control de versiones

5. **Limpieza y Manipulación de Datos**
   - Valores faltantes y outliers
   - Normalización y estandarización
   - Feature engineering

6. **Visualización de Datos**
   - Principios de visualización
   - Matplotlib, Seaborn, Plotly
   - Dashboards interactivos

7. **Machine Learning Clásico**
   - Aprendizaje supervisado (regresión, clasificación)
   - Aprendizaje no supervisado (clustering, PCA)
   - Validación de modelos

8. **Deep Learning**
   - Redes neuronales
   - Backpropagation
   - CNN y RNN

9. **Desarrollo de Proyectos Reales**
   - Estructura de proyectos
   - EDA y modelado
   - Documentación

10. **Herramientas de Software Modernas**
    - Docker y contenedores
    - Cloud computing (AWS, GCP, Azure)
    - MLOps básico

11. **Buenas Prácticas y Ética**
    - Sesgos en ML
    - Privacidad de datos
    - Interpretabilidad de modelos

12. **Construcción de Portafolio**
    - Proyectos destacados
    - README profesionales
    - Deploy de modelos

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/tutorial-ciencia-datos.git

# Entrar al directorio
cd tutorial-ciencia-datos

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) - React framework con SSR/SSG
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) - Type safety
- **Estilos**: [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/) - Animaciones React

### Visualizaciones
- **Gráficos**: [D3.js](https://d3js.org/) - Visualizaciones de datos
- **Charts**: [Recharts](https://recharts.org/) - Gráficos React
- **3D**: [Three.js](https://threejs.org/) + React Three Fiber - Visualizaciones 3D

### Componentes
- **Iconos**: [Lucide React](https://lucide.dev/) - Iconos modernos
- **UI**: Componentes custom con TailwindCSS

### Desarrollo
- **Linting**: ESLint - Code quality
- **Formatting**: Prettier (recomendado)
- **Git Hooks**: Husky (próximamente)

## 📁 Estructura del Proyecto

```
tutorial-ciencia-datos/
├── public/                 # Assets estáticos
│   ├── images/
│   ├── animations/
│   └── assets/
├── src/
│   ├── app/               # App Router (Next.js 14)
│   │   ├── layout.tsx     # Layout principal
│   │   ├── page.tsx       # Página de inicio
│   │   ├── modulos/       # Páginas de módulos
│   │   │   ├── introduccion/
│   │   │   ├── matematicas/
│   │   │   └── ...
│   │   └── about/
│   ├── components/
│   │   ├── layout/        # Header, Footer, etc.
│   │   ├── ui/            # Componentes UI base
│   │   ├── interactive/   # Componentes interactivos
│   │   └── modules/       # Componentes por módulo
│   ├── lib/               # Utilidades y helpers
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   ├── data/              # Data y constantes
│   ├── animations/        # Configuraciones de animaciones
│   └── styles/
│       └── globals.css    # Estilos globales
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Componentes Interactivos

### Implementados ✅

1. **DataScienceLifecycle**
   - Navegador interactivo del ciclo de vida
   - Animaciones de transición
   - Tracking de progreso

2. **RolesComparison**
   - Comparador de roles profesionales
   - Gráficos de habilidades animados
   - Información detallada

3. **InteractiveQuiz**
   - Sistema completo de quizzes
   - Feedback inmediato
   - Tracking de puntuación
   - Celebraciones animadas

4. **GradientDescentSimulator**
   - Visualización en Canvas
   - Ajuste de learning rate
   - Animación de convergencia
   - Métricas en tiempo real

5. **ProbabilitySimulator**
   - Simulador de monedas
   - Simulador de dados
   - Gráficos de distribución
   - Ley de grandes números

### En Desarrollo 🚧

- MatrixVisualizer
- LinearTransformationDemo
- NeuralNetworkPlayground
- MLModelComparison
- CodePlayground

## 📊 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Build optimizado
npm run start        # Iniciar servidor de producción

# Calidad de Código
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🎯 Roadmap

### Fase 1: Base (Semanas 1-2) ✅
- [x] Configuración del proyecto
- [x] Sistema de diseño
- [x] Componentes base (Header, Footer, Layout)
- [x] Página de inicio
- [x] Navegación entre módulos

### Fase 2: Contenido Base (Semanas 3-6)
- [x] Módulo 1: Introducción ✅
- [ ] Módulo 2: Matemáticas (50%)
- [ ] Módulo 3: Estadística
- [ ] Módulo 4: Programación
- [ ] Módulo 5: Limpieza de datos
- [ ] Módulo 6: Visualización

### Fase 3: Contenido Avanzado (Semanas 7-10)
- [ ] Módulo 7: Machine Learning
- [ ] Módulo 8: Deep Learning
- [ ] Módulo 9: Proyectos
- [ ] Módulo 10: Herramientas
- [ ] Módulo 11: Ética
- [ ] Módulo 12: Portafolio

### Fase 4: Optimización (Semanas 11-12)
- [ ] Testing completo
- [ ] Optimización de performance
- [ ] Accesibilidad (WCAG AAA)
- [ ] SEO
- [ ] Documentación

### Fase 5: Lanzamiento (Semana 13)
- [ ] Deployment en Vercel
- [ ] Analytics
- [ ] Monitoreo
- [ ] Marketing

Ver [ROADMAP.md](../roadmap_detallado.md) para más detalles.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Inspirado por la necesidad de democratizar la educación en ciencia de datos
- Comunidad de Next.js y React
- Todos los contribuidores de librerías de código abierto

## 📧 Contacto

- Website: [tu-website.com](https://tu-website.com)
- Email: tu-email@ejemplo.com
- Twitter: [@tu-twitter](https://twitter.com/tu-twitter)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

## 🌟 Estrellas en el Tiempo

[![Stargazers over time](https://starchart.cc/tu-usuario/tutorial-ciencia-datos.svg)](https://starchart.cc/tu-usuario/tutorial-ciencia-datos)

---

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

Hecho con ❤️ para la comunidad de ciencia de datos
