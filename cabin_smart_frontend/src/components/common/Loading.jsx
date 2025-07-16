import { Fragment } from 'react';

const Loading = ({ size = 'md', text = 'Cargando...', fullScreen = false, overlay = false }) => {
  const sizes = {
    sm: '1rem',
    md: '2rem',
    lg: '3rem',
    xl: '4rem',
  };

  const spinner = (
    <div className="loading-spinner-container">
      <div 
        className="loading-spinner"
        style={{
          width: sizes[size] || sizes.md,
          height: sizes[size] || sizes.md,
        }}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {spinner}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="loading-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;
