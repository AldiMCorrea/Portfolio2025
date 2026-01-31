import React, { useState } from 'react';
import './Contact.css';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import { BsTelephoneFill } from 'react-icons/bs';

const WEB3FORMS_KEY = '5b7fdae3-2e93-49e8-8451-55ee0d3d3c0a';

const Contact = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Contact from ${name}`,
          from_name: name,
          email: email,
          message: message,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus('sent');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact">
      <h2>{t('contact.title')}</h2>
      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <p>aldanacorrea99@gmail.com</p>
          </div>
          <div className="contact-item">
            <BsTelephoneFill className="contact-icon" />
            <p>(+549) 3517892061</p>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <p>Córdoba, Argentina.</p>
          </div>
          <div className="contact-item">
            <a href="https://linkedin.com/in/aldanamelanicorrea" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="contact-icon" />
            </a>
            <a href="https://linkedin.com/in/aldanamelanicorrea" target="_blank" rel="noopener noreferrer">linkedin.com/in/aldanamelanicorrea</a>
          </div>
          <div className="contact-item">
            <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
              <FaGithub className="contact-icon" />
            </a>
            <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">github.com/AldiMCorrea</a>
          </div>
          <div className="contact-item">
            <a href="https://www.aldicorrea.com" target="_blank" rel="noopener noreferrer">
              <FaGlobe className="contact-icon" />
            </a>
            <a href="https://www.aldicorrea.com" target="_blank" rel="noopener noreferrer">www.aldicorrea.com</a>
          </div>
        </div>
        <div className="contact-form">
          <h3>{t('contact.formTitle')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('contact.nameLabel')}</label>
              <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('contact.emailLabel')}</label>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact.messageLabel')}</label>
              <textarea id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
            </div>
            <button type="submit" className="submit-button" disabled={status === 'sending'}>
              {status === 'sending' ? t('contact.sendingButton') : t('contact.sendButton')}
            </button>
            {status === 'sent' && <p className="success-message">{t('contact.sentMessage')}</p>}
            {status === 'error' && <p className="error-message">{t('contact.errorMessage')}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
