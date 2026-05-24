import { type ReactNode } from 'react';
import { Home, Compass, Star } from 'lucide-react';
import type { Screen } from '../types';

const TABS = [
  { id:'hoje'     as Screen, label:'Hoje',     Icon:Home    },
  { id:'jornadas' as Screen, label:'Jornadas', Icon:Compass },
  { id:'colecao'  as Screen, label:'Coleção',  Icon:Star    },
] as const;

interface Props { children: ReactNode; current: Screen; onNavigate:(s:Screen)=>void; }

export function MobileShell({ children, current, onNavigate }: Props) {
  return (
    <div style={{position:'relative',display:'flex',flexDirection:'column',width:'100%',height:'100%',maxWidth:440,margin:'0 auto',overflow:'hidden'}}>
      <main style={{flex:1,overflowY:'auto',overflowX:'hidden',paddingBottom:'calc(var(--nav-h) + var(--nav-pb) + 8px)'}}>
        {children}
      </main>
      <nav style={{position:'absolute',bottom:0,left:0,right:0,height:'var(--nav-h)',display:'flex',justifyContent:'center',alignItems:'flex-end',padding:'0 16px var(--nav-pb)',zIndex:100,pointerEvents:'none'}}>
        <div style={{pointerEvents:'all',display:'flex',width:'100%',maxWidth:400,alignItems:'center',justifyContent:'space-around',gap:4,borderRadius:'var(--r-full)',padding:'6px 8px',background:'rgba(20,29,46,0.92)',border:'1px solid var(--border2)',backdropFilter:'blur(24px)'}}>
          {TABS.map(({id,label,Icon})=>{
            const active = current===id;
            return (
              <button key={id} onClick={()=>onNavigate(id)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'8px 4px',borderRadius:'var(--r-full)',background:active?'rgba(255,255,255,0.07)':'transparent',color:active?'var(--fg)':'var(--fg3)',fontSize:10,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'inherit',transition:'all .2s',minHeight:'unset'}}>
                <Icon size={18} strokeWidth={active?2:1.5} style={{color:active?'var(--primary)':'currentColor'}}/>
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
