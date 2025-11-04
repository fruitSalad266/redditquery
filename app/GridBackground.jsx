'use client'

import { useEffect, useRef } from 'react';

export default function GridBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        const setCanvasSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        setCanvasSize();

        const gridSize = 50;
        const dots = [];
        const mouseInfluence = 300; // Much larger influence radius

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                dots.push({
                    x: x,
                    y: y,
                    originalX: x,
                    originalY: y,
                    vx: 0,
                    vy: 0
                });
            }
        }

        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };

        const animate = () => {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            const mouse = mouseRef.current;

            dots.forEach((dot) => {
                const dx = mouse.x - dot.x;
                const dy = mouse.y - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseInfluence) {
                    const force = (mouseInfluence - distance) / mouseInfluence;
                    dot.vx -= dx * force * 0.008;
                    dot.vy -= dy * force * 0.008;
                }

                // Apply spring force back to original position
                const backDx = dot.originalX - dot.x;
                const backDy = dot.originalY - dot.y;
                dot.vx += backDx * 0.06;
                dot.vy += backDy * 0.06;

                dot.vx *= 0.80;
                dot.vy *= 0.80;

                dot.x += dot.vx;
                dot.y += dot.vy;

                const dotDistance = Math.sqrt(
                    (mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2
                );
                let dotSize = 1.5;
                let dotOpacity = 0.3;
                
                if (dotDistance < mouseInfluence) {
                    const proximity = 1 - (dotDistance / mouseInfluence);
                    dotSize = 1.5 + proximity * 2; // Bigger size change
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${dotOpacity})`;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
                ctx.fill();

            });

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', setCanvasSize);
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', setCanvasSize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
}

