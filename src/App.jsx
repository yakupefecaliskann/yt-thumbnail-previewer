import { useState, useEffect, memo } from 'react'
import { Moon, Sun, Monitor, LayoutList, Upload, Info, Coffee, Menu, X } from 'lucide-react'

// Memoized VideoCard to prevent unnecessary re-renders when sidebar inputs change
const VideoCard = memo(({ thumbnail, label, title, channelName, views, timeAgo, duration }) => (
  <div className="flex flex-col gap-3 group cursor-pointer w-full sm:w-[360px]">
    <div className="relative w-full aspect-video bg-gray-200 dark:bg-[#202020] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      {thumbnail ? (
        <img src={thumbnail} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-[#202020]">
          <Upload size={24} className="mb-2 opacity-50" />
          <span className="text-sm opacity-80 mb-1">Upload {label}</span>
          <span className="text-xs opacity-50">to preview</span>
        </div>
      )}
      <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
        {duration || '0:00'}
      </div>
    </div>

    <div className="flex gap-3 pr-2 sm:pr-6">
      <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0 mt-0.5"></div>
      <div className="flex flex-col min-w-0">
        <h3 className="text-[16px] font-medium leading-[22px] line-clamp-2 mb-1 text-youtube-lightText dark:text-youtube-darkText break-words">{title || 'Video Title'}</h3>
        <div className="text-[14px] text-youtube-lightSecondary dark:text-youtube-darkSecondary flex flex-col leading-[20px]">
          <span className="hover:text-youtube-lightText dark:hover:text-white transition-colors truncate">{channelName || 'Channel Name'}</span>
          <div className="flex items-center gap-1 text-xs sm:text-sm flex-wrap">
            <span>{views || '0'} views</span>
            <span className="text-[10px]">•</span>
            <span>{timeAgo || 'Just now'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
))

// Memoized SuggestedCard
const SuggestedCard = memo(({ thumbnail, label, title, channelName, views, timeAgo, duration }) => (
  <div className="flex flex-col sm:flex-row gap-2 group cursor-pointer w-full sm:w-[400px]">
    <div className="relative w-full sm:w-[168px] flex-shrink-0 aspect-video bg-gray-200 dark:bg-[#202020] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      {thumbnail ? (
        <img src={thumbnail} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 font-medium text-xs text-center p-2 bg-gray-100 dark:bg-[#202020]">
          <Upload size={16} className="mb-1 opacity-50" />
          <span className="opacity-80">Upload {label}</span>
        </div>
      )}
      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-medium px-1 py-0.5 rounded">
        {duration || '0:00'}
      </div>
    </div>

    <div className="flex flex-col py-0.5 pr-2 min-w-0 mt-2 sm:mt-0">
      <h3 className="text-[14px] font-medium leading-[20px] line-clamp-2 mb-1 text-youtube-lightText dark:text-youtube-darkText break-words">{title || 'Video Title'}</h3>
      <div className="text-[12px] text-youtube-lightSecondary dark:text-youtube-darkSecondary flex flex-col leading-[18px]">
        <span className="hover:text-youtube-lightText dark:hover:text-white transition-colors truncate">{channelName || 'Channel Name'}</span>
        <div className="flex items-center gap-1 flex-wrap">
          <span>{views || '0'} views</span>
          <span className="text-[10px]">•</span>
          <span>{timeAgo || 'Just now'}</span>
        </div>
      </div>
    </div>
  </div>
))

function App() {
  // Check system preference for initial state
  const [darkMode, setDarkMode] = useState(() => {
    // Check if window exists (for SSR safety, though this is client-side Vite)
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark if undefined
  })

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [title, setTitle] = useState('My Awesome Video Title That Might Be Long')
  const [channelName, setChannelName] = useState('My Channel')
  const [views, setViews] = useState('120K')
  const [timeAgo, setTimeAgo] = useState('2 weeks ago')
  const [duration, setDuration] = useState('10:30')
  const [thumbnailA, setThumbnailA] = useState(null)
  const [thumbnailB, setThumbnailB] = useState(null)
  const [viewMode, setViewMode] = useState('home')

  // Apply dark class to body and listen for system preference changes
  useEffect(() => {
    // Apply class
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  // Listen for system theme changes specifically
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      setDarkMode(e.matches)
    }

    // Add listener
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Secure image upload handler (limit size and type)
  const handleImageUpload = (e, setThumbnail) => {
    const file = e.target.files[0]
    if (!file) return

    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please upload an image smaller than 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnail(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Prevent direct XSS injection in inputs by removing angle brackets (basic sanitization)
  const sanitizeInput = (value) => value.replace(/[<>]/g, '')

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#080808] font-['Roboto',sans-serif]">
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-[#1a1a1a] rounded-full shadow-md border border-gray-200 dark:border-gray-800"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {mobileMenuOpen ? <X size={20} className="text-gray-800 dark:text-gray-200" /> : <Menu size={20} className="text-gray-800 dark:text-gray-200" />}
      </button>

      {/* Sidebar Controls - Made responsive */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-[280px] sm:w-80 h-full flex flex-col overflow-y-auto 
        backdrop-blur-xl bg-white/95 dark:bg-[#121212]/95 border-r border-slate-200/50 dark:border-[#2a2a2a]/50 p-6 
        shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        <div className="flex items-center justify-between mb-6 shrink-0 mt-8 lg:mt-0">
          <h1 className="font-bold text-xl flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <span className="w-7 h-7 rounded-lg bg-red-600 shadow-red-500/20 shadow-lg flex items-center justify-center text-white text-xs font-black tracking-tighter">
              YT
            </span>
            A/B Tester
          </h1>
          <button onClick={() => setDarkMode(!darkMode)} aria-label="Toggle Dark Mode" className="p-2 rounded-full bg-slate-200/50 dark:bg-[#2a2a2a]/50 hover:bg-slate-300/50 dark:hover:bg-[#3a3a3a]/50 transition-all text-slate-700 dark:text-slate-300">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="space-y-4 shrink-0">
          <h2 className="font-semibold text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-[#2a2a2a]/50 pb-2">
            Video Details
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Video Title</label>
            <textarea maxLength={100} value={title} onChange={(e) => setTitle(sanitizeInput(e.target.value))} className="p-2.5 text-sm rounded-lg bg-white/50 dark:bg-[#1a1a1a]/50 border border-slate-200/50 dark:border-[#333]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500" rows="2" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Channel Name</label>
            <input type="text" maxLength={50} value={channelName} onChange={(e) => setChannelName(sanitizeInput(e.target.value))} className="p-2.5 text-sm rounded-lg bg-white/50 dark:bg-[#1a1a1a]/50 border border-slate-200/50 dark:border-[#333]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800 dark:text-slate-200" />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 w-1/2">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Views</label>
              <input type="text" maxLength={15} value={views} onChange={(e) => setViews(sanitizeInput(e.target.value))} className="p-2.5 text-sm rounded-lg bg-white/50 dark:bg-[#1a1a1a]/50 border border-slate-200/50 dark:border-[#333]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800 dark:text-slate-200" />
            </div>
            <div className="flex flex-col gap-1.5 w-1/2">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Time Ago</label>
              <input type="text" maxLength={20} value={timeAgo} onChange={(e) => setTimeAgo(sanitizeInput(e.target.value))} className="p-2.5 text-sm rounded-lg bg-white/50 dark:bg-[#1a1a1a]/50 border border-slate-200/50 dark:border-[#333]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800 dark:text-slate-200" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Duration</label>
            <input type="text" maxLength={10} value={duration} onChange={(e) => setDuration(sanitizeInput(e.target.value))} placeholder="e.g. 10:30" className="p-2.5 text-sm rounded-lg bg-white/50 dark:bg-[#1a1a1a]/50 border border-slate-200/50 dark:border-[#333]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800 dark:text-slate-200" />
          </div>
        </div>

        <div className="space-y-4 pt-6 shrink-0">
          <h2 className="font-semibold text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-[#2a2a2a]/50 pb-2">
            Upload Thumbnails
          </h2>

          <div className="flex flex-col gap-2 relative group">
            <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl blur-lg transition-all group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20 pointer-events-none"></div>
            <div className="relative p-3 rounded-xl border border-blue-200/50 dark:border-blue-900/50 bg-white/40 dark:bg-[#1a1a1a]/40">
              <label className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">
                <span>OPTION A</span>
                {thumbnailA && <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px]">Loaded</span>}
              </label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setThumbnailA)} className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-500/10 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-500/20 cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-2 relative group mt-2">
            <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl blur-lg transition-all group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 pointer-events-none"></div>
            <div className="relative p-3 rounded-xl border border-emerald-200/50 dark:border-emerald-900/50 bg-white/40 dark:bg-[#1a1a1a]/40">
              <label className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                <span>OPTION B</span>
                {thumbnailB && <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px]">Loaded</span>}
              </label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setThumbnailB)} className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-500/10 dark:file:text-emerald-300 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-500/20 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 pb-2 shrink-0 border-t border-slate-200/50 dark:border-[#2a2a2a]/50">
          <a href="https://buymeacoffee.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#FFDD00]/10 hover:bg-[#FFDD00]/20 text-yellow-700 dark:text-yellow-500 font-medium text-sm transition-colors border border-[#FFDD00]/20">
            <Coffee size={16} />
            Buy me a coffee
          </a>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Preview Area */}
      <main className="flex-1 bg-youtube-lightBg dark:bg-youtube-darkBg flex flex-col relative overflow-hidden w-full">
        {/* Top Navbar */}
        <div className="h-16 flex-shrink-0 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-8 bg-youtube-lightCard dark:bg-youtube-darkCard z-10 w-full overflow-x-auto">
          <div className="flex bg-gray-100 dark:bg-[#121212] p-1 rounded-lg border border-gray-200 dark:border-gray-800 shrink-0">
            <button
              onClick={() => setViewMode('home')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${viewMode === 'home' ? 'bg-white dark:bg-[#272727] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <Monitor size={16} /> <span className="hidden sm:inline">Home Grid</span>
            </button>
            <button
              onClick={() => setViewMode('suggested')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${viewMode === 'suggested' ? 'bg-white dark:bg-[#272727] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <LayoutList size={16} /> <span className="hidden sm:inline">Suggested List</span>
            </button>
          </div>

          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 ml-4 shrink-0">
            <Info size={14} className="hidden sm:block" />
            <span className="hidden xl:inline">Previews match actual YouTube dimensions</span>
          </div>
        </div>

        {/* Scrollable Context */}
        <div className="flex-1 overflow-y-auto w-full">
          {/* Hero Section */}
          <div className="w-full bg-gradient-to-b from-blue-50/50 to-transparent dark:from-white/[0.02] dark:to-transparent border-b border-gray-100 dark:border-gray-800/10 py-8 sm:py-12 px-4 sm:px-8 flex justify-center mt-8 lg:mt-0">
            <div className="max-w-5xl w-full flex flex-col items-center text-center">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-xs font-bold tracking-wider mb-4 uppercase">Free Tool</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Test your thumbnails before publishing
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl px-4">
                Compare A/B thumbnail designs and titles in a realistic YouTube environment. Maximize your Click-Through Rate (CTR) by picking the winning combination.
              </p>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="p-4 sm:p-8 w-full flex justify-center pb-24">
            <div className="max-w-5xl w-full">
              <div className="flex items-center mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mr-4 sm:mr-6 whitespace-nowrap">A/B Comparison</h3>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800 mr-4 sm:mr-6"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{viewMode === 'home' ? 'Homepage View' : 'Sidebar View'}</span>
              </div>

              <div className="flex flex-wrap gap-x-8 lg:gap-x-12 gap-y-12 sm:gap-y-16 justify-center lg:justify-start">
                {/* Option A Section */}
                <div className="flex flex-col gap-4 w-full lg:w-auto items-center lg:items-start">
                  <div className="flex items-center pl-3 relative w-full before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500 before:rounded-full">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">OPTION A</span>
                  </div>
                  {viewMode === 'home' ? (
                    <VideoCard thumbnail={thumbnailA} label="Option A" title={title} channelName={channelName} views={views} timeAgo={timeAgo} duration={duration} />
                  ) : (
                    <SuggestedCard thumbnail={thumbnailA} label="Option A" title={title} channelName={channelName} views={views} timeAgo={timeAgo} duration={duration} />
                  )}
                </div>

                {/* Option B Section */}
                <div className="flex flex-col gap-4 w-full lg:w-auto items-center lg:items-start">
                  <div className="flex items-center pl-3 relative w-full before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-500 before:rounded-full">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">OPTION B</span>
                  </div>
                  {viewMode === 'home' ? (
                    <VideoCard thumbnail={thumbnailB} label="Option B" title={title} channelName={channelName} views={views} timeAgo={timeAgo} duration={duration} />
                  ) : (
                    <SuggestedCard thumbnail={thumbnailB} label="Option B" title={title} channelName={channelName} views={views} timeAgo={timeAgo} duration={duration} />
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
