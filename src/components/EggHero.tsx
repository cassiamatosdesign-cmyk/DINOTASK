import { useState, useEffect, useRef } from 'react';
import { getRarityForUserWeek, getEggImage, getEggStageLabel } from '../lib/rarities';
import { RarityBadge } from './RarityBadge';
import { getDaysRemainingInWeek } from '../lib/storage';
import type { Screen } from '../types';

interface Props {
  doneCount: number;
  userWeekNumber: number;
  startDate: string;
  onNavigate: (s: Screen) => void;
}

export function EggHero({ doneCount, userWeekNumber, startDate, onNavigate }: Props) {
  const rarity      = getRarityForUserWeek(userWeekNumber);
  const eggImg      = getEggImage(doneCount);
  const label       = getEggStageLabel(doneCount);
  const pct         = Math.min((doneCount / 10) * 100, 100);
  const born        = doneCount >= 10;
  const daysLeft    = getDaysRemainingInWeek(startDate);

  const [showBirth, setShowBirth] = useState(false);
  const [birthDone, setBirthDone] = useState(false);
  const [showColecaoCta, setShowColecaoCta] = useState(false);
  const prevDone = useRef(doneCount);

  useEffect(() => {
    if (prevDone.current < 10 && doneCount >= 10 && !birthDone) {
      setShowBirth(true);
      try {
        const audio = new Audio('/sounds/birth.wav');
        audio.volume = 0.7;
        audio.play().catch(() => {});
      } catch {}
      setTimeout(() => { setShowBirth(false); setBirthDone(true); setShowColecaoCta(true); }, 3200);
    }
    prevDone.current = doneCount;
  }, [doneCount, birthDone]);

  return (
    <>
      {/* Animação de nascimento */}
      {showBirth && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,10,20,0.9)', backdropFilter: 'blur(12px)',
        }}>
          <style>{`
            @keyframes dinoIn{from{opacity:0;transform:scale(0.3) translateY(60px)}to{opacity:1;transform:scale(1) translateY(0)}}
            @keyframes dinoOut{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.12) translate(-480px,-400px)}}
            @keyframes glowPulse{0%,100%{opacity:0.4}50%{opacity:1}}
            @keyframes sparkle{0%{opacity:0;transform:scale(0)}50%{opacity:1}100%{opacity:0;transform:scale(1.5) translateY(-20px)}}
          `}</style>
          <div style={{position:'absolute',width:360,height:360,borderRadius:'50%',background:`radial-gradient(ellipse,${rarity.glowColor} 0%,transparent 70%)`,animation:'glowPulse 1s ease-in-out infinite'}}/>
          <div style={{position:'relative',textAlign:'center',animation:'dinoIn .6s cubic-bezier(.22,1,.36,1) both, dinoOut .8s cubic-bezier(.55,0,1,.45) 2.4s both'}}>
            <img src={rarity.dinoImage} alt={rarity.label}
              style={{width:200,height:200,objectFit:'contain',filter:`drop-shadow(0 0 40px ${rarity.glowColor})`}}
            />
            <div className="font-serif" style={{fontSize:24,fontWeight:400,color:'var(--fg)',marginTop:16,lineHeight:1.3}}>
              Dino {rarity.label} nasceu!
            </div>
            <p style={{fontSize:14,color:'var(--fg2)',marginTop:8,fontStyle:'italic',lineHeight:1.6}}>
              "{rarity.whisper}"
            </p>
          </div>
        </div>
      )}

      {/* Hero — ovo centralizado */}
      <div className="glass-hero fade-up delay-1"
        style={{margin:'0 20px',padding:'20px 16px',position:'relative',overflow:'hidden',textAlign:'center'}}
      >
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:220,height:220,background:`radial-gradient(ellipse,${rarity.glowColor} 0%,transparent 70%)`,pointerEvents:'none',transition:'all 0.8s ease'}}/>

        {/* Badge + dias restantes */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:12,position:'relative'}}>
          <RarityBadge rarityId={rarity.id} label={rarity.label}/>
          <span style={{fontSize:11,color:'var(--fg3)'}}>
            Semana {userWeekNumber} · {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'} restantes
          </span>
        </div>

        {/* Ovo ou dino centralizado */}
        <div style={{display:'flex',justifyContent:'center',marginBottom:12,position:'relative'}}>
          <img
            src={born ? rarity.dinoImage : eggImg}
            alt={born ? rarity.label : 'ovo'}
            className="breath"
            style={{width:120,height:120,objectFit:'contain',filter:`drop-shadow(0 0 18px ${rarity.glowColor})`}}
          />
        </div>

        {/* Info */}
        <h2 className="font-serif" style={{fontSize:18,fontWeight:400,color:'var(--fg)',lineHeight:1.2,marginBottom:4,position:'relative'}}>
          {born ? `${rarity.label} nasceu!` : label}
        </h2>
        <p style={{fontSize:12,color:'var(--fg3)',fontStyle:'italic',lineHeight:1.5,marginBottom:born?0:12,position:'relative'}}>
          "{rarity.whisper}"
        </p>

        {/* CTA pós-nascimento */}
        {born && showColecaoCta && (
          <button
            onClick={() => onNavigate('colecao')}
            style={{
              marginTop: 14, position: 'relative',
              background: 'rgba(93,232,160,0.1)',
              border: '1px solid rgba(93,232,160,0.3)',
              borderRadius: 'var(--r-full)',
              padding: '9px 20px',
              color: 'var(--primary)', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            Ver na Coleção ✦
          </button>
        )}

        {/* Barra de progresso */}
        {!born && (
          <div style={{position:'relative'}}>
            <div style={{height:4,background:'rgba(255,255,255,0.08)',borderRadius:'var(--r-full)',overflow:'hidden',marginBottom:6}}>
              <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,var(--primary-dim),var(--primary))',borderRadius:'var(--r-full)',transition:'width .7s cubic-bezier(.22,1,.36,1)'}}/>
            </div>
            <p style={{fontSize:12,color:'var(--fg3)'}}>{doneCount} / 10 tarefas</p>
          </div>
        )}
      </div>
    </>
  );
}
