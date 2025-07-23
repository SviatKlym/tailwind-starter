/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './**/*.php',
    './src/**/*.js',
    './src/**/*.jsx',
    './build/**/*.js',
    './inc/**/*.php',
    './template-parts/**/*.php',
    // Visual controls classes are safelist'd below, no need to scan the CSS file
  ],
  safelist: [
    // Essential layout classes that must always be available
    'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden',
    'relative', 'absolute', 'fixed', 'sticky', 'static',
    'items-start', 'items-center', 'items-end', 'items-stretch', 'items-baseline',
    'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly',
    'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap',
    'space-x-1', 'space-x-2', 'space-x-3', 'space-x-4', 'space-x-6', 'space-x-8',
    'space-y-1', 'space-y-2', 'space-y-3', 'space-y-4', 'space-y-6', 'space-y-8',
    'w-full', 'w-auto', 'w-fit', 'h-full', 'h-auto', 'h-fit', 'min-h-screen',
    'max-w-none', 'max-w-full', 'max-w-screen-sm', 'max-w-screen-md', 'max-w-screen-lg', 'max-w-screen-xl',
    'mx-auto', 'container',
    
    // Common spacing classes  
    'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-6', 'mb-8', 'mb-12',
    'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-6', 'mt-8', 'mt-12',
    'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-6', 'ml-8', 
    'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-6', 'mr-8',
    'px-2', 'px-3', 'px-4', 'px-6', 'px-8', 'py-2', 'py-3', 'py-4', 'py-6', 'py-8',
    
    // Block-specific classes
    'plan-features', 'feature-item', 'block-container', 'block-section', 'section-header',
    'slider-handle', 'color-picker-wrapper', 'post-card', 'post-content',
    
    // Common text alignments
    'text-center', 'text-left', 'text-right', 'text-justify',
    
    // Common display utilities
    'overflow-hidden', 'rounded-lg', 'rounded-md', 'rounded-full', 'shadow-md', 'shadow-lg',
    'bg-opacity-50', 'hover:opacity-100', 'transition-opacity', 'duration-200',
    
    // Visual Controls Dynamic Classes - Colors
    {
      pattern: /^(bg|text|border)-(slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // Visual Controls Dynamic Classes - Spacing (Padding & Margins)
    {
      pattern: /^(p|m|pt|pr|pb|pl|mt|mr|mb|ml)-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|72|80|96)$/,
    },
    // Specific margin classes to ensure they're not purged
    'mt-12', 'mb-12', 'ml-32', 'mr-32', 'mt-16', 'mb-16', 'mt-20', 'mb-20',
    'mt-24', 'mb-24', 'mt-32', 'mb-32', 'mt-40', 'mb-40', 'mt-48', 'mb-48',
    // Visual Controls Dynamic Classes - Typography
    {
      pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
    },
    {
      pattern: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    },
    {
      pattern: /^text-(left|center|right|justify)$/,
    },
    {
      pattern: /^(leading|tracking)-(none|tight|snug|normal|relaxed|loose|tighter|wider|widest)$/,
    },
    {
      pattern: /^(uppercase|lowercase|capitalize|normal-case)$/,
    },
    // Layout & Display - More comprehensive patterns
    {
      pattern: /^(block|inline|inline-block|flex|inline-flex|table|table-cell|grid|inline-grid|hidden)$/,
    },
    {
      pattern: /^(items|justify|content)-(start|center|end|between|around|evenly|stretch|baseline)$/,
    },
    {
      pattern: /^flex-(row|col|wrap|nowrap|1|auto|none)$/,
    },
    {
      pattern: /^w-(1\/4|1\/3|1\/2|2\/3|3\/4|full|auto|fit|min|max)$/,
    },
    {
      pattern: /^h-(auto|full|screen|min|max|fit)$/,
    },
    {
      pattern: /^(justify|items|content)-(start|center|end|between|around|evenly|stretch|baseline)$/,
    },
    {
      pattern: /^gap-(0|1|2|4|6|8|12|16|20|24|32)$/,
    },
    {
      pattern: /^grid-(cols|rows)-(1|2|3|4|5|6|12)$/,
    },
    {
      pattern: /^(relative|absolute|fixed|sticky|static)$/,
    },
    {
      pattern: /^z-(0|10|20|30|40|50|auto)$/,
    },
    // Visual Controls Dynamic Classes - Effects & Animations
    {
      pattern: /^shadow-(none|sm|md|lg|xl|2xl)$/,
    },
    {
      pattern: /^rounded-(none|sm|md|lg|xl|2xl|3xl|full)$/,
    },
    {
      pattern: /^border-(0|1|2|4|8)$/,
    },
    {
      pattern: /^border-(solid|dashed|dotted|double|none)$/,
    },
    {
      pattern: /^(opacity|bg-opacity|text-opacity)-(0|25|50|75|90|95|100)$/,
    },
    {
      pattern: /^hover:(scale|shadow|opacity|rotate|bg)-(90|95|105|110|125|150|sm|md|lg|xl|2xl|75|80|90|95|1|3|6|12|-3|-6|slate|gray|red|green|blue|purple|white|black)-(50|100|200|300|400|500|600|700|800|900|950)?$/,
    },
    {
      pattern: /^animate-(spin|ping|pulse|bounce)$/,
    },
    {
      pattern: /^transition-(all|colors|opacity|shadow|transform)$/,
    },
    {
      pattern: /^duration-(75|150|200|300|500|700|1000)$/,
    },
    {
      pattern: /^ease-(linear|in|out|in-out)$/,
    },
    // Visual Controls Dynamic Classes - Gradients
    {
      pattern: /^bg-gradient-to-(r|l|t|b|tr|tl|br|bl)$/,
    },
    {
      pattern: /^from-(slate|gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    {
      pattern: /^to-(slate|gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // Responsive Visual Controls - All Breakpoints
    {
      pattern: /^(sm|md|lg|xl|2xl):(bg|text|border)-(slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    {
      pattern: /^(sm|md|lg|xl|2xl):(p|m|pt|pr|pb|pl|mt|mr|mb|ml)-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|72|80|96)$/,
    },
    {
      pattern: /^(sm|md|lg|xl|2xl):text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
    },
    {
      pattern: /^(sm|md|lg|xl|2xl):font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    },
    {
      pattern: /^(sm|md|lg|xl|2xl):(block|inline|inline-block|flex|grid|hidden)$/,
    },
    {
      pattern: /^(sm|md|lg|xl|2xl):(w|h)-(1\/4|1\/3|1\/2|2\/3|3\/4|full|auto|fit|min|max|screen)$/,
    },
    {
      pattern: /^(sm|md|lg|xl|2xl):grid-(cols|rows)-(1|2|3|4|5|6|12)$/,
    },
    {
      pattern: /^(sm|md|lg|xl|2xl):(shadow|rounded|border)-(none|sm|md|lg|xl|2xl|3xl|full|0|1|2|4|8|solid|dashed|dotted|double)$/,
    },
    {
      pattern: /^(sm|md|lg|xl|2xl):animate-(spin|ping|pulse|bounce)$/,
    }
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--wp--preset--color--primary)',
          50: 'var(--wp--preset--color--primary-50)',
          500: 'var(--wp--preset--color--primary)',
          600: 'var(--wp--preset--color--primary-600)',
        },
        secondary: {
          DEFAULT: 'var(--wp--preset--color--secondary)',
          50: 'var(--wp--preset--color--secondary-50)',
          500: 'var(--wp--preset--color--secondary)',
          600: 'var(--wp--preset--color--secondary-600)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [
    '@tailwindcss/typography',
    '@tailwindcss/forms',
    '@tailwindcss/aspect-ratio',
    '@tailwindcss/container-queries',
  ],
}