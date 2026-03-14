'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://jkxnpwbnxmteehlhomlr.supabase.co/functions/v1/api'
const fmt = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n))

function Sidebar({ active, setActive }) {
  const nav = [
    { id: 'dashboard', label: 'Дашборд' },
    { id: 'properties', label: 'Объекты' },
    { id: 'transactions', label: 'Транзакции' },
    { id: 'owners', label: 'Владельцы' },
    { id: 'report', label: 'Отчёты' },
  ]
  return (
    <aside style={{ width:220, background:'#fff', borderRight:'0.5px solid #E8E6E0', display:'flex', flexDirection:'column', padding:'28px 0', flexShrink:0, minHeight:'100vh' }}>
      <div style={{ padding:'0 20px 32px', fontFamily:'monospace', fontSize:15, color:'#1A1917' }}>Ground<span style={{color:'#9E9B94'}}>Floor</span></div>
      {nav.map(n => (
        <button key={n.id} onClick={() => setActive(n.id)} style={{ padding:'9px 20px', fontSize:13, color:active===n.id?'#1A1917':'#6B6961', background:active===n.id?'#F7F6F3':'transparent', border:'none', cursor:'pointer', textAlign:'left', fontWeight:active===n.id?500:400, width:'100%', borderLeft:active===n.id?'2px solid #1A1917':'2px solid transparent' }}>{n.label}</button>
      ))}
    </aside>
  )
}

const inp = { padding:'9px 12px', border:'0.5px solid #E8E6E0', borderRadius:8, fontSize:13, background:'#F7F6F3', color:'#1A1917', outline:'none', width:'100%', fontFamily:'inherit' }
const btn = (e={}) => ({ padding:'9px 18px', background:'#1A1917', color:'#fff', border:'none', borderRadius:8, fontSize:13, cursor:'pointer', fontFamily:'inherit', ...e })
const bD = { padding:'6px 12px', background:'#FBF0EE', color:'#B03A2E', border:'0.5px solid #F5C4B3', borderRadius:6, fontSize:12, cursor:'pointer', fontFamily:'inherit' }
const bE = { padding:'6px 12px', background:'#F7F6F3', color:'#6B6961', border:'0.5px solid #E8E6E0', borderRadius:6, fontSize:12, cursor:'pointer', fontFamily:'inherit' }

function Badge({ status }) {
  const m = { rented:{label:'Сдаётся',bg:'#EAF5F0',color:'#1A7A5E'}, vacant:{label:'Свободен',bg:'#F5F4F0',color:'#6B6961'}, renovation:{label:'Ремонт',bg:'#FFF8EC',color:'#9A6A00'} }
  const s = m[status]||m.vacant
  return <span style={{fontSize:11,padding:'3px 9px',borderRadius:20,background:s.bg,color:s.color,fontWeight:500}}>{s.label}</span>
}

function Metric({ label, value, color }) {
  return <div style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,padding:'20px'}}>
    <div style={{fontSize:11,color:'#9E9B94',letterSpacing:'0.6px',textTransform:'uppercase',marginBottom:10}}>{label}</div>
    <div style={{fontSize:24,fontWeight:500,color:color||'#1A1917',letterSpacing:'-0.5px',fontFamily:'monospace'}}>{value}</div>
  </div>
}

function Dashboard({ properties, transactions }) {
  const inc = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0)
  const exp = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0)
  return (
    <div>
      <div style={{marginBottom:28}}><h1 style={{fontSize:24,fontWeight:500,letterSpacing:'-0.5px'}}>Март 2026</h1><p style={{fontSize:13,color:'#9E9B94',marginTop:3}}>Сводка по всем объектам</p></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:32}}>
        <Metric label="Доходы" value={fmt(inc)+' сум'} color="#1A7A5E"/>
        <Metric label="Расходы" value={fmt(exp)+' сум'} color="#B03A2E"/>
        <Metric label="Прибыль" value={fmt(inc-exp)+' сум'}/>
      </div>
      <div style={{fontSize:11,color:'#9E9B94',letterSpacing:'0.6px',textTransform:'uppercase',marginBottom:14}}>Объекты</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:32}}>
        {properties.map(p => {
          const pi=transactions.filter(t=>t.property_id===p.id&&t.type==='income').reduce((s,t)=>s+Number(t.amount),0)
          const pe=transactions.filter(t=>t.property_id===p.id&&t.type==='expense').reduce((s,t)=>s+Number(t.amount),0)
          return <div key={p.id} style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,padding:'16px 18px'}}>
            <div style={{fontSize:14,fontWeight:500,marginBottom:3}}>{p.name}</div>
            <div style={{fontSize:12,color:'#9E9B94',marginBottom:14}}>{p.address}</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <Badge status={p.status}/>
              {pi-pe!==0&&<span style={{fontSize:13,fontWeight:500,color:pi-pe>0?'#1A7A5E':'#B03A2E',fontFamily:'monospace'}}>{pi-pe>0?'+':''}{fmt(pi-pe)}</span>}
            </div>
          </div>
        })}
      </div>
      <div style={{fontSize:11,color:'#9E9B94',letterSpacing:'0.6px',textTransform:'uppercase',marginBottom:14}}>Транзакции</div>
      <div style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 130px 60px 110px',padding:'9px 18px',background:'#F7F6F3',fontSize:11,color:'#9E9B94',textTransform:'uppercase'}}>
          <span>Описание</span><span>Объект</span><span>Дата</span><span style={{textAlign:'right'}}>Сумма</span>
        </div>
        {transactions.slice(0,8).map((t,i)=>(
          <div key={t.id} style={{display:'grid',gridTemplateColumns:'1fr 130px 60px 110px',padding:'11px 18px',alignItems:'center',fontSize:13,borderTop:i>0?'0.5px solid #F0EEE9':'none'}}>
            <div><div style={{fontWeight:500}}>{t.note||t.category}</div><div style={{fontSize:11,color:'#9E9B94'}}>{t.category}</div></div>
            <span style={{fontSize:12,color:'#6B6961'}}>{t.property_name}</span>
            <span style={{fontSize:12,color:'#9E9B94'}}>{new Date(t.date).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'})}</span>
            <span style={{textAlign:'right',fontWeight:500,fontFamily:'monospace',color:t.type==='income'?'#1A7A5E':'#B03A2E'}}>{t.type==='income'?'+':'-'}{fmt(t.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Properties({ properties, onReload }) {
  const [form,setForm]=useState({name:'',address:'',type:'apartment',status:'rented'})
  const [editing,setEditing]=useState(null)
  const [saving,setSaving]=useState(false)
  const save=async()=>{
    if(!form.name||!form.address)return;setSaving(true)
    editing?await axios.put(API+'/properties/'+editing,form):await axios.post(API+'/properties',form)
    setForm({name:'',address:'',type:'apartment',status:'rented'});setEditing(null);setSaving(false);onReload()
  }
  const del=async(id)=>{if(!confirm('Удалить?'))return;await axios.delete(API+'/properties/'+id);onReload()}
  return (
    <div>
      <div style={{marginBottom:28}}><h1 style={{fontSize:24,fontWeight:500}}>Объекты</h1><p style={{fontSize:13,color:'#9E9B94',marginTop:3}}>{properties.length} объектов</p></div>
      <div style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,padding:20,marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:14,color:'#6B6961'}}>{editing?'Редактировать':'Добавить объект'}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
          <input style={inp} placeholder="Название" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input style={inp} placeholder="Адрес" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
          <select style={inp} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="apartment">Квартира</option><option value="office">Офис</option><option value="warehouse">Склад</option></select>
          <select style={inp} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="rented">Сдаётся</option><option value="vacant">Свободен</option><option value="renovation">Ремонт</option></select>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button style={btn()} onClick={save}>{saving?'Сохранение...':editing?'Сохранить':'Добавить'}</button>
          {editing&&<button style={btn({background:'#F7F6F3',color:'#6B6961'})} onClick={()=>{setEditing(null);setForm({name:'',address:'',type:'apartment',status:'rented'})}}>Отмена</button>}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
        {properties.map(p=>(
          <div key={p.id} style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,padding:'16px 18px'}}>
            <div style={{fontSize:14,fontWeight:500,marginBottom:3}}>{p.name}</div>
            <div style={{fontSize:12,color:'#9E9B94',marginBottom:14}}>{p.address}</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <Badge status={p.status}/>
              <div style={{display:'flex',gap:6}}>
                <button style={bE} onClick={()=>{setEditing(p.id);setForm({name:p.name,address:p.address,type:p.type,status:p.status})}}>Изменить</button>
                <button style={bD} onClick={()=>del(p.id)}>Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Transactions({ transactions, properties, onReload }) {
  const [form,setForm]=useState({property_id:'',date:new Date().toISOString().split('T')[0],amount:'',type:'income',category:'rent',note:''})
  const [editing,setEditing]=useState(null)
  const [saving,setSaving]=useState(false)
  const save=async()=>{
    if(!form.property_id||!form.amount)return;setSaving(true)
    editing?await axios.put(API+'/transactions/'+editing,form):await axios.post(API+'/transactions',form)
    setForm({property_id:'',date:new Date().toISOString().split('T')[0],amount:'',type:'income',category:'rent',note:''});setEditing(null);setSaving(false);onReload()
  }
  const del=async(id)=>{if(!confirm('Удалить?'))return;await axios.delete(API+'/transactions/'+id);onReload()}
  return (
    <div>
      <div style={{marginBottom:28}}><h1 style={{fontSize:24,fontWeight:500}}>Транзакции</h1><p style={{fontSize:13,color:'#9E9B94',marginTop:3}}>{transactions.length} операций</p></div>
      <div style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,padding:20,marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:14,color:'#6B6961'}}>{editing?'Редактировать':'Добавить транзакцию'}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:12}}>
          <select style={inp} value={form.property_id} onChange={e=>setForm({...form,property_id:e.target.value})}><option value="">Выберите объект</option>{properties.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select style={inp} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="income">Доход</option><option value="expense">Расход</option></select>
          <select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="rent">Аренда</option><option value="utilities">Коммуналка</option><option value="repair">Ремонт</option><option value="cleaning">Клининг</option><option value="tax">Налоги</option><option value="penalty">Пени</option></select>
          <input style={inp} type="number" placeholder="Сумма" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
          <input style={inp} type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
          <input style={inp} placeholder="Комментарий" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button style={btn()} onClick={save}>{saving?'Сохранение...':editing?'Сохранить':'Добавить'}</button>
          {editing&&<button style={btn({background:'#F7F6F3',color:'#6B6961'})} onClick={()=>{setEditing(null);setForm({property_id:'',date:new Date().toISOString().split('T')[0],amount:'',type:'income',category:'rent',note:''})}}>Отмена</button>}
        </div>
      </div>
      <div style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 120px 60px 100px 100px',padding:'9px 18px',background:'#F7F6F3',fontSize:11,color:'#9E9B94',textTransform:'uppercase'}}>
          <span>Описание</span><span>Объект</span><span>Дата</span><span style={{textAlign:'right'}}>Сумма</span><span></span>
        </div>
        {transactions.map((t,i)=>(
          <div key={t.id} style={{display:'grid',gridTemplateColumns:'1fr 120px 60px 100px 100px',padding:'11px 18px',alignItems:'center',fontSize:13,borderTop:i>0?'0.5px solid #F0EEE9':'none'}}>
            <div><div style={{fontWeight:500}}>{t.note||t.category}</div><div style={{fontSize:11,color:'#9E9B94'}}>{t.category}</div></div>
            <span style={{fontSize:12,color:'#6B6961'}}>{t.property_name}</span>
            <span style={{fontSize:12,color:'#9E9B94'}}>{new Date(t.date).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'})}</span>
            <span style={{textAlign:'right',fontWeight:500,fontFamily:'monospace',color:t.type==='income'?'#1A7A5E':'#B03A2E'}}>{t.type==='income'?'+':'-'}{fmt(t.amount)}</span>
            <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
              <button style={bE} onClick={()=>{setEditing(t.id);setForm({property_id:t.property_id,date:(t.date||'').split('T')[0],amount:t.amount,type:t.type,category:t.category,note:t.note||''})}}>Изм.</button>
              <button style={bD} onClick={()=>del(t.id)}>Удал.</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Owners() {
  const [owners,setOwners]=useState([])
  const [props,setProps]=useState([])
  const [shares,setShares]=useState([])
  const [form,setForm]=useState({name:'',phone:'',email:''})
  const [sf,setSf]=useState({property_id:'',owner_id:'',share_percent:''})
  const [editing,setEditing]=useState(null)
  const [saving,setSaving]=useState(false)
  const load=async()=>{
    const [o,p,s]=await Promise.all([axios.get(API+'/owners'),axios.get(API+'/properties'),axios.get(API+'/shares')])
    setOwners(o.data);setProps(p.data);setShares(s.data)
  }
  useEffect(()=>{load()},[])
  const save=async()=>{
    if(!form.name)return;setSaving(true)
    editing?await axios.put(API+'/owners/'+editing,form):await axios.post(API+'/owners',form)
    setForm({name:'',phone:'',email:''});setEditing(null);setSaving(false);load()
  }
  const del=async(id)=>{if(!confirm('Удалить?'))return;await axios.delete(API+'/owners/'+id);load()}
  const addShare=async()=>{
    if(!sf.property_id||!sf.owner_id||!sf.share_percent)return
    await axios.post(API+'/shares',sf);setSf({property_id:'',owner_id:'',share_percent:''});load()
  }
  const delShare=async(id)=>{await axios.delete(API+'/shares/'+id);load()}
  return (
    <div>
      <div style={{marginBottom:28}}><h1 style={{fontSize:24,fontWeight:500}}>Владельцы</h1><p style={{fontSize:13,color:'#9E9B94',marginTop:3}}>{owners.length} инвесторов</p></div>
      <div style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,padding:20,marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:14,color:'#6B6961'}}>{editing?'Редактировать':'Добавить владельца'}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:12}}>
          <input style={inp} placeholder="Имя" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input style={inp} placeholder="Телефон" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
          <input style={inp} placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button style={btn()} onClick={save}>{saving?'Сохранение...':editing?'Сохранить':'Добавить'}</button>
          {editing&&<button style={btn({background:'#F7F6F3',color:'#6B6961'})} onClick={()=>{setEditing(null);setForm({name:'',phone:'',email:''})}}>Отмена</button>}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:24}}>
        {owners.map(o=>{
          const os=shares.filter(s=>s.owner_id===o.id)
          return <div key={o.id} style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,padding:'16px 18px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <div><div style={{fontSize:14,fontWeight:500}}>{o.name}</div><div style={{fontSize:12,color:'#9E9B94',marginTop:2}}>{o.phone}{o.email?' · '+o.email:''}</div></div>
              <div style={{display:'flex',gap:6}}>
                <button style={bE} onClick={()=>{setEditing(o.id);setForm({name:o.name,phone:o.phone||'',email:o.email||''})}}>Изм.</button>
                <button style={bD} onClick={()=>del(o.id)}>Удал.</button>
              </div>
            </div>
            {os.length>0&&<div style={{borderTop:'0.5px solid #F0EEE9',paddingTop:8}}>{os.map(s=>{
              const pr=props.find(p=>p.id===s.property_id)
              return <div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12,marginBottom:4}}>
                <span style={{color:'#6B6961'}}>{pr?.name}</span>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontFamily:'monospace',fontWeight:500}}>{s.share_percent}%</span>
                  <button style={{...bD,padding:'2px 8px',fontSize:11}} onClick={()=>delShare(s.id)}>x</button>
                </div>
              </div>
            })}</div>}
          </div>
        })}
      </div>
      <div style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,padding:20}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:14,color:'#6B6961'}}>Назначить долю</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 100px',gap:12,marginBottom:12}}>
          <select style={inp} value={sf.property_id} onChange={e=>setSf({...sf,property_id:e.target.value})}><option value="">Объект</option>{props.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select style={inp} value={sf.owner_id} onChange={e=>setSf({...sf,owner_id:e.target.value})}><option value="">Владелец</option>{owners.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select>
          <input style={inp} type="number" placeholder="%" value={sf.share_percent} onChange={e=>setSf({...sf,share_percent:e.target.value})}/>
        </div>
        <button style={btn()} onClick={addShare}>Добавить долю</button>
      </div>
    </div>
  )
}

function Report({ properties, transactions }) {
  const [pid,setPid]=useState('')
  const f=pid?transactions.filter(t=>t.property_id===pid):transactions
  const inc=f.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0)
  const exp=f.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0)
  return (
    <div>
      <div style={{marginBottom:28}}><h1 style={{fontSize:24,fontWeight:500}}>Отчёт P&L</h1></div>
      <select style={{...inp,maxWidth:260,marginBottom:24}} value={pid} onChange={e=>setPid(e.target.value)}><option value="">Все объекты</option>{properties.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:28}}>
        <Metric label="Доходы" value={fmt(inc)+' сум'} color="#1A7A5E"/>
        <Metric label="Расходы" value={fmt(exp)+' сум'} color="#B03A2E"/>
        <Metric label="NOI" value={fmt(inc-exp)+' сум'}/>
      </div>
      <div style={{background:'#fff',border:'0.5px solid #E8E6E0',borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'14px 18px',borderBottom:'0.5px solid #E8E6E0',fontSize:13,fontWeight:500}}>По категориям</div>
        {['rent','utilities','repair','cleaning','tax','penalty'].map(cat=>{
          const ct=f.filter(t=>t.category===cat);if(!ct.length)return null
          const total=ct.reduce((s,t)=>s+(t.type==='income'?Number(t.amount):-Number(t.amount)),0)
          return <div key={cat} style={{display:'flex',justifyContent:'space-between',padding:'12px 18px',borderTop:'0.5px solid #F0EEE9',fontSize:13}}>
            <span style={{color:'#6B6961'}}>{cat}</span>
            <span style={{fontWeight:500,fontFamily:'monospace',color:total>=0?'#1A7A5E':'#B03A2E'}}>{total>=0?'+':''}{fmt(total)}</span>
          </div>
        })}
      </div>
    </div>
  )
}

export default function Home() {
  const [active,setActive]=useState('dashboard')
  const [properties,setProperties]=useState([])
  const [transactions,setTransactions]=useState([])
  const [loading,setLoading]=useState(true)
  const load=async()=>{
    try{const [p,t]=await Promise.all([axios.get(API+'/properties'),axios.get(API+'/transactions')]);setProperties(p.data);setTransactions(t.data)}
    catch(e){console.error(e)}finally{setLoading(false)}
  }
  useEffect(()=>{load()},[])
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F7F6F3'}}>
      <Sidebar active={active} setActive={setActive}/>
      <main style={{flex:1,padding:'36px 40px',maxWidth:960,minWidth:0}}>
        {loading?<div style={{color:'#9E9B94',fontSize:14,marginTop:40}}>Загрузка...</div>:(
          <>
            {active==='dashboard'&&<Dashboard properties={properties} transactions={transactions}/>}
            {active==='properties'&&<Properties properties={properties} onReload={load}/>}
            {active==='transactions'&&<Transactions transactions={transactions} properties={properties} onReload={load}/>}
            {active==='owners'&&<Owners/>}
            {active==='report'&&<Report properties={properties} transactions={transactions}/>}
          </>
        )}
      </main>
    </div>
  )
}
