import React from 'react';

function EmptyState({ description, title }) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-description">{description}</p>}
    </div>
  );
}

export default React.memo(EmptyState);
