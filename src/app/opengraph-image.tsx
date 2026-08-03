import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1F2937',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg width="90" height="99" viewBox="0 0 380 420">
            <g stroke="#0F8B6D" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M60,40 L190,280 M350,55 Q270,75 300,150 L190,280" />
              <path d="M190,280 L178,400" />
            </g>
          </svg>
          <span
            style={{
              fontSize: 110,
              fontWeight: 800,
              color: '#F7F7F5',
              marginLeft: -6,
              letterSpacing: -2,
            }}
          >
            embal
          </span>
        </div>
        <div style={{ display: 'flex', color: '#0F8B6D', fontSize: 28, marginTop: 24, letterSpacing: 4 }}>
          ACHETER. VENDRE. SIMPLEMENT.
        </div>
      </div>
    ),
    { ...size }
  );
}
