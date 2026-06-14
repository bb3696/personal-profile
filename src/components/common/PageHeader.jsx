import React from 'react';

function PageHeader({
  countLabel,
  description,
  eyebrow,
  title,
}) {
  return (
    <header className="page-header">
      {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
      <h1 className="page-title">
        {title}
        {countLabel && <span className="visited-count">{countLabel}</span>}
      </h1>
      {description && <p className="page-description">{description}</p>}
    </header>
  );
}

export default React.memo(PageHeader);
