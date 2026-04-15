import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import PhotosSection from './PhotosSection'

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

function JioLogo({ size = 40 }) {
  return (
    <img
      src="./jio-logo.png"
      alt="Jio"
      style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, display: 'block' }}
    />
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

// ─────────────────────────────────────────────────────────────────────────────
// SLIDESHOW BANNER — Figma node 239-1472
// Animated fan of 5 photo cards; plays entry + looping float when active
// ─────────────────────────────────────────────────────────────────────────────
const SS = {
  farRight:   'https://www.figma.com/api/mcp/asset/a59c63d3-446b-4420-94ae-795e9144f33f',
  farLeft:    'https://www.figma.com/api/mcp/asset/b3e06bbb-bb4a-4bfb-917e-d9bef6145bc6',
  innerLeft:  'https://www.figma.com/api/mcp/asset/9bd126db-48f1-4b9c-80c8-f59014f6e8d5',
  innerRight: 'https://www.figma.com/api/mcp/asset/7f314dad-127e-4911-97b9-d06782e543bb',
  center:     'https://www.figma.com/api/mcp/asset/17c8efd0-4365-4d72-95dc-8ba733f36ba4',
  title:      'https://www.figma.com/api/mcp/asset/2f69aeb4-75b7-4f18-ae80-e5fe7905b8a6',
}

// Card definitions — back to front (z-order 1 → 3)
// Each: [src, leftOffset, top, cardW, cardH, rotateDeg, blur, hasBorder,
//        imgStyle, entryDelay, floatAnim, floatDur, floatStartDelay]
const SS_CARDS = [
  {
    src: SS.farRight,
    left: 'calc(50% + 119.24px)', top: 100,
    cw: 124, ch: 200, rotate: 12.64, blur: 1.5, border: false,
    imgStyle: { width:'100%', height:'100%', objectFit:'cover' },
    ed:'0s', fa:'cardFloat0', fd:'4s', fs:'0.65s', z:1,
  },
  {
    src: SS.farLeft,
    left: 'calc(50% - 120.59px)', top: 100,
    cw: 124, ch: 200, rotate: -12.64, blur: 1, border: false,
    imgStyle: { position:'absolute', width:'100%', height:'110%', left:'-10%', top:'-0.14%', maxWidth:'none' },
    ed:'0.1s', fa:'cardFloat1', fd:'3.7s', fs:'0.75s', z:1,
  },
  {
    src: SS.innerLeft,
    left: 'calc(50% - 76.47px)', top: 81,
    cw: 144, ch: 232, rotate: -5.43, blur: 0.5, border: true,
    imgStyle: { position:'absolute', width:'246%', height:'102%', left:'-114%', top:'-1%', maxWidth:'none' },
    ed:'0.2s', fa:'cardFloat2', fd:'3.9s', fs:'0.85s', z:2,
  },
  {
    src: SS.innerRight,
    left: 'calc(50% + 71.28px)', top: 81,
    cw: 144, ch: 232, rotate: 5, blur: 0.5, border: true,
    imgStyle: { position:'absolute', width:'121%', height:'103%', left:'16%', top:'-3%', maxWidth:'none' },
    ed:'0.3s', fa:'cardFloat3', fd:'4.3s', fs:'0.95s', z:2,
  },
]

function SlideShowBanner({ isActive }) {
  // `playing` drives all animations — avoids key-based remount flicker
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setPlaying(false)
      return
    }
    // Reset first, then start after 2 animation frames so the browser
    // has painted the hidden state before kicking off the fan-in
    setPlaying(false)
    let r1, r2
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setPlaying(true))
    })
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2) }
  }, [isActive])

  const entry = (delay) =>
    playing ? `cardFanIn 0.65s ${delay} cubic-bezier(0.34,1.4,0.64,1) both` : 'none'
  const float = (fa, fd, fs) =>
    playing ? `${fa} ${fd} ${fs} ease-in-out infinite` : 'none'

  return (
    // BG matches app background → status bar colour is seamless
    <div style={{ position:'relative', width:'100%', height:'100%', background: BG }}>

      {/* ── Background cards (far → near) ── */}
      {SS_CARDS.map((c, i) => (
        <div key={i} style={{
          position:'absolute', left:c.left, top:c.top,
          transform:'translateX(-50%)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex: c.z,
          willChange:'transform',
        }}>
          {/* Entry: starts invisible (opacity:0); animation-fill-mode:both overrides
              inline opacity once it runs, so no visible flash */}
          <div style={{
            opacity: 0,
            animation: entry(c.ed),
            willChange:'transform, opacity',
          }}>
            {/* Float loop — starts exactly when entry finishes */}
            <div style={{
              animation: float(c.fa, c.fd, c.fs),
              willChange:'transform',
            }}>
              {/* Static rotation */}
              <div style={{ transform:`rotate(${c.rotate}deg)` }}>
                {/* Blur lives on the static card body, NOT on any animated layer */}
                <div style={{
                  width:c.cw, height:c.ch, borderRadius:11,
                  overflow:'hidden', position:'relative',
                  filter: c.blur > 0 ? `blur(${c.blur}px)` : undefined,
                  border: c.border ? '2px solid #000f1a' : 'none',
                }}>
                  <img src={c.src} alt="" style={{ display:'block', ...c.imgStyle }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ── Center card ── */}
      <div style={{
        position:'absolute', left:'calc(50% - 0.5px)', top:57,
        transform:'translateX(-50%)', zIndex:3, willChange:'transform',
      }}>
        <div style={{ opacity:0, animation: entry('0.4s'), willChange:'transform, opacity' }}>
          <div style={{ animation: float('cardFloat4','5s','1.05s'), willChange:'transform' }}>
            <div style={{
              width:181, height:291, borderRadius:11,
              border:'3px solid #000f1a', overflow:'hidden', position:'relative',
            }}>
              <img src={SS.center} alt=""
                style={{ position:'absolute', width:'130%', height:'102%', left:'-13%', top:'-2%', maxWidth:'none' }} />
              <div style={{
                position:'absolute', inset:0, pointerEvents:'none',
                background:'linear-gradient(to bottom, rgba(0,0,0,0.81) 18%, rgba(32,2,2,0.71) 32%, rgba(113,6,6,0) 42%)',
              }} />
              {/* Shimmer sweep — implies a video/slideshow is playing */}
              <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
                <div style={{
                  position:'absolute', left:0, right:0, height:'50%',
                  background:'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.09), rgba(255,255,255,0))',
                  animation: playing ? 'centerShimmer 3.5s 1.5s ease-in-out infinite' : 'none',
                }} />
              </div>
              <img src={SS.title} alt="Banaras Ki Shaam"
                style={{
                  position:'absolute', left:5, top:20, width:152, height:53,
                  display:'block', maxWidth:'none',
                  opacity:0, animation: playing ? 'titleReveal 0.55s 0.95s ease both' : 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient — blends into the dark panel below */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:90, zIndex:10, pointerEvents:'none',
        background:'linear-gradient(to bottom, transparent, #001d2e)',
      }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME DASHBOARD — Figma node 132-35513
// ─────────────────────────────────────────────────────────────────────────────
const HD = {
  productLogo:  'https://www.figma.com/api/mcp/asset/dd991640-c08f-48e1-91c2-1de1a997a44f',
  logoText:     'https://www.figma.com/api/mcp/asset/77b42d3b-d508-4479-9726-43f8cf03ffe7',
  userAvatar:   'https://www.figma.com/api/mcp/asset/cf903304-8c93-40a0-914d-162b2096e721',
  // Stories
  storyBirthday:    'https://www.figma.com/api/mcp/asset/22a50668-1915-4eac-9581-f8fbcbd87475',
  storyMotivation:  'https://www.figma.com/api/mcp/asset/2d3652ea-2e41-458d-825c-7f88ac8fbf05',
  storyAnniversary: 'https://www.figma.com/api/mcp/asset/4379ba5c-d375-48e2-92c9-a71d6d08b0e8',
  storyLove:        'https://www.figma.com/api/mcp/asset/54552f35-8839-4c6c-8d0b-d84e073aa39f',
  // Hero
  heroBg:       'https://www.figma.com/api/mcp/asset/f78b6b2b-c91b-4ea2-aa1e-4b53503922eb',
  heroOverlay:  'https://www.figma.com/api/mcp/asset/502050e8-409b-448e-bbb8-51d57cf57c24',
  heroText:     'https://www.figma.com/api/mcp/asset/aea66820-1420-4da8-8e7c-dfc818ffed23',
  // Icons row (cricket teams)
  icon0: 'https://www.figma.com/api/mcp/asset/ee22b9f9-064a-4fad-b2c8-082ed905c03c',
  icon1: 'https://www.figma.com/api/mcp/asset/14e9711d-0274-4404-b281-72c1158e73af',
  icon2: 'https://www.figma.com/api/mcp/asset/d67d62e8-1b45-4bdc-9720-46e89bc40ef9',
  icon3: 'https://www.figma.com/api/mcp/asset/22cc6e93-cc8b-46a2-8f7f-1a7916fb4003',
  icon4: 'https://www.figma.com/api/mcp/asset/819da8ab-5ca9-4c4c-8394-3ffaafa5b757',
  icon5: 'https://www.figma.com/api/mcp/asset/633ef11b-b6c2-4f55-84af-b78641c124c5',
  icon6: 'https://www.figma.com/api/mcp/asset/481043c8-d486-43f1-b9c4-d5b52c01b288',
  icon7: 'https://www.figma.com/api/mcp/asset/363b6988-532a-4030-9d83-a704729269b9',
  // Memories
  memVaranasi:     'https://www.figma.com/api/mcp/asset/aa7509a0-7e54-40b0-83b4-b74be92b1fcf',
  memRuhi:         'https://www.figma.com/api/mcp/asset/bf91b0e1-c69c-4752-a228-af7284f3e6d8',
  memAnniversary:  'https://www.figma.com/api/mcp/asset/e70a774b-79dc-4001-b98a-d7016081279d',
  // Greetings
  greet0: 'https://www.figma.com/api/mcp/asset/23919710-13af-446a-a102-0e8bbaf53dcd',
  greet1: 'https://www.figma.com/api/mcp/asset/5165e55f-6d47-47e5-827f-b9bf5dd75d74',
  greet2: 'https://www.figma.com/api/mcp/asset/c1c4aa8b-1998-49a3-b291-63f743c01ab8',
  greet3: 'https://www.figma.com/api/mcp/asset/83759557-8370-437f-860d-27e0d1aac10c',
  greet4: 'https://www.figma.com/api/mcp/asset/be721329-db81-4968-a7df-836fbf7a27c4',
  // Trending
  trend0: 'https://www.figma.com/api/mcp/asset/60ae4a4f-6214-4cf2-8761-40b0d3987aeb',
  trend1: 'https://www.figma.com/api/mcp/asset/26919070-349b-41f7-b548-d905eaf6d7da',
  trend2: 'https://www.figma.com/api/mcp/asset/87616552-27f0-4a11-b1e9-b5eb848dff87',
  // Photos grid
  photo0: 'https://www.figma.com/api/mcp/asset/27346f9d-d160-453f-8d39-bffc585ed612',
  photo1: 'https://www.figma.com/api/mcp/asset/aaab64f1-1ca6-44b0-a54a-1aea3a833234',
  photo2: 'https://www.figma.com/api/mcp/asset/6fdc33f0-8948-4267-8c38-b54b8afce1cb',
  photo3: 'https://www.figma.com/api/mcp/asset/7db6edd2-da78-4340-aa1e-41c5fe5e5400',
  photo4: 'https://www.figma.com/api/mcp/asset/e3a1ad85-0ec9-4a07-9e46-094f7acb5b63',
  photo5: 'https://www.figma.com/api/mcp/asset/402a50ff-9040-4843-be81-cc913f407155',
  photo6: 'https://www.figma.com/api/mcp/asset/07e69920-9997-4ceb-b527-f970e28c3593',
  photo7: 'https://www.figma.com/api/mcp/asset/fced96ec-9b23-4f49-a252-df65fc1272cd',
  photoBg: 'https://www.figma.com/api/mcp/asset/ca28e169-256b-4def-aa05-154261776545',
  // Invite
  inviteIllus: 'https://www.figma.com/api/mcp/asset/82a85b65-b301-44b4-b0cc-7b1d529e0b52',
  inviteAv0:   'https://www.figma.com/api/mcp/asset/350ba256-2942-475d-ba4a-92f8bd492dad',
  inviteAv1:   'https://www.figma.com/api/mcp/asset/9fe37080-0a76-4d7b-951f-7ddcb16dfd7a',
  inviteAv2:   'https://www.figma.com/api/mcp/asset/05f97770-a509-43ee-b698-064ef8a5436d',
  inviteAv3:   'https://www.figma.com/api/mcp/asset/e03c8773-b81f-4c35-bb8d-9b388473e74b',
  inviteAv4:   'https://www.figma.com/api/mcp/asset/40db08fc-ac1c-4034-810a-5a3693abcc98',
  // Nav icons
  navHome:     'https://www.figma.com/api/mcp/asset/4291a682-a94b-4e80-806b-6d738f89a57b',
  navPhotos:   'https://www.figma.com/api/mcp/asset/67140f33-26d9-4afe-bca1-4d9df51caf4f',
  navCamera:   'https://www.figma.com/api/mcp/asset/f2be24b2-d005-4501-be90-fbd15e0dd428',
  navFiles:    'https://www.figma.com/api/mcp/asset/d5f1e98b-8cd9-4325-9a3d-89b1cfb67cda',
  navCreate:   'https://www.figma.com/api/mcp/asset/e9565279-1ee8-4012-a3e0-43f204ab3957',
  // Storage check icon
  iconCheck:   'https://www.figma.com/api/mcp/asset/d29d7df9-961d-4143-ac31-71080d8a2c4f',
  // Share/Edit/More vectors
  iconShare:   'https://www.figma.com/api/mcp/asset/379fb763-d640-41c5-80a3-79ba72881835',
  iconEdit:    'https://www.figma.com/api/mcp/asset/3e9f020c-3f28-4c68-8b56-5e82a6fa678f',
  iconMore:    'https://www.figma.com/api/mcp/asset/567de39a-077f-4394-bacd-bd0d9340b3cf',
}

const STROKE = 'rgba(39,139,193,0.4)'
const GLASS  = 'rgba(36,38,43,0.21)'

// Inline share/edit button used in hero and greetings sections
function GlassBtn({ iconEl, label, flex, width }) {
  return (
    <div style={{
      flex: flex || undefined, width: width || undefined,
      background: GLASS, borderRadius: 9999,
      display:'flex', alignItems:'center', justifyContent:'center', gap:6,
      minHeight:40, padding:'4px 20px 4px 16px',
      cursor:'pointer',
    }}>
      {iconEl}
      {label && <span style={{ fontSize:16, fontWeight:700, color:'white', whiteSpace:'nowrap' }}>{label}</span>}
    </div>
  )
}

// Section heading used across multiple sections
function SectionHeading({ title }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'100%' }}>
      <p style={{ fontSize:28, fontWeight:900, color:'white', textAlign:'center', lineHeight:'28px' }}>{title}</p>
    </div>
  )
}

// Inline SVG action icons — pixel-matched to Figma screenshots
function ShareIcon({ size=20, color='white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
      <path d="M4 12V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V12"
        stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 2V15M8 6L12 2L16 6"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function EditIcon({ size=20, color='white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
      <path d="M12 20H21" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M16.5 3.5C16.89 3.11 17.41 2.89 17.96 2.89C18.24 2.89 18.51 2.95 18.76 3.06C19.01 3.17 19.24 3.33 19.43 3.53C19.62 3.72 19.77 3.96 19.87 4.21C19.97 4.47 20.02 4.74 20.02 5.01C20.02 5.29 19.97 5.56 19.86 5.81C19.76 6.06 19.6 6.3 19.41 6.49L7 19L3 20L4 16L16.5 3.5Z"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.5 2.5L21.5 3.5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function MoreDotsIcon({ size=20, color='white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
      <circle cx="5" cy="12" r="1.5" fill={color}/>
      <circle cx="12" cy="12" r="1.5" fill={color}/>
      <circle cx="19" cy="12" r="1.5" fill={color}/>
    </svg>
  )
}
function DownloadIcon({ size=20, color='white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
      <path d="M12 3V16M8 12L12 16L16 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 20H20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// Inline SVG nav icons — pixel-matched to Figma, never expire
function NavIcon({ id, active }) {
  const c = active ? 'white' : 'rgba(255,255,255,0.54)'
  if (id === 'home') return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2.5 7.5L10 2.5L17.5 7.5V17.5H12.5V12.5H7.5V17.5H2.5V7.5Z"
        fill={active ? c : 'none'} stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
  if (id === 'photos') return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke={c} strokeWidth="1.5"/>
      <path d="M2.5 13L6.5 9L9.5 12L12.5 8.5L17.5 14" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="6.5" cy="6.5" r="1.5" fill={c}/>
    </svg>
  )
  if (id === 'camera') return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3L11.5 1.5H13.5L15 3H17.5C18.33 3 19 3.67 19 4.5V15.5C19 16.33 18.33 17 17.5 17H2.5C1.67 17 1 16.33 1 15.5V4.5C1 3.67 1.67 3 2.5 3H5L6.5 1.5H8.5L10 3Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="10" cy="10" r="3" stroke={c} strokeWidth="1.5"/>
      <path d="M14.5 6.5L16 5" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
  if (id === 'files') return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 4C3.5 3.17 4.17 2.5 5 2.5H11L16.5 8V16C16.5 16.83 15.83 17.5 15 17.5H5C4.17 17.5 3.5 16.83 3.5 16V4Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M11 2.5V8H16.5" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 11.5H13M7 14H11" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
  // create
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/>
      <path d="M10 6.5V13.5M6.5 10H13.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function HomeDashboard({ onNavClick }) {
  const [activeNav, setActiveNav] = useState('home')
  const NAV = [
    { id:'home',   label:'Home'      },
    { id:'photos', label:'Photos'    },
    { id:'camera', label:'AI Camera' },
    { id:'files',  label:'Files'     },
    { id:'create', label:'Create'    },
  ]
  const STORIES = [
    { img: HD.storyBirthday,    label:'Birthday'    },
    { img: HD.storyMotivation,  label:'Motivation'  },
    { img: HD.storyAnniversary, label:'Anniversary' },
    { img: HD.storyLove,        label:'Love'        },
  ]
  const HERO_ICONS = [
    HD.icon0, HD.icon1, HD.icon2, HD.icon3,
    HD.icon4, HD.icon5, HD.icon6, HD.icon7,
  ]
  const MEMORIES = [
    { img: '/diwali-memory.png', t1:'Diwali',   t2:'2025',        date:'24 Oct 2025', diwali:true },
    { img: HD.memRuhi,           t1:"Ruhi's",   t2:"B'Day",       date:'22 June 2026' },
    { img: HD.memAnniversary,    t1:'Happy',    t2:'Anniversary', date:'29/June/2026' },
  ]
  const GREETINGS = [
    { img: HD.greet0, w:214, h:380 },
    { img: HD.greet1, w:214, h:380 },
    { img: HD.greet3, w:214, h:380 },
    { img: HD.greet4, w:214, h:380 },
  ]
  const TRENDING = [
    { img: HD.trend0 },
    { img: HD.trend1 },
    { img: HD.trend2 },
  ]
  const PHOTOS = [
    HD.photo0, HD.photo1, HD.photo2,
    HD.photo3, HD.photo4, HD.photo5,
    HD.photo6, HD.photo7,
  ]

  // common scroll row style
  const hScroll = { display:'flex', overflowX:'auto', gap:16, paddingBottom:2,
    scrollbarWidth:'none', msOverflowStyle:'none' }
  // common section wrapper
  const section = { display:'flex', flexDirection:'column', alignItems:'center',
    gap:24, padding:'12px 16px', width:'100%', boxSizing:'border-box' }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:BG, overflow:'hidden' }}>

      {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
      <div style={{ flexShrink:0, background:BG }}>
        {/* Primary nav — 20px top padding so content clears the phone notch */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 16px 8px', height:56 }}>
          {/* Left: product logo + "AIPhotos" wordmark */}
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <img src={HD.productLogo} alt=""
              style={{ width:32, height:32, objectFit:'contain', flexShrink:0 }} />
            <img src="/aiphotos-wordmark.png" alt="AIPhotos"
              style={{ height:20, objectFit:'contain', objectPosition:'left center', flexShrink:0 }} />
          </div>
          {/* Right: search icon + avatar */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ width:32, height:32, background:'none', border:'none',
              display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', padding:0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="1.6"/>
                <path d="M13 13L17 17" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
            <div style={{ width:32, height:32, borderRadius:'50%', overflow:'hidden',
              border:'1.5px solid rgba(255,255,255,0.25)', flexShrink:0, cursor:'pointer' }}>
              <img src={HD.userAvatar} alt=""
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            </div>
          </div>
        </div>

        {/* 1px divider */}
        <div style={{ height:1, background:'rgba(255,255,255,0.1)' }} />
      </div>

      {/* ══ SCROLLABLE BODY ═════════════════════════════════════════════════════ */}
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>

        {/* ── Stories ── */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:14,
          padding:'8px 14px 8px', overflowX:'auto',
          scrollbarWidth:'none', msOverflowStyle:'none' }}>
          {/* Create — outer size matches story ring circles exactly */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, flexShrink:0, cursor:'pointer' }}>
            <div style={{ padding:1.8, borderRadius:'50%', border:`1.7px dashed rgba(255,255,255,0.38)` }}>
              <div style={{ width:53, height:53, borderRadius:'50%',
                background:BG, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 4.5V17.5M4.5 11H17.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <span style={{ fontSize:8.9, fontWeight:500, color:'white', textAlign:'center', maxWidth:57 }}>Create</span>
          </div>
          {/* Story items */}
          {STORIES.map((s,i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, flexShrink:0, cursor:'pointer' }}>
              {/* Ring (1.7px gap between ring and avatar) */}
              <div style={{ padding:1.8, borderRadius:'50%', border:`1.7px solid ${STROKE}` }}>
                <div style={{ width:53, height:53, borderRadius:'50%', overflow:'hidden' }}>
                  <img src={s.img} alt={s.label}
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                </div>
              </div>
              <span style={{ fontSize:8.9, fontWeight:500, color:'white',
                textAlign:'center', maxWidth:57 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Hero card + icons strip ── */}
        <div style={{ padding:'0 16px', marginTop:2 }}>
          {/* Main card — 328×437px */}
          <div style={{ position:'relative', width:'100%', height:437,
            borderRadius:16, overflow:'hidden' }}>
            <img src={HD.heroBg} alt=""
              style={{ position:'absolute', width:'100%', height:'119.72%', top:'-2.15%', left:0, objectFit:'cover' }} />
            <img src={HD.heroOverlay} alt=""
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
            {/* Blue gradient overlay */}
            <div style={{ position:'absolute', inset:0,
              background:'linear-gradient(to top, rgba(34,64,157,0.9) 10.5%, rgba(68,97,176,0.63) 30.6%, rgba(150,176,221,0) 48.2%)' }} />
            {/* "Duniya Hila Denge" text overlay */}
            <div style={{ position:'absolute', left:71, top:288, width:232, height:86, overflow:'hidden' }}>
              <img src={HD.heroText} alt=""
                style={{ position:'absolute', width:'121.42%', height:'243.63%', left:'-21.4%', top:'-79.9%', maxWidth:'none' }} />
            </div>
            {/* Action buttons */}
            <div style={{ position:'absolute', bottom:16, left:16, right:16,
              display:'flex', alignItems:'center', gap:8 }}>
              {/* Share */}
              <div style={{ flex:1, minHeight:40, background:GLASS, borderRadius:9999,
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                padding:'4px 20px 4px 16px', cursor:'pointer' }}>
                <ShareIcon size={20} />
                <span style={{ fontSize:16, fontWeight:700, color:'white', whiteSpace:'nowrap' }}>Share</span>
              </div>
              {/* Edit */}
              <div style={{ width:105, minHeight:40, background:GLASS, borderRadius:9999,
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                padding:'4px 20px 4px 16px', cursor:'pointer' }}>
                <EditIcon size={20} />
                <span style={{ fontSize:16, fontWeight:700, color:'white', whiteSpace:'nowrap' }}>Edit</span>
              </div>
              {/* More */}
              <div style={{ width:40, height:40, background:GLASS, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, cursor:'pointer' }}>
                <MoreDotsIcon size={20} />
              </div>
            </div>
          </div>

          {/* Cricket team icons strip */}
          <div style={{ ...hScroll, gap:11, marginTop:10 }}>
            {HERO_ICONS.map((ic,i) => (
              <div key={i} style={{ width:56, height:56, borderRadius:14, overflow:'hidden',
                border:`1px solid ${STROKE}`, flexShrink:0, background:'#15294a',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src={ic} alt="" style={{ width:'75%', height:'75%', objectFit:'contain' }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Memories ── */}
        <div style={section}>
          <SectionHeading title="Memories" />
          <div style={{ ...hScroll, width:'100%' }}>
            {MEMORIES.map((m,i) => (
              <div key={i} style={{ position:'relative', width:220, height:220,
                borderRadius:9.8, overflow:'hidden', flexShrink:0 }}>
                <img src={m.img} alt=""
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                {/* gradient overlay */}
                <div style={{ position:'absolute', inset:0,
                  background: m.diwali
                    ? 'linear-gradient(to top, rgba(120,40,0,0.82) 0%, rgba(180,80,0,0.35) 55%, rgba(0,0,0,0) 100%)'
                    : 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 68%)' }} />
                {/* text */}
                <div style={{ position:'absolute', bottom:11, left:12 }}>
                  <div style={{ fontSize:32, fontWeight:900, lineHeight:'32px',
                    color: m.diwali ? '#FFD166' : 'white' }}>
                    <div>{m.t1}</div><div>{m.t2}</div>
                  </div>
                  {m.diwali && (
                    <div style={{ fontSize:11, color:'rgba(255,220,100,0.85)', marginTop:4, fontWeight:500 }}>
                      🪔 Family celebration
                    </div>
                  )}
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.8)', marginTop: m.diwali ? 2 : 8 }}>{m.date}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', textAlign:'center',
            maxWidth:254, lineHeight:1.45, margin:0 }}>
            Your photos and videos come together to watch and share anytime.
          </p>
        </div>

        {/* ── Greetings ── */}
        <div style={{ ...section, padding:'12px 0' }}>
          <div style={{ width:'100%', padding:'0 16px', boxSizing:'border-box' }}>
            <SectionHeading title="Greetings" />
          </div>
          <div style={{ ...hScroll, paddingLeft:16, paddingRight:0, width:'100%',
            boxSizing:'border-box' }}>
            {GREETINGS.map((g,i) => (
              <div key={i} style={{ width:g.w, height:g.h, borderRadius:9.5,
                overflow:'hidden', flexShrink:0 }}>
                <img src={g.img} alt=""
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.54)', textAlign:'center',
            maxWidth:268, lineHeight:1.45, margin:0, padding:'0 16px' }}>
            See yourself in your favourite team jersey.
          </p>
          {/* Share + download buttons — matches Figma */}
          <div style={{ display:'flex', gap:11, alignItems:'center' }}>
            <div style={{ width:264, minHeight:40, background:BG, borderRadius:9999,
              border:'1px solid rgba(255,255,255,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center',
              gap:6, padding:'4px 20px 4px 16px', cursor:'pointer' }}>
              <ShareIcon size={20} />
              <span style={{ fontSize:16, fontWeight:700, color:'white' }}>Share</span>
            </div>
            <div style={{ width:40, height:40, background:BG, borderRadius:'50%',
              border:'1px solid rgba(255,255,255,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <DownloadIcon size={20} />
            </div>
          </div>
        </div>

        {/* ── Trending photo looks ── */}
        <div style={section}>
          <SectionHeading title="Trending photo looks" />
          <div style={{ ...hScroll, width:'100%' }}>
            {TRENDING.map((tr,i) => (
              <div key={i} style={{ position:'relative', width:220, height:391,
                borderRadius:9.8, overflow:'hidden', flexShrink:0 }}>
                <img src={tr.img} alt=""
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                {/* Share overlay on card 0 */}
                {i===0 && (
                  <div style={{ position:'absolute', right:8, bottom:8, width:40, height:40,
                    background:GLASS, borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <ShareIcon size={20} />
                  </div>
                )}
                {/* Date label on card 1 (26 January) */}
                {i===1 && (
                  <div style={{ position:'absolute', bottom:10, left:8, right:8 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:'white',
                      textShadow:'0 1px 4px rgba(0,0,0,0.6)' }}>26 January 26</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', textAlign:'center',
            maxWidth:254, lineHeight:1.45, margin:0 }}>
            See and try the looks people are loving right now.
          </p>
        </div>

        {/* ── Photos ── */}
        <div style={section}>
          <SectionHeading title="Photos" />
          {/* 3-column grid: (328 - 12px gaps) / 3 ≈ 105px each */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, width:'100%' }}>
            {PHOTOS.map((ph,i) => (
              <div key={i} style={{ aspectRatio:'1', borderRadius:10.5,
                overflow:'hidden', position:'relative' }}>
                <img src={ph} alt=""
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              </div>
            ))}
            {/* +216 tile */}
            <div style={{ aspectRatio:'1', borderRadius:10.5, overflow:'hidden',
              position:'relative', background:'#002a40',
              border:'0.65px solid rgba(255,255,255,0.54)',
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:3 }}>
              <img src={HD.photoBg} alt=""
                style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                  objectFit:'cover', opacity:0.33 }} />
              <span style={{ position:'relative', fontSize:20, fontWeight:900, color:'white' }}>+216</span>
              <span style={{ position:'relative', fontSize:8, color:'white' }}>Photos</span>
            </div>
          </div>
        </div>

        {/* ── Invite card ── */}
        <div style={{ padding:'0 16px 24px', width:'100%', boxSizing:'border-box' }}>
          <div style={{ position:'relative', borderRadius:24, overflow:'hidden',
            height:203, background:'#3ca3ff' }}>
            {/* "5GB FREE" illustration — right side */}
            <img src={HD.inviteIllus} alt=""
              style={{ position:'absolute', right:0, top:'14.68%',
                width:'57.93%', height:'93.6%', objectFit:'contain' }} />
            {/* Headline */}
            <div style={{ position:'absolute', left:16, top:21 }}>
              <p style={{ fontSize:20, fontWeight:900, color:'white',
                lineHeight:'24px', margin:0 }}>
                Invite family member<br/>and get extra 5GB free
              </p>
            </div>
            {/* Overlapping avatars */}
            <div style={{ position:'absolute', left:16, top:86, display:'flex' }}>
              {[HD.inviteAv0,HD.inviteAv1,HD.inviteAv2,HD.inviteAv3,HD.inviteAv4].map((av,i) => (
                <div key={i} style={{ width:32, height:32, borderRadius:'50%',
                  overflow:'hidden', border:'2px solid white',
                  marginLeft: i>0 ? -10 : 0, zIndex:5-i, position:'relative' }}>
                  <img src={av} alt=""
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                </div>
              ))}
            </div>
            {/* "Invite Now" — dark pill button per Figma */}
            <div style={{ position:'absolute', left:16, top:147, height:40,
              background:'rgba(1,27,50,0.85)', borderRadius:9999,
              display:'flex', alignItems:'center', justifyContent:'center',
              padding:'0 20px', cursor:'pointer' }}>
              <span style={{ fontSize:16, fontWeight:700, color:'white' }}>Invite Now</span>
            </div>
          </div>
        </div>

        {/* ── Storage ── */}
        <div style={{ padding:'0 16px 24px', display:'flex', flexDirection:'column',
          gap:10, width:'100%', boxSizing:'border-box' }}>
          {/* Label row */}
          <div style={{ display:'flex', justifyContent:'space-between',
            alignItems:'center' }}>
            <span style={{ fontSize:16, fontWeight:500, color:'rgba(255,255,255,0.45)' }}>Storage</span>
            <span style={{ fontSize:16, fontWeight:500, color:'rgba(255,255,255,0.54)' }}>14.2 GB / 50 GB</span>
          </div>
          {/* Progress track */}
          <div style={{ width:'100%', height:8, background:'#002a40',
            borderRadius:9999, overflow:'hidden' }}>
            <div style={{ width:'28.4%', height:'100%', background:'#278bc1', borderRadius:9999 }} />
          </div>
          {/* Checkmark + text */}
          <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'center' }}>
            <img src={HD.iconCheck} alt="" style={{ width:18, height:18, flexShrink:0 }} />
            <span style={{ fontSize:14, color:'rgba(255,255,255,0.45)' }}>
              All memories safely backed up
            </span>
          </div>
        </div>

        <div style={{ height:8 }} />
      </div>

      {/* ══ BOTTOM NAV ══════════════════════════════════════════════════════════ */}
      {/* Figma: bg rgba(0,120,173,0.24), top divider 0.5px, height 64px */}
      <div style={{ flexShrink:0,
        background:'rgba(0,120,173,0.24)',
        borderTop:'0.5px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display:'flex', alignItems:'stretch',
          height:64, padding:'0 16px' }}>
          {NAV.map(n => {
            const active = n.id === activeNav
            return (
              <button key={n.id} onClick={() => { setActiveNav(n.id); onNavClick?.(n.id) }}
                style={{ flex:1, background:'none', border:'none', cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', gap:6,
                  borderRadius:6, padding:'4px 2px', outline:'none' }}>
                <NavIcon id={n.id} active={active} />
                <span style={{
                  fontSize:12,
                  fontWeight: active ? 700 : 500,
                  color: active ? 'white' : 'rgba(255,255,255,0.54)',
                  overflow:'hidden', textOverflow:'ellipsis',
                  whiteSpace:'nowrap', maxWidth:60, lineHeight:'12px',
                }}>
                  {n.label}
                </span>
              </button>
            )
          })}
        </div>
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
  const homeRef     = useRef(null)
  const photosRef   = useRef(null)
  const screenIdRef = useRef('splash')   // tracks current screen id without stale closure
  const otpTimerRef = useRef(null)

  const REFS = {
    splash:   splashRef,
    language: langRef,
    signin:   signinRef,
    otp:      otpRef,
    carousel: carouselRef,
    done:     doneRef,
    home:     homeRef,
    photos:   photosRef,
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
    [langRef, signinRef, otpRef, carouselRef, doneRef, homeRef, photosRef].forEach(ref => {
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
    clearInterval(otpTimerRef.current)
    setTimeout(() => { setOtpLoading(false); goTo('carousel') }, 1200)
  }

  // Auto-verify when all 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && !otpLoading) handleSubmitOtp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

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

  // Swipe for carousel — touch (mobile) + mouse drag (desktop)
  const onTouchStart = e => setTouchStart(e.touches[0].clientX)
  const onTouchEnd   = e => {
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && carouselIdx < 3) setCarouselIdx(i => i + 1)
      else if (diff < 0 && carouselIdx > 0) setCarouselIdx(i => i - 1)
    }
  }
  const dragRef = useRef(null)
  const carouselIdxRef = useRef(carouselIdx)
  useEffect(() => { carouselIdxRef.current = carouselIdx }, [carouselIdx])
  const onMouseDown = useCallback(e => { dragRef.current = e.clientX }, [])
  const onMouseUp   = useCallback(e => {
    if (dragRef.current === null) return
    const diff = dragRef.current - e.clientX
    dragRef.current = null
    if (Math.abs(diff) > 40) {
      const idx = carouselIdxRef.current
      if (diff > 0 && idx < 3) setCarouselIdx(i => i + 1)
      else if (diff < 0 && idx > 0) setCarouselIdx(i => i - 1)
    }
  }, [])

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
            <div style={{ position:'absolute', top:209, left:0, right:0, height:361, overflow:'hidden' }}>
              <img src={ASSETS.langCollage} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
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
                <JioLogo size={48} />
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
                <JioLogo size={48} />
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
              {/* Loading state shown at bottom while verifying */}
              <div style={{ paddingBottom:40, display:'flex', flexDirection:'column', gap:16 }}>
                <TermsText parts={t.otp.terms} />
                <PillBtn disabled={!otpOk} loading={otpLoading}>
                  {otpLoading ? t.otp.verifying : t.otp.submit}
                </PillBtn>
              </div>
            </div>
          </div>

          {/* ── 5–8. CAROUSEL ── (flex layout = image fills all space, no gap) */}
          <div
            ref={carouselRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={() => { dragRef.current = null }}
            style={{ position:'absolute', inset:0, background:BG, display:'flex', flexDirection:'column',
              userSelect:'none', cursor:'grab' }}
          >
            {/* Reserve space for status bar overlay + 25px image nudge */}
            <div style={{ height:75, flexShrink:0 }} />

            {/* Image — fixed height so bottom panel always has breathing room */}
            <div style={{ height:420, flexShrink:0, overflow:'hidden', position:'relative' }}>
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
                    {i === 1
                      ? <SlideShowBanner isActive={carouselIdx === 1} />
                      : <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', animation:'imgZoom 6s ease-in-out infinite' }} />
                    }
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

            {/* Bottom panel — text+dots grouped tight; button pushed to bottom */}
            <div style={{ flex:1, background:BG, borderRadius:'32px 32px 0 0', padding:'24px 24px 44px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              {/* Title + desc + dots all grouped close together */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
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
                {/* Dots sit just 16px below the description */}
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
              </div>
              {/* CTA row pinned to bottom via space-between on parent */}
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <PillBtn onClick={handleNext} style={{ borderRadius:9999 }}>
                  {slide.cta}
                </PillBtn>
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
                <PillBtn onClick={() => goTo('home')}>{t.done.start}</PillBtn>
              </div>
            </div>
          </div>

          {/* ── 10. HOME DASHBOARD ── */}
          <div ref={homeRef} style={{ position:'absolute', inset:0 }}>
            <HomeDashboard onNavClick={id => { if (id === 'photos') goTo('photos') }} />
          </div>

          {/* ── 11. PHOTOS SECTION ── */}
          <div ref={photosRef} style={{ position:'absolute', inset:0 }}>
            <PhotosSection onBack={() => goTo('home')} />
          </div>

        </div>{/* /screen stack */}
      </div>{/* /phone frame */}
    </div>
  )
}
