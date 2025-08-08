'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SupportPage = () => {
  const { t } = useTranslation();

  const faqs = [
    { q: 'supportPage.faqs.q1', a: 'supportPage.faqs.a1' },
    { q: 'supportPage.faqs.q2', a: 'supportPage.faqs.a2' },
    { q: 'supportPage.faqs.q3', a: 'supportPage.faqs.a3' },
    { q: 'supportPage.faqs.q4', a: 'supportPage.faqs.a4' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold text-foreground mb-4">{t('supportPage.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('supportPage.subtitle')}</p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border pb-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">{t(faq.q)}</h3>
              <p className="text-muted-foreground">{t(faq.a)}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-card border border-border p-6 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-3">{t('supportPage.stillNeedHelp.title')}</h2>
            <p className="text-muted-foreground">{t('supportPage.stillNeedHelp.content')}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;