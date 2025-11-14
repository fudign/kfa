import { useTranslation } from 'react-i18next';
import { JoinProcessSection } from '@/components/sections/membership/JoinProcessSection';
import { RequirementsSection } from '@/components/sections/membership/RequirementsSection';
import { UserPlus, CheckCircle, Shield, Award, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { applicationsAPI, type MembershipApplicationData } from '@/services/api';

function JoinHeroSection() {
  const { t } = useTranslation('join');

  const benefits = [
    {
      icon: CheckCircle,
      titleKey: 'benefits.networking.title',
      descriptionKey: 'benefits.networking.description',
    },
    {
      icon: Shield,
      titleKey: 'benefits.credibility.title',
      descriptionKey: 'benefits.credibility.description',
    },
    {
      icon: Award,
      titleKey: 'benefits.recognition.title',
      descriptionKey: 'benefits.recognition.description',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-16 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex justify-center md:mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500 md:h-20 md:w-20">
              <UserPlus className="h-8 w-8 text-white md:h-10 md:w-10" />
            </div>
          </div>

          <h1 className="mb-4 font-display text-3xl text-white md:mb-6 md:text-4xl lg:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="mb-8 text-base leading-relaxed text-primary-50 md:mb-12 md:text-lg lg:text-xl">
            {t('hero.subtitle')}
          </p>

          {/* Quick Benefits */}
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="rounded-lg bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/20 md:p-6"
                >
                  <Icon className="mx-auto mb-3 h-8 w-8 text-accent-300" />
                  <div className="mb-2 font-semibold text-white">
                    {t(benefit.titleKey)}
                  </div>
                  <div className="text-sm text-primary-100">
                    {t(benefit.descriptionKey)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ApplicationFormSection() {
  const { t } = useTranslation('join');
  const [formData, setFormData] = useState({
    membershipType: 'individual',
    firstName: '',
    lastName: '',
    organizationName: '',
    position: '',
    email: '',
    phone: '',
    experience: '',
    motivation: '',
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const applicationData: MembershipApplicationData = {
        membershipType: formData.membershipType as 'individual' | 'corporate',
        firstName: formData.firstName,
        lastName: formData.lastName,
        organizationName: formData.organizationName || undefined,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        motivation: formData.motivation,
      };

      const response = await applicationsAPI.submit(applicationData);

      if (response.success) {
        setSubmitSuccess(true);
        // Clear form on success
        setFormData({
          membershipType: 'individual',
          firstName: '',
          lastName: '',
          organizationName: '',
          position: '',
          email: '',
          phone: '',
          experience: '',
          motivation: '',
          agreeToTerms: false,
        });
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Application submission error:', error);

      if (error.response?.data?.errors) {
        // Laravel validation errors
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        setSubmitError(firstError[0]);
      } else if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError(t('form.errors.submitFailed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <section id="application-form" className="bg-white px-4 py-12 dark:bg-neutral-900 md:py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center md:mb-12">
            <h2 className="mb-3 font-display text-2xl text-primary-900 dark:text-primary-100 md:mb-4 md:text-3xl lg:text-4xl">
              {t('form.title')}
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400 md:text-lg">
              {t('form.subtitle')}
            </p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="mb-1 font-semibold text-green-800 dark:text-green-300">
                    {t('form.success.title')}
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {t('form.success.message')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-white dark:bg-red-400">
                  !
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-red-800 dark:text-red-300">
                    {t('form.errors.title')}
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {submitError}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Membership Type */}
            <div>
              <label htmlFor="membershipType" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t('form.fields.membershipType.label')}
              </label>
              <select
                id="membershipType"
                name="membershipType"
                value={formData.membershipType}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                required
              >
                <option value="individual">{t('form.fields.membershipType.options.individual')}</option>
                <option value="corporate">{t('form.fields.membershipType.options.corporate')}</option>
                <option value="institutional">{t('form.fields.membershipType.options.institutional')}</option>
              </select>
            </div>

            {/* Personal Information */}
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t('form.fields.firstName.label')}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t('form.fields.lastName.label')}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Organization Info (shown for corporate/institutional) */}
            {(formData.membershipType === 'corporate' || formData.membershipType === 'institutional') && (
              <div>
                <label htmlFor="organizationName" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t('form.fields.organizationName.label')}
                </label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  required
                />
              </div>
            )}

            {/* Position - always shown */}
            <div>
              <label htmlFor="position" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t('form.fields.position.label')}
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t('form.fields.email.label')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t('form.fields.phone.label')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t('form.fields.experience.label')}
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                required
              />
            </div>

            {/* Motivation */}
            <div>
              <label htmlFor="motivation" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t('form.fields.motivation.label')}
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                required
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('form.fields.agreeToTerms.label')}{' '}
                <a href="/terms" className="text-primary-600 hover:underline">
                  {t('form.fields.agreeToTerms.termsLink')}
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 font-semibold text-white shadow-kfa-lg transition-all hover:bg-primary-700 hover:shadow-kfa-xl disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!formData.agreeToTerms || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('form.submitting')}
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    {t('form.submitButton')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export function JoinPage() {
  return (
    <div className="min-h-screen">
      <JoinHeroSection />
      <RequirementsSection />
      <JoinProcessSection scrollToForm={true} />
      <ApplicationFormSection />
    </div>
  );
}
