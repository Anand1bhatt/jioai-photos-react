import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  en: {
    lang: {
      title:    'Make your photos look new and better',
      subtitle: 'Try something new, improve your photos, and share them easily.',
      choose:   'Choose your language',
      continue: 'Continue',
    },
    signin: {
      title:       'Sign in',
      subtitle:    'Make new photos or improve your old ones.',
      phoneLabel:  'Enter your phone number',
      terms:       ['By continuing, you agree to our ', 'Terms & Conditions', ' and ', 'Privacy Policy', '.'],
      getOtp:      'Get OTP',
      sending:     'Sending OTP…',
    },
    otp: {
      title:      'Verify your mobile number',
      subtitle:   'Enter the OTP sent to',
      change:     'Change my number',
      label:      'OTP number',
      requestIn:  n => `Request OTP in ${n} secs`,
      resend:     'Resend OTP',
      terms:      ['By continuing, you agree to our ', 'Terms & Conditions', ' and ', 'Privacy Policy', '.'],
      submit:     'Submit',
      verifying:  'Verifying…',
    },
    carousel: {
      skip: 'Skip',
      slides: [
        { title: 'Make new photos and improve your old ones',   desc: 'Do it in seconds with AI.',                                        cta: 'Try Now'    },
        { title: 'See your photos and videos as a slideshow',   desc: 'They come together so you can watch and share anytime.',           cta: 'Try Now'    },
        { title: 'Make photos for any moment',                  desc: 'For birthdays, festivals, and more in seconds.',                   cta: 'Try Now'    },
        { title: 'Get more storage with family',                desc: 'Invite your family and get more than 5GB storage.',               cta: 'Invite Now' },
      ],
    },
    perm1: {
      title:      '"JioAI Photos" Would Like to Access Your Photo Library',
      body:       'This lets you securely backup photos and videos to JioAI Photos',
      count:      '3,055 Photos, 381 Videos',
      countBody:  'Photos may contain data associated with location, depth information, captions, and audio.',
      limit:      'Limit Access…',
      allow:      'Allow Full Access',
      deny:       "Don't Allow",
    },
    perm2: {
      title: '"JioAI Photos" Would Like To Send You Notifications',
      body:  'Notifications may include alerts, sounds and icon badges. These can be configured in Settings.',
      deny:  "Don't Allow",
      allow: 'Allow',
    },
    done: {
      title: "You're all set!",
      desc:  'JioAI Photos is ready to make your memories shine.',
      start: 'Get Started',
    },
  },

  hi: {
    lang: {
      title:    'अपनी फ़ोटो को नई और बेहतर बनाएं',
      subtitle: 'कुछ नया आज़माएं, अपनी फ़ोटो सुधारें और आसानी से शेयर करें।',
      choose:   'अपनी भाषा चुनें',
      continue: 'जारी रखें',
    },
    signin: {
      title:       'साइन इन करें',
      subtitle:    'नई फ़ोटो बनाएं या पुरानी सुधारें।',
      phoneLabel:  'अपना फ़ोन नंबर दर्ज करें',
      terms:       ['जारी रखकर आप हमारी ', 'नियम एवं शर्तें', ' और ', 'गोपनीयता नीति', ' से सहमत हैं।'],
      getOtp:      'OTP प्राप्त करें',
      sending:     'OTP भेजा जा रहा है…',
    },
    otp: {
      title:      'अपना मोबाइल नंबर सत्यापित करें',
      subtitle:   'भेजे गए OTP दर्ज करें',
      change:     'नंबर बदलें',
      label:      'OTP नंबर',
      requestIn:  n => `${n} सेकंड में OTP मंगाएं`,
      resend:     'OTP दोबारा भेजें',
      terms:      ['जारी रखकर आप हमारी ', 'नियम एवं शर्तें', ' और ', 'गोपनीयता नीति', ' से सहमत हैं।'],
      submit:     'सबमिट करें',
      verifying:  'सत्यापित हो रहा है…',
    },
    carousel: {
      skip: 'छोड़ें',
      slides: [
        { title: 'नई फ़ोटो बनाएं और पुरानी सुधारें',            desc: 'AI से सेकंडों में करें।',                                               cta: 'अभी आज़माएं'     },
        { title: 'अपनी फ़ोटो और वीडियो स्लाइडशो में देखें',    desc: 'वे एक साथ आते हैं ताकि आप कभी भी देख और शेयर कर सकें।',              cta: 'अभी आज़माएं'     },
        { title: 'हर पल के लिए फ़ोटो बनाएं',                  desc: 'जन्मदिन, त्योहारों और अधिक के लिए सेकंडों में।',                       cta: 'अभी आज़माएं'     },
        { title: 'परिवार के साथ अधिक स्टोरेज पाएं',           desc: 'परिवार को आमंत्रित करें और 5GB से अधिक स्टोरेज पाएं।',                cta: 'अभी आमंत्रित करें' },
      ],
    },
    perm1: {
      title:      '"JioAI Photos" आपकी फ़ोटो लाइब्रेरी एक्सेस करना चाहता है',
      body:       'इससे आप अपनी फ़ोटो और वीडियो JioAI Photos पर सुरक्षित रूप से बैकअप कर सकते हैं',
      count:      '3,055 फ़ोटो, 381 वीडियो',
      countBody:  'फ़ोटो में स्थान, गहराई जानकारी, कैप्शन और ऑडियो से जुड़ा डेटा हो सकता है।',
      limit:      'सीमित एक्सेस…',
      allow:      'पूर्ण एक्सेस दें',
      deny:       'अनुमति नहीं',
    },
    perm2: {
      title: '"JioAI Photos" आपको नोटिफ़िकेशन भेजना चाहता है',
      body:  'नोटिफ़िकेशन में अलर्ट, ध्वनि और आइकन बैज हो सकते हैं। इन्हें सेटिंग में बदला जा सकता है।',
      deny:  'अनुमति नहीं',
      allow: 'अनुमति दें',
    },
    done: {
      title: 'आप तैयार हैं!',
      desc:  'JioAI Photos आपकी यादों को चमकाने के लिए तैयार है।',
      start: 'शुरू करें',
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// FIGMA ASSET URLS
// ─────────────────────────────────────────────────────────────────────────────
const ASSETS = {
  ribbon:     'https://www.figma.com/api/mcp/asset/1000da3d-0e37-403d-939b-b2f46dd68568',
  langCollage:'https://www.figma.com/api/mcp/asset/45e4141b-08fd-4b67-8808-8491bada65f5',
  permPhotos: 'https://www.figma.com/api/mcp/asset/75340348-df1a-4a9c-a69a-0e0af58c4164',
  slide1:     'https://www.figma.com/api/mcp/asset/dbd4be3b-cc6a-4728-aa32-8f83d1703ab4',
  slide2:     'https://www.figma.com/api/mcp/asset/528d294e-c440-49c4-8c6c-691ed37356ed',
  slide3:     'https://www.figma.com/api/mcp/asset/b2b3b00c-e23e-4652-8394-7098cf49c6cd',
  slide4:     'https://www.figma.com/api/mcp/asset/81b7aa96-f326-4444-a6a9-eb62b09ee8a8',
}
const SLIDE_IMGS = [ASSETS.slide1, ASSETS.slide2, ASSETS.slide3, ASSETS.slide4]

// ─────────────────────────────────────────────────────────────────────────────
// TINY SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const TEAL  = '#278bc1'
const BG    = '#001d2e'
const BG2   = '#000f1a'

function ChevronRight({ color = 'white', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function JioMark({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, background: TEAL,
      borderRadius: '50%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ color: 'white', fontSize: size * 0.34, fontWeight: 900, letterSpacing: '-0.3px' }}>
        jio
      </span>
    </div>
  )
}

function TermsText({ parts }) {
  return (
    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.77)', lineHeight: 1.5 }}>
      {parts[0]}
      <strong style={{ fontWeight: 700, color: 'white' }}>{parts[1]}</strong>
      {parts[2]}
      <strong style={{ fontWeight: 700, color: 'white' }}>{parts[3]}</strong>
      {parts[4]}
    </p>
  )
}

function StatusBar() {
  const fmt = () => {
    const d = new Date()
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 50,
      zIndex: 150, pointerEvents: 'none',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '0 24px 10px',
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0"    y="8"   width="3" height="4"   rx="0.5" fill="white" />
          <rect x="4.5"  y="5.5" width="3" height="6.5" rx="0.5" fill="white" />
          <rect x="9"    y="3"   width="3" height="9"   rx="0.5" fill="white" />
          <rect x="13.5" y="0"   width="3" height="12"  rx="0.5" fill="white" />
        </svg>
        {/* Wifi */}
        <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
          <path d="M8.5 10.5C9.05 10.5 9.5 10.95 9.5 11.5C9.5 12.05 9.05 12.5 8.5 12.5C7.95 12.5 7.5 12.05 7.5 11.5C7.5 10.95 7.95 10.5 8.5 10.5Z" fill="white"/>
          <path d="M8.5 7.5C9.8 7.5 10.96 8.06 11.78 8.94L13.2 7.52C12 6.35 10.34 5.6 8.5 5.6C6.66 5.6 5 6.35 3.8 7.52L5.22 8.94C6.04 8.06 7.2 7.5 8.5 7.5Z" fill="white"/>
          <path d="M8.5 4.5C10.63 4.5 12.56 5.35 13.97 6.74L15.39 5.32C13.6 3.55 11.18 2.5 8.5 2.5C5.82 2.5 3.4 3.55 1.61 5.32L3.03 6.74C4.44 5.35 6.37 4.5 8.5 4.5Z" fill="white"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/>
          <rect x="2"   y="2"   width="17" height="8"  rx="2"   fill="white"/>
          <path d="M23 4v4c.8-.4 1.5-1.1 1.5-2s-.7-1.6-1.5-2z" fill="white" opacity="0.4"/>
        </svg>
      </div>
    </div>
  )
}

// Focusable text input with focus ring
function PhoneInput({ value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="tel" inputMode="numeric"
      value={value}
      onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
      placeholder="XXXXXXXXXX"
      maxLength={10}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        flex: 1, height: 48, background: 'transparent',
        border: `1px solid ${focused ? TEAL : 'rgba(255,255,255,0.77)'}`,
        borderRadius: 8, padding: '0 17px', fontSize: 14, color: 'white',
        outline: 'none', caretColor: TEAL,
        boxShadow: focused ? '0 0 0 3px rgba(39,139,193,0.2)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    />
  )
}

// Pill button
function PillBtn({ children, onClick, disabled, loading, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%', height: 48,
        background: loading
          ? 'linear-gradient(90deg, #1e7aaa 0%, #278bc1 50%, #1e7aaa 100%)'
          : TEAL,
        backgroundSize: loading ? '400px 100%' : undefined,
        animation:      loading ? 'shimmer 1.2s linear infinite' : undefined,
        color: 'white', border: 'none', borderRadius: 9999,
        fontSize: 18, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'opacity 0.2s, transform 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// iOS-style permission dialog
function IosAlert({ children, visible }) {
  if (!visible) return null
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(12,13,16,0.78)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: 270, background: 'rgba(217,217,217,0.95)',
        backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)',
        borderRadius: 14, overflow: 'hidden',
        animation: 'alertIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [lang, setLang]               = useState('en')
  const [phone, setPhone]             = useState('')
  const [otp, setOtp]                 = useState('')
  const [otpTimer, setOtpTimer]       = useState(29)
  const [otpCanResend, setOtpCanResend] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [perm1, setPerm1]             = useState(false)
  const [perm2, setPerm2]             = useState(false)
  const [signinLoading, setSigninLoading] = useState(false)
  const [otpLoading, setOtpLoading]   = useState(false)
  const [doneVisible, setDoneVisible] = useState(false)
  const [touchStart, setTouchStart]   = useState(0)

  // ── Refs ───────────────────────────────────────────────────────────────────
  const splashRef   = useRef(null)
  const langRef     = useRef(null)
  const signinRef   = useRef(null)
  const otpRef      = useRef(null)
  const carouselRef = useRef(null)
  const doneRef     = useRef(null)
  const screenIdRef = useRef('splash')   // tracks current screen id without stale closure
  const otpTimerRef = useRef(null)

  const REFS = {
    splash:   splashRef,
    language: langRef,
    signin:   signinRef,
    otp:      otpRef,
    carousel: carouselRef,
    done:     doneRef,
  }

  const t = T[lang]

  // ── Navigation (DOM-based transition, identical to HTML version) ───────────
  const goTo = useCallback((nextId) => {
    const currentId = screenIdRef.current
    if (nextId === currentId) return
    const currentEl = REFS[currentId]?.current
    const nextEl    = REFS[nextId]?.current
    if (!nextEl) return

    // Snap next screen to starting position
    nextEl.style.transition  = 'none'
    nextEl.style.transform   = 'translateX(100%)'
    nextEl.style.opacity     = '0'
    nextEl.style.pointerEvents = 'none'
    void nextEl.offsetWidth  // force reflow

    // Slide current out
    if (currentEl) {
      currentEl.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease'
      currentEl.style.transform  = 'translateX(-30%)'
      currentEl.style.opacity    = '0'
      currentEl.style.pointerEvents = 'none'
      setTimeout(() => {
        if (currentEl) {
          currentEl.style.transition = 'none'
          currentEl.style.transform  = 'translateX(100%)'
        }
      }, 460)
    }

    // Slide next in
    nextEl.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease'
    requestAnimationFrame(() => {
      nextEl.style.transform     = 'translateX(0)'
      nextEl.style.opacity       = '1'
      nextEl.style.pointerEvents = 'auto'
    })

    screenIdRef.current = nextId

    // Screen-specific entry
    if (nextId === 'otp') {
      startOtpTimer()
      setTimeout(() => document.getElementById('otp-single')?.focus(), 550)
    }
    if (nextId === 'carousel') setCarouselIdx(0)
    if (nextId === 'done') {
      setDoneVisible(false)
      setTimeout(() => setDoneVisible(true), 200)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── OTP timer ─────────────────────────────────────────────────────────────
  const startOtpTimer = useCallback(() => {
    clearInterval(otpTimerRef.current)
    setOtpTimer(29)
    setOtpCanResend(false)
    otpTimerRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(otpTimerRef.current)
          setOtpCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // ── Initial screen positioning (before first paint) ──────────────────────
  useLayoutEffect(() => {
    [langRef, signinRef, otpRef, carouselRef, doneRef].forEach(ref => {
      const el = ref.current
      if (!el) return
      el.style.transform     = 'translateX(100%)'
      el.style.opacity       = '0'
      el.style.pointerEvents = 'none'
    })
  }, [])

  // ── Splash auto-advance ────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => goTo('language'), 2800)
    const splash = splashRef.current
    const onClick = () => goTo('language')
    splash?.addEventListener('click', onClick)
    return () => {
      clearTimeout(timer)
      splash?.removeEventListener('click', onClick)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => clearInterval(otpTimerRef.current), [])

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleGetOtp() {
    if (phone.length < 10) return
    setSigninLoading(true)
    setTimeout(() => { setSigninLoading(false); goTo('otp') }, 1400)
  }

  function handleSubmitOtp() {
    if (otp.length < 4) return
    setOtpLoading(true)
    setTimeout(() => { setOtpLoading(false); setPerm1(true) }, 1200)
  }

  function handlePerm1() {
    setPerm1(false)
    setTimeout(() => setPerm2(true), 300)
  }

  function handlePerm2() {
    setPerm2(false)
    clearInterval(otpTimerRef.current)
    setTimeout(() => goTo('carousel'), 300)
  }

  function handleNext() {
    if (carouselIdx < 3) setCarouselIdx(i => i + 1)
    else goTo('done')
  }

  function handleResendOtp() {
    if (!otpCanResend) return
    setOtp('')
    startOtpTimer()
    setTimeout(() => document.getElementById('otp-single')?.focus(), 100)
  }

  function handleRestart() {
    clearInterval(otpTimerRef.current)
    setPhone(''); setOtp(''); setLang('en')
    setCarouselIdx(0); setOtpCanResend(false)
    setSigninLoading(false); setOtpLoading(false)
    setPerm1(false); setPerm2(false)

    Object.values(REFS).forEach(r => {
      const el = r.current
      if (el) {
        el.style.transition = 'none'
        el.style.transform  = 'translateX(100%)'
        el.style.opacity    = '0'
        el.style.pointerEvents = 'none'
      }
    })
    const splash = splashRef.current
    if (splash) {
      splash.style.transform = 'translateX(0)'
      splash.style.opacity   = '1'
      splash.style.pointerEvents = 'auto'
    }
    screenIdRef.current = 'splash'
    setTimeout(() => goTo('language'), 2400)
  }

  // Swipe for carousel
  const onTouchStart = e => setTouchStart(e.touches[0].clientX)
  const onTouchEnd   = e => {
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && carouselIdx < 3) setCarouselIdx(i => i + 1)
      else if (diff < 0 && carouselIdx > 0) setCarouselIdx(i => i - 1)
    }
  }

  // Derive helpers
  const phoneOk  = phone.length === 10
  const otpOk    = otp.length >= 4
  const slide    = t.carousel.slides[carouselIdx]

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* ── Phone frame ── */}
      <div style={{
        position: 'relative', width: 390, height: 844, flexShrink: 0,
        background: '#111', borderRadius: 52,
        border: '8px solid #1c1c1e',
        boxShadow: '0 0 0 1px #2c2c2e, inset 0 0 0 1.5px #000, 0 40px 100px rgba(0,0,0,0.9)',
        overflow: 'hidden',
      }}>
        {/* Side buttons */}
        <div style={{ position:'absolute', left:-10, top:120, width:4, height:70, background:'#2a2a2a', borderRadius:'2px 0 0 2px', boxShadow:'0 80px 0 #2a2a2a, 0 150px 0 #2a2a2a' }} />
        <div style={{ position:'absolute', right:-10, top:160, width:4, height:90, background:'#2a2a2a', borderRadius:'0 2px 2px 0' }} />

        {/* Notch */}
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:126, height:37, background:'#000', borderRadius:'0 0 22px 22px', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:12, height:12, background:'#1a1a1a', borderRadius:'50%', border:'2px solid #222' }} />
        </div>

        {/* Home indicator */}
        <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', width:130, height:5, background:'rgba(255,255,255,0.3)', borderRadius:3, zIndex:300 }} />

        {/* Status bar (always on top) */}
        <StatusBar />

        {/* ════ Screen stack ════ */}
        <div style={{ position:'absolute', inset:0 }}>

          {/* ── 1. SPLASH ── */}
          <div ref={splashRef} style={{ position:'absolute', inset:0, background:'#0078ad' }}>
            <div style={{ position:'absolute', top:299, left:0, width:'100%', height:203, overflow:'hidden' }}>
              <img
                src={ASSETS.ribbon} alt=""
                style={{ position:'absolute', width:'181.77%', height:'56.65%', left:'-40.88%', top:'21.67%', maxWidth:'none', display:'block' }}
              />
            </div>
          </div>

          {/* ── 2. LANGUAGE ── */}
          <div ref={langRef} style={{ position:'absolute', inset:0, background:BG }}>
            {/* Header */}
            <div style={{ position:'absolute', top:68, left:0, right:0, padding:'10px 24px 0', textAlign:'center' }}>
              <h1 style={{ fontSize:28, fontWeight:900, color:'white', lineHeight:1.15 }}>{t.lang.title}</h1>
              <p style={{ marginTop:8, fontSize:14, color:'rgba(255,255,255,0.8)', lineHeight:1.5 }}>{t.lang.subtitle}</p>
            </div>
            {/* Photo collage */}
            <div style={{ position:'absolute', top:199, left:0, right:0, height:371, overflow:'hidden' }}>
              <img src={ASSETS.langCollage} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            {/* Gradient fade */}
            <div style={{ position:'absolute', top:460, left:0, right:0, height:80, background:'linear-gradient(to bottom,transparent,#001d2e)', pointerEvents:'none', zIndex:1 }} />
            {/* Bottom sheet */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 24px 40px', display:'flex', flexDirection:'column', gap:16, background:BG, borderRadius:'32px 32px 0 0', zIndex:2 }}>
              <p style={{ fontSize:14, fontWeight:500, color:'white' }}>{t.lang.choose}</p>
              <div style={{ display:'flex', gap:12 }}>
                {(['en', 'hi']).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    flex:1, padding:'28px 24px', borderRadius:12,
                    background: lang === l ? BG : 'transparent',
                    border: lang === l ? '1px solid white' : '1px solid rgba(39,139,193,0.4)',
                    color:'white', fontSize:20, fontWeight:900, cursor:'pointer',
                    transition:'all 0.2s',
                  }}>
                    {l === 'en' ? 'English' : 'हिन्दी'}
                  </button>
                ))}
              </div>
              <PillBtn onClick={() => goTo('signin')}>{t.lang.continue}</PillBtn>
            </div>
          </div>

          {/* ── 3. SIGN IN ── */}
          <div ref={signinRef} style={{ position:'absolute', inset:0, background:BG }}>
            <div style={{ height:'100%', display:'flex', flexDirection:'column', padding:'62px 24px 0' }}>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:20, paddingTop:10 }}>
                <JioMark size={32} />
                <div>
                  <h1 style={{ fontSize:28, fontWeight:900, color:TEAL, lineHeight:1.2 }}>{t.signin.title}</h1>
                  <p style={{ marginTop:8, fontSize:14, color:'rgba(255,255,255,0.8)' }}>{t.signin.subtitle}</p>
                </div>
                <div>
                  <p style={{ fontSize:14, fontWeight:500, color:'white', marginBottom:12 }}>{t.signin.phoneLabel}</p>
                  <div style={{ display:'flex', gap:12 }}>
                    <div style={{ width:60, height:48, background:'transparent', border:'1px solid rgba(255,255,255,0.77)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:500, color:'white', flexShrink:0 }}>
                      +91
                    </div>
                    <PhoneInput value={phone} onChange={setPhone} />
                  </div>
                </div>
              </div>
              <div style={{ paddingBottom:40, display:'flex', flexDirection:'column', gap:16 }}>
                <TermsText parts={t.signin.terms} />
                <PillBtn onClick={handleGetOtp} disabled={!phoneOk} loading={signinLoading}>
                  {signinLoading ? t.signin.sending : t.signin.getOtp}
                </PillBtn>
              </div>
            </div>
          </div>

          {/* ── 4. OTP VERIFY ── */}
          <div ref={otpRef} style={{ position:'absolute', inset:0, background:BG }}>
            <div style={{ height:'100%', display:'flex', flexDirection:'column', padding:'62px 24px 0' }}>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:20, paddingTop:10 }}>
                <JioMark size={32} />
                <div>
                  <h1 style={{ fontSize:28, fontWeight:900, color:TEAL, lineHeight:1.2 }}>{t.otp.title}</h1>
                  <p style={{ marginTop:8, fontSize:14, color:'rgba(255,255,255,0.8)' }}>
                    {t.otp.subtitle}{' '}
                    <strong style={{ color:'white' }}>+91 {phone || 'XXXXXXX210'}</strong>
                  </p>
                  <button
                    onClick={() => goTo('signin')}
                    style={{ marginTop:10, background:'transparent', border:'none', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', padding:'4px 0', opacity:0.85 }}>
                    {t.otp.change}
                  </button>
                </div>
                <div>
                  <p style={{ fontSize:14, fontWeight:500, color:'white', marginBottom:12 }}>{t.otp.label}</p>
                  <input
                    id="otp-single"
                    type="tel" inputMode="numeric"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                    maxLength={6}
                    autoComplete="one-time-code"
                    style={{
                      width:'100%', height:48, background:'transparent',
                      border:'1px solid rgba(255,255,255,0.77)', borderRadius:8,
                      padding:'0 17px', fontSize:22, fontWeight:700,
                      letterSpacing:8, textAlign:'center',
                      color:'white', outline:'none', caretColor:TEAL,
                    }}
                  />
                  <p
                    style={{ marginTop:10, fontSize:14, cursor: otpCanResend ? 'pointer' : 'default', color: otpCanResend ? TEAL : 'rgba(255,255,255,0.77)' }}
                    onClick={handleResendOtp}>
                    {otpCanResend ? t.otp.resend : t.otp.requestIn(otpTimer)}
                  </p>
                </div>
              </div>
              <div style={{ paddingBottom:40, display:'flex', flexDirection:'column', gap:16 }}>
                <TermsText parts={t.otp.terms} />
                <PillBtn onClick={handleSubmitOtp} disabled={!otpOk} loading={otpLoading}>
                  {otpLoading ? t.otp.verifying : t.otp.submit}
                </PillBtn>
              </div>
            </div>

            {/* Permission dialog 1 */}
            <IosAlert visible={perm1}>
              <div style={{ padding:'19px 16px 0', textAlign:'center' }}>
                <p style={{ fontSize:17, fontWeight:600, color:'#000', lineHeight:1.3, letterSpacing:'-0.43px', marginBottom:4 }}>{t.perm1.title}</p>
                <p style={{ fontSize:13, color:'#000', lineHeight:1.4 }}>{t.perm1.body}</p>
              </div>
              <div style={{ padding:'12px 16px 15px', display:'flex', flexDirection:'column', gap:10 }}>
                <img src={ASSETS.permPhotos} alt="" style={{ width:'100%', borderRadius:8, display:'block' }} />
                <div>
                  <p style={{ fontSize:17, fontWeight:600, color:'#000', textAlign:'center' }}>{t.perm1.count}</p>
                  <p style={{ fontSize:13, color:'#000', textAlign:'center', lineHeight:1.4, marginTop:4 }}>{t.perm1.countBody}</p>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', borderTop:'0.333px solid rgba(84,84,86,0.34)' }}>
                {[
                  { key:'limit', bold:false },
                  { key:'allow', bold:true  },
                  { key:'deny',  bold:false },
                ].map(({ key, bold }, i) => (
                  <button key={key} onClick={handlePerm1} style={{
                    border:'none', background:'transparent', padding:0, height:44,
                    cursor:'pointer', fontSize:17, color:'#007aff',
                    fontWeight: bold ? 600 : 400,
                    fontFamily:'-apple-system, SF Pro, sans-serif',
                    borderTop: i > 0 ? '0.333px solid rgba(84,84,86,0.34)' : 'none',
                  }}>
                    {t.perm1[key]}
                  </button>
                ))}
              </div>
            </IosAlert>

            {/* Permission dialog 2 */}
            <IosAlert visible={perm2}>
              <div style={{ padding:'19px 16px 15px', textAlign:'center' }}>
                <p style={{ fontSize:17, fontWeight:600, color:'#000', lineHeight:1.3, letterSpacing:'-0.43px', marginBottom:8 }}>{t.perm2.title}</p>
                <p style={{ fontSize:13, color:'#000', lineHeight:1.4 }}>{t.perm2.body}</p>
              </div>
              <div style={{ display:'flex', borderTop:'0.333px solid rgba(84,84,86,0.34)' }}>
                {[
                  { key:'deny',  bold:false },
                  { key:'allow', bold:true  },
                ].map(({ key, bold }, i) => (
                  <button key={key} onClick={handlePerm2} style={{
                    flex:1, border:'none', background:'transparent', padding:0, height:44,
                    cursor:'pointer', fontSize:17, color:'#007aff',
                    fontWeight: bold ? 600 : 400,
                    fontFamily:'-apple-system, SF Pro, sans-serif',
                    borderLeft: i > 0 ? '0.333px solid rgba(84,84,86,0.34)' : 'none',
                  }}>
                    {t.perm2[key]}
                  </button>
                ))}
              </div>
            </IosAlert>
          </div>

          {/* ── 5–8. CAROUSEL ── (flex layout = image fills all space, no gap) */}
          <div
            ref={carouselRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ position:'absolute', inset:0, background:BG, display:'flex', flexDirection:'column' }}
          >
            {/* Reserve space for status bar overlay */}
            <div style={{ height:50, flexShrink:0 }} />

            {/* Image fills ALL remaining space above the bottom panel */}
            <div style={{ flex:1, overflow:'hidden', position:'relative', minHeight:0 }}>
              {/* Sliding strip */}
              <div style={{
                display:'flex',
                width:`${SLIDE_IMGS.length * 100}%`,
                height:'100%',
                transform:`translateX(-${carouselIdx * (100 / SLIDE_IMGS.length)}%)`,
                transition:'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
              }}>
                {SLIDE_IMGS.map((src, i) => (
                  <div key={i} style={{ width:`${100 / SLIDE_IMGS.length}%`, height:'100%', overflow:'hidden', flexShrink:0 }}>
                    <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', animation:'imgZoom 6s ease-in-out infinite' }} />
                  </div>
                ))}
              </div>
              {/* Gradient blend into bottom panel */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:90, background:'linear-gradient(to bottom, transparent, #001d2e)', pointerEvents:'none' }} />
              {/* Skip */}
              <button
                onClick={() => goTo('done')}
                style={{ position:'absolute', top:8, right:0, background:'transparent', border:'none', color:'white', fontSize:14, fontWeight:700, cursor:'pointer', padding:'6px 16px 6px 8px', display:'flex', alignItems:'center', gap:4, textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>
                {t.carousel.skip} <ChevronRight />
              </button>
            </div>

            {/* Bottom panel — no gap because flex fills the image */}
            <div style={{ flexShrink:0, background:BG, borderRadius:'32px 32px 0 0', padding:'20px 24px 40px', display:'flex', flexDirection:'column', gap:16 }}>
              {/* Animated text on slide change */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <h2
                  key={`title-${carouselIdx}`}
                  style={{ fontSize:24, fontWeight:900, color:'white', textAlign:'center', lineHeight:1.2, animation:'slideUpFade 0.35s ease' }}>
                  {slide.title}
                </h2>
                <p
                  key={`desc-${carouselIdx}`}
                  style={{ fontSize:14, color:'rgba(255,255,255,0.8)', textAlign:'center', lineHeight:1.45, animation:'slideUpFade 0.35s 0.05s ease both' }}>
                  {slide.desc}
                </p>
              </div>
              {/* Progress dots */}
              <div style={{ display:'flex', gap:6, justifyContent:'center', alignItems:'center' }}>
                {t.carousel.slides.map((_, i) => (
                  <div key={i} style={{
                    height:8, borderRadius:100,
                    width: i === carouselIdx ? 26 : 8,
                    background: i === carouselIdx ? '#1cbaba' : 'rgba(191,248,247,0.5)',
                    transition:'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s',
                  }} />
                ))}
              </div>
              {/* CTA row */}
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <button
                  onClick={handleNext}
                  style={{ flex:1, height:48, background:BG2, color:TEAL, border:'none', borderRadius:9999, fontSize:18, fontWeight:700, cursor:'pointer' }}>
                  {slide.cta}
                </button>
                <button
                  onClick={handleNext}
                  style={{ width:48, height:48, background:BG2, border:'none', borderRadius:9999, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ── 9. DONE ── */}
          <div ref={doneRef} style={{ position:'absolute', inset:0, background:BG }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:24, padding:40, textAlign:'center' }}>
              <div style={{
                width:80, height:80, background:TEAL, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                opacity: doneVisible ? 1 : 0,
                transform: doneVisible ? 'scale(1)' : 'scale(0.3)',
                animation: doneVisible
                  ? 'checkPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards, checkGlow 1.5s 0.6s ease-in-out infinite'
                  : 'none',
              }}>
                <CheckIcon />
              </div>
              <div style={{ opacity: doneVisible ? 1 : 0, transform: doneVisible ? 'translateY(0)' : 'translateY(16px)', transition:'opacity 0.5s 0.3s, transform 0.5s 0.3s' }}>
                <h2 style={{ fontSize:28, fontWeight:900, color:'white' }}>{t.done.title}</h2>
                <p style={{ marginTop:12, fontSize:14, color:'rgba(255,255,255,0.8)', lineHeight:1.45 }}>{t.done.desc}</p>
              </div>
              <div style={{ width:'100%', opacity: doneVisible ? 1 : 0, transform: doneVisible ? 'translateY(0)' : 'translateY(16px)', transition:'opacity 0.5s 0.5s, transform 0.5s 0.5s' }}>
                <PillBtn onClick={handleRestart}>{t.done.start}</PillBtn>
              </div>
            </div>
          </div>

        </div>{/* /screen stack */}
      </div>{/* /phone frame */}
    </div>
  )
}
