'use client';

import React, { useRef, useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [markers, setMarkers] = useState([
    { x: 100, y: 150, label: '产品A' },
    { x: 200, y: 250, label: '产品B' }
  ]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);

    const img = new Image();
    img.src = '/customers/amy-burns.png'; // 替换为实际图片URL
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawMarkers(context);
    };
  }, [markers, scale]);

  const drawMarkers = (context) => {
    markers.forEach(marker => {
      context.fillStyle = 'red';
      context.beginPath();
      context.arc(marker.x, marker.y, 5, 0, 2 * Math.PI);
      context.fill();
      context.fillStyle = 'black';
      context.fillText(marker.label, marker.x + 10, marker.y);
    });
  };

  const addMarker = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;
    const label = prompt('请输入产品信息:');
    if (label) {
      setMarkers([...markers, { x, y, label }]);
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;
    setScale(prevScale => prevScale * scaleAmount);
  };

  useEffect(() => {
    if (ctx) {
      const canvas = canvasRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      img.src = '/customers/amy-burns.png'; // 替换为实际图片URL
      img.onload = () => {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawMarkers(ctx);
      };
    }
  }, [ctx, scale]);

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        width="800"
        height="600"
        onClick={addMarker}
        onWheel={handleWheel}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};

export default App;
