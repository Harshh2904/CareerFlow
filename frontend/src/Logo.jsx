export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="CareerFlow logo">
      <rect width="48" height="48" rx="13" fill="#5b3df5" />
      <path d="M10 33 C17 33 17 22 24 22 C31 22 31 14 38 14" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="10" cy="33" r="3.5" fill="#ffffff" />
      <circle cx="24" cy="22" r="3.5" fill="#ffffff" />
      <circle cx="38" cy="14" r="5" fill="#ffd84d" />
    </svg>
  )
}