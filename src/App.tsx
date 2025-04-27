import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { AuthProvider } from './context/authContext'
import { store } from './redux/store'
import Routes from './routes'
import { ThemeProvider } from './context/themeContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { HelmetProvider } from 'react-helmet-async'
import { TooltipProvider } from './components/ui/tooltip'

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <GoogleOAuthProvider clientId='291724056968-k5rlgcpdifrukmb7asu2loc10440or1b.apps.googleusercontent.com'>
          <AuthProvider>
            <TooltipProvider>
              <ThemeProvider>
                <SWRConfig value={{ revalidateOnFocus: false }}>
                  <BrowserRouter>
                    <Routes />
                  </BrowserRouter>
                </SWRConfig>
              </ThemeProvider>
            </TooltipProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </Provider>
    </HelmetProvider>
  )
}

export default App
