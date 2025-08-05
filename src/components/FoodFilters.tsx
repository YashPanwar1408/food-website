"use client";
import "../i18n";
import React from "react";
import { useTranslation } from "react-i18next";

interface FoodFiltersProps {
  isVegetarian: boolean | undefined;
  setIsVegetarian: (v: boolean | undefined) => void;
  minRating: number;
  setMinRating: (v: number) => void;
}

export const FoodFilters: React.FC<FoodFiltersProps> = ({
  isVegetarian,
  setIsVegetarian,
  minRating,
  setMinRating,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8 mb-6">
      {/* Veg/Non-Veg Filter */}
      <div className="flex gap-2 items-center">
        <span className="font-medium text-foreground">{t('type')}:</span>
        <button
          className={`px-3 py-1 rounded-lg border ${isVegetarian === undefined ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
          onClick={() => setIsVegetarian(undefined)}
        >
          {t('all')}
        </button>
        <button
          className={`px-3 py-1 rounded-lg border ${isVegetarian === true ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
          onClick={() => setIsVegetarian(true)}
        >
          {t('veg')}
        </button>
        <button
          className={`px-3 py-1 rounded-lg border ${isVegetarian === false ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
          onClick={() => setIsVegetarian(false)}
        >
          {t('nonveg')}
        </button>
      </div>
      {/* Rating Filter */}
      <div className="flex gap-2 items-center">
        <span className="font-medium text-foreground">{t('minRating')}:</span>
        <input
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={minRating}
          onChange={e => setMinRating(Number(e.target.value))}
          className="w-32 accent-primary"
        />
        <span className="ml-2 text-foreground font-semibold">{minRating.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default FoodFilters;
