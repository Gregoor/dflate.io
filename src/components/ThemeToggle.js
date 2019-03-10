import React from 'react';

import './ThemeToggle.css';

export default function ThemeToggle(props) {
  return (
    <div className="theme-toggle">
      <div style={{ transform: 'scaleX(-1)' }}>
        {props.checked ? (
          <div style={{ position: 'relative', right: 1 }}>🌜</div>
        ) : (
          '🌞'
        )}
      </div>
      <input type="checkbox" {...props} />
    </div>
  );
}
