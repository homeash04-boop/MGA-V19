import React from 'react'
import { supabase } from '../../main.jsx'

const emptyTemplate = {
  template_key: '',
  title: '',
  document_type: 'contract',
  paper_size: 'A4',
  orientation: 'portrait',
  header_html: '',
  body_html: '',
  footer_html: '',
  css: ''
}

export default function PrintTemplatesPage({ Layout }) {
  const [items, setItems] = React.useState([])
  const [form, setForm] = React.useState(emptyTemplate)

  async function load() {
    const { data, error } = await supabase.from('document_templates').select('*').order('id')
    if (error) alert(error.message)
    else setItems(data || [])
  }

  React.useEffect(() => { load() }, [])

  function edit(t) {
    setForm({
      template_key: t.template_key || '',
      title: t.title || '',
      document_type: t.document_type || 'contract',
      paper_size: t.paper_size || 'A4',
      orientation: t.orientation || 'portrait',
      header_html: t.header_html || '',
      body_html: t.body_html || '',
      footer_html: t.footer_html || '',
      css: t.css || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function save(e) {
    e.preventDefault()
    if (!form.template_key || !form.title) return alert('أدخل مفتاح القالب والعنوان')
    const { error } = await supabase
      .from('document_templates')
      .upsert({ ...form, updated_at: new Date().toISOString() }, { onConflict: 'template_key' })

    if (error) alert(error.message)
    else {
      alert('تم حفظ القالب')
      setForm(emptyTemplate)
      load()
    }
  }

  return (
    <Layout title="قوالب الطباعة والعقود">
      <div className="alert">
        استخدم المتغيرات داخل القالب مثل: {'{{student_name}}'} ، {'{{contract_no}}'} ، {'{{net_amount}}'} ، {'{{print_date}}'}.
      </div>

      <form onSubmit={save} className="card form-grid">
        <label className="field"><span>مفتاح القالب</span><input className="input" value={form.template_key} onChange={e=>setForm({...form, template_key:e.target.value})} placeholder="student_contract_regular" /></label>
        <label className="field"><span>عنوان القالب</span><input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /></label>
        <label className="field"><span>نوع المستند</span><select className="input" value={form.document_type} onChange={e=>setForm({...form, document_type:e.target.value})}><option value="contract">عقد</option><option value="scholarship_contract">عقد منحة</option><option value="receipt">سند</option><option value="report">تقرير</option><option value="statement">كشف حساب</option><option value="custom">مخصص</option></select></label>
        <label className="field"><span>الاتجاه</span><select className="input" value={form.orientation} onChange={e=>setForm({...form, orientation:e.target.value})}><option value="portrait">عمودي</option><option value="landscape">أفقي</option></select></label>

        <label className="field" style={{gridColumn:'1/-1'}}><span>Header HTML</span><textarea className="input" rows="4" value={form.header_html} onChange={e=>setForm({...form, header_html:e.target.value})} /></label>
        <label className="field" style={{gridColumn:'1/-1'}}><span>Body HTML</span><textarea className="input" rows="10" value={form.body_html} onChange={e=>setForm({...form, body_html:e.target.value})} /></label>
        <label className="field" style={{gridColumn:'1/-1'}}><span>Footer HTML</span><textarea className="input" rows="3" value={form.footer_html} onChange={e=>setForm({...form, footer_html:e.target.value})} /></label>
        <label className="field" style={{gridColumn:'1/-1'}}><span>CSS</span><textarea className="input" rows="7" dir="ltr" value={form.css} onChange={e=>setForm({...form, css:e.target.value})} /></label>

        <button className="btn primary">حفظ القالب</button>
        <button type="button" className="btn dark" onClick={()=>setForm(emptyTemplate)}>تفريغ</button>
      </form>

      <div className="table-wrap">
        <table>
          <thead><tr><th>المفتاح</th><th>العنوان</th><th>النوع</th><th>إجراء</th></tr></thead>
          <tbody>
            {items.map(t=>(
              <tr key={t.id}>
                <td>{t.template_key}</td>
                <td>{t.title}</td>
                <td>{t.document_type}</td>
                <td><button className="btn mini" onClick={()=>edit(t)}>تعديل</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
