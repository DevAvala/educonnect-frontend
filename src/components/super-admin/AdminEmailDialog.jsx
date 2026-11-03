import { useState } from 'react';
import { adminEmailDraft } from '../../lib/admin-email';
import { Modal } from './AdminUI';

export default function AdminEmailDialog({ admin, onClose }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [review, setReview] = useState(false);
  const draft = adminEmailDraft(admin.email, subject, message);
  return <Modal title="Compose admin email" onClose={onClose} onSubmit={event => { event.preventDefault(); if (draft) setReview(true); }}>
    <p>To <strong>{admin.fullName || `${admin.firstName} ${admin.lastName}`}</strong><br />{admin.email}</p>
    <label>Subject<input required maxLength={160} value={subject} readOnly={review} onChange={e => setSubject(e.target.value)} /></label>
    <label>Message<textarea required maxLength={4000} rows={7} value={message} readOnly={review} onChange={e => setMessage(e.target.value)} /></label>
    <p className="admin-notice">This opens a draft in your email app. Review and send it there. Sending and delivery are handled by your email app.</p>
    {review ? <div className="admin-row"><button type="button" className="secondary" onClick={() => setReview(false)}>Edit draft</button><a className="admin-button" href={draft}>Open email app</a></div> : <button disabled={!draft}>Review draft</button>}
  </Modal>;
}
