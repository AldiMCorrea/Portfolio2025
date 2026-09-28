import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const DISCIPLINES = ['straps', 'trapeze', 'hammock'];
const PLANS = ['single', 'monthly', 'docta'];
const HEALTH = ['injuries', 'asthma', 'heart', 'back', 'surgery', 'pregnancy', 'vertigo', 'other'];
const SOURCES = ['instagram', 'friend', 'docta', 'other'];

const EMPTY = {
  name: '',
  age: '',
  level: '',
  disciplines: [],
  plan: '',
  health: [],
  noHealthIssues: false,
  healthDetails: '',
  emergencyName: '',
  emergencyPhone: '',
  source: '',
  consent: false,
};

const toggle = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

// The message always goes out in Spanish, whatever language the visitor uses.
function buildMessage(form, tEs) {
  const opt = (group, key) => tEs(`signup.${group}.options.${key}`);
  const lines = [
    tEs('signup.message.greeting'),
    '',
    `*${tEs('signup.name.label')}:* ${form.name.trim()}`,
    `*${tEs('signup.age.label')}:* ${form.age}`,
    `*${tEs('signup.level.label')}:* ${opt('level', form.level)}`,
  ];

  if (form.disciplines.length) {
    lines.push(`*${tEs('signup.message.disciplines')}:* ${form.disciplines.map((d) => opt('disciplines', d)).join(', ')}`);
  }
  if (form.plan) {
    lines.push(`*${tEs('signup.plan.label')}:* ${opt('plan', form.plan)}`);
  }

  const health = form.noHealthIssues
    ? tEs('signup.health.none')
    : form.health.map((h) => opt('health', h)).join(', ') || tEs('signup.message.notSpecified');
  lines.push(`*${tEs('signup.health.label')}:* ${health}`);
  if (form.healthDetails.trim()) {
    lines.push(`*${tEs('signup.healthDetails.label')}:* ${form.healthDetails.trim()}`);
  }

  const emergency = [form.emergencyName.trim(), form.emergencyPhone.trim()].filter(Boolean).join(' · ');
  if (emergency) {
    lines.push(`*${tEs('signup.emergency.label')}:* ${emergency}`);
  }
  if (form.source) {
    lines.push(`*${tEs('signup.message.source')}:* ${opt('source', form.source)}`);
  }
  return lines.join('\n');
}

function SignupForm({ whatsappUrl }) {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(EMPTY);
  const [healthError, setHealthError] = useState(false);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleIn = (field, value) => () =>
    setForm((f) => ({ ...f, [field]: toggle(f[field], value) }));

  const toggleHealth = (value) => () => {
    setHealthError(false);
    setForm((f) => ({ ...f, health: toggle(f.health, value), noHealthIssues: false }));
  };

  const toggleNoHealthIssues = () => {
    setHealthError(false);
    setForm((f) => ({ ...f, noHealthIssues: !f.noHealthIssues, health: [] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Health has to be answered explicitly: something ticked, or "none".
    if (!form.noHealthIssues && form.health.length === 0) {
      setHealthError(true);
      document.getElementById('signup-health')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const message = buildMessage(form, i18n.getFixedT('es'));
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <form className="ae-form" onSubmit={handleSubmit}>
      <div className="ae-form-row">
        <label className="ae-field">
          <span>{t('signup.name.label')} *</span>
          <input type="text" required autoComplete="name" value={form.name} onChange={set('name')} />
        </label>
        <label className="ae-field ae-field-age">
          <span>{t('signup.age.label')} *</span>
          <input type="number" required min="10" max="99" inputMode="numeric" value={form.age} onChange={set('age')} />
        </label>
      </div>

      <fieldset className="ae-field">
        <legend>{t('signup.level.label')} *</legend>
        <div className="ae-pills">
          {LEVELS.map((key) => (
            <label key={key} className="ae-pill">
              <input type="radio" name="level" required value={key} checked={form.level === key} onChange={set('level')} />
              <span>{t(`signup.level.options.${key}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="ae-field">
        <legend>{t('signup.disciplines.label')}</legend>
        <div className="ae-pills">
          {DISCIPLINES.map((key) => (
            <label key={key} className="ae-pill">
              <input type="checkbox" checked={form.disciplines.includes(key)} onChange={toggleIn('disciplines', key)} />
              <span>{t(`signup.disciplines.options.${key}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="ae-field">
        <legend>{t('signup.plan.label')}</legend>
        <div className="ae-pills">
          {PLANS.map((key) => (
            <label key={key} className="ae-pill">
              <input type="radio" name="plan" value={key} checked={form.plan === key} onChange={set('plan')} />
              <span>{t(`signup.plan.options.${key}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={`ae-field${healthError ? ' has-error' : ''}`} id="signup-health">
        <legend>{t('signup.health.label')} *</legend>
        <p className="ae-field-hint">{t('signup.health.hint')}</p>
        <div className="ae-pills">
          {HEALTH.map((key) => (
            <label key={key} className="ae-pill">
              <input type="checkbox" checked={form.health.includes(key)} onChange={toggleHealth(key)} />
              <span>{t(`signup.health.options.${key}`)}</span>
            </label>
          ))}
          <label className="ae-pill">
            <input type="checkbox" checked={form.noHealthIssues} onChange={toggleNoHealthIssues} />
            <span>{t('signup.health.none')}</span>
          </label>
        </div>
        {healthError && <p className="ae-field-error" role="alert">{t('signup.health.error')}</p>}
      </fieldset>

      <label className="ae-field">
        <span>{t('signup.healthDetails.label')}</span>
        <textarea
          rows="3"
          placeholder={t('signup.healthDetails.placeholder')}
          value={form.healthDetails}
          onChange={set('healthDetails')}
        />
      </label>

      <fieldset className="ae-field">
        <legend>{t('signup.emergency.label')}</legend>
        <div className="ae-form-row">
          <input
            type="text"
            aria-label={t('signup.emergency.namePlaceholder')}
            placeholder={t('signup.emergency.namePlaceholder')}
            value={form.emergencyName}
            onChange={set('emergencyName')}
          />
          <input
            type="tel"
            aria-label={t('signup.emergency.phonePlaceholder')}
            placeholder={t('signup.emergency.phonePlaceholder')}
            value={form.emergencyPhone}
            onChange={set('emergencyPhone')}
          />
        </div>
      </fieldset>

      <label className="ae-field">
        <span>{t('signup.source.label')}</span>
        <select value={form.source} onChange={set('source')}>
          <option value="">—</option>
          {SOURCES.map((key) => (
            <option key={key} value={key}>{t(`signup.source.options.${key}`)}</option>
          ))}
        </select>
      </label>

      <label className="ae-consent">
        <input type="checkbox" required checked={form.consent} onChange={set('consent')} />
        <span>{t('signup.consent')}</span>
      </label>

      <button type="submit" className="ae-btn ae-btn-wpp ae-form-submit">
        <FaWhatsapp aria-hidden="true" />
        {t('signup.submit')}
      </button>
      <p className="ae-form-note">{t('signup.note')}</p>
    </form>
  );
}

export default SignupForm;
