import React from 'react';

import './ThemeToggle.css';

export default function ThemeToggle(props) {
  return (
    <div className="theme-toggle">
      <div
        className={'horizon ' + (props.checked ? 'flip' : '')}
        style={{ position: 'relative', top: 20 }}
      >
        <div style={{ marginBottom: 10 }}>🌞</div>
        <div
          style={{
            position: 'relative',
            left: 1,
            transform: 'scaleX(-1) rotateZ(180deg)',
          }}
        >
          🌜
        </div>
      </div>
      <input
        type="checkbox"
        aria-label={'Turn page ' + (props.checked ? 'light' : 'dark')}
        {...props}
      />
    </div>
  );
}
