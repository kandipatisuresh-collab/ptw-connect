import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'

interface HealthResponse {
  status: string
  service: string
  profile: string
  safetyNotice: string
}

interface ProfileResponse {
  displayName: string
  email: string
  roles: string[]
}

interface PlantResponse {
  code: string
  name: string
  timezone: string
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const useMockIdentity = import.meta.env.VITE_USE_MOCK_IDENTITY === 'true'
const mockUser = import.meta.env.VITE_MOCK_USER ?? 'synthetic.user'

async function fetchApi<T>(path: string): Promise<T> {
  const headers = useMockIdentity ? { 'X-Mock-User': mockUser } : undefined
  const response = await fetch(`${apiBaseUrl}${path}`, { headers })
  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`)
  }
  return (await response.json()) as T
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [plants, setPlants] = useState<PlantResponse[]>([])
  const [accessError, setAccessError] = useState<string | null>(null)

  const checkHealth = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/health`)
      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}`)
      }
      setHealth((await response.json()) as HealthResponse)
    } catch (healthError) {
      setHealth(null)
      setError(healthError instanceof Error ? healthError.message : 'Backend is unavailable')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadAccessContext = useCallback(async () => {
    setAccessError(null)
    try {
      const [profileResponse, plantResponse] = await Promise.all([
        fetchApi<ProfileResponse>('/api/v1/users/me'),
        fetchApi<PlantResponse[]>('/api/v1/master-data/plants'),
      ])
      setProfile(profileResponse)
      setPlants(plantResponse)
    } catch (accessLoadError) {
      setProfile(null)
      setPlants([])
      setAccessError(accessLoadError instanceof Error ? accessLoadError.message : 'Access context unavailable')
    }
  }, [])

  useEffect(() => {
    void checkHealth()
    void loadAccessContext()
  }, [checkHealth, loadAccessContext])

  return (
    <Box className="app-shell">
      <AppBar position="static" elevation={0} className="top-bar">
        <Toolbar className="top-bar__inner">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box className="brand-mark" aria-hidden="true">PTW</Box>
            <Box>
              <Typography variant="h6" component="div" className="brand-name">PTW Connect</Typography>
              <Typography variant="caption" className="brand-caption">Permit-to-work platform</Typography>
            </Box>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Chip icon={<LockOutlinedIcon />} label="Phase 3 identity + master data" size="small" className="status-chip" />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="page-container">
        <Stack spacing={3}>
          <Box className="hero-block">
            <Typography variant="overline" className="eyebrow">Operational control foundation</Typography>
            <Typography variant="h1" component="h1" className="hero-title">
              A clear starting point for safer work control.
            </Typography>
            <Typography variant="body1" className="hero-copy">
              The platform shell is ready for authenticated, server-controlled permit workflows.
              Safety decisions remain with competent people.
            </Typography>
          </Box>

          <Alert severity="warning" icon={<WarningAmberOutlinedIcon />} className="safety-banner">
            <strong>Human review is required.</strong> PTW Connect does not autonomously decide that work is safe,
            approve permits, or activate work. Every safety-critical action must be completed by an authorized person.
          </Alert>

          <Box className="status-grid">
            <Paper className="status-panel" elevation={0}>
              <Stack direction="row" spacing={1.5} alignItems="center" className="panel-heading">
                <ShieldOutlinedIcon color="primary" />
                <Box>
                  <Typography variant="h6">Platform status</Typography>
                  <Typography variant="body2" color="text.secondary">Local backend readiness</Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              {loading && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography variant="body2">Checking backend health...</Typography>
                </Stack>
              )}
              {!loading && health && (
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleOutlineIcon color="success" />
                    <Typography variant="h5" component="span">{health.status}</Typography>
                    <Chip label={health.profile === 'mock' ? 'Development mock identity' : health.profile} size="small" color="warning" variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{health.service}</Typography>
                  <Typography variant="caption" color="text.secondary">{health.safetyNotice}</Typography>
                </Stack>
              )}
              {!loading && error && (
                <Stack spacing={1.5}>
                  <Alert severity="error">{error}</Alert>
                  <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => void checkHealth()}>
                    Retry health check
                  </Button>
                </Stack>
              )}
            </Paper>

            <Paper className="status-panel status-panel--accent" elevation={0}>
              <Typography variant="overline" className="eyebrow">Foundation boundary</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>What exists now</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Typography variant="body2">• Java 21 service boundary with health and development identity endpoints</Typography>
                <Typography variant="body2">• MySQL 8 and Flyway platform baseline</Typography>
                <Typography variant="body2">• Server-resolved roles, plant scope, and master-data catalogs</Typography>
                <Typography variant="body2">• Production identity and permit workflows remain intentionally unimplemented</Typography>
              </Stack>
            </Paper>

            <Paper className="status-panel" elevation={0}>
              <Stack direction="row" spacing={1.5} alignItems="center" className="panel-heading">
                <LockOutlinedIcon color="primary" />
                <Box>
                  <Typography variant="h6">Access context</Typography>
                  <Typography variant="body2" color="text.secondary">Resolved by the backend</Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              {profile && (
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">{profile.displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {profile.roles.map((role) => <Chip key={role} label={role} size="small" variant="outlined" />)}
                  </Stack>
                  <Typography variant="body2">
                    Authorized plants: {plants.length ? plants.map((plant) => `${plant.code} (${plant.timezone})`).join(', ') : 'None'}
                  </Typography>
                </Stack>
              )}
              {!profile && accessError && <Alert severity="info">{accessError}</Alert>}
            </Paper>
          </Box>

          <Paper className="next-panel" elevation={0}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
              <Box>
                <Typography variant="h6">Ready for the next controlled increment</Typography>
                <Typography variant="body2" color="text.secondary">
                  Permit creation and risk assessment are the next business module. They will remain server-enforced and reviewable before workflow actions are added.
                </Typography>
              </Box>
              <Chip label="No permit actions enabled" variant="outlined" color="warning" />
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
