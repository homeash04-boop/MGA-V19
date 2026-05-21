import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import './index.css'
import { openPrintWindow } from './print/printEngine.js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl || 'https://missing.supabase.co', supabaseAnonKey || 'missing-key')

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
 
  issue_date:'تاريخ الإصدار',
  expiry_date:'تاريخ الانتهاء',

  template_key:'مفتاح القالب',
  document_type:'نوع المستند',
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
  const [state,setState]=React.useState({loading:true,session:null,user:null,profile:null})
  React.useEffect(()=>{
    let mounted=true
    async function load(){
      const {data:{session}}=await supabase.auth.getSession()
      let profile=null
      if(session?.user){
        const {data}=await supabase.from('profiles').select('*').eq('id',session.user.id).maybeSingle()
        profile=data
      }
      if(mounted)setState({loading:false,session,user:session?.user||null,profile})
    }
    load()
    const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>load())
    return()=>{mounted=false;subscription.unsubscribe()}
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
  const {loading,session,profile}=useAuth()
  if(loading)return <Splash text="جاري التحميل..." />
  if(!session)return <Navigate to="/login" replace/>
  if(!profile)return <NoProfile/>
  if(roles && !roles.includes(profile.role))return <Navigate to="/dashboard" replace/>
  return children
}

function Splash({text}){return <div dir="rtl" className="splash">{text}</div>}
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
['الرئيسية','/admin'],['المستخدمون','/admin/users'],['الطلاب','/admin/students'],['معلومات الطلاب','/admin/students/extra-info'],['أرشيف الطلاب','/admin/students/archive'],['مغادرة/عودة','/admin/student-movements'],['الترحيل السنوي','/admin/annual-promotion'],['الصفوف','/admin/classes'],['المواد','/admin/subjects'],['أسعار الصفوف','/admin/class-pricing'],['العقود','/admin/contracts'],['الأقساط','/admin/installments'],['سندات قبض','/admin/accounting/receipts'],['الذمم','/admin/accounting/debts'],['السنوات المالية','/admin/fiscal-years'],['الخصومات','/admin/scholarships'],['الوثائق','/admin/student-documents'],['بحث موحد','/admin/global-search'],['التقارير','/admin/reports'],['قوالب الطباعة','/admin/print-templates'],['طباعة العقود','/admin/print-contracts'],['طباعة التقارير','/admin/print-reports']],
accountant:[['الرئيسية','/accountant'],['أسعار الصفوف','/accountant/class-pricing'],['العقود','/accountant/contracts'],['الأقساط','/accountant/installments'],['سندات قبض','/accountant/receipts'],['الذمم','/accountant/debts'],['السنوات المالية','/accountant/fiscal-years'],['بحث موحد','/accountant/global-search'],['طباعة العقود','/accountant/print-contracts'],['طباعة التقارير','/accountant/print-reports']],
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

function CrudPage({title,table,cols,initial,select='*',order='id',children,afterLoad,renderActions}){
  const [rows,setRows]=React.useState([]),[form,setForm]=React.useState(initial),[loading,setLoading]=React.useState(false)
  async function load(){const {data,error}=await supabase.from(table).select(select).order(order,{ascending:false}); if(error)alert(error.message); else setRows(afterLoad?afterLoad(data||[]):data||[])}
  React.useEffect(()=>{load()},[])
  async function save(e){e.preventDefault();setLoading(true);const {error}=await supabase.from(table).insert(form);setLoading(false);if(error)alert(error.message);else{setForm(initial);load()}}
  return <Layout title={title}>
    {children?.({rows,setRows,form,setForm,load,save,loading})}
    {!children && <form onSubmit={save} className="card form-grid">{Object.keys(initial).map(k=><Field key={k} label={arLabel(k)}><input className="input" {...inputProps(setForm,form,k)}/></Field>)}<button className="btn primary">حفظ</button></form>}
    {rows.length?<SimpleTable cols={cols} rows={rows} actions={renderActions}/>:<Empty/>}
  </Layout>
}

function UsersPage(){
 return <CrudPage title="المستخدمون" table="profiles" select="*" order="created_at" initial={{id:'',full_name:'',role:'student',phone:''}} cols={[{key:'full_name',label:'الاسم'},{key:'role',label:'الدور',render:r=>arValue(r.role)},{key:'phone',label:'الهاتف'}]}>
 {({rows,form,setForm,save})=><>
  <div className="alert">ملاحظة: أنشئ المستخدم أولًا من Supabase Authentication ثم انسخ User ID هنا.</div>
  <form onSubmit={save} className="card form-grid">
   <Field label="معرّف المستخدم"><input className="input" dir="ltr" {...inputProps(setForm,form,'id')} required/></Field>
   <Field label="الاسم"><input className="input" {...inputProps(setForm,form,'full_name')} required/></Field>
   <Field label="الدور"><select className="input" {...inputProps(setForm,form,'role')}><option value="admin">إدارة</option><option value="accountant">محاسب</option><option value="teacher">معلم</option><option value="student">طالب</option><option value="parent">ولي أمر</option></select></Field>
   <Field label="الهاتف"><input className="input" {...inputProps(setForm,form,'phone')}/></Field>
   <button className="btn primary">حفظ</button>
  </form>
 </>}
 </CrudPage>
}

function ClassesPage(){return <CrudPage title="الصفوف" table="classes" initial={{name:'',section:''}} cols={[{key:'name',label:'الصف'},{key:'section',label:'الشعبة'}]}/>}
function SubjectsPage(){return <CrudPage title="المواد" table="subjects" initial={{name:'',code:''}} cols={[{key:'name',label:'المادة'},{key:'code',label:'الكود'}]}/>}
function ReportsPage(){return <Layout title="التقارير"><HomeDash type="admin"/></Layout>}


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
 React.useEffect(()=>{(async()=>{const [s,a,m]=await Promise.all([supabase.from('students').select('*, profiles(full_name,phone), classes(name,section)').eq('id',id).maybeSingle(),supabase.from('student_account_summary').select('*').eq('student_id',id).maybeSingle(),supabase.from('student_movements').select('*').eq('student_id',id).order('movement_date',{ascending:false})]);setSt(s.data);setSum(a.data);setMov(m.data||[])})()},[id])
 if(!st)return <Layout title="ملف الطالب"><Empty title="لم يتم العثور على الطالب"/></Layout>
 return <Layout title={`ملف الطالب - ${st.profiles?.full_name}`}><div className="quick"><button onClick={()=>window.print()} className="btn dark">طباعة</button></div><div className="grid4"><Stat label="الرقم" value={st.student_number||'-'}/><Stat label="الصف" value={`${st.classes?.name||''}`}/><Stat label="الحالة" value={st.status}/><Stat label="الرصيد" value={fmt(sum?.balance)}/></div><div className="card"><h2>بيانات</h2><p>الباص: {st.bus_number||'-'} / الجولة: {st.bus_round||'-'}</p><p>نقطة الصعود: {st.pickup_point||'-'}</p><p>ملاحظات: {st.extra_notes||'-'}</p></div><div className="card"><h2>سجل الحركة</h2>{mov.map(x=><div className="line" key={x.id}>{x.movement_date} - {x.movement_type} - {x.reason||''}</div>)}</div></Layout>
}

function LeavingStudentsPage(){
 const [students,setStudents]=React.useState([]),[form,setForm]=React.useState({student_id:'',movement_type:'left_school',movement_date:new Date().toISOString().slice(0,10),reason:'',note:''})
 React.useEffect(()=>{supabase.from('students').select('id,student_number,profiles(full_name)').in('status',['active','returned','suspended']).then(r=>setStudents(r.data||[]))},[])
 async function save(e){e.preventDefault();const {error}=await supabase.rpc('student_leave_school',{p_student_id:Number(form.student_id),p_movement_type:form.movement_type,p_date:form.movement_date,p_reason:form.reason,p_note:form.note});if(error)alert(error.message);else alert('تم تسجيل المغادرة')}
 return <Layout title="تسجيل مغادرة طالب"><form onSubmit={save} className="card form-grid"><Field label="الطالب"><select className="input" {...inputProps(setForm,form,'student_id')}><option value="">اختر</option>{students.map(s=><option key={s.id} value={s.id}>{s.profiles?.full_name}</option>)}</select></Field><Field label="النوع"><select className="input" {...inputProps(setForm,form,'movement_type')}><option value="left_school">غادر</option><option value="withdrawn">انسحاب</option><option value="transferred_out">انتقال</option><option value="graduated">تخرج</option><option value="suspended">إيقاف</option></select></Field><Field label="التاريخ"><input type="date" className="input" {...inputProps(setForm,form,'movement_date')}/></Field><Field label="السبب"><input className="input" {...inputProps(setForm,form,'reason')}/></Field><button className="btn danger">حفظ</button></form></Layout>
}

function ReturningStudentsPage(){
 const [students,setStudents]=React.useState([]),[classes,setClasses]=React.useState([]),[form,setForm]=React.useState({student_id:'',to_class_id:'',return_date:new Date().toISOString().slice(0,10),new_student_number:'',reason:''})
 React.useEffect(()=>{(async()=>{const [s,c]=await Promise.all([supabase.from('students').select('id,student_number,status,profiles(full_name)').in('status',['left','withdrawn','transferred','graduated','archived','suspended']),supabase.from('classes').select('*').order('id')]);setStudents(s.data||[]);setClasses(c.data||[])})()},[])
 async function save(e){e.preventDefault();const {error}=await supabase.rpc('student_return_to_school',{p_student_id:Number(form.student_id),p_to_class_id:Number(form.to_class_id),p_date:form.return_date,p_new_student_number:form.new_student_number||null,p_reason:form.reason});if(error)alert(error.message);else alert('تمت عودة الطالب')}
 return <Layout title="عودة طالب غادر"><form onSubmit={save} className="card form-grid"><Field label="الطالب القديم"><select className="input" {...inputProps(setForm,form,'student_id')}><option value="">اختر</option>{students.map(s=><option key={s.id} value={s.id}>{s.profiles?.full_name} - {s.student_number} - {s.status}</option>)}</select></Field><Field label="الصف الجديد"><select className="input" {...inputProps(setForm,form,'to_class_id')}><option value="">اختر</option>{classes.map(c=><option key={c.id} value={c.id}>{c.name} {c.section}</option>)}</select></Field><Field label="تاريخ العودة"><input type="date" className="input" {...inputProps(setForm,form,'return_date')}/></Field><Field label="رقم جديد اختياري"><input className="input" {...inputProps(setForm,form,'new_student_number')}/></Field><Field label="سبب العودة"><input className="input" {...inputProps(setForm,form,'reason')}/></Field><button className="btn good">إرجاع الطالب</button></form></Layout>
}

function StudentMovementsPage(){return <CrudPage title="سجل حركة الطلاب" table="student_movements" select="*, students(student_number, profiles(full_name))" order="id" initial={{}} cols={[{key:'student',label:'الطالب',render:r=>r.students?.profiles?.full_name},{key:'movement_type',label:'الحركة'},{key:'movement_date',label:'التاريخ'},{key:'reason',label:'السبب'}]} />}

function ClassPricingPage(){
 const [classes,setClasses]=React.useState([]),[terms,setTerms]=React.useState([]),[rows,setRows]=React.useState([]),[form,setForm]=React.useState({class_id:'',academic_term_id:'',registration_fee:0,tuition_fee:0,bus_fee:0,books_fee:0,uniform_fee:0,activities_fee:0,default_discount_amount:0,default_discount_percent:0,notes:'',contract_type:'regular',scholarship_title:'',scholarship_percent:0,scholarship_amount:0})
 async function load(){const [c,t,p]=await Promise.all([supabase.from('classes').select('*').order('id'),supabase.from('academic_terms').select('*'),supabase.from('class_pricing').select('*,classes(name,section),academic_terms(name,year_label)').order('id',{ascending:false})]);setClasses(c.data||[]);setTerms(t.data||[]);setRows(p.data||[])}
 React.useEffect(()=>{load()},[])
 async function save(e){e.preventDefault();const payload={...form,class_id:Number(form.class_id),academic_term_id:form.academic_term_id?Number(form.academic_term_id):null,updated_at:new Date().toISOString()};const {error}=await supabase.from('class_pricing').upsert(payload,{onConflict:'class_id,academic_term_id'});if(error)alert(error.message);else{alert('تم الحفظ، العقود القديمة لا تتأثر');load()}}
 return <Layout title="أسعار الأقساط لكل صف"><div className="alert">هذه الأسعار قالب فقط. العقد يحفظ Snapshot مستقل ولا يتأثر لاحقًا.</div><form onSubmit={save} className="card form-grid"><Field label="الصف"><select className="input" {...inputProps(setForm,form,'class_id')}><option value="">اختر</option>{classes.map(c=><option key={c.id} value={c.id}>{c.name} {c.section}</option>)}</select></Field><Field label="الفصل"><select className="input" {...inputProps(setForm,form,'academic_term_id')}><option value="">عام</option>{terms.map(t=><option key={t.id} value={t.id}>{t.name} {t.year_label}</option>)}</select></Field>{['registration_fee','tuition_fee','bus_fee','books_fee','uniform_fee','activities_fee','default_discount_amount','default_discount_percent'].map(k=><Field key={k} label={arLabel(k)}><input type="number" className="input" {...inputProps(setForm,form,k)}/></Field>)}<button className="btn primary">حفظ</button></form><SimpleTable rows={rows} cols={[{key:'class',label:'الصف',render:r=>`${r.classes?.name||''} ${r.classes?.section||''}`},{key:'tuition_fee',label:'دراسية'},{key:'bus_fee',label:'باص'},{key:'books_fee',label:'كتب'},{key:'activities_fee',label:'أنشطة'}]} actions={r=><button className="btn mini" onClick={()=>setForm({...r,academic_term_id:r.academic_term_id||''})}>تعديل</button>}/></Layout>
}

function ContractsPage(){
 const [students,setStudents]=React.useState([]),[terms,setTerms]=React.useState([]),[rows,setRows]=React.useState([]),[form,setForm]=React.useState({contract_no:`CT-${Date.now()}`,student_id:'',academic_term_id:'',registration_fee_snapshot:0,tuition_fee_snapshot:0,bus_fee_snapshot:0,books_fee_snapshot:0,uniform_fee_snapshot:0,activities_fee_snapshot:0,discount_amount:0,discount_percent_snapshot:0,notes:''})
 async function load(){const [s,t,c]=await Promise.all([supabase.from('students').select('id,class_id,student_number,profiles(full_name)').neq('status','archived'),supabase.from('academic_terms').select('*'),supabase.from('student_contracts').select('*,students(student_number,profiles(full_name))').order('id',{ascending:false})]);setStudents(s.data||[]);setTerms(t.data||[]);setRows(c.data||[])}
 React.useEffect(()=>{load()},[])
 const total=['registration_fee_snapshot','tuition_fee_snapshot','bus_fee_snapshot','books_fee_snapshot','uniform_fee_snapshot','activities_fee_snapshot'].reduce((a,k)=>a+Number(form[k]||0),0); const discount=Number(form.discount_amount||0)+(total*Number(form.discount_percent_snapshot||0)/100); const net=Math.max(total-discount,0)
 async function pickStudent(v){const st=students.find(s=>String(s.id)===String(v));let next={...form,student_id:v}; if(st){const {data}=await supabase.rpc('get_class_pricing_snapshot',{p_class_id:st.class_id,p_academic_term_id:form.academic_term_id?Number(form.academic_term_id):null}); if(data){next={...next,class_pricing_id:data.class_pricing_id,registration_fee_snapshot:data.registration_fee,tuition_fee_snapshot:data.tuition_fee,bus_fee_snapshot:data.bus_fee,books_fee_snapshot:data.books_fee,uniform_fee_snapshot:data.uniform_fee,activities_fee_snapshot:data.activities_fee,discount_amount:data.default_discount_amount,discount_percent_snapshot:data.default_discount_percent}}} setForm(next)}
 async function save(e){e.preventDefault();const payload={...form,student_id:Number(form.student_id),academic_term_id:form.academic_term_id?Number(form.academic_term_id):null,total_amount:total,discount_amount:discount,pricing_snapshot:{...form,total,net},contract_type:form.contract_type,scholarship_title:form.scholarship_title||null,scholarship_percent:Number(form.scholarship_percent||0),scholarship_amount:Number(form.scholarship_amount||0)};const {error}=await supabase.from('student_contracts').insert(payload); if(error)alert(error.message); else{await supabase.from('student_fees').insert([{student_id:Number(form.student_id),title:`رسوم عقد ${form.contract_no}`,amount:total,note:'من عقد'}]); if(discount>0)await supabase.from('student_discounts').insert({student_id:Number(form.student_id),title:`خصم عقد ${form.contract_no}`,amount:discount}); alert('تم إنشاء العقد');load()}}
 return <Layout title="عقود التسجيل"><form onSubmit={save} className="card form-grid"><Field label="رقم العقد"><input className="input" {...inputProps(setForm,form,'contract_no')}/></Field><Field label="الطالب"><select className="input" value={form.student_id} onChange={e=>pickStudent(e.target.value)}><option value="">اختر</option>{students.map(s=><option key={s.id} value={s.id}>{s.profiles?.full_name} - {s.student_number}</option>)}</select></Field><Field label="الفصل"><select className="input" {...inputProps(setForm,form,'academic_term_id')}><option value="">اختر</option>{terms.map(t=><option key={t.id} value={t.id}>{t.name} {t.year_label}</option>)}</select></Field><Field label="نوع العقد"><select className="input" {...inputProps(setForm,form,'contract_type')}><option value="regular">عقد عادي</option><option value="scholarship">طالب منحة</option><option value="returning">طالب عائد</option><option value="transfer">نقل</option><option value="custom">مخصص</option></select></Field><div className="stat"><span>الصافي</span><b>{fmt(net)}</b></div><Field label="اسم المنحة"><input className="input" {...inputProps(setForm,form,'scholarship_title')}/></Field><Field label="نسبة المنحة"><input type="number" className="input" {...inputProps(setForm,form,'scholarship_percent')}/></Field><Field label="مبلغ المنحة"><input type="number" className="input" {...inputProps(setForm,form,'scholarship_amount')}/></Field>{['registration_fee_snapshot','tuition_fee_snapshot','bus_fee_snapshot','books_fee_snapshot','uniform_fee_snapshot','activities_fee_snapshot','discount_amount','discount_percent_snapshot'].map(k=><Field key={k} label={arLabel(k)}><input type="number" className="input" {...inputProps(setForm,form,k)}/></Field>)}<button className="btn primary">حفظ العقد</button></form><SimpleTable rows={rows} cols={[{key:'contract_no',label:'العقد'},{key:'student',label:'الطالب',render:r=>r.students?.profiles?.full_name},{key:'total_amount',label:'الإجمالي'},{key:'discount_amount',label:'الخصم'},{key:'net_amount',label:'الصافي'}]} actions={r=><button className="btn mini" onClick={()=>window.print()}>طباعة</button>}/></Layout>
}

function ReceiptsPage(){
 const [students,setStudents]=React.useState([]),[methods,setMethods]=React.useState([]),[rows,setRows]=React.useState([]),[form,setForm]=React.useState({student_id:'',amount:'',payment_method_id:'',reference_no:'',note:''})
 async function load(){const [s,m,p]=await Promise.all([supabase.from('students').select('id,student_number,profiles(full_name)').neq('status','archived'),supabase.from('accounting_payment_methods').select('*'),supabase.from('student_payments').select('*,students(student_number,profiles(full_name)),accounting_payment_methods(name)').order('id',{ascending:false})]);setStudents(s.data||[]);setMethods(m.data||[]);setRows(p.data||[])}
 React.useEffect(()=>{load()},[])
 async function save(e){e.preventDefault();const {error}=await supabase.rpc('create_student_receipt',{p_student_id:Number(form.student_id),p_amount:Number(form.amount),p_payment_method_id:form.payment_method_id?Number(form.payment_method_id):null,p_reference_no:form.reference_no||null,p_note:form.note||null,p_contract_id:null});if(error)alert(error.message);else{alert('تم السند');load()}}
 async function cancel(r){const reason=prompt('سبب الإلغاء'); if(!reason)return; const {error}=await supabase.rpc('cancel_student_receipt',{p_payment_id:r.id,p_reason:reason}); if(error)alert(error.message); else load()}
 return <Layout title="سندات القبض"><form onSubmit={save} className="card form-grid"><Field label="الطالب"><select className="input" {...inputProps(setForm,form,'student_id')}><option value="">اختر</option>{students.map(s=><option key={s.id} value={s.id}>{s.profiles?.full_name}</option>)}</select></Field><Field label="المبلغ"><input type="number" className="input" {...inputProps(setForm,form,'amount')}/></Field><Field label="طريقة الدفع"><select className="input" {...inputProps(setForm,form,'payment_method_id')}><option value="">اختر</option>{methods.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></Field><Field label="مرجع"><input className="input" {...inputProps(setForm,form,'reference_no')}/></Field><button className="btn primary">حفظ سند</button></form><SimpleTable rows={rows} cols={[{key:'receipt_no',label:'السند'},{key:'student',label:'الطالب',render:r=>r.students?.profiles?.full_name},{key:'amount',label:'المبلغ'},{key:'status',label:'الحالة',render:r=>arValue(r.status)}]} actions={r=><><button className="btn mini" onClick={()=>window.print()}>طباعة</button>{r.status==='posted'&&<button className="btn mini danger" onClick={()=>cancel(r)}>إلغاء</button>}</>}/></Layout>
}

function DebtsPage(){
 const [rows,setRows]=React.useState([])
 React.useEffect(()=>{supabase.from('student_account_summary').select('*').order('student_name').then(r=>setRows(r.data||[]))},[])
 return <Layout title="ذمم الطلاب"><SimpleTable rows={rows} cols={[{key:'student_name',label:'الطالب'},{key:'student_number',label:'رقم'},{key:'class_name',label:'الصف'},{key:'total_fees',label:'رسوم'},{key:'total_payments',label:'مدفوع'},{key:'balance',label:'متبقي'}]}/></Layout>
}

function InstallmentsPage(){
 const [students,setStudents]=React.useState([]),[contracts,setContracts]=React.useState([]),[rows,setRows]=React.useState([]),[form,setForm]=React.useState({student_id:'',contract_id:'',title:'خطة أقساط',total_amount:'',installments_count:4,start_date:new Date().toISOString().slice(0,10)})
 async function load(){const [s,c,i]=await Promise.all([supabase.from('students').select('id,student_number,profiles(full_name)').neq('status','archived'),supabase.from('student_contracts').select('id,contract_no,student_id,net_amount'),supabase.from('installments_with_fiscal_years').select('*').order('due_date')]);setStudents(s.data||[]);setContracts(c.data||[]);setRows(i.data||[])}
 React.useEffect(()=>{load()},[])
 function pickContract(v){const c=contracts.find(x=>String(x.id)===String(v));setForm({...form,contract_id:v,student_id:c?.student_id||form.student_id,total_amount:c?.net_amount||form.total_amount})}
 async function save(e){e.preventDefault();const {error}=await supabase.rpc('create_installment_plan',{p_student_id:Number(form.student_id),p_contract_id:form.contract_id?Number(form.contract_id):null,p_title:form.title,p_total_amount:Number(form.total_amount),p_installments_count:Number(form.installments_count),p_start_date:form.start_date});if(error)alert(error.message);else{alert('تمت خطة الأقساط');load()}}
 async function pay(r){const {error}=await supabase.rpc('pay_student_installment',{p_installment_id:r.id,p_payment_method_id:null,p_reference_no:null,p_note:'دفع قسط'}); if(error)alert(error.message); else load()}
 return <Layout title="الأقساط"><div className="alert">يمكن دفع الأقساط القديمة حتى بعد الإغلاق المرن للسنة.</div><form onSubmit={save} className="card form-grid"><Field label="عقد"><select className="input" value={form.contract_id} onChange={e=>pickContract(e.target.value)}><option value="">اختياري</option>{contracts.map(c=><option key={c.id} value={c.id}>{c.contract_no} - {c.net_amount}</option>)}</select></Field><Field label="الطالب"><select className="input" {...inputProps(setForm,form,'student_id')}><option value="">اختر</option>{students.map(s=><option key={s.id} value={s.id}>{s.profiles?.full_name}</option>)}</select></Field><Field label="المبلغ"><input type="number" className="input" {...inputProps(setForm,form,'total_amount')}/></Field><Field label="عدد الأقساط"><input type="number" className="input" {...inputProps(setForm,form,'installments_count')}/></Field><Field label="تاريخ البداية"><input type="date" className="input" {...inputProps(setForm,form,'start_date')}/></Field><button className="btn primary">إنشاء</button></form><SimpleTable rows={rows} cols={[{key:'student_name',label:'الطالب'},{key:'due_date',label:'الاستحقاق'},{key:'original_fiscal_year_name',label:'سنة القسط'},{key:'paid_fiscal_year_name',label:'سنة الدفع'},{key:'amount',label:'المبلغ'},{key:'status',label:'الحالة',render:r=>arValue(r.status)}]} actions={r=>r.status!=='paid'&&<button className="btn mini good" onClick={()=>pay(r)}>دفع</button>}/></Layout>
}

function FiscalYearsPage(){
 const [rows,setRows]=React.useState([]),[form,setForm]=React.useState({name:'',starts_on:'',ends_on:''})
 async function load(){const {data}=await supabase.from('accounting_fiscal_years').select('*').order('starts_on',{ascending:false});setRows(data||[])}
 React.useEffect(()=>{load()},[])
 async function save(e){e.preventDefault();const {error}=await supabase.from('accounting_fiscal_years').insert({...form,is_closed:false,close_mode:'open'});if(error)alert(error.message);else{setForm({name:'',starts_on:'',ends_on:''});load()}}
 async function close(id){const {error}=await supabase.rpc('soft_close_fiscal_year',{p_fiscal_year_id:id,p_note:'إغلاق مرن'}); if(error)alert(error.message); else load()}
 async function reopen(id){const {error}=await supabase.rpc('reopen_fiscal_year',{p_fiscal_year_id:id,p_note:'إعادة فتح'}); if(error)alert(error.message); else load()}
 return <Layout title="السنوات المالية - إغلاق مرن"><div className="alert">الإغلاق المرن لا يمنع تحصيل الأقساط القديمة.</div><form onSubmit={save} className="card form-grid"><Field label="الاسم"><input className="input" {...inputProps(setForm,form,'name')}/></Field><Field label="من"><input type="date" className="input" {...inputProps(setForm,form,'starts_on')}/></Field><Field label="إلى"><input type="date" className="input" {...inputProps(setForm,form,'ends_on')}/></Field><button className="btn primary">إضافة</button></form><SimpleTable rows={rows} cols={[{key:'name',label:'السنة'},{key:'starts_on',label:'من'},{key:'ends_on',label:'إلى'},{key:'close_mode',label:'الحالة',render:r=>arValue(r.close_mode)}]} actions={r=>r.close_mode==='open'?<button className="btn mini dark" onClick={()=>close(r.id)}>إغلاق مرن</button>:<button className="btn mini" onClick={()=>reopen(r.id)}>إعادة فتح</button>}/></Layout>
}

function ScholarshipsPage(){return <CrudPage title="الخصومات والمنح" table="student_scholarships" select="*,students(student_number,profiles(full_name))" initial={{student_id:'',scholarship_type:'fixed',title:'خصم',amount:0,percent:0,note:''}} cols={[{key:'student',label:'الطالب',render:r=>r.students?.profiles?.full_name},{key:'title',label:'العنوان'},{key:'scholarship_type',label:'النوع',render:r=>arValue(r.scholarship_type)},{key:'amount',label:'المبلغ'},{key:'status',label:'الحالة',render:r=>arValue(r.status)}]} />}
function StudentDocumentsPage(){return <CrudPage title="وثائق الطلاب" table="student_documents" select="*,students(student_number,profiles(full_name))" initial={{student_id:'',document_type:'birth_certificate',title:'',file_url:'',note:''}} cols={[{key:'student',label:'الطالب',render:r=>r.students?.profiles?.full_name},{key:'document_type',label:'النوع'},{key:'title',label:'العنوان'},{key:'file_url',label:'الرابط'}]} />}
function GlobalSearchPage(){
 const [q,setQ]=React.useState(''),[rows,setRows]=React.useState([])
 async function search(e){e.preventDefault();const {data,error}=await supabase.from('global_search_view').select('*').or(`title.ilike.%${q}%,subtitle.ilike.%${q}%`).limit(60);if(error)alert(error.message);else setRows(data||[])}
 return <Layout title="بحث موحد"><form onSubmit={search} className="card search"><input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="طالب، رقم، هاتف، باص، سند، عقد..."/><button className="btn primary">بحث</button></form><div className="cards">{rows.map((r,i)=><Link key={i} className="card result" to={r.link}><b>{r.title}</b><span>{r.entity_type}</span><p>{r.subtitle}</p></Link>)}</div></Layout>
}

function AnnualPromotionPage(){
 return <Layout title="الترحيل السنوي"><div className="card"><h2>الترحيل السنوي</h2><p>هذه الصفحة الأساسية جاهزة. اضبط تسلسل الصفوف من جدول class_progressions في Supabase أو أضف واجهة تفصيلية لاحقًا. آلية النظام مبنية على student_movements و student_enrollment_periods.</p></div></Layout>
}

function TeacherGrades(){return <CrudPage title="إدخال الدرجات" table="grades" initial={{student_id:'',subject_id:'',title:'اختبار',score:0,max_score:100}} cols={[{key:'student_id',label:'طالب'},{key:'subject_id',label:'مادة'},{key:'title',label:'التقييم'},{key:'score',label:'الدرجة'}]}/>}
function TeacherAttendance(){return <CrudPage title="الحضور" table="attendance" initial={{student_id:'',class_id:'',date:new Date().toISOString().slice(0,10),status:'present',note:''}} cols={[{key:'student_id',label:'طالب'},{key:'date',label:'تاريخ'},{key:'status',label:'الحالة',render:r=>arValue(r.status)}]}/>}
function TeacherAssignments(){return <CrudPage title="الواجبات" table="assignments" initial={{class_id:'',subject_id:'',title:'',description:'',due_date:''}} cols={[{key:'title',label:'العنوان'},{key:'due_date',label:'الموعد'}]}/>}
function MyGrades(){return <CrudPage title="درجاتي" table="grades" initial={{}} cols={[{key:'title',label:'التقييم'},{key:'score',label:'الدرجة'},{key:'max_score',label:'من'}]}/>}
function MyAttendance(){return <CrudPage title="حضوري" table="attendance" initial={{}} cols={[{key:'date',label:'التاريخ'},{key:'status',label:'الحالة',render:r=>arValue(r.status)}]}/>}
function ParentChildren(){return <CrudPage title="أبنائي" table="parent_students" select="*,students(student_number,profiles(full_name),classes(name,section))" initial={{}} cols={[{key:'student',label:'الطالب',render:r=>r.students?.profiles?.full_name},{key:'number',label:'الرقم',render:r=>r.students?.student_number},{key:'class',label:'الصف',render:r=>r.students?.classes?.name}]}/>}


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

function PrintContractsPage(){
 const [contracts,setContracts]=React.useState([]),[templates,setTemplates]=React.useState([])
 async function load(){
  const [c,t]=await Promise.all([
   supabase.from('student_contracts').select('*,students(student_number,bus_number,bus_round,profiles(full_name),classes(name,section))').order('id',{ascending:false}),
   supabase.from('document_templates').select('*').in('document_type',['contract','scholarship_contract']).eq('is_active',true).order('id')
  ])
  if(c.error)alert(c.error.message); else setContracts(c.data||[])
  if(t.error)alert(t.error.message); else setTemplates(t.data||[])
 }
 React.useEffect(()=>{load()},[])
 async function print(c){
  const key = c.contract_type === 'scholarship' ? 'student_contract_scholarship' : 'student_contract_regular'
  let template = templates.find(t=>t.template_key===key) || templates[0]
  if(!template) return alert('لا يوجد قالب طباعة. شغّل SQL V17 أولًا.')
  const {data:summary}=await supabase.from('student_account_summary').select('*').eq('student_id',c.student_id).maybeSingle()
  openPrintWindow({template,data:contractData(c,summary),title:c.contract_no})
  await supabase.rpc('log_document_print',{p_template_key:template.template_key,p_document_type:template.document_type,p_entity_table:'student_contracts',p_entity_id:String(c.id),p_note:'طباعة عقد'})
 }
 return <Layout title="طباعة عقود الطلاب">
  <div className="alert">العقد العادي يستخدم قالبًا مختلفًا عن عقد المنحة. يمكن تعديل القوالب من صفحة قوالب الطباعة.</div>
  <SimpleTable rows={contracts} cols={[
   {key:'contract_no',label:'رقم العقد'},
   {key:'student',label:'الطالب',render:r=>r.students?.profiles?.full_name},
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
  <Route path="/accountant" element={<Protected roles={['accountant']}><HomeDash type="accountant"/></Protected>}/>
  <Route path="/accountant/class-pricing" element={<Protected roles={['accountant']}><ClassPricingPage/></Protected>}/>
  <Route path="/accountant/contracts" element={<Protected roles={['accountant']}><ContractsPage/></Protected>}/>
  <Route path="/accountant/installments" element={<Protected roles={['accountant']}><InstallmentsPage/></Protected>}/>
  <Route path="/accountant/receipts" element={<Protected roles={['accountant']}><ReceiptsPage/></Protected>}/>
  <Route path="/accountant/debts" element={<Protected roles={['accountant']}><DebtsPage/></Protected>}/>
  <Route path="/accountant/fiscal-years" element={<Protected roles={['accountant']}><FiscalYearsPage/></Protected>}/>
  <Route path="/accountant/global-search" element={<Protected roles={['accountant']}><GlobalSearchPage/></Protected>}/>
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
