
import React, { useState } from 'react';
import { Calendar, Check, Filter, SortDesc, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from '@/utils/transactionState';

interface TransactionFiltersProps {
  onApplyFilters: (filters: FilterState) => void;
}

interface FilterState {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  amountRange: [number, number];
  status: TransactionStatus | 'all';
  sortBy: 'newest' | 'oldest' | 'amount-high' | 'amount-low';
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: undefined, to: undefined },
    amountRange: [0, 100000],
    status: 'all',
    sortBy: 'newest',
  });
  
  const handleDateSelect = (range: any) => {
    setFilters({
      ...filters,
      dateRange: range,
    });
    
    if (range.from && range.to) {
      updateActiveFilters('date');
    } else {
      removeActiveFilter('date');
    }
  };
  
  const handleAmountChange = (value: number[]) => {
    setFilters({
      ...filters,
      amountRange: [value[0], value[1]],
    });
    updateActiveFilters('amount');
  };
  
  const handleStatusChange = (status: TransactionStatus | 'all') => {
    setFilters({
      ...filters,
      status,
    });
    
    if (status !== 'all') {
      updateActiveFilters('status');
    } else {
      removeActiveFilter('status');
    }
  };
  
  const handleSortChange = (sortBy: 'newest' | 'oldest' | 'amount-high' | 'amount-low') => {
    setFilters({
      ...filters,
      sortBy,
    });
    updateActiveFilters('sort');
  };
  
  const updateActiveFilters = (filterType: string) => {
    if (!activeFilters.includes(filterType)) {
      setActiveFilters([...activeFilters, filterType]);
    }
  };
  
  const removeActiveFilter = (filterType: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filterType));
  };
  
  const clearAllFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      amountRange: [0, 100000],
      status: 'all',
      sortBy: 'newest',
    });
    setActiveFilters([]);
  };
  
  const applyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 relative"
            >
              <Filter size={14} />
              Filters
              {activeFilters.length > 0 && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center ml-1 bg-bharose-primary">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-xs text-muted-foreground"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              </div>
              
              <Separator className="my-3" />
              
              <div className="space-y-4">
                {/* Date Range Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Date Range</h4>
                  <CalendarComponent
                    mode="range"
                    selected={filters.dateRange}
                    onSelect={handleDateSelect}
                    className="border rounded-md p-2"
                  />
                </div>
                
                <Separator />
                
                {/* Amount Range Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Amount Range</h4>
                    <span className="text-xs text-muted-foreground">
                      ₹{filters.amountRange[0].toLocaleString()} - ₹{filters.amountRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 100000]}
                    max={100000}
                    step={1000}
                    value={[filters.amountRange[0], filters.amountRange[1]]} 
                    onValueChange={handleAmountChange}
                    className="py-4"
                  />
                </div>
                
                <Separator />
                
                {/* Status Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'in-progress', 'completed', 'disputed'].map((status) => (
                      <Badge
                        key={status}
                        variant={filters.status === status ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.status === status 
                            ? 'bg-bharose-primary' 
                            : 'bg-transparent text-foreground'
                        }`}
                        onClick={() => handleStatusChange(status as TransactionStatus | 'all')}
                      >
                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Sorting */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Sort By</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'newest', label: 'Newest First' },
                      { value: 'oldest', label: 'Oldest First' },
                      { value: 'amount-high', label: 'Amount: High to Low' },
                      { value: 'amount-low', label: 'Amount: Low to High' }
                    ].map((sort) => (
                      <Button
                        key={sort.value}
                        variant="outline"
                        size="sm"
                        className={`justify-start text-xs h-auto py-2 ${
                          filters.sortBy === sort.value ? 'bg-accent border-bharose-primary' : ''
                        }`}
                        onClick={() => handleSortChange(sort.value as any)}
                      >
                        {filters.sortBy === sort.value && <Check size={12} className="mr-1" />}
                        {sort.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-bharose-primary hover:bg-bharose-dark"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {activeFilters.includes('date') && (
              <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                <Calendar size={12} />
                Date Range
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => {
                    setFilters({...filters, dateRange: {from: undefined, to: undefined}});
                    removeActiveFilter('date');
                  }}
                >
                  <X size={10} />
                </Button>
              </Badge>
            )}
            
            {activeFilters.includes('amount') && (
              <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                Amount: ₹{filters.amountRange[0]/1000}k-₹{filters.amountRange[1]/1000}k
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => {
                    setFilters({...filters, amountRange: [0, 100000]});
                    removeActiveFilter('amount');
                  }}
                >
                  <X size={10} />
                </Button>
              </Badge>
            )}
            
            {activeFilters.includes('status') && (
              <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                Status: {filters.status}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => {
                    setFilters({...filters, status: 'all'});
                    removeActiveFilter('status');
                  }}
                >
                  <X size={10} />
                </Button>
              </Badge>
            )}
            
            {activeFilters.includes('sort') && (
              <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                <SortDesc size={12} />
                Sorted
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => {
                    setFilters({...filters, sortBy: 'newest'});
                    removeActiveFilter('sort');
                  }}
                >
                  <X size={10} />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
