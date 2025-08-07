/* yashpanwar1408/food-website/food-website-dfe3d219bbbd4abfce9f29fc60afeda7ab3ecb14/src/components/RegionSelector.tsx */
import React from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface RegionSelectorProps {
  regions: string[];
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ regions, selectedRegion, onRegionChange }) => {
  return (
    <div className="mb-6 flex items-center gap-3">
      <label htmlFor="region-select" className="font-semibold text-foreground">Select Region:</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {selectedRegion}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {regions.map(region => (
            <DropdownMenuItem
              key={region}
              onSelect={() => onRegionChange(region)}
            >
              {region}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RegionSelector;