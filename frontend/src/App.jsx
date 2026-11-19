
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, AlertTriangle, ArrowDownToLine, ArrowRight,
  ChevronLeft, ChevronRight, FileSpreadsheet,
  FileText, LayoutDashboard, LoaderCircle, LockKeyhole, Menu,
  RefreshCw, Search, Shield, ShieldAlert, ShieldCheck,
  UploadCloud, X, Zap, Database, Cpu, Network, ScanLine
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const PAGE_SIZE = 10

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } }
}

function escapeCSV(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}


function MatrixRain() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame
    let drops = []
    const chars = 'アカサタナハマヤラワ012345789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      drops = Array.from({ length: Math.ceil(window.innerWidth / 19) },
        () => Math.floor(Math.random() * (window.innerHeight / 18)))
    }
    function draw() {
      ctx.fillStyle = 'rgba(0, 5, 1, 0.09)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.font = '13px monospace'
      drops.forEach((drop, i) => {
        ctx.fillStyle = Math.random() > 0.975 ? '#d7ffd0' : '#39ff14'
        ctx.globalAlpha = Math.random() > 0.92 ? 0.85 : 0.35
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 19, drop * 18)
        ctx.globalAlpha = 1
        drops[i] = drop * 18 > window.innerHeight && Math.random() > 0.975 ? 0 : drop + 1
      })
      frame = requestAnimationFrame(draw)
    }
    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const target = Number(value) || 0
    let frame
    const start = performance.now()
    const duration = 850

    function update(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(update)
    }

    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return <>{display.toLocaleString()}</>
}

function MetricCard({ title, value, description, icon: Icon, color, index }) {
  const colors = {
    cyan: 'text-green-300 bg-green-400/10 border-green-400/20',
    red: 'text-red-300 bg-red-400/10 border-red-400/20',
    green: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    purple: 'text-violet-300 bg-violet-400/10 border-violet-400/20'
  }

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5, scale: 1.012 }}
      transition={{ duration: 0.2 }}
      className="matrix-card group relative overflow-hidden rounded-2xl p-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-green-400/[0.045] blur-2xl transition group-hover:bg-green-400/15" />
      <div className="relative flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-slate-400">{title}</p>
        <div className={`rounded-xl border p-2.5 ${colors[color]}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="relative mt-5 text-3xl font-bold tracking-tight text-white">
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </p>
      <p className="relative mt-2 text-[11px] text-slate-500">{description}</p>
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-green-400 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  )
}

function SummaryLine({ label, value, percentage, color }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-white">
          {value.toLocaleString()}
          <span className="ml-2 font-normal text-slate-500">
            {percentage.toFixed(1)}%
          </span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

function Sidebar({ open, onClose, apiStatus, onCheck }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close navigation"
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : 0 }}
        className={`fixed inset-y-0 left-0 z-40 flex w-[255px] flex-col border-r border-green-400/10 bg-[#020603] transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-white/[0.07] px-6">
          <div className="matrix-logo-glow flex h-10 w-10 items-center justify-center rounded-xl border border-green-300/30 bg-green-400/10">
            <Shield className="text-green-300" size={23} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">
              NET<span className="text-green-300">SHIELD</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.23em] text-slate-500">
              Threat intelligence
            </p>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-500 lg:hidden">
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Workspace
          </p>
          <div className="matrix-sidebar-active flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-green-200">
            <LayoutDashboard size={18} />
            Security Overview
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green-300 shadow-[0_0_9px_#39ff14]" />
          </div>
        </div>

        <div className="mt-7 px-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Intelligence
          </p>
          {[
            [FileSpreadsheet, 'CSV Analysis'],
            [Activity, 'Threat Analytics'],
            [Database, 'Dataset Records'],
            [Cpu, 'ML Engine']
          ].map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-white/[0.035] hover:text-green-200">
              <Icon size={17} />
              {label}
            </div>
          ))}
        </div>

        <div className="mx-4 mt-7 rounded-xl border border-green-400/10 bg-green-400/[0.035] p-3">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-green-500/80">Live modules</p>
          <div className="space-y-2 text-[11px] text-green-100/55">
            <div className="flex items-center justify-between"><span>Threat scanner</span><span className="text-green-400">READY</span></div>
            <div className="flex items-center justify-between"><span>ML classifier</span><span className="text-green-400">READY</span></div>
            <div className="flex items-center justify-between"><span>CSV pipeline</span><span className="text-green-400">READY</span></div>
          </div>
        </div>

        <div className="mt-auto p-4">
          <div className="matrix-card rounded-2xl p-4">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Network size={15} className="text-green-300" />
              System Monitor
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Backend API</span>
              <span className={`flex items-center gap-1.5 ${
                apiStatus === 'online' ? 'text-emerald-400' :
                apiStatus === 'checking' ? 'text-amber-300' : 'text-red-400'
              }`}>
                <span className="status-dot h-1.5 w-1.5 rounded-full bg-current" />
                {apiStatus === 'online' ? 'ONLINE' :
                  apiStatus === 'checking' ? 'CHECKING' : 'OFFLINE'}
              </span>
            </div>
            <button
              onClick={onCheck}
              className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 transition hover:text-green-300"
            >
              <RefreshCw size={12} />
              Refresh connection
            </button>
          </div>
          <p className="mt-5 text-center text-[9px] tracking-wider text-slate-700">
            MATRIX NODE · SECURE SESSION
          </p>
        </div>
      </motion.aside>
    </>
  )
}

export default function App() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    checkApi()
    const interval = setInterval(checkApi, 30000)
    return () => clearInterval(interval)
  }, [])

  async function checkApi() {
    setApiStatus('checking')
    try {
      const response = await fetch(`${API_URL}/health`)
      if (!response.ok) throw new Error('API unavailable')
      const data = await response.json()
      setApiStatus(data.status === 'healthy' ? 'online' : 'offline')
    } catch {
      setApiStatus('offline')
    }
  }

  function selectFile(selected) {
    setError('')
    setResult(null)
    setSearch('')
    setFilter('all')
    setPage(1)

    if (!selected) return

    if (!selected.name.toLowerCase().endsWith('.csv')) {
      setFile(null)
      setError('Invalid file. Please select a CSV file.')
      return
    }

    if (selected.size > 20 * 1024 * 1024) {
      setFile(null)
      setError('File size must be less than 20 MB.')
      return
    }

    setFile(selected)
  }

  async function analyzeFile() {
    if (!file) {
      setError('Please select a CSV file first.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    const scanStartedAt = Date.now()

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Prediction failed.')
      }

      if (!Array.isArray(data.predictions)) {
        throw new Error('Unexpected response received from server.')
      }

      setResult(data)
      setPage(1)
      setFilter('all')
      setSearch('')
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Check whether the API is running.'
          : err.message
      )
    } finally {
      // Keep the scan animation visible for at least 2 seconds,
      // even when the local API responds very quickly.
      const remainingTime = 2000 - (Date.now() - scanStartedAt)
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }
      setLoading(false)
    }
  }

  const predictions = result?.predictions || []
  const total = Number(result?.total_records || 0)
  const phishing = Number(result?.phishing_count || 0)
  const legitimate = Number(result?.legitimate_count || 0)
  const phishingPercent = total ? (phishing / total) * 100 : 0
  const legitimatePercent = total ? (legitimate / total) * 100 : 0

  const filteredRows = useMemo(() => {
    return predictions.filter((row) => {
      const isPhishing = Number(row.predicted_column) === 1
      const matchesFilter =
        filter === 'all' ||
        (filter === 'phishing' && isPhishing) ||
        (filter === 'legitimate' && !isPhishing)

      const matchesSearch =
        !search ||
        Object.entries(row).some(([key, value]) =>
          `${key} ${value}`.toLowerCase().includes(search.toLowerCase())
        )

      return matchesFilter && matchesSearch
    })
  }, [predictions, filter, search])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visibleRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )
  const columns = predictions.length ? Object.keys(predictions[0]) : []

  function downloadReport() {
    if (!predictions.length) return

    const headers = Object.keys(predictions[0])
    const csv = [
      headers.map(escapeCSV).join(','),
      ...predictions.map((row) =>
        headers.map((header) => escapeCSV(row[header])).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'network-security-prediction-report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function resetAnalysis() {
    setFile(null)
    setResult(null)
    setError('')
    setSearch('')
    setFilter('all')
    setPage(1)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="matrix-shell min-h-screen overflow-hidden text-green-100">
      <MatrixRain />
      <div className="matrix-grid" />
      <div className="matrix-glow matrix-glow-one" />
      <div className="matrix-glow matrix-glow-two" />
      <div className="matrix-scanline" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          apiStatus={apiStatus}
          onCheck={checkApi}
        />

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-green-400/[0.09] bg-[#020603]/90 px-5 backdrop-blur-2xl md:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"
              >
                <Menu size={21} />
              </button>
              <div>
                <p className="text-sm font-bold tracking-wide text-white">
                  Matrix Command Center
                </p>
                <p className="mt-1 hidden text-[10px] tracking-wider text-slate-500 sm:block">
                  NETWORK SECURITY / PHISHING INTELLIGENCE
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-green-400/15 bg-green-400/[0.045] px-3 py-2 text-[10px] font-semibold tracking-wider">
              <span className={`h-2 w-2 rounded-full ${
                apiStatus === 'online' ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' :
                apiStatus === 'checking' ? 'bg-amber-400' : 'bg-red-400'
              }`} />
              {apiStatus === 'online' ? 'SYSTEM ONLINE' :
                apiStatus === 'checking' ? 'CONNECTING' : 'SYSTEM OFFLINE'}
            </div>
          </header>

          <main className="mx-auto max-w-[1500px] space-y-7 p-5 md:p-8">
            <motion.section
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-end justify-between gap-5"
            >
              <motion.div variants={fadeUp}>
                <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-green-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-300" />
                  ROOT ACCESS // THREAT INTELLIGENCE
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white md:text-4xl">
                  Phishing Detection
                  <span className="block text-green-300 matrix-heading">
                    Matrix Command Center
                  </span>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Monitor website security records, analyze suspicious
                  patterns and classify potential phishing threats.
                </p>
              </motion.div>

              {result && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetAnalysis}
                  className="flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/[0.06] px-4 py-3 text-xs font-semibold text-green-200 hover:bg-green-400/10"
                >
                  <RefreshCw size={14} />
                  New analysis
                </motion.button>
              )}
            </motion.section>

            <motion.section
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              <MetricCard
                title="Total Records"
                value={result ? total : '—'}
                description="Website records analyzed"
                icon={FileText}
                color="cyan"
              />
              <MetricCard
                title="Phishing Detected"
                value={result ? phishing : '—'}
                description="Classified as phishing"
                icon={ShieldAlert}
                color="red"
              />
              <MetricCard
                title="Legitimate"
                value={result ? legitimate : '—'}
                description="Classified as legitimate"
                icon={ShieldCheck}
                color="green"
              />
              <MetricCard
                title="Phishing Rate"
                value={result ? `${phishingPercent.toFixed(1)}%` : '—'}
                description="Share of phishing predictions"
                icon={Activity}
                color="purple"
              />
            </motion.section>

            <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="matrix-card rounded-2xl p-5 md:p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-300">
                      <ScanLine size={14} />
                      Data ingestion
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Upload Dataset
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Submit website feature records for ML analysis
                    </p>
                  </div>
                  <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-3 text-green-300">
                    <UploadCloud size={22} />
                  </div>
                </div>

                <motion.div
                  animate={{
                    borderColor: dragging ? 'rgba(57,255,20,0.95)' : 'rgba(57,255,20,0.35)',
                    backgroundColor: dragging ? 'rgba(57,255,20,0.09)' : 'rgba(0,8,2,0.82)'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    selectFile(e.dataTransfer.files?.[0])
                  }}
                  onClick={() => inputRef.current?.click()}
                  className="matrix-upload-zone relative flex min-h-[195px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-6 text-center"
                >
                  <motion.div
                    animate={loading ? { y: [-3, 3, -3] } : { y: 0 }}
                    transition={{ repeat: loading ? Infinity : 0, duration: 1.2 }}
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-300/20 bg-green-400/10 text-green-300 shadow-[0_0_30px_rgba(57,255,20,0.09)]"
                  >
                    <UploadCloud size={28} />
                  </motion.div>

                  <p className="text-sm font-bold text-white">
                    {file ? file.name : 'Drop your CSV file here'}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    or <span className="font-semibold text-green-300">browse files</span> from your device
                  </p>
                  <p className="mt-3 text-[10px] tracking-wider text-slate-600">
                    CSV FORMAT · MAXIMUM 20 MB
                  </p>

                  <input
                    ref={inputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => selectFile(e.target.files?.[0])}
                  />
                </motion.div>

                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -5 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-green-400/15 bg-green-400/[0.035] p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <FileSpreadsheet className="shrink-0 text-green-300" size={22} />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-white">{file.name}</p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {(file.size / 1024).toFixed(1)} KB · Ready for analysis
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          resetAnalysis()
                        }}
                        className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3 text-xs leading-5 text-red-300"
                    >
                      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={analyzeFile}
                  disabled={!file || loading || apiStatus !== 'online'}
                  className="matrix-button mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black tracking-wide text-[#001800] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" size={18} />
                      ANALYZING DATASET...
                    </>
                  ) : (
                    <>
                      <Zap size={17} />
                      EXECUTE THREAT SCAN
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>

                {loading && (
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-[10px] text-green-300">
                      <span>PROCESSING DATA</span>
                      <span className="animate-pulse">RUNNING</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-slate-800">
                      <div className="matrix-progress h-full w-1/3 rounded-full bg-green-300" />
                    </div>
                  </div>
                )}

                <p className="mt-3 text-center text-[10px] text-slate-600">
                  Connected to configured FastAPI prediction service
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="matrix-card rounded-2xl p-5 md:p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-300">
                      <Activity size={14} />
                      Threat analytics
                    </div>
                    <h3 className="text-lg font-bold text-white">Detection Summary</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Prediction distribution
                    </p>
                  </div>
                  <Activity className="text-green-300" size={20} />
                </div>

                {result ? (
                  <>
                    <div className="mb-7 flex justify-center">
                      <div
                        className="relative flex h-44 w-44 items-center justify-center rounded-full"
                        style={{
                          background: `conic-gradient(#fb7185 0% ${phishingPercent}%, #34d399 ${phishingPercent}% 100%)`
                        }}
                      >
                        <div className="absolute inset-[9px] rounded-full bg-[#020a03]" />
                        <div className="relative text-center">
                          <p className="text-4xl font-black text-white">{total}</p>
                          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-500">
                            Total records
                          </p>
                        </div>
                      </div>
                    </div>
                    <SummaryLine
                      label="Phishing"
                      value={phishing}
                      percentage={phishingPercent}
                      color="bg-rose-400"
                    />
                    <SummaryLine
                      label="Legitimate"
                      value={legitimate}
                      percentage={legitimatePercent}
                      color="bg-emerald-400"
                    />
                  </>
                ) : (
                  <div className="flex min-h-[235px] flex-col items-center justify-center text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                      className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-green-400/30"
                    >
                      <Shield className="text-green-400/70" size={34} />
                    </motion.div>
                    <p className="text-sm font-semibold text-slate-300">
                      Awaiting incoming data
                    </p>
                    <p className="mt-2 max-w-[220px] text-xs leading-5 text-slate-500">
                      Run an analysis to visualize your classification results.
                    </p>
                  </div>
                )}
              </motion.div>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="matrix-card overflow-hidden rounded-2xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] p-5 md:p-6">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-300">
                    <Database size={14} />
                    Intelligence records
                  </div>
                  <h3 className="text-lg font-bold text-white">Prediction Results</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {result
                      ? `${filteredRows.length} matching records`
                      : 'Classification records will appear here'}
                  </p>
                </div>

                {result && (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={downloadReport}
                    className="flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/[0.05] px-4 py-2.5 text-xs font-bold text-green-200 hover:bg-green-400/10"
                  >
                    <ArrowDownToLine size={15} />
                    EXPORT REPORT
                  </motion.button>
                )}
              </div>

              {result ? (
                <>
                  <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                      <input
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value)
                          setPage(1)
                        }}
                        placeholder="Search feature values..."
                        className="w-full rounded-xl border border-white/10 bg-[#020603] py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-green-400/50"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        ['all', 'All records'],
                        ['phishing', 'Phishing'],
                        ['legitimate', 'Legitimate']
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => {
                            setFilter(value)
                            setPage(1)
                          }}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            filter === value
                              ? 'border border-green-400/20 bg-green-400/10 text-green-200'
                              : 'border border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-xs">
                      <thead className="bg-[#020603] text-[10px] uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-5 py-4">Record</th>
                          {columns.filter((c) => c !== 'predicted_column').map((column) => (
                            <th key={column} className="px-4 py-4">{column}</th>
                          ))}
                          <th className="px-5 py-4">Classification</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.map((row, index) => (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.025 }}
                            key={`${(currentPage - 1) * PAGE_SIZE + index}`}
                            className="border-t border-white/[0.045] transition hover:bg-green-400/[0.025]"
                          >
                            <td className="px-5 py-4 font-semibold text-slate-400">
                              #{(currentPage - 1) * PAGE_SIZE + index + 1}
                            </td>
                            {columns.filter((c) => c !== 'predicted_column').map((column) => (
                              <td key={column} className="px-4 py-4 text-slate-400">
                                {String(row[column] ?? '—')}
                              </td>
                            ))}
                            <td className="px-5 py-4">
                              {Number(row.predicted_column) === 1 ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/[0.07] px-2.5 py-1.5 font-semibold text-rose-300">
                                  <ShieldAlert size={13} />
                                  Phishing
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1.5 font-semibold text-emerald-300">
                                  <ShieldCheck size={13} />
                                  Legitimate
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>

                    {visibleRows.length === 0 && (
                      <div className="p-12 text-center text-sm text-slate-500">
                        No matching records found.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-4">
                    <p className="text-xs text-slate-500">
                      Showing {filteredRows.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, filteredRows.length)} of {filteredRows.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-lg border border-white/10 p-2 text-slate-400 hover:border-green-400/30 disabled:opacity-30"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="px-2 text-xs text-slate-400">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-lg border border-white/10 p-2 text-slate-400 hover:border-green-400/30 disabled:opacity-30"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
                  <FileText className="mb-4 text-slate-600" size={30} />
                  <p className="text-sm font-semibold text-slate-300">
                    No prediction results yet
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Upload a CSV dataset to begin your analysis.
                  </p>
                </div>
              )}
            </motion.section>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-green-400/[0.08] py-5 text-[10px] tracking-wide text-slate-600">
              <span>MATRIX // NETWORK SECURITY INTELLIGENCE</span>
              <span className="flex items-center gap-2">
                <LockKeyhole size={12} />
                ML classification · Predictions are not security guarantees
              </span>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}
