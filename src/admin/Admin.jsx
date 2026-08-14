import { useEffect, useState } from 'react';

const emptyOption = () => ({ title: '', priceCents: '', imageKey: null, image: null, alt: '' });

const emptyClass = () => ({
  id: null,
  title: '',
  description: '',
  schedule: '',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  darkText: false,
  featured: true,
  bookingCta: '',
  imageKey: null,
  image: null,
  imageAlt: '',
  locationName: '',
  locationStreet: '',
  locationCity: '',
  locationRegion: '',
  locationPostal: '',
  booked: false,
  bookedMessage: '',
  options: [emptyOption()]
});

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (res.status === 401) {
    throw new Error('unauthorized');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function uploadImage(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data; // { key, url }
}

function ImagePicker({ label, imageUrl, onChange }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="field">
      <label>{label}</label>
      {imageUrl && <img src={imageUrl} alt="" className="thumb" style={{ marginBottom: '0.4rem' }} />}
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            const { key, url } = await uploadImage(file);
            onChange(key, url);
          } catch (err) {
            window.alert(err.message);
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy && <div className="hint">Uploading…</div>}
    </div>
  );
}

function ClassForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyClass());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateOption(index, field, value) {
    setForm((f) => {
      const options = [...f.options];
      options[index] = { ...options[index], [field]: value };
      return { ...f, options };
    });
  }

  function addOption() {
    setForm((f) => ({ ...f, options: [...f.options, emptyOption()] }));
  }

  function removeOption(index) {
    setForm((f) => ({ ...f, options: f.options.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    const options = form.options
      .filter((o) => o.title.trim())
      .map((o) => ({
        title: o.title.trim(),
        priceCents: Math.round(Number(o.priceCents) * 100),
        imageKey: o.imageKey,
        alt: o.alt
      }));
    if (options.length === 0 || options.some((o) => !Number.isFinite(o.priceCents) || o.priceCents <= 0)) {
      setError('Every option needs a title and a price greater than $0.');
      return;
    }

    setSaving(true);
    try {
      const body = {
        title: form.title.trim(),
        description: form.description,
        schedule: form.schedule,
        gradient: form.gradient,
        darkText: form.darkText,
        featured: form.featured,
        bookingCta: form.bookingCta,
        imageKey: form.imageKey,
        imageAlt: form.imageAlt,
        locationName: form.locationName,
        locationStreet: form.locationStreet,
        locationCity: form.locationCity,
        locationRegion: form.locationRegion,
        locationPostal: form.locationPostal,
        booked: form.booked,
        bookedMessage: form.bookedMessage,
        options
      };

      if (form.id) {
        await api(`/api/admin/classes/${form.id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/api/admin/classes', { method: 'POST', body: JSON.stringify(body) });
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{form.id ? 'Edit Class' : 'Add a New Class'}</h2>

      <div className="field">
        <label>Title</label>
        <input value={form.title} onChange={(e) => update('title', e.target.value)} required />
      </div>

      <div className="field">
        <label>Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
      </div>

      <div className="row">
        <div className="field">
          <label>Schedule (e.g. "Jun 16, 2026 06:00pm - 08:00pm")</label>
          <input value={form.schedule} onChange={(e) => update('schedule', e.target.value)} />
        </div>
        <div className="field">
          <label>Card background (CSS gradient or color)</label>
          <input value={form.gradient} onChange={(e) => update('gradient', e.target.value)} />
        </div>
      </div>

      <div className="row">
        <label className="checkbox-row">
          <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
          Featured (shown as a big card)
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={form.darkText} onChange={(e) => update('darkText', e.target.checked)} />
          Use dark text (for light backgrounds)
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={form.booked} onChange={(e) => update('booked', e.target.checked)} />
          Sold out / booked
        </label>
      </div>

      {form.booked && (
        <div className="field">
          <label>Booked message</label>
          <input value={form.bookedMessage} onChange={(e) => update('bookedMessage', e.target.value)} placeholder="We're booked! Keep tabs for updates on the next class." />
        </div>
      )}

      <div className="field">
        <label>Button text (only used when there is more than one option)</label>
        <input value={form.bookingCta} onChange={(e) => update('bookingCta', e.target.value)} placeholder="Choose Your Option →" />
      </div>

      <ImagePicker
        label="Flyer / project image (optional)"
        imageUrl={form.image}
        onChange={(key, url) => setForm((f) => ({ ...f, imageKey: key, image: url }))}
      />
      {form.imageKey && (
        <div className="field">
          <label>Image alt text</label>
          <input value={form.imageAlt} onChange={(e) => update('imageAlt', e.target.value)} />
        </div>
      )}

      <details style={{ marginBottom: '1rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>Off-site location (optional)</summary>
        <div className="row" style={{ marginTop: '0.75rem' }}>
          <div className="field"><label>Venue name</label><input value={form.locationName} onChange={(e) => update('locationName', e.target.value)} /></div>
          <div className="field"><label>Street address</label><input value={form.locationStreet} onChange={(e) => update('locationStreet', e.target.value)} /></div>
        </div>
        <div className="row">
          <div className="field"><label>City</label><input value={form.locationCity} onChange={(e) => update('locationCity', e.target.value)} /></div>
          <div className="field"><label>State</label><input value={form.locationRegion} onChange={(e) => update('locationRegion', e.target.value)} /></div>
          <div className="field"><label>Zip</label><input value={form.locationPostal} onChange={(e) => update('locationPostal', e.target.value)} /></div>
        </div>
      </details>

      <h3>Options {form.options.length > 1 ? '(customers pick one)' : '(single price)'}</h3>
      {form.options.map((option, i) => (
        <div className="option-row" key={i}>
          <div className="field">
            <label>Title</label>
            <input value={option.title} onChange={(e) => updateOption(i, 'title', e.target.value)} placeholder={form.title || 'e.g. Blue Truck'} />
          </div>
          <div className="field">
            <label>Price (USD)</label>
            <input type="number" min="0" step="0.01" value={option.priceCents} onChange={(e) => updateOption(i, 'priceCents', e.target.value)} placeholder="35" />
          </div>
          <ImagePicker
            label="Option image"
            imageUrl={option.image}
            onChange={(key, url) => {
              updateOption(i, 'imageKey', key);
              updateOption(i, 'image', url);
            }}
          />
          <div className="field">
            <label>Alt text</label>
            <input value={option.alt} onChange={(e) => updateOption(i, 'alt', e.target.value)} />
          </div>
          {form.options.length > 1 && (
            <button type="button" className="btn-plain" onClick={() => removeOption(i)}>Remove</button>
          )}
        </div>
      ))}
      <button type="button" className="btn-secondary" onClick={addOption} style={{ marginBottom: '1rem' }}>
        + Add another option
      </button>

      {error && <div className="error-text">{error}</div>}

      <div className="row" style={{ marginTop: '1rem' }}>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Class'}</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function ClassList({ classes, onEdit, onDelete }) {
  return (
    <div className="card">
      <h2>Classes ({classes.length})</h2>
      {classes.length === 0 && <p>No classes yet. Add your first one below.</p>}
      {classes.map((c) => (
        <div className="class-list-item" key={c.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {c.image && <img src={c.image} alt="" className="thumb" />}
            <div>
              <div style={{ fontWeight: 600 }}>{c.title}</div>
              <div className="hint">{c.schedule || 'No schedule set'} · {c.options.length} option{c.options.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <div className="row" style={{ minWidth: 'auto' }}>
            <button className="btn-secondary" onClick={() => onEdit(c)}>Edit</button>
            <button
              className="btn-danger"
              onClick={() => {
                if (window.confirm(`Delete "${c.title}"? This cannot be undone.`)) onDelete(c.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersList({ orders }) {
  return (
    <div className="card">
      <h2>Orders ({orders.length})</h2>
      {orders.length === 0 && <p>No purchases yet.</p>}
      {orders.map((o) => (
        <div className="class-list-item" key={o.id}>
          <div>
            <div style={{ fontWeight: 600 }}>
              {o.classTitle}{o.optionTitle && o.optionTitle !== o.classTitle ? ` — ${o.optionTitle}` : ''}
              {o.quantity > 1 ? ` × ${o.quantity}` : ''}
            </div>
            <div className="hint">
              {o.customerName || 'Unknown name'} · {o.customerEmail || 'no email'} · {new Date(o.createdAt).toLocaleString()}
            </div>
          </div>
          <div style={{ fontWeight: 700 }}>{o.amount}</div>
        </div>
      ))}
    </div>
  );
}

function Login({ onLoggedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
      onLoggedIn();
    } catch {
      setError('Incorrect password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <h1>Class Editor</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button type="submit" className="btn-primary" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Checking…' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [classes, setClasses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('classes');
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [loadError, setLoadError] = useState('');

  async function loadClasses() {
    try {
      const data = await api('/api/admin/classes');
      setClasses(data);
      setAuthed(true);
      setLoadError('');
    } catch (err) {
      if (err.message === 'unauthorized') {
        setAuthed(false);
      } else {
        setLoadError(err.message);
      }
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    loadClasses();
  }, []);

  async function handleDelete(id) {
    await api(`/api/admin/classes/${id}`, { method: 'DELETE' });
    loadClasses();
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
  }

  async function loadOrders() {
    try {
      const data = await api('/api/admin/orders');
      setOrders(data);
    } catch (err) {
      setLoadError(err.message);
    }
  }

  if (authed === null) return null;
  if (!authed) return <Login onLoggedIn={loadClasses} />;

  return (
    <div className="admin-shell">
      <div className="top-bar">
        <h1>Class Editor</h1>
        <button className="btn-secondary" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="row" style={{ marginBottom: '1.25rem' }}>
        <button
          className={tab === 'classes' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => {
            setTab('classes');
            setEditing(null);
            setAdding(false);
          }}
        >
          Classes
        </button>
        <button
          className={tab === 'orders' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => {
            setTab('orders');
            loadOrders();
          }}
        >
          Orders
        </button>
      </div>

      {loadError && <div className="error-text">{loadError}</div>}

      {tab === 'orders' ? (
        <OrdersList orders={orders} />
      ) : editing || adding ? (
        <ClassForm
          initial={editing}
          onSave={() => {
            setEditing(null);
            setAdding(false);
            loadClasses();
          }}
          onCancel={() => {
            setEditing(null);
            setAdding(false);
          }}
        />
      ) : (
        <>
          <ClassList classes={classes} onEdit={setEditing} onDelete={handleDelete} />
          <button className="btn-primary" onClick={() => setAdding(true)}>+ Add New Class</button>
        </>
      )}
    </div>
  );
}
