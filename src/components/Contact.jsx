import React from 'react';
import './Contact.css';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section id="contact">
      <h2>{t('contact.title')}</h2>
      <div className="contact-content">
        <div className="contact-info">
          <p><strong>Email:</strong> aldanacorrea99@gmail.com</p>
          <p><strong>Phone:</strong> (54) 3517892061</p>
          <p><strong>Location:</strong> Argentina</p>
          <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/aldanamelanicorrea" target="_blank" rel="noopener noreferrer">linkedin.com/in/aldanamelanicorrea</a></p>
          <p><strong>GitHub:</strong> <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">github.com/AldiMCorrea</a></p>
          <p><strong>Website:</strong> <a href="https://aldanamcorrea.com" target="_blank" rel="noopener noreferrer">aldanamcorrea.com</a></p>
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
