import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F7F7F5',
        }}
      >
        <svg width="112" height="124" viewBox="0 0 380 420">
          <g stroke="#0F8B6D" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M60,40 L190,280 M360,40 Q375,20 355,70 L190,280" />
            <path d="M190,280 L178,400" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
