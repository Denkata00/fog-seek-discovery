import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Game() {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for messages from the game iframe (e.g. navigate home)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data === 'navigate-home') navigate('/');
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [navigate]);

  return (
    <iframe
      ref={iframeRef}
      src="/game.html"
      title="Fog & Seek"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        display: 'block',
        background: '#050a12',
      }}
      allow="autoplay"
    />
  );
}
