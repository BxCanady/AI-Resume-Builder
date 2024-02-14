module.exports = {
    content:['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          // Add custom colors here
        },
        fontFamily: {
          // Add custom fonts here
        },
        // Extend or override default Tailwind CSS configuration here
      },
    },
    variants: {
      extend: {
        // Add custom variants here
      },
    },
    plugins: [
      // Add custom plugins here
    ],
  }
  