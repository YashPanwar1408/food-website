'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfServicePage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold text-foreground mb-4">{t('termsPage.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('termsPage.lastUpdated')}</p>

        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('termsPage.agreement.title')}</h2>
            <p className="text-muted-foreground">{t('termsPage.agreement.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('termsPage.accounts.title')}</h2>
            <p className="text-muted-foreground">{t('termsPage.accounts.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('termsPage.orders.title')}</h2>
            <p className="text-muted-foreground">{t('termsPage.orders.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('termsPage.termination.title')}</h2>
            <p className="text-muted-foreground">{t('termsPage.termination.content')}</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">{t('termsPage.contactUs.title')}</h2>
            <p className="text-muted-foreground">{t('termsPage.contactUs.content')}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;