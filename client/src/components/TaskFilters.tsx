import { Button } from "@/components/ui/button";

interface TaskFiltersProps {
  currentFilter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
}

export default function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  const filters = [
    { key: 'all' as const, label: 'All Tasks' },
    { key: 'pending' as const, label: 'Pending' },
    { key: 'completed' as const, label: 'Completed' },
  ];

  return (
    <div className="mb-6">
      <div className="flex space-x-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={currentFilter === filter.key ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentFilter === filter.key
                ? 'bg-primary text-white hover:bg-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => onFilterChange(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
