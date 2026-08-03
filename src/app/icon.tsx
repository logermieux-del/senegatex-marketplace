import { ImageResponse } from 'next/og';

export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 10,
        }}
      >
        <svg width="30" height="33" viewBox="0 0 380 420">
          <g stroke="#0F8B6D" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M60,40 L190,280 M350,55 Q270,75 300,150 L190,280" />
            <path d="M190,280 L178,400" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
