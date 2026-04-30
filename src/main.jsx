import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import './index.css'
import { openPrintWindow } from './print/printEngine.js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const AUTH_STORAGE_KEY = 'mga_school_portal_auth_v24_safe'

// Netlify + Chrome can sometimes leave a broken Supabase WebLock after refresh/build deploy.
// This local lock prevents the page from hanging forever on: "Lock broken by another request with the 'steal' option".
const safeAuthLock = async (_name, _acquireTimeout, fn) => await fn()

export const supabase = createClient(
  supabaseUrl || 'https://missing.supabase.co',
  supabaseAnonKey || 'missing-key',
  {
    auth: {
      storageKey: AUTH_STORAGE_KEY,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      lock: safeAuthLock
    }
  }
)

// Separate client used only by the admin Users page to create a new Supabase Auth user
// without replacing the current admin session in this browser.
const userCreatorClient = createClient(
  supabaseUrl || 'https://missing.supabase.co',
  supabaseAnonKey || 'missing-key',
  {
    auth: {
      storageKey: 'mga_school_portal_admin_user_creator_v30',
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      flowType: 'pkce',
      lock: safeAuthLock
    }
  }
)

const roleLabel = { admin:'إدارة', accountant:'محاسب', teacher:'معلم', student:'طالب', parent:'ولي أمر' }


const AR_LABELS = {
  id:'المعرّف',
  user_id:'المستخدم',
  profile_id:'حساب المستخدم',
  parent_id:'ولي الأمر',
  teacher_id:'المعلم',
  student_id:'الطالب',
  guardian_id:'ولي الأمر',
  class_id:'الصف',
  subject_id:'المادة',
  academic_term_id:'الفصل الدراسي',
  category_id:'الفئة',
  payment_method_id:'طريقة الدفع',
  contract_id:'العقد',
  fiscal_year_id:'السنة المالية',
  plan_id:'خطة الأقساط',

  full_name:'الاسم الكامل',
  name:'الاسم',
  title:'العنوان',
  body:'المحتوى',
  description:'الوصف',
  note:'ملاحظة',
  notes:'ملاحظات',
  code:'الكود',
  phone:'الهاتف',
  email:'البريد الإلكتروني',
  role:'الدور',
  relation:'صلة القرابة',
  address:'العنوان',
  section:'الشعبة',
  room:'الغرفة',
  day_of_week:'اليوم',
  start_time:'وقت البداية',
  end_time:'وقت النهاية',
  starts_on:'تاريخ البداية',
  ends_on:'تاريخ النهاية',
  start_date:'تاريخ البداية',
  end_date:'تاريخ النهاية',
  created_at:'تاريخ الإنشاء',
  updated_at:'آخر تعديل',
  created_by:'أُنشئ بواسطة',

  student_number:'رقم الطالب',
  date_of_birth:'تاريخ الميلاد',
  status:'الحالة',
  archived_at:'تاريخ الأرشفة',
  archive_reason:'سبب الأرشفة',
  left_at:'تاريخ المغادرة',
  returned_at:'تاريخ العودة',
  previous_student_number:'رقم الطالب السابق',
  last_movement_note:'آخر ملاحظة حركة',
  national_id:'الرقم الوطني',
  gender:'الجنس',
  health_notes:'ملاحظات صحية',
  emergency_contact_name:'جهة اتصال الطوارئ',
  emergency_contact_phone:'هاتف الطوارئ',
  extra_notes:'ملاحظات إضافية',
  bus_number:'رقم الباص',
  bus_round:'الجولة / الرحلة',
  pickup_point:'نقطة الصعود',
  dropoff_point:'نقطة النزول',
  transport_notes:'ملاحظات المواصلات',

  movement_type:'نوع الحركة',
  movement_date:'تاريخ الحركة',
  from_class_id:'من الصف',
  to_class_id:'إلى الصف',
  old_status:'الحالة السابقة',
  new_status:'الحالة الجديدة',
  reason:'السبب',
  return_date:'تاريخ العودة',
  new_student_number:'رقم طالب جديد',
  is_current:'حالي',
  ended_on:'تاريخ الانتهاء',
  started_on:'تاريخ البدء',

  score:'العلامة',
  max_score:'العلامة الكاملة',
  date:'التاريخ',
  due_date:'تاريخ الاستحقاق',
  is_online:'أونلاين',
  answer_text:'نص الإجابة',
  file_url:'رابط الملف',
  teacher_note:'ملاحظة المعلم',

  contract_no:'رقم العقد',
  contract_type:'نوع العقد',
  total_amount:'إجمالي المبلغ',
  discount_amount:'قيمة الخصم',
  net_amount:'الصافي',
  registration_fee_snapshot:'رسوم التسجيل',
  tuition_fee_snapshot:'الرسوم الدراسية',
  bus_fee_snapshot:'رسوم الباص',
  books_fee_snapshot:'رسوم الكتب',
  uniform_fee_snapshot:'رسوم الزي',
  activities_fee_snapshot:'رسوم الأنشطة',
  discount_percent_snapshot:'نسبة الخصم',
  scholarship_title:'اسم المنحة',
  scholarship_percent:'نسبة المنحة',
  scholarship_amount:'مبلغ المنحة',
  pricing_snapshot:'نسخة الأسعار',
  print_count:'عدد مرات الطباعة',
  printed_at:'آخر طباعة',

  registration_fee:'رسوم التسجيل',
  tuition_fee:'الرسوم الدراسية',
  bus_fee:'رسوم الباص',
  books_fee:'رسوم الكتب',
  uniform_fee:'رسوم الزي',
  activities_fee:'رسوم الأنشطة',
  default_discount_amount:'خصم افتراضي مبلغ',
  default_discount_percent:'خصم افتراضي نسبة',
  currency:'العملة',
  is_active:'فعّال',

  amount:'المبلغ',
  payment_date:'تاريخ الدفع',
  method:'طريقة الدفع',
  receipt_no:'رقم السند',
  reference_no:'رقم المرجع',
  journal_entry_id:'القيد المحاسبي',
  cancelled_at:'تاريخ الإلغاء',
  cancel_reason:'سبب الإلغاء',
  debit:'مدين',
  credit:'دائن',
  account_type:'نوع الحساب',
  entry_no:'رقم القيد',
  entry_date:'تاريخ القيد',
  source_type:'نوع المصدر',
  source_id:'رقم المصدر',

  installments_count:'عدد الأقساط',
  paid_amount:'المبلغ المدفوع',
  original_fiscal_year_id:'السنة الأصلية للقسط',
  paid_fiscal_year_id:'سنة الدفع',
  close_mode:'حالة الإغلاق',
  is_closed:'مغلقة',
  close_note:'ملاحظة الإغلاق',
  total_students:'عدد الطلاب',
  total_balance:'إجمالي الرصيد',

  scholarship_type:'نوع المنحة',
  percent:'النسبة',
  approved_at:'تاريخ الاعتماد',
  document_type:'نوع الوثيقة',
  issue_date:'تاريخ الإصدار',
  expiry_date:'تاريخ الانتهاء',

  template_key:'مفتاح القالب',
  paper_size:'حجم الورق',
  orientation:'اتجاه الصفحة',
  header_html:'رأس الصفحة HTML',
  body_html:'محتوى الصفحة HTML',
  footer_html:'تذييل الصفحة HTML',
  css:'تنسيق تنسيق CSS'
}

function arLabel(key) {
  return AR_LABELS[key] || key
}

function arValue(value) {
  const map = {
    admin:'إدارة',
    accountant:'محاسب',
    teacher:'معلم',
    student:'طالب',
    parent:'ولي أمر',
    active:'نشط',
    archived:'مؤرشف',
    suspended:'موقوف',
    left:'غادر',
    withdrawn:'منسحب',
    returned:'عاد',
    transferred:'منتقل',
    graduated:'متخرج',
    present:'حاضر',
    absent:'غائب',
    late:'متأخر',
    excused:'معذور',
    posted:'مرحّل',
    cancelled:'ملغى',
    reversed:'معكوس',
    pending:'مستحق',
    paid:'مدفوع',
    partial:'مدفوع جزئيًا',
    overdue:'متأخر',
    draft:'مسودة',
    completed:'مكتمل',
    regular:'عقد عادي',
    scholarship:'عقد منحة',
    transfer:'نقل',
    returning:'طالب عائد',
    custom:'مخصص',
    fixed:'خصم مبلغ',
    percent:'خصم نسبة',
    full:'منحة كاملة',
    partial:'منحة جزئية',
    male:'ذكر',
    female:'أنثى',
    open:'مفتوحة',
    soft_closed:'مغلقة مرنًا',
    hard_closed:'مغلقة نهائيًا',
    portrait:'عمودي',
    landscape:'أفقي',
    contract:'عقد',
    scholarship_contract:'عقد منحة',
    receipt:'سند قبض',
    report:'تقرير',
    statement:'كشف حساب'
  }
  return map[value] || value
}



function useAuthState(){
  const [state,setState]=React.useState({loading:true,session:null,user:null,profile:null,error:null})

  React.useEffect(()=>{
    let mounted=true
    let subscription=null
    let loadingTimer=null

    const withTimeout = (promise, ms, label) => Promise.race([
      promise,
      new Promise((_, reject)=>setTimeout(()=>reject(new Error(label || 'Auth request timeout')), ms))
    ])

    function clearOldBrokenAuthKeys(){
      try {
        const keysToRemove = [
          'mga_school_portal_auth_v20',
          'mga_school_portal_auth_v21',
          'sb-dlsxlvzubiwcsojnwzcj-auth-token'
        ]
        keysToRemove.forEach(k=>localStorage.removeItem(k))
        Object.keys(localStorage).forEach(k=>{
          const isOldSchoolKey = k.startsWith('mga_school_portal_auth_') && k !== AUTH_STORAGE_KEY
          const isBrokenSupabaseKey = k.includes('lock') || k.includes('gotrue')
          if(isOldSchoolKey || isBrokenSupabaseKey) localStorage.removeItem(k)
        })
      } catch {}
    }

    async function recoverToLogin(){
      clearOldBrokenAuthKeys()
      try { await supabase.auth.signOut({ scope:'local' }) } catch {}
      if(mounted)setState({loading:false,session:null,user:null,profile:null,error:null})
    }

    async function load(){
      try{
        if(loadingTimer) clearTimeout(loadingTimer)
        loadingTimer=setTimeout(()=>{
          if(mounted)setState(s=>s.loading ? {...s,loading:false,error:'انتهت مهلة تحميل الجلسة. أعد تسجيل الدخول.'} : s)
        }, 8000)

        const {data:{session}, error:sessionError}=await withTimeout(
          supabase.auth.getSession(),
          6500,
          'انتهت مهلة قراءة جلسة الدخول'
        )
        if(sessionError) throw sessionError

        let profile=null
        if(session?.user){
          const {data,error}=await withTimeout(
            supabase.from('profiles').select('*').eq('id',session.user.id).maybeSingle(),
            6500,
            'انتهت مهلة قراءة ملف المستخدم'
          )
          if(error) throw error
          profile=data
        }

        if(loadingTimer) clearTimeout(loadingTimer)
        if(mounted)setState({loading:false,session,user:session?.user||null,profile,error:null})
      }catch(err){
        if(loadingTimer) clearTimeout(loadingTimer)
        console.warn('Auth load recovered:', err)
        const msg = String(err?.message || err || '')
        if(msg.toLowerCase().includes('lock') || err?.name === 'AbortError'){
          await recoverToLogin()
          return
        }
        if(mounted)setState({loading:false,session:null,user:null,profile:null,error:msg})
      }
    }

    clearOldBrokenAuthKeys()
    load()

    try{
      const result = supabase.auth.onAuthStateChange((_event,_session)=>{
        setTimeout(()=>load(),0)
      })
      subscription = result?.data?.subscription
    }catch(err){
      console.warn('Auth listener error:', err)
    }

    return()=>{
      mounted=false
      if(loadingTimer) clearTimeout(loadingTimer)
      try{ subscription?.unsubscribe?.() }catch{}
    }
  },[])

  return state
}

const AuthContext = React.createContext(null)
function AuthProvider({children}){
  const auth=useAuthState()
  const logout=async()=>{ await supabase.auth.signOut(); location.href='/login' }
  return <AuthContext.Provider value={{...auth,logout}}>{children}</AuthContext.Provider>
}
function useAuth(){return React.useContext(AuthContext)}

function Protected({roles,children}){
  const {loading,session,profile,error}=useAuth()
  if(loading)return <Splash text="جاري التحميل..." />
  if(error)return <AuthError message={error}/>
  if(!session)return <Navigate to="/login" replace/>
  if(!profile)return <NoProfile/>
  if(roles && !roles.includes(profile.role))return <Navigate to="/dashboard" replace/>
  return children
}

function Splash({text}){return <div dir="rtl" className="splash">{text}</div>}
function AuthError({message}){
  return <div dir="rtl" className="splash">
    <div className="card center">
      <h2>تعذر تحميل الجلسة</h2>
      <p>{message}</p>
      <button className="btn primary" onClick={()=>{
        try{
          localStorage.clear()
          sessionStorage.clear()
        }catch{}
        location.href='/login'
      }}>تنظيف الجلسة وإعادة الدخول</button>
    </div>
  </div>
}
function NoProfile(){
  const {logout}=useAuth()
  return <div dir="rtl" className="splash"><div className="card center"><h2>الحساب غير مربوط بصلاحية</h2><p>أنشئ سجلًا في profiles لهذا المستخدم من SQL.</p><button onClick={logout} className="btn danger">خروج</button></div></div>
}

function Login(){
  const [email,setEmail]=React.useState('')
  const [password,setPassword]=React.useState('')
  const [err,setErr]=React.useState('')
  const [loading,setLoading]=React.useState(false)
  const nav=useNavigate()
  async function submit(e){
    e.preventDefault();setLoading(true);setErr('')
    const {error}=await supabase.auth.signInWithPassword({email,password})
    setLoading(false)
    if(error)setErr(error.message)
    else nav('/dashboard')
  }
  return <div dir="rtl" className="login-page">
    <form className="login-card" onSubmit={submit}>
      <div className="brand">بوابة الطالب المدرسية</div>
      <h1>تسجيل الدخول</h1>
      <input className="input" dir="ltr" type="email" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <input className="input" type="password" placeholder="كلمة المرور" value={password} onChange={e=>setPassword(e.target.value)} required/>
      {err && <div className="alert danger-soft">{err}</div>}
      <button className="btn primary full" disabled={loading}>{loading?'جاري الدخول...':'دخول'}</button>
      <p className="muted">نسخة V16 كاملة للبناء</p>
    </form>
  </div>
}

function DashboardRedirect(){
  const {profile}=useAuth()
  if(profile?.role==='admin')return <Navigate to="/admin" replace/>
  if(profile?.role==='accountant')return <Navigate to="/accountant" replace/>
  if(profile?.role==='teacher')return <Navigate to="/teacher" replace/>
  if(profile?.role==='student')return <Navigate to="/student" replace/>
  if(profile?.role==='parent')return <Navigate to="/parent" replace/>
  return <Navigate to="/login" replace/>
}

const navs={
admin:[
['الرئيسية','/admin'],['المستخدمون','/admin/users'],['الطلاب','/admin/students'],['معلومات الطلاب','/admin/students/extra-info'],['أرشيف الطلاب','/admin/students/archive'],['مغادرة/عودة','/admin/student-movements'],['الترحيل السنوي','/admin/annual-promotion'],['الصفوف','/admin/classes'],['المواد','/admin/subjects'],['أسعار الصفوف','/admin/class-pricing'],['العقود','/admin/contracts'],['الأقساط','/admin/installments'],['سندات قبض','/admin/accounting/receipts'],['الذمم','/admin/accounting/debts'],['السنوات المالية','/admin/fiscal-years'],['الخصومات','/admin/scholarships'],['الوثائق','/admin/student-documents'],['بحث موحد','/admin/global-search'],['التقارير','/admin/reports'],['قوالب الطباعة','/admin/print-templates'],['طباعة التقارير','/admin/print-reports']],
accountant:[['الرئيسية','/accountant'],['أسعار الصفوف','/accountant/class-pricing'],['العقود','/accountant/contracts'],['الأقساط','/accountant/installments'],['سندات قبض','/accountant/receipts'],['الذمم','/accountant/debts'],['السنوات المالية','/accountant/fiscal-years'],['بحث موحد','/accountant/global-search'],['طباعة التقارير','/accountant/print-reports']],
teacher:[['الرئيسية','/teacher'],['الدرجات','/teacher/grades'],['الحضور','/teacher/attendance'],['الواجبات','/teacher/assignments']],
student:[['الرئيسية','/student'],['درجاتي','/student/grades'],['حضوري','/student/attendance']],
parent:[['الرئيسية','/parent'],['أبنائي','/parent/children']]
}

function Layout({title,children}){
  const {profile,logout}=useAuth(); const [open,setOpen]=React.useState(false)
  const items=navs[profile?.role]||[]
  return <div dir="rtl" className="app">
    <aside className={'sidebar '+(open?'show':'')}>
      <div className="side-head"><b>بوابة الطالب</b><span>{profile?.full_name}</span><small>{roleLabel[profile?.role]}</small></div>
      <nav>{items.map(([l,t])=><NavLink key={t} to={t} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}>{l}</NavLink>)}</nav>
      <button onClick={logout} className="btn danger side-logout">خروج</button>
    </aside>
    <main className="main">
      <header className="top"><div><h1>{title}</h1><p>Modern Golden Age School Portal</p></div><button className="btn dark mobile" onClick={()=>setOpen(true)}>القائمة</button></header>
      <section className="content">{children}</section>
    </main>
  </div>
}

function Empty({title='لا توجد بيانات',desc='أضف بيانات أو غيّر الفلتر.'}){return <div className="card empty"><h3>{title}</h3><p>{desc}</p></div>}
function Stat({label,value,tone=''}){return <div className={'stat '+tone}><span>{label}</span><b>{value}</b></div>}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
function inputProps(setForm,form,key){return {value:form[key]||'',onChange:e=>setForm({...form,[key]:e.target.value})}}
function fmt(n){return Number(n||0).toFixed(2)}

function HomeDash({type}){
  const [stats,setStats]=React.useState({students:0,fees:0,payments:0,balance:0})
  React.useEffect(()=>{(async()=>{
    const [s,acc]=await Promise.all([
      supabase.from('students').select('id',{count:'exact',head:true}),
      supabase.from('student_account_summary').select('total_fees,total_payments,balance')
    ])
    const rows=acc.data||[]
    setStats({students:s.count||0,fees:rows.reduce((a,b)=>a+Number(b.total_fees||0),0),payments:rows.reduce((a,b)=>a+Number(b.total_payments||0),0),balance:rows.reduce((a,b)=>a+Number(b.balance||0),0)})
  })()},[])
  return <Layout title={type==='accountant'?'لوحة المحاسب':type==='teacher'?'لوحة المعلم':type==='student'?'لوحة الطالب':type==='parent'?'لوحة ولي الأمر':'لوحة الإدارة'}>
    <div className="grid4"><Stat label="الطلاب" value={stats.students}/><Stat label="الرسوم" value={fmt(stats.fees)}/><Stat label="المدفوع" value={fmt(stats.payments)} tone="good"/><Stat label="الذمم" value={fmt(stats.balance)} tone="bad"/></div>
    <div className="card"><h2>جاهز للعمل</h2><p>استخدم القائمة الجانبية لإدارة الطلاب، العقود، الأقساط، الترحيل السنوي، والمحاسبة.</p></div>
  </Layout>
}

function SimpleTable({cols,rows,actions}){return <div className="table-wrap"><table><thead><tr>{cols.map(c=><th key={c.key}>{c.label}</th>)}{actions&&<th>إجراءات</th>}</tr></thead><tbody>{rows.map((r,i)=><tr key={r.id||i}>{cols.map(c=><td key={c.key}>{c.render?c.render(r):arValue(String(r[c.key]??'-'))}</td>)}{actions&&<td className="row-actions">{actions(r)}</td>}</tr>)}</tbody></table></div>}

function CrudPage({title,table,cols,initial,select='*',order='id',children,afterLoad,renderActions,allowDelete=false}){
  const [rows,setRows]=React.useState([]),[form,setForm]=React.useState(initial),[loading,setLoading]=React.useState(false)
  async function load(){const {data,error}=await supabase.from(table).select(select).order(order,{ascending:false}); if(error)alert(error.message); else setRows(afterLoad?afterLoad(data||[]):data||[])}
  React.useEffect(()=>{load()},[])
  async function save(e){e.preventDefault();setLoading(true);const {error}=await supabase.from(table).insert(form);setLoading(false);if(error)alert(error.message);else{setForm(initial);load()}}
  async function deleteRow(r){
    if(!r?.id) return
    if(!confirm('هل تريد حذف هذا الصف؟')) return
    const {error}=await supabase.from(table).delete().eq('id',r.id)
    if(error) alert(error.message); else load()
  }
  const actions = (renderActions || allowDelete) ? (r => <>{renderActions?.(r)}{allowDelete && <button type="button" className="btn mini danger" onClick={()=>deleteRow(r)}>حذف</button>}</>) : null
  return <Layout title={title}>
    {children?.({rows,setRows,form,setForm,load,save,loading,deleteRow})}
    {!children && <form onSubmit={save} className="card form-grid">{Object.keys(initial).map(k=><Field key={k} label={arLabel(k)}><input className="input" {...inputProps(setForm,form,k)}/></Field>)}<button className="btn primary">حفظ</button></form>}
    {rows.length?<SimpleTable cols={cols} rows={rows} actions={actions}/>:<Empty/>}
  </Layout>
}


function UsersPage(){
 const initial={email:'',password:'',full_name:'',role:'student',phone:''}
 const [rows,setRows]=React.useState([]),[form,setForm]=React.useState(initial),[saving,setSaving]=React.useState(false)
 async function load(){
  const {data,error}=await supabase.from('profiles').select('*').order('created_at',{ascending:false})
  if(error) alert(error.message); else setRows(data||[])
 }
 React.useEffect(()=>{load()},[])
 function setVal(k,v){setForm(x=>({...x,[k]:v}))}
 async function save(e){
  e.preventDefault()
  if(!form.email) return alert('أدخل البريد الإلكتروني')
  if(!form.password || form.password.length < 6) return alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
  if(!form.full_name) return alert('أدخل الاسم')
  setSaving(true)
  try{
   const created = await userCreatorClient.auth.signUp({
    email: form.email.trim(),
    password: form.password,
    options: { data: { full_name: form.full_name, role: form.role, phone: form.phone || '' } }
   })
   if(created.error) throw created.error
   const newUserId = created.data?.user?.id
   if(!newUserId) throw new Error('لم يرجع Supabase معرف المستخدم. تأكد من إعدادات Authentication.')
   const {error:profileError}=await supabase.from('profiles').upsert({
    id:newUserId,
    full_name:form.full_name,
    role:form.role,
    phone:form.phone || null
   },{onConflict:'id'})
   if(profileError) throw profileError
   try{ await userCreatorClient.auth.signOut({scope:'local'}) }catch{}
   alert('تم إنشاء المستخدم وتحديد الدور بنجاح')
   setForm(initial)
   load()
  }catch(err){
   alert('لم يتم إنشاء المستخدم: ' + (err?.message || err))
  }finally{
   setSaving(false)
  }
 }
 async function deleteUserProfile(r){
  if(!confirm('حذف هذا المستخدم من جدول الصلاحيات؟ ملاحظة: هذا لا يحذف حساب Authentication نفسه.')) return
  const {error}=await supabase.from('profiles').delete().eq('id',r.id)
  if(error) alert(error.message); else load()
 }
 return <Layout title="المستخدمون">
  <div className="alert">إضافة المستخدمين والصلاحيات أصبحت من الإدارة فقط: أدخل البريد وكلمة المرور والدور، وسيتم إنشاء حساب الدخول وربطه تلقائيًا بالدور المختار.</div>
  <form onSubmit={save} className="card form-grid">
   <Field label="البريد الإلكتروني"><input type="email" className="input" dir="ltr" value={form.email} onChange={e=>setVal('email',e.target.value)} required/></Field>
   <Field label="كلمة المرور"><input type="password" className="input" dir="ltr" value={form.password} onChange={e=>setVal('password',e.target.value)} required minLength="6"/></Field>
   <Field label="الاسم"><input className="input" value={form.full_name} onChange={e=>setVal('full_name',e.target.value)} required/></Field>
   <Field label="الدور"><select className="input" value={form.role} onChange={e=>setVal('role',e.target.value)}><option value="admin">إدارة</option><option value="accountant">محاسب</option><option value="teacher">معلم</option><option value="student">طالب</option><option value="parent">ولي أمر</option></select></Field>
   <Field label="الهاتف"><input className="input" value={form.phone} onChange={e=>setVal('phone',e.target.value)}/></Field>
   <button className="btn primary" disabled={saving}>{saving?'جار إنشاء المستخدم...':'إنشاء مستخدم'}</button>
  </form>
  {rows.length?<SimpleTable rows={rows} cols={[{key:'full_name',label:'الاسم'},{key:'role',label:'الدور',render:r=>arValue(r.role)},{key:'phone',label:'الهاتف'},{key:'id',label:'User ID'}]} actions={r=><button className="btn mini danger" onClick={()=>deleteUserProfile(r)}>حذف صلاحية</button>}/>:<Empty/>}
 </Layout>
}


function ClassesPage(){return <CrudPage title="الصفوف" table="classes" initial={{name:'',section:''}} allowDelete={true} cols={[{key:'name',label:'الصف'},{key:'section',label:'الشعبة'}]}/>}
function SubjectsPage(){
 const [subjects,setSubjects]=React.useState([])
 const [classes,setClasses]=React.useState([])
 const [teachers,setTeachers]=React.useState([])
 const [classSubjects,setClassSubjects]=React.useState([])
 const [teacherSubjects,setTeacherSubjects]=React.useState([])
 const [subjectForm,setSubjectForm]=React.useState({name:'',code:''})
 const [linkForm,setLinkForm]=React.useState({subject_id:'',class_id:'',teacher_id:''})
 const [saving,setSaving]=React.useState(false)

 const subjectMap=React.useMemo(()=>Object.fromEntries(subjects.map(x=>[String(x.id),x])),[subjects])
 const classMap=React.useMemo(()=>Object.fromEntries(classes.map(x=>[String(x.id),x])),[classes])
 const teacherMap=React.useMemo(()=>Object.fromEntries(teachers.map(x=>[String(x.id),x])),[teachers])
 function classLabel(id){const c=classMap[String(id)]; return c?`${c.name||''} ${c.section||''}`.trim():'-'}
 function teacherFor(cs){
  return teacherSubjects.find(t=>String(t.class_id)===String(cs.class_id) && String(t.subject_id)===String(cs.subject_id))
 }
 async function load(){
  const [s,c,t,cs,ts]=await Promise.all([
   supabase.from('subjects').select('*').order('id',{ascending:false}),
   supabase.from('classes').select('id,name,section').order('id'),
   supabase.from('profiles').select('id,full_name,phone,role').eq('role','teacher').order('full_name'),
   supabase.from('class_subjects').select('*').order('id',{ascending:false}),
   supabase.from('teacher_subjects').select('*').order('id',{ascending:false})
  ])
  if(s.error) alert('خطأ تحميل المواد: '+s.error.message); else setSubjects(s.data||[])
  if(c.error) alert('خطأ تحميل الصفوف: '+c.error.message); else setClasses(c.data||[])
  if(t.error) alert('خطأ تحميل المعلمين: '+t.error.message); else setTeachers(t.data||[])
  if(cs.error) alert('خطأ ربط الصفوف بالمواد: '+cs.error.message); else setClassSubjects(cs.data||[])
  if(ts.error) alert('خطأ ربط المعلمين بالمواد: '+ts.error.message); else setTeacherSubjects(ts.data||[])
 }
 React.useEffect(()=>{load()},[])
 async function addSubject(e){
  e.preventDefault()
  if(!subjectForm.name.trim()) return alert('أدخل اسم المادة')
  setSaving(true)
  const {error}=await supabase.from('subjects').insert({name:subjectForm.name.trim(),code:subjectForm.code.trim() || null})
  setSaving(false)
  if(error) alert(error.message); else {setSubjectForm({name:'',code:''}); load()}
 }
 async function deleteSubject(r){
  if(!confirm('حذف المادة؟ سيتم حذف ربطها بالصفوف والمعلمين بسبب العلاقات.')) return
  const {error}=await supabase.from('subjects').delete().eq('id',r.id)
  if(error) alert(error.message); else load()
 }
 async function saveLink(e){
  e.preventDefault()
  if(!linkForm.subject_id || !linkForm.class_id) return alert('اختر المادة والصف')
  setSaving(true)
  try{
   const {error:csErr}=await supabase.from('class_subjects').upsert({
    subject_id:Number(linkForm.subject_id),
    class_id:Number(linkForm.class_id)
   },{onConflict:'class_id,subject_id'})
   if(csErr) throw csErr
   if(linkForm.teacher_id){
    await supabase.from('teacher_subjects')
     .delete()
     .eq('subject_id',Number(linkForm.subject_id))
     .eq('class_id',Number(linkForm.class_id))
    const {error:tsErr}=await supabase.from('teacher_subjects').insert({
     teacher_id:linkForm.teacher_id,
     subject_id:Number(linkForm.subject_id),
     class_id:Number(linkForm.class_id)
    })
    if(tsErr) throw tsErr
   }
   alert('تم ربط المادة بالصف والمعلم')
   setLinkForm({subject_id:'',class_id:'',teacher_id:''})
   load()
  }catch(err){
   alert(err?.message || err)
  }finally{setSaving(false)}
 }
 async function deleteClassSubject(r){
  if(!confirm('حذف ربط المادة بهذا الصف؟')) return
  await supabase.from('teacher_subjects').delete().eq('subject_id',r.subject_id).eq('class_id',r.class_id)
  const {error}=await supabase.from('class_subjects').delete().eq('id',r.id)
  if(error) alert(error.message); else load()
 }
 const linkRows=classSubjects.map(cs=>{
  const t=teacherFor(cs)
  return {...cs, subject_name:subjectMap[String(cs.subject_id)]?.name || '-', class_name:classLabel(cs.class_id), teacher_name:t ? (teacherMap[String(t.teacher_id)]?.full_name || '-') : 'غير محدد'}
 })
 return <Layout title="المواد وربطها بالصفوف والمعلمين">
  <div className="alert">أضف المادة، ثم اربطها بأي عدد من الصفوف، وحدد المعلم المسؤول عن تدريس هذه المادة داخل كل صف.</div>
  <div className="grid4">
   <Stat label="عدد المواد" value={subjects.length}/>
   <Stat label="الصفوف" value={classes.length}/>
   <Stat label="المعلمين" value={teachers.length}/>
   <Stat label="روابط مواد الصفوف" value={classSubjects.length}/>
  </div>
  <form onSubmit={addSubject} className="card form-grid enhanced-card">
   <h2 style={{gridColumn:'1/-1',margin:'0 0 6px'}}>إضافة مادة</h2>
   <Field label="اسم المادة"><input className="input" value={subjectForm.name} onChange={e=>setSubjectForm({...subjectForm,name:e.target.value})}/></Field>
   <Field label="كود المادة"><input className="input" value={subjectForm.code} onChange={e=>setSubjectForm({...subjectForm,code:e.target.value})}/></Field>
   <button className="btn primary" disabled={saving}>حفظ المادة</button>
  </form>
  <form onSubmit={saveLink} className="card form-grid enhanced-card">
   <h2 style={{gridColumn:'1/-1',margin:'0 0 6px'}}>ربط مادة بصف ومعلم</h2>
   <SearchSelect label="المادة" value={linkForm.subject_id} onChange={v=>setLinkForm(x=>({...x,subject_id:v}))} options={subjects} placeholder="ابحث عن المادة..." getLabel={r=>r.name||'-'} getSubLabel={r=>r.code||''}/>
   <SearchSelect label="الصف" value={linkForm.class_id} onChange={v=>setLinkForm(x=>({...x,class_id:v}))} options={classes} placeholder="ابحث عن الصف..." getLabel={r=>`${r.name||''} ${r.section||''}`.trim()} getSubLabel={r=>`ID: ${r.id}`}/>
   <SearchSelect label="المعلم" value={linkForm.teacher_id} onChange={v=>setLinkForm(x=>({...x,teacher_id:v}))} options={teachers} placeholder="ابحث عن المعلم..." getLabel={r=>r.full_name||'-'} getSubLabel={r=>r.phone||''}/>
   <button className="btn good" disabled={saving}>حفظ الربط</button>
  </form>
  <div className="card"><h3>المواد</h3>{subjects.length?<SimpleTable rows={subjects} cols={[{key:'name',label:'المادة'},{key:'code',label:'الكود'}]} actions={r=><button className="btn mini danger" onClick={()=>deleteSubject(r)}>حذف مادة</button>}/>:<Empty/>}</div>
  <div className="card"><h3>المواد حسب الصف والمعلم</h3>{linkRows.length?<SimpleTable rows={linkRows} cols={[{key:'subject_name',label:'المادة'},{key:'class_name',label:'الصف'},{key:'teacher_name',label:'المعلم'}]} actions={r=><button className="btn mini danger" onClick={()=>deleteClassSubject(r)}>حذف الربط</button>}/>:<Empty/>}</div>
 </Layout>
}
function ReportsPage(){return <Layout title="التقارير"><HomeDash type="admin"/></Layout>}




// V28: Safe pages for routes that existed in the sidebar but had no component.
function ContractsPage(){
 const initial={contract_no:'',student_id:'',guardian_id:'',academic_term_id:'',class_pricing_id:'',total_amount:0,discount_amount:0,start_date:'',end_date:'',status:'active',notes:''}
 const [rows,setRows]=React.useState([])
 const [students,setStudents]=React.useState([])
 const [guardians,setGuardians]=React.useState([])
 const [classes,setClasses]=React.useState([])
 const [terms,setTerms]=React.useState([])
 const [pricing,setPricing]=React.useState([])
 const [templates,setTemplates]=React.useState([])
 const [form,setForm]=React.useState(initial)
 const [saving,setSaving]=React.useState(false)
 const [editingId,setEditingId]=React.useState(null)

 const classesMap=React.useMemo(()=>Object.fromEntries(classes.map(x=>[String(x.id),x])),[classes])
 const termsMap=React.useMemo(()=>Object.fromEntries(terms.map(x=>[String(x.id),x])),[terms])
 const studentsMap=React.useMemo(()=>Object.fromEntries(students.map(x=>[String(x.id),x])),[students])
 const guardiansMap=React.useMemo(()=>Object.fromEntries(guardians.map(x=>[String(x.id),x])),[guardians])
 const pricingMap=React.useMemo(()=>Object.fromEntries(pricing.map(x=>[String(x.id),x])),[pricing])

 function pricingLabel(p){
  if(!p) return ''
  const c=classesMap[String(p.class_id)]
  const t=termsMap[String(p.academic_term_id)]
  return `${c?.name||'صف غير محدد'} ${c?.section||''} ${t?`- ${t.name||''} ${t.year_label||''}`:''}`.trim()
 }
 function calcPricingTotal(p){
  return ['registration_fee','tuition_fee','bus_fee','books_fee','uniform_fee','activities_fee']
   .reduce((a,k)=>a+Number(p?.[k]||0),0)
 }
 function nextContractNo(){
  return `CTR-${new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,12)}`
 }
 async function load(){
  const [contractsRes,studentsRes,guardiansRes,classesRes,termsRes,pricingRes,templatesRes]=await Promise.all([
   supabase.from('student_contracts').select('*').order('id',{ascending:false}),
   supabase.from('students').select('id,student_number,profile_id,class_id,bus_number,bus_round,profiles!students_profile_id_fkey(full_name,phone)').order('student_number'),
   supabase.from('profiles').select('id,full_name,phone,role').eq('role','parent').order('full_name'),
   supabase.from('classes').select('id,name,section').order('id'),
   supabase.from('academic_terms').select('id,name,year_label,is_active').order('id',{ascending:false}),
   supabase.from('class_pricing').select('*').order('id',{ascending:false}),
   supabase.from('document_templates').select('*').in('document_type',['contract','scholarship_contract']).eq('is_active',true).order('id')
  ])
  if(contractsRes.error) alert(contractsRes.error.message); else setRows(contractsRes.data||[])
  if(studentsRes.error) alert(studentsRes.error.message); else setStudents(studentsRes.data||[])
  if(guardiansRes.error) alert(guardiansRes.error.message); else setGuardians(guardiansRes.data||[])
  if(classesRes.error) alert(classesRes.error.message); else setClasses(classesRes.data||[])
  if(termsRes.error) alert(termsRes.error.message); else setTerms(termsRes.data||[])
  if(pricingRes.error) alert(pricingRes.error.message); else setPricing(pricingRes.data||[])
  if(templatesRes.error) alert(templatesRes.error.message); else setTemplates(templatesRes.data||[])
 }
 React.useEffect(()=>{load()},[])
 function setVal(k,v){setForm(x=>({...x,[k]:v}))}
 function onSelectPricing(id){
  const p=pricingMap[String(id)]
  setForm(x=>({
   ...x,
   class_pricing_id:id,
   academic_term_id:x.academic_term_id || p?.academic_term_id || '',
   total_amount: id ? calcPricingTotal(p) : x.total_amount,
   discount_amount: id ? (Number(p?.default_discount_amount||0) || x.discount_amount) : x.discount_amount
  }))
 }
 function edit(r){
  setEditingId(r.id)
  setForm({
   contract_no:r.contract_no||'',
   student_id:r.student_id||'',
   guardian_id:r.guardian_id||'',
   academic_term_id:r.academic_term_id||'',
   class_pricing_id:r.class_pricing_id||'',
   total_amount:r.total_amount??0,
   discount_amount:r.discount_amount??0,
   start_date:r.start_date||'',
   end_date:r.end_date||'',
   status:r.status||'active',
   notes:r.notes||''
  })
  window.scrollTo({top:0,behavior:'smooth'})
 }
 function resetForm(){
  setEditingId(null)
  setForm({...initial, contract_no: nextContractNo()})
 }
 React.useEffect(()=>{
  setForm(x=> x.contract_no ? x : ({...x, contract_no: nextContractNo()}))
 },[])
 async function save(e){
  e.preventDefault()
  if(!form.student_id) return alert('اختر الطالب')
  setSaving(true)
  const payload={
   contract_no:form.contract_no || nextContractNo(),
   student_id:Number(form.student_id),
   guardian_id:form.guardian_id || null,
   academic_term_id:form.academic_term_id ? Number(form.academic_term_id) : null,
   class_pricing_id:form.class_pricing_id ? Number(form.class_pricing_id) : null,
   total_amount:Number(form.total_amount||0),
   discount_amount:Number(form.discount_amount||0),
   start_date:form.start_date || null,
   end_date:form.end_date || null,
   status:form.status || 'active',
   notes:form.notes || null
  }
  const q=editingId?supabase.from('student_contracts').update(payload).eq('id',editingId):supabase.from('student_contracts').insert(payload)
  const {error}=await q
  setSaving(false)
  if(error) alert(error.message)
  else {alert(editingId?'تم تعديل العقد':'تم حفظ العقد'); resetForm(); load()}
 }
 async function deleteRow(r){
  if(!confirm('هل تريد حذف العقد؟')) return
  const {error}=await supabase.from('student_contracts').delete().eq('id',r.id)
  if(error) alert(error.message); else load()
 }
 async function printRow(r){
  try{
   await printStudentContract({contract:r, templates, studentsMap, classesMap, termsMap, pricingMap, guardiansMap})
   load()
  }catch(err){
   alert(err?.message || err)
  }
 }
 const activeCount=rows.filter(r=>String(r.status||'')==='active').length
 const printedCount=rows.filter(r=>Number(r.print_count||0)>0).length
 return <Layout title="العقود">
  <div className="grid4">
   <Stat label="عدد العقود" value={rows.length}/>
   <Stat label="العقود النشطة" value={activeCount} tone="good"/>
   <Stat label="العقود المطبوعة" value={printedCount}/>
   <Stat label="آخر صافي" value={fmt(Number(form.total_amount||0)-Number(form.discount_amount||0))}/>
  </div>
  <div className="alert">تم تحويل طباعة العقود إلى زر مباشر داخل الجدول: اختر العقد المطلوب ثم اضغط <b>طباعة</b>. كما تم تحسين شكل الصفحة وإضافة اختيار ذكي للطالب والولي وخطة السعر.</div>
  <form onSubmit={save} className="card form-grid enhanced-card">
   <SearchSelect label="الطالب" value={form.student_id} onChange={v=>setVal('student_id',v)} options={students} placeholder="اكتب اسم الطالب أو رقمه..." getLabel={r=>`${getProfileName(r) || 'بدون اسم'}${r.student_number?` - ${r.student_number}`:''}`} getSubLabel={r=>`${getClassName(r) || 'بدون صف'}${getProfilePhone(r)?` | ${getProfilePhone(r)}`:''}`}/>
   <SearchSelect label="ولي الأمر" value={form.guardian_id} onChange={v=>setVal('guardian_id',v)} options={guardians} placeholder="ابحث باسم ولي الأمر..." getLabel={r=>r.full_name||'بدون اسم'} getSubLabel={r=>r.phone||''}/>
   <Field label="رقم العقد"><input className="input" value={form.contract_no} onChange={e=>setVal('contract_no',e.target.value)} placeholder="CTR-2026..."/></Field>
   <Field label="الفصل الدراسي"><select className="input" value={form.academic_term_id||''} onChange={e=>setVal('academic_term_id',e.target.value)}><option value="">بدون فصل</option>{terms.map(t=><option key={t.id} value={t.id}>{t.name} {t.year_label||''}{t.is_active?' - فعال':''}</option>)}</select></Field>
   <SearchSelect label="خطة السعر / الصف" value={form.class_pricing_id} onChange={onSelectPricing} options={pricing} placeholder="ابحث عن الصف أو الفصل..." getLabel={r=>pricingLabel(r)} getSubLabel={r=>`الإجمالي ${fmt(calcPricingTotal(r))} | خصم افتراضي ${fmt(r.default_discount_amount)}`}/>
   <Field label="إجمالي المبلغ"><input type="number" step="0.01" className="input" value={form.total_amount} onChange={e=>setVal('total_amount',e.target.value)}/></Field>
   <Field label="الخصم"><input type="number" step="0.01" className="input" value={form.discount_amount} onChange={e=>setVal('discount_amount',e.target.value)}/></Field>
   <Field label="الصافي"><input type="number" step="0.01" className="input" value={Number(form.total_amount||0)-Number(form.discount_amount||0)} readOnly/></Field>
   <Field label="تاريخ البداية"><input type="date" className="input" value={form.start_date||''} onChange={e=>setVal('start_date',e.target.value)}/></Field>
   <Field label="تاريخ النهاية"><input type="date" className="input" value={form.end_date||''} onChange={e=>setVal('end_date',e.target.value)}/></Field>
   <Field label="الحالة"><select className="input" value={form.status} onChange={e=>setVal('status',e.target.value)}><option value="active">نشط</option><option value="draft">مسودة</option><option value="completed">مكتمل</option><option value="cancelled">ملغى</option></select></Field>
   <label className="field" style={{gridColumn:'1/-1'}}><span>ملاحظات</span><textarea className="input" rows="3" value={form.notes||''} onChange={e=>setVal('notes',e.target.value)} placeholder="أي ملاحظات إضافية عن العقد"/></label>
   <div className="quick" style={{gridColumn:'1/-1'}}>
    <button className="btn primary" disabled={saving}>{saving?'جار الحفظ...':editingId?'حفظ التعديل':'حفظ العقد'}</button>
    {editingId && <button type="button" className="btn dark" onClick={resetForm}>إلغاء التعديل</button>}
   </div>
  </form>
  {rows.length?<SimpleTable rows={rows} cols={[
   {key:'contract_no',label:'رقم العقد'},
   {key:'student',label:'الطالب',render:r=>getProfileName(studentsMap[String(r.student_id)])||'-'},
   {key:'student_number',label:'رقم الطالب',render:r=>studentsMap[String(r.student_id)]?.student_number||'-'},
   {key:'class',label:'الصف',render:r=>{const p=pricingMap[String(r.class_pricing_id)]; return p?pricingLabel(p):(getClassName(studentsMap[String(r.student_id)])||'-')}},
   {key:'term',label:'الفصل',render:r=>{const t=termsMap[String(r.academic_term_id)]; return t?`${t.name||''} ${t.year_label||''}`.trim():'-'}},
   {key:'net_amount',label:'الصافي',render:r=>fmt(Number(r.net_amount ?? (Number(r.total_amount||0)-Number(r.discount_amount||0))))},
   {key:'status',label:'الحالة',render:r=>arValue(r.status)},
   {key:'print_count',label:'عدد الطباعة',render:r=>r.print_count||0}
  ]} actions={r=><>
    <button className="btn mini primary" onClick={()=>printRow(r)}>طباعة</button>
    <button className="btn mini" onClick={()=>edit(r)}>تعديل</button>
    <button className="btn mini danger" onClick={()=>deleteRow(r)}>حذف</button>
  </>}/>:<Empty/>}
 </Layout>
}
function InstallmentsPage(){return <CrudPage title="الأقساط" table="student_installments" initial={{student_id:'',plan_id:'',due_date:'',amount:0,paid_amount:0,status:'pending',note:''}} allowDelete={true} cols={[{key:'student_id',label:'الطالب'},{key:'plan_id',label:'الخطة'},{key:'due_date',label:'تاريخ الاستحقاق'},{key:'amount',label:'المبلغ'},{key:'paid_amount',label:'المدفوع'},{key:'status',label:'الحالة',render:r=>arValue(r.status)},{key:'note',label:'ملاحظة'}]}/>}
function ReceiptsPage(){return <CrudPage title="سندات قبض" table="student_payments" initial={{student_id:'',amount:0,payment_date:new Date().toISOString().slice(0,10),method:'cash',receipt_no:'',reference_no:'',note:'',status:'posted'}} allowDelete={true} cols={[{key:'receipt_no',label:'رقم السند'},{key:'student_id',label:'الطالب'},{key:'amount',label:'المبلغ'},{key:'payment_date',label:'تاريخ الدفع'},{key:'method',label:'طريقة الدفع'},{key:'status',label:'الحالة',render:r=>arValue(r.status)},{key:'note',label:'ملاحظة'}]}/>}
function DebtsPage(){
 const [fees,setFees]=React.useState([]),[payments,setPayments]=React.useState([])
 async function load(){const [f,p]=await Promise.all([supabase.from('student_fees').select('*').order('id',{ascending:false}),supabase.from('student_payments').select('*').order('id',{ascending:false})]); if(f.error) alert(f.error.message); else setFees(f.data||[]); if(p.error) alert(p.error.message); else setPayments(p.data||[])}
 React.useEffect(()=>{load()},[])
 const paidByStudent=payments.reduce((a,p)=>{a[p.student_id]=(a[p.student_id]||0)+Number(p.amount||0);return a},{})
 const rows=fees.map(f=>({...f,paid_amount:paidByStudent[f.student_id]||0,balance:Number(f.amount||0)-(paidByStudent[f.student_id]||0)}))
 return <Layout title="الذمم">{rows.length?<SimpleTable rows={rows} cols={[{key:'student_id',label:'الطالب'},{key:'title',label:'البند'},{key:'amount',label:'المبلغ'},{key:'paid_amount',label:'المدفوع'},{key:'balance',label:'الرصيد'},{key:'due_date',label:'تاريخ الاستحقاق'},{key:'note',label:'ملاحظة'}]}/>:<Empty/>}</Layout>
}
function FiscalYearsPage(){return <CrudPage title="السنوات المالية" table="accounting_fiscal_years" initial={{name:'',starts_on:'',ends_on:'',is_active:false,is_closed:false,close_mode:'open',close_note:''}} allowDelete={true} cols={[{key:'name',label:'الاسم'},{key:'starts_on',label:'تاريخ البداية'},{key:'ends_on',label:'تاريخ النهاية'},{key:'is_active',label:'فعّالة',render:r=>r.is_active?'نعم':'لا'},{key:'is_closed',label:'مغلقة',render:r=>r.is_closed?'نعم':'لا'},{key:'close_mode',label:'حالة الإغلاق',render:r=>arValue(r.close_mode)}]}/>}
function ScholarshipsPage(){return <CrudPage title="الخصومات والمنح" table="student_scholarships" initial={{student_id:'',scholarship_type:'fixed',title:'',amount:0,percent:0,status:'pending',note:''}} allowDelete={true} cols={[{key:'student_id',label:'الطالب'},{key:'title',label:'العنوان'},{key:'scholarship_type',label:'النوع',render:r=>arValue(r.scholarship_type)},{key:'amount',label:'المبلغ'},{key:'percent',label:'النسبة'},{key:'status',label:'الحالة',render:r=>arValue(r.status)},{key:'note',label:'ملاحظة'}]}/>}
function StudentDocumentsPage(){return <CrudPage title="وثائق الطلاب" table="student_documents" initial={{student_id:'',document_type:'',title:'',file_url:'',issue_date:'',expiry_date:'',note:''}} allowDelete={true} cols={[{key:'student_id',label:'الطالب'},{key:'document_type',label:'نوع الوثيقة'},{key:'title',label:'العنوان'},{key:'file_url',label:'رابط الملف'},{key:'issue_date',label:'تاريخ الإصدار'},{key:'expiry_date',label:'تاريخ الانتهاء'},{key:'note',label:'ملاحظة'}]}/>}
function GlobalSearchPage(){
 const [q,setQ]=React.useState(''),[students,setStudents]=React.useState([]),[profiles,setProfiles]=React.useState([])
 async function search(e){e?.preventDefault?.(); const term=q.trim(); if(!term) return; const safe=term.replaceAll(',',' '); const [s,p]=await Promise.all([supabase.from('students').select('*').or(`student_number.ilike.%${safe}%,student_full_name_cache.ilike.%${safe}%,bus_number.ilike.%${safe}%`).limit(50),supabase.from('profiles').select('*').or(`full_name.ilike.%${safe}%,phone.ilike.%${safe}%`).limit(50)]); if(s.error) alert(s.error.message); else setStudents(s.data||[]); if(p.error) alert(p.error.message); else setProfiles(p.data||[])}
 return <Layout title="بحث موحد"><form onSubmit={search} className="card form-grid"><Field label="كلمة البحث"><input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="اسم، رقم طالب، هاتف، باص..."/></Field><button className="btn primary">بحث</button></form><div className="card"><h3>نتائج الطلاب</h3>{students.length?<SimpleTable rows={students} cols={[{key:'id',label:'ID'},{key:'student_number',label:'رقم الطالب'},{key:'student_full_name_cache',label:'الاسم'},{key:'status',label:'الحالة',render:r=>arValue(r.status)},{key:'bus_number',label:'الباص'}]}/>:<Empty/>}</div><div className="card"><h3>نتائج المستخدمين</h3>{profiles.length?<SimpleTable rows={profiles} cols={[{key:'full_name',label:'الاسم'},{key:'role',label:'الدور',render:r=>arValue(r.role)},{key:'phone',label:'الهاتف'}]}/>:<Empty/>}</div></Layout>
}


function ClassPricingPage(){
 const initial={class_id:'',academic_term_id:'',registration_fee:0,tuition_fee:0,bus_fee:0,books_fee:0,uniform_fee:0,activities_fee:0,default_discount_amount:0,default_discount_percent:0,currency:'JOD',is_active:true,notes:''}
 const [rows,setRows]=React.useState([]),[classes,setClasses]=React.useState([]),[terms,setTerms]=React.useState([]),[form,setForm]=React.useState(initial),[saving,setSaving]=React.useState(false),[editingId,setEditingId]=React.useState(null)
 const classesMap=React.useMemo(()=>Object.fromEntries(classes.map(c=>[String(c.id),c])),[classes])
 const termsMap=React.useMemo(()=>Object.fromEntries(terms.map(t=>[String(t.id),t])),[terms])
 async function load(){
  const [r,c,t]=await Promise.all([
   supabase.from('class_pricing').select('*').order('id',{ascending:false}),
   supabase.from('classes').select('id,name,section').order('id'),
   supabase.from('academic_terms').select('id,name,year_label,is_active').order('id',{ascending:false})
  ])
  if(r.error) alert(r.error.message); else setRows(r.data||[])
  if(c.error) alert(c.error.message); else setClasses(c.data||[])
  if(t.error) alert(t.error.message); else setTerms(t.data||[])
 }
 React.useEffect(()=>{load()},[])
 function setVal(k,v){setForm(x=>({...x,[k]:v}))}
 function edit(r){
  setEditingId(r.id)
  setForm({
   class_id:r.class_id||'',
   academic_term_id:r.academic_term_id||'',
   registration_fee:r.registration_fee??0,
   tuition_fee:r.tuition_fee??0,
   bus_fee:r.bus_fee??0,
   books_fee:r.books_fee??0,
   uniform_fee:r.uniform_fee??0,
   activities_fee:r.activities_fee??0,
   default_discount_amount:r.default_discount_amount??0,
   default_discount_percent:r.default_discount_percent??0,
   currency:r.currency||'JOD',
   is_active:r.is_active!==false,
   notes:r.notes||''
  })
  window.scrollTo({top:0,behavior:'smooth'})
 }
 async function save(e){
  e.preventDefault()
  if(!form.class_id) return alert('اختر الصف')
  setSaving(true)
  const payload={...form,class_id:Number(form.class_id),academic_term_id:form.academic_term_id?Number(form.academic_term_id):null,is_active:!!form.is_active}
  const q=editingId?supabase.from('class_pricing').update(payload).eq('id',editingId):supabase.from('class_pricing').insert(payload)
  const {error}=await q
  setSaving(false)
  if(error) alert(error.message); else {alert(editingId?'تم تعديل السعر':'تم حفظ السعر');setEditingId(null);setForm(initial);load()}
 }
 async function deleteRow(r){
  if(!confirm('هل تريد حذف صف السعر؟')) return
  const {error}=await supabase.from('class_pricing').delete().eq('id',r.id)
  if(error) alert(error.message); else load()
 }
 return <Layout title="أسعار الصفوف">
  <div className="alert">تم إصلاح الصفحة بحيث لا تعتمد على علاقة schema cache بين <b>class_pricing</b> و <b>academic_terms</b>. البيانات تُجلب الآن بشكل آمن حتى لو لم يحدّث Supabase الكاش بعد.</div>
  <form onSubmit={save} className="card form-grid enhanced-card">
   <Field label="الصف"><select className="input" value={form.class_id} onChange={e=>setVal('class_id',e.target.value)} required><option value="">اختر الصف</option>{classes.map(c=><option key={c.id} value={c.id}>{c.name} {c.section||''}</option>)}</select></Field>
   <Field label="الفصل الدراسي"><select className="input" value={form.academic_term_id||''} onChange={e=>setVal('academic_term_id',e.target.value)}><option value="">بدون فصل</option>{terms.map(t=><option key={t.id} value={t.id}>{t.name} {t.year_label||''}{t.is_active?' - فعال':''}</option>)}</select></Field>
   <Field label="رسوم التسجيل"><input type="number" step="0.01" className="input" value={form.registration_fee} onChange={e=>setVal('registration_fee',e.target.value)}/></Field>
   <Field label="الرسوم الدراسية"><input type="number" step="0.01" className="input" value={form.tuition_fee} onChange={e=>setVal('tuition_fee',e.target.value)}/></Field>
   <Field label="رسوم الباص"><input type="number" step="0.01" className="input" value={form.bus_fee} onChange={e=>setVal('bus_fee',e.target.value)}/></Field>
   <Field label="رسوم الكتب"><input type="number" step="0.01" className="input" value={form.books_fee} onChange={e=>setVal('books_fee',e.target.value)}/></Field>
   <Field label="رسوم الزي"><input type="number" step="0.01" className="input" value={form.uniform_fee} onChange={e=>setVal('uniform_fee',e.target.value)}/></Field>
   <Field label="رسوم الأنشطة"><input type="number" step="0.01" className="input" value={form.activities_fee} onChange={e=>setVal('activities_fee',e.target.value)}/></Field>
   <Field label="خصم مبلغ"><input type="number" step="0.01" className="input" value={form.default_discount_amount} onChange={e=>setVal('default_discount_amount',e.target.value)}/></Field>
   <Field label="خصم نسبة"><input type="number" step="0.01" className="input" value={form.default_discount_percent} onChange={e=>setVal('default_discount_percent',e.target.value)}/></Field>
   <Field label="العملة"><input className="input" value={form.currency} onChange={e=>setVal('currency',e.target.value)}/></Field>
   <Field label="فعّال"><select className="input" value={form.is_active?'true':'false'} onChange={e=>setVal('is_active',e.target.value==='true')}><option value="true">نعم</option><option value="false">لا</option></select></Field>
   <Field label="ملاحظات"><input className="input" value={form.notes} onChange={e=>setVal('notes',e.target.value)}/></Field>
   <div className="quick" style={{gridColumn:'1/-1'}}>
    <button className="btn primary" disabled={saving}>{saving?'جار الحفظ...':editingId?'تعديل':'حفظ'}</button>
    {editingId && <button type="button" className="btn dark" onClick={()=>{setEditingId(null);setForm(initial)}}>إلغاء التعديل</button>}
   </div>
  </form>
  {rows.length?<SimpleTable rows={rows} cols={[
   {key:'class',label:'الصف',render:r=>`${classesMap[String(r.class_id)]?.name||''} ${classesMap[String(r.class_id)]?.section||''}`.trim()||'-'},
   {key:'term',label:'الفصل',render:r=>{const t=termsMap[String(r.academic_term_id)]; return t?`${t.name||''} ${t.year_label||''}`.trim():'-'}},
   {key:'registration_fee',label:'التسجيل'},
   {key:'tuition_fee',label:'الدراسية'},
   {key:'bus_fee',label:'الباص'},
   {key:'books_fee',label:'الكتب'},
   {key:'uniform_fee',label:'الزي'},
   {key:'activities_fee',label:'الأنشطة'},
   {key:'default_discount_amount',label:'خصم مبلغ'},
   {key:'default_discount_percent',label:'خصم %'},
   {key:'is_active',label:'فعال',render:r=>r.is_active?'نعم':'لا'}
  ]} actions={r=><><button className="btn mini" onClick={()=>edit(r)}>تعديل</button><button className="btn mini danger" onClick={()=>deleteRow(r)}>حذف</button></>}/>:<Empty/>}
 </Layout>
}


function getProfileName(row) {
  if (!row) return ''
  const p = row.profiles
  if (Array.isArray(p)) return p[0]?.full_name || ''
  return p?.full_name || ''
}

function getProfilePhone(row) {
  if (!row) return ''
  const p = row.profiles
  if (Array.isArray(p)) return p[0]?.phone || ''
  return p?.phone || ''
}

function getClassName(row) {
  if (!row) return ''
  const c = row.classes
  if (Array.isArray(c)) return `${c[0]?.name || ''} ${c[0]?.section || ''}`.trim()
  return `${c?.name || ''} ${c?.section || ''}`.trim()
}

function SearchSelect({ label, value, onChange, options, placeholder='اكتب للبحث...', getLabel, getSubLabel }) {
  const [q, setQ] = React.useState('')
  const selected = options.find(o => String(o.id) === String(value))
  const shown = options
    .filter(o => {
      const a = (getLabel(o) || '').toLowerCase()
      const b = (getSubLabel?.(o) || '').toLowerCase()
      const x = q.toLowerCase()
      return !x || a.includes(x) || b.includes(x)
    })
    .slice(0, 30)

  return (
    <label className="field searchable-field">
      <span>{label}</span>
      <input
        className="input"
        value={q || (selected ? getLabel(selected) : '')}
        onChange={e => { setQ(e.target.value); if (!e.target.value) onChange('') }}
        onFocus={() => setQ('')}
        placeholder={placeholder}
      />
      <div className="search-menu">
        {shown.map(o => (
          <button
            type="button"
            key={o.id}
            className={String(o.id) === String(value) ? 'chosen' : ''}
            onMouseDown={(e) => {
              e.preventDefault()
              onChange(o.id)
              setQ(getLabel(o))
            }}
          >
            <b>{getLabel(o)}</b>
            {getSubLabel && <small>{getSubLabel(o)}</small>}
          </button>
        ))}
        {shown.length === 0 && <div className="no-options">لا توجد نتائج</div>}
      </div>
    </label>
  )
}


function StudentsPage(){
  const [profiles,setProfiles]=React.useState([]),[classes,setClasses]=React.useState([]),[rows,setRows]=React.useState([])
  const [q,setQ]=React.useState(''),[saving,setSaving]=React.useState(false)
  const [form,setForm]=React.useState({profile_id:'',class_id:'',student_number:'',date_of_birth:'',address:''})

  async function load(){
    const [p,c,s]=await Promise.all([
      supabase.from('profiles').select('id,full_name,phone,role').eq('role','student').order('full_name'),
      supabase.from('classes').select('id,name,section').order('id'),
      supabase.from('students').select('*').neq('status','archived').order('id',{ascending:false})
    ])
    if(p.error) alert(p.error.message); else setProfiles(p.data||[])
    if(c.error) alert(c.error.message); else setClasses(c.data||[])
    if(s.error) alert(s.error.message); else setRows(s.data||[])
  }

  React.useEffect(()=>{load()},[])

  function studentName(row){
    return profiles.find(p=>p.id===row.profile_id)?.full_name || row.student_full_name_cache || ''
  }
  function studentPhone(row){
    return profiles.find(p=>p.id===row.profile_id)?.phone || ''
  }
  function className(row){
    const c = classes.find(x=>String(x.id)===String(row.class_id))
    return c ? `${c.name||''} ${c.section||''}`.trim() : ''
  }

  async function save(e){
    e.preventDefault()
    if(!form.profile_id) return alert('اختر حساب الطالب')
    if(!form.class_id) return alert('اختر الصف')
    setSaving(true)

    const payload = {
      profile_id: form.profile_id,
      class_id: Number(form.class_id),
      student_number: form.student_number || null,
      date_of_birth: form.date_of_birth || null,
      address: form.address || null,
      status: 'active'
    }

    const {error}=await supabase.from('students').insert(payload)
    setSaving(false)

    if(error){
      alert('لم يتم الحفظ: ' + error.message)
    } else {
      alert('تم حفظ الطالب')
      setForm({profile_id:'',class_id:'',student_number:'',date_of_birth:'',address:''})
      load()
    }
  }

  async function archive(id){
    const reason=prompt('سبب الأرشفة')||'أرشفة'
    const {error}=await supabase.rpc('archive_student',{p_student_id:id,p_reason:reason})
    if(error)alert(error.message); else load()
  }

  const filtered=rows.filter(s=>{
    const text = `${studentName(s)} ${studentPhone(s)} ${s.student_number||''} ${className(s)} ${s.bus_number||''} ${s.bus_round||''}`.toLowerCase()
    return text.includes(q.toLowerCase())
  })

  return <Layout title="إدارة الطلاب">
   <div className="quick"><Link className="btn dark" to="/admin/students/extra-info">معلومات إضافية وباص</Link><Link className="btn dark" to="/admin/leaving-students">مغادرة طالب</Link><Link className="btn dark" to="/admin/returning-students">عودة طالب</Link><Link className="btn dark" to="/admin/students/archive">الأرشيف</Link></div>

   <form onSubmit={save} className="card form-grid">
    <SearchSelect
      label="حساب الطالب"
      value={form.profile_id}
      onChange={v=>setForm({...form,profile_id:v})}
      options={profiles}
      getLabel={p=>p.full_name}
      getSubLabel={p=>p.phone || p.id}
      placeholder="اكتب اسم الطالب أو الهاتف..."
    />

    <SearchSelect
      label="الصف"
      value={form.class_id}
      onChange={v=>setForm({...form,class_id:v})}
      options={classes}
      getLabel={c=>`${c.name||''} ${c.section||''}`.trim()}
      getSubLabel={c=>`معرّف الصف: ${c.id}`}
      placeholder="اكتب اسم الصف..."
    />

    <Field label="رقم الطالب"><input className="input" {...inputProps(setForm,form,'student_number')}/></Field>
    <Field label="تاريخ الميلاد"><input type="date" className="input" {...inputProps(setForm,form,'date_of_birth')}/></Field>
    <Field label="العنوان"><input className="input" {...inputProps(setForm,form,'address')}/></Field>
    <button className="btn primary" disabled={saving}>{saving ? 'جاري الحفظ...' : 'إضافة'}</button>
   </form>

   <div className="card"><input className="input" placeholder="بحث بالاسم أو الرقم أو الهاتف أو الصف أو الباص..." value={q} onChange={e=>setQ(e.target.value)}/></div>

   <SimpleTable rows={filtered} cols={[
     {key:'name',label:'الطالب',render:r=>studentName(r)},
     {key:'student_number',label:'الرقم'},
     {key:'phone',label:'الهاتف',render:r=>studentPhone(r)},
     {key:'class',label:'الصف',render:r=>className(r)},
     {key:'status',label:'الحالة',render:r=>arValue(r.status)},
     {key:'bus_number',label:'الباص'},
     {key:'bus_round',label:'الجولة'}
   ]} actions={r=><><Link className="btn mini" to={`/admin/student-profile/${r.id}`}>ملف</Link><button className="btn mini danger" onClick={()=>archive(r.id)}>أرشفة</button></>}/>
  </Layout>
}



function ArchivedStudentsPage(){
 const [rows,setRows]=React.useState([]),[profiles,setProfiles]=React.useState([]),[classes,setClasses]=React.useState([])

 async function load(){
   const [s,p,c]=await Promise.all([
     supabase.from('students').select('*').eq('status','archived').order('id',{ascending:false}),
     supabase.from('profiles').select('id,full_name'),
     supabase.from('classes').select('id,name,section')
   ])
   if(s.error) alert(s.error.message); else setRows(s.data||[])
   if(!p.error) setProfiles(p.data||[])
   if(!c.error) setClasses(c.data||[])
 }

 React.useEffect(()=>{load()},[])

 function name(r){ return profiles.find(p=>p.id===r.profile_id)?.full_name || r.student_full_name_cache || '' }
 function cls(r){ const c=classes.find(x=>String(x.id)===String(r.class_id)); return c ? `${c.name||''} ${c.section||''}`.trim() : '-' }

 async function restore(id){
   const {error}=await supabase.rpc('restore_student',{p_student_id:id})
   if(error)alert(error.message); else load()
 }

 return <Layout title="أرشيف الطلاب">
   {rows.length?<SimpleTable rows={rows} cols={[
     {key:'name',label:'الطالب',render:r=>name(r)},
     {key:'student_number',label:'الرقم'},
     {key:'class',label:'الصف',render:r=>cls(r)},
     {key:'archive_reason',label:'سبب الأرشفة'}
   ]} actions={r=><button className="btn mini good" onClick={()=>restore(r.id)}>استعادة</button>}/>:<Empty/>}
 </Layout>
}



function StudentExtraInfoPage(){
 const [students,setStudents]=React.useState([]),[profiles,setProfiles]=React.useState([]),[classes,setClasses]=React.useState([]),[id,setId]=React.useState(''),[form,setForm]=React.useState({})

 async function load(){
   const [s,p,c]=await Promise.all([
     supabase.from('students').select('*').order('id'),
     supabase.from('profiles').select('id,full_name,phone').order('full_name'),
     supabase.from('classes').select('id,name,section').order('id')
   ])
   if(s.error) alert(s.error.message); else setStudents(s.data||[])
   if(!p.error) setProfiles(p.data||[])
   if(!c.error) setClasses(c.data||[])
 }

 React.useEffect(()=>{load()},[])

 function studentLabel(s){
   const p=profiles.find(x=>x.id===s.profile_id)
   return `${p?.full_name || s.student_full_name_cache || ''} - ${s.student_number || ''}`.trim()
 }
 function studentSub(s){
   const p=profiles.find(x=>x.id===s.profile_id)
   const c=classes.find(x=>String(x.id)===String(s.class_id))
   return `${p?.phone || ''} ${c?.name || ''} ${c?.section || ''} ${s.bus_number || ''} ${s.bus_round || ''}`.trim()
 }

 function pick(v){
   setId(v)
   setForm(students.find(x=>String(x.id)===String(v))||{})
 }

 async function save(e){
   e.preventDefault()
   const payload={
     national_id:form.national_id||null,
     gender:form.gender||null,
     health_notes:form.health_notes||null,
     emergency_contact_name:form.emergency_contact_name||null,
     emergency_contact_phone:form.emergency_contact_phone||null,
     extra_notes:form.extra_notes||null,
     bus_number:form.bus_number||null,
     bus_round:form.bus_round||null,
     pickup_point:form.pickup_point||null,
     dropoff_point:form.dropoff_point||null,
     transport_notes:form.transport_notes||null
   }
   const {error}=await supabase.from('students').update(payload).eq('id',id)
   if(error)alert('لم يتم الحفظ: '+error.message)
   else{alert('تم حفظ معلومات الطالب');load()}
 }

 return <Layout title="معلومات الطالب والمواصلات">
   <div className="card">
     <SearchSelect
       label="اختر الطالب"
       value={id}
       onChange={pick}
       options={students}
       getLabel={studentLabel}
       getSubLabel={studentSub}
       placeholder="اكتب اسم الطالب أو رقمه أو الهاتف أو الباص..."
     />
   </div>
   {id&&<form onSubmit={save} className="card form-grid">
     {['national_id','gender','emergency_contact_name','emergency_contact_phone','bus_number','bus_round','pickup_point','dropoff_point','health_notes','transport_notes','extra_notes'].map(k=>
       <Field key={k} label={arLabel(k)}><input className="input" {...inputProps(setForm,form,k)}/></Field>
     )}
     <button className="btn primary">حفظ</button>
   </form>}
 </Layout>
}


function StudentProfilePage(){
 const {id}=useParams(); const [st,setSt]=React.useState(null),[sum,setSum]=React.useState(null),[mov,setMov]=React.useState([])
 React.useEffect(()=>{(async()=>{const [s,a,m]=await Promise.all([supabase.from('students').select('*, profiles!students_profile_id_fkey(full_name,phone), classes(name,section)').eq('id',id).maybeSingle(),supabase.from('student_account_summary').select('*').eq('student_id',id).maybeSingle(),supabase.from('student_movements').select('*').eq('student_id',id).order('movement_date',{ascending:false})]);setSt(s.data);setSum(a.data);setMov(m.data||[])})()},[id])
 if(!st)return <Layout title="ملف الطالب"><Empty title="لم يتم العثور على الطالب"/></Layout>
 return <Layout title={`ملف الطالب - ${st.profiles?.full_name}`}><div className="quick"><button onClick={()=>window.print()} className="btn dark">طباعة</button></div><div className="grid4"><Stat label="الرقم" value={st.student_number||'-'}/><Stat label="الصف" value={`${st.classes?.name||''}`}/><Stat label="الحالة" value={st.status}/><Stat label="الرصيد" value={fmt(sum?.balance)}/></div><div className="card"><h2>بيانات</h2><p>الباص: {st.bus_number||'-'} / الجولة: {st.bus_round||'-'}</p><p>نقطة الصعود: {st.pickup_point||'-'}</p><p>ملاحظات: {st.extra_notes||'-'}</p></div><div className="card"><h2>سجل الحركة</h2>{mov.map(x=><div className="line" key={x.id}>{x.movement_date} - {x.movement_type} - {x.reason||''}</div>)}</div></Layout>
}

function LeavingStudentsPage(){
 const [students,setStudents]=React.useState([]),[form,setForm]=React.useState({student_id:'',movement_type:'left_school',movement_date:new Date().toISOString().slice(0,10),reason:'',note:''})
 React.useEffect(()=>{supabase.from('students').select('id,student_number,profiles!students_profile_id_fkey(full_name)').in('status',['active','returned','suspended']).then(r=>setStudents(r.data||[]))},[])
 async function save(e){e.preventDefault();const {error}=await supabase.rpc('student_leave_school',{p_student_id:Number(form.student_id),p_movement_type:form.movement_type,p_date:form.movement_date,p_reason:form.reason,p_note:form.note});if(error)alert(error.message);else alert('تم تسجيل المغادرة')}
 return <Layout title="تسجيل مغادرة طالب"><form onSubmit={save} className="card form-grid"><Field label="الطالب"><select className="input" {...inputProps(setForm,form,'student_id')}><option value="">اختر</option>{students.map(s=><option key={s.id} value={s.id}>{s.profiles?.full_name}</option>)}</select></Field><Field label="النوع"><select className="input" {...inputProps(setForm,form,'movement_type')}><option value="left_school">غادر</option><option value="withdrawn">انسحاب</option><option value="transferred_out">انتقال</option><option value="graduated">تخرج</option><option value="suspended">إيقاف</option></select></Field><Field label="التاريخ"><input type="date" className="input" {...inputProps(setForm,form,'movement_date')}/></Field><Field label="السبب"><input className="input" {...inputProps(setForm,form,'reason')}/></Field><button className="btn danger">حفظ</button></form></Layout>
}

function ReturningStudentsPage(){
 const [students,setStudents]=React.useState([]),[classes,setClasses]=React.useState([]),[form,setForm]=React.useState({student_id:'',to_class_id:'',return_date:new Date().toISOString().slice(0,10),new_student_number:'',reason:''})
 React.useEffect(()=>{(async()=>{const [s,c]=await Promise.all([supabase.from('students').select('id,student_number,status,profiles!students_profile_id_fkey(full_name)').in('status',['left','withdrawn','transferred','graduated','archived','suspended']),supabase.from('classes').select('*').order('id')]);setStudents(s.data||[]);setClasses(c.data||[])})()},[])
 async function save(e){e.preventDefault();const {error}=await supabase.rpc('student_return_to_school',{p_student_id:Number(form.student_id),p_to_class_id:Number(form.to_class_id),p_date:form.return_date,p_new_student_number:form.new_student_number||null,p_reason:form.reason});if(error)alert(error.message);else alert('تمت عودة الطالب')}
 return <Layout title="عودة طالب غادر"><form onSubmit={save} className="card form-grid"><Field label="الطالب القديم"><select className="input" {...inputProps(setForm,form,'student_id')}><option value="">اختر</option>{students.map(s=><option key={s.id} value={s.id}>{s.profiles?.full_name} - {s.student_number} - {s.status}</option>)}</select></Field><Field label="الصف الجديد"><select className="input" {...inputProps(setForm,form,'to_class_id')}><option value="">اختر</option>{classes.map(c=><option key={c.id} value={c.id}>{c.name} {c.section}</option>)}</select></Field><Field label="تاريخ العودة"><input type="date" className="input" {...inputProps(setForm,form,'return_date')}/></Field><Field label="رقم جديد اختياري"><input className="input" {...inputProps(setForm,form,'new_student_number')}/></Field><Field label="سبب العودة"><input className="input" {...inputProps(setForm,form,'reason')}/></Field><button className="btn good">إرجاع الطالب</button></form></Layout>
}

function StudentMovementsPage(){return <CrudPage title="سجل حركة الطلاب" table="student_movements" select="*, students(student_number, student_full_name_cache)" order="id" initial={{}} allowDelete={true} cols={[{key:'student',label:'الطالب',render:r=>r.students?.student_full_name_cache || r.students?.student_number || '-'},{key:'student_number',label:'رقم الطالب',render:r=>r.students?.student_number || '-'},{key:'movement_type',label:'الحركة',render:r=>arValue(r.movement_type)},{key:'movement_date',label:'التاريخ'},{key:'reason',label:'السبب'}]} />}

function AnnualPromotionPage(){
 const today = new Date().toISOString().slice(0,10)
 const [classes,setClasses]=React.useState([])
 const [progressions,setProgressions]=React.useState([])
 const [students,setStudents]=React.useState([])
 const [loading,setLoading]=React.useState(false)
 const [form,setForm]=React.useState({from_class_id:'',to_class_id:'',is_graduation:false,sort_order:0,note:''})
 const [run,setRun]=React.useState({from_class_id:'',to_class_id:'',promotion_date:today,academic_year:'',note:'ترحيل سنوي'})

 async function load(){
   const [c,p]=await Promise.all([
     supabase.from('classes').select('id,name,section').order('id'),
     supabase.from('class_progressions').select('*').order('sort_order',{ascending:true})
   ])
   if(c.error) alert('خطأ الصفوف: '+c.error.message); else setClasses(c.data||[])
   if(p.error) alert('خطأ تسلسل الصفوف: '+p.error.message); else setProgressions(p.data||[])
 }
 React.useEffect(()=>{load()},[])
 React.useEffect(()=>{preview()},[run.from_class_id])

 function className(id){
   const c=classes.find(x=>String(x.id)===String(id))
   return c ? `${c.name||''} ${c.section||''}`.trim() : '-'
 }
 function setFormVal(k,v){setForm(x=>({...x,[k]:v}))}
 function setRunVal(k,v){setRun(x=>({...x,[k]:v}))}

 async function saveProgression(e){
   e.preventDefault()
   if(!form.from_class_id) return alert('اختر الصف الحالي')
   if(!form.is_graduation && !form.to_class_id) return alert('اختر الصف التالي أو فعّل خيار تخرج')
   const payload={
     from_class_id: form.from_class_id,
     to_class_id: form.is_graduation ? null : form.to_class_id,
     is_graduation: !!form.is_graduation,
     sort_order: Number(form.sort_order||0),
     note: form.note || null
   }
   const {error}=await supabase.from('class_progressions').upsert(payload,{onConflict:'from_class_id'})
   if(error) alert('لم يتم حفظ التسلسل: '+error.message)
   else{ setForm({from_class_id:'',to_class_id:'',is_graduation:false,sort_order:0,note:''}); load(); alert('تم حفظ تسلسل الصف') }
 }

 async function deleteProgression(r){
   if(!confirm('حذف هذا التسلسل؟')) return
   const {error}=await supabase.from('class_progressions').delete().eq('id',r.id)
   if(error) alert(error.message); else load()
 }

 async function preview(){
   if(!run.from_class_id){ setStudents([]); return }
   const {data,error}=await supabase
     .from('students')
     .select('id,student_number,status,class_id,student_full_name_cache,profiles!students_profile_id_fkey(full_name)')
     .eq('class_id',run.from_class_id)
     .in('status',['active','returned','suspended'])
     .order('student_number',{ascending:true})
   if(error) alert('خطأ تحميل الطلاب: '+error.message); else setStudents(data||[])
 }

 function applyProgression(id){
   const p=progressions.find(x=>String(x.from_class_id)===String(id))
   setRun(x=>({...x,from_class_id:id,to_class_id:p?.to_class_id || ''}))
 }

 async function promote(){
   if(!run.from_class_id) return alert('اختر الصف الحالي')
   const progression = progressions.find(x=>String(x.from_class_id)===String(run.from_class_id))
   const isGraduation = progression?.is_graduation && !run.to_class_id
   if(!isGraduation && !run.to_class_id) return alert('اختر الصف الجديد أو اضبط تسلسل الصفوف')
   if(!students.length) return alert('لا يوجد طلاب في هذا الصف')
   const msg = isGraduation
     ? `سيتم تخريج ${students.length} طالب/طالبة من ${className(run.from_class_id)}. هل أنت متأكد؟`
     : `سيتم ترحيل ${students.length} طالب/طالبة من ${className(run.from_class_id)} إلى ${className(run.to_class_id)}. هل أنت متأكد؟`
   if(!confirm(msg)) return
   setLoading(true)
   try{
     const {data:{user}} = await supabase.auth.getUser()
     const studentIds = students.map(s=>s.id)
     const movementRows = students.map(s=>({
       student_id:s.id,
       movement_type:isGraduation?'graduated':'annual_promotion',
       movement_date:run.promotion_date,
       from_class_id:run.from_class_id,
       to_class_id:isGraduation?null:run.to_class_id,
       old_status:s.status || 'active',
       new_status:isGraduation?'graduated':'active',
       reason:run.academic_year ? `الترحيل السنوي ${run.academic_year}` : 'الترحيل السنوي',
       note:run.note || null,
       created_by:user?.id || null
     }))
     const {error:movErr}=await supabase.from('student_movements').insert(movementRows)
     if(movErr) throw movErr

     const updatePayload = isGraduation
       ? {status:'graduated', left_at:run.promotion_date, last_movement_note:run.note || 'تم التخرج بالترحيل السنوي'}
       : {class_id:run.to_class_id, status:'active', last_movement_note:run.note || 'تم الترحيل السنوي'}
     const {error:stuErr}=await supabase.from('students').update(updatePayload).in('id',studentIds)
     if(stuErr) throw stuErr

     await supabase.from('student_enrollment_periods')
       .update({ended_on:run.promotion_date,end_reason:isGraduation?'graduated':'annual_promotion',is_current:false})
       .in('student_id',studentIds)
       .eq('is_current',true)

     if(!isGraduation){
       const enrollmentRows = students.map(s=>({
         student_id:s.id,
         class_id:run.to_class_id,
         started_on:run.promotion_date,
         is_current:true,
         created_by:user?.id || null
       }))
       const {error:enErr}=await supabase.from('student_enrollment_periods').insert(enrollmentRows)
       if(enErr) throw enErr
     }

     alert('تم تنفيذ الترحيل السنوي بنجاح')
     setRun({from_class_id:'',to_class_id:'',promotion_date:today,academic_year:'',note:'ترحيل سنوي'})
     setStudents([])
     load()
   }catch(err){
     alert('فشل الترحيل: '+(err?.message || err))
   }finally{ setLoading(false) }
 }

 return <Layout title="الترحيل السنوي">
   <div className="alert">هذه الصفحة أصبحت عملية: اضبط تسلسل الصفوف مرة واحدة، ثم اختر الصف الحالي ونفّذ الترحيل. النظام يسجل الحركة في student_movements ويحدّث student_enrollment_periods تلقائيًا.</div>

   <form onSubmit={saveProgression} className="card form-grid">
     <h2 style={{gridColumn:'1/-1',margin:'0 0 6px'}}>إعداد تسلسل الصفوف</h2>
     <Field label="من الصف"><select className="input" value={form.from_class_id} onChange={e=>setFormVal('from_class_id',e.target.value)}><option value="">اختر</option>{classes.map(c=><option key={c.id} value={c.id}>{className(c.id)}</option>)}</select></Field>
     <Field label="إلى الصف"><select className="input" value={form.to_class_id} onChange={e=>setFormVal('to_class_id',e.target.value)} disabled={form.is_graduation}><option value="">اختر</option>{classes.map(c=><option key={c.id} value={c.id}>{className(c.id)}</option>)}</select></Field>
     <Field label="ترتيب"><input type="number" className="input" value={form.sort_order} onChange={e=>setFormVal('sort_order',e.target.value)}/></Field>
     <Field label="تخرج؟"><select className="input" value={form.is_graduation?'yes':'no'} onChange={e=>setFormVal('is_graduation',e.target.value==='yes')}><option value="no">لا</option><option value="yes">نعم، هذا آخر صف</option></select></Field>
     <Field label="ملاحظة"><input className="input" value={form.note} onChange={e=>setFormVal('note',e.target.value)}/></Field>
     <button className="btn primary">حفظ التسلسل</button>
   </form>

   {progressions.length ? <SimpleTable rows={progressions} cols={[
     {key:'from',label:'من الصف',render:r=>className(r.from_class_id)},
     {key:'to',label:'إلى الصف',render:r=>r.is_graduation?'تخرج':className(r.to_class_id)},
     {key:'sort_order',label:'الترتيب'},
     {key:'note',label:'ملاحظة'}
   ]} actions={r=><button type="button" className="btn mini danger" onClick={()=>deleteProgression(r)}>حذف</button>} /> : <div className="card empty">لم يتم إعداد تسلسل الصفوف بعد.</div>}

   <div className="card form-grid">
     <h2 style={{gridColumn:'1/-1',margin:'0 0 6px'}}>تنفيذ الترحيل السنوي</h2>
     <Field label="السنة الدراسية"><input className="input" value={run.academic_year} onChange={e=>setRunVal('academic_year',e.target.value)} placeholder="مثال: 2026/2027"/></Field>
     <Field label="تاريخ الترحيل"><input type="date" className="input" value={run.promotion_date} onChange={e=>setRunVal('promotion_date',e.target.value)}/></Field>
     <Field label="من الصف"><select className="input" value={run.from_class_id} onChange={e=>applyProgression(e.target.value)}><option value="">اختر</option>{classes.map(c=><option key={c.id} value={c.id}>{className(c.id)}</option>)}</select></Field>
     <Field label="إلى الصف"><select className="input" value={run.to_class_id} onChange={e=>setRunVal('to_class_id',e.target.value)}><option value="">حسب التسلسل / تخرج</option>{classes.map(c=><option key={c.id} value={c.id}>{className(c.id)}</option>)}</select></Field>
     <Field label="ملاحظة"><input className="input" value={run.note} onChange={e=>setRunVal('note',e.target.value)}/></Field>
     <button type="button" className="btn good" disabled={loading} onClick={promote}>{loading?'جاري التنفيذ...':'تنفيذ الترحيل'}</button>
   </div>

   <div className="card">
     <h2>معاينة الطلاب</h2>
     <p className="muted">عدد الطلاب الجاهزين للترحيل من الصف المحدد: {students.length}</p>
     {students.length ? <SimpleTable rows={students} cols={[
       {key:'student_number',label:'رقم الطالب'},
       {key:'name',label:'الاسم',render:r=>r.profiles?.full_name || r.student_full_name_cache || '-'},
       {key:'status',label:'الحالة',render:r=>arValue(r.status)},
       {key:'to',label:'سيتم نقله إلى',render:()=>run.to_class_id ? className(run.to_class_id) : 'تخرج / غير محدد'}
     ]}/> : <Empty/>}
   </div>
 </Layout>
}

function TeacherGrades(){return <CrudPage title="إدخال الدرجات" table="grades" initial={{student_id:'',subject_id:'',title:'اختبار',score:0,max_score:100}} cols={[{key:'student_id',label:'طالب'},{key:'subject_id',label:'مادة'},{key:'title',label:'التقييم'},{key:'score',label:'الدرجة'}]}/>}
function TeacherAttendance(){return <CrudPage title="الحضور" table="attendance" initial={{student_id:'',class_id:'',date:new Date().toISOString().slice(0,10),status:'present',note:''}} cols={[{key:'student_id',label:'طالب'},{key:'date',label:'تاريخ'},{key:'status',label:'الحالة',render:r=>arValue(r.status)}]}/>}
function TeacherAssignments(){return <CrudPage title="الواجبات" table="assignments" initial={{class_id:'',subject_id:'',title:'',description:'',due_date:''}} cols={[{key:'title',label:'العنوان'},{key:'due_date',label:'الموعد'}]}/>}
function MyGrades(){return <CrudPage title="درجاتي" table="grades" initial={{}} cols={[{key:'title',label:'التقييم'},{key:'score',label:'الدرجة'},{key:'max_score',label:'من'}]}/>}
function MyAttendance(){return <CrudPage title="حضوري" table="attendance" initial={{}} cols={[{key:'date',label:'التاريخ'},{key:'status',label:'الحالة',render:r=>arValue(r.status)}]}/>}
function ParentChildren(){return <CrudPage title="أبنائي" table="parent_students" select="*,students(student_number,profiles!students_profile_id_fkey(full_name),classes(name,section))" initial={{}} cols={[{key:'student',label:'الطالب',render:r=>getProfileName(studentsMap[String(r.student_id)])||'-'},{key:'number',label:'الرقم',render:r=>r.students?.student_number},{key:'class',label:'الصف',render:r=>r.students?.classes?.name}]}/>}


function replaceTemplate(template, data) {
  const all = `${template.header_html || ''}${template.body_html || ''}${template.footer_html || ''}`
  return all.replace(/\{\{(.*?)\}\}/g, (_, key) => data[String(key).trim()] ?? '')
}

function PrintTemplatesPage(){
 const [items,setItems]=React.useState([]),[form,setForm]=React.useState({template_key:'',title:'',document_type:'contract',paper_size:'A4',orientation:'portrait',header_html:'',body_html:'',footer_html:'',css:''})
 async function load(){const {data,error}=await supabase.from('document_templates').select('*').order('id'); if(error)alert(error.message); else setItems(data||[])}
 React.useEffect(()=>{load()},[])
 function edit(t){setForm({template_key:t.template_key||'',title:t.title||'',document_type:t.document_type||'contract',paper_size:t.paper_size||'A4',orientation:t.orientation||'portrait',header_html:t.header_html||'',body_html:t.body_html||'',footer_html:t.footer_html||'',css:t.css||''}); window.scrollTo({top:0,behavior:'smooth'})}
 async function save(e){e.preventDefault(); const {error}=await supabase.from('document_templates').upsert({...form,updated_at:new Date().toISOString()},{onConflict:'template_key'}); if(error)alert(error.message); else{alert('تم حفظ القالب');load()}}
 return <Layout title="قوالب الطباعة والعقود">
  <div className="alert">القوالب قابلة للتعديل من الأدمن. استخدم متغيرات مثل: {'{{student_name}}'} {'{{contract_no}}'} {'{{net_amount}}'} {'{{print_date}}'}.</div>
  <form onSubmit={save} className="card form-grid">
   <Field label="مفتاح القالب"><input className="input" value={form.template_key} onChange={e=>setForm({...form,template_key:e.target.value})} placeholder="student_contract_regular - مفتاح ثابت بدون مسافات"/></Field>
   <Field label="العنوان"><input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></Field>
   <Field label="النوع"><select className="input" value={form.document_type} onChange={e=>setForm({...form,document_type:e.target.value})}><option value="contract">عقد</option><option value="scholarship_contract">عقد منحة</option><option value="receipt">سند</option><option value="report">تقرير</option><option value="statement">كشف حساب</option><option value="custom">مخصص</option></select></Field>
   <Field label="الاتجاه"><select className="input" value={form.orientation} onChange={e=>setForm({...form,orientation:e.target.value})}><option value="portrait">عمودي</option><option value="landscape">أفقي</option></select></Field>
   <label className="field" style={{gridColumn:'1/-1'}}><span>رأس الصفحة HTML</span><textarea className="input" rows="4" value={form.header_html} onChange={e=>setForm({...form,header_html:e.target.value})}/></label>
   <label className="field" style={{gridColumn:'1/-1'}}><span>محتوى الصفحة HTML</span><textarea className="input" rows="9" value={form.body_html} onChange={e=>setForm({...form,body_html:e.target.value})}/></label>
   <label className="field" style={{gridColumn:'1/-1'}}><span>تذييل الصفحة HTML</span><textarea className="input" rows="3" value={form.footer_html} onChange={e=>setForm({...form,footer_html:e.target.value})}/></label>
   <label className="field" style={{gridColumn:'1/-1'}}><span>تنسيق CSS</span><textarea dir="ltr" className="input" rows="7" value={form.css} onChange={e=>setForm({...form,css:e.target.value})}/></label>
   <button className="btn primary">حفظ القالب</button>
  </form>
  <SimpleTable rows={items} cols={[{key:'template_key',label:'المفتاح'},{key:'title',label:'العنوان'},{key:'document_type',label:'النوع'}]} actions={r=><button className="btn mini" onClick={()=>edit(r)}>تعديل</button>}/>
 </Layout>
}

function contractData(c, summary){
 return {
  school_name:'بوابة الطالب المدرسية',
  print_date:new Date().toLocaleDateString('ar-JO'),
  contract_no:c.contract_no||'',
  student_name:c.students?.profiles?.full_name||'',
  student_number:c.students?.student_number||'',
  class_name:`${c.students?.classes?.name||''} ${c.students?.classes?.section||''}`,
  bus_number:c.students?.bus_number||'-',
  bus_round:c.students?.bus_round||'-',
  registration_fee:fmt(c.registration_fee_snapshot),
  tuition_fee:fmt(c.tuition_fee_snapshot),
  bus_fee:fmt(c.bus_fee_snapshot),
  books_fee:fmt(c.books_fee_snapshot),
  uniform_fee:fmt(c.uniform_fee_snapshot),
  activities_fee:fmt(c.activities_fee_snapshot),
  discount_amount:fmt(c.discount_amount),
  total_amount:fmt(c.total_amount),
  net_amount:fmt(c.net_amount),
  scholarship_title:c.scholarship_title||'منحة / خصم',
  scholarship_percent:c.scholarship_percent||0,
  scholarship_amount:fmt(c.scholarship_amount||c.discount_amount||0),
  total_fees:fmt(summary?.total_fees),
  total_payments:fmt(summary?.total_payments),
  total_discounts:fmt(summary?.total_discounts),
  balance:fmt(summary?.balance)
 }
}

async function printStudentContract({contract, templates, studentsMap, classesMap, termsMap, pricingMap, guardiansMap}){
 const c = contract
 const student = studentsMap?.[String(c.student_id)]
 const pricing = pricingMap?.[String(c.class_pricing_id)]
 const directClass = classesMap?.[String(student?.class_id)]
 const pricingClass = classesMap?.[String(pricing?.class_id)]
 const term = termsMap?.[String(c.academic_term_id || pricing?.academic_term_id)]
 const guardian = guardiansMap?.[String(c.guardian_id)]
 const key = c.contract_type === 'scholarship' ? 'student_contract_scholarship' : 'student_contract_regular'
 const template = templates?.find(t=>t.template_key===key) || templates?.[0]
 if(!template) throw new Error('لا يوجد قالب طباعة. شغّل SQL V17 أولًا.')
 const {data:summary}=await supabase.from('student_account_summary').select('*').eq('student_id',c.student_id).maybeSingle()
 const classLabel = `${pricingClass?.name || directClass?.name || ''} ${pricingClass?.section || directClass?.section || ''}`.trim()
 openPrintWindow({
  template,
  data:{
   school_name:'بوابة الطالب المدرسية',
   print_date:new Date().toLocaleDateString('ar-JO'),
   contract_no:c.contract_no||'',
   student_name:getProfileName(student)||'',
   student_number:student?.student_number||'',
   guardian_name:guardian?.full_name||'',
   class_name:classLabel,
   academic_term_name:term?`${term.name||''} ${term.year_label||''}`.trim():'',
   bus_number:student?.bus_number||'-',
   bus_round:student?.bus_round||'-',
   registration_fee:fmt(c.registration_fee_snapshot ?? pricing?.registration_fee),
   tuition_fee:fmt(c.tuition_fee_snapshot ?? pricing?.tuition_fee),
   bus_fee:fmt(c.bus_fee_snapshot ?? pricing?.bus_fee),
   books_fee:fmt(c.books_fee_snapshot ?? pricing?.books_fee),
   uniform_fee:fmt(c.uniform_fee_snapshot ?? pricing?.uniform_fee),
   activities_fee:fmt(c.activities_fee_snapshot ?? pricing?.activities_fee),
   discount_amount:fmt(c.discount_amount),
   total_amount:fmt(c.total_amount),
   net_amount:fmt(c.net_amount ?? (Number(c.total_amount||0)-Number(c.discount_amount||0))),
   scholarship_title:c.scholarship_title||'منحة / خصم',
   scholarship_percent:c.scholarship_percent||0,
   scholarship_amount:fmt(c.scholarship_amount||c.discount_amount||0),
   total_fees:fmt(summary?.total_fees),
   total_payments:fmt(summary?.total_payments),
   total_discounts:fmt(summary?.total_discounts),
   balance:fmt(summary?.balance)
  },
  title:c.contract_no||'عقد'
 })
 await supabase.rpc('log_document_print',{p_template_key:template.template_key,p_document_type:template.document_type,p_entity_table:'student_contracts',p_entity_id:String(c.id),p_note:'طباعة عقد'})
}

function PrintContractsPage(){
 const [contracts,setContracts]=React.useState([]),[templates,setTemplates]=React.useState([]),[students,setStudents]=React.useState([]),[classes,setClasses]=React.useState([]),[terms,setTerms]=React.useState([]),[pricing,setPricing]=React.useState([]),[guardians,setGuardians]=React.useState([])
 const studentsMap=React.useMemo(()=>Object.fromEntries(students.map(x=>[String(x.id),x])),[students])
 const classesMap=React.useMemo(()=>Object.fromEntries(classes.map(x=>[String(x.id),x])),[classes])
 const termsMap=React.useMemo(()=>Object.fromEntries(terms.map(x=>[String(x.id),x])),[terms])
 const pricingMap=React.useMemo(()=>Object.fromEntries(pricing.map(x=>[String(x.id),x])),[pricing])
 const guardiansMap=React.useMemo(()=>Object.fromEntries(guardians.map(x=>[String(x.id),x])),[guardians])
 async function load(){
  const [c,t,s,cl,te,p,g]=await Promise.all([
   supabase.from('student_contracts').select('*').order('id',{ascending:false}),
   supabase.from('document_templates').select('*').in('document_type',['contract','scholarship_contract']).eq('is_active',true).order('id'),
   supabase.from('students').select('id,student_number,profile_id,class_id,bus_number,bus_round,profiles!students_profile_id_fkey(full_name,phone)').order('student_number'),
   supabase.from('classes').select('id,name,section').order('id'),
   supabase.from('academic_terms').select('id,name,year_label,is_active').order('id',{ascending:false}),
   supabase.from('class_pricing').select('*').order('id',{ascending:false}),
   supabase.from('profiles').select('id,full_name,phone,role').eq('role','parent').order('full_name')
  ])
  if(c.error)alert(c.error.message); else setContracts(c.data||[])
  if(t.error)alert(t.error.message); else setTemplates(t.data||[])
  if(s.error)alert(s.error.message); else setStudents(s.data||[])
  if(cl.error)alert(cl.error.message); else setClasses(cl.data||[])
  if(te.error)alert(te.error.message); else setTerms(te.data||[])
  if(p.error)alert(p.error.message); else setPricing(p.data||[])
  if(g.error)alert(g.error.message); else setGuardians(g.data||[])
 }
 React.useEffect(()=>{load()},[])
 async function print(c){
  await printStudentContract({contract:c, templates, studentsMap, classesMap, termsMap, pricingMap, guardiansMap})
 }
 return <Layout title="طباعة عقود الطلاب">
  <div className="alert">العقد العادي يستخدم قالبًا مختلفًا عن عقد المنحة. يمكن تعديل القوالب من صفحة قوالب الطباعة.</div>
  <SimpleTable rows={contracts} cols={[
   {key:'contract_no',label:'رقم العقد'},
   {key:'student',label:'الطالب',render:r=>getProfileName(studentsMap[String(r.student_id)])||'-'},
   {key:'type',label:'النوع',render:r=>r.contract_type==='scholarship'?'طالب منحة':'عادي'},
   {key:'net_amount',label:'الصافي'},
   {key:'print_count',label:'عدد الطباعة'}
  ]} actions={r=><button className="btn mini primary" onClick={()=>print(r)}>طباعة العقد</button>}/>
 </Layout>
}

function PrintReportsPage(){
 const [rows,setRows]=React.useState([]),[template,setTemplate]=React.useState(null),[q,setQ]=React.useState('')
 async function load(){
  const [s,t]=await Promise.all([
   supabase.from('student_account_summary').select('*').order('student_name'),
   supabase.from('document_templates').select('*').eq('template_key','student_account_statement').maybeSingle()
  ])
  if(s.error)alert(s.error.message); else setRows(s.data||[])
  if(!t.error)setTemplate(t.data)
 }
 React.useEffect(()=>{load()},[])
 const shown=rows.filter(r=>(r.student_name||'').includes(q)||(r.student_number||'').includes(q))
 async function printStatement(r){
  if(!template)return alert('لا يوجد قالب كشف حساب. شغّل SQL V17.')
  openPrintWindow({template,data:{school_name:'بوابة الطالب المدرسية',print_date:new Date().toLocaleDateString('ar-JO'),...r,total_fees:fmt(r.total_fees),total_payments:fmt(r.total_payments),total_discounts:fmt(r.total_discounts),balance:fmt(r.balance)},title:'كشف حساب'})
  await supabase.rpc('log_document_print',{p_template_key:'student_account_statement',p_document_type:'statement',p_entity_table:'students',p_entity_id:String(r.student_id),p_note:'طباعة كشف حساب'})
 }
 function printDebts(){
  const htmlRows = shown.map(r=>`<tr><td>${r.student_name||''}</td><td>${r.student_number||''}</td><td>${r.class_name||''}</td><td>${fmt(r.total_fees)}</td><td>${fmt(r.total_payments)}</td><td>${fmt(r.balance)}</td></tr>`).join('')
  const win=window.open('','_blank')
  win.document.write(`<html dir="rtl"><head><meta charset="utf-8"><style>body{font-family:Arial;padding:20px}h1{text-align:center}table{width:100%;border-collapse:collapse}td,th{border:1px solid #111;padding:8px}@page{size:A4 landscape;margin:12mm}</style></head><body><h1>تقرير ذمم الطلاب</h1><table><thead><tr><th>الطالب</th><th>الرقم</th><th>الصف</th><th>الرسوم</th><th>المدفوع</th><th>الرصيد</th></tr></thead><tbody>${htmlRows}</tbody></table><script>window.print()</script></body></html>`)
  win.document.close()
 }
 return <Layout title="طباعة التقارير والكشوفات">
  <div className="quick"><button className="btn dark" onClick={printDebts}>طباعة تقرير الذمم كامل</button></div>
  <div className="card search"><input className="input" placeholder="بحث عن طالب..." value={q} onChange={e=>setQ(e.target.value)}/></div>
  <SimpleTable rows={shown} cols={[
   {key:'student_name',label:'الطالب'},
   {key:'student_number',label:'الرقم'},
   {key:'class_name',label:'الصف'},
   {key:'total_fees',label:'الرسوم'},
   {key:'total_payments',label:'المدفوع'},
   {key:'balance',label:'الرصيد'}
  ]} actions={r=><button className="btn mini primary" onClick={()=>printStatement(r)}>طباعة كشف حساب</button>}/>
 </Layout>
}

function App(){
 return <AuthProvider><BrowserRouter><Routes>
  <Route path="/login" element={<Login/>}/>
  <Route path="/" element={<Protected><DashboardRedirect/></Protected>}/>
  <Route path="/dashboard" element={<Protected><DashboardRedirect/></Protected>}/>
  <Route path="/admin" element={<Protected roles={['admin']}><HomeDash type="admin"/></Protected>}/>
  <Route path="/admin/users" element={<Protected roles={['admin']}><UsersPage/></Protected>}/>
  <Route path="/admin/students" element={<Protected roles={['admin']}><StudentsPage/></Protected>}/>
  <Route path="/admin/students/extra-info" element={<Protected roles={['admin']}><StudentExtraInfoPage/></Protected>}/>
  <Route path="/admin/students/archive" element={<Protected roles={['admin']}><ArchivedStudentsPage/></Protected>}/>
  <Route path="/admin/student-profile/:id" element={<Protected roles={['admin']}><StudentProfilePage/></Protected>}/>
  <Route path="/admin/leaving-students" element={<Protected roles={['admin']}><LeavingStudentsPage/></Protected>}/>
  <Route path="/admin/returning-students" element={<Protected roles={['admin']}><ReturningStudentsPage/></Protected>}/>
  <Route path="/admin/student-movements" element={<Protected roles={['admin']}><StudentMovementsPage/></Protected>}/>
  <Route path="/admin/classes" element={<Protected roles={['admin']}><ClassesPage/></Protected>}/>
  <Route path="/admin/subjects" element={<Protected roles={['admin']}><SubjectsPage/></Protected>}/>
  <Route path="/admin/class-pricing" element={<Protected roles={['admin','accountant']}><ClassPricingPage/></Protected>}/>
  <Route path="/admin/contracts" element={<Protected roles={['admin','accountant']}><ContractsPage/></Protected>}/>
  <Route path="/admin/installments" element={<Protected roles={['admin','accountant']}><InstallmentsPage/></Protected>}/>
  <Route path="/admin/accounting/receipts" element={<Protected roles={['admin','accountant']}><ReceiptsPage/></Protected>}/>
  <Route path="/admin/accounting/debts" element={<Protected roles={['admin','accountant']}><DebtsPage/></Protected>}/>
  <Route path="/admin/fiscal-years" element={<Protected roles={['admin','accountant']}><FiscalYearsPage/></Protected>}/>
  <Route path="/admin/scholarships" element={<Protected roles={['admin','accountant']}><ScholarshipsPage/></Protected>}/>
  <Route path="/admin/student-documents" element={<Protected roles={['admin','accountant']}><StudentDocumentsPage/></Protected>}/>
  <Route path="/admin/global-search" element={<Protected roles={['admin','accountant']}><GlobalSearchPage/></Protected>}/>
  <Route path="/admin/annual-promotion" element={<Protected roles={['admin','accountant']}><AnnualPromotionPage/></Protected>}/>
  <Route path="/admin/reports" element={<Protected roles={['admin']}><ReportsPage/></Protected>}/>
  <Route path="/admin/print-templates" element={<Protected roles={['admin']}><PrintTemplatesPage/></Protected>}/>
  <Route path="/admin/print-reports" element={<Protected roles={['admin']}><PrintReportsPage/></Protected>}/>
  <Route path="/admin/print-contracts" element={<Protected roles={['admin','accountant']}><Navigate to="/admin/contracts" replace/></Protected>}/>
  <Route path="/accountant" element={<Protected roles={['accountant']}><HomeDash type="accountant"/></Protected>}/>
  <Route path="/accountant/class-pricing" element={<Protected roles={['accountant']}><ClassPricingPage/></Protected>}/>
  <Route path="/accountant/contracts" element={<Protected roles={['accountant']}><ContractsPage/></Protected>}/>
  <Route path="/accountant/installments" element={<Protected roles={['accountant']}><InstallmentsPage/></Protected>}/>
  <Route path="/accountant/receipts" element={<Protected roles={['accountant']}><ReceiptsPage/></Protected>}/>
  <Route path="/accountant/debts" element={<Protected roles={['accountant']}><DebtsPage/></Protected>}/>
  <Route path="/accountant/fiscal-years" element={<Protected roles={['accountant']}><FiscalYearsPage/></Protected>}/>
  <Route path="/accountant/global-search" element={<Protected roles={['accountant']}><GlobalSearchPage/></Protected>}/>
  <Route path="/accountant/print-reports" element={<Protected roles={['accountant']}><PrintReportsPage/></Protected>}/>
  <Route path="/accountant/print-contracts" element={<Protected roles={['accountant']}><Navigate to="/accountant/contracts" replace/></Protected>}/>
  <Route path="/teacher" element={<Protected roles={['teacher']}><HomeDash type="teacher"/></Protected>}/>
  <Route path="/teacher/grades" element={<Protected roles={['teacher']}><TeacherGrades/></Protected>}/>
  <Route path="/teacher/attendance" element={<Protected roles={['teacher']}><TeacherAttendance/></Protected>}/>
  <Route path="/teacher/assignments" element={<Protected roles={['teacher']}><TeacherAssignments/></Protected>}/>
  <Route path="/student" element={<Protected roles={['student']}><HomeDash type="student"/></Protected>}/>
  <Route path="/student/grades" element={<Protected roles={['student']}><MyGrades/></Protected>}/>
  <Route path="/student/attendance" element={<Protected roles={['student']}><MyAttendance/></Protected>}/>
  <Route path="/parent" element={<Protected roles={['parent']}><HomeDash type="parent"/></Protected>}/>
  <Route path="/parent/children" element={<Protected roles={['parent']}><ParentChildren/></Protected>}/>
  <Route path="*" element={<Protected><DashboardRedirect/></Protected>}/>
 </Routes></BrowserRouter></AuthProvider>
}

createRoot(document.getElementById('root')).render(<App />)
