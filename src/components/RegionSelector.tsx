import React from 'react';

interface RegionSelectorProps {
  regions: string[];
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ regions, selectedRegion, onRegionChange }) => {
  return (
    <div className="mb-6 flex items-center gap-3">
      <label htmlFor="region-select" className="font-semibold text-gray-700">Select Region:</label>
      <select
        id="region-select"
        value={selectedRegion}
        onChange={e => onRegionChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {regions.map(region => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>
    </div>
  );
};

export default RegionSelector;
