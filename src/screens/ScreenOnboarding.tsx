import { useState } from 'react';

interface Props { onFinish: (name: string) => void; }

export function ScreenOnboarding({ onFinish }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');

  function entrar() {
    if (name.trim()) onFinish(name.trim());
  }

  const Dots = () => (
    <div style={{display:'flex',gap:8,marginTop:'auto',paddingBottom:8}}>
      {[1,2,3].map(i => (
        <div key={i} style={{height:6,borderRadius:3,background:step===i?'var(--primary)':'rgba(255,255,255,0.15)',width:step===i?20:6,transition:'all .3s'}}/>
      ))}
    </div>
  );

  const btnStyle: React.CSSProperties = {width:'100%',background:'var(--primary)',border:'none',borderRadius:'var(--r-lg)',padding:15,color:'var(--bg)',fontSize:15,fontWeight:600,cursor:'pointer',marginBottom:8,fontFamily:'inherit'};
  const backStyle: React.CSSProperties = {background:'transparent',border:'none',color:'var(--fg3)',fontSize:13,cursor:'pointer',padding:8,fontFamily:'inherit'};

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100%',padding:'40px 28px',gap:0}}>

      {step === 1 && (
        <>
          <img src="/eggs/estagio1.png" alt="ovo" className="breath" style={{width:130,marginBottom:32,filter:'drop-shadow(0 0 20px rgba(93,232,160,0.2))'}}/>
          <h1 className="font-serif fade-up" style={{fontSize:30,fontWeight:400,textAlign:'center',lineHeight:1.2,marginBottom:10}}>
            Seu dino está<br/>esperando
          </h1>
          <p className="fade-up" style={{fontSize:14,color:'var(--fg3)',textAlign:'center',lineHeight:1.7,marginBottom:40}}>
            Um organizador que respira<br/>no seu ritmo.
          </p>
          <div style={{width:'100%'}}>
            <button style={btnStyle} onClick={()=>setStep(2)}>Começar</button>
          </div>
          <Dots/>
        </>
      )}

      {step === 2 && (
        <>
          <p style={{fontSize:11,letterSpacing:'2px',color:'var(--fg3)',textTransform:'uppercase',marginBottom:24,textAlign:'center'}}>como funciona</p>

          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:16,marginBottom:28}}>
            {[{src:'/eggs/estagio1.png',w:56,label:'começando'},{src:'/eggs/estagio2.png',w:70,label:'evoluindo'},{src:'/eggs/estagio3.png',w:84,label:'nascendo'}].map((e,i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <img src={e.src} alt={e.label} style={{width:e.w,objectFit:'contain',filter:'drop-shadow(0 0 10px rgba(93,232,160,0.2))'}}/>
                <span style={{fontSize:10,color:'var(--fg3)'}}>{e.label}</span>
              </div>
            ))}
          </div>

          <div style={{textAlign:'center',marginBottom:28,padding:'0 8px'}}>
            <p className="font-serif" style={{fontSize:19,fontWeight:300,color:'var(--fg)',lineHeight:1.65,fontStyle:'italic'}}>
              "Cada tarefa é um passo.<br/>Cada passo, um ciclo.<br/>Cada ciclo, um dino."
            </p>
          </div>

          {[
            'Adicione suas tarefas da semana',
            'O ovo evolui a cada tarefa concluída',
            'Com 10 tarefas — seu dino nasce',
          ].map((txt,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',background:'rgba(255,255,255,0.04)',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',marginBottom:8,width:'100%'}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:'rgba(93,232,160,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <span style={{fontSize:12,color:'var(--primary)',fontWeight:600}}>{i+1}</span>
              </div>
              <span style={{fontSize:13,color:'var(--fg2)'}}>{txt}</span>
            </div>
          ))}

          <div style={{width:'100%',marginTop:20}}>
            <button style={btnStyle} onClick={()=>setStep(3)}>Entendi</button>
            <button style={backStyle} onClick={()=>setStep(1)}>Voltar</button>
          </div>
          <Dots/>
        </>
      )}

      {step === 3 && (
        <>
          <img src="/eggs/estagio1.png" alt="ovo" className="breath" style={{width:90,marginBottom:28,filter:'drop-shadow(0 0 16px rgba(93,232,160,0.2))'}}/>
          <h1 className="font-serif" style={{fontSize:28,fontWeight:400,textAlign:'center',lineHeight:1.2,marginBottom:8}}>
            Como posso<br/>te chamar?
          </h1>
          <p style={{fontSize:13,color:'var(--fg3)',textAlign:'center',lineHeight:1.6,marginBottom:28}}>
            Seu dino vai te esperar<br/>todo dia.
          </p>
          <div style={{width:'100%'}}>
            <label style={{display:'block',fontSize:10,fontWeight:600,letterSpacing:'1.2px',color:'var(--fg3)',textTransform:'uppercase',marginBottom:8}}>seu nome</label>
            <input
              type="text" value={name} onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&entrar()}
              placeholder="Digite seu nome..."
              autoFocus
              style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid var(--border2)',borderRadius:'var(--r-lg)',padding:'14px 16px',color:'var(--fg)',fontSize:16,fontFamily:'inherit',outline:'none',marginBottom:20}}
            />
            <button style={{...btnStyle,opacity:name.trim()?1:0.45}} onClick={entrar}>Entrar no DinoTask</button>
            <button style={backStyle} onClick={()=>setStep(2)}>Voltar</button>
          </div>
          <Dots/>
        </>
      )}
    </div>
  );
}
