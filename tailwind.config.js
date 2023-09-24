/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      colors:{
        primaryColor: '#FDE63A',
        primaryColorShade: '#B81F25',
        secondaryColor: '#147CB1',
        secondaryColorShade: '#147CB1',
        backgroundColor: '#A6A6A60D',
        tertiaryColor: '#FA51150D',
        tColor:'#949494',
        tColor2:'#454545',
        tColor3:'#504F54',
    },
      fontFamily:{
        'mulish': 'Mulish',
        'helvetica':'Helvetica',
      }},
  },
  plugins: [
    (function({ addBase }) {
      addBase({
         'h1': { fontSize: "4.0rem" },
         'h2': { fontSize: "3.5rem" },
         'h3': { fontSize: "3.0rem" },
         'h4': { fontSize: "2.5rem" },
         'h5': { fontSize: "2.0rem" },
         'h6': { fontSize: "1.5rem" },
       })
     }),
  ],
}

