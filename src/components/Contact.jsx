import React from 'react';
import './Contact.css';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import { BsTelephoneFill } from 'react-icons/bs';

const Contact = () => {
  const { t } = useTranslation();

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
            <p>(54) 3517892061</p>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <p>Argentina</p>
          </div>
          <div className="contact-item">
            <a href="https://linkedin.com/in/aldanamelanicorrea" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="contact-icon" />
            </a>
          </div>
          <div className="contact-item">
            <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
              <FaGithub className="contact-icon" />
            </a>
          </div>
          <div className="contact-item">
            <a href="https://aldanamcorrea.com" target="_blank" rel="noopener noreferrer">
              <FaGlobe className="contact-icon" />
            </a>
          </div>
        </div>
        <div className="contact-form">
          <h3>{t('contact.formTitle')}</h3>
          <form>
            <div className="form-group">
              <label htmlFor="name">{t('contact.nameLabel')}</label>
              <input type="text" id="name" name="name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('contact.emailLabel')}</label>
              <input type="email" id="email" name="email" />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact.messageLabel')}</label>
              <textarea id="message" name="message"></textarea>
            </div>
            <button type="submit" className="submit-button">{t('contact.sendButton')}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
