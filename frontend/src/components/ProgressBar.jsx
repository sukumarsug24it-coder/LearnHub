import React from 'react';

const ProgressBar = ({ value = 0, max = 100, height = 8, showLabel = true, color = 'var(--primary)' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="progress-component">
      {showLabel && (
        <div className="progress-label-bar">
          <span className="label-text">Completion</span>
          <span className="percentage-text">{percentage}%</span>
        </div>
      )}
      <div className="progress-outer-track" style={{ height: `${height}px` }}>
        <div
          className="progress-inner-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

