# Housing Complex 3D Visualization

A modern 3D visualization of a housing complex exterior built with Next.js, Three.js, and TypeScript. This project showcases an interactive 3D scene featuring buildings, landscape elements, and realistic lighting effects.

## Features

- **3D Housing Complex**: Interactive visualization of multiple buildings with unique designs
- **Realistic Lighting**: Ambient and directional lighting with shadows
- **Automatic Camera Animation**: Smooth rotation around the complex
- **Responsive Design**: Works across different screen sizes
- **Modern Tech Stack**: Built with Next.js 15, Three.js, and TypeScript

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **3D Rendering**: Three.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Development**: ESLint for code quality

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd houseing-complex
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the 3D housing complex.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main page with 3D scene
│   └── globals.css        # Global styles
├── components/
│   └── HousingComplexScene.tsx  # Main 3D scene component
```

## 3D Scene Details

The housing complex includes:

- **Main Building**: Central 8x6x8 building with a pyramid roof
- **Side Buildings**: Four smaller buildings positioned around the main building
- **Landscape**: Green ground plane with scattered trees
- **Lighting**: Ambient lighting and directional light with shadows
- **Animation**: Rotating camera and subtle building animations

## Customization

You can customize the 3D scene by modifying `src/components/HousingComplexScene.tsx`:

- **Building Sizes**: Adjust geometry parameters
- **Colors**: Modify material colors
- **Lighting**: Change light positions and intensities
- **Camera Movement**: Customize animation parameters
- **Add Elements**: Include more buildings, vehicles, or landscape features

## Performance Optimization

- Uses efficient Three.js geometries and materials
- Implements proper cleanup to prevent memory leaks
- Optimized for web rendering with antialias and shadow mapping

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Three.js Documentation](https://threejs.org/docs/) - learn about 3D rendering with Three.js
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# houseing-complex
