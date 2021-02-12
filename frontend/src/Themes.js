// Helper Tool:        https://material-ui.com/customization/color/#picking-colors
// Palleter Reference: https://material-ui.com/customization/palette/

const themeGenerator = (isDark) => {
  return {
    palette: {
      type: (isDark) ? 'dark' : 'light',
      primary: {
        light:  '#33ab9f',
        main:   '#009688',
        dark:   '#00695f',
        contrastText: '#fff',
      },
      secondary: {
        light: '#f73378',
        main:  '#f50057',
        dark:  '#ab003c',
        contrastText: '#fff',
      },
    },
    overrides: {
      MuiAvatar: { 
        colorDefault: {
          color: '#ffffff',
          backgroundColor: '#00695f'
        }
      }
    }
  }
}


const DarkTheme  = themeGenerator(true)
const LightTheme = themeGenerator(false)

export { DarkTheme, LightTheme } 