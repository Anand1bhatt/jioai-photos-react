import { useState } from 'react'

// ── Design tokens ────────────────────────────────────────────────────────────
const BG      = '#001d2e'
const SURF    = '#002a40'     // BNB background (Figma exact)
const BLUE    = '#278bc1'
const GREEN   = '#40bc3b'     // Photos active tab colour
const BNB_BG  = '#002a40'     // Bottom nav background
const FILTER_BG = 'rgba(0,120,173,0.24)'
const INACTIVE_CHIP = 'rgba(36,38,43,0.5)'
const GLASS   = 'rgba(36,38,43,0.21)'
const DIM     = 'rgba(0,13,20,0.72)'
const WH      = 'white'
const MED     = 'rgba(255,255,255,0.77)'
const LOW     = 'rgba(255,255,255,0.54)'
const DIV     = 'rgba(255,255,255,0.1)'

// ── Photo assets (Figma CDN – all use loading="lazy") ────────────────────────
const PA = {
  p0:    'https://www.figma.com/api/mcp/asset/1690bebf-4da2-4fac-b307-8ce585613355',
  p1:    'https://www.figma.com/api/mcp/asset/ba35894f-bd61-4ee9-ba1b-b7a27b7d901c',
  p2:    'https://www.figma.com/api/mcp/asset/b1b78506-e739-4e18-9cbc-e6a90e383855',
  p3:    'https://www.figma.com/api/mcp/asset/8f166413-41d1-4a35-b6f0-e8bdc924ccd0',
  p4:    'https://www.figma.com/api/mcp/asset/f5fbc6da-ffdc-4f14-a0ba-5b1c26c0061d',
  p5:    'https://www.figma.com/api/mcp/asset/aa03dfb8-1773-4430-a8dd-6bda3d5d3585',
  p6:    'https://www.figma.com/api/mcp/asset/0ce40a95-899c-441b-8c9e-42651a1e8ef5',
  p7:    'https://www.figma.com/api/mcp/asset/3f01cbdc-c1f8-4c50-b8d2-07178a2f83a4',
  full:  'https://www.figma.com/api/mcp/asset/e153ea41-cc8d-42dc-aceb-eca8c526772e',
  video: 'https://www.figma.com/api/mcp/asset/750d86c5-5718-493f-8a82-207fc55442e4',
}

const APRIL = [
  { id:0, img:PA.p0, video:null },
  { id:1, img:PA.p1, video:'03:35' },
  { id:2, img:PA.p2, video:null },
  { id:3, img:PA.p3, video:null },
  { id:4, img:PA.p4, video:null },
  { id:5, img:PA.p5, video:'03:35' },
  { id:6, img:PA.p6, video:null },
  { id:7, img:PA.p7, video:null },
  { id:8, img:PA.p6, video:null },
]
const MARCH = [
  { id:9,  img:PA.p0, video:null },
  { id:10, img:PA.p1, video:null },
  { id:11, img:PA.p2, video:null },
  { id:12, img:PA.p3, video:null },
  { id:13, img:PA.p5, video:null },
  { id:14, img:PA.p7, video:null },
]
const ALL_PHOTOS = [...APRIL, ...MARCH]

// ── Icons ────────────────────────────────────────────────────────────────────
const ChevLeft = ({ size=20, color=WH }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const SearchIcon = ({ size=20, color=WH }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="1.8"/>
    <path d="M16 16L21 21" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)
const DotsIcon = ({ size=20, color=WH }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5" r="1.5" fill={color}/>
    <circle cx="12" cy="12" r="1.5" fill={color}/>
    <circle cx="12" cy="19" r="1.5" fill={color}/>
  </svg>
)
const FilterIcon = ({ size=18, color=WH }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 6H20M7 12H17M10 18H14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
const SparkleIcon = ({ size=16, color=WH }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" fill={color}/>
  </svg>
)
const PlayBadge = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <path d="M2 1.5L6.5 4L2 6.5V1.5Z" fill="white"/>
  </svg>
)

// Photos nav icon (active = green filled, inactive = faded)
const PhotosNavIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="1.5" y="2.5" width="17" height="15" rx="2"
      stroke={active ? GREEN : MED} strokeWidth="1.5"/>
    <circle cx="6.5" cy="7.5" r="1.5" fill={active ? GREEN : MED}/>
    <path d="M1.5 13L5.5 9.5L8.5 12.5L12.5 8.5L18.5 13"
      stroke={active ? GREEN : MED} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// AI Camera icon (sparkle, used inside 48px circle)
const AICamIcon = ({ size=24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill={WH}/>
    <path d="M19 17L19.9 19.1L22 20L19.9 20.9L19 23L18.1 20.9L16 20L18.1 19.1L19 17Z" fill={WH} opacity="0.8"/>
    <path d="M5 4L5.7 5.8L7.5 6.5L5.7 7.2L5 9L4.3 7.2L2.5 6.5L4.3 5.8L5 4Z" fill={WH} opacity="0.6"/>
  </svg>
)

// ── Shared: Photos BNB (used in all grid views) ──────────────────────────────
function PhotosBNB({ onGoHome }) {
  const items = [
    { id:'home',    label:'Home',
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 7.5L10 2.5L17.5 7.5V17.5H12.5V12.5H7.5V17.5H2.5V7.5Z" stroke={MED} strokeWidth="1.5" strokeLinejoin="round"/></svg>
    },
    { id:'photos',  label:'Photos', active: true,
      icon: <PhotosNavIcon active />
    },
    { id:'camera',  label:'AI Camera', special: true },
    { id:'files',   label:'Files',
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3H11L16 8V17H4V3Z" stroke={MED} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 3V8H16" stroke={MED} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    },
    { id:'create',  label:'Create',
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={MED} strokeWidth="1.4"/><path d="M10 7V13M7 10H13" stroke={MED} strokeWidth="1.6" strokeLinecap="round"/></svg>
    },
  ]
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:68,
      background:BNB_BG, borderTop:`0.5px solid rgba(255,255,255,0.12)`,
      display:'flex', alignItems:'flex-start', padding:'2px 16px 4px', zIndex:5 }}>
      {items.map(n => {
        if (n.special) return (
          <div key="camera" style={{ flex:1, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'flex-end', gap:4, height:64,
            paddingBottom:9, cursor:'pointer' }}>
            {/* 48px AI Camera circle with border */}
            <div style={{ width:48, height:48, borderRadius:'50%',
              border:`3px solid rgba(39,139,193,0.2)`,
              background:'linear-gradient(90deg,#002a40,#002a40)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <AICamIcon size={24} />
            </div>
            <span style={{ fontSize:12, fontWeight:500, color:MED, lineHeight:'12px' }}>AI Camera</span>
          </div>
        )
        return (
          <button key={n.id} onClick={n.id==='home' ? onGoHome : undefined}
            style={{ flex:1, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:6, height:64,
              background:'none', border:'none', cursor:'pointer', padding:'4px 2px' }}>
            {n.icon}
            <span style={{ fontSize:12, lineHeight:'12px',
              fontWeight: n.active ? 700 : 500,
              color: n.active ? GREEN : MED }}>{n.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Filter tabs pill ─────────────────────────────────────────────────────────
function FilterPill({ activeTab, onChange }) {
  const tabs = ['All','Month','Year']
  return (
    <div style={{ position:'absolute', bottom:76, left:'50%', transform:'translateX(-50%)',
      width:280, background:FILTER_BG, borderRadius:32, padding:6,
      display:'flex', gap:0, zIndex:10 }}>
      {tabs.map(t => {
        const isActive = activeTab === t
        return (
          <button key={t} onClick={() => onChange(t)}
            style={{ flex:1, minHeight:35, background: isActive ? 'transparent' : INACTIVE_CHIP,
              borderRadius:9999, border:'none', cursor:'pointer',
              padding:'3.5px 17.5px' }}>
            <span style={{ fontSize:14, fontWeight:700, color:WH, whiteSpace:'nowrap' }}>{t}</span>
          </button>
        )
      })}
      {/* Filter/sort icon */}
      <button style={{ flex:1, minHeight:35, background:'transparent',
        borderRadius:9999, border:'none', cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <FilterIcon size={18} />
      </button>
    </div>
  )
}

// ── Grid tile (shared) ───────────────────────────────────────────────────────
function Tile({ img, video, size, radius=9.5, selectable, selected, onClick }) {
  return (
    <div onClick={onClick}
      style={{ position:'relative', width:size||'auto', height:size||'auto',
        borderRadius:radius, overflow:'hidden', flexShrink:0,
        aspectRatio: size ? undefined : '1', cursor:'pointer' }}>
      <img src={img} alt="" loading="lazy"
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      {video && (
        <div style={{ position:'absolute', bottom:6, right:6, display:'flex',
          alignItems:'center', gap:3, background:'rgba(0,0,0,0.45)',
          borderRadius:4, padding:'2px 5px' }}>
          <span style={{ fontSize:10, fontWeight:600, color:WH }}>{video}</span>
          <PlayBadge />
        </div>
      )}
      {selectable && (
        <div style={{ position:'absolute', inset:0,
          background: selected ? 'rgba(39,139,193,0.22)' : 'transparent',
          display:'flex', alignItems:'flex-start', justifyContent:'flex-end', padding:6 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11"
              fill={selected ? BLUE : 'none'}
              stroke={selected ? 'none' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5"/>
            {selected && <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>}
          </svg>
        </div>
      )}
    </div>
  )
}

// ── "All" tab grid (flat 3-col, no headings) ─────────────────────────────────
function GridAll({ photos, selectable, selected, onTap }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)',
      gap:2, width:'100%' }}>
      {photos.map(p => (
        <Tile key={p.id} img={p.img} video={p.video}
          selectable={selectable} selected={selected?.has(p.id)}
          onClick={() => onTap?.(p)} />
      ))}
    </div>
  )
}

// ── "Month" tab grid (sections with month headings) ──────────────────────────
function GridMonth({ onTap }) {
  const sections = [
    { label:'April 2026', photos: APRIL },
    { label:'March 2026', photos: MARCH },
  ]
  return (
    <>
      {sections.map(s => (
        <div key={s.label}>
          <p style={{ fontSize:28, fontWeight:900, color:WH,
            padding:'20px 16px 10px', margin:0, lineHeight:'28px' }}>{s.label}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)',
            gap:2, width:'100%' }}>
            {s.photos.map(p => (
              <Tile key={p.id} img={p.img} video={p.video}
                onClick={() => onTap?.(p)} />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

// ── "Year" tab grid (hero+small layout, 105px tiles, gap:6px) ────────────────
function GridYear({ onTap }) {
  const sections = [
    { label:'2026', photos: APRIL },
    { label:'2025', photos: MARCH },
  ]
  return (
    <>
      {sections.map((s, si) => (
        <div key={s.label} style={{ padding:'0 16px', width:'100%', boxSizing:'border-box' }}>
          <p style={{ fontSize:20, fontWeight:900, color:WH, margin:'20px 0 12px',
            lineHeight:'20px' }}>{s.label}</p>
          {/* First section: hero (217px) + 2 small (105px) stacked, then more small tiles */}
          {si === 0 ? (
            <>
              {/* Top row: big + 2 small */}
              <div style={{ display:'flex', gap:6, marginBottom:6 }}>
                <Tile img={s.photos[0]?.img} size={217} radius={10.5}
                  onClick={() => onTap?.(s.photos[0])} />
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <Tile img={s.photos[1]?.img} video={s.photos[1]?.video}
                    size={105} radius={10.5} onClick={() => onTap?.(s.photos[1])} />
                  <Tile img={s.photos[2]?.img} size={105} radius={10.5}
                    onClick={() => onTap?.(s.photos[2])} />
                </div>
              </div>
              {/* Remaining tiles flex-wrap */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {s.photos.slice(3).map(p => (
                  <Tile key={p.id} img={p.img} video={p.video}
                    size={105} radius={10.5} onClick={() => onTap?.(p)} />
                ))}
              </div>
            </>
          ) : (
            /* Subsequent years: all 105px tiles in flex-wrap */
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {s.photos.map(p => (
                <Tile key={p.id} img={p.img} video={p.video}
                  size={105} radius={10.5} onClick={() => onTap?.(p)} />
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}

// ── Photos header ────────────────────────────────────────────────────────────
function PhotosHeader({ onBack, title='Photos', topPad=20, right }) {
  return (
    <div style={{ background:BG, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:`${topPad}px 16px 8px`, height:56 }}>
        <div style={{ display:'flex', alignItems:'center', gap:4, flex:1 }}>
          <button onClick={onBack} style={{ width:32, height:32, background:'none',
            border:'none', display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', padding:0, flexShrink:0 }}>
            <ChevLeft size={24} />
          </button>
          <span style={{ fontSize:20, fontWeight:700, color:WH, lineHeight:'24px' }}>{title}</span>
        </div>
        {right && <div style={{ display:'flex', alignItems:'center', gap:8 }}>{right}</div>}
      </div>
      <div style={{ height:1, background:DIV }} />
    </div>
  )
}

// ── View 1: Photos Grid (All / Month / Year) ─────────────────────────────────
function ViewGrid({ onBack, onPhotoTap, onVideoTap, onSelectMode }) {
  const [tab, setTab] = useState('Month')

  const handleTap = p => { p.video ? onVideoTap(p) : onPhotoTap(p) }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%',
      background:BG, overflow:'hidden', position:'relative' }}>

      <PhotosHeader onBack={onBack} title="Photos" topPad={20}
        right={
          <>
            <button onClick={onSelectMode} style={{ background:'none', border:'none',
              cursor:'pointer', fontSize:13, fontWeight:600, color:BLUE, padding:0 }}>
              Select
            </button>
            <button style={{ width:32, height:32, background:'none', border:'none',
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', padding:0 }}>
              <SearchIcon size={20} />
            </button>
          </>
        }
      />

      {/* Scrollable content — bottom padding clears BNB + filter pill */}
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden',
        paddingBottom:148 }}>
        {tab === 'All'   && <GridAll   photos={ALL_PHOTOS} onTap={handleTap} />}
        {tab === 'Month' && <GridMonth onTap={handleTap} />}
        {tab === 'Year'  && <GridYear  onTap={handleTap} />}
      </div>

      {/* Filter pill — above BNB */}
      <FilterPill activeTab={tab} onChange={setTab} />

      {/* BNB */}
      <PhotosBNB onGoHome={onBack} />
    </div>
  )
}

// ── View 2: Single Image View ────────────────────────────────────────────────
function CloudIcon({ size=16, color=WH }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 10H16.74C16.36 7.81 14.44 6.17 12.15 6C10.23 5.84 8.49 6.81 7.49 8.4C5.55 8.61 4 10.27 4 12.25C4 14.33 5.67 16 7.75 16H18C19.66 16 21 14.66 21 13C21 11.34 19.66 10 18 10Z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13V18M10 16L12 18L14 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PhotoActionBar({ onEdit, onShare, onDelete }) {
  const items = [
    { label:'Edit',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 20H21" stroke={MED} strokeWidth="1.7" strokeLinecap="round"/><path d="M16.5 3.5C16.89 3.11 17.41 2.89 17.96 2.89C18.51 2.89 19.04 3.11 19.43 3.5C19.82 3.89 20.04 4.42 20.04 4.97C20.04 5.52 19.82 6.05 19.43 6.44L7 19L3 20L4 16L16.5 3.5Z" stroke={MED} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      onClick:onEdit },
    { label:'Share',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V12" stroke={MED} strokeWidth="1.8" strokeLinecap="round"/><path d="M12 3V15M8 7L12 3L16 7" stroke={MED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      onClick:onShare },
    { label:'Delete',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6H21" stroke={MED} strokeWidth="1.7" strokeLinecap="round"/><path d="M8 6V4H16V6" stroke={MED} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 6L6 20H18L19 6" stroke={MED} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11V17M14 11V17" stroke={MED} strokeWidth="1.5" strokeLinecap="round"/></svg>,
      onClick:onDelete },
  ]
  return (
    <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)',
      width:272, height:64, background:FILTER_BG, borderRadius:100,
      display:'flex', alignItems:'center', padding:'0 16px' }}>
      {items.map((it,i) => (
        <button key={i} onClick={it.onClick} style={{ flex:1, display:'flex',
          flexDirection:'column', alignItems:'center', justifyContent:'center',
          gap:6, height:64, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          {it.icon}
          <span style={{ fontSize:12, fontWeight:500, color:MED, lineHeight:'12px' }}>{it.label}</span>
        </button>
      ))}
    </div>
  )
}

function ViewImage({ photo, onBack, onMore, onDelete }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%',
      background:'#000', overflow:'hidden', position:'relative' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:10,
        background:'linear-gradient(to bottom, rgba(0,13,20,0.7) 0%, rgba(0,0,0,0) 100%)',
        padding:'16px 16px 32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          height:56, paddingTop:4 }}>
          <button onClick={onBack} style={{ width:32, height:32, background:'none',
            border:'none', display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', padding:0 }}>
            <ChevLeft size={24} />
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button style={{ display:'flex', alignItems:'center', gap:4,
              background:'rgba(0,29,46,0.7)', borderRadius:9999, border:'none',
              padding:'4px 10px 4px 8px', cursor:'pointer' }}>
              <CloudIcon size={16} color={BLUE} />
              <span style={{ fontSize:14, fontWeight:700, color:WH }}>Back up now</span>
            </button>
            <button onClick={onMore} style={{ width:28, height:28, background:'none',
              border:'none', display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', padding:0 }}>
              <DotsIcon size={20} />
            </button>
          </div>
        </div>
      </div>
      <img src={photo?.img || PA.full} alt="" loading="lazy"
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      <div style={{ position:'absolute', bottom:96, left:'50%', transform:'translateX(-50%)' }}>
        <button style={{ display:'flex', alignItems:'center', gap:6, background:GLASS,
          borderRadius:9999, boxShadow:'0 6px 28px rgba(12,13,16,0.08)',
          border:'none', padding:'6px 14px 6px 16px', cursor:'pointer' }}>
          <span style={{ fontSize:16, fontWeight:700, color:WH }}>Edit with JioAI</span>
          <SparkleIcon size={18} />
        </button>
      </div>
      <PhotoActionBar onEdit={()=>{}} onShare={()=>{}} onDelete={onDelete} />
    </div>
  )
}

// ── View 3: Image with More dropdown ─────────────────────────────────────────
function ViewImageMore({ photo, onBack, onDetails, onHideMenu, onDelete }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%',
      background:'#000', overflow:'hidden', position:'relative' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:10,
        background:'linear-gradient(to bottom, rgba(0,13,20,0.7) 0%, rgba(0,0,0,0) 100%)',
        padding:'16px 16px 32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          height:56, paddingTop:4 }}>
          <button onClick={onBack} style={{ width:32, height:32, background:'none',
            border:'none', display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', padding:0 }}>
            <ChevLeft size={24} />
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button style={{ display:'flex', alignItems:'center', gap:4,
              background:'rgba(0,29,46,0.7)', borderRadius:9999, border:'none',
              padding:'4px 10px 4px 8px', cursor:'pointer' }}>
              <CloudIcon size={16} color={BLUE} />
              <span style={{ fontSize:14, fontWeight:700, color:WH }}>Back up now</span>
            </button>
            <button onClick={onHideMenu} style={{ width:28, height:28, background:'none',
              border:'none', display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', padding:0 }}>
              <DotsIcon size={20} />
            </button>
          </div>
        </div>
        {/* Dropdown */}
        <div style={{ position:'absolute', top:72, right:16, background:SURF,
          borderRadius:8, minWidth:145, overflow:'hidden',
          boxShadow:'0 4px 24px rgba(0,0,0,0.4)', zIndex:20 }}>
          <button onClick={onDetails} style={{ width:'100%', padding:'12px 16px',
            background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
            <span style={{ fontSize:14, color:WH }}>Details</span>
          </button>
          <div style={{ height:0.5, background:'rgba(255,255,255,0.12)', margin:'0 16px' }} />
          <button style={{ width:'100%', padding:'12px 16px',
            background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
            <span style={{ fontSize:14, color:WH }}>Rename</span>
          </button>
        </div>
      </div>
      <img src={photo?.img || PA.full} alt="" loading="lazy"
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      <div style={{ position:'absolute', bottom:96, left:'50%', transform:'translateX(-50%)' }}>
        <button style={{ display:'flex', alignItems:'center', gap:6, background:GLASS,
          borderRadius:9999, border:'none', padding:'6px 14px 6px 16px', cursor:'pointer' }}>
          <span style={{ fontSize:16, fontWeight:700, color:WH }}>Edit with JioAI</span>
          <SparkleIcon size={18} />
        </button>
      </div>
      <PhotoActionBar onEdit={()=>{}} onShare={()=>{}} onDelete={onDelete} />
    </div>
  )
}

// ── View 4: Details ───────────────────────────────────────────────────────────
function ViewDetails({ photo, onBack }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%',
      background:BG, overflow:'hidden' }}>
      <PhotosHeader onBack={onBack} title="" topPad={20}
        right={
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button style={{ display:'flex', alignItems:'center', gap:4,
              background:'none', borderRadius:9999, border:'none',
              padding:'4px 10px 4px 8px', cursor:'pointer' }}>
              <CloudIcon size={16} color={BLUE} />
              <span style={{ fontSize:14, fontWeight:700, color:WH }}>Back up now</span>
            </button>
            <DotsIcon size={20} color={MED} />
          </div>
        }
      />
      <div style={{ flex:1, display:'flex', gap:16, padding:'24px 16px',
        alignItems:'flex-start', overflow:'hidden' }}>
        <div style={{ width:120, flexShrink:0, height:320, borderRadius:16, overflow:'hidden' }}>
          <img src={photo?.img || PA.full} alt="" loading="lazy"
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        </div>
        <div style={{ flex:1, background:SURF, borderRadius:24, padding:24,
          display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:16, fontWeight:500, color:WH, lineHeight:'22px' }}>IMG612767.JPG</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke={BLUE} strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 5L19 9" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ height:0.5, background:'rgba(255,255,255,0.12)' }} />
          {[
            { l:'Location', v:'Navi Mumbai, Maharashtra' },
            { l:'Date',     v:'18 March 2026, 14:30 IST' },
            { l:'File Size',v:'3.56 MB' },
          ].map(r => (
            <div key={r.l} style={{ display:'flex', flexDirection:'column', gap:2 }}>
              <span style={{ fontSize:14, fontWeight:500, color:WH }}>{r.l}</span>
              <span style={{ fontSize:12, color:LOW }}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>
      <PhotoActionBar onEdit={()=>{}} onShare={()=>{}} onDelete={()=>{}} />
    </div>
  )
}

// ── View 5: Selection mode ────────────────────────────────────────────────────
function ViewSelect({ onBack, onDelete, selected, onToggle }) {
  const count = selected.size
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%',
      background:BG, overflow:'hidden' }}>
      <PhotosHeader onBack={onBack}
        title={count > 0 ? `${count} Item selected` : 'Select'} topPad={20} />
      <div style={{ flex:1, overflowY:'auto', paddingBottom:80 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
          {ALL_PHOTOS.map(p => (
            <Tile key={p.id} img={p.img} video={p.video}
              selectable selected={selected.has(p.id)}
              onClick={() => onToggle(p.id)} />
          ))}
        </div>
      </div>
      {count > 0 && (
        <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)',
          width:272, height:64, background:FILTER_BG, borderRadius:100,
          display:'flex', alignItems:'center', padding:'0 16px', zIndex:10 }}>
          {[
            { label:'Share', onClick:()=>{}, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V12" stroke={MED} strokeWidth="1.8" strokeLinecap="round"/><path d="M12 3V15M8 7L12 3L16 7" stroke={MED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { label:'Delete', onClick:onDelete, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6H21" stroke={MED} strokeWidth="1.7" strokeLinecap="round"/><path d="M8 6V4H16V6M5 6L6 20H18L19 6" stroke={MED} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          ].map((it,i) => (
            <button key={i} onClick={it.onClick} style={{ flex:1, display:'flex',
              flexDirection:'column', alignItems:'center', justifyContent:'center',
              gap:6, height:64, background:'none', border:'none', cursor:'pointer', padding:0 }}>
              {it.icon}
              <span style={{ fontSize:12, fontWeight:500, color:MED }}>{it.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── View 6: Delete confirmation ───────────────────────────────────────────────
function ViewDeleteConfirm({ onCancel, onConfirm }) {
  return (
    <div style={{ position:'relative', height:'100%', overflow:'hidden', background:BG }}>
      <div style={{ position:'absolute', inset:0, filter:'blur(2px)', opacity:0.4 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
          {ALL_PHOTOS.map(p => (
            <div key={p.id} style={{ aspectRatio:'1', overflow:'hidden' }}>
              <img src={p.img} alt="" loading="lazy"
                style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:'absolute', inset:0, background:DIM }} />
      <div style={{ position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)', background:SURF, borderRadius:20,
        padding:28, width:300, display:'flex', flexDirection:'column', gap:24 }}>
        <p style={{ fontSize:20, fontWeight:700, color:WH, textAlign:'center',
          lineHeight:'26px', margin:0 }}>
          Are you sure you want to delete this image?
        </p>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={onConfirm} style={{ flex:1, height:44, background:'#14273a',
            borderRadius:9999, border:'none', cursor:'pointer' }}>
            <span style={{ fontSize:16, fontWeight:700, color:WH }}>Delete</span>
          </button>
          <button onClick={onCancel} style={{ flex:1, height:44, background:BLUE,
            borderRadius:9999, border:'none', cursor:'pointer' }}>
            <span style={{ fontSize:16, fontWeight:700, color:WH }}>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── View 7: Video Player ──────────────────────────────────────────────────────
function ViewVideo({ photo, onBack, onDelete }) {
  const [playing, setPlaying] = useState(false)
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%',
      background:BG, position:'relative' }}>
      <div style={{ background:BG, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 16px 8px', height:56 }}>
          <button onClick={onBack} style={{ width:32, height:32, background:'none',
            border:'none', display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', padding:0 }}>
            <ChevLeft size={24} />
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button style={{ display:'flex', alignItems:'center', gap:4,
              background:'none', borderRadius:9999, border:'none',
              padding:'4px 10px 4px 8px', cursor:'pointer' }}>
              <CloudIcon size={16} color={BLUE} />
              <span style={{ fontSize:14, fontWeight:700, color:WH }}>Back up now</span>
            </button>
            <DotsIcon size={20} color={MED} />
          </div>
        </div>
        <div style={{ height:1, background:DIV }} />
      </div>
      <div style={{ width:'100%', aspectRatio:'1', overflow:'hidden', position:'relative', flexShrink:0 }}>
        <img src={photo?.img || PA.video} alt="" loading="lazy"
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        {!playing && (
          <div onClick={() => setPlaying(true)}
            style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
              justifyContent:'center', background:'rgba(0,0,0,0.2)', cursor:'pointer' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(0,0,0,0.5)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M8 5L19 12L8 19V5Z" fill="white"/>
              </svg>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:'16px 20px 12px', display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={() => setPlaying(p => !p)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}>
            {playing
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 5L19 12L8 19V5Z" fill="white"/></svg>
            }
          </button>
          <span style={{ fontSize:12, color:WH }}>01:15 / 03:35</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke={WH} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.07 4.93C20.9 6.76 22 9.25 22 12C22 14.75 20.9 17.24 19.07 19.07" stroke={WH} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M15.54 8.46C16.47 9.39 17 10.66 17 12C17 13.34 16.47 14.61 15.54 15.54" stroke={WH} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ position:'relative', height:3, borderRadius:30 }}>
          <div style={{ position:'absolute', inset:0, background:MED, borderRadius:30 }} />
          <div style={{ position:'absolute', left:0, top:0, bottom:0,
            width:'34.9%', background:BLUE, borderRadius:30 }} />
        </div>
      </div>
      <PhotoActionBar onEdit={()=>{}} onShare={()=>{}} onDelete={onDelete} />
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function PhotosSection({ onBack }) {
  const [view,    setView]   = useState('grid')
  const [photo,   setPhoto]  = useState(APRIL[0])
  const [selected,setSel]    = useState(new Set())

  const openPhoto = p => { setPhoto(p); setView('imageView') }
  const openVideo = p => { setPhoto(p); setView('videoView') }

  const toggleSel = id => setSel(prev => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s
  })

  if (view === 'grid')
    return <ViewGrid onBack={onBack} onPhotoTap={openPhoto} onVideoTap={openVideo}
      onSelectMode={() => { setSel(new Set([0,3])); setView('select') }} />
  if (view === 'imageView')
    return <ViewImage photo={photo} onBack={() => setView('grid')}
      onMore={() => setView('imageMore')} onDelete={() => setView('deleteConfirm')} />
  if (view === 'imageMore')
    return <ViewImageMore photo={photo} onBack={() => setView('grid')}
      onDetails={() => setView('details')} onHideMenu={() => setView('imageView')}
      onDelete={() => setView('deleteConfirm')} />
  if (view === 'details')
    return <ViewDetails photo={photo} onBack={() => setView('imageMore')} />
  if (view === 'select')
    return <ViewSelect onBack={() => { setSel(new Set()); setView('grid') }}
      onDelete={() => setView('deleteConfirm')} selected={selected} onToggle={toggleSel} />
  if (view === 'deleteConfirm')
    return <ViewDeleteConfirm
      onCancel={() => setView(selected.size > 0 ? 'select' : 'imageView')}
      onConfirm={() => { setSel(new Set()); setView('grid') }} />
  if (view === 'videoView')
    return <ViewVideo photo={photo} onBack={() => setView('grid')}
      onDelete={() => setView('deleteConfirm')} />
  return null
}
