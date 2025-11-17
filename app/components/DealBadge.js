'use client';

export default function DealBadge({ discount, dealText, lightning, className = "" }) {
  const isLightning = lightning === 'true';

  return (
    <div className={`bg-red-500 text-white px-2 py-0.5 rounded-md inline-block ${className}`}>
      <div className="font-semibold text-base">
        {isLightning && <span className="mr-1">⚡</span>}
        {discount}% off
      </div>
      {dealText && (
        <div className="text-xs font-normal mt-0.5">{dealText}</div>
      )}
    </div>
  );
}
