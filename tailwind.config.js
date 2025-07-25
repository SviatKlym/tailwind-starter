export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx,php}',
    './build/**/*.{js,jsx,ts,tsx,php}',
    './templates/**/*.php',
    './inc/**/*.php',
    './functions.php',
    './header.php',
    './footer.php',
    './index.php',
    './single.php',
    './page.php',
    './archive.php',
    './search.php',
    './404.php',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
}