import { inputClass } from '@/components/ui';
import { cn } from '@/utils/cn';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

export default function FilterDropdown({
  value,
  onChange,
  options,
  placeholder = 'Filter...',
  className,
}: FilterDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputClass(), className)}
      data-icod-id="src_components_filterdropdown_tsx_7602">
      <option value="" data-icod-id="src_components_filterdropdown_tsx_44cc">{placeholder}</option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          data-icod-id={`src_components_filterdropdown_tsx_5eeb_${option.value}`}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
