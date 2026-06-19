// 依存を増やさないインラインSVGアイコン。currentColor で色付け。
const base = (path, props, opts = {}) => {
  const { size = 24, className = '', strokeWidth = 2, fill = 'none' } = props
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...opts}
    >
      {path}
    </svg>
  )
}

export const Home = (p) => base(<><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" /></>, p)
export const Book = (p) => base(<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 5.5V20" /></>, p)
export const Cards = (p) => base(<><rect x="3" y="7" width="14" height="13" rx="2.5" /><path d="M7 4h11a2 2 0 0 1 2 2v10" /></>, p)
export const Bookmark = (p) => base(<path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" />, p)
export const BookmarkFilled = (p) => base(<path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" />, { ...p, fill: 'currentColor' })
export const Gear = (p) => base(<><circle cx="12" cy="12" r="3.2" /><path d="M19.4 13a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2H9a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1V9a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6z" /></>, p)
export const Chart = (p) => base(<><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-6" /><path d="M3 20h18" /></>, p)
export const Speaker = (p) => base(<><path d="M4 9v6h4l5 4V5L8 9H4z" /></>, { ...p, fill: 'currentColor', strokeWidth: 1.4 })
export const SpeakerWave = (p) => base(<><path d="M3 9v6h4l5 4V5L7 9H3z" /><path d="M16 8a5 5 0 0 1 0 8" /><path d="M19 5a9 9 0 0 1 0 14" /></>, p)
export const Star = (p) => base(<path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9 6.8 19l1-5.8-4.2-4.1 5.8-.8z" />, p)
export const StarFilled = (p) => base(<path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9 6.8 19l1-5.8-4.2-4.1 5.8-.8z" />, { ...p, fill: 'currentColor' })
export const Flame = (p) => base(<path d="M12 3c1 3-1 4-1 6a3 3 0 0 0 5 2c1 2 1 3 1 4a5 5 0 0 1-10 0c0-3 2-5 3-7 .8-1.6 2-3 2-5z" />, p)
export const Check = (p) => base(<path d="m5 12 5 5 9-10" />, { ...p, strokeWidth: 2.6 })
export const Close = (p) => base(<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>, { ...p, strokeWidth: 2.4 })
export const ChevronLeft = (p) => base(<path d="m15 5-7 7 7 7" />, { ...p, strokeWidth: 2.4 })
export const ChevronRight = (p) => base(<path d="m9 5 7 7-7 7" />, { ...p, strokeWidth: 2.4 })
export const Plus = (p) => base(<><path d="M12 5v14" /><path d="M5 12h14" /></>, { ...p, strokeWidth: 2.4 })
export const Sparkles = (p) => base(<><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z" /></>, { ...p, fill: 'currentColor', strokeWidth: 1 })
export const Trophy = (p) => base(<><path d="M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M7 6H4v1a3 3 0 0 0 3 3" /><path d="M17 6h3v1a3 3 0 0 1-3 3" /><path d="M10 14h4M9 20h6M12 14v6" /></>, p)
export const Refresh = (p) => base(<><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8" /><path d="M20 4v4h-4" /><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16" /><path d="M4 20v-4h4" /></>, p)
export const Share = (p) => base(<><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" /></>, p)
export const Download = (p) => base(<><path d="M12 4v10" /><path d="m8 11 4 4 4-4" /><path d="M5 19h14" /></>, p)
export const Upload = (p) => base(<><path d="M12 16V6" /><path d="m8 9 4-4 4 4" /><path d="M5 19h14" /></>, p)
export const Link = (p) => base(<><path d="M9 12h6" /><path d="M10 8H8a4 4 0 0 0 0 8h2" /><path d="M14 8h2a4 4 0 0 1 0 8h-2" /></>, p)
export const Sprout = (p) => base(<><path d="M12 20v-7" /><path d="M12 13c0-3-2.5-5-6-5 0 3.5 2.5 5 6 5z" /><path d="M12 11c0-2.5 2-4.5 5.5-4.5C17.5 9.5 15 11 12 11z" /></>, p)
export const Lightbulb = (p) => base(<><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" /></>, p)
export const Target = (p) => base(<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>, p)
export const ArrowRight = (p) => base(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>, { ...p, strokeWidth: 2.2 })
export const Mic = (p) => base(<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></>, p)
export const Search = (p) => base(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>, { ...p, strokeWidth: 2.2 })
export const Keyboard = (p) => base(<><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" /></>, p)
export const Headphones = (p) => base(<><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /></>, p)
export const MathRoot = (p) => base(<><path d="M3 13l2.5 5L9 5h11" /><path d="M14 9l5 5M19 9l-5 5" /></>, p)
export const Eye = (p) => base(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>, p)
export const EyeOff = (p) => base(<><path d="M4 4l16 16" /><path d="M9.9 5.2A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.3 4M6.3 6.3A17 17 0 0 0 2 12s3.5 7 10 7a10.4 10.4 0 0 0 3.3-.5" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>, p)
export const BookOpen = (p) => base(<><path d="M12 6c-1.5-1.2-3.5-2-6-2-1 0-2 .2-2 .2v13s1-.2 2-.2c2.5 0 4.5.8 6 2" /><path d="M12 6c1.5-1.2 3.5-2 6-2 1 0 2 .2 2 .2v13s-1-.2-2-.2c-2.5 0-4.5.8-6 2" /><path d="M12 6v14" /></>, p)
export const Scroll = (p) => base(<><path d="M6 4h11a2 2 0 0 1 2 2v1H8" /><path d="M5 4a2 2 0 0 0-2 2v1c0 1 .5 1.5 1.5 1.5H6" /><path d="M19 7v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8" /><path d="M9 12h7M9 16h5" /></>, p)
export const DragHandle = (p) => base(<><circle cx="9" cy="6" r="1.3" fill="currentColor" /><circle cx="15" cy="6" r="1.3" fill="currentColor" /><circle cx="9" cy="12" r="1.3" fill="currentColor" /><circle cx="15" cy="12" r="1.3" fill="currentColor" /><circle cx="9" cy="18" r="1.3" fill="currentColor" /><circle cx="15" cy="18" r="1.3" fill="currentColor" /></>, { ...p, strokeWidth: 0 })
export const ChevronUp = (p) => base(<path d="m5 15 7-7 7 7" />, { ...p, strokeWidth: 2.4 })
export const ChevronDown = (p) => base(<path d="m5 9 7 7 7-7" />, { ...p, strokeWidth: 2.4 })
