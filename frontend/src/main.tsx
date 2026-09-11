import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'
import './styles.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f4e5f' },
    secondary: { main: '#d97706' },
    warning: { main: '#b45309' },
    background: { default: '#eef3f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    h1: { fontFamily: '"IBM Plex Serif", Georgia, serif', fontWeight: 600 },
    h2: { fontFamily: '"IBM Plex Serif", Georgia, serif', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
